import { useState, useRef, useCallback } from "react";

/* ─── PRODUCTS ─────────────────────────────────────────────────── */
const PRODUCTS = [
  { id:"g1", name:"PosMAC® 아이언그레이",  cat:"도금강판",    hex:"#6b7280", energySave:12, co2:8.4,  desc:"Mg-Al-Zn 3원계 합금 도금. 해안·산업지역 내식성 최강.", features:["내식성 최고","해안·공업지역","경량 고강도","15년 보증"] },
  { id:"g2", name:"PosMAC® 실버메탈",      cat:"도금강판",    hex:"#c0cad2", energySave:14, co2:9.8,  desc:"스테인리스 대체재. 중량 30% 절감, 고광택 유지.", features:["스테인리스 대체","중량 30% 절감","고광택","경제적"] },
  { id:"g3", name:"PosMAC® 샴페인골드",    cat:"도금강판",    hex:"#c9a96e", energySave:10, co2:7.1,  desc:"골드 톤 내식 강화. 고급 상업·호텔 시설에 적합.", features:["프리미엄 외관","고급 상업시설","내식성","품격"] },
  { id:"g4", name:"PosMAC® 브론즈메탈",    cat:"도금강판",    hex:"#7d5a3c", energySave:11, co2:7.7,  desc:"따뜻한 브론즈 톤. 역사지구·문화시설과 조화.", features:["클래식 감성","역사지구","문화시설","내구성"] },
  { id:"g5", name:"갈바륨 내추럴실버",     cat:"도금강판",    hex:"#a8b4b8", energySave:13, co2:9.1,  desc:"알루미늄-아연 합금. 장수명 외장재로 경제성 탁월.", features:["장수명","경제성","자연소재감","유지보수 최소"] },
  { id:"c1", name:"쿨루프 크림화이트",     cat:"컬러강판",    hex:"#f2ede4", energySave:28, co2:19.6, desc:"고반사율 쿨루프. 냉방비 최대 28% 절감.", features:["냉방비 28% 절감","쿨루프 인증","도시열섬 저감","ESG 핵심"] },
  { id:"c2", name:"스카이블루",            cat:"컬러강판",    hex:"#4a90c4", energySave:18, co2:12.6, desc:"PVDF 도료. 자외선 저항 최강, 도심 친화형.", features:["PVDF 도료","자외선 저항","도심 친화","색상 지속"] },
  { id:"c3", name:"딥네이비",              cat:"컬러강판",    hex:"#1e2d5a", energySave:8,  co2:5.6,  desc:"모던 오피스의 핵심 컬러. 강한 도시적 감성.", features:["모던 프리미엄","오피스 최적","주상복합","강한 인상"] },
  { id:"c4", name:"모스그린",              cat:"컬러강판",    hex:"#4d6b44", energySave:16, co2:11.2, desc:"저탄소 공정 인증. 친환경 이미지 구현.", features:["저탄소 공정","친환경","자연 조화","ESG 이미지"] },
  { id:"c5", name:"차콜블랙",              cat:"컬러강판",    hex:"#2e3238", energySave:7,  co2:4.9,  desc:"무광 차콜 마감. 산업·상업시설 강렬한 개성.", features:["무광 마감","강한 개성","산업시설","모던"] },
  { id:"c6", name:"브릭레드",              cat:"컬러강판",    hex:"#8b3a2a", energySave:9,  co2:6.3,  desc:"벽돌 감성의 따뜻한 레드. 지역 정체성 강조.", features:["전통미","지역 정체성","문화시설","활력"] },
  { id:"c7", name:"샌드베이지",            cat:"컬러강판",    hex:"#c4b49a", energySave:22, co2:15.4, desc:"자연스러운 베이지. 주거·교육시설 최다 선택.", features:["자연스러운 조화","주거 최적","교육시설","경관 친화"] },
  { id:"c8", name:"테라코타",              cat:"컬러강판",    hex:"#c06a45", energySave:12, co2:8.4,  desc:"지중해 감성. 상업·문화공간 주목도 상승.", features:["지중해 감성","주목도","상업공간","개성"] },
  { id:"c9", name:"올리브골드",            cat:"컬러강판",    hex:"#8a8440", energySave:15, co2:10.5, desc:"황금빛 올리브. 공공·문화건물 품격 연출.", features:["고급감","공공건물","품격","자연 감성"] },
  { id:"c10",name:"포레스트그린",          cat:"컬러강판",    hex:"#2d4a35", energySave:17, co2:11.9, desc:"그린뉴딜 상징색. 탄소중립 이미지 최적.", features:["ESG 상징","그린뉴딜","탄소중립","환경부"] },
  { id:"c11",name:"코퍼로즈",             cat:"컬러강판",    hex:"#b87b6e", energySave:13, co2:9.1,  desc:"트렌디한 코퍼 톤. 복합문화공간 트렌드.", features:["트렌드","복합문화","리테일","웜톤"] },
  { id:"c12",name:"와인레드",             cat:"컬러강판",    hex:"#6b2737", energySave:8,  co2:5.6,  desc:"강렬한 레드. 랜드마크 상징성 확보.", features:["랜드마크","상징성","주목도 1위","기억에 남는"] },
  { id:"w1", name:"월넛브라운 (5GTM52)", cat:"목재무늬강판", hex:"#5c3d1e", energySave:10, co2:7.0,  desc:"월넛 목재 질감. 자연 친화적 따뜻함.", features:["목재 질감","자연 친화","카페 인기","따뜻함"] },
  { id:"w2", name:"다크오크 (3GTMZ1)",  cat:"목재무늬강판", hex:"#3b2710", energySave:9,  co2:6.3,  desc:"짙은 오크. 고급스럽고 중후한 공간.", features:["고급 인테리어","중후함","호텔","프리미엄"] },
  { id:"w3", name:"내추럴오크 (3GTM52)",cat:"목재무늬강판", hex:"#d4c4a0", energySave:11, co2:7.7,  desc:"밝은 오크. 스칸디나비안 자연 공간 연출.", features:["스칸디나비안","밝고 경쾌","카페 트렌드","자연공간"] },
  { id:"w4", name:"그레이우드 (3GTM68)",cat:"목재무늬강판", hex:"#4a3f35", energySave:10, co2:7.0,  desc:"빈티지 그레이 우드. 모던 세련된 공간.", features:["빈티지","모던","갤러리","도시감성"] },
  { id:"w5", name:"올리브우드 (3GTM51)",cat:"목재무늬강판", hex:"#8a8a6a", energySave:12, co2:8.4,  desc:"올리브 톤 우드. 에코 자연 공간.", features:["에코","자연공간","힐링","공원 근처"] },
  { id:"w6", name:"체스넛 (5GTM39)",   cat:"목재무늬강판", hex:"#7a4a25", energySave:10, co2:7.0,  desc:"따뜻한 체스넛. 전통과 현대의 조화.", features:["전통 감성","따뜻한 색감","한옥 주변","문화재"] },
];

