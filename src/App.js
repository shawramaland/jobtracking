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
  "Applied":      { bg: "#1a1a1a", border: "#555",    text: "#ccc" },
  "HR Call":      { bg: "#2a1a08", border: "#d97706", text: "#fbbf24" },
  "Interview":    { bg: "#1e0a1e", border: "#a855f7", text: "#d8b4fe" },
  "Technical":    { bg: "#1a0f00", border: "#ea580c", text: "#fb923c" },
  "Offer":        { bg: "#0f2a1a", border: "#16a34a", text: "#4ade80" },
  "Rejected":     { bg: "#2a0a0a", border: "#dc2626", text: "#f87171" },
  "Declined":     { bg: "#2a2000", border: "#ca8a04", text: "#facc15" },
  "Bullet Dodged":{ bg: "#0f1f0f", border: "#15803d", text: "#86efac" },
  "No Response":  { bg: "#141414", border: "#444",    text: "#666" },
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
    <div style={{ background: "#111", border: `1px solid ${color}40`, borderRadius: "10px", padding: "16px 20px", flex: "1 1 140px", minWidth: "140px" }}>
      <div style={{ fontSize: "22px", fontWeight: "800", color }}>{value}</div>
      <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>{label}</div>
      {sub && <div style={{ fontSize: "10px", color: "#444", marginTop: "4px" }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ padding: "0 0 40px 0" }}>
      <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#e63946", marginBottom: "16px", textAlign: "center" }}>▶ STATS.exe</div>

      {/* Summary cards */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
        {card("TOTAL APPS", total, null, "#e63946")}
        {card("RESPONSE RATE", `${responseRate}%`, `${responded} responded`, "#fbbf24")}
        {card("IN PROGRESS", inProgress, "active pipelines", "#fb923c")}
        {card("OFFERS", stats["Offer"] || 0, `${offerRate}% conversion`, "#4ade80")}
      </div>

      {/* Status breakdown bar chart */}
      <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#444", marginBottom: "14px" }}>STATUS BREAKDOWN</div>
        {STATUSES.filter(s => stats[s] > 0).map(s => (
          <div key={s} style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "3px" }}>
              <span style={{ color: STATUS_COLORS[s].text }}>{STATUS_EMOJIS[s]} {s}</span>
              <span style={{ color: "#444" }}>{stats[s]} ({Math.round((stats[s] / total) * 100)}%)</span>
            </div>
            <div style={{ background: "#0d0d0d", borderRadius: "3px", height: "6px", overflow: "hidden" }}>
              <div style={{ width: `${(stats[s] / total) * 100}%`, height: "100%", background: STATUS_COLORS[s].border, borderRadius: "3px", transition: "width 0.6s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Source breakdown */}
      <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#444", marginBottom: "14px" }}>SOURCE BREAKDOWN</div>
        {sourceStats.map(({ source, count }) => (
          <div key={source} style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "3px" }}>
              <span style={{ color: "#888" }}>{source}</span>
              <span style={{ color: "#444" }}>{count}</span>
            </div>
            <div style={{ background: "#0d0d0d", borderRadius: "3px", height: "6px", overflow: "hidden" }}>
              <div style={{ width: `${(count / maxSourceCount) * 100}%`, height: "100%", background: "#e63946", borderRadius: "3px", transition: "width 0.6s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Weekly trend */}
      {weeklyData.length > 1 && (
        <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "16px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#444", marginBottom: "14px" }}>WEEKLY ACTIVITY</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "80px" }}>
            {weeklyData.map(([week, count]) => (
              <div key={week} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ fontSize: "9px", color: "#444" }}>{count}</div>
                <div style={{ width: "100%", height: `${(count / maxWeekly) * 60}px`, background: "linear-gradient(180deg, #e63946, #7a0010)", borderRadius: "3px 3px 0 0", minHeight: "4px", transition: "height 0.6s ease" }} />
                <div style={{ fontSize: "8px", color: "#333", writingMode: "vertical-rl", textOrientation: "mixed" }}>{week.slice(5)}</div>
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

// ── DOOM COMPONENT ────────────────────────────────────────────────────────────
function MiniGame() {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const intervalRef = useRef(null);

  const launchDoom = async (canvas) => {
    overlayRef.current.style.display = "none";
    canvas.style.display = "block";
    canvas.focus();

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let memory = null;
    let scratchImageData = null;

    const imports = {
      loading: {
        onGameInit: (w, h) => {
          canvas.width = w;
          canvas.height = h;
          scratchImageData = ctx.createImageData(w, h);
        },
        wadSizes: () => {},
        readWads: () => {},
      },
      ui: {
        drawFrame: (framePtr) => {
          const pixels = new Uint8Array(memory.buffer, framePtr, canvas.width * canvas.height * 4);
          const img = scratchImageData.data;
          for (let i = 0; i < img.length / 4; i++) {
            img[i * 4]     = pixels[i * 4 + 2]; // R
            img[i * 4 + 1] = pixels[i * 4 + 1]; // G
            img[i * 4 + 2] = pixels[i * 4];     // B
            img[i * 4 + 3] = 255;
          }
          ctx.putImageData(scratchImageData, 0, 0);
        },
      },
      runtimeControl: {
        // eslint-disable-next-line no-undef
        timeInMilliseconds: () => BigInt(Math.trunc(performance.now())),
      },
      console: {
        onInfoMessage: () => {},
        onErrorMessage: () => {},
      },
      gameSaving: {
        sizeOfSaveGame: () => 0,
        readSaveGame: () => 0,
        writeSaveGame: () => 0,
      },
    };

    const { instance } = await WebAssembly.instantiateStreaming(fetch("/assets/doom.wasm"), imports);
    memory = instance.exports.memory;

    const keyMap = {
      ArrowLeft: instance.exports.KEY_LEFTARROW?.value,
      ArrowRight: instance.exports.KEY_RIGHTARROW?.value,
      ArrowUp: instance.exports.KEY_UPARROW?.value,
      ArrowDown: instance.exports.KEY_DOWNARROW?.value,
      Control: instance.exports.KEY_FIRE?.value,
      " ": instance.exports.KEY_USE?.value,
      Shift: instance.exports.KEY_SHIFT?.value,
      Escape: instance.exports.KEY_ESCAPE?.value,
      Enter: instance.exports.KEY_ENTER?.value,
    };

    const getKey = (e) => keyMap[e.key] ?? (e.key.length === 1 ? e.key.charCodeAt(0) : null);
    canvas.addEventListener("keydown", (e) => { const k = getKey(e); if (k != null) { e.preventDefault(); instance.exports.reportKeyDown(k); } });
    canvas.addEventListener("keyup",   (e) => { const k = getKey(e); if (k != null) { e.preventDefault(); instance.exports.reportKeyUp(k); } });

    instance.exports.initGame();
    intervalRef.current = setInterval(() => {
      try {
        instance.exports.tickGame();
      } catch (e) {
        clearInterval(intervalRef.current);
        canvas.style.display = "none";
        overlayRef.current.style.display = "flex";
      }
    }, 1000 / 35);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <div ref={overlayRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", minHeight: "60vh", gap: "20px" }}>
        <div style={{ fontSize: "52px" }}>🔫</div>
        <div style={{ fontSize: "22px", fontWeight: "900", color: "#e63946", letterSpacing: "3px", textShadow: "0 0 20px #e6394666" }}>
          WANT SOME DOOM?
        </div>
        <div style={{ fontSize: "11px", color: "#555", textAlign: "center", lineHeight: "1.9" }}>
          The original. The legend. Rip and tear.<br />
          DOOM shareware — © id Software. Running via{" "}
          <a href="https://github.com/jacobenget/doom.wasm" target="_blank" rel="noreferrer" style={{ color: "#e63946" }}>doom.wasm</a>{" "}
          by Jacob Enget (GPL).<br />
          <span style={{ color: "#333" }}>Because why not.</span>
        </div>
        <button
          onClick={() => launchDoom(canvasRef.current)}
          style={{ marginTop: "8px", padding: "14px 40px", background: "transparent", border: "2px solid #e63946", borderRadius: "8px", color: "#e63946", fontWeight: "800", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "3px", boxShadow: "0 0 20px #e6394640", transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.target.style.boxShadow = "0 0 30px #e63946aa"; }}
          onMouseLeave={(e) => { e.target.style.boxShadow = "0 0 20px #e6394640"; }}
        >
          RIP AND TEAR
        </button>
      </div>
      <canvas ref={canvasRef} id="doom-canvas" tabIndex={0} style={{ display: "none", outline: "none" }} />
    </div>
  );
}

// ── WELCOME SCREEN ────────────────────────────────────────────────────────────
function WelcomeScreen({ onEnter }) {
  const [lines, setLines] = useState([]);
  const [phase, setPhase] = useState("pre"); // "pre" | "boot" | "title"
  const [fading, setFading] = useState(false);
  // Randomly pick variant once on mount
  const variantRef = useRef(["bios", "win95", "c64"][Math.floor(Math.random() * 3)]);
  const audioCtxRef = useRef(null);

  // ── Sound helpers (raw Web Audio) ─────────────────────────────────────────
  function getAC() {
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtxRef.current;
  }
  function beep(freq, type, duration, volume, startOffset = 0) {
    const ac = getAC();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ac.currentTime + startOffset);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startOffset + duration);
    osc.start(ac.currentTime + startOffset);
    osc.stop(ac.currentTime + startOffset + duration + 0.05);
  }
  function tick() { beep(1200, "square", 0.03, 0.04); }
  function diskSeek() { for (let i = 0; i < 6; i++) beep(800 + i * 40, "square", 0.04, 0.03, i * 0.06); }
  function postBeep() { beep(880, "square", 0.18, 0.3); }
  function loadingChime() {
    [440, 523, 659, 784].forEach((f, i) => beep(f, "triangle", 0.12, 0.15, i * 0.18));
  }
  function startupFanfare() {
    [{ f: 523, t: 0 }, { f: 659, t: 0.15 }, { f: 784, t: 0.30 },
     { f: 1047, t: 0.45 }, { f: 784, t: 0.55 }, { f: 1047, t: 0.65 }]
      .forEach(({ f, t }) => beep(f, "sine", 0.2, 0.18, t));
  }
  function playWin95Sound() {
    const audio = new Audio(process.env.PUBLIC_URL + "/win95.mp3");
    audio.volume = 0.8;
    audio.play().catch(() => {});
  }
  function playRockster() {
    const audio = new Audio(process.env.PUBLIC_URL + "/rockster.mp3");
    audio.volume = 0.8;
    audio.play().catch(() => {});
  }
  // ─────────────────────────────────────────────────────────────────────────

  const BIOS_SEQUENCE = [
    { text: "AMI BIOS (C) 2026  —  Version 4.51PG", color: "#aaa", delay: 0 },
    { text: "Copyright (C) 2026, American Megatrends Inc.", color: "#555", delay: 150 },
    { text: "", delay: 200 },
    { text: "CPU: Intel(R) Core(TM) i7  @ 3.60GHz", color: "#888", delay: 400, sound: "tick" },
    { text: "Memory Test: 65536K OK", color: "#888", delay: 600, sound: "tick" },
    { text: "Existential Crisis Module: DETECTED", color: "#555", delay: 750, sound: "tick" },
    { text: "", delay: 820 },
    { text: "Detecting Primary Master  ... ST1000DM003-1CH1", color: "#888", delay: 900, sound: "disk" },
    { text: "Detecting Primary Slave   ... None", color: "#555", delay: 1050, sound: "tick" },
    { text: "Detecting Secondary Master ... HL-DT-ST DVD-ROM", color: "#888", delay: 1200, sound: "disk" },
    { text: "Detecting Will To Apply   ... [ searching... ]", color: "#555", delay: 1310, sound: "tick" },
    { text: "Detecting Will To Apply   ... BARELY FOUND", color: "#888", delay: 1420, sound: "tick" },
    { text: "", delay: 1480 },
    { text: "PCI device listing:", color: "#555", delay: 1550, sound: "tick" },
    { text: "  Bus 00, Device 00, Function 00: Host Bridge", color: "#555", delay: 1640, sound: "tick" },
    { text: "  Bus 00, Device 01, Function 00: VGA Controller", color: "#555", delay: 1730, sound: "tick" },
    { text: "  Bus 00, Device 02, Function 00: Ethernet Controller", color: "#555", delay: 1820, sound: "tick" },
    { text: "  Bus 00, Device 03, Function 00: LinkedIn Anxiety Driver", color: "#555", delay: 1910, sound: "tick" },
    { text: "", delay: 1980 },
    { text: "WARNING: 847 unread recruiter emails detected", color: "#e63946", delay: 2060, sound: "tick" },
    { text: "WARNING: Last job application: 'idk lol'", color: "#e63946", delay: 2160, sound: "tick" },
    { text: "WARNING: Resume last updated: never", color: "#e63946", delay: 2260, sound: "tick" },
    { text: "", delay: 2320 },
    { text: "Initializing cope.exe .............................. [OK]", color: "#888", delay: 2400, sound: "tick" },
    { text: "Loading operating system...", color: "#888", delay: 2560, sound: "tick" },
    { text: "  [████████████████████] 100%  [OK]", color: "#e63946", delay: 3200, sound: "loading" },
    { text: "", delay: 3300 },
    { text: "System ready. Good luck out there.", color: "#fff", delay: 3450, sound: "tick" },
  ];

  const WIN95_SEQUENCE = [
    { text: "Microsoft Windows 95", color: "#fff", delay: 0 },
    { text: "Starting Windows 95...", color: "#aaa", delay: 600, sound: "tick" },
    { text: "", delay: 800 },
    { text: "  Checking for viruses ........... Found 3. Ignored.", color: "#888", delay: 1000, sound: "tick" },
    { text: "  Loading drivers ................ Some of them.", color: "#888", delay: 1300, sound: "tick" },
    { text: "  Detecting hardware ............. Close enough.", color: "#888", delay: 1600, sound: "tick" },
    { text: "", delay: 1800 },
    { text: "  C:\\> dir /s resume.doc", color: "#555", delay: 1950, sound: "tick" },
    { text: "  File Not Found.", color: "#e63946", delay: 2200, sound: "tick" },
    { text: "", delay: 2350 },
    { text: "  This program has performed an illegal operation:", color: "#e63946", delay: 2500, sound: "tick" },
    { text: "  LINKEDIN.EXE caused a General Protection Fault", color: "#e63946", delay: 2650, sound: "tick" },
    { text: "  in module SELF_WORTH.DLL at 0028:c007a3f2", color: "#555", delay: 2800, sound: "tick" },
    { text: "  [ Close ]  [ Close ]  [ Close ]", color: "#555", delay: 2950, sound: "tick" },
    { text: "", delay: 3100 },
    { text: "  Initializing JOBTRACKER.EXE ................... [OK]", color: "#888", delay: 3250, sound: "tick" },
    { text: "", delay: 3450 },
    { text: "  It is now safe to send your resume.", color: "#fff", delay: 3600, sound: "tick" },
  ];

  const C64_SEQUENCE = [
    { text: "    **** COMMODORE 64 BASIC V2 ****", color: "#a0a0ff", delay: 0 },
    { text: "", delay: 300 },
    { text: " 64K RAM SYSTEM  38911 BASIC BYTES FREE", color: "#a0a0ff", delay: 500, sound: "tick" },
    { text: "", delay: 700 },
    { text: "READY.", color: "#a0a0ff", delay: 900, sound: "tick" },
    { text: "", delay: 1100 },
    { text: "LOAD \"RESUME.PRG\",8,1", color: "#a0a0ff", delay: 1300, sound: "tick" },
    { text: "", delay: 1500 },
    { text: "SEARCHING FOR RESUME.PRG", color: "#a0a0ff", delay: 1700, sound: "disk" },
    { text: "FILE NOT FOUND", color: "#e63946", delay: 2200, sound: "tick" },
    { text: "", delay: 2400 },
    { text: "READY.", color: "#a0a0ff", delay: 2500, sound: "tick" },
    { text: "", delay: 2650 },
    { text: "LOAD \"COPE.PRG\",8,1", color: "#a0a0ff", delay: 2800, sound: "tick" },
    { text: "SEARCHING FOR COPE.PRG", color: "#a0a0ff", delay: 3000, sound: "disk" },
    { text: "LOADING", color: "#a0a0ff", delay: 3400, sound: "tick" },
    { text: "", delay: 3650 },
    { text: "READY.", color: "#a0a0ff", delay: 3800, sound: "tick" },
    { text: "", delay: 3950 },
    { text: "RUN", color: "#a0a0ff", delay: 4100, sound: "tick" },
    { text: "", delay: 4300 },
    { text: "?OUT OF MEMORY ERROR IN LINE 9 TO 5", color: "#e63946", delay: 4500, sound: "tick" },
    { text: "", delay: 4700 },
    { text: "READY.", color: "#a0a0ff", delay: 4850, sound: "tick" },
  ];

  const startBoot = () => {
    if (phase !== "pre") return;
    setPhase("boot");
    const variant = variantRef.current;
    const sequence = variant === "win95" ? WIN95_SEQUENCE : variant === "c64" ? C64_SEQUENCE : BIOS_SEQUENCE;
    const titleDelay = variant === "win95" ? 4400 : variant === "c64" ? 5600 : 4100;

    if (variant === "bios") setTimeout(postBeep, 80);

    sequence.forEach((item) => {
      setTimeout(() => {
        setLines(prev => [...prev, item]);
        if (item.sound === "tick") tick();
        else if (item.sound === "disk") diskSeek();
        else if (item.sound === "loading") loadingChime();
      }, item.delay);
    });

    setTimeout(() => {
      setPhase("title");
      if (variant === "win95") setTimeout(playWin95Sound, 200);
      else if (variant === "c64") setTimeout(playRockster, 200);
      else setTimeout(startupFanfare, 100);
    }, titleDelay);
  };

  const handleEnter = () => {
    if (phase === "pre") { startBoot(); return; }
    if (phase !== "title") return;
    setFading(true);
    setTimeout(onEnter, 700);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Enter" || e.key === " ") handleEnter(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const variant = variantRef.current;
  const isWin95 = variant === "win95";
  const isC64 = variant === "c64";

  return (
    <div onClick={handleEnter} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: (isC64 && phase !== "pre") ? "#4a4aaa" : (isWin95 && phase === "title") ? "#008080" : "#000",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      cursor: "pointer",
      opacity: fading ? 0 : 1,
      transition: "opacity 0.7s ease",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* PRE PHASE */}
      {phase === "pre" && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "12px", color: "#333", letterSpacing: "4px" }}>■ ■ ■</div>
          <div style={{ fontSize: "13px", color: "#555", letterSpacing: "2px" }}>
            PRESS <span style={{ color: "#e63946" }}>ENTER</span> OR CLICK TO POWER ON
          </div>
          <span className="boot-cursor" style={{ fontSize: "13px", color: "#333" }}>_</span>
        </div>
      )}

      {/* BOOT PHASE — BIOS */}
      {phase === "boot" && !isWin95 && !isC64 && (
        <div style={{ padding: "40px 48px", maxWidth: "700px" }}>
          {lines.map((line, idx) => (
            <div key={idx} style={{ fontSize: "13px", color: line.color || "#888", lineHeight: "1.9", whiteSpace: "pre" }}>
              {line.text || "\u00A0"}
            </div>
          ))}
        </div>
      )}

      {/* BOOT PHASE — RETRO GUI */}
      {phase === "boot" && isWin95 && (
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          background: "#008080", /* teal desktop */
          fontFamily: "'Arial', sans-serif",
        }}>
          {/* Floating dialog box */}
          <div style={{
            background: "#c0c0c0",
            border: "2px solid",
            borderColor: "#fff #808080 #808080 #fff",
            boxShadow: "4px 4px 0 #000",
            minWidth: "420px", maxWidth: "560px", width: "90vw",
          }}>
            {/* Title bar */}
            <div style={{
              background: "linear-gradient(to right, #000080, #1084d0)",
              padding: "4px 6px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: "12px", color: "#fff", fontWeight: "bold", fontFamily: "'Arial', sans-serif" }}>
                Starting up...
              </span>
              <div style={{ display: "flex", gap: "2px" }}>
                {["_", "□", "✕"].map((c, i) => (
                  <span key={i} style={{
                    display: "inline-block", width: "16px", height: "14px",
                    background: "#c0c0c0", border: "1px solid",
                    borderColor: "#fff #808080 #808080 #fff",
                    fontSize: "10px", textAlign: "center", lineHeight: "13px", color: "#000",
                    fontFamily: "'Arial', sans-serif",
                  }}>{c}</span>
                ))}
              </div>
            </div>
            {/* Body */}
            <div style={{ padding: "16px 20px 20px" }}>
              {lines.map((line, idx) => (
                <div key={idx} style={{
                  fontSize: "13px",
                  color: line.color === "#e63946" ? "#800000" : (line.color === "#fff" ? "#000" : "#000080"),
                  lineHeight: "1.8",
                  whiteSpace: "pre",
                  fontFamily: "'Courier New', monospace",
                }}>
                  {line.text || "\u00A0"}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BOOT PHASE — C64 */}
      {phase === "boot" && isC64 && (
        <div style={{
          flex: 1,
          background: "#4a4aaa",
          display: "flex",
          padding: "40px",
          fontFamily: "'Courier New', monospace",
          boxSizing: "border-box",
        }}>
          {/* inner screen — fills remaining space */}
          <div style={{
            background: "#3333aa",
            flex: 1,
            padding: "24px 32px",
            boxSizing: "border-box",
          }}>
            {lines.map((line, idx) => (
              <div key={idx} style={{
                fontSize: "15px",
                color: line.color || "#a0a0ff",
                lineHeight: "1.7",
                whiteSpace: "pre",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}>
                {line.text || "\u00A0"}
              </div>
            ))}
            <span className="boot-cursor" style={{ fontSize: "15px", color: "#a0a0ff" }}>█</span>
          </div>
        </div>
      )}

      {/* TITLE PHASE — BIOS */}
      {phase === "title" && !isWin95 && !isC64 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", animation: "fadeInUp 0.6s ease-out" }}>
          <div style={{ fontSize: "11px", letterSpacing: "6px", color: "#e63946", textTransform: "uppercase" }}>▶ SYSTEM READY</div>
          <div style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: "900", color: "#fff", letterSpacing: "-1px", textAlign: "center" }}>
            JOB<span style={{ color: "#e63946" }}>.</span>TRACKER<span style={{ color: "#e63946" }}>()</span>
          </div>
          <div style={{ fontSize: "14px", color: "#888", textAlign: "center", maxWidth: "420px", lineHeight: "1.7" }}>
            Track every application, prep for interviews, and never lose sight of where you stand in the job hunt.
          </div>
          <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "13px", color: "#e63946" }}>▶</span>
            <span style={{ fontSize: "13px", color: "#e63946" }}>Press ENTER or click to begin</span>
            <span className="boot-cursor" style={{ fontSize: "13px", color: "#e63946" }}>_</span>
          </div>
        </div>
      )}

      {/* TITLE PHASE — WIN95 */}
      {phase === "title" && isWin95 && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#008080", animation: "fadeInUp 0.6s ease-out" }}>
          <div style={{ background: "#c0c0c0", border: "2px solid", borderColor: "#fff #808080 #808080 #fff", boxShadow: "4px 4px 0 #000", minWidth: "420px", maxWidth: "520px", width: "90vw" }}>
            {/* title bar */}
            <div style={{ background: "linear-gradient(to right, #000080, #1084d0)", padding: "4px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#fff", fontWeight: "bold", fontFamily: "'Arial', sans-serif" }}>Job Tracker</span>
              <div style={{ display: "flex", gap: "2px" }}>
                {["_", "□", "✕"].map((c, i) => (
                  <span key={i} style={{ display: "inline-block", width: "16px", height: "14px", background: "#c0c0c0", border: "1px solid", borderColor: "#fff #808080 #808080 #fff", fontSize: "10px", textAlign: "center", lineHeight: "13px", color: "#000", fontFamily: "'Arial', sans-serif" }}>{c}</span>
                ))}
              </div>
            </div>
            {/* body */}
            <div style={{ padding: "28px 32px", fontFamily: "'Arial', sans-serif", textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "bold", color: "#000080", marginBottom: "12px", fontFamily: "'Arial Black', sans-serif" }}>
                JOB TRACKER
              </div>
              <div style={{ width: "100%", height: "1px", background: "#808080", marginBottom: "12px" }} />
              <div style={{ fontSize: "13px", color: "#000", marginBottom: "20px", lineHeight: "1.6" }}>
                Track every application, prep for interviews,<br />and never lose sight of where you stand.
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button style={{ background: "#c0c0c0", border: "2px solid", borderColor: "#fff #808080 #808080 #fff", padding: "6px 28px", fontSize: "13px", fontFamily: "'Arial', sans-serif", cursor: "pointer", color: "#000", boxShadow: "1px 1px 0 #000" }}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TITLE PHASE — C64 */}
      {phase === "title" && isC64 && (
        <div style={{ flex: 1, display: "flex", padding: "40px", background: "#4a4aaa", fontFamily: "'Courier New', monospace", boxSizing: "border-box", animation: "fadeInUp 0.6s ease-out" }}>
          <div style={{ background: "#3333aa", flex: 1, padding: "32px 40px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
            <div style={{ fontSize: "15px", color: "#a0a0ff", textTransform: "uppercase", letterSpacing: "1px", lineHeight: "1.8" }}>
              <div style={{ marginBottom: "16px" }}>READY.</div>
              <div>RUN "JOB-TRACKER.PRG"</div>
              <div style={{ marginTop: "8px", marginBottom: "24px" }}>LOADING...</div>
              <div style={{ fontSize: "clamp(18px, 3vw, 28px)", color: "#fff", letterSpacing: "3px", marginBottom: "12px" }}>
                *** JOB TRACKER V1.0 ***
              </div>
              <div style={{ fontSize: "13px", color: "#a0a0ff", marginBottom: "24px" }}>
                TRACK EVERY APPLICATION. PREP FOR INTERVIEWS.<br />
                NEVER LOSE SIGHT OF WHERE YOU STAND.
              </div>
              <div style={{ fontSize: "13px", color: "#a0a0ff" }}>
                PRESS ENTER OR CLICK TO RUN
                <span className="boot-cursor" style={{ marginLeft: "8px" }}>█</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        .boot-cursor { animation: blink 1s step-end infinite; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

// ── SNAKE GAME ────────────────────────────────────────────────────────────────
function SnakeGame() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const loopRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);

  const CELL = 24;
  const COLS = 25;
  const ROWS = 20;

  const initState = () => ({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 5, y: 5 },
    score: 0,
    dead: false,
  });

  const placeFood = (snake) => {
    let pos;
    do {
      pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  };

  const draw = (ctx, s) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

    // grid lines (subtle)
    ctx.strokeStyle = "#0d0d0d";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, ROWS * CELL); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(COLS * CELL, y * CELL); ctx.stroke(); }

    // food
    ctx.fillStyle = "#e63946";
    ctx.shadowColor = "#e63946";
    ctx.shadowBlur = 8;
    ctx.fillRect(s.food.x * CELL + 3, s.food.y * CELL + 3, CELL - 6, CELL - 6);
    ctx.shadowBlur = 0;

    // snake
    s.snake.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#fff" : `rgba(255,255,255,${0.85 - i * 0.02})`;
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
  };

  const startGame = () => {
    stateRef.current = initState();
    setGameOver(false);
    setScore(0);
    setStarted(true);
  };

  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const onKey = (e) => {
      const s = stateRef.current;
      if (!s) return;
      if (e.key === "ArrowUp"    && s.dir.y !== 1)  { e.preventDefault(); s.nextDir = { x: 0, y: -1 }; }
      if (e.key === "ArrowDown"  && s.dir.y !== -1) { e.preventDefault(); s.nextDir = { x: 0, y: 1 }; }
      if (e.key === "ArrowLeft"  && s.dir.x !== 1)  { e.preventDefault(); s.nextDir = { x: -1, y: 0 }; }
      if (e.key === "ArrowRight" && s.dir.x !== -1) { e.preventDefault(); s.nextDir = { x: 1, y: 0 }; }
    };
    window.addEventListener("keydown", onKey);

    loopRef.current = setInterval(() => {
      const s = stateRef.current;
      if (!s || s.dead) return;
      s.dir = s.nextDir;
      const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        s.dead = true;
        setGameOver(true);
        setScore(s.score);
        clearInterval(loopRef.current);
        return;
      }
      s.snake.unshift(head);
      if (head.x === s.food.x && head.y === s.food.y) {
        s.score++;
        setScore(s.score);
        s.food = placeFood(s.snake);
      } else {
        s.snake.pop();
      }
      draw(ctx, s);
    }, 120);

    draw(ctx, stateRef.current);

    return () => {
      clearInterval(loopRef.current);
      window.removeEventListener("keydown", onKey);
    };
  }, [started]);

  useEffect(() => () => clearInterval(loopRef.current), []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      {/* splash */}
      {!started && !gameOver && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", minHeight: "60vh", gap: "20px" }}>
          <div style={{ fontSize: "52px" }}>🐍</div>
          <div style={{ fontSize: "22px", fontWeight: "900", color: "#4ade80", letterSpacing: "3px", textShadow: "0 0 20px #4ade8066" }}>EAT OR BE EATEN</div>
          <div style={{ fontSize: "11px", color: "#555", textAlign: "center", lineHeight: "1.9" }}>
            Arrow keys to slither.<br />
            Eat the red. Don't eat yourself.<br />
            <span style={{ color: "#333" }}>You will eat yourself.</span>
          </div>
          <button onClick={startGame} style={{ marginTop: "8px", padding: "14px 40px", background: "transparent", border: "2px solid #4ade80", borderRadius: "8px", color: "#4ade80", fontSize: "13px", fontWeight: "800", letterSpacing: "3px", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 0 20px #4ade8040", transition: "all 0.2s" }}
            onMouseEnter={e => e.target.style.boxShadow = "0 0 30px #4ade80aa"}
            onMouseLeave={e => e.target.style.boxShadow = "0 0 20px #4ade8040"}>
            START SLITHERING
          </button>
        </div>
      )}
      {/* game over */}
      {gameOver && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", minHeight: "60vh", gap: "20px" }}>
          <div style={{ fontSize: "52px" }}>💀</div>
          <div style={{ fontSize: "22px", fontWeight: "900", color: "#e63946", letterSpacing: "3px", textShadow: "0 0 20px #e6394666" }}>YOU ATE YOURSELF</div>
          <div style={{ fontSize: "28px", fontWeight: "900", color: "#fff" }}>{score} <span style={{ fontSize: "12px", color: "#555", fontWeight: "400" }}>POINTS</span></div>
          <button onClick={startGame} style={{ marginTop: "8px", padding: "14px 40px", background: "transparent", border: "2px solid #e63946", borderRadius: "8px", color: "#e63946", fontSize: "13px", fontWeight: "800", letterSpacing: "3px", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 0 20px #e6394640", transition: "all 0.2s" }}
            onMouseEnter={e => e.target.style.boxShadow = "0 0 30px #e63946aa"}
            onMouseLeave={e => e.target.style.boxShadow = "0 0 20px #e6394640"}>
            TRY AGAIN
          </button>
        </div>
      )}
      {/* hud + canvas */}
      {started && !gameOver && (
        <div style={{ display: "flex", alignItems: "center", gap: "24px", fontSize: "12px", letterSpacing: "2px", marginBottom: "6px" }}>
          <span style={{ color: "#333" }}>SNAKE</span>
          <span style={{ color: "#888" }}>SCORE: <span style={{ color: "#4ade80", fontWeight: "800" }}>{score}</span></span>
          <span style={{ color: "#222", fontSize: "10px" }}>ARROW KEYS · R RESTART</span>
        </div>
      )}
      <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL}
        style={{ border: "1px solid #222", borderRadius: "6px", display: started && !gameOver ? "block" : "none", maxWidth: "100%" }} />
    </div>
  );
}

// ── PONG GAME ─────────────────────────────────────────────────────────────────
function PongGame() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const loopRef = useRef(null);
  const keysRef = useRef({});
  const [scores, setScores] = useState({ ai: 0, player: 0 });
  const [started, setStarted] = useState(false);

  const W = 700, H = 480;
  const PAD_W = 12, PAD_H = 70;
  const BALL_SIZE = 10;

  const initState = () => ({
    ball: { x: W / 2, y: H / 2, vx: 4 * (Math.random() > 0.5 ? 1 : -1), vy: 3 * (Math.random() > 0.5 ? 1 : -1) },
    aiPad: { y: H / 2 - PAD_H / 2 },
    playerPad: { y: H / 2 - PAD_H / 2 },
    scoreAi: 0,
    scorePlayer: 0,
  });

  const draw = (ctx, s) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    // Center dashed line
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
    ctx.setLineDash([]);

    // Scores
    ctx.fillStyle = "#333";
    ctx.font = "bold 28px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(s.scoreAi, W / 2 - 60, 44);
    ctx.fillText(s.scorePlayer, W / 2 + 60, 44);

    // AI paddle (left)
    ctx.fillStyle = "#fff";
    ctx.fillRect(16, s.aiPad.y, PAD_W, PAD_H);

    // Player paddle (right)
    ctx.fillRect(W - 16 - PAD_W, s.playerPad.y, PAD_W, PAD_H);

    // Ball
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 6;
    ctx.fillRect(s.ball.x - BALL_SIZE / 2, s.ball.y - BALL_SIZE / 2, BALL_SIZE, BALL_SIZE);
    ctx.shadowBlur = 0;
  };

  const startGame = () => {
    stateRef.current = initState();
    setScores({ ai: 0, player: 0 });
    setStarted(true);
  };

  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const onKeyDown = (e) => { keysRef.current[e.key] = true; if (["ArrowUp","ArrowDown"].includes(e.key)) e.preventDefault(); };
    const onKeyUp   = (e) => { keysRef.current[e.key] = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    loopRef.current = setInterval(() => {
      const s = stateRef.current;
      if (!s) return;

      // Player movement
      if (keysRef.current["ArrowUp"])   s.playerPad.y = Math.max(0, s.playerPad.y - 6);
      if (keysRef.current["ArrowDown"]) s.playerPad.y = Math.min(H - PAD_H, s.playerPad.y + 6);

      // AI tracking with lag
      const aiCenter = s.aiPad.y + PAD_H / 2;
      if (aiCenter < s.ball.y - 4) s.aiPad.y = Math.min(H - PAD_H, s.aiPad.y + 4);
      if (aiCenter > s.ball.y + 4) s.aiPad.y = Math.max(0, s.aiPad.y - 4);

      // Ball movement
      s.ball.x += s.ball.vx;
      s.ball.y += s.ball.vy;

      // Top/bottom bounce
      if (s.ball.y - BALL_SIZE / 2 <= 0 || s.ball.y + BALL_SIZE / 2 >= H) s.ball.vy *= -1;

      // AI paddle collision (left)
      if (s.ball.x - BALL_SIZE / 2 <= 16 + PAD_W && s.ball.y >= s.aiPad.y && s.ball.y <= s.aiPad.y + PAD_H) {
        s.ball.vx = Math.abs(s.ball.vx) * 1.03;
        s.ball.vy += (Math.random() - 0.5) * 1.5;
      }

      // Player paddle collision (right)
      if (s.ball.x + BALL_SIZE / 2 >= W - 16 - PAD_W && s.ball.y >= s.playerPad.y && s.ball.y <= s.playerPad.y + PAD_H) {
        s.ball.vx = -Math.abs(s.ball.vx) * 1.03;
        s.ball.vy += (Math.random() - 0.5) * 1.5;
      }

      // Clamp speed
      s.ball.vx = Math.max(-14, Math.min(14, s.ball.vx));
      s.ball.vy = Math.max(-12, Math.min(12, s.ball.vy));

      // Score
      if (s.ball.x < 0) {
        s.scorePlayer++;
        setScores({ ai: s.scoreAi, player: s.scorePlayer });
        Object.assign(s, { ball: { x: W/2, y: H/2, vx: 4, vy: 3*(Math.random()>0.5?1:-1) } });
      }
      if (s.ball.x > W) {
        s.scoreAi++;
        setScores({ ai: s.scoreAi, player: s.scorePlayer });
        Object.assign(s, { ball: { x: W/2, y: H/2, vx: -4, vy: 3*(Math.random()>0.5?1:-1) } });
      }

      draw(ctx, s);
    }, 1000 / 60);

    draw(ctx, stateRef.current);

    return () => {
      clearInterval(loopRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [started]);

  useEffect(() => () => clearInterval(loopRef.current), []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      {!started && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", minHeight: "60vh", gap: "20px" }}>
          <div style={{ fontSize: "52px" }}>🏓</div>
          <div style={{ fontSize: "22px", fontWeight: "900", color: "#f0f0f0", letterSpacing: "3px", textShadow: "0 0 20px #ffffff33" }}>YOU VS THE MACHINE</div>
          <div style={{ fontSize: "11px", color: "#555", textAlign: "center", lineHeight: "1.9" }}>
            ↑ ↓ arrow keys to move your paddle.<br />
            The AI tracks the ball — but it's not perfect.<br />
            <span style={{ color: "#333" }}>First to... well, just play until you rage quit.</span>
          </div>
          <button onClick={startGame} style={{ marginTop: "8px", padding: "14px 40px", background: "transparent", border: "2px solid #aaa", borderRadius: "8px", color: "#aaa", fontSize: "13px", fontWeight: "800", letterSpacing: "3px", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 0 20px #aaaaaa30", transition: "all 0.2s" }}
            onMouseEnter={e => e.target.style.boxShadow = "0 0 30px #aaaaaaaa"}
            onMouseLeave={e => e.target.style.boxShadow = "0 0 20px #aaaaaa30"}>
            SERVE THE BALL
          </button>
        </div>
      )}
      {started && (
        <div style={{ display: "flex", alignItems: "center", gap: "24px", fontSize: "12px", letterSpacing: "2px", marginBottom: "6px" }}>
          <span style={{ color: "#555" }}>AI</span>
          <span style={{ color: "#e63946", fontWeight: "900", fontSize: "18px" }}>{scores.ai}</span>
          <span style={{ color: "#333" }}>—</span>
          <span style={{ color: "#fff", fontWeight: "900", fontSize: "18px" }}>{scores.player}</span>
          <span style={{ color: "#555" }}>YOU</span>
          <span style={{ color: "#222", fontSize: "10px" }}>↑↓ KEYS</span>
        </div>
      )}
      <canvas ref={canvasRef} width={W} height={H}
        style={{ border: "1px solid #222", borderRadius: "6px", maxWidth: "100%", display: started ? "block" : "none" }} />
    </div>
  );
}

// ── TETRIS GAME ───────────────────────────────────────────────────────────────
function TetrisGame() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const loopRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const COLS = 10, ROWS = 20, CELL = 30;

  const TETROMINOES = [
    { shape: [[1,1,1,1]],         color: "#e63946" }, // I
    { shape: [[1,1],[1,1]],       color: "#fbbf24" }, // O
    { shape: [[0,1,0],[1,1,1]],   color: "#a78bfa" }, // T
    { shape: [[0,1,1],[1,1,0]],   color: "#4ade80" }, // S
    { shape: [[1,1,0],[0,1,1]],   color: "#fb923c" }, // Z
    { shape: [[1,0,0],[1,1,1]],   color: "#f472b6" }, // J
    { shape: [[0,0,1],[1,1,1]],   color: "#818cf8" }, // L
  ];

  const emptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const rotate = (shape) => shape[0].map((_, i) => shape.map(row => row[i]).reverse());
  const randomPiece = () => {
    const t = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
    return { shape: t.shape, color: t.color, x: Math.floor(COLS / 2) - Math.floor(t.shape[0].length / 2), y: 0 };
  };

  const fits = (board, piece, dx = 0, dy = 0, shape = piece.shape) => {
    for (let r = 0; r < shape.length; r++)
      for (let c = 0; c < shape[r].length; c++) {
        if (!shape[r][c]) continue;
        const nx = piece.x + c + dx, ny = piece.y + r + dy;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
        if (ny >= 0 && board[ny][nx]) return false;
      }
    return true;
  };

  const ghostY = (board, piece) => {
    let dy = 0;
    while (fits(board, piece, 0, dy + 1)) dy++;
    return piece.y + dy;
  };

  const lock = (board, piece) => {
    const next = board.map(row => [...row]);
    piece.shape.forEach((row, r) => row.forEach((v, c) => {
      if (v && piece.y + r >= 0) next[piece.y + r][piece.x + c] = piece.color;
    }));
    return next;
  };

  const clearLines = (board) => {
    const remaining = board.filter(row => row.some(c => !c));
    const cleared = ROWS - remaining.length;
    return { newBoard: [...Array.from({ length: cleared }, () => Array(COLS).fill(null)), ...remaining], cleared };
  };

  const draw = (ctx, s) => {
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

    // subtle grid
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, ROWS * CELL); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(COLS * CELL, y * CELL); ctx.stroke(); }

    // board
    s.board.forEach((row, r) => row.forEach((color, c) => {
      if (!color) return;
      ctx.fillStyle = color;
      ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
      // shine
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, 6);
    }));

    // ghost piece
    if (s.piece) {
      const gy = ghostY(s.board, s.piece);
      s.piece.shape.forEach((row, r) => row.forEach((v, c) => {
        if (!v) return;
        ctx.strokeStyle = s.piece.color + "55";
        ctx.lineWidth = 1;
        ctx.strokeRect((s.piece.x + c) * CELL + 2, (gy + r) * CELL + 2, CELL - 4, CELL - 4);
      }));
    }

    // active piece
    if (s.piece) {
      s.piece.shape.forEach((row, r) => row.forEach((v, c) => {
        if (!v) return;
        ctx.fillStyle = s.piece.color;
        ctx.fillRect((s.piece.x + c) * CELL + 1, (s.piece.y + r) * CELL + 1, CELL - 2, CELL - 2);
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fillRect((s.piece.x + c) * CELL + 1, (s.piece.y + r) * CELL + 1, CELL - 2, 6);
      }));
    }
  };

  const lockAndNext = (s, ctx) => {
    s.board = lock(s.board, s.piece);
    const { newBoard, cleared } = clearLines(s.board);
    s.board = newBoard;
    s.totalLines = (s.totalLines || 0) + cleared;
    const pts = [0, 100, 300, 500, 800][cleared] || 0;
    s.score += pts * s.level;
    s.level = Math.floor(s.totalLines / 10) + 1;
    setScore(s.score);
    setLines(s.totalLines);
    setLevel(s.level);
    s.piece = randomPiece();
    if (!fits(s.board, s.piece, 0, 0)) {
      s.dead = true;
      setGameOver(true);
      clearInterval(loopRef.current);
    }
  };

  const startGame = () => {
    stateRef.current = { board: emptyBoard(), piece: randomPiece(), score: 0, tick: 0, level: 1, totalLines: 0 };
    setScore(0); setLines(0); setLevel(1);
    setGameOver(false);
    setStarted(true);
  };

  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const onKey = (e) => {
      const s = stateRef.current;
      if (!s || s.dead) return;
      if (e.key === "ArrowLeft"  && fits(s.board, s.piece, -1, 0)) { e.preventDefault(); s.piece.x -= 1; draw(ctx, s); }
      if (e.key === "ArrowRight" && fits(s.board, s.piece,  1, 0)) { e.preventDefault(); s.piece.x += 1; draw(ctx, s); }
      if (e.key === "ArrowDown") { e.preventDefault();
        if (fits(s.board, s.piece, 0, 1)) { s.piece.y += 1; draw(ctx, s); }
      }
      if (e.key === "ArrowUp") { e.preventDefault();
        const rotated = rotate(s.piece.shape);
        if (fits(s.board, s.piece, 0, 0, rotated)) { s.piece.shape = rotated; draw(ctx, s); }
      }
      if (e.key === " ") { e.preventDefault();
        // hard drop
        s.piece.y = ghostY(s.board, s.piece);
        lockAndNext(s, ctx);
        draw(ctx, s);
      }
    };
    window.addEventListener("keydown", onKey);

    loopRef.current = setInterval(() => {
      const s = stateRef.current;
      if (!s || s.dead) return;
      s.tick++;
      const speed = Math.max(3, 20 - (s.level - 1) * 2);
      if (s.tick % speed !== 0) return;
      if (fits(s.board, s.piece, 0, 1)) {
        s.piece.y += 1;
      } else {
        lockAndNext(s, ctx);
      }
      draw(ctx, s);
    }, 50);

    draw(ctx, stateRef.current);
    return () => { clearInterval(loopRef.current); window.removeEventListener("keydown", onKey); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  useEffect(() => () => clearInterval(loopRef.current), []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      {!started && !gameOver && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", minHeight: "60vh", gap: "20px" }}>
          <div style={{ fontSize: "52px" }}>🟦</div>
          <div style={{ fontSize: "22px", fontWeight: "900", color: "#818cf8", letterSpacing: "3px", textShadow: "0 0 20px #818cf866" }}>STACK OR DIE</div>
          <div style={{ fontSize: "11px", color: "#555", textAlign: "center", lineHeight: "1.9" }}>
            Ghost piece shows where it lands.<br />
            SPACE to hard drop instantly.<br />
            <span style={{ color: "#333" }}>It speeds up. You will panic.</span>
          </div>
          <div style={{ display: "flex", gap: "24px", fontSize: "10px", color: "#333", letterSpacing: "1px", marginTop: "4px" }}>
            <span>← → MOVE</span><span>↑ ROTATE</span><span>↓ SOFT</span><span style={{ color: "#818cf8" }}>SPACE HARD DROP</span>
          </div>
          <button onClick={startGame} style={{ marginTop: "8px", padding: "14px 40px", background: "transparent", border: "2px solid #818cf8", borderRadius: "8px", color: "#818cf8", fontSize: "13px", fontWeight: "800", letterSpacing: "3px", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 0 20px #818cf840", transition: "all 0.2s" }}
            onMouseEnter={e => e.target.style.boxShadow = "0 0 30px #818cf8aa"}
            onMouseLeave={e => e.target.style.boxShadow = "0 0 20px #818cf840"}>
            START STACKING
          </button>
        </div>
      )}
      {gameOver && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", minHeight: "60vh", gap: "20px" }}>
          <div style={{ fontSize: "52px" }}>💥</div>
          <div style={{ fontSize: "22px", fontWeight: "900", color: "#e63946", letterSpacing: "3px", textShadow: "0 0 20px #e6394666" }}>TOPPED OUT</div>
          <div style={{ display: "flex", gap: "24px" }}>
            {[["SCORE", score, "#818cf8"], ["LINES", lines, "#4ade80"], ["LEVEL", level, "#fbbf24"]].map(([l, v, c]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#444" }}>{l}</div>
                <div style={{ fontSize: "26px", fontWeight: "900", color: c }}>{v}</div>
              </div>
            ))}
          </div>
          <button onClick={startGame} style={{ marginTop: "8px", padding: "14px 40px", background: "transparent", border: "2px solid #818cf8", borderRadius: "8px", color: "#818cf8", fontSize: "13px", fontWeight: "800", letterSpacing: "3px", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 0 20px #818cf840", transition: "all 0.2s" }}
            onMouseEnter={e => e.target.style.boxShadow = "0 0 30px #818cf8aa"}
            onMouseLeave={e => e.target.style.boxShadow = "0 0 20px #818cf840"}>
            ONE MORE GAME
          </button>
        </div>
      )}
      {started && !gameOver && (
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", justifyContent: "center", flexWrap: "wrap" }}>
          <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL}
            style={{ border: "1px solid #222", borderRadius: "6px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "110px" }}>
            {[["SCORE", score, "#818cf8"], ["LINES", lines, "#4ade80"], ["LEVEL", level, "#fbbf24"]].map(([l, v, c]) => (
              <div key={l} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "10px 14px" }}>
                <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#444", marginBottom: "4px" }}>{l}</div>
                <div style={{ fontSize: "22px", fontWeight: "900", color: c }}>{v}</div>
              </div>
            ))}
            <div style={{ fontSize: "10px", color: "#333", lineHeight: "2.2", marginTop: "4px" }}>
              ← → MOVE<br/>↑ ROTATE<br/>↓ SOFT DROP<br/><span style={{ color: "#818cf8" }}>SPACE DROP</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── GAME SELECTOR ─────────────────────────────────────────────────────────────
// ── TYPING GAME ───────────────────────────────────────────────────────────────
const TYPING_PROMPTS = [
  "the quick brown fox jumps over the lazy dog",
  "to be or not to be that is the question",
  "all that glitters is not gold",
  "do or do not there is no try",
  "with great power comes great responsibility",
  "in the middle of every difficulty lies opportunity",
  "the only way to do great work is to love what you do",
  "code is like humor when you have to explain it it is bad",
  "first solve the problem then write the code",
  "talk is cheap show me the code",
  "any fool can write code that a computer can understand",
  "experience is the name everyone gives to their mistakes",
  "the best time to apply was yesterday the next best time is now",
  "rejection is just redirection keep going",
  "your resume is a story make it worth reading",
];

function TypingGame() {
  const [phase, setPhase] = useState("idle"); // idle | countdown | playing | done
  const [prompt, setPrompt] = useState("");
  const [input, setInput] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [bestWpm, setBestWpm] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const correctCharsRef = useRef(0);
  const totalCharsRef = useRef(0);

  const pickPrompt = () => TYPING_PROMPTS[Math.floor(Math.random() * TYPING_PROMPTS.length)];

  const startRound = () => {
    setPrompt(pickPrompt());
    setInput("");
    setCountdown(3);
    setPhase("countdown");
    correctCharsRef.current = 0;
    totalCharsRef.current = 0;
    let c = 3;
    const cd = setInterval(() => {
      c--;
      setCountdown(c);
      if (c === 0) {
        clearInterval(cd);
        setPhase("playing");
        setTimeLeft(60);
        startTimeRef.current = Date.now();
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }, 1000);
  };

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          finishRound();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const finishRound = () => {
    setPhase("done");
    const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
    const words = correctCharsRef.current / 5;
    const finalWpm = Math.round(words / elapsed);
    const finalAcc = totalCharsRef.current > 0 ? Math.round((correctCharsRef.current / totalCharsRef.current) * 100) : 100;
    setWpm(finalWpm);
    setAccuracy(finalAcc);
    setBestWpm(prev => Math.max(prev, finalWpm));
  };

  const handleInput = (e) => {
    if (phase !== "playing") return;
    const val = e.target.value;
    // check if prompt completed
    if (val === prompt) {
      clearInterval(timerRef.current);
      correctCharsRef.current += val.length;
      totalCharsRef.current += val.length;
      finishRound();
      return;
    }
    // count correct chars typed so far
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === prompt[i]) correct++;
    }
    correctCharsRef.current = correct;
    totalCharsRef.current = Math.max(totalCharsRef.current, val.length);
    // live wpm
    const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
    if (elapsed > 0) setWpm(Math.round((correct / 5) / elapsed));
    setInput(val);
  };

  // render prompt with colored chars
  const renderPrompt = () => prompt.split("").map((ch, i) => {
    let color = "#444";
    if (i < input.length) color = input[i] === ch ? "#4ade80" : "#e63946";
    else if (i === input.length) color = "#fff";
    return <span key={i} style={{ color, borderBottom: i === input.length ? "2px solid #e63946" : "none" }}>{ch}</span>;
  });

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#e63946" }}>SPEED TYPING</div>
        {bestWpm > 0 && <div style={{ fontSize: "10px", color: "#444", letterSpacing: "1px" }}>BEST: <span style={{ color: "#888" }}>{bestWpm} WPM</span></div>}
      </div>

      {phase === "idle" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "55vh", gap: "20px" }}>
          <div style={{ fontSize: "52px" }}>⌨️</div>
          <div style={{ fontSize: "22px", fontWeight: "900", color: "#fbbf24", letterSpacing: "3px", textShadow: "0 0 20px #fbbf2466" }}>HOW FAST ARE YOU?</div>
          <div style={{ fontSize: "11px", color: "#555", textAlign: "center", lineHeight: "1.9" }}>
            60 seconds. Type the prompt as fast as you can.<br />
            <span style={{ color: "#4ade80" }}>Green</span> = correct &nbsp;·&nbsp; <span style={{ color: "#e63946" }}>Red</span> = wrong &nbsp;·&nbsp; <span style={{ color: "#fff" }}>White</span> = next<br />
            <span style={{ color: "#333" }}>Devs who can't type fast are a liability.</span>
          </div>
          <button onClick={startRound} style={{ marginTop: "8px", padding: "14px 40px", background: "transparent", border: "2px solid #fbbf24", borderRadius: "8px", color: "#fbbf24", fontSize: "13px", fontWeight: "800", letterSpacing: "3px", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 0 20px #fbbf2440", transition: "all 0.2s" }}
            onMouseEnter={e => e.target.style.boxShadow = "0 0 30px #fbbf24aa"}
            onMouseLeave={e => e.target.style.boxShadow = "0 0 20px #fbbf2440"}>
            START TYPING
          </button>
        </div>
      )}

      {phase === "countdown" && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: "80px", fontWeight: "900", color: "#e63946", lineHeight: 1 }}>{countdown || "GO!"}</div>
          <div style={{ fontSize: "12px", color: "#444", marginTop: "12px", letterSpacing: "2px" }}>GET READY</div>
        </div>
      )}

      {phase === "playing" && (
        <>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "10px 16px", flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "9px", color: "#444", letterSpacing: "2px" }}>WPM</div>
              <div style={{ fontSize: "24px", fontWeight: "900", color: "#e63946" }}>{wpm}</div>
            </div>
            <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "6px", padding: "10px 16px", flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "9px", color: "#444", letterSpacing: "2px" }}>TIME</div>
              <div style={{ fontSize: "24px", fontWeight: "900", color: timeLeft <= 10 ? "#e63946" : "#fff" }}>{timeLeft}s</div>
            </div>
          </div>
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "20px", fontSize: "18px", lineHeight: "1.9", letterSpacing: "0.5px", fontFamily: "'JetBrains Mono', monospace" }}>
            {renderPrompt()}
          </div>
          <input
            ref={inputRef}
            value={input}
            onChange={handleInput}
            style={{ background: "#0d0d0d", border: "1px solid #333", borderRadius: "6px", padding: "12px 16px", color: "#fff", fontSize: "16px", fontFamily: "'JetBrains Mono', monospace", outline: "none", width: "100%", boxSizing: "border-box" }}
            placeholder="start typing..."
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
          />
        </>
      )}

      {phase === "done" && (
        <div style={{ textAlign: "center", padding: "24px 0", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "16px" }}>
            {[["WPM", wpm, wpm >= 60 ? "#4ade80" : wpm >= 40 ? "#fbbf24" : "#e63946"],
              ["ACCURACY", `${accuracy}%`, accuracy >= 95 ? "#4ade80" : accuracy >= 80 ? "#fbbf24" : "#e63946"]
            ].map(([l, v, c]) => (
              <div key={l} style={{ background: "#111", border: `1px solid ${c}40`, borderRadius: "8px", padding: "16px 28px" }}>
                <div style={{ fontSize: "10px", color: "#444", letterSpacing: "2px", marginBottom: "4px" }}>{l}</div>
                <div style={{ fontSize: "32px", fontWeight: "900", color: c }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "12px", color: "#444" }}>
            {wpm >= 80 ? "🔥 Absolutely blazing. Hire this person." :
             wpm >= 60 ? "⚡ Fast fingers. Impressive." :
             wpm >= 40 ? "👍 Not bad. Keep practicing." :
             "🐢 Slow and steady... mostly just slow."}
          </div>
          <button onClick={startRound} className="game-launch-btn">TRY AGAIN</button>
        </div>
      )}
    </div>
  );
}

