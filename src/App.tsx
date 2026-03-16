import { useState, useRef, useCallback } from "react";

const PRODUCTS = [
  { id:"g1", name:"PosMAC® 아이언그레이",  cat:"도금강판", hex:"#6b7280", energySave:12, co2:8.4,  prompt:"building exterior walls clad with iron gray metallic steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"g2", name:"PosMAC® 실버메탈",      cat:"도금강판", hex:"#c0cad2", energySave:14, co2:9.8,  prompt:"building exterior walls clad with shiny silver metallic steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"g3", name:"PosMAC® 샴페인골드",    cat:"도금강판", hex:"#c9a96e", energySave:10, co2:7.1,  prompt:"building exterior walls clad with champagne gold metallic steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"g4", name:"PosMAC® 브론즈메탈",    cat:"도금강판", hex:"#7d5a3c", energySave:11, co2:7.7,  prompt:"building exterior walls clad with warm bronze metallic steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"g5", name:"갈바륨 내추럴실버",     cat:"도금강판", hex:"#a8b4b8", energySave:13, co2:9.1,  prompt:"building exterior walls clad with natural silver galvalume steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"c1", name:"쿨루프 크림화이트",     cat:"컬러강판", hex:"#f2ede4", energySave:28, co2:19.6, prompt:"building exterior walls clad with cream white color steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"c2", name:"스카이블루",            cat:"컬러강판", hex:"#4a90c4", energySave:18, co2:12.6, prompt:"building exterior walls clad with sky blue color steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"c3", name:"딥네이비",             cat:"컬러강판", hex:"#1e2d5a", energySave:8,  co2:5.6,  prompt:"building exterior walls clad with deep navy blue color steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"c4", name:"모스그린",             cat:"컬러강판", hex:"#4d6b44", energySave:16, co2:11.2, prompt:"building exterior walls clad with moss green color steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"c5", name:"차콜블랙",             cat:"컬러강판", hex:"#2e3238", energySave:7,  co2:4.9,  prompt:"building exterior walls clad with charcoal black matte steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"c6", name:"브릭레드",             cat:"컬러강판", hex:"#8b3a2a", energySave:9,  co2:6.3,  prompt:"building exterior walls clad with brick red color steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"c7", name:"샌드베이지",           cat:"컬러강판", hex:"#c4b49a", energySave:22, co2:15.4, prompt:"building exterior walls clad with sand beige color steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"c8", name:"테라코타",             cat:"컬러강판", hex:"#c06a45", energySave:12, co2:8.4,  prompt:"building exterior walls clad with terracotta orange color steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"c9", name:"올리브골드",           cat:"컬러강판", hex:"#8a8440", energySave:15, co2:10.5, prompt:"building exterior walls clad with olive gold color steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"c10",name:"포레스트그린",         cat:"컬러강판", hex:"#2d4a35", energySave:17, co2:11.9, prompt:"building exterior walls clad with forest green color steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"c11",name:"코퍼로즈",            cat:"컬러강판", hex:"#b87b6e", energySave:13, co2:9.1,  prompt:"building exterior walls clad with copper rose color steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"c12",name:"와인레드",            cat:"컬러강판", hex:"#6b2737", energySave:8,  co2:5.6,  prompt:"building exterior walls clad with wine red color steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"w1", name:"월넛브라운 (5GTM52)",  cat:"목재무늬강판", hex:"#5c3d1e", energySave:10, co2:7.0, prompt:"building exterior walls clad with walnut brown wood grain pattern steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"w2", name:"다크오크 (3GTMZ1)",   cat:"목재무늬강판", hex:"#3b2710", energySave:9,  co2:6.3, prompt:"building exterior walls clad with dark oak wood grain steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"w3", name:"내추럴오크 (3GTM52)", cat:"목재무늬강판", hex:"#d4c4a0", energySave:11, co2:7.7, prompt:"building exterior walls clad with natural light oak wood grain steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"w4", name:"그레이우드 (3GTM68)", cat:"목재무늬강판", hex:"#4a3f35", energySave:10, co2:7.0, prompt:"building exterior walls clad with gray weathered wood grain steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"w5", name:"올리브우드 (3GTM51)", cat:"목재무늬강판", hex:"#8a8a6a", energySave:12, co2:8.4, prompt:"building exterior walls clad with olive wood grain steel panels, same windows same doors same structure, realistic architectural photo" },
  { id:"w6", name:"체스넛 (5GTM39)",    cat:"목재무늬강판", hex:"#7a4a25", energySave:10, co2:7.0, prompt:"building exterior walls clad with chestnut brown wood grain steel panels, same windows same doors same structure, realistic architectural photo" },
];

const CASES = [
  { name:"스타벅스 남양주삼패점",       product:"목재무늬강판",       tag:"상업시설", img:"https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&q=80" },
  { name:"포스코퓨처엠 양극재 공장",     product:"PosMAC® 실버메탈",   tag:"산업시설", img:"https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&q=80" },
  { name:"코트야드 메리어트 판교",       product:"PosMAC® 샴페인골드", tag:"호텔",    img:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80" },
  { name:"광화문 광장 지하보도",         product:"테라코타 컬러강판",   tag:"공공시설", img:"https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&q=80" },
  { name:"전국 LCT 랜드마크타워",       product:"딥네이비 컬러강판",   tag:"주거시설", img:"https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=600&q=80" },
  { name:"KT파크빌딩",                 product:"갈바륨 내추럴실버",   tag:"업무시설", img:"https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?w=600&q=80" },
  { name:"호텔 나루 서울 엠갤러리",     product:"PosMAC® 아이언그레이", tag:"호텔",   img:"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80" },
  { name:"현대 LCT",                   product:"스카이블루 컬러강판", tag:"복합시설", img:"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80" },
];

const CAT_COLORS: Record<string,{bg:string,text:string,border:string}> = {
  "도금강판":    {bg:"#0d2d1a",text:"#22c55e",border:"#166534"},
  "컬러강판":    {bg:"#0d1b2e",text:"#60a5fa",border:"#1d4ed8"},
  "목재무늬강판":{bg:"#2d1a0a",text:"#f59e0b",border:"#92400e"},
};

async function resizeFile(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX=1024, MAX_RATIO=2.3;
      let w=img.width, h=img.height;
      if (w/h>MAX_RATIO) w=Math.floor(h*MAX_RATIO);
      if (h/w>MAX_RATIO) h=Math.floor(w*MAX_RATIO);
      if (w>MAX){h=Math.floor(h*MAX/w);w=MAX;}
      if (h>MAX){w=Math.floor(w*MAX/h);h=MAX;}
      const c=document.createElement("canvas");
      c.width=w; c.height=h;
      c.getContext("2d")!.drawImage(img,0,0,w,h);
      c.toBlob(b=>resolve(new File([b!],"img.jpg",{type:"image/jpeg"})),"image/jpeg",0.92);
    };
    img.src=URL.createObjectURL(file);
  });
}

