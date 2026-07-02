"use client";

import { useState, useEffect, useRef } from "react";

const MODELS = [
  { id: "deepseek/deepseek-chat", label: "DeepSeek Chat (cepat & murah)" },
  { id: "openai/gpt-4o-mini", label: "GPT-4o mini" },
  { id: "openai/gpt-4o", label: "GPT-4o" },
  { id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { id: "google/gemini-1.5-flash", label: "Gemini 1.5 Flash" },
];

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(MODELS[0].id);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]); // [{role: 'user'|'assistant', content: ''}]
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // load dari localStorage saat pertama
  useEffect(() => {
    const savedKey = localStorage.getItem("openrouter_api_key") || "";
    const savedModel = localStorage.getItem("openrouter_model") || MODELS[0].id;
    setApiKey(savedKey);
    setModel(savedModel);
  }, []);

  // auto-scroll ke bawah
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  function saveKey(k) {
    setApiKey(k);
    localStorage.setItem("openrouter_api_key", k);
  }

  function changeModel(m) {
    setModel(m);
    localStorage.setItem("openrouter_model", m);
  }

  async function sendMessage() {
    if (!message.trim() || loading) return;

    const key = apiKey.trim();
    if (!key) {
      alert("Isi API Key OpenRouter dulu di atas.");
      return;
    }

    const userMsg = { role: "user", content: message };
    const newHistory = [...history, userMsg];
    setHistory(newHistory);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: key,
          message: userMsg.content,
          model,
          history: newHistory, // kirim history juga, biar backend bisa pakai context
        }),
      });

      const data = await res.json();
      const replyText = data.error? `Error: ${data.error}` : data.reply || "Tidak ada balasan.";

      setHistory([...newHistory, { role: "assistant", content: replyText }]);
    } catch (e) {
      setHistory([...newHistory, { role: "assistant", content: "Terjadi kesalahan jaringan." }]);
    }

    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" &&!e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "system-ui" }}>
      <h1>🚀 OpenRouter Agent Hub</h1>

      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        <input
          type="password"
          placeholder="Tempel OpenRouter API Key"
          value={apiKey}
          onChange={(e) => saveKey(e.target.value)}
          style={{ padding: 10, width: "100%" }}
        />

        <select
          value={model}
          onChange={(e) => changeModel(e.target.value)}
          style={{ padding: 10 }}
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>
      </div>

      <div style={{
        marginTop: 24,
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 16,
        height: "55vh",
        overflowY: "auto",
        background: "#fafafa"
      }}>
        {history.length === 0 && (
          <p style={{ color: "#666" }}>Mulai chat di bawah...</p>
        )}
        {history.map((h, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: h.role === "user"? "#2563eb" : "#16a34a", fontWeight: 600 }}>
              {h.role === "user"? "Kamu" : "AI"}
            </div>
            <div style={{ whiteSpace: "pre-wrap", marginTop: 4 }}>{h.content}</div>
          </div>
        ))}
        {loading && <div style={{ color: "#888" }}>AI sedang mengetik...</div>}
        <div ref={bottomRef} />
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <textarea
          rows={3}
          placeholder="Tulis pertanyaan... (Enter untuk kirim, Shift+Enter untuk baris baru)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, padding: 12, borderRadius: 8 }}
        />
        <button
          onClick={sendMessage}
          disabled={loading ||!message.trim()}
          style={{
            padding: "0 20px",
            borderRadius: 8,
            background: loading ||!message.trim()? "#ccc" : "#111",
            color: "white",
            cursor: loading ||!message.trim()? "not-allowed" : "pointer"
          }}
        >
          {loading? "..." : "Kirim"}
        </button>
      </div>
    </main>
  );
}
