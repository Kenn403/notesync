# ◈ NoteSync for Accessibility

> **An AI-powered lecture companion** that transcribes audio in real time, syncs spoken content to slides, and generates study materials — built for students with disabilities who rely on note-taking support services.

![Status](https://img.shields.io/badge/status-MVP%20Prototype-C8A96E?style=flat-square)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20Node.js%20%7C%20Deepgram%20%7C%20Claude%20AI-blue?style=flat-square)
![Domain](https://img.shields.io/badge/domain-EdTech%20%B7%20Accessibility-5aba5a?style=flat-square)

---

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Live Demo & Portfolio](#live-demo--portfolio)
- [File Structure](#file-structure)
- [Core Features](#core-features)
- [User Stories](#user-stories)
- [Tech Stack & Decision Log](#tech-stack--decision-log)
- [System Architecture](#system-architecture)
- [Key API Integrations](#key-api-integrations)
- [Product Roadmap](#product-roadmap)
- [Design System](#design-system)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Key Design Decisions](#key-design-decisions)
- [Success Metrics](#success-metrics)
- [Compliance & Privacy](#compliance--privacy)
- [Author](#author)

---

## The Problem

Universities hire volunteer note-takers to serve students with disabilities (ADHD, hearing impairments, processing disorders). The system is fragile:

- **Delayed delivery** — notes arrive hours after class, breaking the learning loop
- **Inconsistent quality** — every note-taker has different speed, comprehension, and habits
- **No context** — notes are disconnected from slides; students can't trace which moment a note came from
- **No student control** — the student is entirely dependent on a third party for their own understanding

**The real job-to-be-done:** *"Understand what happened in class, on my own terms, at my own pace."*

---

## The Solution

NoteSync replaces the note-taker workflow with an AI system the student controls directly:

1. Student uploads their lecture slides (PDF or PPT) before class
2. Hits record when the professor starts speaking
3. Taps to advance slides as the lecture progresses
4. After class: receives AI-generated summaries, key points, and flashcards — one set per slide
5. Reviews a synchronized transcript tied to each slide moment

---

## Live Demo & Portfolio

| Asset | Description |
|-------|-------------|
| `notesync-portfolio.html` | Full case study — problem, user stories, tech decisions, architecture, roadmap |
| `notesync-figma.jsx` | Advanced Figma-style interactive prototype (4 screens, annotations, component inspector) |
| `notesync.jsx` | Working React prototype with live transcription simulation |

> To view the portfolio case study, open `notesync-portfolio.html` in any browser or deploy it via GitHub Pages (see [Deployment](#deployment)).

---

## File Structure

```
notesync-portfolio/
│
├── README.md                    ← You are here
├── notesync-portfolio.html      ← Full case study document (self-contained HTML)
├── notesync-figma.jsx           ← Advanced interactive prototype (4 screens)
└── notesync.jsx                 ← Working app prototype (record + review flow)
```

For a full implementation, the recommended project structure is:

```
notesync/
│
├── client/                      ← React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── RecordView/      ← Audio capture + live transcript
│   │   │   ├── ReviewView/      ← Summary, transcript, flashcards tabs
│   │   │   ├── SlideRail/       ← Slide navigation panel
│   │   │   └── Dashboard/       ← Session library
│   │   ├── hooks/
│   │   │   ├── useAudioCapture.js
│   │   │   ├── useTranscription.js
│   │   │   └── useSlideSync.js
│   │   ├── lib/
│   │   │   ├── pdfParser.js     ← PDF.js integration
│   │   │   └── socket.js        ← Socket.io client
│   │   └── App.jsx
│   └── package.json
│
├── server/                      ← Node.js + Express backend
│   ├── routes/
│   │   ├── sessions.js          ← CRUD for recording sessions
│   │   ├── summarize.js         ← Claude API integration
│   │   └── auth.js              ← Auth0 middleware
│   ├── socket/
│   │   └── transcription.js     ← Deepgram WebSocket proxy
│   ├── prisma/
│   │   └── schema.prisma        ← Database schema
│   └── index.js
│
└── docker-compose.yml           ← Local dev (Postgres + Redis)
```

---

## Core Features

### MVP (Phase 1)

| Feature | Description | Status |
|---------|-------------|--------|
| 🎙 Live Transcription | Real-time speech-to-text via Deepgram WebSocket streaming | Prototype |
| 📎 Slide Upload | PDF/PPT upload with client-side rendering via PDF.js | Prototype |
| 🔗 Slide-Transcript Sync | Manual tap advances slide; timestamp recorded per transition | Prototype |
| ✦ AI Summaries | Per-slide summary generated via Claude after session ends | Prototype |
| ◧ Flashcard Generation | Q&A pairs extracted from transcript by Claude | Prototype |
| ⊞ Session Dashboard | Library of all lectures organized by course and date | Prototype |
| ⬇ PDF Export | Download complete annotated notes as PDF | Planned |

### Phase 2 (Institutional)

- University SSO via Auth0 SAML integration
- Canvas / Blackboard LMS course import
- AI chat: "Ask about this lecture moment"
- Multi-device sync (record on phone, review on laptop)
- Spaced repetition scheduling (SM-2 algorithm)

### Phase 3 (Scale)

- Automatic slide detection via computer vision
- Shared lecture libraries per course code
- Offline mode using on-device Whisper model
- Native iOS + Android apps
- FERPA-compliant institutional analytics

---

## User Stories

| ID | As a... | I want to... | So that... | Priority |
|----|---------|-------------|------------|----------|
| US-01 | Student with ADHD | Have live transcription during class | I can focus on listening without worrying about missing content | P1 |
| US-02 | Student with hearing impairment | See a synchronized text stream tied to each slide | I can follow along in real time without an interpreter | P1 |
| US-03 | Student reviewing before an exam | See AI-generated summaries per slide | I can quickly identify key concepts without re-reading the full transcript | P1 |
| US-04 | Student uploading lecture slides | Have them auto-matched to transcript timestamps | Every piece of content has spatial context | P2 |
| US-05 | Student studying independently | Get auto-generated flashcards from lecture content | I can prepare for exams without building study materials from scratch | P2 |
| US-06 | Student with slow processing speed | Ask an AI questions about any lecture moment | I can clarify without needing to attend extra office hours | P3 |
| US-07 | Student in multiple courses | Have a dashboard organized by course and date | I can navigate my lecture history easily | P3 |

---

## Tech Stack & Decision Log

Every technology was chosen deliberately. No defaults.

### Frontend

| Technology | Version | Why Chosen | Rejected Alternatives |
|-----------|---------|------------|----------------------|
| **React** | 18 | Component architecture maps cleanly to slide panel + transcript panel + tabs. Concurrent rendering handles live transcript updates without blocking UI. Largest accessibility tooling ecosystem (react-aria). | Vue 3 (smaller ecosystem), Svelte (less hiring pool), Next.js (overkill — this is a client-side app) |
| **Tailwind CSS** | 3 | Rapid design system iteration with consistent spacing/color tokens. Dark mode support out of the box. Eliminates CSS specificity issues in a component-heavy app. | CSS Modules (verbose), Styled Components (runtime overhead), plain CSS (no system constraints) |
| **PDF.js** | Latest | Renders slide thumbnails directly in the browser — no server round trip for upload preview. Mozilla-maintained, battle-tested with complex PDFs. | Server-side pdfminer (latency), iFrame embed (no programmatic access) |
| **Vite** | 5 | Sub-100ms HMR for fast iteration. First-class React + TypeScript support. Rollup-based production builds are smaller than Webpack. | Create React App (deprecated), Webpack (slower DX) |

### Backend

| Technology | Version | Why Chosen | Rejected Alternatives |
|-----------|---------|------------|----------------------|
| **Node.js + Express** | 20 LTS | JavaScript across the full stack reduces context switching. Event-loop model handles concurrent WebSocket connections efficiently. Vast middleware ecosystem. | Python/FastAPI (separate language, harder hiring), Go (performance overkill for MVP) |
| **Socket.io** | 4 | Bidirectional streaming for live transcript push. Automatic reconnection on network drops — critical during class. Room-based architecture for future multi-device sync. | Native WebSockets (manual reconnect logic), Server-Sent Events (unidirectional only), polling (unacceptable latency) |
| **PostgreSQL** | 15 | Relational model perfectly fits the data: Users → Courses → Sessions → Slides → Transcript Segments. Full-text search across sessions without Elasticsearch. ACID guarantees on concurrent session writes. | MongoDB (no joins, weaker consistency), Firebase (vendor lock-in, no SAML), SQLite (not production-scalable) |
| **Prisma** | 5 | Type-safe queries auto-generated from schema. Migrations tracked in version control. Works seamlessly with PostgreSQL and TypeScript. | TypeORM (verbose), raw SQL (error-prone at scale), Sequelize (worse TypeScript support) |

### AI & APIs

| Technology | Why Chosen | Rejected Alternatives |
|-----------|------------|----------------------|
| **Deepgram (nova-2 model)** | Sub-300ms streaming latency via WebSocket — essential for live class use. Superior accuracy on academic vocabulary. Built-in speaker diarization (professor vs. student questions). ~$0.0059/min is viable at student scale. | OpenAI Whisper (no streaming, batch-only — useless for live class), AssemblyAI (higher latency), Web Speech API (no offline support, browser-only, no diarization) |
| **Claude API (claude-sonnet-4)** | Best-in-class performance on structured educational content. Controllable JSON output for summary + flashcard generation. Large context window handles full lecture transcripts. Anthropic's safety focus aligns with a student-facing product. | GPT-4o (comparable quality, higher cost at scale), Gemini (weaker structured output), On-device models (significant quality tradeoff) |

### Infrastructure

| Technology | Why Chosen | Rejected Alternatives |
|-----------|------------|----------------------|
| **Auth0** | University SSO (SAML/OIDC) is required for institutional adoption. Handles MFA and RBAC out of the box. SOC2-certified — reduces FERPA compliance risk. | NextAuth (React-only, no SAML), Firebase Auth (no SAML), Custom JWT (security risk + maintenance burden) |
| **AWS S3** | Lecture audio files (avg 50–200MB) need durable cloud storage. Presigned URLs let clients upload directly — bypassing server bandwidth costs. Lifecycle policies auto-archive old sessions. | Cloudinary (media-focused, extra cost), Local filesystem (not scalable), GCS (comparable, weaker US integrations) |
| **Vercel** (frontend) | Zero-config deploys, edge CDN, instant preview URLs for every PR. | AWS (complex), Netlify (comparable but weaker DX) |
| **Railway** (backend) | WebSocket support (Vercel doesn't support persistent connections). Postgres addon included. Simple environment management. | Heroku (deprecated free tier), DigitalOcean (manual scaling), AWS ECS (overkill) |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────────┐  │
│  │  RecordView  │    │  ReviewView  │    │    Dashboard      │  │
│  │              │    │              │    │                   │  │
│  │ Web Audio API│    │  Summary Tab │    │  Session Library  │  │
│  │ MediaRecorder│    │  Transcript  │    │  Course Grouping  │  │
│  │ Slide Upload │    │  Flashcards  │    │  Stats Overview   │  │
│  └──────┬───────┘    └──────────────┘    └───────────────────┘  │
│         │ audio chunks (Socket.io)                              │
└─────────┼───────────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────────────┐
│                      SERVER (Node.js)                           │
│                                                                 │
│  Socket.io ──► Deepgram WebSocket ──► transcript segments       │
│                                              │                  │
│  Express REST API ◄──────────────────────────┘                  │
│       │                                                         │
│       ├── POST /sessions          (create session)              │
│       ├── POST /sessions/:id/slides (upload + parse PDF)        │
│       ├── POST /sessions/:id/summarize (trigger Claude)         │
│       └── GET  /sessions/:id      (fetch full session)          │
│                                                                 │
└──────┬──────────────────────┬──────────────────────────────────┘
       │                      │
┌──────▼──────┐      ┌────────▼────────┐      ┌───────────────┐
│ PostgreSQL  │      │   Claude API    │      │    AWS S3     │
│             │      │                 │      │               │
│ Users       │      │ Summarization   │      │ Audio files   │
│ Sessions    │      │ Flashcard gen   │      │ Slide PDFs    │
│ Slides      │      │ Q&A extraction  │      │               │
│ Transcripts │      └─────────────────┘      └───────────────┘
└─────────────┘
```

### Data Flow

```
Mic Input
    │
    ▼
Web Audio API (PCM stream)
    │
    ▼
Socket.io → Server → Deepgram WebSocket
                            │
                     transcript words (interim + final)
                            │
                     Socket.io → Client (live display)
                            │
                     Postgres (final segments only)
                            │
                     [After session ends]
                            │
                     Claude API (per slide context)
                            │
                     Summary + Key Points + Flashcards
                            │
                     Postgres (stored for review)
```

---

## Key API Integrations

### Deepgram — Live Transcription

```javascript
// Server: proxy mic audio from client to Deepgram
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

io.on("connection", (socket) => {
  const dgConnection = deepgram.listen.live({
    model: "nova-2",
    language: "en-US",
    punctuate: true,
    diarize: true,           // Separate professor from students
    interim_results: true,   // Show words as they're spoken
  });

  // Forward audio chunks from client to Deepgram
  socket.on("audio-chunk", (chunk) => {
    dgConnection.send(chunk);
  });

  // Send transcript back to client in real time
  dgConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
    const transcript = data.channel.alternatives[0];
    socket.emit("transcript-update", {
      text: transcript.transcript,
      timestamp: data.start,
      isFinal: data.is_final,
      speaker: data.channel.alternatives[0].words[0]?.speaker,
    });

    // Persist final segments to Postgres
    if (data.is_final && transcript.transcript.trim()) {
      prisma.transcriptSegment.create({
        data: {
          sessionId: socket.data.sessionId,
          slideId: socket.data.activeSlideId,
          text: transcript.transcript,
          startTime: data.start,
          endTime: data.start + data.duration,
        }
      });
    }
  });
});
```

### Claude API — Summarization & Flashcard Generation

```javascript
// POST /api/sessions/:id/summarize
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateSlideSummaries(sessionId) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      slides: {
        include: { transcriptSegments: { orderBy: { startTime: "asc" } } },
        orderBy: { order: "asc" }
      }
    }
  });

  const summaries = await Promise.all(
    session.slides.map(async (slide) => {
      const transcript = slide.transcriptSegments
        .map(s => s.text)
        .join(" ");

      if (!transcript.trim()) return null;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are an expert academic note-taker for university students.
Given a lecture transcript for a specific slide, return ONLY valid JSON with:
{
  "summary": "2-3 sentence plain-language summary",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "flashcards": [
    { "q": "question", "a": "answer" }
  ]
}
Keep language clear and accessible. Prioritize testable concepts.`,
        messages: [{
          role: "user",
          content: `Slide title: "${slide.title}"\n\nTranscript:\n${transcript}`
        }]
      });

      const result = JSON.parse(response.content[0].text);

      // Persist to database
      await prisma.slideSummary.upsert({
        where: { slideId: slide.id },
        update: result,
        create: { slideId: slide.id, ...result }
      });

      return result;
    })
  );

  return summaries.filter(Boolean);
}
```

### PDF.js — Client-Side Slide Parsing

```javascript
// Extract slide thumbnails and text client-side (no server round trip)
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

  const slides = await Promise.all(
    Array.from({ length: pdf.numPages }, async (_, i) => {
      const page = await pdf.getPage(i + 1);

      // Render thumbnail to canvas
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const viewport = page.getViewport({ scale: 0.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport }).promise;
      const thumbnail = canvas.toDataURL("image/jpeg", 0.7);

      // Extract text for AI processing
      const textContent = await page.getTextContent();
      const text = textContent.items.map(item => item.str).join(" ");

      return { pageNumber: i + 1, thumbnail, text };
    })
  );

  return slides;
}
```

---

## Product Roadmap

### Phase 1 — MVP (Weeks 1–6)
Core loop: record → transcribe → sync → summarize → review

- [x] Mic recording with live transcription (Deepgram)
- [x] PDF/PPT slide upload + client-side rendering
- [x] Manual slide-to-timestamp sync
- [x] Per-slide AI summary post-session (Claude)
- [x] AI-generated flashcards per slide
- [x] Session library / dashboard
- [ ] PDF export of complete study notes
- [ ] User auth (email/password via Auth0)

### Phase 2 — Institutional (Weeks 7–14)
Make it adoptable by universities

- [ ] University SSO (Auth0 SAML/OIDC)
- [ ] Canvas / Blackboard LMS integration
- [ ] AI chat: "Ask about this lecture"
- [ ] Multi-device sync (phone record → laptop review)
- [ ] Spaced repetition flashcard queue (SM-2 algorithm)
- [ ] Accessibility Services admin portal
- [ ] Shareable study packs (per course, opt-in)

### Phase 3 — Scale (Month 4+)
Network effects and defensibility

- [ ] Automatic slide detection via computer vision
- [ ] Shared lecture libraries per course code
- [ ] Professor-side slide upload integration
- [ ] Native iOS + Android apps (React Native)
- [ ] Offline mode (on-device Whisper via ONNX)
- [ ] FERPA-compliant institutional analytics
- [ ] Shared note corpus (students opt-in to share)

---

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--gold` | `#C8A96E` | Primary brand, AI-generated content, key UI elements |
| `--gold-dim` | `#8B6914` | Secondary gold, hover states |
| `--ink` | `#0A0A0F` | App background |
| `--surface` | `#0D0D18` | Sidebar, panel backgrounds |
| `--border` | `#1E1E2E` | Dividers, card borders |
| `--text-primary` | `#E8E4D9` | Primary text on dark |
| `--text-muted` | `#9898A8` | Transcript text, secondary labels |
| `--green` | `#5ABA5A` | Success states, answer cards |
| `--red` | `#E85555` | Recording state, alerts |
| `--blue` | `#82AAFF` | Info states, secondary actions |

### Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Display/Headers | DM Serif Display | 400 (regular + italic) | 22–72px |
| UI Text | Inter | 300 / 400 / 500 / 600 | 10–16px |
| Timestamps / Code | JetBrains Mono | 400 / 500 | 10–13px |

### Design Principles

1. **Dark by default** — reduces eye strain during 60-minute lectures
2. **Gold = AI** — any AI-generated content uses gold borders/labels. Students always know what's theirs vs. what's machine-generated
3. **Large tap targets** — minimum 44×44px for all interactive elements (WCAG 2.1 AA)
4. **Non-color indicators** — recording state uses both red color AND a pulsing dot + timer text (not color alone)
5. **Monospace timestamps** — fixed-width font prevents layout shifts as time updates

---

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- A Deepgram API key (free tier available at deepgram.com)
- An Anthropic API key (console.anthropic.com)

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/notesync-portfolio.git
cd notesync-portfolio

# Install dependencies (client)
cd client && npm install

# Install dependencies (server)
cd ../server && npm install

# Set up environment variables
cp .env.example .env
# Fill in your API keys (see Environment Variables below)

# Set up the database
npx prisma migrate dev --name init
npx prisma generate

# Start both client and server
npm run dev        # from /server — starts Express + Socket.io on :3001
npm run dev        # from /client — starts Vite on :5173
```

### Viewing the Portfolio Files

The portfolio files in this repo are standalone and need no build step:

```bash
# Open the case study in your browser
open notesync-portfolio.html

# Run the React prototypes (requires a React environment)
# Paste notesync-figma.jsx or notesync.jsx into:
# → codesandbox.io
# → stackblitz.com
# → or a local Vite + React project
```

---

## Environment Variables

```env
# Server (.env)

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/notesync"

# Deepgram — live transcription
# Get your key at: https://console.deepgram.com
DEEPGRAM_API_KEY=your_deepgram_key_here

# Anthropic — AI summaries and flashcards
# Get your key at: https://console.anthropic.com
ANTHROPIC_API_KEY=your_anthropic_key_here

# Auth0 — authentication
# Set up at: https://auth0.com (free tier available)
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret

# AWS S3 — audio and slide file storage
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=notesync-files
AWS_REGION=us-east-1

# App
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```env
# Client (.env.local)
VITE_SERVER_URL=http://localhost:3001
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id
```

---

## Key Design Decisions

### 1. Deepgram over Whisper for transcription
Whisper has higher accuracy on clean audio but requires a complete file. For live class use, **streaming with slight accuracy tradeoff is always the right call.** Students need the transcript while the lecture is happening, not 30 minutes after.

### 2. Manual slide tap over automatic detection
Automatic slide detection via computer vision on a screen share is elegant but fails in rooms where the student can't see the projector clearly. **Manual tap is 100% reliable and puts control in the student's hands** — which is the core product thesis. CV detection is a Phase 3 enhancement.

### 3. Post-session AI summaries over live in-class generation
Generating summaries during class adds API cost and latency to the most critical flow (live transcription). **Students don't read summaries in class — they read them after.** Batching after the session is cheaper, faster, and doesn't compete with real-time transcription for network resources.

### 4. PostgreSQL over MongoDB
The core data has clear relationships: one session has many slides, each slide has many transcript segments. **Relational joins make full-text search across a session trivial.** A document store would require application-level joins and lose ACID guarantees on concurrent writes during live sessions.

### 5. Per-slide context for Claude over full-lecture context
Sending the full lecture transcript to Claude in one call would exceed context limits for long lectures and produce less precise summaries. **Chunking by slide gives Claude a natural semantic boundary** — each slide is already a unit of meaning the professor defined.

---

## Success Metrics

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| D7 Retention | ≥ 60% | Did students come back to review? Core engagement signal |
| Live transcript latency | < 300ms | Deepgram streaming benchmark. Students can't follow a 2-second delay |
| Post-exam CSAT | ≥ 4.5/5 | Ultimate north star: did NoteSync help them on the exam? |
| Summary generation time | < 10s per slide | Student shouldn't wait more than a minute for a full lecture to process |
| FERPA incidents | 0 | Audio data never shared outside the student's own session |
| Institutional pilots | 3 universities by month 6 | Validates product-market fit for institutional sales motion |

---

## Compliance & Privacy

**FERPA (Family Educational Rights and Privacy Act)**

- All audio recordings are stored in the student's private S3 bucket partition
- Audio is never shared between students, even within the same course
- Summaries and flashcards generated from a session belong exclusively to that student
- Institutional admin access (Phase 2) is limited to aggregate analytics — no individual transcript access
- Students can delete all data associated with any session at any time

**WCAG 2.1 AA**

- All interactive elements meet minimum 44×44px touch target size
- Recording state is indicated by both color (red) and non-color means (pulsing animation + elapsed timer)
- Transcript font size minimum 13px with 1.6 line-height
- Keyboard navigation supported for all core flows
- Screen reader compatible labels on all icon-only buttons

---

## Author

**Built by a Product Manager & Full-Stack Engineer**

This project was built as a portfolio piece demonstrating end-to-end product thinking — from problem framing and user stories through technical architecture, API integration, and UI design.

- **PM artifacts:** Problem statement, user stories, roadmap, success metrics, design decisions
- **Engineering artifacts:** System architecture, API integration code, database schema, component structure
- **Design artifacts:** Full design system, 4-screen interactive prototype, Figma-style annotation layer

---

*NoteSync is a portfolio/concept project. API keys are required for full functionality.*