async function applyProduct(imageFile: File, prompt: string, apiKey: string): Promise<string> {
  const form = new FormData();
  form.append("image", imageFile);
  form.append("prompt", prompt+", photorealistic, high quality, 8k");
  form.append("search_prompt", "building exterior wall facade cladding surface bricks");
  form.append("negative_prompt", "remove windows, remove doors, change building shape, blurry, cartoon, low quality");
  form.append("output_format", "jpeg");
  const res = await fetch("/api/stability-proxy", {
    method:"POST",
    headers:{"X-Stability-Key":apiKey,"Accept":"image/*"},
    body:form,
  });
  if (!res.ok) throw new Error(`오류 ${res.status}: ${await res.text()}`);
  return URL.createObjectURL(await res.blob());
}

export default function App() {
  const [apiKey,setApiKey]=useState("");
  const [apiKeySet,setApiKeySet]=useState(false);
  const [apiKeyInput,setApiKeyInput]=useState("");
  const [uploadedFile,setUploadedFile]=useState<File|null>(null);
  const [uploadedUrl,setUploadedUrl]=useState<string|null>(null);
  const [selectedProduct,setSelectedProduct]=useState<typeof PRODUCTS[0]|null>(null);
  const [processing,setProcessing]=useState(false);
  const [status,setStatus]=useState("");
  const [afterUrl,setAfterUrl]=useState<string|null>(null);
  const [error,setError]=useState("");
  const [sliderPos,setSliderPos]=useState(50);
  const [isDragging,setIsDragging]=useState(false);
  const [filterCat,setFilterCat]=useState("전체");
  const [showCases,setShowCases]=useState(false);
  const fileRef=useRef<HTMLInputElement>(null);
  const sliderRef=useRef<HTMLDivElement>(null);

  const run=useCallback(async(product:typeof PRODUCTS[0])=>{
    if(!apiKeySet||!uploadedFile)return;
    setProcessing(true);setError("");setAfterUrl(null);setSelectedProduct(product);
    try{
      setStatus("🔄 이미지 준비 중...");
      const file=await resizeFile(uploadedFile);
      setStatus("🎨 Stability AI가 외벽을 바꾸는 중... (10~30초)");
      const result=await applyProduct(file,product.prompt,apiKey);
      setAfterUrl(result);
      setStatus(`✓ ${product.name} 적용 완료!`);
    }catch(e:any){setError(e.message);setStatus("");}
    finally{setProcessing(false);}
  },[apiKey,apiKeySet,uploadedFile]);

  const onMove=useCallback((e:React.MouseEvent|React.TouchEvent)=>{
    if(!isDragging||!sliderRef.current)return;
    const rect=sliderRef.current.getBoundingClientRect();
    const x=(e as React.TouchEvent).touches?(e as React.TouchEvent).touches[0].clientX:(e as React.MouseEvent).clientX;
    setSliderPos(Math.max(2,Math.min(98,((x-rect.left)/rect.width)*100)));
  },[isDragging]);

  const filtered=filterCat==="전체"?PRODUCTS:PRODUCTS.filter(p=>p.cat===filterCat);
  const cc=(cat:string)=>CAT_COLORS[cat]||CAT_COLORS["컬러강판"];

  return(
    <div style={{fontFamily:"'IBM Plex Sans KR','Noto Sans KR',sans-serif",background:"#0a0c10",color:"#e8edf3",height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#161b22}::-webkit-scrollbar-thumb{background:#30363d;border-radius:2px}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .prod:hover{background:#111419!important;border-color:#2d3748!important}
      `}</style>

      {/* HEADER */}
      <header style={{height:54,flexShrink:0,background:"#0d1117",borderBottom:"1px solid #1e2530",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 20px",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <div style={{width:30,height:30,borderRadius:6,background:"linear-gradient(135deg,#1d4ed8,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:"#fff"}}>S</div>
          <span style={{fontSize:14,fontWeight:700,color:"#e8edf3"}}>STEELION AI</span>
          <span style={{fontSize:11,color:"#4a5568"}}>Exterior Visualizer</span>
        </div>
        <div style={{flex:1,maxWidth:500,display:"flex",alignItems:"center",gap:8}}>
          {!apiKeySet?(
            <>
              <span style={{fontSize:11,color:"#f59e0b",fontWeight:600,flexShrink:0}}>🔑 Stability AI 키:</span>
              <input type="password" placeholder="sk-xxxxxxxxxxxxxxxx" value={apiKeyInput}
                onChange={e=>setApiKeyInput(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&apiKeyInput.startsWith("sk-")){setApiKey(apiKeyInput);setApiKeySet(true);}}}
                style={{flex:1,background:"#161b22",border:"1px solid #30363d",borderRadius:7,padding:"6px 12px",fontSize:12,color:"#e8edf3",outline:"none",fontFamily:"monospace"}}
              />
              <button onClick={()=>{if(apiKeyInput.startsWith("sk-")){setApiKey(apiKeyInput);setApiKeySet(true);}}}
                style={{background:apiKeyInput.startsWith("sk-")?"#1d4ed8":"#161b22",border:"none",borderRadius:7,padding:"6px 16px",fontSize:12,fontWeight:700,color:apiKeyInput.startsWith("sk-")?"#fff":"#4a5568",cursor:"pointer",flexShrink:0}}>연결</button>
            </>
          ):(
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{background:"#0d2d1a",border:"1px solid #166534",borderRadius:6,padding:"4px 12px",fontSize:11,color:"#4ade80",fontWeight:700}}>✓ API 키 연결됨</div>
              <button onClick={()=>{setApiKeySet(false);setApiKeyInput("");setApiKey("");}} style={{background:"none",border:"1px solid #21262d",borderRadius:5,padding:"3px 8px",fontSize:10,color:"#4a5568",cursor:"pointer"}}>변경</button>
            </div>
          )}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setShowCases(true)} style={{background:"#161b22",border:"1px solid #21262d",borderRadius:6,padding:"5px 12px",fontSize:11,color:"#8b949e",cursor:"pointer",fontWeight:600}}>📸 실제 시공사례</button>
          <div style={{fontSize:10,color:"#4ade80",background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:20,padding:"3px 10px",fontWeight:700}}>🌱 ESG</div>
        </div>
      </header>

      <div style={{flex:1,display:"flex",overflow:"hidden",minHeight:0}}>

        {/* LEFT */}
        <div style={{width:220,flexShrink:0,background:"#0d1117",borderRight:"1px solid #1e2530",display:"flex",flexDirection:"column" as const,overflow:"hidden"}}>
          <div style={{padding:"16px 14px",flexShrink:0}}>
            <div style={{fontSize:10,fontWeight:700,color:"#4a5568",letterSpacing:"0.1em",textTransform:"uppercase" as const,marginBottom:10}}>건물 사진 업로드</div>
            <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${uploadedUrl?"#22c55e":"#2d3748"}`,borderRadius:10,padding:uploadedUrl?"8px":"20px 10px",cursor:"pointer",background:uploadedUrl?"#071507":"#111419",textAlign:"center" as const,transition:"all 0.2s",marginBottom:12}}>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                const f=e.target.files?.[0];if(!f)return;
                setUploadedFile(f);setUploadedUrl(URL.createObjectURL(f));
                setAfterUrl(null);setError("");setSelectedProduct(null);setStatus("");
              }}/>
              {uploadedUrl?(
                <div>
                  <img src={uploadedUrl} style={{width:"100%",borderRadius:6,marginBottom:6}} alt="uploaded"/>
                  <div style={{fontSize:10,color:"#22c55e",fontWeight:600}}>✓ 클릭해서 변경</div>
                </div>
              ):(
                <div>
                  <div style={{fontSize:36,marginBottom:8}}>🏗️</div>
                  <div style={{fontSize:12,fontWeight:600,color:"#6b7280"}}>사진 업로드</div>
                  <div style={{fontSize:10,color:"#4a5568",marginTop:4}}>클릭 또는 드래그&드롭</div>
                </div>
              )}
            </div>
            <div style={{background:"#0d1b2e",border:"1px solid #1d4ed8",borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#60a5fa",marginBottom:8}}>사용 방법</div>
              {[
                {n:1,t:"사진 업로드",done:!!uploadedUrl,c:"#f59e0b"},
                {n:2,t:"API 키 입력",done:apiKeySet,c:"#3b82f6"},
                {n:3,t:"제품 클릭 → 자동 적용",done:!!afterUrl,c:"#22c55e"},
              ].map(s=>(
                <div key={s.n} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:s.done?s.c:`${s.c}22`,border:`2px solid ${s.c}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:s.done?"#fff":s.c,flexShrink:0}}>{s.done?"✓":s.n}</div>
                  <span style={{fontSize:11,color:s.done?"#e8edf3":"#4a5568"}}>{s.t}</span>
                </div>
              ))}
            </div>
          </div>
          {selectedProduct&&(
            <div style={{padding:"0 14px 14px",flex:1,overflow:"auto"}}>
              <div style={{height:1,background:"#1e2530",marginBottom:12}}/>
              <div style={{background:"#0d2d1a",border:"1px solid #166534",borderRadius:8,padding:"12px",animation:"fadeIn 0.3s ease"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#22c55e",marginBottom:10,textTransform:"uppercase" as const,letterSpacing:"0.06em"}}>🌱 ESG 절감 효과</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {[
                    {l:"에너지 절감",v:`${selectedProduct.energySave}%`},
                    {l:"CO₂/년 감축",v:`${selectedProduct.co2}t`},
                    {l:"연간 절감액",v:`${(selectedProduct.energySave*120).toLocaleString()}만원`},
                    {l:"10년 CO₂",v:`${Math.round(selectedProduct.co2*10)}t`},
                  ].map(m=>(
                    <div key={m.l} style={{background:"#071507",borderRadius:6,padding:"8px"}}>
                      <div style={{fontSize:13,fontWeight:700,color:"#4ade80",lineHeight:1.2}}>{m.v}</div>
                      <div style={{fontSize:9,color:"#4a5568",marginTop:2}}>{m.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CENTER */}
        <div style={{flex:1,display:"flex",flexDirection:"column" as const,overflow:"hidden",minWidth:0,position:"relative" as const}}>

          {/* Cases overlay */}
          {showCases&&(
            <div style={{position:"absolute" as const,inset:0,background:"rgba(4,5,6,0.97)",zIndex:30,display:"flex",flexDirection:"column" as const,overflow:"hidden",animation:"fadeIn 0.3s ease"}}>
              <div style={{padding:"16px 20px",borderBottom:"1px solid #1e2530",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:"#e8edf3"}}>📸 실제 시공사례</div>
                  <div style={{fontSize:11,color:"#4a5568",marginTop:2}}>포스코 스틸리온 제품 적용 건축물</div>
                </div>
                <button onClick={()=>setShowCases(false)} style={{background:"#161b22",border:"1px solid #21262d",borderRadius:7,padding:"6px 16px",fontSize:12,color:"#8b949e",cursor:"pointer",fontWeight:600}}>✕ 닫기</button>
              </div>
              <div style={{flex:1,overflow:"auto",padding:"20px"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
                  {CASES.map((c,i)=>(
                    <div key={i} style={{background:"#0d1117",border:"1px solid #1e2530",borderRadius:12,overflow:"hidden"}}>
                      <div style={{height:170,overflow:"hidden",position:"relative" as const}}>
                        <img src={c.img} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover" as const}} onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80";}}/>
                        <div style={{position:"absolute" as const,top:10,left:10,background:"rgba(37,99,235,0.9)",borderRadius:5,padding:"3px 9px",fontSize:10,fontWeight:700,color:"#fff"}}>{c.tag}</div>
                      </div>
                      <div style={{padding:"12px 14px"}}>
                        <div style={{fontSize:13,fontWeight:700,color:"#e8edf3",marginBottom:6,lineHeight:1.4}}>{c.name}</div>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:10,color:"#4a5568"}}>적용 제품:</span>
                          <span style={{fontSize:10,fontWeight:600,color:"#60a5fa",background:"#0d1b2e",border:"1px solid #1d4ed8",borderRadius:4,padding:"1px 7px"}}>{c.product}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:20,padding:"14px 18px",background:"#0d1b2e",border:"1px solid #1d4ed8",borderRadius:10,fontSize:12,color:"#93c5fd",lineHeight:1.7}}>
                  💡 위 사진은 실제 포스코 스틸리온 제품이 적용된 건축물입니다. 왼쪽에서 사진을 업로드하고 오른쪽에서 제품을 선택해 시뮬레이션해보세요!
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div style={{height:40,flexShrink:0,background:afterUrl&&!processing?"#0d2d1a":error?"#2d0a0a":processing?"#0d1b2e":"#111419",borderBottom:"1px solid #1e2530",display:"flex",alignItems:"center",padding:"0 16px",gap:10}}>
            {processing&&<div style={{width:15,height:15,borderRadius:"50%",border:"2px solid #1e3a5f",borderTop:"2px solid #3b82f6",animation:"spin 0.8s linear infinite",flexShrink:0}}/>}
            <span style={{fontSize:12,fontWeight:500,color:error?"#f87171":afterUrl&&!processing?"#4ade80":processing?"#60a5fa":"#4a5568",flex:1}}>
              {error||status||(!uploadedUrl?"← 건물 사진을 업로드하세요":!apiKeySet?"🔑 상단에 API 키를 입력하세요":"오른쪽에서 제품을 클릭하면 AI가 외벽을 바꿔드립니다 🎨")}
            </span>
            {afterUrl&&!processing&&(
              <a href={afterUrl} download="steelion-result.jpg" style={{background:"#166534",border:"1px solid #22c55e",borderRadius:5,padding:"4px 12px",fontSize:11,color:"#4ade80",fontWeight:600,textDecoration:"none",flexShrink:0}}>⬇ 저장</a>
            )}
          </div>

          {/* Viewer */}
          <div style={{flex:1,position:"relative" as const,overflow:"hidden",background:"#040506"}}>
            {afterUrl&&!processing&&(
              <>
                <div style={{position:"absolute" as const,top:14,left:14,zIndex:20,background:"rgba(0,0,0,0.75)",backdropFilter:"blur(6px)",borderRadius:5,padding:"4px 12px",fontSize:11,fontWeight:700,color:"#9ca3af",letterSpacing:"0.1em"}}>BEFORE</div>
                <div style={{position:"absolute" as const,top:14,right:14,zIndex:20,background:"rgba(37,99,235,0.9)",backdropFilter:"blur(6px)",borderRadius:5,padding:"4px 12px",fontSize:11,fontWeight:700,color:"#fff"}}>AFTER · {selectedProduct?.name}</div>
              </>
            )}
            <div ref={sliderRef}
              style={{position:"relative" as const,width:"100%",height:"100%",cursor:afterUrl?"ew-resize":"default",userSelect:"none" as const}}
              onMouseDown={e=>{if(afterUrl){setIsDragging(true);onMove(e);}}}
              onMouseMove={onMove} onMouseUp={()=>setIsDragging(false)}
              onTouchStart={e=>{if(afterUrl){setIsDragging(true);onMove(e);}}}
              onTouchMove={onMove} onTouchEnd={()=>setIsDragging(false)}
            >
              <div style={{position:"absolute" as const,inset:0}}>
                <img src={afterUrl||(uploadedUrl||"")} alt="result" style={{width:"100%",height:"100%",objectFit:"contain" as const,background:"#040506"}}/>
              </div>
              {afterUrl&&uploadedUrl&&(
                <div style={{position:"absolute" as const,inset:0,clipPath:`inset(0 ${100-sliderPos}% 0 0)`}}>
                  <img src={uploadedUrl} alt="before" style={{width:"100%",height:"100%",objectFit:"contain" as const,background:"#040506"}}/>
                </div>
              )}
              {afterUrl&&!processing&&(
                <div style={{position:"absolute" as const,top:0,bottom:0,left:`${sliderPos}%`,width:2,background:"rgba(255,255,255,0.9)",transform:"translateX(-50%)",pointerEvents:"none",zIndex:10,boxShadow:"0 0 20px rgba(0,0,0,0.5)"}}>
                  <div style={{position:"absolute" as const,top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:38,height:38,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#0a0c10",boxShadow:"0 3px 14px rgba(0,0,0,0.5)"}}>⇔</div>
                </div>
              )}
              {processing&&(
                <div style={{position:"absolute" as const,inset:0,background:"rgba(4,5,6,0.82)",backdropFilter:"blur(6px)",zIndex:15,display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",gap:18}}>
                  <div style={{width:60,height:60,borderRadius:"50%",border:"3px solid #1e3a5f",borderTop:"3px solid #3b82f6",animation:"spin 1s linear infinite"}}/>
                  <div style={{fontSize:15,fontWeight:700,color:"#e8edf3",textAlign:"center" as const}}>{status}</div>
                  <div style={{fontSize:12,color:"#4a5568"}}>Stability AI 처리 중...</div>
                </div>
              )}
              {!processing&&!afterUrl&&(
                <div style={{position:"absolute" as const,inset:0,display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",background:"rgba(4,5,6,0.5)",zIndex:5,pointerEvents:"none",gap:14,textAlign:"center" as const}}>
                  <div style={{fontSize:52}}>🏗️</div>
                  <div style={{fontSize:15,fontWeight:700,color:"#6b7280"}}>
                    {!uploadedUrl?"건물 사진을 업로드하세요":!apiKeySet?"API 키를 입력하세요":"오른쪽에서 제품을 선택하세요"}
                  </div>
                </div>
              )}
            </div>
          </div>

          {selectedProduct&&(
            <div style={{height:42,flexShrink:0,background:"#0d1117",borderTop:"1px solid #1e2530",display:"flex",alignItems:"center",gap:12,padding:"0 16px"}}>
              <div style={{width:18,height:18,borderRadius:3,background:selectedProduct.hex,border:"1px solid rgba(255,255,255,0.1)",flexShrink:0}}/>
              <span style={{fontSize:12,fontWeight:600,color:"#e8edf3"}}>{selectedProduct.name}</span>
              <span style={{fontSize:9,fontWeight:700,borderRadius:3,padding:"1px 5px",...cc(selectedProduct.cat)}}>{selectedProduct.cat}</span>
              <span style={{fontSize:11,color:"#f59e0b"}}>🌱 에너지 {selectedProduct.energySave}% 절감</span>
              {afterUrl&&<span style={{marginLeft:"auto",fontSize:10,color:"#4a5568"}}>← 슬라이더로 비교</span>}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={{width:274,flexShrink:0,background:"#0d1117",borderLeft:"1px solid #1e2530",display:"flex",flexDirection:"column" as const,overflow:"hidden"}}>
          <div style={{padding:"12px 10px 8px",flexShrink:0}}>
            <div style={{fontSize:10,fontWeight:700,color:"#4a5568",letterSpacing:"0.1em",textTransform:"uppercase" as const,marginBottom:8}}>제품 카탈로그 · {PRODUCTS.length}종</div>
            <div style={{display:"flex",gap:3}}>
              {["전체","도금강판","컬러강판","목재무늬강판"].map(c=>(
                <div key={c} onClick={()=>setFilterCat(c)} style={{flex:1,textAlign:"center" as const,cursor:"pointer",padding:"4px 0",borderRadius:5,fontSize:10,fontWeight:600,background:filterCat===c?"#1d4ed8":"#161b22",color:filterCat===c?"#fff":"#4a5568",border:`1px solid ${filterCat===c?"#2563eb":"#21262d"}`,transition:"all 0.15s"}}>{c}</div>
              ))}
            </div>
            {!uploadedUrl&&<div style={{marginTop:7,padding:"6px 9px",background:"#2d1a00",border:"1px solid #92400e",borderRadius:6,fontSize:10,color:"#fbbf24"}}>⚠ 먼저 건물 사진을 업로드하세요</div>}
            {uploadedUrl&&!apiKeySet&&<div style={{marginTop:7,padding:"6px 9px",background:"#2d1a00",border:"1px solid #92400e",borderRadius:6,fontSize:10,color:"#fbbf24"}}>⚠ 상단에 API 키를 입력하세요</div>}
          </div>
          <div style={{flex:1,overflow:"auto",padding:"0 8px 10px"}}>
            {filtered.map(product=>{
              const isSel=selectedProduct?.id===product.id;
              const isRun=isSel&&processing;
              const c=cc(product.cat);
              const canRun=!!uploadedUrl&&apiKeySet&&!processing;
              return(
                <div key={product.id} className="prod"
                  onClick={()=>canRun&&run(product)}
                  style={{background:isSel?"#0d1b2e":"transparent",border:`1px solid ${isSel?"#2563eb":"transparent"}`,borderRadius:8,marginBottom:4,cursor:canRun?"pointer":"not-allowed",overflow:"hidden",transition:"all 0.15s",opacity:processing&&!isSel?0.4:1}}
                >
                  <div style={{height:38,position:"relative" as const,background:product.hex,overflow:"hidden"}}>
                    <div style={{position:"absolute" as const,inset:0,backgroundImage:`repeating-linear-gradient(180deg,transparent 0px,transparent ${product.cat==="도금강판"?40:54}px,rgba(0,0,0,0.13) ${product.cat==="도금강판"?40:54}px,rgba(0,0,0,0.13) ${product.cat==="도금강판"?42:56}px)`}}/>
                    <div style={{position:"absolute" as const,top:4,right:6,background:"rgba(0,0,0,0.62)",borderRadius:3,padding:"1px 5px",fontSize:8,fontWeight:700,color:product.energySave>=20?"#4ade80":product.energySave>=15?"#fbbf24":"#e8edf3"}}>
                      {product.energySave>=20?"🏆 ":""}{product.energySave}% 절감
                    </div>
                    {isRun&&<div style={{position:"absolute" as const,inset:0,background:"rgba(37,99,235,0.35)",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:18,height:18,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid #fff",animation:"spin 0.8s linear infinite"}}/></div>}
                    {isSel&&!isRun&&<div style={{position:"absolute" as const,top:4,left:6,width:15,height:15,borderRadius:"50%",background:"#3b82f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#fff",fontWeight:700}}>✓</div>}
                  </div>
                  <div style={{padding:"6px 8px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                      <span style={{fontSize:11,fontWeight:700,color:"#e8edf3",flex:1,lineHeight:1.3}}>{product.name}</span>
                      <span style={{fontSize:8,fontWeight:700,borderRadius:3,padding:"1px 4px",background:c.bg,color:c.text,border:`1px solid ${c.border}`,flexShrink:0}}>{product.cat}</span>
                    </div>
                    <div style={{display:"flex",gap:4}}>
                      <div style={{background:"#0a1a0a",border:"1px solid #14532d",borderRadius:3,padding:"1px 5px",fontSize:9,color:"#22c55e",fontWeight:600}}>⚡{product.energySave}%</div>
                      <div style={{background:"#0a1a0a",border:"1px solid #14532d",borderRadius:3,padding:"1px 5px",fontSize:9,color:"#4ade80",fontWeight:600}}>-{product.co2}t CO₂</div>
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
