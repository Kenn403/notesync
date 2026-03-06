import { useState, useEffect, useRef } from "react";

const SCREENS = ["dashboard", "record", "review-summary", "review-flashcards"];

const SCREEN_META = {
  dashboard: { label: "Dashboard", icon: "⊞", desc: "Session library + stats" },
  record: { label: "Record", icon: "●", desc: "Live class capture" },
  "review-summary": { label: "Review · Summary", icon: "✦", desc: "AI notes per slide" },
  "review-flashcards": { label: "Review · Cards", icon: "◧", desc: "Spaced repetition" },
};

const SLIDES = [
  { id: 1, emoji: "🧠", title: "Introduction to Neuroplasticity", time: "0:00" },
  { id: 2, emoji: "🔗", title: "Hebbian Learning Theory", time: "4:32" },
  { id: 3, emoji: "⚡", title: "Synaptic Strengthening", time: "9:15" },
  { id: 4, emoji: "📈", title: "Long-Term Potentiation", time: "14:08" },
  { id: 5, emoji: "🏥", title: "Clinical Applications", time: "21:44" },
];

const TRANSCRIPT = [
  { time: "0:12", slide: 1, text: "Good morning everyone, today we're exploring neuroplasticity — the brain's lifelong ability to reorganize itself by forming new neural connections." },
  { time: "1:05", slide: 1, text: "This isn't just a childhood phenomenon. Neuroplasticity continues throughout life, which is why rehabilitation after brain injury is possible." },
  { time: "4:32", slide: 2, text: "Donald Hebb proposed in 1949 that neurons which fire together, wire together. This is the biological foundation of all learning." },
  { time: "6:18", slide: 2, text: "Think of it like a path through a forest — the more frequently you walk that path, the clearer and wider it becomes." },
  { time: "9:15", slide: 3, text: "Synaptic strengthening occurs when repeated activation increases the efficiency of signal transmission between neurons over time." },
  { time: "14:08", slide: 4, text: "Long-term potentiation, or LTP, is perhaps the most studied cellular mechanism underlying memory formation in the hippocampus." },
  { time: "17:22", slide: 4, text: "NMDA receptors act as coincidence detectors — they require simultaneous pre and post-synaptic activation, which is why LTP is so precise." },
  { time: "21:44", slide: 5, text: "In clinical settings, we're seeing neuroplasticity applied in stroke rehab, PTSD treatment, and management of chronic pain." },
];

const SUMMARIES = {
  1: { summary: "Neuroplasticity is the brain's lifelong ability to form new neural connections — not just in childhood. Rehabilitation after injury is possible precisely because of this capacity.", keyPoints: ["Brain reorganizes throughout life, not just during development", "Foundation for understanding recovery from stroke and TBI", "Disproves the 'fixed brain' model that dominated 20th century neuroscience"] },
  2: { summary: "Hebb's Rule (1949): neurons that fire together, wire together. Repeated co-activation physically strengthens the synaptic connection between them.", keyPoints: ["'Neurons that fire together, wire together' — Hebb, 1949", "Repeated activation = stronger, faster signal transmission", "The biological mechanism behind practice and habit formation"] },
  3: { summary: "Synaptic strengthening is the physical change underlying learning — repeated activation makes signal transmission more efficient between neurons.", keyPoints: ["Strengthening is measurable at the cellular level", "More efficient = less energy needed for same signal", "Underpins why spaced repetition outperforms cramming"] },
  4: { summary: "Long-term potentiation (LTP) is the key cellular memory mechanism. NMDA receptors gatekeep the process by requiring simultaneous input from both sides.", keyPoints: ["LTP = durable synaptic strengthening lasting hours to years", "NMDA receptors require simultaneous pre + post-synaptic firing", "Blocking NMDA receptors prevents new memory formation (animal studies)"] },
  5: { summary: "Neuroplasticity has direct clinical applications: stroke rehabilitation, PTSD treatment, and chronic pain management all leverage the brain's capacity to rewire.", keyPoints: ["Stroke rehab: undamaged regions can take over lost functions", "PTSD: extinction learning rewrites fear pathways", "Chronic pain: pain itself changes brain structure (maladaptive plasticity)"] },
};

