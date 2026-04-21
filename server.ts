import express from 'express';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';
import * as path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '100mb' }));

  function md5(str: string) {
    return crypto.createHash("md5").update(str).digest("hex");
  }

  function normalizeText(str: string) {
    return (str || "").replace(/[^\p{L}\p{N}]/gu, '');
  }

  function calculateEntityOverlap(entA: string, entB: string) {
    if (!entA || !entB) return 0;
    const tokensA = new Set(entA.toLowerCase().split(/[\s,，、]+/).filter(t => t.length > 1));
    const tokensB = new Set(entB.toLowerCase().split(/[\s,，、]+/).filter(t => t.length > 1));
    if (tokensA.size === 0 || tokensB.size === 0) return 0;
    
    let intersection = 0;
    for (const token of tokensA) {
      if (tokensB.has(token)) intersection++;
    }
    // Using Overlap Coefficient rather than Jaccard Index. 
    // This allows a pure-text claim (e.g. 2 tokens) to perfect-match a rich-image entity pool (10 tokens).
    return intersection / Math.min(tokensA.size, tokensB.size);
  }

  // In-memory cache
  const cases: { id: string; textHash: string; imageHashStr: string; result: any; relatedCaseId?: string; entities?: string; links?: string[] }[] = [];

  app.post('/api/check', (req, res) => {
    const { textInput, images, entities, links } = req.body;
    
    // Normalize and hash smartly
    const normalizedText = normalizeText(textInput);
    const textHash = md5(normalizedText);
    const imageHashes = images.map((img: any) => md5(img.data)).sort();
    const imageHashStr = imageHashes.join(",");
    const incomingLinks: string[] = Array.isArray(links) ? links : [];
    const linkHashStr = [...incomingLinks].sort().join(",");
    const combinedHash = md5(textHash + imageHashStr + linkHashStr);

    // Check for exact duplicate 
    const existingExact = cases.find((c) => c.textHash === textHash && c.imageHashStr === imageHashStr && (([...(c.links || [])]).sort().join(",") === linkHashStr));
    if (existingExact) {
      return res.json({ status: "duplicate", result: existingExact.result });
    }

    // Check for supplement: identical text AND identical links, but perhaps different images
    if (normalizedText.length > 0) {
      const existingText = cases.find((c) => c.textHash === textHash && (([...(c.links || [])]).sort().join(",") === linkHashStr));
      if (existingText) {
        return res.json({ status: "supplement", oldResult: existingText.result, caseId: existingText.id });
      }
    }
    
    // Provide context via entity similarity AND exact link matching
    const candidateCases: Map<string, { id: string, result: any, score: number }> = new Map();

    if (entities && typeof entities === 'string') {
      cases.forEach(c => {
        if (c.entities && typeof c.entities === 'string') {
          const score = calculateEntityOverlap(entities, c.entities);
          if (score >= 0.40) { // 0.40 overlap is robust since it's the subset coefficient
            candidateCases.set(c.id, { id: c.id, result: c.result, score });
          }
        }
      });
    }

    if (incomingLinks.length > 0) {
      cases.forEach(c => {
        const cLinks = c.links || [];
        const hasOverlap = incomingLinks.some(l => cLinks.includes(l));
        if (hasOverlap) {
          // Priority match for shared links
          candidateCases.set(c.id, { id: c.id, result: c.result, score: 2.0 });
        }
      });
    }

    const scoredCases = Array.from(candidateCases.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
      
    const recentCases = scoredCases.map(c => ({ id: c.id, result: c.result }));
    
    res.json({ status: "new", recentCases, caseId: combinedHash });
  });

  app.post('/api/cache', (req, res) => {
    const { textInput, images, result, relatedCaseId, entities, links } = req.body;
    const normalizedText = normalizeText(textInput);
    const textHash = md5(normalizedText);
    const imageHashes = images.map((img: any) => md5(img.data)).sort();
    const imageHashStr = imageHashes.join(",");
    const incomingLinks: string[] = Array.isArray(links) ? links : [];
    const linkHashStr = [...incomingLinks].sort().join(",");
    const combinedHash = md5(textHash + imageHashStr + linkHashStr);

    if (relatedCaseId) {
       cases.forEach(c => {
         if (c.id === relatedCaseId || c.relatedCaseId === relatedCaseId) {
           c.result = result;
           // optionally merge links to parent? (skipping to keep simple)
         }
       });
       cases.push({ id: combinedHash, textHash, imageHashStr, result, relatedCaseId: relatedCaseId, entities, links: incomingLinks });
    } else {
      if (!cases.find((c) => c.textHash === textHash && c.imageHashStr === imageHashStr && (([...(c.links || [])]).sort().join(",") === linkHashStr))) {
        cases.push({ id: combinedHash, textHash, imageHashStr, result, entities, links: incomingLinks });
      }
    }
    res.json({ success: true });
  });

  app.get('/api/env-test', (req, res) => {
    res.json({
      processEnvGemini: process.env.GEMINI_API_KEY,
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

