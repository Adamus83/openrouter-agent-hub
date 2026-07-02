"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("openrouter_api_key");
    if (saved) setApiKey(saved);
  }, []);

  const saveKey = () => {
    localStorage.setItem("openrouter_api_key", apiKey);
    alert("API Key berhasil disimpan!");
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>⚙️ OpenRouter Settings</h1>

      <input
        type="password"
        placeholder="Masukkan OpenRouter API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 20
        }}
      />

      <button
        onClick={saveKey}
        style={{
          marginTop: 20,
          padding: "10px 20px"
        }}
      >
        Simpan API Key
      </button>
    </main>
  );
}