const CASES = [
  { name:"스타벅스 남양주삼패점",    product:"월넛브라운",      tag:"카페·상업", img:"https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400&q=80" },
  { name:"포스코퓨처엠 공장",       product:"PosMAC® 실버메탈", tag:"산업시설",  img:"https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&q=80" },
  { name:"코트야드 메리어트 판교",   product:"샴페인골드",       tag:"호텔",      img:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80" },
  { name:"광화문 광장 지하보도",     product:"테라코타",         tag:"공공시설",  img:"https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400&q=80" },
  { name:"LCT 랜드마크타워",        product:"딥네이비",         tag:"주거복합",  img:"https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&q=80" },
  { name:"KT파크빌딩",              product:"갈바륨 내추럴실버", tag:"업무시설",  img:"https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?w=400&q=80" },
];

/* ─── COLOR UTILS ──────────────────────────────────────────────── */
function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1,3),16),
    g: parseInt(hex.slice(3,5),16),
    b: parseInt(hex.slice(5,7),16),
  };
}
function rgbToHex(r:number,g:number,b:number) {
  return "#"+[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("");
}
function colorDistance(h1:string, h2:string) {
  const c1=hexToRgb(h1), c2=hexToRgb(h2);
  return Math.sqrt((c1.r-c2.r)**2+(c1.g-c2.g)**2+(c1.b-c2.b)**2);
}

function extractColors(img: HTMLImageElement, count=6): string[] {
  const canvas = document.createElement("canvas");
  const size = 80;
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0,0,size,size).data;

  // Sample pixels
  const pixels: [number,number,number][] = [];
  for (let i=0; i<data.length; i+=16) {
    const r=data[i], g=data[i+1], b=data[i+2], a=data[i+3];
    if (a < 128) continue;
    // Quantize to reduce similar colors
    pixels.push([Math.round(r/16)*16, Math.round(g/16)*16, Math.round(b/16)*16]);
  }

  // Count frequency
  const freq: Record<string,number> = {};
  pixels.forEach(([r,g,b])=>{
    const k=`${r},${g},${b}`;
    freq[k]=(freq[k]||0)+1;
  });

  // Sort by frequency, pick diverse colors
  const sorted = Object.entries(freq).sort((a,b)=>b[1]-a[1]);
  const picked: string[] = [];

  for (const [key] of sorted) {
    if (picked.length >= count) break;
    const [r,g,b] = key.split(",").map(Number);
    const hex = rgbToHex(r,g,b);
    // Skip if too similar to already picked
    if (picked.every(p => colorDistance(p, hex) > 40)) {
      picked.push(hex);
    }
  }
  return picked.slice(0, count);
}