const FLASHCARDS = {
  1: [{ q: "What is neuroplasticity?", a: "The brain's lifelong ability to reorganize itself by forming new neural connections — not limited to childhood." }],
  2: [
    { q: "State Hebb's Rule.", a: "Neurons that fire together, wire together. Repeated co-activation strengthens the synaptic connection between them." },
    { q: "What analogy did Hebb use?", a: "A path through a forest — the more you walk it, the clearer and wider it becomes." },
  ],
  3: [{ q: "What does synaptic strengthening mean physiologically?", a: "Increased efficiency of signal transmission between neurons due to repeated activation." }],
  4: [
    { q: "What is LTP?", a: "Long-term potentiation — the primary cellular mechanism underlying memory formation, involving durable synaptic strengthening." },
    { q: "What are NMDA receptors?", a: "Coincidence detectors that require simultaneous pre- and post-synaptic activation to trigger LTP. They gatekeep memory formation." },
  ],
  5: [{ q: "Name 3 clinical applications of neuroplasticity.", a: "1. Stroke rehabilitation (undamaged regions take over). 2. PTSD treatment (extinction learning). 3. Chronic pain management." }],
};

const SESSIONS = [
  { id: 1, course: "PSYCH 302", title: "Neuroplasticity", lecture: 5, duration: "47 min", slides: 5, cards: 8, date: "Mar 4" },
  { id: 2, course: "CS 201", title: "Binary Trees & Heaps", lecture: 12, duration: "52 min", slides: 8, cards: 14, date: "Mar 3" },
  { id: 3, course: "ECON 101", title: "Supply & Demand Curves", lecture: 7, duration: "38 min", slides: 4, cards: 6, date: "Feb 28" },
  { id: 4, course: "PSYCH 302", title: "Memory Consolidation", lecture: 4, duration: "44 min", slides: 6, cards: 11, date: "Feb 26" },
];

