import { useState, useRef, useCallback } from "react";

const MAKE_PROMPT = (color: string, material: string) =>
  `architectural renovation photo of same building, same windows same doors same layout same roofline, exterior walls completely re-clad with ${color} ${material} steel panels with visible panel joints and seams, realistic steel cladding texture, professional architectural photography, before and after renovation style, keep identical building structure`;

const PRODUCTS = [
  { id:"g1", name:"PosMAC® 아이언그레이",  cat:"도금강판", hex:"#6b7280", energySave:12, co2:8.4,  prompt:MAKE_PROMPT("iron gray","metallic zinc-aluminum alloy") },
  { id:"g2", name:"PosMAC® 실버메탈",      cat:"도금강판", hex:"#c0cad2", energySave:14, co2:9.8,  prompt:MAKE_PROMPT("shiny silver","metallic aluminum-zinc") },
  { id:"g3", name:"PosMAC® 샴페인골드",    cat:"도금강판", hex:"#c9a96e", energySave:10, co2:7.1,  prompt:MAKE_PROMPT("champagne gold","metallic steel") },
  { id:"g4", name:"PosMAC® 브론즈메탈",    cat:"도금강판", hex:"#7d5a3c", energySave:11, co2:7.7,  prompt:MAKE_PROMPT("warm bronze","metallic steel") },
  { id:"g5", name:"갈바륨 내추럴실버",     cat:"도금강판", hex:"#a8b4b8", energySave:13, co2:9.1,  prompt:MAKE_PROMPT("natural silver matte","galvalume steel") },
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
];

const EXAMPLES = [
  { id:"e1", label:"산업 공장",   url:"https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1024&q=80", thumb:"https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=200&q=60" },
  { id:"e2", label:"오피스 빌딩", url:"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1024&q=80", thumb:"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200&q=60" },
  { id:"e3", label:"물류 창고",   url:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1024&q=80", thumb:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&q=60" },
  { id:"e4", label:"상업 건물",   url:"https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1024&q=80", thumb:"https://images.unsplash.com/photo-1577495508048-b635879837f1?w=200&q=60" },
  { id:"e5", label:"공공 건물",   url:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=1024&q=80", thumb:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=60" },
];

async function urlToFile(url: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], "building.jpg", { type: blob.type || "image/jpeg" });
}

