import { useState, useEffect, useRef } from "react";

const MOCK_SLIDES = [
  { id: 1, title: "Introduction to Neuroplasticity", thumb: "🧠", time: "0:00" },
  { id: 2, title: "Hebbian Learning Theory", thumb: "🔗", time: "4:32" },
  { id: 3, title: "Synaptic Strengthening", thumb: "⚡", time: "9:15" },
  { id: 4, title: "Long-Term Potentiation", thumb: "📈", time: "14:08" },
  { id: 5, title: "Clinical Applications", thumb: "🏥", time: "21:44" },
];

const MOCK_TRANSCRIPT = [
  { time: "0:12", slide: 1, text: "Good morning everyone, today we're going to explore one of the most fascinating topics in neuroscience — neuroplasticity." },
  { time: "1:05", slide: 1, text: "The brain's ability to reorganize itself by forming new neural connections throughout life is truly remarkable." },
  { time: "4:32", slide: 2, text: "Donald Hebb proposed in 1949 that neurons that fire together, wire together. This is the foundation of learning at a biological level." },
  { time: "6:18", slide: 2, text: "Think of it like a path through a forest. The more you walk it, the clearer and easier it becomes." },
  { time: "9:15", slide: 3, text: "Synaptic strengthening occurs when repeated activation increases the efficiency of signal transmission between neurons." },
  { time: "11:40", slide: 3, text: "This is why practice and repetition are so critical — you are literally reshaping your brain's architecture." },
  { time: "14:08", slide: 4, text: "Long-term potentiation, or LTP, is perhaps the most studied cellular mechanism underlying memory formation." },
  { time: "17:22", slide: 4, text: "NMDA receptors act as coincidence detectors, requiring simultaneous pre and post-synaptic activation." },
  { time: "21:44", slide: 5, text: "In clinical settings, we're seeing neuroplasticity applied in stroke rehabilitation, treating PTSD, and chronic pain management." },
];

const MOCK_SUMMARY = [
  { slide: 1, key: "Core Concept", text: "Neuroplasticity = the brain's lifelong ability to form new neural connections. Not fixed at birth." },
  { slide: 2, key: "Hebb's Rule", text: "\"Neurons that fire together, wire together\" — repeated activation strengthens neural pathways." },
  { slide: 3, key: "Mechanism", text: "Synaptic strengthening through repetition physically reshapes brain architecture." },
  { slide: 4, key: "LTP", text: "Long-term potentiation is the key cellular mechanism for memory. NMDA receptors are the gatekeepers." },
  { slide: 5, key: "Applications", text: "Stroke rehab, PTSD treatment, chronic pain — all leverage the brain's capacity to rewire itself." },
];

const VIEWS = ["record", "review"];

