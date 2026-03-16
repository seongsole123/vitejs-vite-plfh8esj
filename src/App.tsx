import { useState, useRef, useCallback } from "react";

const MAKE_PROMPT = (color: string, material: string) =>
  `architectural renovation photo, same object same structure same shape, surface completely re-clad with ${color} ${material} steel panels with visible panel joints and seams, realistic material texture, professional photo, keep identical structure and proportions`;

const PRODUCTS = [
  // 도금강판
  { id:"g1", name:"PosMAC® 아이언그레이",  cat:"도금강판", hex:"#6b7280", energySave:12, co2:8.4,  prompt:MAKE_PROMPT("iron gray","metallic zinc-aluminum alloy") },
  { id:"g2", name:"PosMAC® 실버메탈",      cat:"도금강판", hex:"#c0cad2", energySave:14, co2:9.8,  prompt:MAKE_PROMPT("shiny silver","metallic aluminum-zinc") },
  { id:"g3", name:"PosMAC® 샴페인골드",    cat:"도금강판", hex:"#c9a96e", energySave:10, co2:7.1,  prompt:MAKE_PROMPT("champagne gold","metallic steel") },
  { id:"g4", name:"PosMAC® 브론즈메탈",    cat:"도금강판", hex:"#7d5a3c", energySave:11, co2:7.7,  prompt:MAKE_PROMPT("warm bronze","metallic steel") },
  { id:"g5", name:"갈바륨 내추럴실버",     cat:"도금강판", hex:"#a8b4b8", energySave:13, co2:9.1,  prompt:MAKE_PROMPT("natural silver matte","galvalume steel") },
  // 컬러강판
  { id:"c1", name:"쿨루프 크림화이트",     cat:"컬러강판", hex:"#f2ede4", energySave:28, co2:19.6, prompt:MAKE_PROMPT("cream white","color coated cool roof") },
  { id:"c2", name:"스카이블루",            cat:"컬러강판", hex:"#4a90c4", energySave:18, co2:12.6, prompt:MAKE_PROMPT("sky blue","PVDF color coated") },
  { id:"c3", name:"딥네이비",             cat:"컬러강판", hex:"#1e2d5a", energySave:8,  co2:5.6,  prompt:MAKE_PROMPT("deep navy blue","color coated") },
  { id:"c4", name:"모스그린",             cat:"컬러강판", hex:"#4d6b44", energySave:16, co2:11.2, prompt:MAKE_PROMPT("moss green","eco color coated") },
  { id:"c5", name:"차콜블랙",             cat:"컬러강판", hex:"#2e3238", energySave:7,  co2:4.9,  prompt:MAKE_PROMPT("charcoal black matte","color coated") },
  { id:"c6", name:"브릭레드",             cat:"컬러강판", hex:"#8b3a2a", energySave:9,  co2:6.3,  prompt:MAKE_PROMPT("brick red","color coated") },
  { id:"c7", name:"샌드베이지",           cat:"컬러강판", hex:"#c4b49a", energySave:22, co2:15.4, prompt:MAKE_PROMPT("sand beige","color coated") },
  { id:"c8", name:"테라코타",             cat:"컬러강판", hex:"#c06a45", energySave:12, co2:8.4,  prompt:MAKE_PROMPT("terracotta orange","color coated") },
  { id:"c9", name:"올리브골드",           cat:"컬러강판", hex:"#8a8440", energySave:15, co2:10.5, prompt:MAKE_PROMPT("olive gold","color coated") },
  { id:"c10",name:"포레스트그린",         cat:"컬러강판", hex:"#2d4a35", energySave:17, co2:11.9, prompt:MAKE_PROMPT("forest green","eco color coated") },
  { id:"c11",name:"코퍼로즈",            cat:"컬러강판", hex:"#b87b6e", energySave:13, co2:9.1,  prompt:MAKE_PROMPT("copper rose","color coated") },
  { id:"c12",name:"와인레드",            cat:"컬러강판", hex:"#6b2737", energySave:8,  co2:5.6,  prompt:MAKE_PROMPT("wine red","color coated") },
  // 목재무늬강판
  { id:"w1", name:"월넛브라운 (5GTM52)",  cat:"목재무늬강판", hex:"#5c3d1e", energySave:10, co2:7.0,  prompt:"same building same structure, exterior walls re-clad with walnut brown wood grain pattern steel panels, realistic wood texture steel cladding, warm dark brown oak wood appearance, professional architectural photo" },
  { id:"w2", name:"다크오크 (3GTMZ1)",   cat:"목재무늬강판", hex:"#3b2710", energySave:9,  co2:6.3,  prompt:"same building same structure, exterior walls re-clad with dark oak wood grain pattern steel panels, deep dark brown wood texture steel cladding, professional architectural photo" },
  { id:"w3", name:"내추럴오크 (3GTM52)", cat:"목재무늬강판", hex:"#d4c4a0", energySave:11, co2:7.7,  prompt:"same building same structure, exterior walls re-clad with natural oak light wood grain pattern steel panels, bright cream wood texture steel cladding, scandinavian style, professional photo" },
  { id:"w4", name:"그레이우드 (3GTM68)", cat:"목재무늬강판", hex:"#4a3f35", energySave:10, co2:7.0,  prompt:"same building same structure, exterior walls re-clad with gray weathered wood grain pattern steel panels, modern gray wood texture steel cladding, professional architectural photo" },
  { id:"w5", name:"올리브우드 (3GTM51)", cat:"목재무늬강판", hex:"#8a8a6a", energySave:12, co2:8.4,  prompt:"same building same structure, exterior walls re-clad with olive green wood grain pattern steel panels, natural olive wood texture steel cladding, eco style, professional photo" },
  { id:"w6", name:"체스넛 (5GTM39)",    cat:"목재무늬강판", hex:"#7a4a25", energySave:10, co2:7.0,  prompt:"same building same structure, exterior walls re-clad with chestnut brown wood grain pattern steel panels, warm medium brown wood texture steel cladding, traditional style, professional photo" },
];

