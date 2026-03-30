import { useState, useEffect, useCallback, useRef } from "react";
import * as Tone from "tone";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import PrepTab from "./PrepTab";

// Local storage wrapper for browser
window.storage = {
  get: async (key) => {
    const val = localStorage.getItem(key);
    if (val === null) throw new Error("Key not found");
    return { value: val };
  },
  set: async (key, value) => {
    localStorage.setItem(key, value);
    return { key, value };
  },
  delete: async (key) => {
    localStorage.removeItem(key);
    return { key, deleted: true };
  },
  list: async (prefix) => {
    const keys = Object.keys(localStorage).filter(k => !prefix || k.startsWith(prefix));
    return { keys };
  },
};


const STATUSES = ["Applied", "HR Call", "Interview", "Technical", "Offer", "Rejected", "Declined", "Bullet Dodged", "No Response"];
const SOURCES = ["LinkedIn", "AllJobs", "Drushim", "Company Site", "Referral", "Other"];

const STATUS_COLORS = {
  "Applied": { bg: "#1e3a5f", border: "#2563eb", text: "#60a5fa" },
  "HR Call": { bg: "#3b2f1a", border: "#d97706", text: "#fbbf24" },
  "Interview": { bg: "#2d1f3d", border: "#7c3aed", text: "#a78bfa" },
  "Technical": { bg: "#1a2f3b", border: "#0891b2", text: "#22d3ee" },
  "Offer": { bg: "#1a3b2a", border: "#16a34a", text: "#4ade80" },
  "Rejected": { bg: "#3b1a1a", border: "#dc2626", text: "#f87171" },
  "Declined": { bg: "#2d2a1a", border: "#ca8a04", text: "#facc15" },
  "Bullet Dodged": { bg: "#1a2d1a", border: "#15803d", text: "#86efac" },
  "No Response": { bg: "#1e1e2e", border: "#475569", text: "#94a3b8" },
};

const STATUS_EMOJIS = {
  "Applied": "📤", "HR Call": "📞", "Interview": "🎤",
  "Technical": "🧠", "Offer": "🎉", "Rejected": "💀", "Declined": "✋", "Bullet Dodged": "😎", "No Response": "👻",
};

const STATUS_QUIPS = {
  "Applied": ["Oh boy, here we go again!", "Another one into the void!", "Fingers crossed!", "Let's gooo!"],
  "HR Call": ["They called!! Act cool!", "Don't panic. DON'T PANIC.", "This is not a drill!"],
  "Interview": ["Suit up! (or at least a clean shirt)", "You got this, Garry!", "Elevator pitch: READY"],
  "Technical": ["Big brain time!", "Show them what you know!", "GCP powers: ACTIVATE"],
  "Offer": ["NO WAY!! LET'S GOOOOO!", "YOU DID IT!!", "Time to negotiate like a boss!"],
  "Rejected": ["FUAHHH!", "Their loss, not yours.", "Next! NEXT!!", "Pain. But we move."],
  "Declined": ["Thanks but no thanks!", "I know my worth.", "Not this one, chief.", "On to better things!"],
  "Bullet Dodged": ["Phew! That was close!", "3.2 on Glassdoor? NOPE.", "Saved by the red flags!", "Matrix dodge activated!", "Thank you, NEXT."],
  "No Response": ["Hello? Anyone home?", "Ghosted again...", "*tumbleweed rolls by*"],
};

