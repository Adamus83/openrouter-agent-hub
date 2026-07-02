export default function Home() {
  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      fontFamily: "sans-serif",
      padding: "20px",
      textAlign: "center"
    }}>
      <h1>🚀 OpenRouter Agent Hub</h1>

      <p>Powered by OpenRouter</p>

      <button
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          borderRadius: "10px",
          border: "none",
          background: "#2563eb",
          color: "white",
          fontSize: "18px"
        }}
      >
        Start Chat
      </button>
    </main>
  );
}