// ── GAME SELECTOR ─────────────────────────────────────────────────────────────
function GameSelector() {
  const [activeGame, setActiveGame] = useState(null);

  const GAMES = [
    { id: "doom",   emoji: "🔫", name: "DOOM",   sub: "The classic. Rip and tear." },
    { id: "snake",  emoji: "🐍", name: "SNAKE",  sub: "Eat. Grow. Die. Repeat." },
    { id: "pong",   emoji: "🏓", name: "PONG",   sub: "You vs. the machine." },
    { id: "tetris", emoji: "🟦", name: "TETRIS", sub: "Stack until you can't." },
    { id: "typing", emoji: "⌨️", name: "TYPING", sub: "How fast are your fingers?" },
  ];

  if (activeGame === "doom")   return <><BackBtn onClick={() => setActiveGame(null)} /><MiniGame /></>;
  if (activeGame === "snake")  return <><BackBtn onClick={() => setActiveGame(null)} /><SnakeGame /></>;
  if (activeGame === "pong")   return <><BackBtn onClick={() => setActiveGame(null)} /><PongGame /></>;
  if (activeGame === "tetris") return <><BackBtn onClick={() => setActiveGame(null)} /><TetrisGame /></>;
  if (activeGame === "typing") return <><BackBtn onClick={() => setActiveGame(null)} /><TypingGame /></>;

  const GAME_STYLES = {
    doom: {
      accent: "#e63946",
      bg: "linear-gradient(135deg, #1a0000 0%, #0d0d0d 100%)",
      border: "#e63946",
      label: "💀 RIP AND TEAR",
      labelColor: "#e63946",
      title: "DOOM",
      desc: "The original. The legend.\nGo to hell. Literally.",
      tag: "CLASSIC · SHAREWARE",
      tagColor: "#e6394625",
    },
    snake: {
      accent: "#4ade80",
      bg: "linear-gradient(135deg, #001a08 0%, #0d0d0d 100%)",
border: "#4ade80",
      label: "🐍 HUNGRY",
      labelColor: "#4ade80",
      title: "SNAKE",
      desc: "Eat the red dot.\nDon't eat yourself.\nYou will eat yourself.",
      tag: "ARCADE · INFINITE",
      tagColor: "#4ade8025",
    },
    pong: {
      accent: "#f0f0f0",
      bg: "linear-gradient(135deg, #111 0%, #0d0d0d 100%)",
      border: "#555",
      label: "🏓 YOU VS AI",
      labelColor: "#aaa",
      title: "PONG",
      desc: "The AI cheats a little.\nYou probably still lose.\nProve us wrong.",
      tag: "2 PLAYER · AI",
      tagColor: "#55555530",
    },
    tetris: {
      accent: "#818cf8",
      bg: "linear-gradient(135deg, #07071a 0%, #0d0d0d 100%)",
      border: "#818cf8",
      label: "🟦 BLOCK STACKER",
      labelColor: "#818cf8",
      title: "TETRIS",
      desc: "Ghost piece. Hard drop.\nLevel up. Stack faster.\nDie eventually.",
      tag: "MODERN · SPEEDRUN",
      tagColor: "#818cf825",
    },
    typing: {
      accent: "#fbbf24",
      bg: "linear-gradient(135deg, #1a1200 0%, #0d0d0d 100%)",
      border: "#fbbf24",
      label: "⌨️ TYPE FASTER",
      labelColor: "#fbbf24",
      title: "TYPING TEST",
      desc: "60 seconds.\nProve you can type.\nDevs must type fast.",
      tag: "60s · WPM SCORE",
      tagColor: "#fbbf2425",
    },
  };

  return (
    <div style={{ padding: "16px 0" }}>
      <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#e63946", marginBottom: "24px" }}>▶ SELECT GAME</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px", maxWidth: "720px" }}>
        {Object.entries(GAME_STYLES).map(([id, g]) => (
          <button key={id} onClick={() => setActiveGame(id)} style={{
            background: g.bg,
            border: "1px solid #1a1a1a",
            borderRadius: "12px",
            padding: "0",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s",
            outline: "none",
            overflow: "hidden",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = g.border; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${g.accent}25`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            {/* top accent bar */}
            <div style={{ height: "3px", background: g.accent, width: "100%" }} />
            <div style={{ padding: "18px 20px 20px" }}>
              {/* label */}
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: g.labelColor, marginBottom: "10px", fontWeight: "800" }}>{g.label}</div>
              {/* title */}
              <div style={{ fontSize: "20px", fontWeight: "900", color: "#fff", letterSpacing: "1px", marginBottom: "10px" }}>{g.title}</div>
              {/* desc */}
              <div style={{ fontSize: "11px", color: "#555", lineHeight: "1.8", whiteSpace: "pre-line", marginBottom: "14px" }}>{g.desc}</div>
              {/* tag */}
              <div style={{ display: "inline-block", fontSize: "9px", letterSpacing: "1.5px", color: g.accent, background: g.tagColor, padding: "3px 8px", borderRadius: "3px" }}>{g.tag}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} className="ghost-btn" style={{ marginBottom: "16px" }}>← BACK</button>
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
  const [quip, setQuip] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [toneStarted, setToneStarted] = useState(false);
  const [importMsg, setImportMsg] = useState(null);
  const [tab, setTab] = useState("tracker");
  const [welcomed, setWelcomed] = useState(false);
  const [sortBy, setSortBy] = useState("date-desc");
  const [customSounds, setCustomSounds] = useState({});
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

  // Load custom sounds from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("custom-sounds");
      if (saved) setCustomSounds(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const saveCustomSound = (status, dataUrl) => {
    const updated = { ...customSounds, [status]: dataUrl };
    setCustomSounds(updated);
    try { localStorage.setItem("custom-sounds", JSON.stringify(updated)); } catch (e) {}
  };

  const removeCustomSound = (status) => {
    const updated = { ...customSounds };
    delete updated[status];
    setCustomSounds(updated);
    try { localStorage.setItem("custom-sounds", JSON.stringify(updated)); } catch (e) {}
  };

  const togglePin = (id) => {
    saveJobs(jobs.map(j => j.id === id ? { ...j, pinned: !j.pinned } : j));
  };

  // Unlock ALL audio contexts on first user interaction (covers Tone.js + DOSBox)
  useEffect(() => {
    const unlock = () => {
      Tone.start();
      // Resume any suspended AudioContexts including DOSBox's
      if (window.AudioContext || window.webkitAudioContext) {
        const allContexts = Tone.context.rawContext ? [Tone.context.rawContext] : [];
        allContexts.forEach(ctx => { if (ctx.state === "suspended") ctx.resume(); });
      }
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
    document.addEventListener("click", unlock);
    document.addEventListener("keydown", unlock);
    return () => {
      document.removeEventListener("click", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);

  const showQuip = (status) => {
    const quips = STATUS_QUIPS[status] || [];
    const text = quips[Math.floor(Math.random() * quips.length)];
    setQuip({ text: `${STATUS_EMOJIS[status] || ""} ${text}`, status });
    setTimeout(() => setQuip(null), 2500);
  };

  const playSound = (status) => {
    if (!soundOn || !toneStarted) return;
    if (customSounds[status]) {
      try {
        const audio = new Audio(customSounds[status]);
        audio.volume = 0.8;
        audio.play();
        return;
      } catch (e) {}
    }
    playStatusSound(status);
  };

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

  const filteredJobs = (() => {
    const base = filter === "All" ? searchedJobs : searchedJobs.filter(j => j.status === filter);
    const sorted = [...base].sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "company") return a.company.localeCompare(b.company);
      if (sortBy === "status") return STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status);
      return 0;
    });
    // Pinned always on top
    return [...sorted.filter(j => j.pinned), ...sorted.filter(j => !j.pinned)];
  })();
  const stats = STATUSES.reduce((acc, s) => { acc[s] = jobs.filter(j => j.status === s).length; return acc; }, {});

  if (!welcomed) return <WelcomeScreen onEnter={() => setWelcomed(true)} />;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", color: "#e63946" }}>Loading...</div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", color: "#f0f0f0" }}
      onClick={() => { if (!toneStarted) startTone(); }}>

      {/* Toasts */}
      {quip && (
        <div style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", background: "#111", border: `2px solid ${STATUS_COLORS[quip.status]?.border || "#e63946"}`, borderRadius: "8px", padding: "12px 24px", fontSize: "14px", fontWeight: "bold", color: STATUS_COLORS[quip.status]?.text || "#fff", zIndex: 200, animation: "popIn 0.3s ease-out", boxShadow: `0 4px 24px ${STATUS_COLORS[quip.status]?.border || "#e63946"}50`, whiteSpace: "nowrap" }}>
          {quip.text}
        </div>
      )}
      {importMsg && (
        <div style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", background: "#111", border: `2px solid ${importMsg.type === "success" ? "#22c55e" : "#e63946"}`, borderRadius: "8px", padding: "12px 24px", fontSize: "13px", fontWeight: "bold", color: importMsg.type === "success" ? "#22c55e" : "#e63946", zIndex: 200, animation: "popIn 0.3s ease-out", maxWidth: "90vw", textAlign: "center" }}>
          {importMsg.text}
        </div>
      )}

      {/* ── DESKTOP LAYOUT ── */}
      <div className="root-layout">

        {/* SIDEBAR (desktop only) */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#e63946", marginBottom: "4px" }}>▶ TRACKING ACTIVE</div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "#fff", letterSpacing: "-0.5px" }}>JOB.TRACKER()</div>
            <div style={{ fontSize: "10px", color: "#555", marginTop: "4px" }}>{jobs.length} application{jobs.length !== 1 ? "s" : ""} logged</div>
          </div>

          <nav className="sidebar-nav">
            {[
              { id: "tracker", icon: "▤", label: "TRACKER" },
              { id: "dashboard", icon: "▦", label: "STATS" },
              { id: "prep", icon: "◈", label: "PREP" },
              { id: "game", icon: "▶", label: "GAME" },
              { id: "options", icon: "⊙", label: "OPTIONS" },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`sidebar-btn${tab === t.id ? " active" : ""}`}>
                <span className="sidebar-icon">{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button onClick={(e) => { e.stopPropagation(); setSoundOn(!soundOn); }} className="sound-btn">
              {soundOn ? "🔊" : "🔇"} {soundOn ? "SOUND ON" : "MUTED"}
            </button>
            {!toneStarted && soundOn && <div style={{ fontSize: "9px", color: "#333", marginTop: "4px" }}>click to enable</div>}
            <div style={{ marginTop: "16px", fontSize: "9px", color: "#333", letterSpacing: "1px" }}>
              made by <span style={{ color: "#e63946" }}>Garry Gershon</span>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">

          {/* MOBILE HEADER */}
          <div className="mobile-header">
            <div>
              <div style={{ fontSize: "8px", letterSpacing: "3px", color: "#e63946" }}>▶ TRACKING ACTIVE</div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff" }}>JOB.TRACKER()</div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "10px", color: "#555" }}>{jobs.length} apps</span>
              <button onClick={(e) => { e.stopPropagation(); setSoundOn(!soundOn); }} style={{ background: "transparent", border: "1px solid #222", color: "#555", fontSize: "11px", padding: "3px 8px", borderRadius: "4px", cursor: "pointer", fontFamily: "inherit" }}>{soundOn ? "🔊" : "🔇"}</button>
            </div>
          </div>

          {/* MOBILE TABS */}
          <div className="mobile-tabs">
            {[
              { id: "tracker", label: "TRACKER" },
              { id: "dashboard", label: "STATS" },
              { id: "prep", label: "PREP" },
              { id: "options", label: "OPTIONS" },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`mobile-tab-btn${tab === t.id ? " active" : ""}`}>{t.label}</button>
            ))}
          </div>

          {/* ── TRACKER TAB ── */}
          {tab === "tracker" && (
            <div className="tracker-layout">

              {/* LEFT — form */}
              <div className="tracker-left">
                <div className="panel">
                  <div className="panel-title">NEW APPLICATION</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" onKeyDown={(e) => e.key === "Enter" && document.getElementById("role-input").focus()} className="field" />
                    <input id="role-input" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role / position" onKeyDown={(e) => e.key === "Enter" && document.getElementById("link-input").focus()} className="field" />
                    <input id="link-input" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Job posting URL (optional)" onKeyDown={(e) => e.key === "Enter" && addJob()} className="field link-field" />
                    <select value={source} onChange={(e) => setSource(e.target.value)} className="field">
                      {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={addJob} disabled={!company.trim() || !role.trim()} className={`add-btn${company.trim() && role.trim() ? " ready" : ""}`}>
                      + LOG APPLICATION
                    </button>
                  </div>
                </div>

                <div className="panel" style={{ marginTop: "12px" }}>
                  <div className="panel-title">FILTER & SORT</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                    {STATUSES.map(s => stats[s] > 0 && (
                      <div key={s} onClick={() => setFilter(filter === s ? "All" : s)}
                        style={{ padding: "3px 8px", borderRadius: "3px", fontSize: "10px", cursor: "pointer", transition: "all 0.15s",
                          background: filter === s ? STATUS_COLORS[s].border : "transparent",
                          color: filter === s ? "#fff" : STATUS_COLORS[s].text,
                          border: `1px solid ${STATUS_COLORS[s].border}` }}>
                        {STATUS_EMOJIS[s]} {s} {stats[s]}
                      </div>
                    ))}
                    {filter !== "All" && <div onClick={() => setFilter("All")} style={{ padding: "3px 8px", borderRadius: "3px", fontSize: "10px", color: "#555", border: "1px solid #222", cursor: "pointer" }}>clear ✕</div>}
                  </div>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="field" style={{ fontSize: "11px" }}>
                    <option value="date-desc">Newest first</option>
                    <option value="date-asc">Oldest first</option>
                    <option value="company">Company A–Z</option>
                    <option value="status">By status</option>
                  </select>
                </div>

                <div className="panel" style={{ marginTop: "12px" }}>
                  <div className="panel-title">DATA</div>
                  <input ref={fileInputRef} type="file" accept=".csv,.tsv,.xlsx,.xls" onChange={handleImport} style={{ display: "none" }} />
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="ghost-btn">📥 Import</button>
                    {jobs.length > 0 && <button onClick={exportCSV} className="ghost-btn">📤 Export CSV</button>}
                  </div>
                </div>
              </div>

              {/* RIGHT — job list */}
              <div className="tracker-right">
                <div style={{ position: "relative", marginBottom: "12px" }}>
                  <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#444", fontSize: "12px", pointerEvents: "none" }}>🔍</span>
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search company, role, notes..." className="field search-field" style={{ paddingLeft: "34px" }} />
                  {search && <span onClick={() => setSearch("")} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#444", cursor: "pointer", fontSize: "12px" }}>✕</span>}
                </div>

                {filteredJobs.length === 0 && (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: "#333", fontSize: "12px" }}>
                    {jobs.length === 0 ? "No applications yet. Add one above." : search ? `No results for "${search}"` : "Nothing matches this filter."}
                  </div>
                )}

                {/* Desktop table */}
                {filteredJobs.length > 0 && (
                  <div className="job-table-wrap">
                    <table className="job-table">
                      <thead>
                        <tr>
                          <th style={{ width: "28px" }}></th>
                          <th>COMPANY</th>
                          <th>ROLE</th>
                          <th>STATUS</th>
                          <th>DATE</th>
                          <th>SOURCE</th>
                          <th style={{ width: "80px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJobs.map((job) => (
                          <>
                            <tr key={job.id} className={`job-row${job.pinned ? " pinned" : ""}${editingId === job.id ? " editing" : ""}`}>
                              <td>
                                <button onClick={() => togglePin(job.id)} className={`pin-btn${job.pinned ? " pinned" : ""}`}>📌</button>
                              </td>
                              <td>
                                <div style={{ fontWeight: "600", color: "#f0f0f0", fontSize: "13px" }}>{job.company}</div>
                                {job.link && <a href={job.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontSize: "10px", color: "#e63946", textDecoration: "none" }}>↗ posting</a>}
                              </td>
                              <td style={{ color: "#aaa", fontSize: "12px" }}>{job.role}</td>
                              <td>
                                <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "3px", background: STATUS_COLORS[job.status]?.bg, color: STATUS_COLORS[job.status]?.text, border: `1px solid ${STATUS_COLORS[job.status]?.border}`, whiteSpace: "nowrap" }}>
                                  {STATUS_EMOJIS[job.status]} {job.status}
                                </span>
                              </td>
                              <td style={{ color: "#555", fontSize: "11px", whiteSpace: "nowrap" }}>{formatDate(job.date)}</td>
                              <td style={{ color: "#444", fontSize: "11px" }}>{job.source}</td>
                              <td>
                                <button onClick={() => { if (editingId === job.id) { setEditingId(null); } else { setEditingId(job.id); setEditStatus(job.status); setEditNotes(job.notes || ""); setEditLink(job.link || ""); setEditSalaryMin(job.salaryMin || ""); setEditSalaryMax(job.salaryMax || ""); } }} className="edit-btn">
                                  {editingId === job.id ? "CLOSE" : "EDIT"}
                                </button>
                              </td>
                            </tr>
                            {editingId === job.id && (
                              <tr key={job.id + "-edit"} className="edit-row">
                                <td colSpan={7}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px 0" }}>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                      <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="field" style={{ flex: "1 1 160px" }}>
                                        {STATUSES.map(s => <option key={s} value={s}>{STATUS_EMOJIS[s]} {s}</option>)}
                                      </select>
                                      <input value={editLink} onChange={(e) => setEditLink(e.target.value)} placeholder="Job posting link" className="field link-field" style={{ flex: "2 1 200px" }} />
                                    </div>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                      <input value={editSalaryMin} onChange={(e) => setEditSalaryMin(e.target.value)} placeholder="Salary min (NIS)" type="number" className="field" style={{ flex: 1, color: "#22c55e" }} />
                                      <input value={editSalaryMax} onChange={(e) => setEditSalaryMax(e.target.value)} placeholder="Salary max (NIS)" type="number" className="field" style={{ flex: 1, color: "#22c55e" }} />
                                    </div>
                                    <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Notes / interview prep..." rows={2} className="field" style={{ resize: "vertical" }} />
                                    <div style={{ display: "flex", gap: "8px" }}>
                                      <button onClick={() => updateJob(job.id)} className="add-btn ready" style={{ flex: 1 }}>SAVE</button>
                                      <button onClick={() => deleteJob(job.id)} className="ghost-btn danger">DELETE</button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── DASHBOARD TAB ── */}
          {tab === "dashboard" && <Dashboard jobs={jobs} />}

          {/* ── PREP TAB ── */}
          {tab === "prep" && <PrepTab />}

          {/* ── GAME TAB ── */}
          {tab === "game" && <GameSelector />}

          {/* ── OPTIONS TAB ── */}
          {tab === "options" && (
            <div style={{ maxWidth: "600px" }}>
              <div className="panel" style={{ marginBottom: "12px" }}>
                <div className="panel-title">SOUND</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: "#888" }}>Status sounds</span>
                  <button onClick={() => setSoundOn(s => !s)} className={`ghost-btn${soundOn ? "" : " danger"}`}>{soundOn ? "🔊 ON" : "🔇 OFF"}</button>
                </div>
              </div>

              <div className="panel">
                <div className="panel-title">CUSTOM SOUNDS</div>
                <div style={{ fontSize: "10px", color: "#444", marginBottom: "14px" }}>Upload MP3/WAV per status. Falls back to default if none set.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {STATUSES.map(s => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "11px", color: STATUS_COLORS[s].text, minWidth: "130px" }}>{STATUS_EMOJIS[s]} {s}</span>
                      {customSounds[s] ? (
                        <>
                          <span style={{ fontSize: "10px", color: "#22c55e", flex: 1 }}>✓ custom</span>
                          <button onClick={() => { const a = new Audio(customSounds[s]); a.volume = 0.8; a.play(); }} className="ghost-btn" style={{ padding: "2px 8px" }}>▶</button>
                          <button onClick={() => removeCustomSound(s)} className="ghost-btn danger" style={{ padding: "2px 8px" }}>✕</button>
                        </>
                      ) : (
                        <label className="ghost-btn" style={{ cursor: "pointer" }}>
                          + upload
                          <input type="file" accept="audio/*" style={{ display: "none" }} onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => saveCustomSound(s, ev.target.result);
                            reader.readAsDataURL(file);
                            e.target.value = "";
                          }} />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #0d0d0d; }
        input::placeholder { color: #333; }
        select option { background: #111; color: #f0f0f0; }

        /* ── ROOT LAYOUT ── */
        .root-layout { display: flex; min-height: 100vh; }

        /* ── SIDEBAR ── */
        .sidebar { display: none; }

        /* ── MOBILE HEADER ── */
        .mobile-header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #1a1a1a; }
        .mobile-tabs { display: flex; gap: 4px; padding: 8px 12px; background: #111; border-bottom: 1px solid #1a1a1a; overflow-x: auto; }
        .mobile-tab-btn { background: transparent; border: none; color: #444; font-size: 10px; font-family: inherit; font-weight: 700; letter-spacing: 1.5px; padding: 6px 12px; cursor: pointer; border-bottom: 2px solid transparent; white-space: nowrap; transition: all 0.15s; }
        .mobile-tab-btn.active { color: #e63946; border-bottom-color: #e63946; }

        /* ── MAIN CONTENT ── */
        .main-content { flex: 1; min-width: 0; overflow-y: auto; }

        /* ── TRACKER LAYOUT ── */
        .tracker-layout { display: flex; flex-direction: column; padding: 16px; gap: 16px; }
        .tracker-left { width: 100%; }
        .tracker-right { width: 100%; }

        /* ── PANELS ── */
        .panel { background: #111; border: 1px solid #1a1a1a; border-radius: 8px; padding: 16px; }
        .panel-title { font-size: 9px; letter-spacing: 3px; color: #e63946; margin-bottom: 14px; font-weight: 700; }

        /* ── FORM FIELDS ── */
        .field { width: 100%; padding: 9px 12px; background: #0d0d0d; border: 1px solid #1e1e1e; border-radius: 6px; color: #f0f0f0; font-size: 13px; font-family: inherit; outline: none; transition: border-color 0.15s; }
        .field:focus { border-color: #e63946; }
        .link-field { color: #e63946; }
        .search-field { background: #111; border-color: #1a1a1a; }

        /* ── BUTTONS ── */
        .add-btn { width: 100%; padding: 10px; background: #1a1a1a; border: 1px solid #222; border-radius: 6px; color: #444; font-size: 12px; font-family: inherit; font-weight: 700; letter-spacing: 2px; cursor: not-allowed; transition: all 0.15s; }
        .add-btn.ready { background: #e63946; border-color: #e63946; color: #fff; cursor: pointer; }
        .add-btn.ready:hover { background: #ff4757; }
        .ghost-btn { background: transparent; border: 1px solid #222; color: #555; font-size: 11px; font-family: inherit; padding: 6px 12px; border-radius: 4px; cursor: pointer; transition: all 0.15s; letter-spacing: 1px; }
        .ghost-btn:hover { border-color: #e63946; color: #e63946; }
        .ghost-btn.danger { border-color: #3a1a1a; color: #e63946; }
        .ghost-btn.danger:hover { background: #e63946; color: #fff; }

        /* ── JOB TABLE ── */
        .job-table-wrap { border: 1px solid #1a1a1a; border-radius: 8px; overflow: hidden; }
        .job-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .job-table thead tr { background: #111; border-bottom: 1px solid #1a1a1a; }
        .job-table th { padding: 10px 12px; text-align: left; font-size: 9px; letter-spacing: 2px; color: #333; font-weight: 700; }
        .job-row { border-bottom: 1px solid #141414; transition: background 0.1s; cursor: default; }
        .job-row:hover { background: #111; }
        .job-row.pinned { background: rgba(230,57,70,0.04); border-left: 2px solid #e63946; }
        .job-row.editing { background: #111; border-bottom: none; }
        .job-row td { padding: 10px 12px; vertical-align: middle; }
        .edit-row td { padding: 0 12px; background: #0d0d0d; border-bottom: 1px solid #1a1a1a; }
        .pin-btn { background: transparent; border: none; cursor: pointer; font-size: 12px; opacity: 0.2; transition: opacity 0.15s; padding: 0; }
        .pin-btn:hover, .pin-btn.pinned { opacity: 1; }
        .edit-btn { background: transparent; border: 1px solid #1e1e1e; color: #333; font-size: 9px; font-family: inherit; letter-spacing: 1px; padding: 3px 8px; border-radius: 3px; cursor: pointer; transition: all 0.15s; }
        .edit-btn:hover { border-color: #e63946; color: #e63946; }

        /* ── SOUND BTN ── */
        .sound-btn { background: transparent; border: 1px solid #1e1e1e; color: #333; font-size: 10px; font-family: inherit; padding: 6px 12px; border-radius: 4px; cursor: pointer; width: 100%; letter-spacing: 1px; transition: all 0.15s; }
        .sound-btn:hover { border-color: #e63946; color: #e63946; }

        /* ── WELCOME SCREEN ── */
        .welcome-overlay { position: fixed; inset: 0; background: #0d0d0d; z-index: 999; display: flex; align-items: center; justify-content: center; }
        .welcome-box { text-align: center; padding: 40px 24px; max-width: 480px; }
        .welcome-line { opacity: 0; animation: fadeUp 0.6s ease forwards; }
        .welcome-enter { background: #e63946; border: none; color: #fff; font-family: inherit; font-size: 14px; font-weight: 800; letter-spacing: 4px; padding: 14px 48px; border-radius: 6px; cursor: pointer; box-shadow: 0 0 32px #e6394640; transition: box-shadow 0.2s, transform 0.2s; }
        .welcome-enter:hover { box-shadow: 0 0 48px #e63946aa; transform: scale(1.03); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        /* ── GAME GRID ── */
        .game-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 560px; }
        .game-card { background: #111; border: 1px solid #1a1a1a; border-radius: 10px; padding: 28px 20px; cursor: pointer; transition: all 0.2s; text-align: center; }
        .game-card:hover { border-color: #e63946; background: #1a0a0b; transform: translateY(-2px); }
        .game-card-icon, .game-card-emoji { font-size: 40px; margin-bottom: 12px; }
        .game-card-name { font-size: 13px; font-weight: 800; letter-spacing: 3px; color: #fff; margin-bottom: 6px; }
        .game-card-desc, .game-card-sub { font-size: 10px; color: #444; letter-spacing: 1px; }

        /* ── ANIMATIONS ── */
        @keyframes shimmer { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { 0% { opacity: 0; transform: translateX(-50%) scale(0.9); } 100% { opacity: 1; transform: translateX(-50%) scale(1); } }

        /* ── DOOM CANVAS ── */
        #doom-canvas { width: 100% !important; max-width: 1400px !important; height: auto !important; image-rendering: pixelated; border-radius: 6px; transform: scaleX(1.08); transform-origin: center; }

        /* ── DESKTOP (≥900px) ── */
        @media (min-width: 900px) {
          .mobile-header { display: none; }
          .mobile-tabs { display: none; }

          .sidebar {
            display: flex; flex-direction: column;
            width: 220px; flex-shrink: 0;
            background: #0a0a0a; border-right: 1px solid #1a1a1a;
            padding: 24px 16px; position: sticky; top: 0; height: 100vh;
          }
          .sidebar-logo { padding-bottom: 24px; border-bottom: 1px solid #1a1a1a; margin-bottom: 24px; }
          .sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
          .sidebar-btn {
            display: flex; align-items: center; gap: 10px;
            background: transparent; border: none; border-radius: 6px;
            color: #333; font-size: 11px; font-family: inherit; font-weight: 700;
            letter-spacing: 2px; padding: 10px 12px; cursor: pointer;
            text-align: left; width: 100%; transition: all 0.15s;
          }
          .sidebar-btn:hover { background: #111; color: #888; }
          .sidebar-btn.active { background: #1a0a0b; color: #e63946; border-left: 2px solid #e63946; }
          .sidebar-icon { font-size: 14px; width: 18px; text-align: center; }
          .sidebar-footer { padding-top: 16px; border-top: 1px solid #1a1a1a; }

          .tracker-layout { flex-direction: row; gap: 20px; padding: 24px; align-items: flex-start; }
          .tracker-left { width: 300px; flex-shrink: 0; position: sticky; top: 24px; }
          .tracker-right { flex: 1; min-width: 0; }
        }
      `}</style>
    </div>
  );
}
