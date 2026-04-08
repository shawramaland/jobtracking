import { useState, useCallback } from "react";
import { QUESTIONS, CHEAT_SHEETS } from "./prepData";

const CATEGORIES = ["All", "Networking", "Windows / AD", "Linux", "Cloud", "VMware", "macOS", "Help Desk", "Behavioral", "Docker", "Kubernetes", "CI/CD", "Bash", "Monitoring", "Incident Response"];
const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];
const DIFF_COLORS = { Easy: "#4ade80", Medium: "#fbbf24", Hard: "#f87171" };

const RATINGS = [
  { key: "correct",  label: "✅ Got it right",  color: "#4ade80", bg: "#1a3b2a", border: "#16a34a", storage: "prep-correct"  },
  { key: "half",     label: "⚡ Half correct",   color: "#fbbf24", bg: "#3b2f1a", border: "#d97706", storage: "prep-half"    },
  { key: "practice", label: "🔄 Needs practice", color: "#f87171", bg: "#3b1a1a", border: "#dc2626", storage: "prep-practice" },
];

function loadSet(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); }
  catch { return new Set(); }
}
function saveSet(key, set) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

// ── FREE LOCAL EVALUATOR ──────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  "the","a","an","is","are","was","were","be","been","being","have","has","had",
  "do","does","did","will","would","could","should","may","might","can","to","of",
  "in","for","on","with","at","by","from","up","about","into","and","but","or",
  "not","only","that","this","it","its","you","your","they","their","if","when",
  "where","which","who","what","how","all","each","every","more","most","other",
  "some","no","as","also","than","very","just","used","use","allow","provide",
  "make","need","give","work","run","called","known","based","set","get","see",
  "let","take","both","either","so","then","than","too","such","over","under",
  "between","out","off","same","new","one","two","three","between","while","after",
  "before","during","through","because","example","using","without","within",
]);

function evaluateLocally(idealAnswer, userAnswer) {
  if (!userAnswer.trim() || userAnswer.trim().length < 15) {
    return { rating: "practice", feedback: "Answer too short — try to explain in more detail.", score: 0, found: 0, total: 0, missed: [] };
  }

  const norm = (t) => t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const idealNorm = norm(idealAnswer);
  const userNorm  = norm(userAnswer);

  const idealWords = idealNorm.split(" ");
  const keywordsSet = new Set();

  // Single keywords: 3+ chars, not a stop word
  idealWords.forEach(w => {
    if (w.length >= 3 && !STOP_WORDS.has(w)) keywordsSet.add(w);
  });

  // 2-word technical phrases (both words meaningful)
  for (let i = 0; i < idealWords.length - 1; i++) {
    const a = idealWords[i], b = idealWords[i + 1];
    if (a.length >= 3 && b.length >= 3 && !STOP_WORDS.has(a) && !STOP_WORDS.has(b)) {
      keywordsSet.add(a + " " + b);
    }
  }

  const keywords = [...keywordsSet];
  const found  = keywords.filter(kw => userNorm.includes(kw));
  const missed = keywords.filter(kw => !userNorm.includes(kw));
  const score  = keywords.length > 0 ? found.length / keywords.length : 0;

  // Pick most meaningful missed terms (prefer shorter single words = key terms)
  const topMissed = missed
    .filter(kw => !kw.includes(" "))   // single words first
    .filter(kw => kw.length >= 4)
    .slice(0, 5);

  let rating, feedback;
  if (score >= 0.65) {
    rating   = "correct";
    feedback = `Great answer! You covered ${found.length} of ${keywords.length} key concepts.`;
  } else if (score >= 0.30) {
    rating   = "half";
    feedback = `Partial — ${found.length}/${keywords.length} concepts covered. Consider also mentioning: ${topMissed.join(", ") || "more detail"}.`;
  } else {
    rating   = "practice";
    feedback = `Needs more study — only ${found.length}/${keywords.length} concepts found. Key terms missing: ${topMissed.join(", ") || "review the ideal answer"}.`;
  }

  return { rating, feedback, score, found: found.length, total: keywords.length, missed: topMissed };
}

