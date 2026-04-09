import { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";

export default function FeedbackTab() {
  const [state, handleSubmit] = useForm("mojpzplk");
  const [type, setType] = useState("bug");

  const TYPES = [
    { value: "bug",     label: "🐛 Bug Report" },
    { value: "feature", label: "💡 Feature Request" },
    { value: "question",label: "❓ Question" },
    { value: "other",   label: "💬 Other" },
  ];

  const inputStyle = {
    background: "var(--surface2)",
    border: "1px solid var(--border2)",
    borderRadius: "6px",
    color: "var(--text)",
    padding: "10px 12px",
    fontFamily: "inherit",
    fontSize: "13px",
    width: "100%",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ maxWidth: "560px" }}>
      <div className="panel">
        <div className="panel-title">FEEDBACK</div>
        <p style={{ color: "var(--textMuted)", fontSize: "13px", margin: "0 0 16px" }}>
          Found a bug? Have an idea? Let me know — all feedback is welcome.
        </p>

        {state.succeeded ? (
          <div style={{
            background: "var(--surface2)",
            border: "1px solid var(--accent)",
            borderRadius: "8px",
            padding: "24px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>✅</div>
            <div style={{ color: "var(--accent)", fontWeight: 700, marginBottom: "4px" }}>Sent!</div>
            <div style={{ color: "var(--textMuted)", fontSize: "13px" }}>Thanks for the feedback.</div>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "16px",
                background: "transparent",
                border: "1px solid var(--border2)",
                color: "var(--textMuted)",
                padding: "6px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "12px",
              }}
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Hidden field to include feedback type */}
            <input type="hidden" name="type" value={type} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <div style={{ color: "var(--textMuted)", fontSize: "11px", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Name (optional)</div>
                <input name="name" style={inputStyle} placeholder="Your name" />
              </div>
              <div>
                <div style={{ color: "var(--textMuted)", fontSize: "11px", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Email (optional)</div>
                <input name="email" type="email" style={inputStyle} placeholder="your@email.com" />
                <ValidationError field="email" errors={state.errors} style={{ color: "#ef4444", fontSize: "11px" }} />
              </div>
            </div>

            <div>
              <div style={{ color: "var(--textMuted)", fontSize: "11px", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Type</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {TYPES.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    style={{
                      background: type === t.value ? "var(--accent)" : "var(--surface2)",
                      border: `1px solid ${type === t.value ? "var(--accent)" : "var(--border2)"}`,
                      color: type === t.value ? "#fff" : "var(--textMuted)",
                      borderRadius: "6px",
                      padding: "6px 14px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      fontSize: "12px",
                      transition: "all 0.15s",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ color: "var(--textMuted)", fontSize: "11px", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Message *</div>
              <textarea
                name="message"
                required
                style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
                placeholder="Describe the bug, feature, or question..."
              />
              <ValidationError field="message" errors={state.errors} style={{ color: "#ef4444", fontSize: "11px" }} />
            </div>

            <button
              type="submit"
              disabled={state.submitting}
              style={{
                background: "var(--accent)",
                border: "none",
                color: "#fff",
                borderRadius: "6px",
                padding: "11px",
                cursor: state.submitting ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                transition: "all 0.15s",
                opacity: state.submitting ? 0.6 : 1,
              }}
            >
              {state.submitting ? "SENDING..." : "SEND FEEDBACK"}
            </button>
          </form>
        )}
      </div>

      <div className="panel" style={{ marginTop: "12px" }}>
        <div className="panel-title">OTHER WAYS TO REACH ME</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--textMuted)" }}>
          <div>🐙 GitHub Issues — <a href="https://github.com/shawramaland/jobtracking/issues/new" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>Open an issue</a></div>
          <div>⭐ If this helped you — <a href="https://github.com/shawramaland/jobtracking" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>Star the repo</a></div>
        </div>
      </div>
    </div>
  );
}
