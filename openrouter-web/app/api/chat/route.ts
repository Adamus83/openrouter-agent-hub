export async function POST(req: Request) {
  try {
    const { apiKey, message, model } = await req.json();
console.log("apiKey =", apiKey);
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model || "deepseek/deepseek-chat",
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        {
          error: JSON.stringify(data),
        },
        { status: response.status }
      );
    }

    return Response.json({
      reply: data.choices?.[0]?.message?.content || "Tidak ada jawaban",
    });
  } catch (error: any) {
    return Response.json(
      {
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