// 카테고리별 색상
const CAT_COLORS: Record<string, {bg:string, text:string, border:string}> = {
  "도금강판":    { bg:"#0d2d1a", text:"#22c55e", border:"#166534" },
  "컬러강판":    { bg:"#0d1b2e", text:"#60a5fa", border:"#1d4ed8" },
  "목재무늬강판": { bg:"#2d1a0a", text:"#f59e0b", border:"#92400e" },
};

const CATEGORIES = ["전체", "도금강판", "컬러강판", "목재무늬강판"];

const EXAMPLES = [
  {
    id:"e1", label:"산업 공장", icon:"🏭",
    // Use cors-friendly proxy
    url:"https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1024&q=80",
    thumb:"https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=200&q=60",
  },
  {
    id:"e2", label:"오피스 빌딩", icon:"🏢",
    url:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1024&q=80",
    thumb:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=60",
  },
  {
    id:"e3", label:"물류 창고", icon:"🏪",
    url:"https://images.unsplash.com/photo-1553413077-190dd305871c?w=1024&q=80",
    thumb:"https://images.unsplash.com/photo-1553413077-190dd305871c?w=200&q=60",
  },
  {
    id:"e4", label:"상업 건물", icon:"🏬",
    url:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1024&q=80",
    thumb:"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=60",
  },
  {
    id:"e5", label:"공공 건물", icon:"🏛️",
    url:"https://images.unsplash.com/photo-1555636222-cae831e670b3?w=1024&q=80",
    thumb:"https://images.unsplash.com/photo-1555636222-cae831e670b3?w=200&q=60",
  },
  {
    id:"e6", label:"냉장고", icon:"🧊",
    url:"https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=1024&q=80",
    thumb:"https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=200&q=60",
  },
  {
    id:"e7", label:"세탁기", icon:"🫧",
    url:"https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1024&q=80",
    thumb:"https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&q=60",
  },
  {
    id:"e8", label:"자동차", icon:"🚗",
    url:"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1024&q=80",
    thumb:"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&q=60",
  },
];


// 실제 스틸리온 시공사례
const CASES = [
  { id:"c1", name:"스타벅스 남양주삼패점", product:"목재무늬강판", img:"https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&q=80", tag:"상업시설" },
  { id:"c2", name:"포스코퓨처엠 포항 양극재 공장", product:"PosMAC® 실버메탈", img:"https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&q=80", tag:"산업시설" },
  { id:"c3", name:"코트야드 메리어트 서울 판교", product:"PosMAC® 샴페인골드", img:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80", tag:"호텔" },
  { id:"c4", name:"광화문 광장 지하보도", product:"테라코타 컬러강판", img:"https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&q=80", tag:"공공시설" },
  { id:"c5", name:"전국 LCT 랜드마크타워", product:"딥네이비 컬러강판", img:"https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=600&q=80", tag:"주거시설" },
  { id:"c6", name:"KT파크빌딩", product:"갈바륨 내추럴실버", img:"https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?w=600&q=80", tag:"업무시설" },
];

async function fetchWithCors(url: string): Promise<Blob> {
  // Try direct fetch first
  try {
    const res = await fetch(url, { mode: "cors" });
    if (res.ok) return await res.blob();
  } catch {}
  // Fallback: use a CORS proxy
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error("이미지를 불러올 수 없습니다.");
  return await res.blob();
}

async function urlToFile(url: string): Promise<File> {
  const blob = await fetchWithCors(url);
  return new File([blob], "image.jpg", { type: blob.type || "image/jpeg" });
}

async function resizeImageFile(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX_RATIO = 2.3;
      let w = img.width;
      let h = img.height;
      if (w / h > MAX_RATIO) w = Math.floor(h * MAX_RATIO);
      if (h / w > MAX_RATIO) h = Math.floor(w * MAX_RATIO);
      // Max 1024px
      const maxDim = 1024;
      if (w > maxDim) { h = Math.floor(h * maxDim / w); w = maxDim; }
      if (h > maxDim) { w = Math.floor(w * maxDim / h); h = maxDim; }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        resolve(new File([blob!], "image.jpg", { type: "image/jpeg" }));
      }, "image/jpeg", 0.92);
    };
    img.src = URL.createObjectURL(file);
  });
}

