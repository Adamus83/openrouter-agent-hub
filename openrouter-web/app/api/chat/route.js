export async function POST(req) {
  const { apiKey, message, model, history } = await req.json();

  if (!apiKey) return Response.json({ error: "API key kosong" }, { status: 400 });

  const messages = Array.isArray(history) && history.length > 0
   ? history
    : [{ role: "user", content: message }];

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "OpenRouter Agent Hub"
    },
    body: JSON.stringify({
      model: model || "deepseek/deepseek-chat",
      messages
    })
  });

  const data = await res.json();
  if (!res.ok) {
    return Response.json({ error: data.error?.message || "Gagal" }, { status: 500 });
  }

  const reply = data.choices?.[0]?.message?.content || "";
  return Response.json({ reply });
}