// ── MOCK INTERVIEW ────────────────────────────────────────────────────────────
function MockInterview() {
  const [category, setCategory]     = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [userAnswer, setUserAnswer] = useState("");
  const [revealed, setRevealed]     = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [idx, setIdx]               = useState(0);
  const [hideRated, setHideRated]   = useState(false);

  const [ratings, setRatings] = useState(() =>
    Object.fromEntries(RATINGS.map(r => [r.key, loadSet(r.storage)]))
  );

  const ratedIds      = new Set([...ratings.correct, ...ratings.half, ...ratings.practice]);
  const filtered      = QUESTIONS.filter(q =>
    (category === "All" || q.category === category) &&
    (difficulty === "All" || q.difficulty === difficulty) &&
    (!hideRated || !ratedIds.has(q.id))
  );
  const question      = filtered[idx % Math.max(filtered.length, 1)];
  const currentRating = RATINGS.find(r => ratings[r.key].has(question?.id));

  const goTo = useCallback((newIdx) => {
    setRevealed(false);
    setUserAnswer("");
    setEvalResult(null);
    setIdx(newIdx);
  }, []);

  const next    = useCallback(() => goTo((idx + 1) % Math.max(filtered.length, 1)), [idx, filtered.length, goTo]);
  const prev    = useCallback(() => goTo((idx - 1 + filtered.length) % Math.max(filtered.length, 1)), [idx, filtered.length, goTo]);
  const shuffle = useCallback(() => goTo(Math.floor(Math.random() * filtered.length)), [filtered.length, goTo]);

  const applyRating = useCallback((ratingKey, id) => {
    setRatings(prev => {
      const updated = { ...prev };
      RATINGS.forEach(r => {
        const s = new Set(updated[r.key]);
        s.delete(id);
        updated[r.key] = s;
        saveSet(r.storage, s);
      });
      const target = RATINGS.find(r => r.key === ratingKey);
      if (currentRating?.key !== ratingKey && target) {
        const s = new Set(updated[ratingKey]);
        s.add(id);
        updated[ratingKey] = s;
        saveSet(target.storage, s);
      }
      return updated;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRating]);

  const handleCheck = () => {
    const result = evaluateLocally(question.a, userAnswer);
    setEvalResult(result);
    setRevealed(true);
    applyRating(result.rating, question.id);
  };

  const sel = { padding: "6px 10px", fontSize: "12px", background: "var(--surface)", border: "1px solid var(--border2)", color: "var(--text)", fontFamily: "inherit", borderRadius: "6px", cursor: "pointer", outline: "none" };

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
        <select value={category} onChange={e => { setCategory(e.target.value); goTo(0); }} style={sel}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={difficulty} onChange={e => { setDifficulty(e.target.value); goTo(0); }} style={sel}>
          {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <button onClick={() => { setHideRated(s => !s); goTo(0); }}
          style={{ padding: "6px 12px", borderRadius: "6px", border: `1px solid ${hideRated ? "var(--accent)" : "var(--border2)"}`, background: "transparent", color: hideRated ? "var(--accent)" : "var(--text-muted)", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>
          {hideRated ? "Show all" : "Hide rated"}
        </button>
      </div>

      {/* Progress counters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "14px", fontSize: "11px", flexWrap: "wrap" }}>
        <span style={{ color: "var(--text-muted)" }}>{filtered.length} questions</span>
        {RATINGS.map(r => (
          <span key={r.key} style={{ color: r.color }}>{r.label.split(" ")[0]} {ratings[r.key].size}</span>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#475569", fontSize: "13px" }}>
          No questions match. Try changing the filters or turn off "Hide rated".
        </div>
      ) : (
        <>
          {/* Card */}
          <div style={{ background: "var(--surface)", border: `1px solid ${currentRating ? currentRating.border : "var(--border2)"}`, borderRadius: "10px", padding: "20px", marginBottom: "12px", transition: "border-color 0.3s" }}>

            {/* Meta */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: "var(--surface2)", color: "var(--accent)", border: "1px solid var(--border2)" }}>{question.category}</span>
              <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: "var(--bg)", color: DIFF_COLORS[question.difficulty], border: `1px solid ${DIFF_COLORS[question.difficulty]}40` }}>{question.difficulty}</span>
              {currentRating && (
                <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: currentRating.bg, color: currentRating.color, border: `1px solid ${currentRating.border}` }}>{currentRating.label}</span>
              )}
              <span style={{ fontSize: "10px", color: "var(--text-dim)", marginLeft: "auto" }}>{(idx % filtered.length) + 1} / {filtered.length}</span>
            </div>

            {/* Question */}
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#f1f5f9", lineHeight: "1.5", marginBottom: "16px" }}>
              {question.q}
            </div>

            {/* Input phase */}
            {!revealed && (
              <>
                <textarea
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && e.ctrlKey && handleCheck()}
                  placeholder="Type your answer here... (Ctrl+Enter to submit)"
                  rows={4}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "var(--bg)", border: "1px solid var(--border2)", color: "var(--text)", fontSize: "12px", outline: "none", fontFamily: "inherit", resize: "vertical", lineHeight: "1.6" }}
                />
                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  <button onClick={handleCheck}
                    style={{ flex: 1, padding: "12px", borderRadius: "8px", background: userAnswer.trim() ? "var(--accent)" : "var(--surface)", border: userAnswer.trim() ? "none" : "1px dashed var(--border2)", color: userAnswer.trim() ? "#fff" : "var(--text-muted)", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "inherit", letterSpacing: "1px" }}>
                    {userAnswer.trim() ? "📊 EVALUATE MY ANSWER" : "💡 JUST SHOW ANSWER"}
                  </button>
                </div>
              </>
            )}

            {/* Results phase */}
            {revealed && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                {/* User's answer */}
                {userAnswer.trim() && (
                  <div style={{ background: "var(--bg)", borderRadius: "8px", padding: "14px", border: "1px solid var(--border2)" }}>
                    <div style={{ fontSize: "10px", letterSpacing: "2px", color: "var(--text-muted)", marginBottom: "8px" }}>YOUR ANSWER</div>
                    <div style={{ fontSize: "12px", color: "var(--text)", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>{userAnswer}</div>
                  </div>
                )}

                {/* Evaluation verdict */}
                {evalResult && userAnswer.trim() && (() => {
                  const r = RATINGS.find(r => r.key === evalResult.rating) || RATINGS[2];
                  return (
                    <div style={{ background: r.bg, borderRadius: "8px", padding: "14px", border: `1px solid ${r.border}` }}>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: r.color, marginBottom: "6px" }}>{r.label}</div>
                      <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: "1.6" }}>{evalResult.feedback}</div>
                      <div style={{ marginTop: "8px", height: "4px", background: "#0d0d0d", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${Math.round(evalResult.score * 100)}%`, background: r.border, borderRadius: "2px", transition: "width 0.6s ease" }} />
                      </div>
                      <div style={{ fontSize: "10px", color: "#555", marginTop: "4px" }}>
                        {Math.round(evalResult.score * 100)}% keyword coverage ({evalResult.found}/{evalResult.total} concepts)
                      </div>
                    </div>
                  );
                })()}

                {/* Ideal answer */}
                <div style={{ background: "var(--bg)", borderRadius: "8px", padding: "14px", border: "1px solid var(--border2)" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "2px", color: "var(--accent)", marginBottom: "8px" }}>IDEAL ANSWER</div>
                  <pre style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.7", whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                    {question.a}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Override rating (always visible after reveal) */}
          {revealed && (
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "10px", color: "var(--text-dim)", marginBottom: "8px", letterSpacing: "1px" }}>
                {evalResult && userAnswer.trim() ? "OVERRIDE RATING:" : "RATE YOURSELF:"}
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {RATINGS.map(r => {
                  const active = currentRating?.key === r.key;
                  return (
                    <button key={r.key} onClick={() => applyRating(r.key, question.id)}
                      style={{ flex: 1, padding: "10px 8px", borderRadius: "6px", border: `1px solid ${active ? r.border : "var(--border2)"}`, background: active ? r.bg : "transparent", color: active ? r.color : "var(--text-dim)", fontSize: "11px", cursor: "pointer", fontFamily: "inherit", fontWeight: active ? "700" : "400", transition: "all 0.2s", minWidth: "90px" }}>
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={prev} style={{ padding: "10px 16px", borderRadius: "6px", border: "1px solid var(--border2)", background: "transparent", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>← Prev</button>
            <button onClick={shuffle} style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid var(--border2)", background: "transparent", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>🔀 Shuffle</button>
            <button onClick={next} style={{ padding: "10px 16px", borderRadius: "6px", background: "var(--accent)", border: "none", color: "#fff", fontSize: "12px", fontWeight: "800", cursor: "pointer", fontFamily: "inherit" }}>Next →</button>
          </div>
        </>
      )}
    </div>
  );
}

// ── CHEAT SHEETS ──────────────────────────────────────────────────────────────
function CheatSheets() {
  const [activeSheet, setActiveSheet] = useState(CHEAT_SHEETS[0].id);
  const [openSections, setOpenSections] = useState({});
  const sheet = CHEAT_SHEETS.find(s => s.id === activeSheet);
  const toggleSection = (title) => setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));

  return (
    <div>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
        {CHEAT_SHEETS.map(s => (
          <button key={s.id} onClick={() => setActiveSheet(s.id)}
            style={{ padding: "8px 14px", borderRadius: "6px", border: `1px solid ${activeSheet === s.id ? "var(--accent)" : "var(--border2)"}`, background: activeSheet === s.id ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent", color: activeSheet === s.id ? "var(--accent)" : "var(--text-muted)", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
            {s.emoji} {s.title}
          </button>
        ))}
      </div>
      {sheet.sections.map(section => {
        const isOpen = openSections[section.title] !== false;
        return (
          <div key={section.title} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", marginBottom: "8px", overflow: "hidden" }}>
            <div onClick={() => toggleSection(section.title)}
              style={{ padding: "12px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: isOpen ? "var(--surface2)" : "transparent" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--text)" }}>{section.title}</span>
              <span style={{ color: "var(--text-dim)", fontSize: "12px", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▼</span>
            </div>
            {isOpen && (
              <div style={{ padding: "0 16px 16px" }}>
                <pre style={{ margin: 0, fontSize: "11px", color: "var(--text-muted)", lineHeight: "1.8", whiteSpace: "pre-wrap", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", background: "var(--bg)", padding: "12px", borderRadius: "6px", overflowX: "auto" }}>
                  {section.content}
                </pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── PREP TAB ──────────────────────────────────────────────────────────────────
export default function PrepTab() {
  const [mode, setMode] = useState("mock");

  return (
    <div style={{ paddingBottom: "40px" }}>
      <div style={{ fontSize: "10px", letterSpacing: "3px", color: "var(--accent)", marginBottom: "16px", textAlign: "center" }}>▶ PREP.exe</div>

      <div style={{ display: "flex", gap: "6px", marginBottom: "20px", background: "var(--bg)", borderRadius: "8px", padding: "4px", border: "1px solid var(--border)" }}>
        {[{ id: "mock", label: "🎤 Mock Interview" }, { id: "sheets", label: "📋 Cheat Sheets" }].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "none", background: mode === m.id ? "var(--surface2)" : "transparent", color: mode === m.id ? "var(--accent)" : "var(--text-muted)", fontSize: "12px", fontWeight: mode === m.id ? "800" : "400", cursor: "pointer", fontFamily: "inherit", borderBottom: mode === m.id ? `2px solid var(--accent)` : "2px solid transparent", transition: "all 0.2s" }}>
            {m.label}
          </button>
        ))}
      </div>

      {mode === "mock"   && <MockInterview />}
      {mode === "sheets" && <CheatSheets />}
    </div>
  );
}