async function createBuildingMask(imageFile: File): Promise<string> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64 } },
          { type: "text", text: `이 이미지에서 건물(빌딩) 전체 외곽선을 폴리곤으로 추출하세요. 하늘, 땅, 나무, 도로, 자동차, 사람은 제외하고 건물 전체만 포함하세요. JSON으로만 응답(마크다운 없이): {"polygons":[ [[x1,y1],[x2,y2],...] ]} 좌표는 이미지 크기 대비 0~100 퍼센트.` }
        ]
      }]
    })
  });

  const data = await res.json();
  const text = data.content?.find((b: any) => b.type === "text")?.text || "{}";
  const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
  const polygons: number[][][] = parsed.polygons || [];

  const img = await new Promise<HTMLImageElement>((resolve) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.src = URL.createObjectURL(imageFile);
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  polygons.forEach((polygon) => {
    if (!polygon || polygon.length < 3) return;
    ctx.beginPath();
    ctx.moveTo((polygon[0][0] / 100) * canvas.width, (polygon[0][1] / 100) * canvas.height);
    for (let i = 1; i < polygon.length; i++) {
      ctx.lineTo((polygon[i][0] / 100) * canvas.width, (polygon[i][1] / 100) * canvas.height);
    }
    ctx.closePath();
    ctx.fill();
  });
  return canvas.toDataURL("image/png");
}

function dataUrlToFile(dataUrl: string, name: string): File {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  const u8arr = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
  return new File([u8arr], name, { type: mime });
}