function playStatusSound(status) {
  try {
    const now = Tone.now();
    if (status === "Applied") {
      const synth = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 } }).toDestination();
      synth.triggerAttackRelease("C5", "8n", now);
      synth.triggerAttackRelease("E5", "8n", now + 0.12);
      setTimeout(() => synth.dispose(), 1000);
    } else if (status === "HR Call") {
      const synth = new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.01, decay: 0.15, sustain: 0.1, release: 0.1 } }).toDestination();
      synth.triggerAttackRelease("A5", "16n", now);
      synth.triggerAttackRelease("E6", "16n", now + 0.1);
      synth.triggerAttackRelease("A5", "16n", now + 0.3);
      synth.triggerAttackRelease("E6", "16n", now + 0.4);
      setTimeout(() => synth.dispose(), 1000);
    } else if (status === "Interview") {
      const synth = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.05, decay: 0.3, sustain: 0.2, release: 0.2 } }).toDestination();
      synth.volume.value = -8;
      synth.triggerAttackRelease("C4", "8n", now);
      synth.triggerAttackRelease("E4", "8n", now + 0.15);
      synth.triggerAttackRelease("G4", "8n", now + 0.3);
      synth.triggerAttackRelease("C5", "4n", now + 0.45);
      setTimeout(() => synth.dispose(), 1500);
    } else if (status === "Technical") {
      const synth = new Tone.Synth({ oscillator: { type: "sawtooth" }, envelope: { attack: 0.01, decay: 0.08, sustain: 0, release: 0.05 } }).toDestination();
      synth.volume.value = -12;
      ["C6","D6","F6","C6","G6","A6"].forEach((n, i) => synth.triggerAttackRelease(n, "32n", now + i * 0.07));
      setTimeout(() => synth.dispose(), 1000);
    } else if (status === "Offer") {
      const synth = new Tone.PolySynth(Tone.Synth).toDestination();
      synth.volume.value = -6;
      synth.triggerAttackRelease(["C4","E4","G4"], "8n", now);
      synth.triggerAttackRelease(["C4","E4","G4"], "8n", now + 0.2);
      synth.triggerAttackRelease(["C4","F4","A4"], "8n", now + 0.4);
      synth.triggerAttackRelease(["D4","G4","B4"], "8n", now + 0.6);
      synth.triggerAttackRelease(["E4","G4","C5"], "2n", now + 0.8);
      setTimeout(() => synth.dispose(), 3000);
    } else if (status === "Rejected") {
      try {
        const audio = new Audio("/Fahhh.mp3");
        audio.volume = 0.8;
        audio.play();
      } catch (e2) { console.log("mp3 failed:", e2); }
    } else if (status === "Declined") {
      const synth = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.1 } }).toDestination();
      synth.volume.value = -8;
      synth.triggerAttackRelease("E5", "16n", now);
      synth.triggerAttackRelease("C5", "16n", now + 0.1);
      synth.triggerAttackRelease("G4", "8n", now + 0.2);
      setTimeout(() => synth.dispose(), 1000);
    } else if (status === "Bullet Dodged") {
      const synth = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.2 } }).toDestination();
      synth.volume.value = -6;
      synth.triggerAttackRelease("C4", "32n", now);
      synth.triggerAttackRelease("G5", "16n", now + 0.05);
      synth.triggerAttackRelease("C6", "16n", now + 0.1);
      const synth2 = new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.1, decay: 0.3, sustain: 0.1, release: 0.3 } }).toDestination();
      synth2.volume.value = -8;
      synth2.triggerAttackRelease("E5", "8n", now + 0.3);
      synth2.triggerAttackRelease("C5", "4n", now + 0.5);
      setTimeout(() => { synth.dispose(); synth2.dispose(); }, 1500);
    } else if (status === "No Response") {
      const noise = new Tone.Noise("pink").toDestination();
      noise.volume.value = -20;
      noise.start(now); noise.stop(now + 0.8);
      const synth = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.3, decay: 0.5, sustain: 0, release: 0.3 } }).toDestination();
      synth.volume.value = -15;
      synth.triggerAttackRelease("E6", "8n", now + 0.2);
      synth.triggerAttackRelease("E6", "8n", now + 0.5);
      setTimeout(() => { noise.dispose(); synth.dispose(); }, 2000);
    }
  } catch (e) { console.log("Sound failed:", e); }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function parseRows(rows) {
  const imported = [];
  let skipped = 0;

  rows.forEach((row) => {
    const companyVal = row["Company"] || row["company"] || row["Company Name"] || "";
    const roleVal = row["Role"] || row["role"] || row["Job Title"] || row["Position"] || "";
    const sourceVal = row["Source"] || row["source"] || "";
    const statusVal = row["Status"] || row["status"] || "Applied";
    const notesVal = row["Notes"] || row["notes"] || "";
    const dateVal = row["Date Applied"] || row["Date"] || row["date"] || "";
    const linkVal = row["Link"] || row["link"] || row["URL"] || row["url"] || "";

    if (!companyVal.toString().trim() || !roleVal.toString().trim()) {
      skipped++;
      return;
    }

    let parsedDate;
    if (dateVal) {
      // Handle DD/MM/YYYY format
      const ddmmyyyy = dateVal.toString().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (ddmmyyyy) {
        parsedDate = new Date(`${ddmmyyyy[3]}-${ddmmyyyy[2].padStart(2,"0")}-${ddmmyyyy[1].padStart(2,"0")}`).toISOString();
      } else {
        const d = new Date(dateVal);
        parsedDate = isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
      }
    } else {
      parsedDate = new Date().toISOString();
    }

    const matchedStatus = STATUSES.find(s => s.toLowerCase() === statusVal.toString().toLowerCase().trim()) || "Applied";
    const matchedSource = SOURCES.find(s => s.toLowerCase() === sourceVal.toString().toLowerCase().trim()) || "Other";

    imported.push({
      id: Date.now() + Math.random() * 10000,
      company: companyVal.toString().trim(),
      role: roleVal.toString().trim(),
      source: matchedSource,
      date: parsedDate,
      status: matchedStatus,
      notes: notesVal.toString().trim(),
      link: linkVal.toString().trim(),
    });
  });

  return { imported, skipped };
}

