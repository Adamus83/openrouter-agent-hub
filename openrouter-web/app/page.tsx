"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const apiKey = localStorage.getItem("openrouter_api_key");

    if (!apiKey) {
      alert("Silakan isi API Key di halaman Settings.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          message,
          model: "deepseek/deepseek-chat",
        }),
      });

      const data = await res.json();

      if (data.error) {
        setReply(data.error);
      } else {
        setReply(data.reply);
      }
    } catch (e) {
      setReply("Terjadi kesalahan.");
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>🚀 OpenRouter Agent Hub</h1>

      <textarea
        rows={6}
        style={{ width: "100%", marginTop: 20 }}
        placeholder="Tulis pertanyaan..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={sendMessage}
        style={{ marginTop: 20 }}
      >
        {loading ? "Mengirim..." : "Kirim"}
      </button>

      <pre
        style={{
          marginTop: 30,
          whiteSpace: "pre-wrap",
        }}
      >
        {reply}
      </pre>
    </main>
  );
}