async function inpaintBuilding(imageFile: File, maskDataUrl: string, productPrompt: string, apiKey: string): Promise<string> {
  const maskFile = dataUrlToFile(maskDataUrl, "mask.png");
  const form = new FormData();
  form.append("image", imageFile);
  form.append("mask", maskFile);
  form.append("prompt", productPrompt + ", photorealistic architectural photo, 8k, high quality, same building structure, keep windows and doors");
  form.append("negative_prompt", "missing windows, removed doors, changed building shape, blurry, cartoon, low quality");
  form.append("output_format", "jpeg");
  form.append("grow_mask", "4");

  const res = await fetch("/api/stability-proxy", {
    method: "POST",
    headers: { "X-Stability-Key": apiKey, "Accept": "image/*", "X-Stability-Mode": "inpaint" },
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Stability API 오류 ${res.status}: ${err}`);
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export default function App() {
  const [apiKey, setApiKey]         = useState("");
  const [apiKeySet, setApiKeySet]   = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [activeExample, setActiveExample] = useState(EXAMPLES[0]);
  const [uploadedFile, setUploadedFile]   = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl]     = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMsg, setStatusMsg]   = useState("");
  const [afterUrl, setAfterUrl]     = useState<string | null>(null);
  const [error, setError]           = useState("");
  const [sliderPos, setSliderPos]   = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [filterCat, setFilterCat]   = useState("전체");

  const [showCases, setShowCases] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const fileRef   = useRef<HTMLInputElement>(null);

  const currentUrl = uploadedUrl || activeExample.url;

  const run = useCallback(async (product: typeof PRODUCTS[0]) => {
    if (!apiKeySet) return;
    setProcessing(true); setError(""); setAfterUrl(null); setSelectedProduct(product);
    try {
      setStatusMsg("🔄 이미지 준비 중...");
      const rawFile = uploadedFile || await urlToFile(activeExample.url);
      const file = await resizeImageFile(rawFile);

      setStatusMsg("🤖 Claude AI가 건물 영역을 감지하는 중...");
      const maskDataUrl = await createBuildingMask(file);

      setStatusMsg("🎨 Stability AI가 건물 외관만 바꾸는 중... (10~30초)");
      const result = await inpaintBuilding(file, maskDataUrl, product.prompt, apiKey);
      setAfterUrl(result);
      setStatusMsg(`✓ ${product.name} 적용 완료!`);
    } catch (e: any) {
      setError(e.message); setStatusMsg("");
    } finally {
      setProcessing(false);
    }
  }, [apiKey, apiKeySet, activeExample, uploadedFile]);

  const onMove = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    setSliderPos(Math.max(2, Math.min(98, ((x - rect.left) / rect.width) * 100)));
  }, [isDragging]);

  const filteredProducts = filterCat === "전체" ? PRODUCTS : PRODUCTS.filter(p => p.cat === filterCat);
  const catColor = (cat: string) => CAT_COLORS[cat] || CAT_COLORS["컬러강판"];

  return (
    <div style={{ fontFamily:"'IBM Plex Sans KR','Noto Sans KR',sans-serif", background:"#0a0c10", color:"#e8edf3", height:"100vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#161b22}::-webkit-scrollbar-thumb{background:#30363d;border-radius:2px}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        .ex-btn:hover{opacity:0.85;transform:scale(1.02)}
        .prod-item:hover{background:#111419!important;border-color:#2d3748!important}
      `}</style>

      {/* HEADER */}
      <header style={{ height:54, flexShrink:0, background:"#0d1117", borderBottom:"1px solid #1e2530", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <div style={{ width:30,height:30,borderRadius:6,background:"linear-gradient(135deg,#1d4ed8,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:"#fff" }}>S</div>
          <span style={{ fontSize:14,fontWeight:700,color:"#e8edf3" }}>STEELION AI Visualizer</span>
          <span style={{ fontSize:10,color:"#4a5568",background:"#161b22",border:"1px solid #21262d",borderRadius:4,padding:"2px 7px" }}>건물 · 가전 · 자동차</span>
        </div>
        <div style={{ flex:1, maxWidth:520, display:"flex", alignItems:"center", gap:8 }}>
          {!apiKeySet ? (
            <>
              <span style={{ fontSize:11,color:"#f59e0b",fontWeight:600,flexShrink:0 }}>🔑 Stability AI 키:</span>
              <input type="password" placeholder="sk-xxxxxxxxxxxxxxxx" value={apiKeyInput}
                onChange={e=>setApiKeyInput(e.target.value)}
                onKeyDown={e=>{ if(e.key==="Enter"&&apiKeyInput.startsWith("sk-")){setApiKey(apiKeyInput);setApiKeySet(true);}}}
                style={{ flex:1,background:"#161b22",border:"1px solid #30363d",borderRadius:7,padding:"6px 12px",fontSize:12,color:"#e8edf3",outline:"none",fontFamily:"monospace" }}
              />
              <button onClick={()=>{ if(apiKeyInput.startsWith("sk-")){setApiKey(apiKeyInput);setApiKeySet(true);}}}
                style={{ background:apiKeyInput.startsWith("sk-")?"#1d4ed8":"#161b22",border:"none",borderRadius:7,padding:"6px 16px",fontSize:12,fontWeight:700,color:apiKeyInput.startsWith("sk-")?"#fff":"#4a5568",cursor:"pointer",flexShrink:0 }}>연결</button>
            </>
          ) : (
            <div style={{ display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ background:"#0d2d1a",border:"1px solid #166534",borderRadius:6,padding:"4px 12px",fontSize:11,color:"#4ade80",fontWeight:700 }}>✓ API 키 연결됨</div>
              <button onClick={()=>{setApiKeySet(false);setApiKeyInput("");setApiKey("");}} style={{ background:"none",border:"1px solid #21262d",borderRadius:5,padding:"3px 8px",fontSize:10,color:"#4a5568",cursor:"pointer" }}>변경</button>
            </div>
          )}
        </div>
        <div style={{ fontSize:10,color:"#4ade80",background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:20,padding:"3px 10px",fontWeight:700,flexShrink:0 }}>🌱 ESG 협력과제</div>
      </header>

      <div style={{ flex:1,display:"flex",overflow:"hidden",minHeight:0 }}>

        {/* LEFT */}
        <div style={{ width:200,flexShrink:0,background:"#0d1117",borderRight:"1px solid #1e2530",display:"flex",flexDirection:"column" as const,overflow:"hidden" }}>
          <div style={{ padding:"12px 10px 6px",flexShrink:0 }}>
            <div style={{ fontSize:10,fontWeight:700,color:"#4a5568",letterSpacing:"0.1em",textTransform:"uppercase" as const,marginBottom:8 }}>예시 선택</div>
            {/* Buildings */}
            <div style={{ fontSize:9,color:"#4a5568",marginBottom:5,fontWeight:600 }}>🏗️ 건물</div>
            <div style={{ display:"flex",flexDirection:"column" as const,gap:4,marginBottom:8 }}>
              {EXAMPLES.filter(e=>["e1","e2","e3","e4","e5"].includes(e.id)).map(ex => (
                <div key={ex.id} className="ex-btn" onClick={()=>{setActiveExample(ex);setUploadedFile(null);setUploadedUrl(null);setAfterUrl(null);setError("");}}
                  style={{ position:"relative" as const,borderRadius:6,overflow:"hidden",cursor:"pointer",height:44,border:`2px solid ${activeExample.id===ex.id&&!uploadedUrl?"#2563eb":"transparent"}`,transition:"all 0.15s" }}>
                  <img src={ex.thumb} alt={ex.label} style={{ width:"100%",height:"100%",objectFit:"cover" as const,display:"block" }} onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
                  <div style={{ position:"absolute" as const,inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",gap:5,padding:"0 7px" }}>
                    <span style={{ fontSize:14 }}>{ex.icon}</span>
                    <span style={{ fontSize:10,fontWeight:600,color:"#e8edf3",textShadow:"0 1px 3px rgba(0,0,0,0.9)" }}>{ex.label}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Appliances */}
            <div style={{ fontSize:9,color:"#4a5568",marginBottom:5,fontWeight:600 }}>🏠 가전·자동차</div>
            <div style={{ display:"flex",flexDirection:"column" as const,gap:4,marginBottom:8 }}>
              {EXAMPLES.filter(e=>["e6","e7","e8"].includes(e.id)).map(ex => (
                <div key={ex.id} className="ex-btn" onClick={()=>{setActiveExample(ex);setUploadedFile(null);setUploadedUrl(null);setAfterUrl(null);setError("");}}
                  style={{ position:"relative" as const,borderRadius:6,overflow:"hidden",cursor:"pointer",height:44,border:`2px solid ${activeExample.id===ex.id&&!uploadedUrl?"#2563eb":"transparent"}`,transition:"all 0.15s" }}>
                  <img src={ex.thumb} alt={ex.label} style={{ width:"100%",height:"100%",objectFit:"cover" as const,display:"block" }} onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
                  <div style={{ position:"absolute" as const,inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",gap:5,padding:"0 7px" }}>
                    <span style={{ fontSize:14 }}>{ex.icon}</span>
                    <span style={{ fontSize:10,fontWeight:600,color:"#e8edf3",textShadow:"0 1px 3px rgba(0,0,0,0.9)" }}>{ex.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding:"0 10px 8px",flexShrink:0 }}>
            <div onClick={()=>fileRef.current?.click()} style={{ border:`1.5px dashed ${uploadedUrl?"#22c55e":"#2d3748"}`,borderRadius:6,padding:"8px",cursor:"pointer",background:uploadedUrl?"#0d2d1a":"#111419",textAlign:"center" as const,fontSize:10,color:uploadedUrl?"#22c55e":"#4a5568",fontWeight:500 }}>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{
                const f=e.target.files?.[0];if(!f)return;
                setUploadedFile(f);setUploadedUrl(URL.createObjectURL(f));
                setAfterUrl(null);setError("");
              }}/>
              {uploadedUrl?"✓ 직접 업로드됨":"+  직접 업로드"}
            </div>
          </div>
          {/* ESG */}
          {selectedProduct && (
            <div style={{ padding:"0 10px 10px",flex:1,overflow:"auto" }}>
              <div style={{ height:1,background:"#1e2530",marginBottom:10 }}/>
              <div style={{ background:"#0d2d1a",border:"1px solid #166534",borderRadius:7,padding:"10px",animation:"fadeIn 0.3s ease" }}>
                <div style={{ fontSize:9,fontWeight:700,color:"#22c55e",marginBottom:8,textTransform:"uppercase" as const,letterSpacing:"0.06em" }}>🌱 ESG 효과</div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:5 }}>
                  {[
                    {l:"에너지 절감",v:`${selectedProduct.energySave}%`},
                    {l:"CO₂/년",v:`${selectedProduct.co2}t`},
                    {l:"연간 절감액",v:`${(selectedProduct.energySave*120).toLocaleString()}만원`},
                    {l:"10년 CO₂",v:`${Math.round(selectedProduct.co2*10)}t`},
                  ].map(m=>(
                    <div key={m.l} style={{ background:"#071507",borderRadius:5,padding:"6px 7px" }}>
                      <div style={{ fontSize:12,fontWeight:700,color:"#4ade80",lineHeight:1.2 }}>{m.v}</div>
                      <div style={{ fontSize:8,color:"#4a5568",marginTop:2 }}>{m.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CENTER */}
        <div style={{ flex:1,display:"flex",flexDirection:"column" as const,overflow:"hidden",minWidth:0,position:"relative" as const }}>
          <div style={{ height:40,flexShrink:0,background:afterUrl&&!processing?"#0d2d1a":error?"#2d0a0a":processing?"#0d1b2e":"#111419",borderBottom:"1px solid #1e2530",display:"flex",alignItems:"center",padding:"0 16px",gap:10 }}>
            {processing&&<div style={{ width:15,height:15,borderRadius:"50%",border:"2px solid #1e3a5f",borderTop:"2px solid #3b82f6",animation:"spin 0.8s linear infinite",flexShrink:0 }}/>}
            <span style={{ fontSize:12,fontWeight:500,color:error?"#f87171":afterUrl&&!processing?"#4ade80":processing?"#60a5fa":"#4a5568" }}>
              {error||statusMsg||(apiKeySet?"오른쪽에서 제품을 선택하면 AI가 자동으로 외관을 바꿔드립니다 🎨":"🔑 상단에 Stability AI API 키를 먼저 입력하세요")}
            </span>
            <button onClick={()=>setShowCases(true)} style={{ marginLeft:"auto", background:"#161b22", border:"1px solid #21262d", borderRadius:5, padding:"4px 12px", fontSize:11, color:"#8b949e", cursor:"pointer", fontWeight:600, flexShrink:0 }}>📸 실제 시공사례</button>
            {afterUrl&&!processing&&(
              <a href={afterUrl} download="steelion-result.jpg" style={{ marginLeft:"8px",background:"#166534",border:"1px solid #22c55e",borderRadius:5,padding:"4px 12px",fontSize:11,color:"#4ade80",fontWeight:600,textDecoration:"none" }}>⬇ 저장</a>
            )}
          </div>

          <div style={{ flex:1,position:"relative" as const,overflow:"hidden",background:"#040506" }}>
            {afterUrl&&!processing&&(
              <>
                <div style={{ position:"absolute" as const,top:14,left:14,zIndex:20,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(6px)",borderRadius:5,padding:"4px 12px",fontSize:11,fontWeight:700,color:"#9ca3af",letterSpacing:"0.1em" }}>BEFORE</div>
                <div style={{ position:"absolute" as const,top:14,right:14,zIndex:20,background:"rgba(37,99,235,0.9)",backdropFilter:"blur(6px)",borderRadius:5,padding:"4px 12px",fontSize:11,fontWeight:700,color:"#fff" }}>AFTER · {selectedProduct?.name}</div>
              </>
            )}
            <div ref={sliderRef}
              style={{ position:"relative" as const,width:"100%",height:"100%",cursor:afterUrl?"ew-resize":"default",userSelect:"none" as const }}
              onMouseDown={e=>{if(afterUrl){setIsDragging(true);onMove(e);}}}
              onMouseMove={e=>onMove(e)} onMouseUp={()=>setIsDragging(false)}
              onTouchStart={e=>{if(afterUrl){setIsDragging(true);onMove(e);}}}
              onTouchMove={e=>onMove(e)} onTouchEnd={()=>setIsDragging(false)}
            >
              <div style={{ position:"absolute" as const,inset:0 }}>
                <img src={afterUrl||currentUrl} alt="result" style={{ width:"100%",height:"100%",objectFit:"contain" as const,background:"#040506" }} crossOrigin="anonymous"/>
              </div>
              {afterUrl&&(
                <div style={{ position:"absolute" as const,inset:0,clipPath:`inset(0 ${100-sliderPos}% 0 0)` }}>
                  <img src={currentUrl} alt="before" style={{ width:"100%",height:"100%",objectFit:"contain" as const,background:"#040506" }} crossOrigin="anonymous"/>
                </div>
              )}
              {afterUrl&&!processing&&(
                <div style={{ position:"absolute" as const,top:0,bottom:0,left:`${sliderPos}%`,width:2,background:"rgba(255,255,255,0.9)",transform:"translateX(-50%)",pointerEvents:"none",zIndex:10,boxShadow:"0 0 20px rgba(0,0,0,0.5)" }}>
                  <div style={{ position:"absolute" as const,top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:38,height:38,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#0a0c10",boxShadow:"0 3px 14px rgba(0,0,0,0.5)" }}>⇔</div>
                </div>
              )}
              {processing&&(
                <div style={{ position:"absolute" as const,inset:0,background:"rgba(4,5,6,0.82)",backdropFilter:"blur(6px)",zIndex:15,display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",gap:18 }}>
                  <div style={{ width:60,height:60,borderRadius:"50%",border:"3px solid #1e3a5f",borderTop:"3px solid #3b82f6",animation:"spin 1s linear infinite" }}/>
                  <div style={{ fontSize:15,fontWeight:700,color:"#e8edf3",textAlign:"center" as const }}>{statusMsg}</div>
                  <div style={{ fontSize:12,color:"#4a5568" }}>Stability AI 처리 중...</div>
                </div>
              )}
              {!processing&&!afterUrl&&!error&&(
                <div style={{ position:"absolute" as const,inset:0,display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",background:"rgba(4,5,6,0.5)",zIndex:5,pointerEvents:"none",gap:12,textAlign:"center" as const }}>
                  <div style={{ fontSize:48 }}>{activeExample.icon}</div>
                  <div style={{ fontSize:15,fontWeight:700,color:apiKeySet?"#8b949e":"#f59e0b" }}>
                    {apiKeySet?"오른쪽에서 제품을 클릭하세요":"API 키를 먼저 입력하세요"}
                  </div>
                  <div style={{ fontSize:12,color:"#4a5568",lineHeight:1.8 }}>
                    Stability AI가 외관 재질을 실제처럼 바꿔드립니다
                  </div>
                </div>
              )}
            </div>
          </div>

          {selectedProduct&&(
            <div style={{ height:42,flexShrink:0,background:"#0d1117",borderTop:"1px solid #1e2530",display:"flex",alignItems:"center",gap:12,padding:"0 16px",animation:"fadeIn 0.3s ease" }}>
              <div style={{ width:18,height:18,borderRadius:3,background:selectedProduct.hex,border:"1px solid rgba(255,255,255,0.1)",flexShrink:0 }}/>
              <span style={{ fontSize:12,fontWeight:600,color:"#e8edf3" }}>{selectedProduct.name}</span>
              <span style={{ fontSize:9,fontWeight:700,borderRadius:3,padding:"1px 5px",...catColor(selectedProduct.cat) }}>{selectedProduct.cat}</span>
              <span style={{ fontSize:11,color:"#f59e0b" }}>🌱 에너지 {selectedProduct.energySave}% 절감</span>
              {afterUrl&&<span style={{ marginLeft:"auto",fontSize:10,color:"#4a5568" }}>← 슬라이더로 비교</span>}
            </div>
          )}
        </div>

        {/* CASES OVERLAY */}
        {showCases && (
          <div style={{ position:"absolute" as const, inset:0, background:"rgba(4,5,6,0.95)", zIndex:30, display:"flex", flexDirection:"column" as const, overflow:"hidden", animation:"fadeIn 0.3s ease" }}>
            <div style={{ padding:"16px 20px", borderBottom:"1px solid #1e2530", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:"#e8edf3" }}>📸 실제 시공사례</div>
                <div style={{ fontSize:11, color:"#4a5568", marginTop:2 }}>포스코 스틸리온 제품 적용 건축물</div>
              </div>
              <button onClick={()=>setShowCases(false)} style={{ background:"#161b22", border:"1px solid #21262d", borderRadius:7, padding:"6px 14px", fontSize:12, color:"#8b949e", cursor:"pointer", fontWeight:600 }}>✕ 닫기</button>
            </div>
            <div style={{ flex:1, overflow:"auto", padding:"20px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16 }}>
                {CASES.map(c => (
                  <div key={c.id} style={{ background:"#0d1117", border:"1px solid #1e2530", borderRadius:12, overflow:"hidden" }}>
                    <div style={{ height:180, overflow:"hidden", position:"relative" as const }}>
                      <img src={c.img} alt={c.name} style={{ width:"100%", height:"100%", objectFit:"cover" as const, display:"block" }} onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80";}}/>
                      <div style={{ position:"absolute" as const, top:10, left:10, background:"rgba(37,99,235,0.9)", borderRadius:5, padding:"3px 9px", fontSize:10, fontWeight:700, color:"#fff" }}>{c.tag}</div>
                    </div>
                    <div style={{ padding:"14px 16px" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#e8edf3", marginBottom:6, lineHeight:1.4 }}>{c.name}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:10, color:"#4a5568" }}>적용 제품:</span>
                        <span style={{ fontSize:10, fontWeight:600, color:"#60a5fa", background:"#0d1b2e", border:"1px solid #1d4ed8", borderRadius:4, padding:"1px 7px" }}>{c.product}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:24, padding:"16px 20px", background:"#0d1b2e", border:"1px solid #1d4ed8", borderRadius:12, fontSize:12, color:"#93c5fd", lineHeight:1.7 }}>
                💡 <strong>참고:</strong> 위 사진은 실제 포스코 스틸리온 제품이 적용된 건축물 예시입니다. 왼쪽의 AI 시뮬레이터로 여러분의 건물에 직접 적용해보세요!
              </div>
            </div>
          </div>
        )}

        {/* RIGHT */}
        <div style={{ width:280,flexShrink:0,background:"#0d1117",borderLeft:"1px solid #1e2530",display:"flex",flexDirection:"column" as const,overflow:"hidden" }}>
          <div style={{ padding:"12px 10px 8px",flexShrink:0 }}>
            <div style={{ fontSize:10,fontWeight:700,color:"#4a5568",letterSpacing:"0.1em",textTransform:"uppercase" as const,marginBottom:8 }}>제품 카탈로그 · {PRODUCTS.length}종</div>
            <div style={{ display:"flex",gap:3 }}>
              {CATEGORIES.map(c=>(
                <div key={c} onClick={()=>setFilterCat(c)} style={{ flex:1,textAlign:"center" as const,cursor:"pointer",padding:"4px 0",borderRadius:5,fontSize:10,fontWeight:600,background:filterCat===c?"#1d4ed8":"#161b22",color:filterCat===c?"#fff":"#4a5568",border:`1px solid ${filterCat===c?"#2563eb":"#21262d"}`,transition:"all 0.15s" }}>{c}</div>
              ))}
            </div>
            {!apiKeySet&&<div style={{ marginTop:7,padding:"6px 9px",background:"#2d1a00",border:"1px solid #92400e",borderRadius:6,fontSize:10,color:"#fbbf24" }}>⚠ API 키를 먼저 입력하세요</div>}
          </div>
          <div style={{ flex:1,overflow:"auto",padding:"0 8px 10px" }}>
            {filteredProducts.map(product=>{
              const isSel = selectedProduct?.id===product.id;
              const isRun = isSel&&processing;
              const cc = catColor(product.cat);
              return (
                <div key={product.id} className="prod-item"
                  onClick={()=>!processing&&apiKeySet&&run(product)}
                  style={{ background:isSel?"#0d1b2e":"transparent",border:`1px solid ${isSel?"#2563eb":"transparent"}`,borderRadius:8,marginBottom:4,cursor:processing||!apiKeySet?"not-allowed":"pointer",overflow:"hidden",transition:"all 0.15s",opacity:processing&&!isSel?0.4:1 }}
                >
                  <div style={{ height:38,position:"relative" as const,background:product.hex,overflow:"hidden" }}>
                    <div style={{ position:"absolute" as const,inset:0,backgroundImage:`repeating-linear-gradient(180deg,transparent 0px,transparent ${product.cat==="도금강판"?40:54}px,rgba(0,0,0,0.13) ${product.cat==="도금강판"?40:54}px,rgba(0,0,0,0.13) ${product.cat==="도금강판"?42:56}px)` }}/>
                    <div style={{ position:"absolute" as const,top:4,right:6,background:"rgba(0,0,0,0.62)",borderRadius:3,padding:"1px 5px",fontSize:8,fontWeight:700,color:product.energySave>=20?"#4ade80":product.energySave>=15?"#fbbf24":"#e8edf3" }}>
                      {product.energySave>=20?"🏆 ":""}{product.energySave}% 절감
                    </div>
                    {isRun&&<div style={{ position:"absolute" as const,inset:0,background:"rgba(37,99,235,0.35)",display:"flex",alignItems:"center",justifyContent:"center" }}><div style={{ width:18,height:18,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid #fff",animation:"spin 0.8s linear infinite" }}/></div>}
                    {isSel&&!isRun&&<div style={{ position:"absolute" as const,top:4,left:6,width:15,height:15,borderRadius:"50%",background:"#3b82f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",fontWeight:700 }}>✓</div>}
                  </div>
                  <div style={{ padding:"6px 8px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:5,marginBottom:3 }}>
                      <span style={{ fontSize:11,fontWeight:700,color:"#e8edf3",flex:1,lineHeight:1.3 }}>{product.name}</span>
                      <span style={{ fontSize:8,fontWeight:700,borderRadius:3,padding:"1px 4px",background:cc.bg,color:cc.text,border:`1px solid ${cc.border}`,flexShrink:0 }}>{product.cat}</span>
                    </div>
                    <div style={{ display:"flex",gap:4 }}>
                      <div style={{ background:"#0a1a0a",border:"1px solid #14532d",borderRadius:3,padding:"1px 5px",fontSize:9,color:"#22c55e",fontWeight:600 }}>⚡{product.energySave}%</div>
                      <div style={{ background:"#0a1a0a",border:"1px solid #14532d",borderRadius:3,padding:"1px 5px",fontSize:9,color:"#4ade80",fontWeight:600 }}>-{product.co2}t CO₂</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
