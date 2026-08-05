# 🧠 VIBE 2.0 — Backend

The backend service for **VIBE**, an emotion-aware 3D AI companion. This service handles LLM-driven conversation, converts responses to speech, and generates lip-sync data so the frontend avatar can talk in real time.

---

## ✨ What it does

1. Receives a user message from the frontend chat UI
2. Routes it to an LLM (Groq / OpenAI / Google Gemini) for a context-aware response
3. Converts the response to speech using ElevenLabs TTS
4. Generates viseme/lip-sync timing data alongside the audio
5. Returns audio + lip-sync JSON + text back to the frontend, which animates the 3D avatar in sync

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Server | Express |
| LLM Providers | Groq SDK, OpenAI SDK, Google Generative AI (Gemini) |
| Text-to-Speech | ElevenLabs |
| Session Handling | express-session |
| Dev Tooling | nodemon |

---

## 📁 Project Structure

```
VIBE-2.0-Backend/
├── index.js          # Express server & route handlers
├── audios/           # Pre-generated / cached response audio + viseme JSON
├── package.json
└── .env              # API keys (not committed)
```

---

## ⚙️ Setup

### Prerequisites
- Node.js 18+
- API keys for at least one LLM provider (Groq, OpenAI, or Gemini) and ElevenLabs

### Installation
```bash
git clone <repo-url>
cd VIBE-2.0-Backend
npm install
```

### Environment Variables
Create a `.env` file in the root:
```env
GROQ_API_KEY=your_groq_key
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
ELEVEN_LABS_API_KEY=your_elevenlabs_key
ELEVEN_LABS_VOICE_ID=your_voice_id
PORT=3000
```

### Run
```bash
npm run dev     # with nodemon (hot reload)
npm start       # production
```

Server runs on `http://localhost:3000` by default.

---

## 🔌 API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/chat` | POST | Send a user message, receive LLM response + audio + lip-sync data |
| `/voices` | GET | List available ElevenLabs voices *(if implemented)* |

> Update this table with your actual routes and request/response shapes once finalized — this is inferred from the dependency set, not a live route scan.

---

## 🎯 Roadmap
- [ ] Add streaming responses instead of full-response-then-audio
- [ ] Add conversation memory/history persistence (currently session-based)
- [ ] Rate limiting / cost guardrails on LLM + TTS calls

---

## 🙏 Credits

Built on top of the AI companion backend pattern from **[Wawa Sensei](https://wawasensei.dev)**'s React Three Fiber course. Conversation logic, provider integrations, and features beyond the base tutorial are original.

## 📄 License
MIT (or update to match your actual license)