export default function NoteSync() {
  const [view, setView] = useState("record");
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [activeSlide, setActiveSlide] = useState(1);
  const [activeTab, setActiveTab] = useState("transcript");
  const [uploadedSlides, setUploadedSlides] = useState(false);
  const [pulseIndex, setPulseIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const intervalRef = useRef(null);
  const transcriptRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => e + 1);
        setPulseIndex(p => (p + 1) % MOCK_TRANSCRIPT.length);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRecording]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const currentTranscript = isRecording
    ? MOCK_TRANSCRIPT.slice(0, Math.max(1, Math.floor((elapsed / 3) % MOCK_TRANSCRIPT.length) + 1))
    : MOCK_TRANSCRIPT;

  const handleRecord = () => {
    setIsRecording(r => !r);
    setShowWelcome(false);
  };

  const goToReview = () => {
    setIsRecording(false);
    setView("review");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e8e4d9",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid #1e1e2e",
        padding: "0 32px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#0a0a0f",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "linear-gradient(135deg, #c8a96e, #8b6914)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14,
          }}>◈</div>
          <span style={{ fontSize: 16, letterSpacing: "0.08em", fontWeight: 400, color: "#c8a96e" }}>NoteSync</span>
          <span style={{ fontSize: 11, color: "#444", letterSpacing: "0.2em", textTransform: "uppercase", marginLeft: 4 }}>for Accessibility</span>
        </div>

        <nav style={{ display: "flex", gap: 4 }}>
          {["record", "review"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view === v ? "#1a1a2e" : "transparent",
              border: view === v ? "1px solid #2a2a4e" : "1px solid transparent",
              color: view === v ? "#c8a96e" : "#555",
              padding: "6px 16px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}>{v === "record" ? "📡 Record" : "📖 Review"}</button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isRecording && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#e85555", fontSize: 12 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", background: "#e85555",
                animation: "pulse 1s infinite",
              }} />
              {formatTime(elapsed)}
            </div>
          )}
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg, #3a2a1e, #1e1a2e)",
            border: "1px solid #2a2a3e",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, cursor: "pointer",
          }}>A</div>
        </div>
      </header>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes waveform { 0%, 100% { height: 4px; } 50% { height: 20px; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 4px; }
      `}</style>

      {view === "record" ? (
        <RecordView
          isRecording={isRecording}
          elapsed={elapsed}
          formatTime={formatTime}
          activeSlide={activeSlide}
          setActiveSlide={setActiveSlide}
          uploadedSlides={uploadedSlides}
          setUploadedSlides={setUploadedSlides}
          currentTranscript={currentTranscript}
          handleRecord={handleRecord}
          goToReview={goToReview}
          showWelcome={showWelcome}
        />
      ) : (
        <ReviewView
          activeSlide={activeSlide}
          setActiveSlide={setActiveSlide}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}

function RecordView({ isRecording, elapsed, formatTime, activeSlide, setActiveSlide, uploadedSlides, setUploadedSlides, currentTranscript, handleRecord, goToReview, showWelcome }) {
  return (
    <div style={{ display: "flex", flex: 1, height: "calc(100vh - 56px)" }}>
      {/* Left: Controls + Slide strip */}
      <div style={{
        width: 260,
        borderRight: "1px solid #1a1a2a",
        display: "flex",
        flexDirection: "column",
        padding: "24px 20px",
        gap: 20,
      }}>
        {/* Record button */}
        <div style={{ textAlign: "center" }}>
          <button onClick={handleRecord} style={{
            width: 80, height: 80, borderRadius: "50%",
            background: isRecording
              ? "radial-gradient(circle, #3a1010, #1a0808)"
              : "radial-gradient(circle, #1a2a1a, #0a1a0a)",
            border: isRecording ? "2px solid #e85555" : "2px solid #3a6a3a",
            color: isRecording ? "#e85555" : "#5aba5a",
            fontSize: 28,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto",
            transition: "all 0.2s",
            boxShadow: isRecording ? "0 0 30px rgba(232,85,85,0.3)" : "0 0 20px rgba(90,186,90,0.15)",
          }}>
            {isRecording ? "⏹" : "🎙"}
          </button>
          <p style={{ margin: "10px 0 0", fontSize: 11, color: "#555", letterSpacing: "0.1em" }}>
            {isRecording ? "TAP TO STOP" : "TAP TO RECORD"}
          </p>
        </div>

        {/* Waveform */}
        {isRecording && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 28 }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{
                width: 3, background: "#c8a96e", borderRadius: 2,
                animation: `waveform ${0.4 + (i % 4) * 0.15}s ease-in-out infinite`,
                animationDelay: `${i * 0.06}s`,
              }} />
            ))}
          </div>
        )}

        {/* Upload slides */}
        <div
          onClick={() => setUploadedSlides(true)}
          style={{
            border: `1px dashed ${uploadedSlides ? "#3a6a3a" : "#2a2a3e"}`,
            borderRadius: 10,
            padding: "14px 12px",
            textAlign: "center",
            cursor: "pointer",
            background: uploadedSlides ? "#0a1a0a" : "transparent",
            transition: "all 0.2s",
          }}>
          {uploadedSlides ? (
            <div>
              <div style={{ fontSize: 20, marginBottom: 4 }}>✅</div>
              <p style={{ margin: 0, fontSize: 11, color: "#5aba5a", letterSpacing: "0.08em" }}>SLIDES LOADED</p>
              <p style={{ margin: "4px 0 0", fontSize: 10, color: "#3a5a3a" }}>neuroscience_lec5.pdf</p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 20, marginBottom: 4 }}>📎</div>
              <p style={{ margin: 0, fontSize: 11, color: "#444", letterSpacing: "0.08em" }}>UPLOAD SLIDES</p>
              <p style={{ margin: "4px 0 0", fontSize: 10, color: "#333" }}>PDF or PPT</p>
            </div>
          )}
        </div>

        {/* Slide list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <p style={{ margin: "0 0 10px", fontSize: 10, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase" }}>Slides</p>
          {MOCK_SLIDES.map(slide => (
            <div key={slide.id} onClick={() => setActiveSlide(slide.id)} style={{
              padding: "10px 12px",
              borderRadius: 8,
              cursor: "pointer",
              background: activeSlide === slide.id ? "#1a1a2e" : "transparent",
              border: activeSlide === slide.id ? "1px solid #2a2a5e" : "1px solid transparent",
              marginBottom: 6,
              display: "flex", alignItems: "center", gap: 10,
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 18 }}>{slide.thumb}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 11, color: activeSlide === slide.id ? "#c8a96e" : "#888", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{slide.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: 10, color: "#444" }}>{slide.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Finish button */}
        {!isRecording && elapsed > 0 && (
          <button onClick={goToReview} style={{
            background: "linear-gradient(135deg, #c8a96e, #8b6914)",
            border: "none",
            color: "#0a0a0f",
            padding: "12px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            Review Notes →
          </button>
        )}
      </div>

      {/* Center: Current slide */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "32px 40px" }}>
        {showWelcome && !isRecording ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16 }}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>◈</div>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 300, color: "#c8a96e", letterSpacing: "0.05em" }}>Ready to capture your class</h2>
            <p style={{ margin: 0, color: "#555", fontSize: 14, maxWidth: 360, lineHeight: 1.7 }}>Upload your slides, then hit record. NoteSync will transcribe the lecture and sync every spoken word to the right slide.</p>
            <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
              {["Upload Slides", "Hit Record", "Review & Study"].map((step, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    border: "1px solid #2a2a4e",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 8px",
                    color: "#c8a96e", fontSize: 13,
                  }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: 11, color: "#666", letterSpacing: "0.08em" }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: "0 0 4px", fontSize: 10, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Slide {activeSlide} of {MOCK_SLIDES.length}
              </p>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 300, color: "#e8e4d9", letterSpacing: "0.02em" }}>
                {MOCK_SLIDES[activeSlide - 1]?.title}
              </h2>
            </div>

            {/* Slide preview */}
            <div style={{
              background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%)",
              border: "1px solid #2a2a4e",
              borderRadius: 14,
              aspectRatio: "16/9",
              maxHeight: 320,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 16,
              position: "relative",
              overflow: "hidden",
              marginBottom: 24,
            }}>
              <div style={{ fontSize: 72, opacity: 0.6 }}>{MOCK_SLIDES[activeSlide - 1]?.thumb}</div>
              <p style={{ margin: 0, fontSize: 18, color: "#c8a96e", fontWeight: 300, letterSpacing: "0.04em" }}>
                {MOCK_SLIDES[activeSlide - 1]?.title}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "#444", letterSpacing: "0.1em" }}>
                PSYCH 302 · Dr. Martinez · Lecture 5
              </p>
              {isRecording && (
                <div style={{
                  position: "absolute", top: 12, right: 12,
                  background: "#e85555", borderRadius: 4,
                  padding: "3px 8px", fontSize: 10, color: "#fff", letterSpacing: "0.1em",
                }}>● LIVE</div>
              )}
            </div>

            {/* Live transcript */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              <p style={{ margin: "0 0 12px", fontSize: 10, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                {isRecording ? "Live Transcript" : "Transcript"}
              </p>
              {currentTranscript
                .filter(t => t.slide === activeSlide)
                .map((t, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, marginBottom: 12,
                    animation: "fadeIn 0.3s ease",
                  }}>
                    <span style={{ fontSize: 10, color: "#555", minWidth: 36, paddingTop: 3 }}>{t.time}</span>
                    <p style={{ margin: 0, fontSize: 13, color: "#b0aa98", lineHeight: 1.7 }}>{t.text}</p>
                  </div>
                ))}
              {isRecording && (
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 10, color: "#555", minWidth: 36, paddingTop: 3 }}>—</span>
                  <div style={{ display: "flex", gap: 4, paddingTop: 6 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: "50%", background: "#c8a96e",
                        animation: `pulse ${0.6 + i * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ReviewView({ activeSlide, setActiveSlide, activeTab, setActiveTab }) {
  return (
    <div style={{ display: "flex", flex: 1, height: "calc(100vh - 56px)" }}>
      {/* Left: Slide nav */}
      <div style={{
        width: 220,
        borderRight: "1px solid #1a1a2a",
        overflowY: "auto",
        padding: "20px 16px",
      }}>
        <p style={{ margin: "0 0 14px", fontSize: 10, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase" }}>Lecture Slides</p>
        {MOCK_SLIDES.map(slide => (
          <div key={slide.id} onClick={() => setActiveSlide(slide.id)} style={{
            padding: "12px",
            borderRadius: 10,
            cursor: "pointer",
            background: activeSlide === slide.id ? "#1a1a2e" : "transparent",
            border: activeSlide === slide.id ? "1px solid #c8a96e44" : "1px solid transparent",
            marginBottom: 8,
            transition: "all 0.15s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>{slide.thumb}</span>
              <span style={{ fontSize: 10, color: "#444" }}>{slide.time}</span>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: activeSlide === slide.id ? "#c8a96e" : "#777", lineHeight: 1.4 }}>{slide.title}</p>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Slide header */}
        <div style={{
          padding: "20px 32px 16px",
          borderBottom: "1px solid #1a1a2a",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 10, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Slide {activeSlide}
              </p>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 300, color: "#c8a96e", letterSpacing: "0.03em" }}>
                {MOCK_SLIDES[activeSlide - 1]?.title}
              </h3>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{
                background: "#1a1a2e", border: "1px solid #2a2a4e",
                color: "#888", padding: "6px 14px", borderRadius: 6,
                cursor: "pointer", fontSize: 11, letterSpacing: "0.1em",
              }}>⬇ Export PDF</button>
              <button style={{
                background: "linear-gradient(135deg, #c8a96e44, #8b691422)",
                border: "1px solid #c8a96e66",
                color: "#c8a96e", padding: "6px 14px", borderRadius: 6,
                cursor: "pointer", fontSize: 11, letterSpacing: "0.1em",
              }}>✦ Ask AI</button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 16 }}>
            {["summary", "transcript", "flashcards"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                background: "transparent",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid #c8a96e" : "2px solid transparent",
                color: activeTab === tab ? "#c8a96e" : "#555",
                padding: "8px 20px",
                cursor: "pointer",
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                transition: "all 0.15s",
              }}>{tab}</button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {activeTab === "summary" && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{
                background: "linear-gradient(135deg, #1a1a0a, #1a0a1a)",
                border: "1px solid #c8a96e33",
                borderRadius: 12,
                padding: "20px 24px",
                marginBottom: 24,
              }}>
                <p style={{ margin: "0 0 8px", fontSize: 10, color: "#c8a96e", letterSpacing: "0.15em" }}>✦ AI SUMMARY</p>
                <p style={{ margin: 0, fontSize: 14, color: "#b0aa98", lineHeight: 1.8 }}>
                  {MOCK_SUMMARY.find(s => s.slide === activeSlide)?.text || "No summary available for this slide."}
                </p>
              </div>

              <p style={{ margin: "0 0 14px", fontSize: 10, color: "#444", letterSpacing: "0.15em", textTransform: "uppercase" }}>Key Points</p>
              {MOCK_TRANSCRIPT.filter(t => t.slide === activeSlide).map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: 14, marginBottom: 16,
                  padding: "14px 16px",
                  background: "#0f0f18",
                  borderRadius: 10,
                  border: "1px solid #1a1a2a",
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    border: "1px solid #2a2a4e",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: "#555", flexShrink: 0,
                  }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: 13, color: "#9090a0", lineHeight: 1.7 }}>{item.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "transcript" && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              {MOCK_TRANSCRIPT.filter(t => t.slide === activeSlide).map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: 16, marginBottom: 18,
                  paddingBottom: 18,
                  borderBottom: "1px solid #1a1a2a",
                }}>
                  <span style={{
                    fontSize: 11, color: "#c8a96e66", minWidth: 42,
                    paddingTop: 2, fontFamily: "monospace",
                  }}>{item.time}</span>
                  <p style={{ margin: 0, fontSize: 14, color: "#9898a8", lineHeight: 1.8 }}>{item.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "flashcards" && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <p style={{ margin: "0 0 20px", fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                AI-generated from this slide's content. Tap to flip.
              </p>
              {[
                { q: "What is neuroplasticity?", a: "The brain's ability to reorganize itself by forming new neural connections throughout life." },
                { q: "What does Hebb's Rule state?", a: "Neurons that fire together, wire together — repeated co-activation strengthens synaptic connections." },
                { q: "What are NMDA receptors?", a: "Coincidence detectors in LTP that require simultaneous pre and post-synaptic activation to allow calcium entry." },
              ].slice(0, activeSlide === 1 ? 1 : activeSlide === 2 ? 2 : 3).map((card, i) => (
                <FlashCard key={i} q={card.q} a={card.a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FlashCard({ q, a }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div onClick={() => setFlipped(f => !f)} style={{
      background: flipped
        ? "linear-gradient(135deg, #1a1a0a, #0a1a0a)"
        : "linear-gradient(135deg, #0f0f1e, #1a1a2e)",
      border: `1px solid ${flipped ? "#3a6a3a66" : "#2a2a5e"}`,
      borderRadius: 14,
      padding: "24px 28px",
      cursor: "pointer",
      marginBottom: 16,
      minHeight: 100,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      transition: "all 0.3s ease",
      animation: "fadeIn 0.3s ease",
    }}>
      <p style={{ margin: "0 0 6px", fontSize: 10, color: flipped ? "#5aba5a" : "#c8a96e", letterSpacing: "0.15em" }}>
        {flipped ? "ANSWER" : "QUESTION"}
      </p>
      <p style={{ margin: 0, fontSize: 14, color: "#c8c4b8", lineHeight: 1.7 }}>
        {flipped ? a : q}
      </p>
      <p style={{ margin: "10px 0 0", fontSize: 10, color: "#333" }}>tap to {flipped ? "see question" : "reveal"}</p>
    </div>
  );
}
