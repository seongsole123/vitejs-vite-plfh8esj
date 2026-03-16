export default async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Stability-Key, X-Stability-Mode, X-Claude-Key",
      },
    });
  }

  try {
    const mode = request.headers.get("X-Stability-Mode") || "inpaint";

    // Claude API proxy (for building mask detection)
    if (mode === "claude") {
      // Use env variable if available, fallback to header
      const claudeKey = process.env.ANTHROPIC_API_KEY || request.headers.get("X-Claude-Key");
      const body = await request.json();
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": claudeKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Stability AI proxy
    const stabilityKey = request.headers.get("X-Stability-Key");
    const formData = await request.formData();

    const endpoint = mode === "inpaint"
      ? "https://api.stability.ai/v2beta/stable-image/edit/inpaint"
      : "https://api.stability.ai/v2beta/stable-image/edit/search-and-replace";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${stabilityKey}`, Accept: "image/*" },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: err }), {
        status: response.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const imageBuffer = await response.arrayBuffer();
    return new Response(imageBuffer, {
      headers: { "Content-Type": "image/jpeg", "Access-Control-Allow-Origin": "*" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
};

export const config = { path: "/api/stability-proxy" };
