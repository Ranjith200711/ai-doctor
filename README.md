# 🩺 AI Doctor — Virtual Healthcare Assistant & Prescription Analyzer

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Powered_by-Google_Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Netlify Status](https://img.shields.io/badge/Deployed_on-Netlify-00C7B7?style=for-the-badge&logo=netlify)](https://ai-doctorr.netlify.app)

> **AI Doctor** is a modern, responsive full-stack healthcare web application built with **Next.js 15**, **TypeScript**, and **Google Gemini AI**. It provides conversational symptom analysis, Over-The-Counter (OTC) medication recommendations, multimodal prescription image analysis, and clinical safety guardrails.

---

## 🌟 Key Features

- 💬 **Interactive Medical Consultation:** Empathetic, conversational symptom analysis with structured guidance on potential conditions and home remedies.
- 📸 **Vision-Powered Prescription Analyzer:** Upload photos or scans of prescriptions to extract medications, dosages, frequencies, and safety precautions.
- 🛡️ **Clinical Safety & Contraindication Guardrails:**
  - Evaluates pre-existing conditions (e.g., automatically warns against ibuprofen if the user has stomach ulcers).
  - Triage awareness for red-flag emergency symptoms (chest pain, severe shortness of breath).
  - Refuses non-medical queries to maintain professional clinical scope.
- ⚡ **Resilient Multi-Model Architecture:** Automatically falls back across multiple Gemini models (`gemini-flash-lite-latest`, `gemini-3.1-flash-lite`, `gemini-3.8-flash`) to ensure high uptime and avoid high-traffic errors.
- 🌓 **Modern UI / UX:** Dark and light theme modes, mobile-friendly collapsible sidebar, and animations powered by **Framer Motion** and **shadcn/ui**.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), Lucide Icons
- **AI & Multimodal:** [Google Generative AI SDK (`@google/generative-ai`)](https://www.npmjs.com/package/@google/generative-ai), [Vercel AI SDK](https://sdk.vercel.ai/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Markdown Rendering:** `react-markdown`, `remark-gfm`
- **Deployment:** [Netlify](https://www.netlify.com/)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 18.18 or higher; Node 20+ recommended)
- `npm` or `pnpm`
- A [Google AI Studio API Key](https://aistudio.google.com/)

---

### 2. Clone the Repository
```bash
git clone https://github.com/Ranjith200711/ai-doctor.git
cd ai-doctor
```

---

### 3. Install Dependencies
```bash
npm install
```

---

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
```

> 💡 **Tip:** Obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).

---

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

### 6. Build for Production
```bash
npm run build
npm run start
```

---

## 🌐 Deploying to Netlify

This project is pre-configured for seamless deployment on Netlify using [`netlify.toml`](./netlify.toml).

1. Push your code to GitHub.
2. Link your repository in the [Netlify Dashboard](https://app.netlify.com/).
3. Add your Environment Variable:
   - Go to **Site configuration** → **Environment variables**
   - Key: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key`
4. Click **Deploy**. Netlify will automatically build the Next.js application using Node 20.

---

## 📁 Project Structure

```text
ai-doctor/
├── app/
│   ├── api/
│   │   ├── chat/                  # AI Doctor chat streaming API route
│   │   └── prescription-analyze/  # Multimodal prescription analysis route
│   ├── globals.css                # Global stylesheet & design tokens
│   ├── layout.tsx                 # Root layout & providers
│   └── page.tsx                   # Main page
├── components/
│   ├── ui/                        # Reusable shadcn/ui components
│   ├── chat-interface.tsx         # Main interactive chat & consultation panel
│   ├── chat-message.tsx           # Formatted message item with markdown support
│   ├── image-upload.tsx           # Drag-and-drop prescription uploader
│   ├── theme-toggle.tsx           # Light/dark mode toggle button
│   └── conversation-list.tsx      # Sidebar conversation history
├── lib/
│   └── utils.ts                   # Utility functions & class merger
├── netlify.toml                   # Netlify build & runtime configuration
├── package.json                   # Dependencies and scripts
└── tsconfig.json                  # TypeScript configuration
```

---

## ⚠️ Medical Disclaimer

> **Important:** This project is intended for informational and educational purposes only. It is **not** a licensed medical device and does **not** provide formal medical diagnoses or prescriptions. Always consult a qualified healthcare professional or seek immediate emergency care for acute or life-threatening symptoms.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