async function searchAndReplace(imageFile: File, productPrompt: string, apiKey: string): Promise<string> {
  const form = new FormData();
  form.append("image", imageFile);
  form.append("prompt", productPrompt + ", photorealistic, 8k, high quality architectural photo");
  form.append("search_prompt", "building exterior wall facade cladding surface bricks paint");
  form.append("negative_prompt", "missing windows, no windows, removed doors, changed roofline, different building, blurry, cartoon, low quality, distorted");
  form.append("output_format", "jpeg");

  const res = await fetch("/api/stability-proxy", {
    method: "POST",
    headers: { "X-Stability-Key": apiKey, "Accept": "image/*" },
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
  const [apiKey, setApiKey] = useState("");
  const [apiKeySet, setApiKeySet] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [activeBuilding, setActiveBuilding] = useState(EXAMPLES[0]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [afterUrl, setAfterUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [filterCat, setFilterCat] = useState("전체");

  const sliderRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentUrl = uploadedUrl || activeBuilding.url;

  const run = useCallback(async (product: typeof PRODUCTS[0]) => {
    if (!apiKeySet) return;
    setProcessing(true);
    setError("");
    setAfterUrl(null);
    setSelectedProduct(product);
    try {
      setStatusMsg("🔄 이미지 준비 중...");
      const file = uploadedFile || await urlToFile(activeBuilding.url);
      setStatusMsg("🎨 Stability AI가 외벽을 새로 그리는 중... (10~30초)");
      const result = await searchAndReplace(file, product.prompt, apiKey);
      setAfterUrl(result);
      setStatusMsg(`✓ ${product.name} 적용 완료!`);
    } catch (e: any) {
      setError(e.message);
      setStatusMsg("");
    } finally {
      setProcessing(false);
    }
  }, [apiKey, apiKeySet, activeBuilding, uploadedFile]);

  const onMove = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    setSliderPos(Math.max(2, Math.min(98, ((x - rect.left) / rect.width) * 100)));
  }, [isDragging]);

  const filteredProducts = filterCat === "전체" ? PRODUCTS : PRODUCTS.filter(p => p.cat === filterCat);

  return (
    <div style={{ fontFamily:"'IBM Plex Sans KR','Noto Sans KR',sans-serif", background:"#0a0c10", color:"#e8edf3", height:"100vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#161b22}::-webkit-scrollbar-thumb{background:#30363d;border-radius:2px}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* HEADER */}
      <header style={{ height:54, flexShrink:0, background:"#0d1117", borderBottom:"1px solid #1e2530", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <div style={{ width:30, height:30, borderRadius:6, background:"linear-gradient(135deg,#1d4ed8,#3b82f6)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, color:"#fff" }}>S</div>
          <span style={{ fontSize:14, fontWeight:700, color:"#e8edf3" }}>STEELION AI Exterior Visualizer</span>
        </div>
        <div style={{ flex:1, maxWidth:520, display:"flex", alignItems:"center", gap:8 }}>
          {!apiKeySet ? (
            <>
              <span style={{ fontSize:11, color:"#f59e0b", fontWeight:600, flexShrink:0 }}>🔑 Stability AI 키:</span>
              <input
                type="password"
                placeholder="sk-xxxxxxxxxxxxxxxx"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && apiKeyInput.startsWith("sk-")) { setApiKey(apiKeyInput); setApiKeySet(true); }}}
                style={{ flex:1, background:"#161b22", border:"1px solid #30363d", borderRadius:7, padding:"6px 12px", fontSize:12, color:"#e8edf3", outline:"none", fontFamily:"monospace" }}
              />
              <button
                onClick={() => { if (apiKeyInput.startsWith("sk-")) { setApiKey(apiKeyInput); setApiKeySet(true); }}}
                style={{ background:apiKeyInput.startsWith("sk-")?"#1d4ed8":"#161b22", border:"none", borderRadius:7, padding:"6px 16px", fontSize:12, fontWeight:700, color:apiKeyInput.startsWith("sk-")?"#fff":"#4a5568", cursor:"pointer", flexShrink:0 }}
              >연결</button>
            </>
          ) : (
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ background:"#0d2d1a", border:"1px solid #166534", borderRadius:6, padding:"4px 12px", fontSize:11, color:"#4ade80", fontWeight:700 }}>✓ API 키 연결됨</div>
              <button onClick={() => { setApiKeySet(false); setApiKeyInput(""); setApiKey(""); }} style={{ background:"none", border:"1px solid #21262d", borderRadius:5, padding:"3px 8px", fontSize:10, color:"#4a5568", cursor:"pointer" }}>변경</button>
            </div>
          )}
        </div>
        <div style={{ fontSize:10, color:"#4ade80", background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:20, padding:"3px 10px", fontWeight:700, flexShrink:0 }}>🌱 ESG 협력과제</div>
      </header>

      {/* BODY */}
      <div style={{ flex:1, display:"flex", overflow:"hidden", minHeight:0 }}>

        {/* LEFT */}
        <div style={{ width:234, flexShrink:0, background:"#0d1117", borderRight:"1px solid #1e2530", display:"flex", flexDirection:"column", overflow:"hidden" }}>
          <div style={{ padding:"14px 12px 10px", flexShrink:0 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#4a5568", letterSpacing:"0.1em", textTransform:"uppercase" as const, marginBottom:9 }}>예시 건물 선택</div>
            <div style={{ display:"flex", flexDirection:"column" as const, gap:5 }}>
              {EXAMPLES.map(ex => (
                <div key={ex.id} onClick={() => { setActiveBuilding(ex); setUploadedFile(null); setUploadedUrl(null); setAfterUrl(null); setError(""); }}
                  style={{ position:"relative" as const, borderRadius:7, overflow:"hidden", cursor:"pointer", height:52, border:`2px solid ${activeBuilding.id===ex.id&&!uploadedUrl?"#2563eb":"transparent"}`, transition:"all 0.15s" }}>
                  <img src={ex.thumb} alt={ex.label} style={{ width:"100%", height:"100%", objectFit:"cover" as const, display:"block" }} />
                  <div style={{ position:"absolute" as const, inset:0, background:"rgba(0,0,0,0.42)", display:"flex", alignItems:"flex-end", padding:"5px 8px" }}>
                    <span style={{ fontSize:11, fontWeight:600, color:"#e8edf3", textShadow:"0 1px 4px rgba(0,0,0,0.9)" }}>{ex.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding:"0 12px 10px", flexShrink:0 }}>
            <div onClick={() => fileRef.current?.click()} style={{ border:`1.5px dashed ${uploadedUrl?"#22c55e":"#2d3748"}`, borderRadius:7, padding:"9px", cursor:"pointer", background:uploadedUrl?"#0d2d1a":"#111419", textAlign:"center" as const, fontSize:11, color:uploadedUrl?"#22c55e":"#4a5568", fontWeight:500 }}>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => {
                const f = e.target.files?.[0]; if (!f) return;
                setUploadedFile(f);
                setUploadedUrl(URL.createObjectURL(f));
                setAfterUrl(null); setError("");
              }} />
              {uploadedUrl ? "✓ 내 건물 사진 (클릭해서 변경)" : "+ 내 건물 사진 업로드"}
            </div>
          </div>
          <div style={{ height:1, background:"#1e2530", margin:"0 12px", flexShrink:0 }} />
          <div style={{ padding:"12px 12px 0", flexShrink:0 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#4a5568", letterSpacing:"0.1em", textTransform:"uppercase" as const, marginBottom:10 }}>작동 방식</div>
            {[
              { n:1, label:"API 키 입력", done:apiKeySet, color:"#f59e0b" },
              { n:2, label:"건물 선택 또는 업로드", done:!!(uploadedUrl||activeBuilding), color:"#3b82f6" },
              { n:3, label:"제품 클릭 → AI 자동 적용", done:!!afterUrl, color:"#22c55e" },
            ].map(s => (
              <div key={s.n} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:9 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:s.done?s.color:`${s.color}22`, border:`2px solid ${s.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:s.done?"#fff":s.color, flexShrink:0 }}>{s.done?"✓":s.n}</div>
                <span style={{ fontSize:11, color:s.done?"#e8edf3":"#4a5568", fontWeight:s.done?600:400 }}>{s.label}</span>
              </div>
            ))}
          </div>
          {selectedProduct && (
            <div style={{ padding:"10px 12px", flex:1, overflow:"auto" }}>
              <div style={{ height:1, background:"#1e2530", marginBottom:10 }} />
              <div style={{ background:"#0d2d1a", border:"1px solid #166534", borderRadius:8, padding:"12px" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"#22c55e", marginBottom:9, textTransform:"uppercase" as const, letterSpacing:"0.06em" }}>🌱 ESG 절감 효과</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                  {[
                    { l:"에너지 절감", v:`${selectedProduct.energySave}%` },
                    { l:"CO₂/년 감축", v:`${selectedProduct.co2}t` },
                    { l:"연간 절감액", v:`${(selectedProduct.energySave*120).toLocaleString()}만원` },
                    { l:"10년 누적 CO₂", v:`${Math.round(selectedProduct.co2*10)}t` },
                  ].map(m => (
                    <div key={m.l} style={{ background:"#071507", borderRadius:6, padding:"8px" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:"#4ade80", lineHeight:1.2 }}>{m.v}</div>
                      <div style={{ fontSize:9, color:"#4a5568", marginTop:2 }}>{m.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CENTER */}
        <div style={{ flex:1, display:"flex", flexDirection:"column" as const, overflow:"hidden", minWidth:0 }}>
          <div style={{ height:40, flexShrink:0, background:afterUrl&&!processing?"#0d2d1a":error?"#2d0a0a":processing?"#0d1b2e":"#111419", borderBottom:"1px solid #1e2530", display:"flex", alignItems:"center", padding:"0 16px", gap:10 }}>
            {processing && <div style={{ width:16, height:16, borderRadius:"50%", border:"2px solid #1e3a5f", borderTop:"2px solid #3b82f6", animation:"spin 0.8s linear infinite", flexShrink:0 }} />}
            <span style={{ fontSize:12, fontWeight:500, color:error?"#f87171":afterUrl&&!processing?"#4ade80":processing?"#60a5fa":"#4a5568" }}>
              {error || statusMsg || (apiKeySet ? "오른쪽 제품을 클릭하면 AI가 외벽을 자동으로 바꿔드립니다 🎨" : "🔑 상단에 Stability AI API 키를 먼저 입력하세요")}
            </span>
            {afterUrl && !processing && (
              <a href={afterUrl} download="steelion-result.jpg" style={{ marginLeft:"auto", background:"#166534", border:"1px solid #22c55e", borderRadius:5, padding:"4px 12px", fontSize:11, color:"#4ade80", fontWeight:600, textDecoration:"none" }}>⬇ 결과 저장</a>
            )}
          </div>
          <div style={{ flex:1, position:"relative" as const, overflow:"hidden", background:"#040506" }}>
            {afterUrl && !processing && (
              <>
                <div style={{ position:"absolute" as const, top:14, left:14, zIndex:20, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(6px)", borderRadius:5, padding:"4px 12px", fontSize:11, fontWeight:700, color:"#9ca3af", letterSpacing:"0.1em" }}>BEFORE</div>
                <div style={{ position:"absolute" as const, top:14, right:14, zIndex:20, background:"rgba(37,99,235,0.9)", backdropFilter:"blur(6px)", borderRadius:5, padding:"4px 12px", fontSize:11, fontWeight:700, color:"#fff" }}>AFTER · {selectedProduct?.name}</div>
              </>
            )}
            <div ref={sliderRef}
              style={{ position:"relative" as const, width:"100%", height:"100%", cursor:afterUrl?"ew-resize":"default", userSelect:"none" as const }}
              onMouseDown={e => { if (afterUrl) { setIsDragging(true); onMove(e); }}}
              onMouseMove={e => onMove(e)}
              onMouseUp={() => setIsDragging(false)}
              onTouchStart={e => { if (afterUrl) { setIsDragging(true); onMove(e); }}}
              onTouchMove={e => onMove(e)}
              onTouchEnd={() => setIsDragging(false)}
            >
              <div style={{ position:"absolute" as const, inset:0 }}>
                <img src={afterUrl || currentUrl} alt="result" style={{ width:"100%", height:"100%", objectFit:"contain" as const, background:"#040506" }} crossOrigin="anonymous" />
              </div>
              {afterUrl && (
                <div style={{ position:"absolute" as const, inset:0, clipPath:`inset(0 ${100-sliderPos}% 0 0)` }}>
                  <img src={currentUrl} alt="before" style={{ width:"100%", height:"100%", objectFit:"contain" as const, background:"#040506" }} crossOrigin="anonymous" />
                </div>
              )}
              {afterUrl && !processing && (
                <div style={{ position:"absolute" as const, top:0, bottom:0, left:`${sliderPos}%`, width:2, background:"rgba(255,255,255,0.9)", transform:"translateX(-50%)", pointerEvents:"none", zIndex:10 }}>
                  <div style={{ position:"absolute" as const, top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:40, height:40, borderRadius:"50%", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#0a0c10", boxShadow:"0 3px 14px rgba(0,0,0,0.5)" }}>⇔</div>
                </div>
              )}
              {processing && (
                <div style={{ position:"absolute" as const, inset:0, background:"rgba(4,5,6,0.8)", backdropFilter:"blur(6px)", zIndex:15, display:"flex", flexDirection:"column" as const, alignItems:"center", justifyContent:"center", gap:18 }}>
                  <div style={{ width:64, height:64, borderRadius:"50%", border:"3px solid #1e3a5f", borderTop:"3px solid #3b82f6", animation:"spin 1s linear infinite" }} />
                  <div style={{ fontSize:16, fontWeight:700, color:"#e8edf3", textAlign:"center" as const }}>{statusMsg}</div>
                  <div style={{ fontSize:12, color:"#4a5568" }}>Stability AI 처리 중...</div>
                </div>
              )}
              {!processing && !afterUrl && !error && (
                <div style={{ position:"absolute" as const, inset:0, display:"flex", flexDirection:"column" as const, alignItems:"center", justifyContent:"center", background:"rgba(4,5,6,0.5)", zIndex:5, pointerEvents:"none", gap:14, textAlign:"center" as const }}>
                  <div style={{ fontSize:52 }}>🏗️</div>
                  <div style={{ fontSize:16, fontWeight:700, color:apiKeySet?"#8b949e":"#f59e0b" }}>{apiKeySet ? "오른쪽에서 제품을 클릭하세요" : "API 키를 입력해야 시작할 수 있어요"}</div>
                  <div style={{ fontSize:12, color:"#4a5568", lineHeight:1.8 }}>제품 클릭 → Stability AI가 외벽을 자동으로 감지하고<br />해당 제품의 컬러강판/도금강판으로 바꿔드립니다</div>
                </div>
              )}
            </div>
          </div>
          {selectedProduct && (
            <div style={{ height:42, flexShrink:0, background:"#0d1117", borderTop:"1px solid #1e2530", display:"flex", alignItems:"center", gap:12, padding:"0 16px" }}>
              <div style={{ width:18, height:18, borderRadius:3, background:selectedProduct.hex, border:"1px solid rgba(255,255,255,0.1)", flexShrink:0 }} />
              <span style={{ fontSize:12, fontWeight:600, color:"#e8edf3" }}>{selectedProduct.name}</span>
              <span style={{ fontSize:9, fontWeight:700, borderRadius:3, padding:"1px 5px", background:selectedProduct.cat==="도금강판"?"#0d2d1a":"#0d1b2e", color:selectedProduct.cat==="도금강판"?"#22c55e":"#60a5fa" }}>{selectedProduct.cat}</span>
              <span style={{ fontSize:11, color:"#f59e0b" }}>🌱 에너지 {selectedProduct.energySave}% 절감</span>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={{ width:274, flexShrink:0, background:"#0d1117", borderLeft:"1px solid #1e2530", display:"flex", flexDirection:"column" as const, overflow:"hidden" }}>
          <div style={{ padding:"12px 11px 8px", flexShrink:0 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#4a5568", letterSpacing:"0.1em", textTransform:"uppercase" as const, marginBottom:8 }}>제품 카탈로그 · {PRODUCTS.length}종</div>
            <div style={{ display:"flex", gap:4 }}>
              {["전체","도금강판","컬러강판"].map(c => (
                <div key={c} onClick={() => setFilterCat(c)} style={{ flex:1, textAlign:"center" as const, cursor:"pointer", padding:"5px 0", borderRadius:5, fontSize:11, fontWeight:600, background:filterCat===c?"#1d4ed8":"#161b22", color:filterCat===c?"#fff":"#4a5568", border:`1px solid ${filterCat===c?"#2563eb":"#21262d"}`, transition:"all 0.15s" }}>{c}</div>
              ))}
            </div>
          </div>
          <div style={{ flex:1, overflow:"auto", padding:"0 8px 10px" }}>
            {filteredProducts.map(product => {
              const isSel = selectedProduct?.id === product.id;
              const isRunning = isSel && processing;
              return (
                <div key={product.id}
                  onClick={() => !processing && apiKeySet && run(product)}
                  style={{ background:isSel?"#0d1b2e":"transparent", border:`1px solid ${isSel?"#2563eb":"transparent"}`, borderRadius:9, marginBottom:5, cursor:processing||!apiKeySet?"not-allowed":"pointer", overflow:"hidden", transition:"all 0.15s", opacity:processing&&!isSel?0.45:1 }}
                >
                  <div style={{ height:42, position:"relative" as const, background:product.hex, overflow:"hidden" }}>
                    <div style={{ position:"absolute" as const, inset:0, backgroundImage:`repeating-linear-gradient(180deg,transparent 0px,transparent ${product.cat==="도금강판"?42:56}px,rgba(0,0,0,0.14) ${product.cat==="도금강판"?42:56}px,rgba(0,0,0,0.14) ${product.cat==="도금강판"?44:58}px)` }} />
                    <div style={{ position:"absolute" as const, top:5, right:7, background:"rgba(0,0,0,0.6)", borderRadius:3, padding:"1px 5px", fontSize:8, fontWeight:700, color:product.energySave>=20?"#4ade80":product.energySave>=15?"#fbbf24":"#e8edf3" }}>
                      {product.energySave>=20?"🏆 ":""}{product.energySave}% 절감
                    </div>
                    {isRunning && (
                      <div style={{ position:"absolute" as const, inset:0, background:"rgba(37,99,235,0.35)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <div style={{ width:20, height:20, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid #fff", animation:"spin 0.8s linear infinite" }} />
                      </div>
                    )}
                  </div>
                  <div style={{ padding:"7px 9px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:2 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:"#e8edf3", flex:1, lineHeight:1.3 }}>{product.name}</span>
                      <span style={{ fontSize:8, fontWeight:700, borderRadius:3, padding:"1px 4px", background:product.cat==="도금강판"?"#0d2d1a":"#0d1b2e", color:product.cat==="도금강판"?"#22c55e":"#60a5fa" }}>{product.cat}</span>
                    </div>
                    <div style={{ display:"flex", gap:4, marginTop:3 }}>
                      <div style={{ background:"#0a1a0a", border:"1px solid #14532d", borderRadius:3, padding:"1px 5px", fontSize:9, color:"#22c55e", fontWeight:600 }}>⚡{product.energySave}%</div>
                      <div style={{ background:"#0a1a0a", border:"1px solid #14532d", borderRadius:3, padding:"1px 5px", fontSize:9, color:"#4ade80", fontWeight:600 }}>-{product.co2}t CO₂</div>
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
