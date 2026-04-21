import { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone, FileData } from './components/UploadZone';
import { ResultsDashboard } from './components/ResultsDashboard';
import { analyzeDrama, AnalysisResult, AnalyzeStatus } from './services/geminiService';
import { Loader2, Sparkles, Link as LinkIcon } from 'lucide-react';

export default function App() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [textInput, setTextInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzeStatus, setAnalyzeStatus] = useState<AnalyzeStatus>(null);

  const handleAnalyze = async () => {
    const rawLinks = linkInput.split(/[\s\n,]+/).map(l => l.trim()).filter(l => l.length > 0);
    if (files.length === 0 && !textInput.trim() && rawLinks.length === 0) {
      setError('请至少提供一些文本、截图或涉事链接进行分析。');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    setAnalyzeStatus('new');

    try {
      const res = await analyzeDrama(
        textInput,
        files.map(f => ({ data: f.base64, mimeType: f.file.type })),
        rawLinks,
        (status) => setAnalyzeStatus(status)
      );
      setResult(res);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '分析过程中发生错误。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 space-y-12">
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
              在纷乱中寻找<span className="text-cheese-500">客观真相</span>
            </h2>
            <p className="text-lg text-stone-500 font-medium pb-4">
              上传聊天记录、截图、涉事链接，或粘贴“小作文”，获取AI驱动的逻辑与事实分析。
            </p>
          </div>

          <UploadZone
            files={files}
            onFilesChange={setFiles}
            textInput={textInput}
            onTextInputChange={setTextInput}
          />
          
          {/* Link Input Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center space-x-2 mb-2">
              <LinkIcon className="w-4 h-4 text-stone-500" />
              <label className="block text-sm font-semibold text-stone-700">
                涉事链接 (QQ空间、帖子链接等)
              </label>
            </div>
            <p className="text-xs text-stone-400 mb-3">
              提供相关事件的链接作为“证据坐标”。当不同人提交含有相同链接瓜条时，系统能更精准地将他们送入同一法庭合并审理。
            </p>
            <textarea
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="https://... (支持填写多条链接，使用换行或空格分隔)"
              className="w-full min-h-[80px] p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-cheese-400 focus:border-cheese-400 outline-none resize-y transition-all text-sm font-mono"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {result && analyzeStatus === 'duplicate' && (
             <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm font-medium flex items-center mb-4">
               <span className="mr-2 text-lg">✅</span>
               发现重复提交的内容（资料均未改变），已直接为您调取历史仲裁结果，免去重复扣费！
             </div>
          )}

          <div className="flex justify-center pt-6">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || (files.length === 0 && !textInput.trim())}
              className={`
                relative flex items-center justify-center space-x-2 
                w-full md:w-auto px-8 py-4 
                bg-cheese-500 hover:bg-cheese-600 active:bg-cheese-600
                text-stone-900 font-bold text-lg rounded-2xl shadow-lg shadow-cheese-500/30
                transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed
                overflow-hidden group
              `}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="relative z-10">
                    {analyzeStatus === 'supplement' ? '补充分析中...' : '仲裁中...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">开始客观分析</span>
                </>
              )}
            </button>
          </div>
        </section>

        {isLoading && analyzeStatus !== 'duplicate' && (
          <div className="py-20 flex flex-col items-center justify-center space-y-6 text-stone-400">
            <div className="relative">
              <div className="absolute inset-0 bg-cheese-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="w-16 h-16 bg-cheese-100 rounded-2xl border-4 border-cheese-400 border-t-cheese-500 animate-spin shadow-lg"></div>
            </div>
            <p className="font-medium animate-pulse text-stone-500 text-center max-w-sm">
              {analyzeStatus === 'supplement' 
                ? '🔍 识别为补充证据（文本相同但有了新的截图）！\n正在结合前情提要继续推演漏洞...' 
                : '正在核实证据并剖析讲述者的诱导修辞与逻辑谬误...'}
            </p>
          </div>
        )}

        {!isLoading && result && (
          <section className="pt-8 border-t border-stone-200">
            <ResultsDashboard result={result} />
          </section>
        )}
      </main>
    </div>
  );
}
