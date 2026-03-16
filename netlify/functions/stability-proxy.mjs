export default async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Stability-Key",
      },
    });
  }

  try {
    const stabilityKey = request.headers.get("X-Stability-Key");
    const formData = await request.formData();

    // Structure Control: 건물 엣지/윤곽선을 추출해서 유지 → 재질만 교체
    // control_strength 0.92 = 원본 구조 92% 유지
    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/control/structure",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stabilityKey}`,
          Accept: "image/*",
        },
        body: formData,
      }
    );

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
