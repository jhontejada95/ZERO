export function aiConfiguration() {
  return {
    baseUrl: process.env.AI_BASE_URL || "https://api.deepseek.com",
    apiKey: process.env.AI_API_KEY || "",
    model: process.env.AI_MODEL || "deepseek-v4-flash",
  };
}

export async function generateAgentNarrative({ system, prompt, fallback }) {
  const config = aiConfiguration();
  if (!config.apiKey) return { text: fallback, provider: "DETERMINISTIC" };

  const response = await fetch(`${config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.1,
      max_tokens: 180,
      messages: [{ role: "system", content: system }, { role: "user", content: prompt }],
    }),
  });
  if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
  const payload = await response.json();
  return { text: payload.choices?.[0]?.message?.content || fallback, provider: config.model };
}