function getLuminance(hex:string) {
  const {r,g,b}=hexToRgb(hex);
  return (r*299+g*587+b*114)/255000;
}

/* ═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [step, setStep]             = useState<"input"|"result">("input");
  const [purpose, setPurpose]       = useState("");
  const [uploadedUrl, setUploadedUrl]   = useState<string|null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor]     = useState<string|null>(null);
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0]|null>(null);
  const [filterCat, setFilterCat]   = useState("전체");
  const [isExtracting, setIsExtracting] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setUploadedUrl(url);
    setExtractedColors([]);
    setSelectedColor(null);
    setIsExtracting(true);
    const img = new Image();
    img.onload = () => {
      const colors = extractColors(img);
      setExtractedColors(colors);
      if (colors.length > 0) setSelectedColor(colors[0]);
      setIsExtracting(false);
    };
    img.src = url;
  };

  const handleStart = () => {
    if (!uploadedUrl || !purpose.trim()) return;
    setStep("result");
  };

  const filteredProducts = filterCat==="전체" ? PRODUCTS : PRODUCTS.filter(p=>p.cat===filterCat);

  // Find similar products to selected color
  const similarProducts = selectedColor
    ? [...PRODUCTS].sort((a,b) => colorDistance(selectedColor, a.hex) - colorDistance(selectedColor, b.hex)).slice(0,3)
    : [];

  const catBadge = (cat:string) => {
    if (cat==="도금강판")    return {bg:"#0d2d1a",text:"#22c55e",border:"#166534"};
    if (cat==="컬러강판")    return {bg:"#0d1b2e",text:"#60a5fa",border:"#1d4ed8"};
    return                          {bg:"#2d1a0a",text:"#f59e0b",border:"#92400e"};
  };

  /* ── STEP 1: INPUT ── */
  if (step === "input") {
    return (
      <div style={{fontFamily:"'IBM Plex Sans KR','Noto Sans KR',sans-serif",background:"#0a0c10",color:"#e8edf3",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 20px"}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

        <div style={{maxWidth:540,width:"100%",animation:"fadeIn 0.6s ease"}}>
          {/* Logo */}
          <div style={{textAlign:"center",marginBottom:40}}>
            <div style={{width:56,height:56,borderRadius:14,background:"linear-gradient(135deg,#1d4ed8,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:24,color:"#fff",margin:"0 auto 16px"}}>S</div>
            <div style={{fontSize:22,fontWeight:800,color:"#e8edf3",marginBottom:6}}>STEELION AI 색상 컨설턴트</div>
            <div style={{fontSize:13,color:"#4a5568",lineHeight:1.6}}>사진을 올리면 색상을 추출하고<br/>포스코 스틸리온 제품과 비교해드립니다</div>
          </div>

          {/* Purpose input */}
          <div style={{marginBottom:20}}>
            <label style={{fontSize:12,fontWeight:700,color:"#8b949e",display:"block",marginBottom:8,letterSpacing:"0.06em",textTransform:"uppercase" as const}}>용도 입력</label>
            <input
              value={purpose}
              onChange={e=>setPurpose(e.target.value)}
              placeholder="예) 학교 외벽 리모델링, 공장 외장 교체, 카페 인테리어, 냉장고..."
              style={{width:"100%",background:"#161b22",border:"1px solid #30363d",borderRadius:10,padding:"13px 16px",fontSize:13,color:"#e8edf3",outline:"none",fontFamily:"inherit",lineHeight:1.5}}
              onFocus={e=>e.target.style.borderColor="#2563eb"}
              onBlur={e=>e.target.style.borderColor="#30363d"}
            />
          </div>

          {/* Upload */}
          <div style={{marginBottom:28}}>
            <label style={{fontSize:12,fontWeight:700,color:"#8b949e",display:"block",marginBottom:8,letterSpacing:"0.06em",textTransform:"uppercase" as const}}>사진 업로드</label>
            <div onClick={()=>fileRef.current?.click()}
              style={{border:`2px dashed ${uploadedUrl?"#22c55e":"#2d3748"}`,borderRadius:12,cursor:"pointer",background:uploadedUrl?"#071507":"#111419",overflow:"hidden",minHeight:140,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)handleUpload(f);}}/>
              {uploadedUrl ? (
                <div style={{width:"100%",position:"relative" as const}}>
                  <img src={uploadedUrl} style={{width:"100%",maxHeight:220,objectFit:"cover" as const,display:"block"}} alt="uploaded"/>
                  <div style={{position:"absolute" as const,inset:0,background:"rgba(0,0,0,0)",display:"flex",alignItems:"flex-end",padding:"10px 14px"}}>
                    {isExtracting ? (
                      <div style={{fontSize:11,color:"#60a5fa",background:"rgba(13,27,46,0.9)",borderRadius:5,padding:"4px 10px"}}>🎨 색상 추출 중...</div>
                    ) : extractedColors.length > 0 ? (
                      <div style={{display:"flex",gap:4,alignItems:"center",background:"rgba(0,0,0,0.7)",borderRadius:8,padding:"6px 10px"}}>
                        <span style={{fontSize:10,color:"#8b949e",marginRight:4}}>추출된 색상</span>
                        {extractedColors.map(c=>(
                          <div key={c} style={{width:18,height:18,borderRadius:"50%",background:c,border:"2px solid rgba(255,255,255,0.3)"}}/>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div style={{position:"absolute" as const,top:8,right:8,background:"rgba(34,197,94,0.9)",borderRadius:5,padding:"3px 9px",fontSize:10,fontWeight:700,color:"#fff"}}>✓ 클릭해서 변경</div>
                </div>
              ) : (
                <div style={{textAlign:"center" as const,padding:"30px 20px"}}>
                  <div style={{fontSize:40,marginBottom:10}}>📷</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:4}}>사진을 업로드하세요</div>
                  <div style={{fontSize:11,color:"#4a5568"}}>건물, 제품, 공간 등 모든 사진 가능</div>
                </div>
              )}
            </div>
          </div>

          {/* Start button */}
          <button onClick={handleStart} disabled={!uploadedUrl||!purpose.trim()||isExtracting}
            style={{width:"100%",background:uploadedUrl&&purpose.trim()&&!isExtracting?"linear-gradient(135deg,#1d4ed8,#2563eb)":"#161b22",border:"none",borderRadius:10,padding:"14px",fontSize:14,fontWeight:700,color:uploadedUrl&&purpose.trim()&&!isExtracting?"#fff":"#4a5568",cursor:uploadedUrl&&purpose.trim()&&!isExtracting?"pointer":"not-allowed",transition:"all 0.2s",boxShadow:uploadedUrl&&purpose.trim()?"0 4px 20px rgba(37,99,235,0.3)":"none"}}>
            색상 비교 시작 →
          </button>

          <div style={{textAlign:"center" as const,marginTop:16,fontSize:11,color:"#2d3748"}}>포스코 스틸리온 · ESG 정부협력과제 데모</div>
        </div>
      </div>
    );
  }

  /* ── STEP 2: RESULT ── */
  return (
    <div style={{fontFamily:"'IBM Plex Sans KR','Noto Sans KR',sans-serif",background:"#0a0c10",color:"#e8edf3",height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#161b22}::-webkit-scrollbar-thumb{background:#30363d;border-radius:2px}@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* HEADER */}
      <header style={{height:52,flexShrink:0,background:"#0d1117",borderBottom:"1px solid #1e2530",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>{setStep("input");setSelectedProduct(null);}} style={{background:"#161b22",border:"1px solid #21262d",borderRadius:6,padding:"4px 12px",fontSize:11,color:"#8b949e",cursor:"pointer"}}>← 다시 분석</button>
          <div style={{fontSize:13,fontWeight:700,color:"#e8edf3"}}>STEELION AI 색상 컨설턴트</div>
          <div style={{fontSize:11,color:"#4a5568",background:"#111419",border:"1px solid #21262d",borderRadius:4,padding:"2px 8px"}}>{purpose}</div>
        </div>
        <div style={{fontSize:10,color:"#4ade80",background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:20,padding:"3px 10px",fontWeight:700}}>🌱 ESG 협력과제</div>
      </header>

      <div style={{flex:1,display:"flex",overflow:"hidden",minHeight:0}}>

        {/* LEFT — Photo + Extracted Colors */}
        <div style={{width:280,flexShrink:0,background:"#0d1117",borderRight:"1px solid #1e2530",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"14px 14px 0",flexShrink:0}}>
            <div style={{fontSize:10,fontWeight:700,color:"#4a5568",letterSpacing:"0.1em",textTransform:"uppercase" as const,marginBottom:10}}>📷 업로드 사진</div>
            <img src={uploadedUrl||""} style={{width:"100%",borderRadius:10,display:"block",maxHeight:200,objectFit:"cover" as const,marginBottom:14}} alt="uploaded"/>

            {/* Extracted Colors */}
            <div style={{fontSize:10,fontWeight:700,color:"#4a5568",letterSpacing:"0.1em",textTransform:"uppercase" as const,marginBottom:10}}>🎨 추출된 색상</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:14}}>
              {extractedColors.map(c=>(
                <div key={c} onClick={()=>setSelectedColor(c)}
                  style={{cursor:"pointer",borderRadius:8,overflow:"hidden",border:`2px solid ${selectedColor===c?"#3b82f6":"transparent"}`,transition:"all 0.15s"}}>
                  <div style={{height:44,background:c}}/>
                  <div style={{background:"#111419",padding:"4px 6px",textAlign:"center" as const}}>
                    <div style={{fontSize:9,color:"#6b7280",fontFamily:"monospace"}}>{c}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected color info */}
            {selectedColor && (
              <div style={{background:"#111419",border:"1px solid #1e2530",borderRadius:9,padding:"12px",marginBottom:14,animation:"fadeIn 0.3s ease"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#8b949e",marginBottom:8}}>선택된 색상</div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:48,height:48,borderRadius:8,background:selectedColor,flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:13,fontFamily:"monospace",color:"#e8edf3",fontWeight:700,marginBottom:4}}>{selectedColor}</div>
                    <div style={{fontSize:11,color:getLuminance(selectedColor)>0.5?"#1a1a1a":"#e8edf3",background:selectedColor,borderRadius:4,padding:"2px 8px",display:"inline-block"}}>
                      {getLuminance(selectedColor)>0.6?"밝은 계열":getLuminance(selectedColor)<0.3?"어두운 계열":"중간 계열"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Similar products suggestion */}
          {selectedColor && similarProducts.length > 0 && (
            <div style={{padding:"0 14px 14px",flex:1,overflow:"auto"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#f59e0b",letterSpacing:"0.1em",textTransform:"uppercase" as const,marginBottom:8}}>✨ 유사 색상 제품</div>
              {similarProducts.map(p=>(
                <div key={p.id} onClick={()=>setSelectedProduct(p)}
                  style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:selectedProduct?.id===p.id?"#0d1b2e":"#111419",border:`1px solid ${selectedProduct?.id===p.id?"#2563eb":"#1e2530"}`,borderRadius:8,marginBottom:5,cursor:"pointer",transition:"all 0.15s"}}>
                  <div style={{width:32,height:32,borderRadius:6,background:p.hex,flexShrink:0,border:"1px solid rgba(255,255,255,0.1)"}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,fontWeight:600,color:"#e8edf3",lineHeight:1.3,marginBottom:2}}>{p.name}</div>
                    <div style={{fontSize:9,color:"#4a5568"}}>유사도 {Math.round(100-colorDistance(selectedColor,p.hex)/4.4)}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CENTER — Color Comparison */}
        <div style={{flex:1,display:"flex",flexDirection:"column" as const,overflow:"hidden",minWidth:0}}>
          {selectedProduct && selectedColor ? (
            <div style={{flex:1,overflow:"auto",padding:"24px",animation:"fadeIn 0.4s ease"}}>

              {/* BIG color comparison */}
              <div style={{marginBottom:24}}>
                <div style={{fontSize:13,fontWeight:700,color:"#e8edf3",marginBottom:14}}>🎨 색상 비교</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:16,alignItems:"center",marginBottom:20}}>
                  {/* Current color */}
                  <div style={{background:"#111419",border:"1px solid #1e2530",borderRadius:12,overflow:"hidden"}}>
                    <div style={{height:120,background:selectedColor}}/>
                    <div style={{padding:"12px 14px"}}>
                      <div style={{fontSize:11,color:"#4a5568",marginBottom:4}}>현재 색상</div>
                      <div style={{fontSize:13,fontFamily:"monospace",color:"#e8edf3",fontWeight:700,marginBottom:6}}>{selectedColor}</div>
                      <div style={{fontSize:11,color:"#6b7280"}}>{purpose}</div>
                    </div>
                  </div>

                  <div style={{fontSize:24,color:"#2d3748"}}>→</div>

                  {/* Product color */}
                  <div style={{background:"#0d1b2e",border:"2px solid #2563eb",borderRadius:12,overflow:"hidden"}}>
                    <div style={{height:120,background:selectedProduct.hex,position:"relative" as const}}>
                      <div style={{position:"absolute" as const,inset:0,backgroundImage:"repeating-linear-gradient(180deg,transparent 0px,transparent 38px,rgba(0,0,0,0.12) 38px,rgba(0,0,0,0.12) 40px)"}}/>
                    </div>
                    <div style={{padding:"12px 14px"}}>
                      <div style={{fontSize:11,color:"#60a5fa",marginBottom:4}}>스틸리온 제품</div>
                      <div style={{fontSize:13,fontWeight:700,color:"#e8edf3",marginBottom:4}}>{selectedProduct.name}</div>
                      <div style={{fontSize:11,fontFamily:"monospace",color:"#4a5568"}}>{selectedProduct.hex}</div>
                    </div>
                  </div>
                </div>

                {/* Color similarity bar */}
                <div style={{background:"#111419",border:"1px solid #1e2530",borderRadius:10,padding:"14px 16px",marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#6b7280",marginBottom:8}}>
                    <span>색상 유사도</span>
                    <span style={{color:"#e8edf3",fontWeight:700}}>{Math.round(100-colorDistance(selectedColor,selectedProduct.hex)/4.4)}%</span>
                  </div>
                  <div style={{height:8,background:"#21262d",borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.round(100-colorDistance(selectedColor,selectedProduct.hex)/4.4)}%`,background:"linear-gradient(90deg,#1d4ed8,#3b82f6)",borderRadius:4,transition:"width 0.6s ease"}}/>
                  </div>
                </div>
              </div>

              {/* Product details */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
                <div style={{background:"#111419",border:"1px solid #1e2530",borderRadius:10,padding:"14px 16px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#8b949e",marginBottom:10,textTransform:"uppercase" as const,letterSpacing:"0.06em"}}>제품 특징</div>
                  <div style={{fontSize:12,color:"#6b7280",lineHeight:1.6,marginBottom:10}}>{selectedProduct.desc}</div>
                  <div style={{display:"flex",flexWrap:"wrap" as const,gap:5}}>
                    {selectedProduct.features.map(f=>(
                      <span key={f} style={{fontSize:10,background:"#161b22",border:"1px solid #21262d",borderRadius:4,padding:"2px 7px",color:"#8b949e"}}>✓ {f}</span>
                    ))}
                  </div>
                </div>
                <div style={{background:"#0d2d1a",border:"1px solid #166534",borderRadius:10,padding:"14px 16px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#22c55e",marginBottom:10,textTransform:"uppercase" as const,letterSpacing:"0.06em"}}>🌱 ESG 효과</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    {[
                      {l:"에너지 절감",v:`${selectedProduct.energySave}%`,c:"#4ade80"},
                      {l:"CO₂/년",v:`${selectedProduct.co2}t`,c:"#4ade80"},
                      {l:"연간 절감액",v:`${(selectedProduct.energySave*120).toLocaleString()}만원`,c:"#fbbf24"},
                      {l:"10년 CO₂",v:`${Math.round(selectedProduct.co2*10)}t`,c:"#4ade80"},
                    ].map(m=>(
                      <div key={m.l} style={{background:"#071507",borderRadius:6,padding:"8px"}}>
                        <div style={{fontSize:14,fontWeight:700,color:m.c}}>{m.v}</div>
                        <div style={{fontSize:9,color:"#4a5568",marginTop:2}}>{m.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cases */}
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#e8edf3",marginBottom:12}}>📸 실제 시공사례</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
                  {CASES.map((c,i)=>(
                    <div key={i} style={{background:"#0d1117",border:"1px solid #1e2530",borderRadius:10,overflow:"hidden"}}>
                      <div style={{height:120,overflow:"hidden",position:"relative" as const}}>
                        <img src={c.img} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover" as const}} onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80";}}/>
                        <div style={{position:"absolute" as const,top:7,left:7,background:"rgba(37,99,235,0.9)",borderRadius:4,padding:"2px 7px",fontSize:9,fontWeight:700,color:"#fff"}}>{c.tag}</div>
                      </div>
                      <div style={{padding:"10px 12px"}}>
                        <div style={{fontSize:11,fontWeight:700,color:"#e8edf3",marginBottom:4,lineHeight:1.3}}>{c.name}</div>
                        <div style={{fontSize:10,color:"#60a5fa",background:"#0d1b2e",borderRadius:3,padding:"1px 6px",display:"inline-block"}}>{c.product}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{flex:1,display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",gap:14,textAlign:"center" as const,padding:"40px",color:"#2d3748"}}>
              <div style={{fontSize:48}}>👈</div>
              <div style={{fontSize:14,fontWeight:600,color:"#4a5568"}}>왼쪽에서 색상을 선택하고</div>
              <div style={{fontSize:13,color:"#2d3748"}}>오른쪽 카탈로그에서 제품을 클릭하세요</div>
            </div>
          )}
        </div>

        {/* RIGHT — Product Catalog */}
        <div style={{width:268,flexShrink:0,background:"#0d1117",borderLeft:"1px solid #1e2530",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"12px 10px 8px",flexShrink:0}}>
            <div style={{fontSize:10,fontWeight:700,color:"#4a5568",letterSpacing:"0.1em",textTransform:"uppercase" as const,marginBottom:8}}>제품 카탈로그 · {PRODUCTS.length}종</div>
            <div style={{display:"flex",gap:3}}>
              {["전체","도금강판","컬러강판","목재무늬"].map(c=>(
                <div key={c} onClick={()=>setFilterCat(c==="목재무늬"?"목재무늬강판":c)}
                  style={{flex:1,textAlign:"center" as const,cursor:"pointer",padding:"4px 0",borderRadius:5,fontSize:9,fontWeight:600,background:(filterCat===c||(c==="목재무늬"&&filterCat==="목재무늬강판"))?"#1d4ed8":"#161b22",color:(filterCat===c||(c==="목재무늬"&&filterCat==="목재무늬강판"))?"#fff":"#4a5568",border:`1px solid ${(filterCat===c||(c==="목재무늬"&&filterCat==="목재무늬강판"))?"#2563eb":"#21262d"}`,transition:"all 0.15s"}}>{c}</div>
              ))}
            </div>
          </div>
          <div style={{flex:1,overflow:"auto",padding:"0 8px 10px"}}>
            {filteredProducts.map(product=>{
              const isSel=selectedProduct?.id===product.id;
              const similarity = selectedColor ? Math.round(100-colorDistance(selectedColor,product.hex)/4.4) : null;
              const badge = catBadge(product.cat);
              return (
                <div key={product.id}
                  onClick={()=>setSelectedProduct(product)}
                  style={{background:isSel?"#0d1b2e":"transparent",border:`1px solid ${isSel?"#2563eb":"transparent"}`,borderRadius:8,marginBottom:4,cursor:"pointer",overflow:"hidden",transition:"all 0.15s"}}
                >
                  <div style={{height:36,position:"relative" as const,background:product.hex,overflow:"hidden"}}>
                    <div style={{position:"absolute" as const,inset:0,backgroundImage:"repeating-linear-gradient(180deg,transparent 0px,transparent 30px,rgba(0,0,0,0.12) 30px,rgba(0,0,0,0.12) 32px)"}}/>
                    {similarity !== null && (
                      <div style={{position:"absolute" as const,top:4,right:6,background:"rgba(0,0,0,0.65)",borderRadius:3,padding:"1px 5px",fontSize:8,fontWeight:700,color:similarity>=70?"#4ade80":similarity>=50?"#fbbf24":"#e8edf3"}}>{similarity}% 유사</div>
                    )}
                    {isSel && <div style={{position:"absolute" as const,top:4,left:6,width:14,height:14,borderRadius:"50%",background:"#3b82f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",fontWeight:700}}>✓</div>}
                  </div>
                  <div style={{padding:"5px 8px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2}}>
                      <span style={{fontSize:10,fontWeight:600,color:"#e8edf3",flex:1,lineHeight:1.3}}>{product.name}</span>
                      <span style={{fontSize:8,fontWeight:700,borderRadius:3,padding:"1px 4px",background:badge.bg,color:badge.text,border:`1px solid ${badge.border}`,flexShrink:0}}>{product.cat.replace("강판","")}</span>
                    </div>
                    <div style={{display:"flex",gap:3}}>
                      <div style={{background:"#0a1a0a",border:"1px solid #14532d",borderRadius:3,padding:"1px 4px",fontSize:8,color:"#22c55e",fontWeight:600}}>⚡{product.energySave}%</div>
                      <div style={{background:"#0a1a0a",border:"1px solid #14532d",borderRadius:3,padding:"1px 4px",fontSize:8,color:"#4ade80",fontWeight:600}}>-{product.co2}t</div>
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
