# 吃瓜仲裁器 (Internet Drama Arbiter)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/80a5b464-342e-4960-85ad-b5854eb4be10


**吃瓜仲裁器** 是一款基于 Google Gemini 多模态大语言模型（Multimodal LLM）的去中心化“赛博法庭”应用。它可以接受聊天记录截图、小作文（长文本）和涉事链接，运用极其纯粹的客观审视原则，帮助互联网用户剥离情绪、透视逻辑谬误，并在跨越多个视角的纷繁乱局中寻找客观真相。

由 **ChizuKuo** 开发与维护。

## ✨ 核心特性

- **多模态取证剖析 (Multi-Modal Evidence Analysis)**
  一次性支持上传“长文本（小作文）” + “聊天记录截图” + “涉事原帖链接”。AI 会仔细比对文本主张与图片证据之间的落差，绝不轻信单方面说辞。
- **高维实体降维打通 (Cross-Perspective Case Merging)**
  即使多位卷入纷争的用户在**不同时间、截然不同的行文视角**下提交了只言片语，只要其提及的核心实体（QQ号、网名、关键日期）或涉事链接产生高度重叠（基于后台运算的 Overlap Coefficient），系统即可将案件无缝合并。以“上帝视角”综合复审双边说辞。
- **防提示词注入 (Anti-Prompt Injection)**
  所有用户输入均采用沙盒隔离机制（`<user_untrusted_input>` 标签锁定），极大程度杜绝了利用黑客手段对模型进行“身份篡改”、“忽略原有指令”、“偏袒特定方”的洗脑攻击。
- **纯粹的客观责任评议 (Objective Responsibility Allocation)**
  系统化判定事件时间线、指出每一个发帖者的“叙说策略与逻辑谬误（如煽动情绪、偷换概念、筛选截取等）”，并在结案时基于**确凿证据**，以百分制精细划分各方的责任比例。系统会在后续单侧更新时，直接继承历史被验证通过的截图效力。

## 🛠️ 技术栈

- **前端界面 (Frontend):** React (18+) + Vite + Tailwind CSS + Lucide React
- **后端服务 (Backend):** Node.js + Express (内置极简的实时内存数据库及状态合并代理)
- **人工智能核心 (AI Core):** `@google/genai` (基于 `gemini-3-flash-preview` 提供的 OCR 提纯与逻辑推理引擎)

## 🚀 快速开始

本项目依赖于 Node 环境及 npm 包管理器。

**1. 克隆项目兵安装依赖：**
```bash
npm install
```

**2. 配置环境密钥：**
根目录下创建一个 `.env` 文件（或进入项目设置），并配置你申请到的 Gemini API 密钥。不要暴露在客户端，请求经过后端的安全处理：
```env
GEMINI_API_KEY=你的真实_API_KEY_在这里
```

**3. 运行服务：**
```bash
npm run dev
```
之后你可以在浏览器中访问 `http://localhost:3000` 进入赛博法庭界面。

## ⚖️ 责任申明 (Disclaimer)

本应用通过 AI 提供的分析和责任划分结果**仅供参考**。它不能替代现实生活中的法律法规建议或警方法律制裁。作为一个娱乐与逻辑研判相结合的辅助工具，其主旨为倡导网民在面对喧嚣纠纷时多一分理性，少一分无脑站队。

## 📄 开源许可证协议

基于 [MIT License](./LICENSE) 协议开源。
Copyright (c) 2026 **ChizuKuo**
