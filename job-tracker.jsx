import { useState, useEffect, useCallback, useRef } from "react";
import * as Tone from "tone";
import * as Papa from "papaparse";

const STATUSES = ["Applied", "HR Call", "Interview", "Technical", "Offer", "Rejected", "Declined", "No Response"];
const SOURCES = ["LinkedIn", "AllJobs", "Drushim", "Company Site", "Referral", "Other"];

const STATUS_COLORS = {
  "Applied": { bg: "#1e3a5f", border: "#2563eb", text: "#60a5fa" },
  "HR Call": { bg: "#3b2f1a", border: "#d97706", text: "#fbbf24" },
  "Interview": { bg: "#2d1f3d", border: "#7c3aed", text: "#a78bfa" },
  "Technical": { bg: "#1a2f3b", border: "#0891b2", text: "#22d3ee" },
  "Offer": { bg: "#1a3b2a", border: "#16a34a", text: "#4ade80" },
  "Rejected": { bg: "#3b1a1a", border: "#dc2626", text: "#f87171" },
  "Declined": { bg: "#2d2a1a", border: "#ca8a04", text: "#facc15" },
  "No Response": { bg: "#1e1e2e", border: "#475569", text: "#94a3b8" },
};

const STATUS_EMOJIS = {
  "Applied": "📤", "HR Call": "📞", "Interview": "🎤",
  "Technical": "🧠", "Offer": "🎉", "Rejected": "💀", "Declined": "✋", "No Response": "👻",
};