// ── DASHBOARD COMPONENT ──────────────────────────────────────────────────────
function Dashboard({ jobs }) {
  const total = jobs.length;
  const stats = STATUSES.reduce((acc, s) => { acc[s] = jobs.filter(j => j.status === s).length; return acc; }, {});
  const responded = total - (stats["Applied"] || 0) - (stats["No Response"] || 0);
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;
  const offerRate = total > 0 ? Math.round(((stats["Offer"] || 0) / total) * 100) : 0;
  const inProgress = (stats["HR Call"] || 0) + (stats["Interview"] || 0) + (stats["Technical"] || 0);

  const sourceStats = SOURCES.map(s => ({ source: s, count: jobs.filter(j => j.source === s).length })).filter(s => s.count > 0).sort((a, b) => b.count - a.count);
  const maxSourceCount = Math.max(...sourceStats.map(s => s.count), 1);

  // Weekly applications grouped
  const weeklyData = (() => {
    const weeks = {};
    jobs.forEach(j => {
      const d = new Date(j.date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const key = weekStart.toISOString().slice(0, 10);
      weeks[key] = (weeks[key] || 0) + 1;
    });
    return Object.entries(weeks).sort((a, b) => a[0].localeCompare(b[0])).slice(-8);
  })();
  const maxWeekly = Math.max(...weeklyData.map(w => w[1]), 1);

  const card = (label, value, sub, color) => (
    <div style={{ background: "rgba(30,41,59,0.8)", border: `1px solid ${color}30`, borderRadius: "10px", padding: "16px 20px", flex: "1 1 140px", minWidth: "140px" }}>
      <div style={{ fontSize: "22px", fontWeight: "800", color }}>{value}</div>
      <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{label}</div>
      {sub && <div style={{ fontSize: "10px", color: "#475569", marginTop: "4px" }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ padding: "0 0 40px 0" }}>
      <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#22d3ee", marginBottom: "16px", textAlign: "center" }}>▶ STATS.exe</div>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
        {card("TOTAL APPS", total, null, "#22d3ee")}
        {card("RESPONSE RATE", `${responseRate}%`, `${responded} responded`, "#818cf8")}
        {card("IN PROGRESS", inProgress, "active pipelines", "#fbbf24")}
        {card("OFFERS", stats["Offer"] || 0, `${offerRate}% conversion`, "#4ade80")}
      </div>

      {/* Status breakdown bar chart */}
      <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid #1e3a5f", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#64748b", marginBottom: "14px" }}>STATUS BREAKDOWN</div>
        {STATUSES.filter(s => stats[s] > 0).map(s => (
          <div key={s} style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "3px" }}>
              <span style={{ color: STATUS_COLORS[s].text }}>{STATUS_EMOJIS[s]} {s}</span>
              <span style={{ color: "#64748b" }}>{stats[s]} ({Math.round((stats[s] / total) * 100)}%)</span>
            </div>
            <div style={{ background: "#0f172a", borderRadius: "3px", height: "6px", overflow: "hidden" }}>
              <div style={{ width: `${(stats[s] / total) * 100}%`, height: "100%", background: STATUS_COLORS[s].border, borderRadius: "3px", transition: "width 0.6s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Source breakdown */}
      <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid #1e3a5f", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#64748b", marginBottom: "14px" }}>SOURCE BREAKDOWN</div>
        {sourceStats.map(({ source, count }) => (
          <div key={source} style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "3px" }}>
              <span style={{ color: "#94a3b8" }}>{source}</span>
              <span style={{ color: "#64748b" }}>{count}</span>
            </div>
            <div style={{ background: "#0f172a", borderRadius: "3px", height: "6px", overflow: "hidden" }}>
              <div style={{ width: `${(count / maxSourceCount) * 100}%`, height: "100%", background: "#818cf8", borderRadius: "3px", transition: "width 0.6s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Weekly trend */}
      {weeklyData.length > 1 && (
        <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid #1e3a5f", borderRadius: "10px", padding: "16px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#64748b", marginBottom: "14px" }}>WEEKLY ACTIVITY</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "80px" }}>
            {weeklyData.map(([week, count]) => (
              <div key={week} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ fontSize: "9px", color: "#475569" }}>{count}</div>
                <div style={{ width: "100%", height: `${(count / maxWeekly) * 60}px`, background: "linear-gradient(180deg, #22d3ee, #818cf8)", borderRadius: "3px 3px 0 0", minHeight: "4px", transition: "height 0.6s ease" }} />
                <div style={{ fontSize: "8px", color: "#334155", writingMode: "vertical-rl", textOrientation: "mixed" }}>{week.slice(5)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {total === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#334155", fontSize: "13px" }}>No data yet. Start logging applications!</div>
      )}
    </div>
  );
}

// ── MINI GAME COMPONENT ───────────────────────────────────────────────────────
const GAME_WIDTH = 340;
const GAME_HEIGHT = 380;
const PLAYER_W = 50;
const PLAYER_H = 20;
const ITEM_SIZE = 28;

function MiniGame() {
  const [gameState, setGameState] = useState("idle"); // idle | playing | dead
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("game-highscore") || "0"));
  const [lives, setLives] = useState(3);
  const [playerX, setPlayerX] = useState(GAME_WIDTH / 2 - PLAYER_W / 2);
  const [items, setItems] = useState([]);
  const [particles, setParticles] = useState([]);
  const [combo, setCombo] = useState(0);
  const [comboText, setComboText] = useState(null);
  const stateRef = useRef({ playerX: GAME_WIDTH / 2 - PLAYER_W / 2, items: [], score: 0, lives: 3, combo: 0, gameState: "idle" });
  const frameRef = useRef(null);
  const lastItemRef = useRef(0);
  const keysRef = useRef({});
  const touchStartRef = useRef(null);

  const spawnItem = useCallback(() => {
    const isGood = Math.random() < 0.35;
    const types = isGood
      ? [{ emoji: "🎉", label: "OFFER", pts: 10 }, { emoji: "📞", label: "HR CALL", pts: 5 }, { emoji: "🎤", label: "INTERVIEW", pts: 7 }]
      : [{ emoji: "💀", label: "REJECT", pts: -1 }, { emoji: "👻", label: "GHOST", pts: -1 }];
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      id: Date.now() + Math.random(),
      x: Math.random() * (GAME_WIDTH - ITEM_SIZE),
      y: -ITEM_SIZE,
      speed: 2 + Math.random() * 2 + stateRef.current.score / 120,
      ...type,
    };
  }, []);

  const startGame = useCallback(() => {
    stateRef.current = { playerX: GAME_WIDTH / 2 - PLAYER_W / 2, items: [], score: 0, lives: 3, combo: 0, gameState: "playing" };
    setPlayerX(GAME_WIDTH / 2 - PLAYER_W / 2);
    setItems([]);
    setScore(0);
    setLives(3);
    setCombo(0);
    setParticles([]);
    setGameState("playing");
    lastItemRef.current = 0;
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKey = (e) => {
      keysRef.current[e.key] = e.type === "keydown";
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKey);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      return;
    }

    const PLAYER_SPEED = 5;

    const loop = (ts) => {
      const s = stateRef.current;

      // Move player
      if (keysRef.current["ArrowLeft"] || keysRef.current["a"]) {
        s.playerX = Math.max(0, s.playerX - PLAYER_SPEED);
      }
      if (keysRef.current["ArrowRight"] || keysRef.current["d"]) {
        s.playerX = Math.min(GAME_WIDTH - PLAYER_W, s.playerX + PLAYER_SPEED);
      }

      // Spawn items
      const spawnInterval = Math.max(600, 1200 - s.score * 3);
      if (ts - lastItemRef.current > spawnInterval) {
        s.items = [...s.items, spawnItem()];
        lastItemRef.current = ts;
      }

      // Move items & check collisions
      const playerTop = GAME_HEIGHT - PLAYER_H - 10;
      const newParticles = [];
      let scoreChange = 0;
      let livesChange = 0;
      let comboChange = s.combo;
      let hitGood = false;

      s.items = s.items
        .map(item => ({ ...item, y: item.y + item.speed }))
        .filter(item => {
          if (item.y > GAME_HEIGHT) {
            if (item.pts > 0) comboChange = 0; // missed good item resets combo
            return false;
          }
          // Collision check
          if (
            item.y + ITEM_SIZE > playerTop &&
            item.y < playerTop + PLAYER_H &&
            item.x + ITEM_SIZE > s.playerX &&
            item.x < s.playerX + PLAYER_W
          ) {
            if (item.pts > 0) {
              comboChange++;
              const multiplier = Math.min(comboChange, 5);
              scoreChange += item.pts * multiplier;
              hitGood = true;
            } else {
              livesChange--;
              comboChange = 0;
            }
            // Spawn particles
            for (let i = 0; i < 6; i++) {
              newParticles.push({
                id: Math.random(),
                x: item.x + ITEM_SIZE / 2,
                y: item.y,
                vx: (Math.random() - 0.5) * 6,
                vy: -(Math.random() * 4 + 1),
                color: item.pts > 0 ? "#4ade80" : "#f87171",
                life: 1,
              });
            }
            return false;
          }
          return true;
        });

      s.combo = comboChange;
      s.score = Math.max(0, s.score + scoreChange);
      s.lives = s.lives + livesChange;

      setPlayerX(s.playerX);
      setItems([...s.items]);
      setScore(s.score);
      setLives(s.lives);
      setCombo(s.combo);

      if (newParticles.length > 0) {
        setParticles(prev => [...prev.slice(-30), ...newParticles]);
      }
      if (hitGood && comboChange > 1) {
        setComboText({ text: `x${Math.min(comboChange, 5)} COMBO!`, id: Date.now() });
        setTimeout(() => setComboText(null), 800);
      }

      setParticles(prev =>
        prev.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.2, life: p.life - 0.05 }))
          .filter(p => p.life > 0)
      );

      if (s.lives <= 0) {
        s.gameState = "dead";
        setGameState("dead");
        const newHigh = Math.max(s.score, parseInt(localStorage.getItem("game-highscore") || "0"));
        localStorage.setItem("game-highscore", newHigh);
        setHighScore(newHigh);
        return;
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [gameState, spawnItem]);

  const handleTouchStart = (e) => { touchStartRef.current = e.touches[0].clientX; };
  const handleTouchMove = (e) => {
    if (!touchStartRef.current) return;
    const dx = e.touches[0].clientX - touchStartRef.current;
    touchStartRef.current = e.touches[0].clientX;
    stateRef.current.playerX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_W, stateRef.current.playerX + dx));
  };

  const handleMouseMove = (e) => {
    if (gameState !== "playing") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - PLAYER_W / 2;
    stateRef.current.playerX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_W, x));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: "40px" }}>
      <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#22d3ee", marginBottom: "8px" }}>▶ CATCH.exe</div>
      <div style={{ fontSize: "11px", color: "#475569", marginBottom: "16px", textAlign: "center" }}>
        Catch offers 🎉 and interviews 🎤 — dodge rejections 💀
        <br /><span style={{ color: "#334155" }}>Mouse / arrow keys / touch to move</span>
      </div>

      <div style={{ display: "flex", gap: "24px", marginBottom: "12px", fontSize: "12px" }}>
        <span style={{ color: "#22d3ee" }}>SCORE: <b>{score}</b></span>
        <span style={{ color: "#fbbf24" }}>BEST: <b>{highScore}</b></span>
        <span style={{ color: "#f87171" }}>{"❤".repeat(lives)}{"🖤".repeat(Math.max(0, 3 - lives))}</span>
      </div>

      {combo > 1 && comboText && (
        <div style={{ position: "absolute", fontSize: "16px", fontWeight: "800", color: "#fbbf24", zIndex: 50, animation: "popIn 0.3s ease-out", pointerEvents: "none" }}>
          {comboText.text}
        </div>
      )}

      <div
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT, background: "rgba(10,14,23,0.95)", border: "1px solid #1e3a5f", borderRadius: "10px", position: "relative", overflow: "hidden", cursor: gameState === "playing" ? "none" : "default", userSelect: "none" }}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Scanlines */}
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)", pointerEvents: "none", zIndex: 5 }} />

        {gameState === "idle" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
            <div style={{ fontSize: "32px" }}>💼</div>
            <div style={{ fontSize: "14px", color: "#22d3ee", fontWeight: "800", letterSpacing: "3px" }}>CATCH.exe</div>
            <div style={{ fontSize: "11px", color: "#64748b", textAlign: "center", lineHeight: "1.6" }}>
              Catch offers, HR calls & interviews<br />Dodge rejections & ghosts<br />Combos multiply points!
            </div>
            <button onClick={startGame} style={{ padding: "10px 32px", background: "linear-gradient(135deg, #22d3ee, #818cf8)", border: "none", borderRadius: "6px", color: "#0a0e17", fontWeight: "800", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "2px" }}>START GRIND</button>
            {highScore > 0 && <div style={{ fontSize: "11px", color: "#334155" }}>Best: {highScore}</div>}
          </div>
        )}

        {gameState === "dead" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", background: "rgba(10,14,23,0.9)", zIndex: 10 }}>
            <div style={{ fontSize: "28px" }}>💀</div>
            <div style={{ fontSize: "14px", color: "#f87171", fontWeight: "800" }}>GAME OVER</div>
            <div style={{ fontSize: "20px", color: "#22d3ee", fontWeight: "800" }}>{score} pts</div>
            {score === highScore && score > 0 && <div style={{ fontSize: "11px", color: "#fbbf24" }}>🏆 NEW HIGH SCORE!</div>}
            <div style={{ fontSize: "11px", color: "#475569" }}>Best: {highScore}</div>
            <button onClick={startGame} style={{ padding: "10px 32px", background: "linear-gradient(135deg, #22d3ee, #818cf8)", border: "none", borderRadius: "6px", color: "#0a0e17", fontWeight: "800", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "2px" }}>TRY AGAIN</button>
          </div>
        )}

        {gameState === "playing" && (
          <>
            {items.map(item => (
              <div key={item.id} style={{ position: "absolute", left: item.x, top: item.y, fontSize: ITEM_SIZE - 4, lineHeight: 1, userSelect: "none", zIndex: 3, filter: item.pts < 0 ? "drop-shadow(0 0 4px #dc2626)" : "drop-shadow(0 0 4px #22d3ee)" }}>
                {item.emoji}
              </div>
            ))}

            {particles.map(p => (
              <div key={p.id} style={{ position: "absolute", left: p.x, top: p.y, width: 4, height: 4, borderRadius: "50%", background: p.color, opacity: p.life, pointerEvents: "none", zIndex: 4 }} />
            ))}

            {/* Player */}
            <div style={{ position: "absolute", left: playerX, top: GAME_HEIGHT - PLAYER_H - 10, width: PLAYER_W, height: PLAYER_H, background: "linear-gradient(90deg, #22d3ee, #818cf8)", borderRadius: "4px", zIndex: 6, boxShadow: "0 0 12px #22d3ee80" }}>
              <div style={{ textAlign: "center", fontSize: "10px", lineHeight: `${PLAYER_H}px`, color: "#0a0e17", fontWeight: "800" }}>YOU</div>
            </div>

            {/* Ground line */}
            <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, height: 1, background: "#1e3a5f", zIndex: 2 }} />
          </>
        )}
      </div>

      {gameState === "playing" && combo > 1 && (
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#fbbf24" }}>🔥 {combo} combo (x{Math.min(combo, 5)} pts)</div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function JobLogger() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [source, setSource] = useState("LinkedIn");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editSalaryMin, setEditSalaryMin] = useState("");
  const [editSalaryMax, setEditSalaryMax] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [flash, setFlash] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(true);
  const [quip, setQuip] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [toneStarted, setToneStarted] = useState(false);
  const [importMsg, setImportMsg] = useState(null);
  const [tab, setTab] = useState("tracker"); // tracker | dashboard | game
  const fileInputRef = useRef(null);

  const SEED_DATA = [
    { company: "COMDA", role: "Customer Technical Support", source: "LinkedIn", status: "Applied", date: "2026-03-10", notes: "" },
    { company: "NeoTech Israel", role: "System Administrator", source: "LinkedIn", status: "Applied", date: "2026-03-10", notes: "Resume downloaded" },
    { company: "comblack", role: "NOC Operator", source: "LinkedIn", status: "Applied", date: "2026-03-10", notes: "" },
    { company: "Tata Consultancy Services", role: "Network Operations Center Operator", source: "LinkedIn", status: "Applied", date: "2026-03-10", notes: "" },
    { company: "comblack", role: "Desktop Support Technician", source: "LinkedIn", status: "Applied", date: "2026-03-10", notes: "" },
    { company: "Flashy", role: "Customer Onboarding Specialist", source: "LinkedIn", status: "Applied", date: "2026-03-08", notes: "Application viewed" },
    { company: "Up-Link Networks", role: "Help Desk Technician", source: "LinkedIn", status: "Applied", date: "2026-03-08", notes: "Application viewed" },
    { company: "INGIMA", role: "Cloud Infrastructure Security Expert", source: "LinkedIn", status: "Applied", date: "2026-03-08", notes: "" },
    { company: "Cyber 2.0", role: "System Administrator", source: "LinkedIn", status: "Applied", date: "2026-03-08", notes: "Resume downloaded" },
    { company: "GNESS", role: "IT Operations Specialist", source: "LinkedIn", status: "Applied", date: "2026-03-08", notes: "" },
    { company: "NeoTech Israel", role: "Information Technology Help Desk", source: "LinkedIn", status: "Applied", date: "2026-03-08", notes: "" },
    { company: "Mercedes-Benz R&D Tel-Aviv", role: "IT Coordinator", source: "LinkedIn", status: "Applied", date: "2026-03-08", notes: "" },
    { company: "i24NEWS", role: "Technician", source: "LinkedIn", status: "Applied", date: "2026-03-08", notes: "Resume downloaded" },
    { company: "Shekulo Tov Group", role: "IT and Helpdesk Expert", source: "LinkedIn", status: "Applied", date: "2026-03-08", notes: "" },
    { company: "Confidential Careers", role: "Junior IT Risk Management Analyst", source: "LinkedIn", status: "Applied", date: "2026-03-08", notes: "" },
    { company: "RGE Group Ltd.", role: "IT MEDIA", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "" },
    { company: "comblack", role: "Cloud Infrastructure & Operations Engineer", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "" },
    { company: "comblack", role: "Monitoring & Control Systems Specialist", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "" },
    { company: "ONE Technologies", role: "Help Desk Technician", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "Application viewed" },
    { company: "NeoTech Israel", role: "Information Technology Help Desk", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "Application viewed" },
    { company: "Extreme", role: "Infrastructure Operations Engineer", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "" },
    { company: "YouCC Technologies Ltd.", role: "Help Desk Specialist", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "Application viewed" },
    { company: "Exsitu Cloud IT Services Ltd.", role: "Information Technology Help Desk Support", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "Application viewed" },
    { company: "Datacube", role: "Network Specialist", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "" },
    { company: "Yael Group", role: "Junior System Administrator", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "" },
    { company: "Datacube", role: "VDI Specialist", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "Application viewed" },
    { company: "SQLink Group", role: "GCP Expert", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "" },
    { company: "Vonage", role: "Desktop & Technical Support Specialist", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "Resume downloaded" },
    { company: "Blue Parking (Technoso)", role: "Technical Support Representative", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "" },
    { company: "One Systems", role: "Computer Technician", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "" },
    { company: "Spines", role: "System Admin", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "" },
    { company: "Global-e", role: "Information Systems Administrator", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "" },
    { company: "Partner", role: "Help Desk Technician", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "" },
    { company: "Mertens", role: "Information Technology Support Technician", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "" },
    { company: "eyesAtop", role: "IT & Corporate Infrastructure Engineer", source: "LinkedIn", status: "Applied", date: "2026-02-22", notes: "" },
    { company: "Phoenix Investment House", role: "Information Technology Support Specialist", source: "LinkedIn", status: "Applied", date: "2026-02-22", notes: "Application viewed" },
    { company: "Mertens", role: "Technical Support Specialist", source: "LinkedIn", status: "Applied", date: "2026-02-22", notes: "" },
    { company: "MedOne", role: "IT Cloud and System Virtualization Engineer", source: "LinkedIn", status: "Applied", date: "2026-03-01", notes: "Application viewed" },
    { company: "Extreme", role: "Help Desk Specialist", source: "LinkedIn", status: "Applied", date: "2026-02-22", notes: "" },
    { company: "GNESS", role: "Help Desk Specialist", source: "LinkedIn", status: "Applied", date: "2026-02-22", notes: "" },
    { company: "Ethonia", role: "Help Desk Technician", source: "LinkedIn", status: "HR Call", notes: "Passed HR stage" },
    { company: "Playtika", role: "Office Administrator", source: "LinkedIn", status: "Applied", notes: "" },
    { company: "Technologies HQ", role: "Operations Administrator", source: "LinkedIn", status: "Applied", notes: "Cloud ops role, strong fit" },
    { company: "Buildots", role: "Field Capture Technician", source: "Other", status: "HR Call", notes: "Part-time 2-3 days, 70 NIS/hr" },
  ];

  const startTone = async () => { if (!toneStarted) { await Tone.start(); setToneStarted(true); } };

  const showQuip = (status) => {
    const quips = STATUS_QUIPS[status] || [];
    const text = quips[Math.floor(Math.random() * quips.length)];
    setQuip({ text: `${STATUS_EMOJIS[status] || ""} ${text}`, status });
    setTimeout(() => setQuip(null), 2500);
  };

  const playSound = (status) => { if (soundOn && toneStarted) playStatusSound(status); };

  useEffect(() => {
    async function load() {
      try {
        const result = await window.storage.get("job-applications");
        if (result && result.value) {
          setJobs(JSON.parse(result.value));
        } else {
          const seeded = SEED_DATA.map((j, i) => ({
            ...j,
            id: Date.now() + i,
            date: j.date ? new Date(j.date).toISOString() : new Date().toISOString(),
          }));
          setJobs(seeded);
          await window.storage.set("job-applications", JSON.stringify(seeded));
        }
      } catch (e) {
        const seeded = SEED_DATA.map((j, i) => ({
          ...j,
          id: Date.now() + i,
          date: j.date ? new Date(j.date).toISOString() : new Date().toISOString(),
        }));
        setJobs(seeded);
      }
      setLoading(false);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveJobs = useCallback(async (newJobs) => {
    setJobs(newJobs);
    try { await window.storage.set("job-applications", JSON.stringify(newJobs)); }
    catch (e) { console.error("Save failed:", e); }
  }, []);

  const addJob = async () => {
    if (!company.trim() || !role.trim()) return;
    await startTone();
    const newJob = { id: Date.now(), company: company.trim(), role: role.trim(), source, link: link.trim(), date: new Date().toISOString(), status: "Applied", notes: "" };
    saveJobs([newJob, ...jobs]);
    setCompany(""); setRole(""); setLink("");
    setFlash(true); setTimeout(() => setFlash(false), 500);
    playSound("Applied"); showQuip("Applied");
  };

  const updateJob = (id) => {
    saveJobs(jobs.map(j => j.id === id ? { ...j, status: editStatus, notes: editNotes, link: editLink, salaryMin: editSalaryMin, salaryMax: editSalaryMax } : j));
    setEditingId(null);
    playSound(editStatus); showQuip(editStatus);
  };

  const deleteJob = (id) => { saveJobs(jobs.filter(j => j.id !== id)); setEditingId(null); };

  const exportCSV = () => {
    const headers = "Company,Role,Source,Date Applied,Status,Notes,Link\n";
    const rows = jobs.map(j => `"${j.company}","${j.role}","${j.source}","${formatDate(j.date)}","${j.status}","${j.notes || ""}","${j.link || ""}"`).join("\n");
    const csvContent = headers + rows;
    try {
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `job_applications_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      navigator.clipboard.writeText(csvContent).then(() => {
        setImportMsg({ text: "📋 CSV copied to clipboard!", type: "success" });
        setTimeout(() => setImportMsg(null), 4000);
      });
    }
  };

  const showImportMessage = (text, type) => {
    setImportMsg({ text, type });
    setTimeout(() => setImportMsg(null), 5000);
  };

  const mergeImported = (imported, skipped) => {
    if (imported.length === 0) {
      showImportMessage("No valid rows found. Need at least Company and Role columns.", "error");
      return;
    }
    const existingKeys = new Set(jobs.map(j => `${j.company.toLowerCase()}|${j.role.toLowerCase()}`));
    const newJobs = imported.filter(j => !existingKeys.has(`${j.company.toLowerCase()}|${j.role.toLowerCase()}`));
    const duplicates = imported.length - newJobs.length;
    if (newJobs.length > 0) saveJobs([...newJobs, ...jobs]);
    let msg = `Imported ${newJobs.length} application${newJobs.length !== 1 ? "s" : ""}`;
    if (duplicates > 0) msg += `, ${duplicates} duplicate${duplicates !== 1 ? "s" : ""} skipped`;
    if (skipped > 0) msg += `, ${skipped} empty row${skipped !== 1 ? "s" : ""} skipped`;
    showImportMessage(`📥 ${msg}`, "success");
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".csv") || fileName.endsWith(".tsv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const { imported, skipped } = parseRows(results.data);
          mergeImported(imported, skipped);
        },
        error: () => showImportMessage("Failed to read CSV file.", "error"),
      });
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const workbook = XLSX.read(ev.target.result, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
          const { imported, skipped } = parseRows(rows);
          mergeImported(imported, skipped);
        } catch (err) {
          showImportMessage("Failed to read Excel file.", "error");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      showImportMessage("Please use a .csv or .xlsx file.", "error");
    }

    e.target.value = "";
  };

  const searchedJobs = search.trim() ? jobs.filter(j => {
    const q = search.toLowerCase();
    return j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q) || (j.notes || "").toLowerCase().includes(q);
  }) : jobs;
  const filteredJobs = filter === "All" ? searchedJobs : searchedJobs.filter(j => j.status === filter);
  const stats = STATUSES.reduce((acc, s) => { acc[s] = jobs.filter(j => j.status === s).length; return acc; }, {});

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0e17", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", color: "#22d3ee" }}>Loading...</div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, #0a0e17 0%, #111827 40%, #0f172a 100%)", fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", color: "#e2e8f0" }}
      onClick={() => { if (!toneStarted) startTone(); }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)", pointerEvents: "none", zIndex: 100 }} />

      {quip && (
        <div style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", background: STATUS_COLORS[quip.status]?.bg || "#1e1e2e", border: `2px solid ${STATUS_COLORS[quip.status]?.border || "#475569"}`, borderRadius: "10px", padding: "12px 24px", fontSize: "15px", fontWeight: "bold", color: STATUS_COLORS[quip.status]?.text || "#e2e8f0", zIndex: 200, animation: "popIn 0.3s ease-out", boxShadow: `0 4px 20px ${STATUS_COLORS[quip.status]?.border || "#475569"}40`, whiteSpace: "nowrap" }}>
          {quip.text}
        </div>
      )}

      {importMsg && (
        <div style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", background: importMsg.type === "success" ? "#1a3b2a" : "#3b1a1a", border: `2px solid ${importMsg.type === "success" ? "#16a34a" : "#dc2626"}`, borderRadius: "10px", padding: "12px 24px", fontSize: "13px", fontWeight: "bold", color: importMsg.type === "success" ? "#4ade80" : "#f87171", zIndex: 200, animation: "popIn 0.3s ease-out", maxWidth: "90vw", textAlign: "center" }}>
          {importMsg.text}
        </div>
      )}

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "24px 16px", position: "relative", zIndex: 10 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#22d3ee", marginBottom: "6px" }}>&gt;&gt; TRACKING ACTIVE &lt;&lt;</div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 4px 0", background: "linear-gradient(90deg, #22d3ee, #818cf8, #22d3ee)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 3s linear infinite" }}>JOB.TRACKER()</h1>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "11px", color: "#64748b" }}>{jobs.length} application{jobs.length !== 1 ? "s" : ""} logged</span>
            <button onClick={(e) => { e.stopPropagation(); setSoundOn(!soundOn); }} style={{ background: "transparent", border: `1px solid ${soundOn ? "#22d3ee" : "#334155"}`, color: soundOn ? "#22d3ee" : "#475569", fontSize: "12px", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", fontFamily: "inherit" }}>{soundOn ? "🔊" : "🔇"}</button>
          </div>
          {!toneStarted && soundOn && <div style={{ fontSize: "9px", color: "#334155", marginTop: "4px" }}>click anywhere to enable sounds</div>}
        </div>

        {/* Tab navigation */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "20px", background: "rgba(15,23,42,0.8)", borderRadius: "8px", padding: "4px", border: "1px solid #1e3a5f" }}>
          {[
            { id: "tracker", label: "📋 TRACKER" },
            { id: "dashboard", label: "📊 STATS" },
            { id: "prep", label: "🧠 PREP" },
            { id: "game", label: "🎮 GAME" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "none", background: tab === t.id ? "linear-gradient(135deg, #22d3ee20, #818cf820)" : "transparent", color: tab === t.id ? "#22d3ee" : "#475569", fontSize: "11px", fontWeight: tab === t.id ? "800" : "400", cursor: "pointer", fontFamily: "inherit", letterSpacing: "1px", borderBottom: tab === t.id ? "2px solid #22d3ee" : "2px solid transparent", transition: "all 0.2s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TRACKER TAB */}
        {tab === "tracker" && (
          <>
            {/* Status filter chips */}
            {jobs.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px", justifyContent: "center" }}>
                {STATUSES.map(s => stats[s] > 0 && (
                  <div key={s} onClick={() => setFilter(filter === s ? "All" : s)} style={{ padding: "4px 10px", borderRadius: "4px", fontSize: "11px", background: filter === s ? STATUS_COLORS[s].border : STATUS_COLORS[s].bg, color: filter === s ? "#fff" : STATUS_COLORS[s].text, border: `1px solid ${STATUS_COLORS[s].border}`, cursor: "pointer", transition: "all 0.2s" }}>{STATUS_EMOJIS[s]} {s}: {stats[s]}</div>
                ))}
                {filter !== "All" && <div onClick={() => setFilter("All")} style={{ padding: "4px 10px", borderRadius: "4px", fontSize: "11px", background: "transparent", color: "#64748b", border: "1px solid #334155", cursor: "pointer" }}>Show all</div>}
              </div>
            )}

            {/* Search */}
            <div style={{ marginBottom: "16px", position: "relative" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "#475569", pointerEvents: "none" }}>🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by company, role, or notes..."
                style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: "6px", background: "rgba(30, 41, 59, 0.8)", border: `1px solid ${search ? "#22d3ee" : "#1e3a5f"}`, color: "#e2e8f0", fontSize: "13px", outline: "none", fontFamily: "inherit", transition: "border-color 0.2s" }}
              />
              {search && <span onClick={() => setSearch("")} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", color: "#64748b", cursor: "pointer" }}>✕</span>}
            </div>

            {/* Quick add form */}
            <div style={{ background: flash ? "rgba(34,211,238,0.1)" : "rgba(30, 41, 59, 0.8)", border: `1px solid ${flash ? "#22d3ee" : "#1e3a5f"}`, borderRadius: "8px", padding: "16px", marginBottom: "20px", transition: "all 0.3s" }}>
              <div onClick={() => setShowQuickAdd(!showQuickAdd)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: showQuickAdd ? "12px" : "0" }}>
                <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#22d3ee" }}>▶ QUICK LOG</div>
                <span style={{ color: "#64748b", fontSize: "14px", transform: showQuickAdd ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }}>▼</span>
              </div>
              {showQuickAdd && (
                <>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" onKeyDown={(e) => e.key === "Enter" && document.getElementById("role-input").focus()} style={{ flex: "1 1 180px", padding: "10px 12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #1e3a5f", color: "#e2e8f0", fontSize: "13px", outline: "none", fontFamily: "inherit" }} />
                    <input id="role-input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" onKeyDown={(e) => e.key === "Enter" && document.getElementById("link-input").focus()} style={{ flex: "1 1 180px", padding: "10px 12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #1e3a5f", color: "#e2e8f0", fontSize: "13px", outline: "none", fontFamily: "inherit" }} />
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <input id="link-input" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Job posting link (optional)" onKeyDown={(e) => e.key === "Enter" && addJob()} style={{ width: "100%", padding: "10px 12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #1e3a5f", color: "#818cf8", fontSize: "12px", outline: "none", fontFamily: "inherit" }} />
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <select value={source} onChange={(e) => setSource(e.target.value)} style={{ padding: "10px 12px", borderRadius: "6px", background: "#0f172a", border: "1px solid #1e3a5f", color: "#e2e8f0", fontSize: "13px", outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
                      {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={addJob} disabled={!company.trim() || !role.trim()} style={{ flex: "1", padding: "10px 20px", borderRadius: "6px", background: company.trim() && role.trim() ? "linear-gradient(135deg, #22d3ee, #818cf8)" : "#1e293b", border: "none", color: company.trim() && role.trim() ? "#0a0e17" : "#475569", fontSize: "13px", fontWeight: "bold", cursor: "pointer", fontFamily: "inherit", letterSpacing: "1px", transition: "all 0.2s" }}>LOG APPLICATION 📤</button>
                  </div>
                  <div style={{ fontSize: "10px", color: "#475569", marginTop: "8px" }}>Type, Enter, done. Date and status added automatically.</div>
                </>
              )}
            </div>

            {filteredJobs.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569", fontSize: "13px" }}>
                {jobs.length === 0 ? "No applications logged yet. Start applying or import from CSV/XLSX!" : search ? `No results for "${search}"` : "No applications match this filter."}
              </div>
            )}

            {filteredJobs.map((job) => (
              <div key={job.id} style={{ background: "rgba(30, 41, 59, 0.6)", border: `1px solid ${editingId === job.id ? "#22d3ee" : "#1e3a5f"}`, borderRadius: "8px", padding: "14px 16px", marginBottom: "8px", animation: "slideIn 0.3s ease-out", transition: "border-color 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#f1f5f9" }}>{job.company}</span>
                      <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "3px", background: STATUS_COLORS[job.status]?.bg, color: STATUS_COLORS[job.status]?.text, border: `1px solid ${STATUS_COLORS[job.status]?.border}` }}>{STATUS_EMOJIS[job.status]} {job.status}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{job.role}</div>
                    <div style={{ fontSize: "10px", color: "#475569", marginTop: "4px" }}>{formatDate(job.date)} · {job.source}{job.notes && <span> · {job.notes}</span>}</div>
                    {(job.salaryMin || job.salaryMax) && (
                      <div style={{ fontSize: "10px", color: "#4ade80", marginTop: "2px" }}>
                        💰 {job.salaryMin && job.salaryMax ? `${Number(job.salaryMin).toLocaleString()} – ${Number(job.salaryMax).toLocaleString()} NIS` : job.salaryMin ? `From ${Number(job.salaryMin).toLocaleString()} NIS` : `Up to ${Number(job.salaryMax).toLocaleString()} NIS`}
                      </div>
                    )}
                    {job.link && <a href={job.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontSize: "10px", color: "#818cf8", marginTop: "2px", display: "inline-block", textDecoration: "none" }}>🔗 View posting</a>}
                  </div>
                  <button onClick={() => { if (editingId === job.id) { setEditingId(null); } else { setEditingId(job.id); setEditStatus(job.status); setEditNotes(job.notes || ""); setEditLink(job.link || ""); setEditSalaryMin(job.salaryMin || ""); setEditSalaryMax(job.salaryMax || ""); } }} style={{ background: "transparent", border: "1px solid #334155", color: "#64748b", fontSize: "10px", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", flexShrink: 0 }}>{editingId === job.id ? "CLOSE" : "EDIT"}</button>
                </div>

                {editingId === job.id && (
                  <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #1e3a5f", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} style={{ padding: "8px 10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #1e3a5f", color: "#e2e8f0", fontSize: "12px", outline: "none", fontFamily: "inherit" }}>
                      {STATUSES.map(s => <option key={s} value={s}>{STATUS_EMOJIS[s]} {s}</option>)}
                    </select>
                    <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Notes / interview prep..." rows={3} style={{ width: "100%", padding: "8px 10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #1e3a5f", color: "#e2e8f0", fontSize: "12px", outline: "none", fontFamily: "inherit", resize: "vertical" }} />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input value={editLink} onChange={(e) => setEditLink(e.target.value)} placeholder="Job posting link (optional)" style={{ flex: 1, padding: "8px 10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #1e3a5f", color: "#818cf8", fontSize: "11px", outline: "none", fontFamily: "inherit" }} />
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input value={editSalaryMin} onChange={(e) => setEditSalaryMin(e.target.value)} placeholder="Salary min (NIS)" type="number" style={{ flex: 1, padding: "8px 10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #1e3a5f", color: "#4ade80", fontSize: "12px", outline: "none", fontFamily: "inherit" }} />
                      <input value={editSalaryMax} onChange={(e) => setEditSalaryMax(e.target.value)} placeholder="Salary max (NIS)" type="number" style={{ flex: 1, padding: "8px 10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #1e3a5f", color: "#4ade80", fontSize: "12px", outline: "none", fontFamily: "inherit" }} />
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => updateJob(job.id)} style={{ flex: 1, padding: "8px", borderRadius: "6px", background: "#22d3ee", border: "none", color: "#0a0e17", fontSize: "11px", fontWeight: "bold", cursor: "pointer", fontFamily: "inherit" }}>SAVE</button>
                      <button onClick={() => deleteJob(job.id)} style={{ padding: "8px 16px", borderRadius: "6px", background: "transparent", border: "1px solid #dc2626", color: "#f87171", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>DELETE</button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Import/Export */}
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
              <input ref={fileInputRef} type="file" accept=".csv,.tsv,.xlsx,.xls" onChange={handleImport} style={{ display: "none" }} />
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                style={{ padding: "10px 24px", borderRadius: "6px", background: "transparent", border: "1px solid #334155", color: "#64748b", fontSize: "11px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "1px", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.target.style.borderColor = "#818cf8"; e.target.style.color = "#818cf8"; }}
                onMouseLeave={(e) => { e.target.style.borderColor = "#334155"; e.target.style.color = "#64748b"; }}>
                📥 IMPORT CSV / XLSX
              </button>
              {jobs.length > 0 && (
                <button onClick={exportCSV} style={{ padding: "10px 24px", borderRadius: "6px", background: "transparent", border: "1px solid #334155", color: "#64748b", fontSize: "11px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "1px", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.target.style.borderColor = "#22d3ee"; e.target.style.color = "#22d3ee"; }}
                  onMouseLeave={(e) => { e.target.style.borderColor = "#334155"; e.target.style.color = "#64748b"; }}>
                  📤 EXPORT CSV
                </button>
              )}
            </div>
            <div style={{ textAlign: "center", padding: "8px", fontSize: "10px", color: "#1e293b", marginTop: "16px" }}>GARRY.TRACKER // v4.0 — TABS + STATS + GAME + XLSX</div>
          </>
        )}

        {/* DASHBOARD TAB */}
        {tab === "dashboard" && <Dashboard jobs={jobs} />}

        {/* PREP TAB */}
        {tab === "prep" && <PrepTab />}

        {/* GAME TAB */}
        {tab === "game" && <MiniGame />}

      <div style={{ textAlign: "center", padding: "16px 0 8px", fontSize: "11px", color: "#334155", letterSpacing: "1px" }}>
        made by the epic gamer <span style={{ color: "#818cf8", fontWeight: "bold" }}>Garry Gershon</span>
      </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
        @keyframes shimmer { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
        @keyframes slideIn { 0% { opacity: 0; transform: translateY(-8px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { 0% { opacity: 0; transform: translateX(-50%) scale(0.8) translateY(-10px); } 50% { transform: translateX(-50%) scale(1.05) translateY(0); } 100% { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); } }
        * { box-sizing: border-box; } body { margin: 0; }
        input::placeholder { color: #475569; }
        select option { background: #0f172a; color: #e2e8f0; }
      `}</style>
    </div>
  );
}
