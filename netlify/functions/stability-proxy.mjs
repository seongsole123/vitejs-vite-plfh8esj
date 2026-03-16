export default async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Stability-Key, X-Stability-Mode",
      },
    });
  }

  try {
    const stabilityKey = request.headers.get("X-Stability-Key");
    const mode = request.headers.get("X-Stability-Mode") || "search-replace";
    const formData = await request.formData();

    const endpoint = mode === "structure"
      ? "https://api.stability.ai/v2beta/stable-image/control/structure"
      : "https://api.stability.ai/v2beta/stable-image/edit/search-and-replace";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stabilityKey}`,
        Accept: "image/*",
      },
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
