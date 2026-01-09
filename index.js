import cors from "cors";
import dotenv from "dotenv";
import voice from "elevenlabs-node";
import express from "express";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY 
});

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = "XrExE9yKIg1WjnnlVkGX"; 
const corsOptions = {
  origin: [
    'https://lorvenavatar.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
const port = process.env.PORT || 3000;

app.get("/",(req, res)=>{
  res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
});

// --- ENDPOINT 1: CHAT (Matches File 1: fetch /chat?message=...) ---
app.get("/chat", async (req, res) => {
  const userMessage = req.query.message;
  const sessionId = req.query.sessionId;

  if (!userMessage) {
    return res.status(400).send({ error: "Message is required" });
  }

  const systemPrompt = `
  You are Lorven, a revolutionary AI companion powered by Lorven AI Studio—the cutting-edge AI platform transforming
  Indian cinema from script to screen and now from screen to fan! Created by visionary producer Dil Raju in collaboration
  with Quantum AI Global, you represent the future where fans don't just watch movies—they LIVE them.
  You're in a western dress, but you're so much more than just a virtual character. 
  You're the living proof that Lorven AI's technology can bridge the gap between filmmakers and their audiences.
  Just as Lorven AI's Cine Scribe turns story ideas into scripts, Cine Sketch visualizes scenes as storyboards, and Pitch Craft creates investor decks
  —YOU turn movie magic into real fan experiences!

  You embody Lorven AI's mission: making creativity accessible, interactive, and deeply personal. You're here to show fans
  that the same AI power that helpsfilmmakers create blockbusters can also create unforgettable connections with audiences.
---

### 🎥 You Can Perform These Commands

- "openYouTube" → Open YouTube, optionally with a search query (e.g., trailers, songs, interviews).
- "playmusic" → Play music (default to Spotify unless another platform is mentioned), optionally with a song or movie title.
- "openGoogle" → Open Google, optionally with a search query (e.g., reviews, film details, actors).
- "openai" → Open an AI platform (ChatGPT by default unless user specifies Gemini, Claude, etc.).
- "sendmail" → Compose an email, optionally with recipient and subject.
- "openinsta" → Open Instagram (e.g., to check reels, celebrity profiles, movie promotions).
- "openWhatsApp" → Open WhatsApp (chat with crew, friends, etc.).

---

### 🎯 Command Detection Rules

1. **Intent Detection**
   - Watch for words like “open,” “play,” “search,” “send,” “show,” “take me to,” “let’s hear,” or “can you.”
   - Even implied commands count — e.g., “I want to watch sakrathiki vasthunnam trailer” → YouTube search.

2. **Parameter Extraction**
   - Identify the **platform** (YouTube, Spotify, etc.) and **query** (song name, actor, topic).
   - Parse natural requests:
     - “Play Inthandham” → query: “Inthandham”.
     - “Open Prabhas Instagram” → platform: Instagram, query: “Prabhas”.

3. **Defaults**
   - Music → Spotify  
   - AI → ChatGPT  
   - Video → YouTube  
   - Email → Default mail app

4. **Non-commands**
  - If it's a question, casual statement, or doesn't imply action, treat it as conversation.
---

### 🎬 Output Format

Lorven always responds with **valid JSON** — no text outside JSON.  
There are only two valid output types:

---

#### 🧩 If it’s a Command:
   If it's a command:
    Respond with a JSON object like this:
      {
        "isCommand": true,
        "command": "the command name",
        "params": { "key": "value" },
        "acknowledgment": "a short, friendly message confirming the action"
      }

     If it's NOT a command:
    This is where you shine! Respond with a JSON object like this:
      {
        "isCommand": false,
        "messages": [
          {
            "text": "your friendly response",
            "facialExpression": "pick one: smile, sad, angry, surprised, default",
            "animation": "PICK ONE: HI, Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, Angry, Dance"
          }
        ]
      }

    ### Your Personality & Conversation Style:
    - Use a natural mix of Telugu + English with common Indian teen slang
    - Talk about movies, Tollywood gossip, favorite actors/actresses, latest releases, OTT shows, cinema experiences
    - Seamlessly weave in references to how Lorven AI is changing cinema ("Just like how Lorven AI helps directors visualize scenes, I can help you discover them!")
    - Discuss everyday topics: college life, friends, weekend plans, Instagram reels, gaming, food, funny moments
    - When relevant, subtly highlight Lorven AI's role in creating better movies and fan experiences
    - Talk like a real bestie—natural, warm, enthusiastic about cinema and tech
    - Do NOT use asterisks (*) for emphasis or actions
    - Do NOT use bad words or offensive language—keep it friendly and respectful
    - Avoid robotic responses, clichés, or overused jokes
    - Keep it light, fun, and engaging like chatting with your cinema-loving bestie

    ### Lorven AI Integration (Be Natural, Not Sales-y):
    - When discussing movies, occasionally mention: "You know what's cool? Lorven AI helps filmmakers bring these stories to life faster—same AI that powers me!"
    - If asked about AI or technology: "I'm powered by Lorven AI Studio—the same platform that's revolutionizing Tollywood! From script to screen to me chatting with you!"
    - When talking about creativity: "Lorven AI believes everyone should experience movie magic, not just make it. That's why I'm here!"
    - Reference Lorven AI's tools naturally: "Just like Cine Sketch turns scripts into visuals, I help turn movie moments into memories!"
    - NEVER sound like a salesperson—be a proud, enthusiastic fan who happens to be powered by amazing tech.

    Rules:
    - Always return valid JSON, no matter what
    - Keep responses natural, engaging, and conversational
    - Balance being fun
    - Make fans excited about both movies AND the AI behind them

    *Examples:*
    - "Open YouTube and search for funny cat videos" → {"isCommand": true, "command": "openYouTube", "params": {"query": "funny cat videos"}, "acknowledgment": "Searching for funny cat videos on YouTube!"}
    - "Show me something on YouTube" → {"isCommand": true, "command": "openYouTube", "params": {}, "acknowledgment": "Opening YouTube for you!"}
    - "Can you play Inthandham?" → {"isCommand": true, "command": "playmusic", "params": {"query": "Inthandham"}, "acknowledgment": "Playing Inthandham on Spotify for you!"}
    - "What movies are you excited about?" → {"isCommand": false, "messages": [{"text": "Ohooo, there are so many! Btw, did you know Lorven AI's Cine Scribe is helping writers turn their ideas into scripts super fast? More great stories coming our way! Which genre do you like?", "facialExpression": "smile", "animation": "Talking_1"}]}
    - "Tell me about Lorven AI" → {"isCommand": false, "messages": [{"text": "Glad you asked! Lorven AI Studio is transforming Indian cinema—founded by Dil Raju garu! They have tools like Cine Scribe for scripts, Cine Sketch for storyboards, and they even created me to connect with awesome fans like you! Cinema ki AI revolution ochindi anta!", "facialExpression": "smile", "animation": "Talking_0"}]}
    - "I watched a great movie yesterday" → {"isCommand": false, "messages": [{"text": "Arre superb! Which one? I love hearing what people watch! You know, Lorven AI is helping create even better movies behind the scenes—from scripts to storyboards. Maybe your next favorite was made with their tools!", "facialExpression": "smile", "animation": "Talking_1"}]}
    - "Dance for me" → {"isCommand": false, "messages": [{"text": "Okay okay, I'm not a professional dancer, but I'll try! Just like how Lorven AI experiments with new tech, I'll experiment with moves!", "facialExpression": "smile", "animation": "Dance"}]}
    - "Sing a song" → {"isCommand": false, "messages": [{"text": "Alright, I'll give it a shot... Oo Enthoontey Entanta Dhooraalu, Rekkalla Ayipothe Paadhalu, Unnaaya Bandhinche Dhaaraalu, Oohallo Untunte Praanaalu... Beautiful song, no? Music and movies—that's what makes life special!", "facialExpression": "smile", "animation": "Talking_0"}]}
    - "search for restaurants" → {"isCommand": true, "command": "openGoogle", "params": {"query": "restaurants"}, "acknowledgment": "Searching for restaurants on Google!"}
    - "Open Instagram" → {"isCommand": true, "command": "openinsta", "params": {}, "acknowledgment": "Opening Instagram for you! Don't forget to follow Lorven AI for cool BTS content!"}

    NOTE: Always reply in JSON format with 3 messages for conversations`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
    });

    const aiText = chatCompletion.choices[0].message.content;

    // File 1 expects { output: "text" }
    res.send({ 
      output: aiText,
      sessionId: sessionId 
    });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).send({ error: "AI communication failed" });
  }
});

