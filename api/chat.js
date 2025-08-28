export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    // CORS preflight (adjust origins as needed)
    res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userMessage } = req.body || {};
    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ error: "userMessage (string) is required" });
    }

    const AIPIPE_TOKEN = process.env.AIPIPE_TOKEN;
    if (!AIPIPE_TOKEN) {
      return res.status(500).json({ error: "Server misconfigured: missing AIPIPE_TOKEN" });
    }

    const upstream = await fetch("https://aipipe.org/openrouter/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AIPIPE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4.1-nano",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      return res.status(upstream.status).json({ error: "Upstream error", details: errText });
    }

    const data = await upstream.json();
    const text =
      data?.choices?.[0]?.message?.content?.trim() ||
      data?.choices?.[0]?.delta?.content?.trim() ||
      "";

    // Optional: restrict CORS to your site in production by setting CORS_ORIGIN env var
    res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ text });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
}