export default function FigmaPrototype() {
  const [screen, setScreen] = useState("record");
  const [activeSlide, setActiveSlide] = useState(2);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(47);
  const [flippedCards, setFlippedCards] = useState({});
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [hoveredAnnotation, setHoveredAnnotation] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const toggleCard = (i) => setFlippedCards(f => ({ ...f, [i]: !f[i] }));

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#111", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 4px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes wave { 0%,100%{height:3px} 50%{height:18px} }
        .slide-btn { transition: all 0.15s; }
        .slide-btn:hover { background: #1a1a2e !important; }
        .fc-card { transition: all 0.25s ease; cursor: pointer; }
        .fc-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
        .screen-tab { transition: all 0.15s; }
        .screen-tab:hover { background: #1a1a2e !important; }
        .ann-badge { transition: all 0.2s; cursor: pointer; }
        .ann-badge:hover { transform: scale(1.1); }
      `}</style>

      {/* Top toolbar - Figma-style */}
      <div style={{ background: "#1a1a1a", borderBottom: "1px solid #2a2a2a", height: 44, display: "flex", alignItems: "center", padding: "0 16px", gap: 0, flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 24 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: "linear-gradient(135deg, #C8A96E, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0a0a0f", fontWeight: 700 }}>◈</div>
          <span style={{ fontSize: 13, color: "#C8A96E", fontWeight: 600, letterSpacing: "0.04em" }}>NoteSync</span>
          <span style={{ fontSize: 10, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase" }}>prototype</span>
        </div>

        {/* Screen tabs */}
        <div style={{ display: "flex", gap: 2, flex: 1 }}>
          {SCREENS.map(s => (
            <button key={s} onClick={() => setScreen(s)} className="screen-tab" style={{
              background: screen === s ? "#0a0a0f" : "transparent",
              border: screen === s ? "1px solid #2a2a4e" : "1px solid transparent",
              color: screen === s ? "#C8A96E" : "#555",
              padding: "5px 14px", borderRadius: 6, cursor: "pointer",
              fontSize: 11, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ fontSize: 10 }}>{SCREEN_META[s].icon}</span>
              {SCREEN_META[s].label}
            </button>
          ))}
        </div>

        {/* Annotations toggle */}
        <button onClick={() => setShowAnnotations(a => !a)} style={{
          background: showAnnotations ? "#C8A96E22" : "transparent",
          border: `1px solid ${showAnnotations ? "#C8A96E44" : "#333"}`,
          color: showAnnotations ? "#C8A96E" : "#555",
          padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11,
        }}>
          {showAnnotations ? "◉" : "○"} Annotations
        </button>
      </div>

      {/* Main area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* Left: Screen description */}
        <div style={{ width: 200, background: "#0f0f0f", borderRight: "1px solid #1e1e1e", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16, flexShrink: 0, overflowY: "auto" }}>
          <div>
            <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Current Screen</div>
            <div style={{ fontSize: 14, color: "#C8A96E", fontWeight: 600, marginBottom: 4 }}>{SCREEN_META[screen].label}</div>
            <div style={{ fontSize: 11, color: "#666", lineHeight: 1.6 }}>{SCREEN_META[screen].desc}</div>
          </div>

          <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: 16 }}>
            <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>All Screens</div>
            {SCREENS.map(s => (
              <div key={s} onClick={() => setScreen(s)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 6, cursor: "pointer", background: screen === s ? "#1a1a2e" : "transparent", marginBottom: 2, transition: "background 0.15s" }}>
                <span style={{ fontSize: 12, color: screen === s ? "#C8A96E" : "#444" }}>{SCREEN_META[s].icon}</span>
                <span style={{ fontSize: 11, color: screen === s ? "#C8A96E" : "#666" }}>{SCREEN_META[s].label}</span>
              </div>
            ))}
          </div>

          {screen === "record" && (
            <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: 16 }}>
              <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Controls</div>
              <button onClick={() => setIsRecording(r => !r)} style={{ width: "100%", padding: "8px", borderRadius: 8, border: `1px solid ${isRecording ? "#e8555544" : "#3a6a3a44"}`, background: isRecording ? "#2a101044" : "#0a1a0a44", color: isRecording ? "#e85555" : "#5aba5a", fontSize: 11, cursor: "pointer", marginBottom: 8 }}>
                {isRecording ? "⏹ Stop Recording" : "🎙 Start Recording"}
              </button>
              {isRecording && <div style={{ fontSize: 10, color: "#e85555", textAlign: "center" }}>● {fmt(elapsed)}</div>}
            </div>
          )}

          {(screen === "review-summary" || screen === "review-flashcards") && (
            <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: 16 }}>
              <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Active Slide</div>
              {SLIDES.map(sl => (
                <div key={sl.id} onClick={() => setActiveSlide(sl.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderRadius: 6, cursor: "pointer", background: activeSlide === sl.id ? "#1a1a2e" : "transparent", marginBottom: 2 }}>
                  <span style={{ fontSize: 13 }}>{sl.emoji}</span>
                  <span style={{ fontSize: 10, color: activeSlide === sl.id ? "#C8A96E" : "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sl.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Center: Device frame + screen */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "#111", overflow: "auto", position: "relative" }}>

          {/* Screen frame */}
          <div style={{ width: 900, maxWidth: "100%", background: "#0a0a0f", borderRadius: 14, overflow: "hidden", border: "1px solid #1e1e2e", boxShadow: "0 32px 80px rgba(0,0,0,0.6)", position: "relative" }}>

            {/* App top bar */}
            <div style={{ background: "#0d0d18", borderBottom: "1px solid #1e1e2e", height: 44, display: "flex", alignItems: "center", padding: "0 20px", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, background: "linear-gradient(135deg, #C8A96E, #8B6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>◈</div>
                <span style={{ fontSize: 13, color: "#C8A96E", fontWeight: 600 }}>NoteSync</span>
                <span style={{ fontSize: 9, color: "#333", letterSpacing: "0.2em", textTransform: "uppercase" }}>for Accessibility</span>
              </div>
              <div style={{ display: "flex", gap: 3, marginLeft: 8 }}>
                {["📡 Record", "📖 Review"].map((tab, i) => (
                  <div key={i} style={{
                    padding: "4px 12px", borderRadius: 5, fontSize: 10,
                    background: (i === 0 && screen === "record") || (i === 1 && screen !== "record" && screen !== "dashboard") ? "#1a1a2e" : "transparent",
                    border: (i === 0 && screen === "record") || (i === 1 && screen !== "record" && screen !== "dashboard") ? "1px solid #2a2a5e" : "1px solid transparent",
                    color: (i === 0 && screen === "record") || (i === 1 && screen !== "record" && screen !== "dashboard") ? "#C8A96E" : "#444",
                  }}>{tab}</div>
                ))}
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                {screen === "record" && isRecording && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#e85555", fontSize: 11 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#e85555", animation: "pulse 1s infinite" }} />
                    {fmt(elapsed)}
                  </div>
                )}
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #2a2a3e, #1a1a2e)", border: "1px solid #2a2a4e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#888" }}>A</div>
              </div>
            </div>

            {/* Screen content */}
            <div style={{ height: 520, overflow: "hidden", position: "relative" }}>
              {screen === "dashboard" && <DashboardScreen sessions={SESSIONS} setScreen={setScreen} />}
              {screen === "record" && <RecordScreen isRecording={isRecording} setIsRecording={setIsRecording} elapsed={elapsed} fmt={fmt} activeSlide={activeSlide} setActiveSlide={setActiveSlide} transcript={TRANSCRIPT} slides={SLIDES} />}
              {screen === "review-summary" && <SummaryScreen activeSlide={activeSlide} setActiveSlide={setActiveSlide} slides={SLIDES} summaries={SUMMARIES} transcript={TRANSCRIPT} />}
              {screen === "review-flashcards" && <FlashcardsScreen activeSlide={activeSlide} setActiveSlide={setActiveSlide} slides={SLIDES} flashcards={FLASHCARDS} flippedCards={flippedCards} toggleCard={toggleCard} />}
            </div>
          </div>
        </div>

        {/* Right: Annotation panel */}
        {showAnnotations && (
          <div style={{ width: 220, background: "#0f0f0f", borderLeft: "1px solid #1e1e1e", padding: "16px", display: "flex", flexDirection: "column", gap: 12, flexShrink: 0, overflowY: "auto" }}>
            <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.2em", textTransform: "uppercase" }}>Design Notes</div>

            {screen === "record" && <>
              <AnnotationNote color="#C8A96E" title="Live Waveform" text="CSS animation — no Canvas API. Pure performance, keyboard accessible." />
              <AnnotationNote color="#5aba5a" title="Slide Rail" text="Manual tap advances slide. 100% reliable vs computer vision (P3 feature)." />
              <AnnotationNote color="#82aaff" title="Transcript Stream" text="Deepgram 'interim' results show gray; final results persist in gold." />
              <AnnotationNote color="#e85555" title="Recording State" text="Red dot + elapsed time follows WCAG 2.1 non-color indicator pattern." />
            </>}

            {screen === "review-summary" && <>
              <AnnotationNote color="#C8A96E" title="AI Box" text="Distinct gold border signals AI-generated content. Never styled like professor content." />
              <AnnotationNote color="#5aba5a" title="Tab System" text="Summary / Transcript / Flashcards per slide. Matches mental model of 'one lecture = one deck'." />
              <AnnotationNote color="#82aaff" title="Key Points" text="Extracted from transcript via Claude. Numbered for easy reference in exams." />
            </>}

            {screen === "review-flashcards" && <>
              <AnnotationNote color="#C8A96E" title="Flip Interaction" text="Tap to reveal. Visual state (gold/green) distinguishes question vs answer." />
              <AnnotationNote color="#5aba5a" title="SM-2 Algorithm" text="Phase 2: cards queued by spaced repetition. Due count shown per slide in rail." />
              <AnnotationNote color="#e85555" title="Generation" text="Claude generates Q&A from transcript. Student can edit or delete individual cards." />
            </>}

            {screen === "dashboard" && <>
              <AnnotationNote color="#C8A96E" title="Course Grouping" text="Sessions grouped by course code parsed from PDF filename or manual tag." />
              <AnnotationNote color="#5aba5a" title="Stats Bar" text="Three key numbers students care about: lectures recorded, courses, cards due today." />
              <AnnotationNote color="#82aaff" title="Re-entry Point" text="'Review →' returns student to exact slide they stopped on (persisted in DB)." />
            </>}

            <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: 12, marginTop: 4 }}>
              <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Color System</div>
              {[["#C8A96E", "Gold", "AI / Key UI"], ["#5aba5a", "Green", "Success / Answer"], ["#e85555", "Red", "Recording / Alert"], ["#82aaff", "Blue", "Info / Secondary"]].map(([c, n, u]) => (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: c, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 10, color: "#888" }}>{n}</div>
                    <div style={{ fontSize: 9, color: "#444" }}>{u}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: 12 }}>
              <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Typography</div>
              <div style={{ fontSize: 10, color: "#666", lineHeight: 1.7 }}>
                <div><span style={{ color: "#888" }}>Display:</span> DM Serif Display</div>
                <div><span style={{ color: "#888" }}>UI:</span> Inter 400/500/600</div>
                <div><span style={{ color: "#888" }}>Mono:</span> JetBrains Mono</div>
                <div style={{ marginTop: 6, color: "#444" }}>Base: 13px / 1.6 line-height</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AnnotationNote({ color, title, text }) {
  return (
    <div style={{ background: "#1a1a1a", border: `1px solid ${color}33`, borderLeft: `3px solid ${color}`, borderRadius: 8, padding: "10px 12px" }}>
      <div style={{ fontSize: 10, color, fontWeight: 600, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 10, color: "#777", lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

function DashboardScreen({ sessions, setScreen }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px 24px", overflowY: "auto", color: "#e8e4d9" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>Spring 2026</div>
          <h2 style={{ fontSize: 22, fontWeight: 300, color: "#e8e4d9", margin: 0 }}>Your Lectures</h2>
        </div>
        <button onClick={() => setScreen("record")} style={{ background: "linear-gradient(135deg, #C8A96E, #8B6914)", border: "none", color: "#0a0a0f", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>
          + New Recording
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[["14", "Lectures", "#C8A96E"], ["3", "Courses", "#5aba5a"], ["39", "Cards Due", "#e85555"], ["89", "Total Cards", "#82aaff"]].map(([n, l, c]) => (
          <div key={l} style={{ background: "#0f0f18", border: "1px solid #1a1a2a", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: c, lineHeight: 1, marginBottom: 6, fontFamily: "Georgia, serif" }}>{n}</div>
            <div style={{ fontSize: 10, color: "#555", letterSpacing: "0.1em" }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Recent Sessions</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sessions.map((s, i) => (
          <div key={s.id} onClick={() => setScreen("review-summary")} style={{ background: "#0f0f18", border: `1px solid ${i === 0 ? "#C8A96E33" : "#1a1a2a"}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "border-color 0.15s" }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: i === 0 ? "#1a1a0e" : "#1a1a2e", border: `1px solid ${i === 0 ? "#C8A96E44" : "#2a2a4e"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
              {["🧠", "🌳", "📊", "🔁"][i]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: i === 0 ? "#C8A96E" : "#82aaff", fontWeight: 600, letterSpacing: "0.06em" }}>{s.course}</span>
                <span style={{ fontSize: 10, color: "#444" }}>Lecture {s.lecture}</span>
                <span style={{ fontSize: 10, color: "#333" }}>·</span>
                <span style={{ fontSize: 10, color: "#444" }}>{s.date}</span>
              </div>
              <div style={{ fontSize: 13, color: i === 0 ? "#e8e4d9" : "#888", marginBottom: 3 }}>{s.title}</div>
              <div style={{ fontSize: 10, color: "#444" }}>{s.duration} · {s.slides} slides · {s.cards} flashcards</div>
            </div>
            <div style={{ fontSize: 11, color: i === 0 ? "#C8A96E" : "#555", padding: "5px 12px", background: i === 0 ? "#1a1a0e" : "transparent", border: `1px solid ${i === 0 ? "#C8A96E33" : "#1a1a2a"}`, borderRadius: 6 }}>
              Review →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecordScreen({ isRecording, setIsRecording, elapsed, fmt, activeSlide, setActiveSlide, transcript, slides }) {
  const activeTranscript = transcript.filter(t => t.slide === activeSlide);
  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Sidebar */}
      <div style={{ width: 200, background: "#0d0d18", borderRight: "1px solid #1a1a2a", display: "flex", flexDirection: "column", padding: "16px 14px", gap: 14 }}>
        {/* Mic control */}
        <div style={{ textAlign: "center" }}>
          <button onClick={() => setIsRecording(r => !r)} style={{
            width: 60, height: 60, borderRadius: "50%",
            background: isRecording ? "radial-gradient(circle, #3a1010, #1a0808)" : "radial-gradient(circle, #1a2a1a, #0a1a0a)",
            border: `2px solid ${isRecording ? "#e85555" : "#3a6a3a"}`,
            color: isRecording ? "#e85555" : "#5aba5a",
            fontSize: 22, cursor: "pointer", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: isRecording ? "0 0 24px rgba(232,85,85,0.25)" : "0 0 16px rgba(90,186,90,0.1)",
          }}>
            {isRecording ? "⏹" : "🎙"}
          </button>
          <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.15em", marginTop: 6 }}>{isRecording ? "RECORDING" : "READY"}</div>
        </div>

        {/* Waveform */}
        {isRecording && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, height: 24 }}>
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} style={{ width: 2, background: "#C8A96E", borderRadius: 1, animation: `wave ${0.35 + (i % 4) * 0.12}s ease-in-out infinite`, animationDelay: `${i * 0.055}s` }} />
            ))}
          </div>
        )}

        {/* Upload area */}
        <div style={{ border: "1px dashed #2a2a3e", borderRadius: 8, padding: "10px", textAlign: "center", cursor: "pointer" }}>
          <div style={{ fontSize: 16, marginBottom: 3 }}>📎</div>
          <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.1em" }}>UPLOAD SLIDES</div>
          <div style={{ fontSize: 9, color: "#333", marginTop: 2 }}>neuroscience_lec5.pdf ✓</div>
        </div>

        {/* Slide list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Slides</div>
          {slides.map(sl => (
            <div key={sl.id} onClick={() => setActiveSlide(sl.id)} className="slide-btn" style={{
              padding: "8px 10px", borderRadius: 7, cursor: "pointer", marginBottom: 4,
              background: activeSlide === sl.id ? "#1a1a2e" : "transparent",
              border: activeSlide === sl.id ? "1px solid #2a2a5e" : "1px solid transparent",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 16 }}>{sl.emoji}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10, color: activeSlide === sl.id ? "#C8A96E" : "#777", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sl.title}</div>
                <div style={{ fontSize: 9, color: "#444" }}>{sl.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 24px", overflow: "hidden" }}>
        <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
          Slide {activeSlide} of {slides.length}
        </div>
        <div style={{ fontSize: 18, color: "#e8e4d9", fontWeight: 300, marginBottom: 14 }}>
          {slides[activeSlide - 1]?.title}
        </div>

        {/* Slide preview */}
        <div style={{ background: "linear-gradient(135deg, #0f0f1e, #1a1a2e)", border: "1px solid #2a2a4e", borderRadius: 12, height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, position: "relative", marginBottom: 16, flexShrink: 0 }}>
          <div style={{ fontSize: 48, opacity: 0.6 }}>{slides[activeSlide - 1]?.emoji}</div>
          <div style={{ fontSize: 14, color: "#C8A96E", fontWeight: 300 }}>{slides[activeSlide - 1]?.title}</div>
          <div style={{ fontSize: 10, color: "#444" }}>PSYCH 302 · Dr. Martinez</div>
          {isRecording && (
            <div style={{ position: "absolute", top: 10, right: 10, background: "#e85555", borderRadius: 4, padding: "2px 7px", fontSize: 9, color: "#fff", letterSpacing: "0.1em" }}>● LIVE</div>
          )}
        </div>

        {/* Transcript */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Live Transcript</div>
          {activeTranscript.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, animation: "fadeUp 0.3s ease" }}>
              <span style={{ fontSize: 10, color: "#555", minWidth: 36, paddingTop: 2, fontFamily: "monospace" }}>{t.time}</span>
              <p style={{ margin: 0, fontSize: 12, color: "#9898a8", lineHeight: 1.7 }}>{t.text}</p>
            </div>
          ))}
          {isRecording && (
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 10, color: "#555", minWidth: 36, paddingTop: 6 }}>—</span>
              <div style={{ display: "flex", gap: 3, paddingTop: 7 }}>
                {[0.6, 0.8, 1.0].map((d, i) => (
                  <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#C8A96E", animation: `pulse ${d}s infinite` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryScreen({ activeSlide, setActiveSlide, slides, summaries, transcript }) {
  const [tab, setTab] = useState("summary");
  const summary = summaries[activeSlide];
  const activeTranscript = transcript.filter(t => t.slide === activeSlide);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      {/* Slide rail */}
      <div style={{ width: 180, background: "#0d0d18", borderRight: "1px solid #1a1a2a", overflowY: "auto", padding: "14px 12px" }}>
        <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Lecture Slides</div>
        {slides.map(sl => (
          <div key={sl.id} onClick={() => setActiveSlide(sl.id)} className="slide-btn" style={{
            padding: "10px", borderRadius: 9, cursor: "pointer",
            background: activeSlide === sl.id ? "#1a1a2e" : "transparent",
            border: activeSlide === sl.id ? "1px solid #C8A96E44" : "1px solid transparent",
            marginBottom: 6,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <span style={{ fontSize: 18 }}>{sl.emoji}</span>
              <span style={{ fontSize: 9, color: "#444" }}>{sl.time}</span>
            </div>
            <div style={{ fontSize: 10, color: activeSlide === sl.id ? "#C8A96E" : "#666", lineHeight: 1.4 }}>{sl.title}</div>
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "16px 24px 0", borderBottom: "1px solid #1a1a2a" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 9, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 3 }}>Slide {activeSlide}</div>
              <div style={{ fontSize: 17, color: "#C8A96E", fontWeight: 400 }}>{slides[activeSlide - 1]?.title}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ background: "#1a1a2e", border: "1px solid #2a2a4e", color: "#888", padding: "5px 12px", borderRadius: 6, fontSize: 10, cursor: "pointer" }}>⬇ Export</div>
              <div style={{ background: "#C8A96E22", border: "1px solid #C8A96E44", color: "#C8A96E", padding: "5px 12px", borderRadius: 6, fontSize: 10, cursor: "pointer" }}>✦ Ask AI</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 0 }}>
            {["summary", "transcript", "flashcards"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ background: "transparent", border: "none", borderBottom: tab === t ? "2px solid #C8A96E" : "2px solid transparent", color: tab === t ? "#C8A96E" : "#444", padding: "7px 18px", cursor: "pointer", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 24px" }}>
          {tab === "summary" && (
            <div style={{ animation: "fadeUp 0.25s ease" }}>
              <div style={{ background: "linear-gradient(135deg, #1a1a0a, #1a0a1a)", border: "1px solid #C8A96E33", borderRadius: 10, padding: "16px 20px", marginBottom: 18 }}>
                <div style={{ fontSize: 9, color: "#C8A96E", letterSpacing: "0.15em", marginBottom: 8 }}>✦ AI SUMMARY</div>
                <p style={{ margin: 0, fontSize: 13, color: "#b0aa98", lineHeight: 1.8 }}>{summary.summary}</p>
              </div>
              <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Key Points</div>
              {summary.keyPoints.map((pt, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "#0f0f18", borderRadius: 8, border: "1px solid #1a1a2a", marginBottom: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: "1px solid #2a2a4e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#555", flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: 12, color: "#9090a0", lineHeight: 1.7 }}>{pt}</p>
                </div>
              ))}
            </div>
          )}
          {tab === "transcript" && (
            <div style={{ animation: "fadeUp 0.25s ease" }}>
              {activeTranscript.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid #1a1a2a" }}>
                  <span style={{ fontSize: 10, color: "#C8A96E66", minWidth: 38, paddingTop: 2, fontFamily: "monospace" }}>{t.time}</span>
                  <p style={{ margin: 0, fontSize: 13, color: "#9898a8", lineHeight: 1.8 }}>{t.text}</p>
                </div>
              ))}
            </div>
          )}
          {tab === "flashcards" && (
            <div style={{ animation: "fadeUp 0.25s ease" }}>
              <p style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>AI-generated from transcript · tap to reveal answer</p>
              {(FLASHCARDS[activeSlide] || []).map((fc, i) => {
                const key = `${activeSlide}-${i}`;
                const flipped = false;
                return (
                  <div key={i} className="fc-card" style={{
                    background: "linear-gradient(135deg, #0f0f1e, #1a1a2e)",
                    border: "1px solid #2a2a5e", borderRadius: 12, padding: "18px 22px", marginBottom: 12,
                  }}>
                    <div style={{ fontSize: 9, color: "#C8A96E", letterSpacing: "0.15em", marginBottom: 8 }}>QUESTION</div>
                    <p style={{ margin: 0, fontSize: 13, color: "#c8c4b8", lineHeight: 1.7 }}>{fc.q}</p>
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #1a1a2a" }}>
                      <div style={{ fontSize: 9, color: "#5aba5a", letterSpacing: "0.15em", marginBottom: 6 }}>ANSWER</div>
                      <p style={{ margin: 0, fontSize: 12, color: "#9898a8", lineHeight: 1.7 }}>{fc.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FlashcardsScreen({ activeSlide, setActiveSlide, slides, flashcards, flippedCards, toggleCard }) {
  const cards = flashcards[activeSlide] || [];
  const totalCards = Object.values(flashcards).flat().length;

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: 180, background: "#0d0d18", borderRight: "1px solid #1a1a2a", overflowY: "auto", padding: "14px 12px" }}>
        <div style={{ fontSize: 9, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Study Queue</div>
        {slides.map(sl => {
          const n = (flashcards[sl.id] || []).length;
          return (
            <div key={sl.id} onClick={() => setActiveSlide(sl.id)} className="slide-btn" style={{
              padding: "10px", borderRadius: 9, cursor: "pointer",
              background: activeSlide === sl.id ? "#1a1a2e" : "transparent",
              border: activeSlide === sl.id ? "1px solid #C8A96E44" : "1px solid transparent",
              marginBottom: 6, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 16 }}>{sl.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: activeSlide === sl.id ? "#C8A96E" : "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sl.title}</div>
                <div style={{ fontSize: 9, color: "#444", marginTop: 2 }}>{n} card{n !== 1 ? "s" : ""}</div>
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 12, padding: "10px", background: "#0f0f18", borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontSize: 18, color: "#82aaff", fontWeight: 700, fontFamily: "Georgia" }}>{totalCards}</div>
          <div style={{ fontSize: 9, color: "#444" }}>total cards</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 24px", overflow: "hidden" }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 9, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>Slide {activeSlide} · Flashcards</div>
          <div style={{ fontSize: 18, color: "#C8A96E", fontWeight: 400 }}>{slides[activeSlide - 1]?.title}</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {cards.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#444", fontSize: 13 }}>No flashcards for this slide yet</div>
          ) : (
            cards.map((fc, i) => {
              const key = `${activeSlide}-${i}`;
              const flipped = flippedCards[key];
              return (
                <div key={i} className="fc-card" onClick={() => toggleCard(key)} style={{
                  background: flipped ? "linear-gradient(135deg, #1a1a0a, #0a1a0a)" : "linear-gradient(135deg, #0f0f1e, #1a1a2e)",
                  border: `1px solid ${flipped ? "#3a6a3a66" : "#2a2a5e"}`,
                  borderRadius: 14, padding: "22px 26px", marginBottom: 14, minHeight: 100,
                }}>
                  <div style={{ fontSize: 9, color: flipped ? "#5aba5a" : "#C8A96E", letterSpacing: "0.15em", marginBottom: 10 }}>
                    {flipped ? "✓ ANSWER" : "? QUESTION"}
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: "#c8c4b8", lineHeight: 1.8 }}>
                    {flipped ? fc.a : fc.q}
                  </p>
                  <div style={{ fontSize: 10, color: "#333", marginTop: 12 }}>tap to {flipped ? "see question" : "reveal answer"}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