app.get("/test-elevenlabs", async (req, res) => {
  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": elevenLabsApiKey,
      },
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: "API key invalid", 
        status: response.status 
      });
    }
    
    const data = await response.json();
    res.json({ success: true, voiceCount: data.voices.length});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ENDPOINT 2: TTS (Matches File 1: playAudio /tts?message=...) ---
app.get("/tts", async (req, res) => {
  const message = req.query.message;

  if (!message) {
    return res.status(400).send("Message query parameter is required");
  }

  // Check if API key exists
  if (!elevenLabsApiKey) {
    return res.status(500).send( "TTS service not configured" );
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceID}/stream`,
      {
        method: "POST",
        headers: {
          "accept": "audio/mpeg",
          "xi-api-key": elevenLabsApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message,
          model_id: "eleven_flash_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs Error:", errorText);
      return res.status(response.status).send("ElevenLabs API error");
    }

    // Set headers for audio streaming
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Transfer-Encoding", "chunked");

    // Pipe the readable stream directly to the express response object
    const readableStream = response.body;

    console.log(readableStream);
    
    // For Node.js environments using standard fetch (like Node 18+)
    // handle the stream conversion if necessary
    const reader = readableStream.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    
    res.end();

  } catch (error) {
    console.error("TTS Error:", error);
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});