const STATUS_QUIPS = {
  "Applied": ["Oh boy, here we go again!", "Another one into the void!", "Fingers crossed!", "Let's gooo!"],
  "HR Call": ["They called!! Act cool!", "Don't panic. DON'T PANIC.", "This is not a drill!"],
  "Interview": ["Suit up! (or at least a clean shirt)", "You got this, Garry!", "Elevator pitch: READY"],
  "Technical": ["Big brain time!", "Show them what you know!", "GCP powers: ACTIVATE"],
  "Offer": ["NO WAY!! LET'S GOOOOO!", "YOU DID IT!!", "Time to negotiate like a boss!"],
  "Rejected": ["FUAHHH!", "Their loss, not yours.", "Next! NEXT!!", "Pain. But we move."],
  "Declined": ["Thanks but no thanks!", "I know my worth.", "Not this one, chief.", "On to better things!"],
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
      const synth = new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.05, decay: 0.4, sustain: 0.3, release: 0.5 } }).toDestination();
      synth.volume.value = -6;
      synth.triggerAttackRelease("Bb3", "4n", now);
      synth.triggerAttackRelease("A3", "4n", now + 0.35);
      synth.triggerAttackRelease("Ab3", "4n", now + 0.7);
      synth.triggerAttackRelease("G2", "2n", now + 1.1);
      setTimeout(() => synth.dispose(), 3000);
    } else if (status === "Declined") {
      // Confident snap - short and decisive
      const synth = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.01, decay: 0.15, sustain: 0, release: 0.1 } }).toDestination();
      synth.volume.value = -8;
      synth.triggerAttackRelease("E5", "16n", now);
      synth.triggerAttackRelease("C5", "16n", now + 0.1);
      synth.triggerAttackRelease("G4", "8n", now + 0.2);
      setTimeout(() => synth.dispose(), 1000);
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

    if (!companyVal.toString().trim() || !roleVal.toString().trim()) {
      skipped++;
      return;
    }

    let parsedDate;
    if (dateVal) {
      const d = new Date(dateVal);
      parsedDate = isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
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
    });
  });

  return { imported, skipped };
}

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
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [flash, setFlash] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(true);
  const [quip, setQuip] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [toneStarted, setToneStarted] = useState(false);
  const [importMsg, setImportMsg] = useState(null);
  const fileInputRef = useRef(null);

  // All LinkedIn applications from Garry
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
          // Seed with LinkedIn applications
          const seeded = SEED_DATA.map((j, i) => ({
            ...j,
            id: Date.now() + i,
            date: j.date ? new Date(j.date).toISOString() : new Date().toISOString(),
          }));
          setJobs(seeded);
          await window.storage.set("job-applications", JSON.stringify(seeded));
        }
      } catch (e) {
        // If storage fails, still load seed data
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
    saveJobs(jobs.map(j => j.id === id ? { ...j, status: editStatus, notes: editNotes, link: editLink } : j));
    setEditingId(null);
    playSound(editStatus); showQuip(editStatus);
  };

  const deleteJob = (id) => { saveJobs(jobs.filter(j => j.id !== id)); setEditingId(null); };

  const exportCSV = () => {
    const headers = "Company,Role,Source,Date Applied,Status,Notes,Link\n";
    const rows = jobs.map(j => `"${j.company}","${j.role}","${j.source}","${formatDate(j.date)}","${j.status}","${j.notes || ""}","${j.link || ""}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `job_applications_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const showImportMessage = (text, type) => {
    setImportMsg({ text, type });
    setTimeout(() => setImportMsg(null), 4000);
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
      // Use PapaParse for CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const { imported, skipped } = parseRows(results.data);
          mergeImported(imported, skipped);
        },
        error: () => {
          showImportMessage("Failed to read CSV file.", "error");
        },
      });
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      // For Excel files, export from Excel as CSV first
      showImportMessage("For .xlsx files, please save as CSV first in Excel (File > Save As > CSV). Then import the CSV here.", "error");
    } else {
      showImportMessage("Please use a .csv file. For .xlsx, save as CSV first in Excel.", "error");
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
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "4px", color: "#22d3ee", marginBottom: "6px" }}>&gt;&gt; TRACKING ACTIVE &lt;&lt;</div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 4px 0", background: "linear-gradient(90deg, #22d3ee, #818cf8, #22d3ee)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 3s linear infinite" }}>JOB.TRACKER()</h1>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "11px", color: "#64748b" }}>{jobs.length} application{jobs.length !== 1 ? "s" : ""} logged</span>
            <button onClick={(e) => { e.stopPropagation(); setSoundOn(!soundOn); }} style={{ background: "transparent", border: `1px solid ${soundOn ? "#22d3ee" : "#334155"}`, color: soundOn ? "#22d3ee" : "#475569", fontSize: "12px", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", fontFamily: "inherit" }}>{soundOn ? "🔊" : "🔇"}</button>
          </div>
          {!toneStarted && soundOn && <div style={{ fontSize: "9px", color: "#334155", marginTop: "4px" }}>click anywhere to enable sounds</div>}
        </div>

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
            {jobs.length === 0 ? "No applications logged yet. Start applying or import from CSV!" : search ? `No results for "${search}"` : "No applications match this filter."}
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
                {job.link && <a href={job.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontSize: "10px", color: "#818cf8", marginTop: "2px", display: "inline-block", textDecoration: "none" }}>🔗 View posting</a>}
              </div>
              <button onClick={() => { if (editingId === job.id) { setEditingId(null); } else { setEditingId(job.id); setEditStatus(job.status); setEditNotes(job.notes || ""); setEditLink(job.link || ""); } }} style={{ background: "transparent", border: "1px solid #334155", color: "#64748b", fontSize: "10px", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", flexShrink: 0 }}>{editingId === job.id ? "CLOSE" : "EDIT"}</button>
            </div>

            {editingId === job.id && (
              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #1e3a5f", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} style={{ padding: "8px 10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #1e3a5f", color: "#e2e8f0", fontSize: "12px", outline: "none", fontFamily: "inherit" }}>
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_EMOJIS[s]} {s}</option>)}
                  </select>
                  <input value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Add a note..." onKeyDown={(e) => e.key === "Enter" && updateJob(job.id)} style={{ flex: 1, padding: "8px 10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #1e3a5f", color: "#e2e8f0", fontSize: "12px", outline: "none", fontFamily: "inherit", minWidth: "120px" }} />
                </div>
                <input value={editLink} onChange={(e) => setEditLink(e.target.value)} placeholder="Job posting link (optional)" style={{ padding: "8px 10px", borderRadius: "6px", background: "#0f172a", border: "1px solid #1e3a5f", color: "#818cf8", fontSize: "11px", outline: "none", fontFamily: "inherit" }} />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => updateJob(job.id)} style={{ flex: 1, padding: "8px", borderRadius: "6px", background: "#22d3ee", border: "none", color: "#0a0e17", fontSize: "11px", fontWeight: "bold", cursor: "pointer", fontFamily: "inherit" }}>SAVE</button>
                  <button onClick={() => deleteJob(job.id)} style={{ padding: "8px 16px", borderRadius: "6px", background: "transparent", border: "1px solid #dc2626", color: "#f87171", fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>DELETE</button>
                </div>
              </div>
            )}
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "20px", flexWrap: "wrap" }}>
          <input ref={fileInputRef} type="file" accept=".csv,.tsv" onChange={handleImport} style={{ display: "none" }} />
          <button
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            style={{ padding: "10px 24px", borderRadius: "6px", background: "transparent", border: "1px solid #334155", color: "#64748b", fontSize: "11px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "1px", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.target.style.borderColor = "#818cf8"; e.target.style.color = "#818cf8"; }}
            onMouseLeave={(e) => { e.target.style.borderColor = "#334155"; e.target.style.color = "#64748b"; }}>
            📥 IMPORT CSV
          </button>
          {jobs.length > 0 && (
            <button onClick={exportCSV} style={{ padding: "10px 24px", borderRadius: "6px", background: "transparent", border: "1px solid #334155", color: "#64748b", fontSize: "11px", cursor: "pointer", fontFamily: "inherit", letterSpacing: "1px", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.borderColor = "#22d3ee"; e.target.style.color = "#22d3ee"; }}
              onMouseLeave={(e) => { e.target.style.borderColor = "#334155"; e.target.style.color = "#64748b"; }}>
              📤 EXPORT CSV
            </button>
          )}
        </div>

        <div style={{ textAlign: "center", padding: "16px 24px", fontSize: "10px", color: "#334155" }}>
          Tip: To import from Excel, open your .xlsx in Excel and save as CSV (File &gt; Save As &gt; CSV)
        </div>

        <div style={{ textAlign: "center", padding: "8px", fontSize: "10px", color: "#1e293b" }}>GARRY.TRACKER // v3.1 — IMPORT + SOUND + LINKS</div>
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
