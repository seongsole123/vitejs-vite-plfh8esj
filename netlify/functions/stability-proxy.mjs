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
    const mode = request.headers.get("X-Stability-Mode") || "inpaint";
    const formData = await request.formData();

    // inpaint = building mask + change only masked area
    const endpoint = mode === "inpaint"
      ? "https://api.stability.ai/v2beta/stable-image/edit/inpaint"
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
