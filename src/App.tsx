import { useState, useRef } from "react";

const PRODUCTS = [
  { id:"g1", name:"PosMAC® 아이언그레이",  cat:"도금강판", hex:"#6b7280", energySave:12, co2:8.4,  desc:"Mg-Al-Zn 3원계 합금 도금. 해안·산업지역 내식성 최강.", features:["내식성 최고등급","해안·공업지역 최적","경량 고강도","15년 이상 보증"] },
  { id:"g2", name:"PosMAC® 실버메탈",      cat:"도금강판", hex:"#c0cad2", energySave:14, co2:9.8,  desc:"스테인리스 대체재. 중량 30% 절감, 고광택 유지.", features:["스테인리스 대체","중량 30% 절감","고광택 지속","경제적 선택"] },
  { id:"g3", name:"PosMAC® 샴페인골드",    cat:"도금강판", hex:"#c9a96e", energySave:10, co2:7.1,  desc:"골드 톤 내식 강화. 고급 상업·호텔 시설에 적합.", features:["프리미엄 외관","고급 상업시설","내식성 강화","품격 연출"] },
  { id:"g4", name:"PosMAC® 브론즈메탈",    cat:"도금강판", hex:"#7d5a3c", energySave:11, co2:7.7,  desc:"따뜻한 브론즈 톤. 역사지구·문화시설과 자연스러운 조화.", features:["클래식 감성","역사지구 조화","문화시설 적합","내구성 우수"] },
  { id:"g5", name:"갈바륨 내추럴실버",     cat:"도금강판", hex:"#a8b4b8", energySave:13, co2:9.1,  desc:"알루미늄-아연 합금. 장수명 외장재로 경제성 탁월.", features:["장수명","경제성 탁월","자연소재 감성","유지보수 최소"] },
  { id:"c1", name:"쿨루프 크림화이트",     cat:"컬러강판", hex:"#f2ede4", energySave:28, co2:19.6, desc:"고반사율 쿨루프 특화. 냉방비 최대 28% 절감 효과.", features:["냉방비 28% 절감","쿨루프 인증","도시열섬 저감","ESG 핵심 제품"] },
  { id:"c2", name:"스카이블루",            cat:"컬러강판", hex:"#4a90c4", energySave:18, co2:12.6, desc:"PVDF 도료로 자외선 저항 최강. 도심 친화형 컬러.", features:["PVDF 도료","자외선 저항","도심 친화형","색상 지속력"] },
  { id:"c3", name:"딥네이비",             cat:"컬러강판", hex:"#1e2d5a", energySave:8,  co2:5.6,  desc:"모던 오피스·주상복합의 핵심 컬러. 강한 도시적 감성.", features:["모던 프리미엄","오피스 최적","주상복합 인기","강한 인상"] },
  { id:"c4", name:"모스그린",             cat:"컬러강판", hex:"#4d6b44", energySave:16, co2:11.2, desc:"저탄소 공정 인증. 친환경 이미지 구현에 최적.", features:["저탄소 공정","친환경 인증","자연 조화","ESG 이미지"] },
  { id:"c5", name:"차콜블랙",             cat:"컬러강판", hex:"#2e3238", energySave:7,  co2:4.9,  desc:"무광 차콜 마감. 산업·상업시설 강렬한 개성 표현.", features:["무광 마감","강한 개성","산업시설 적합","모던 스타일"] },
  { id:"c6", name:"브릭레드",             cat:"컬러강판", hex:"#8b3a2a", energySave:9,  co2:6.3,  desc:"벽돌 감성의 따뜻한 레드. 지역 정체성 강조에 적합.", features:["전통미","지역 정체성","문화시설","활력 있는 외관"] },
  { id:"c7", name:"샌드베이지",           cat:"컬러강판", hex:"#c4b49a", energySave:22, co2:15.4, desc:"자연스러운 베이지. 주거·교육시설에서 가장 많이 선택.", features:["자연스러운 조화","주거 최적","교육시설 인기","도시경관 친화"] },
  { id:"c8", name:"테라코타",             cat:"컬러강판", hex:"#c06a45", energySave:12, co2:8.4,  desc:"지중해 감성 오렌지. 상업·문화공간 주목도 상승.", features:["지중해 감성","주목도 상승","상업공간 인기","개성 있는 외관"] },
  { id:"c9", name:"올리브골드",           cat:"컬러강판", hex:"#8a8440", energySave:15, co2:10.5, desc:"황금빛 올리브. 공공·문화건물 품격 연출에 탁월.", features:["내추럴 고급감","공공건물 적합","품격 연출","자연 감성"] },
  { id:"c10",name:"포레스트그린",         cat:"컬러강판", hex:"#2d4a35", energySave:17, co2:11.9, desc:"그린뉴딜 상징색. 탄소중립 이미지 구현에 최적.", features:["ESG 상징색","그린뉴딜","탄소중립","환경부 연계"] },
  { id:"c11",name:"코퍼로즈",            cat:"컬러강판", hex:"#b87b6e", energySave:13, co2:9.1,  desc:"트렌디한 코퍼 톤. 복합문화공간·리테일 트렌드 선도.", features:["트렌드 컬러","복합문화공간","리테일 인기","웜톤 고급감"] },
  { id:"c12",name:"와인레드",            cat:"컬러강판", hex:"#6b2737", energySave:8,  co2:5.6,  desc:"강렬한 레드. 랜드마크 건물 상징성 확보에 최적.", features:["랜드마크","강한 상징성","주목도 1위","기억에 남는 외관"] },
  { id:"w1", name:"월넛브라운 (5GTM52)", cat:"목재무늬강판", hex:"#5c3d1e", energySave:10, co2:7.0, desc:"월넛 목재 질감. 자연 친화적 공간에 따뜻함 부여.", features:["목재 질감","자연 친화","따뜻한 분위기","카페·리테일 인기"] },
  { id:"w2", name:"다크오크 (3GTMZ1)",  cat:"목재무늬강판", hex:"#3b2710", energySave:9,  co2:6.3, desc:"짙은 오크 무늬. 고급스럽고 중후한 인테리어·외관.", features:["고급 인테리어","중후한 감성","호텔 로비","프리미엄 공간"] },
  { id:"w3", name:"내추럴오크 (3GTM52)",cat:"목재무늬강판", hex:"#d4c4a0", energySave:11, co2:7.7, desc:"밝은 오크. 스칸디나비안 스타일 자연 공간 연출.", features:["스칸디나비안","밝고 경쾌","카페 트렌드","자연 공간"] },
  { id:"w4", name:"그레이우드 (3GTM68)",cat:"목재무늬강판", hex:"#4a3f35", energySave:10, co2:7.0, desc:"빈티지 그레이 우드. 모던하고 세련된 공간 연출.", features:["빈티지 감성","모던 세련","갤러리 적합","도시 감성"] },
  { id:"w5", name:"올리브우드 (3GTM51)",cat:"목재무늬강판", hex:"#8a8a6a", energySave:12, co2:8.4, desc:"올리브 톤 우드 무늬. 에코 친화적 자연 공간.", features:["에코 친화","자연 공간","힐링 분위기","공원 근처 건물"] },
  { id:"w6", name:"체스넛 (5GTM39)",   cat:"목재무늬강판", hex:"#7a4a25", energySave:10, co2:7.0, desc:"따뜻한 체스넛 브라운. 전통과 현대의 조화.", features:["전통 감성","따뜻한 색감","한옥 주변","문화재 인근"] },
];

const CASES = [
  { name:"스타벅스 남양주삼패점", product:"월넛브라운 목재무늬강판", tag:"상업시설", img:"https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=500&q=80" },
  { name:"포스코퓨처엠 양극재 공장", product:"PosMAC® 실버메탈", tag:"산업시설", img:"https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=500&q=80" },
  { name:"코트야드 메리어트 판교", product:"PosMAC® 샴페인골드", tag:"호텔", img:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80" },
  { name:"광화문 광장 지하보도", product:"테라코타 컬러강판", tag:"공공시설", img:"https://images.unsplash.com/photo-1555636222-cae831e670b3?w=500&q=80" },
  { name:"LCT 랜드마크타워", product:"딥네이비 컬러강판", tag:"주거복합", img:"https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=500&q=80" },
  { name:"KT파크빌딩", product:"갈바륨 내추럴실버", tag:"업무시설", img:"https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?w=500&q=80" },
  { name:"호텔 나루 서울 엠갤러리", product:"PosMAC® 아이언그레이", tag:"호텔", img:"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80" },
  { name:"현대 LCT", product:"스카이블루 컬러강판", tag:"복합시설", img:"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&q=80" },
];

const GOV_PROGRAMS = ["그린리모델링 사업 (국토부)", "스마트그린산단 (산업부)", "탄소중립 도시재생 (환경부)"];

interface Recommendation {
  rank: number;
  productId: string;
  reason: string;
  highlight: string;
  govProgram: string;
  caseRef: string;
}

interface Analysis {
  buildingType: string;
  currentCondition: string;
  environment: string;
  challenge: string;
  recommendations: Recommendation[];
  esgSummary: string;
}

export default function App() {
  const [uploadedUrl, setUploadedUrl]   = useState<string|null>(null);
  const [uploadedFile, setUploadedFile] = useState<File|null>(null);
  const [analyzing, setAnalyzing]       = useState(false);
  const [analysis, setAnalysis]         = useState<Analysis|null>(null);
  const [error, setError]               = useState("");
  const [activeRec, setActiveRec]       = useState(0);
  const [showCases, setShowCases]       = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const getProduct = (id: string) => PRODUCTS.find(p => p.id === id);

  const analyze = async () => {
    if (!uploadedFile) return;
    setAnalyzing(true); setError(""); setAnalysis(null);
    try {
      const base64 = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res((r.result as string).split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(uploadedFile);
      });

      const productList = PRODUCTS.map(p =>
        `${p.id}|${p.name}|${p.cat}|에너지절감${p.energySave}%|${p.features.join(",")}`
      ).join("\n");

      const resp = await fetch("/api/claude-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64 } },
              { type: "text", text: `당신은 포스코 스틸리온 외장재 전문 컨설턴트입니다.
이 건물 사진을 분석하고 최적의 스틸리온 제품 3개를 추천해주세요.

제품 목록 (id|이름|카테고리|에너지절감|특징):
${productList}

다음 JSON으로만 응답 (마크다운 없이):
{
  "buildingType": "건물 유형 (예: 공공 교육시설, 산업 공장, 상업 오피스 등)",
  "currentCondition": "현재 외벽 상태 한 문장",
  "environment": "입지 환경 (예: 도심, 해안, 산업단지 등)",
  "challenge": "이 건물의 외관 개선 핵심 과제 한 문장",
  "recommendations": [
    {
      "rank": 1,
      "productId": "제품id",
      "reason": "이 건물에 이 제품을 추천하는 구체적 이유 2문장",
      "highlight": "핵심 효과 10자 이내",
      "govProgram": "${GOV_PROGRAMS.join("|")} 중 1개",
      "caseRef": "유사 시공사례 건물명 1개"
    },
    { "rank": 2, ... },
    { "rank": 3, ... }
  ],
  "esgSummary": "ESG 관점에서 이 건물 외장 개선의 전체 효과 2문장"
}` }
            ]
          }]
        })
      });

      if (!resp.ok) throw new Error(`분석 오류: ${resp.status}`);
      const data = await resp.json();
      const text = data.content?.find((b: any) => b.type === "text")?.text || "{}";
      const parsed: Analysis = JSON.parse(text.replace(/```json|```/g, "").trim());
      setAnalysis(parsed);
      setActiveRec(0);
    } catch(e: any) {
      setError(e.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const activeProduct = analysis ? getProduct(analysis.recommendations[activeRec]?.productId) : null;
  const activeRecData = analysis?.recommendations[activeRec];

  return (
    <div style={{fontFamily:"'IBM Plex Sans KR','Noto Sans KR',sans-serif",background:"#0a0c10",color:"#e8edf3",height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#161b22}::-webkit-scrollbar-thumb{background:#30363d;border-radius:2px}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
      `}</style>

      {/* HEADER */}
      <header style={{height:54,flexShrink:0,background:"#0d1117",borderBottom:"1px solid #1e2530",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:32,height:32,borderRadius:7,background:"linear-gradient(135deg,#1d4ed8,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15,color:"#fff"}}>S</div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#e8edf3",letterSpacing:"0.02em"}}>STEELION AI 외장재 컨설턴트</div>
            <div style={{fontSize:10,color:"#4a5568"}}>건물 사진 분석 → 최적 제품 추천 → ESG 효과 산출</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setShowCases(true)} style={{background:"#161b22",border:"1px solid #21262d",borderRadius:6,padding:"5px 14px",fontSize:11,color:"#8b949e",cursor:"pointer",fontWeight:600}}>📸 시공사례</button>
          <div style={{fontSize:10,color:"#4ade80",background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.25)",borderRadius:20,padding:"4px 12px",fontWeight:700}}>🌱 ESG 협력과제</div>
        </div>
      </header>

      <div style={{flex:1,display:"flex",overflow:"hidden",minHeight:0}}>

        {/* LEFT — Upload + Analysis */}
        <div style={{width:320,flexShrink:0,background:"#0d1117",borderRight:"1px solid #1e2530",display:"flex",flexDirection:"column",overflow:"hidden"}}>

          {/* Upload */}
          <div style={{padding:"16px 16px 12px",flexShrink:0}}>
            <div style={{fontSize:10,fontWeight:700,color:"#4a5568",letterSpacing:"0.1em",textTransform:"uppercase" as const,marginBottom:10}}>건물 사진 업로드</div>
            <div onClick={()=>fileRef.current?.click()} style={{border:`2px dashed ${uploadedUrl?"#22c55e":"#2d3748"}`,borderRadius:10,cursor:"pointer",background:uploadedUrl?"#071507":"#111419",overflow:"hidden",transition:"all 0.2s",marginBottom:12}}>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                const f=e.target.files?.[0];if(!f)return;
                setUploadedFile(f);setUploadedUrl(URL.createObjectURL(f));
                setAnalysis(null);setError("");setActiveRec(0);
              }}/>
              {uploadedUrl ? (
                <div style={{position:"relative" as const}}>
                  <img src={uploadedUrl} style={{width:"100%",display:"block",maxHeight:200,objectFit:"cover" as const}} alt="uploaded"/>
                  <div style={{position:"absolute" as const,bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.7))",padding:"8px 12px"}}>
                    <div style={{fontSize:11,color:"#22c55e",fontWeight:600}}>✓ 업로드됨 · 클릭해서 변경</div>
                  </div>
                </div>
              ) : (
                <div style={{padding:"28px 20px",textAlign:"center" as const}}>
                  <div style={{fontSize:40,marginBottom:10}}>🏗️</div>
                  <div style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:4}}>건물 사진을 업로드하세요</div>
                  <div style={{fontSize:11,color:"#4a5568"}}>클릭 또는 드래그&드롭</div>
                </div>
              )}
            </div>

            <button onClick={analyze} disabled={!uploadedFile||analyzing} style={{
              width:"100%",background:uploadedFile&&!analyzing?"linear-gradient(135deg,#1d4ed8,#2563eb)":"#161b22",
              border:"none",borderRadius:9,padding:"12px",fontSize:13,fontWeight:700,
              color:uploadedFile&&!analyzing?"#fff":"#4a5568",
              cursor:uploadedFile&&!analyzing?"pointer":"not-allowed",
              display:"flex",alignItems:"center",justifyContent:"center",gap:8,
              transition:"all 0.2s",
            }}>
              {analyzing ? (
                <><div style={{width:16,height:16,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.2)",borderTop:"2px solid #fff",animation:"spin 0.8s linear infinite"}}/> AI 분석 중...</>
              ) : (
                <>🤖 AI 외장재 추천 분석</>
              )}
            </button>
            {error && <div style={{marginTop:8,padding:"8px 10px",background:"#2d0a0a",border:"1px solid #7f1d1d",borderRadius:7,fontSize:11,color:"#f87171"}}>{error}</div>}
          </div>

          {/* Building analysis result */}
          {analysis && (
            <div style={{flex:1,overflow:"auto",padding:"0 16px 16px",animation:"fadeIn 0.4s ease"}}>
              <div style={{height:1,background:"#1e2530",marginBottom:14}}/>

              {/* Building info */}
              <div style={{background:"#111419",border:"1px solid #1e2530",borderRadius:10,padding:"14px",marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,color:"#60a5fa",marginBottom:10,textTransform:"uppercase" as const,letterSpacing:"0.08em"}}>🏢 건물 분석 결과</div>
                {[
                  {l:"건물 유형", v:analysis.buildingType},
                  {l:"현재 외벽", v:analysis.currentCondition},
                  {l:"입지 환경", v:analysis.environment},
                ].map(item=>(
                  <div key={item.l} style={{marginBottom:8}}>
                    <div style={{fontSize:10,color:"#4a5568",marginBottom:2}}>{item.l}</div>
                    <div style={{fontSize:12,color:"#e8edf3",fontWeight:500,lineHeight:1.4}}>{item.v}</div>
                  </div>
                ))}
                <div style={{marginTop:10,padding:"9px 11px",background:"#0d1b2e",border:"1px solid #1d4ed8",borderRadius:7,fontSize:11,color:"#93c5fd",lineHeight:1.5}}>
                  💡 {analysis.challenge}
                </div>
              </div>

              {/* ESG Summary */}
              <div style={{background:"#0d2d1a",border:"1px solid #166534",borderRadius:10,padding:"14px"}}>
                <div style={{fontSize:10,fontWeight:700,color:"#22c55e",marginBottom:8,textTransform:"uppercase" as const,letterSpacing:"0.08em"}}>🌱 ESG 개선 효과</div>
                <div style={{fontSize:12,color:"#86efac",lineHeight:1.6}}>{analysis.esgSummary}</div>
              </div>
            </div>
          )}

          {!analysis && !analyzing && (
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
              <div style={{textAlign:"center" as const,color:"#2d3748"}}>
                <div style={{fontSize:32,marginBottom:10}}>🔍</div>
                <div style={{fontSize:12}}>사진을 업로드하고<br/>AI 분석을 시작하세요</div>
              </div>
            </div>
          )}
        </div>

        {/* CENTER — Product recommendation */}
        <div style={{flex:1,display:"flex",flexDirection:"column" as const,overflow:"hidden",minWidth:0,position:"relative" as const}}>

          {/* Cases overlay */}
          {showCases && (
            <div style={{position:"absolute" as const,inset:0,background:"rgba(4,5,6,0.97)",zIndex:30,display:"flex",flexDirection:"column" as const,overflow:"hidden",animation:"fadeIn 0.3s ease"}}>
              <div style={{padding:"16px 20px",borderBottom:"1px solid #1e2530",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:"#e8edf3"}}>📸 실제 시공사례</div>
                  <div style={{fontSize:11,color:"#4a5568",marginTop:2}}>포스코 스틸리온 제품 적용 건축물</div>
                </div>
                <button onClick={()=>setShowCases(false)} style={{background:"#161b22",border:"1px solid #21262d",borderRadius:7,padding:"6px 16px",fontSize:12,color:"#8b949e",cursor:"pointer",fontWeight:600}}>✕ 닫기</button>
              </div>
              <div style={{flex:1,overflow:"auto",padding:"20px"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
                  {CASES.map((c,i)=>(
                    <div key={i} style={{background:"#0d1117",border:"1px solid #1e2530",borderRadius:12,overflow:"hidden"}}>
                      <div style={{height:160,overflow:"hidden",position:"relative" as const}}>
                        <img src={c.img} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover" as const}} onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80";}}/>
                        <div style={{position:"absolute" as const,top:8,left:8,background:"rgba(37,99,235,0.9)",borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700,color:"#fff"}}>{c.tag}</div>
                      </div>
                      <div style={{padding:"12px 14px"}}>
                        <div style={{fontSize:12,fontWeight:700,color:"#e8edf3",marginBottom:5,lineHeight:1.4}}>{c.name}</div>
                        <div style={{fontSize:10,color:"#60a5fa",background:"#0d1b2e",border:"1px solid #1d4ed8",borderRadius:4,padding:"2px 8px",display:"inline-block"}}>{c.product}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!analysis && !analyzing && (
            <div style={{flex:1,display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",gap:16,padding:"40px",textAlign:"center" as const}}>
              <div style={{fontSize:64}}>🏗️</div>
              <div style={{fontSize:18,fontWeight:700,color:"#4a5568"}}>건물 사진을 업로드하면</div>
              <div style={{fontSize:14,color:"#2d3748",lineHeight:1.8}}>
                AI가 건물을 분석하고<br/>
                최적의 스틸리온 외장재 3개를 추천해드립니다
              </div>
              <div style={{display:"flex",gap:20,marginTop:10}}>
                {["🏭 건물 유형 분석","🎯 최적 제품 추천","🌱 ESG 효과 산출"].map(t=>(
                  <div key={t} style={{background:"#111419",border:"1px solid #1e2530",borderRadius:8,padding:"12px 16px",fontSize:12,color:"#6b7280"}}>{t}</div>
                ))}
              </div>
            </div>
          )}

          {analyzing && (
            <div style={{flex:1,display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",gap:18}}>
              <div style={{width:64,height:64,borderRadius:"50%",border:"3px solid #1e3a5f",borderTop:"3px solid #3b82f6",animation:"spin 1s linear infinite"}}/>
              <div style={{fontSize:16,fontWeight:700,color:"#8b949e"}}>AI가 건물을 분석하고 있습니다...</div>
              <div style={{fontSize:12,color:"#4a5568",lineHeight:1.8,textAlign:"center" as const}}>
                건물 유형, 환경, 외벽 상태를 파악하고<br/>최적의 스틸리온 제품을 선별 중입니다
              </div>
            </div>
          )}

          {analysis && !analyzing && (
            <div style={{flex:1,overflow:"auto",padding:"24px"}}>

              {/* Recommendation tabs */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:13,fontWeight:700,color:"#e8edf3",marginBottom:12}}>🏆 AI 추천 제품 TOP 3</div>
                <div style={{display:"flex",gap:8,marginBottom:20}}>
                  {analysis.recommendations.map((rec,i)=>{
                    const p = getProduct(rec.productId);
                    return (
                      <div key={i} onClick={()=>setActiveRec(i)}
                        style={{flex:1,cursor:"pointer",borderRadius:10,overflow:"hidden",border:`2px solid ${activeRec===i?"#2563eb":"#1e2530"}`,transition:"all 0.15s",background:activeRec===i?"#0d1b2e":"#111419"}}>
                        <div style={{height:8,background:p?.hex||"#333"}}/>
                        <div style={{padding:"10px 12px"}}>
                          <div style={{fontSize:10,fontWeight:700,color:activeRec===i?"#60a5fa":"#4a5568",marginBottom:4}}>
                            {i===0?"🥇 1순위":i===1?"🥈 2순위":"🥉 3순위"}
                          </div>
                          <div style={{fontSize:12,fontWeight:700,color:"#e8edf3",lineHeight:1.3,marginBottom:4}}>{p?.name}</div>
                          <div style={{fontSize:10,color:activeRec===i?"#93c5fd":"#4a5568"}}>{rec.highlight}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Active recommendation detail */}
                {activeProduct && activeRecData && (
                  <div style={{animation:"fadeIn 0.3s ease"}}>
                    {/* Product header */}
                    <div style={{background:"#111419",border:"1px solid #1e2530",borderRadius:12,overflow:"hidden",marginBottom:14}}>
                      <div style={{height:6,background:activeProduct.hex}}/>
                      <div style={{padding:"18px 20px"}}>
                        <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:14}}>
                          <div style={{width:56,height:56,borderRadius:10,background:activeProduct.hex,flexShrink:0,boxShadow:"inset 0 2px 8px rgba(0,0,0,0.2)"}}/>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                              <span style={{fontSize:16,fontWeight:800,color:"#e8edf3"}}>{activeProduct.name}</span>
                              <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:4,background:activeProduct.cat==="도금강판"?"#0d2d1a":activeProduct.cat==="컬러강판"?"#0d1b2e":"#2d1a0a",color:activeProduct.cat==="도금강판"?"#22c55e":activeProduct.cat==="컬러강판"?"#60a5fa":"#f59e0b"}}>{activeProduct.cat}</span>
                            </div>
                            <div style={{fontSize:12,color:"#6b7280",lineHeight:1.5}}>{activeProduct.desc}</div>
                          </div>
                        </div>

                        {/* Features */}
                        <div style={{display:"flex",flexWrap:"wrap" as const,gap:6,marginBottom:14}}>
                          {activeProduct.features.map(f=>(
                            <span key={f} style={{fontSize:11,background:"#161b22",border:"1px solid #21262d",borderRadius:5,padding:"3px 9px",color:"#8b949e"}}>✓ {f}</span>
                          ))}
                        </div>

                        {/* Recommendation reason */}
                        <div style={{background:"#0d1b2e",border:"1px solid #1d4ed8",borderRadius:9,padding:"12px 14px",marginBottom:12}}>
                          <div style={{fontSize:10,fontWeight:700,color:"#60a5fa",marginBottom:6}}>🤖 AI 추천 이유</div>
                          <div style={{fontSize:12,color:"#93c5fd",lineHeight:1.6}}>{activeRecData.reason}</div>
                        </div>

                        {/* Gov program + case */}
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                          <div style={{background:"#0d2d1a",border:"1px solid #166534",borderRadius:8,padding:"10px 12px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#22c55e",marginBottom:4}}>🏛️ 연계 정부사업</div>
                            <div style={{fontSize:11,color:"#86efac",lineHeight:1.4}}>{activeRecData.govProgram}</div>
                          </div>
                          <div style={{background:"#161b22",border:"1px solid #21262d",borderRadius:8,padding:"10px 12px"}}>
                            <div style={{fontSize:10,fontWeight:700,color:"#8b949e",marginBottom:4}}>📸 유사 시공사례</div>
                            <div style={{fontSize:11,color:"#e8edf3",lineHeight:1.4}}>{activeRecData.caseRef}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ESG Metrics */}
                    <div style={{background:"#0d1117",border:"1px solid #1e2530",borderRadius:12,padding:"16px 18px"}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#e8edf3",marginBottom:12}}>🌱 예상 ESG 절감 효과</div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                        {[
                          {l:"에너지 절감",v:`${activeProduct.energySave}%`,c:"#f59e0b",i:"⚡"},
                          {l:"CO₂/년 감축",v:`${activeProduct.co2}t`,c:"#22c55e",i:"🌿"},
                          {l:"연간 절감액",v:`${(activeProduct.energySave*120).toLocaleString()}만원`,c:"#60a5fa",i:"💰"},
                          {l:"10년 CO₂",v:`${Math.round(activeProduct.co2*10)}t`,c:"#a78bfa",i:"📊"},
                        ].map(m=>(
                          <div key={m.l} style={{background:"#111419",border:"1px solid #1e2530",borderRadius:8,padding:"12px 10px",textAlign:"center" as const}}>
                            <div style={{fontSize:18,marginBottom:4}}>{m.i}</div>
                            <div style={{fontSize:16,fontWeight:800,color:m.c,marginBottom:3}}>{m.v}</div>
                            <div style={{fontSize:9,color:"#4a5568",lineHeight:1.3}}>{m.l}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — All products */}
        <div style={{width:260,flexShrink:0,background:"#0d1117",borderLeft:"1px solid #1e2530",display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"14px 12px 10px",flexShrink:0}}>
            <div style={{fontSize:10,fontWeight:700,color:"#4a5568",letterSpacing:"0.1em",textTransform:"uppercase" as const,marginBottom:8}}>전체 제품 · {PRODUCTS.length}종</div>
          </div>
          <div style={{flex:1,overflow:"auto",padding:"0 8px 10px"}}>
            {["도금강판","컬러강판","목재무늬강판"].map(cat=>(
              <div key={cat} style={{marginBottom:12}}>
                <div style={{fontSize:10,fontWeight:700,color:"#4a5568",letterSpacing:"0.06em",textTransform:"uppercase" as const,padding:"4px 8px",marginBottom:4}}>
                  {cat==="도금강판"?"🔩":cat==="컬러강판"?"🎨":"🪵"} {cat}
                </div>
                {PRODUCTS.filter(p=>p.cat===cat).map(product=>{
                  const isRec = analysis?.recommendations.some(r=>r.productId===product.id);
                  const recRank = analysis?.recommendations.findIndex(r=>r.productId===product.id);
                  return (
                    <div key={product.id} style={{background:isRec?"#0d1b2e":"transparent",border:`1px solid ${isRec?"#2563eb":"transparent"}`,borderRadius:7,marginBottom:3,overflow:"hidden",transition:"all 0.15s",position:"relative" as const}}>
                      <div style={{height:28,position:"relative" as const,background:product.hex,overflow:"hidden"}}>
                        <div style={{position:"absolute" as const,inset:0,backgroundImage:"repeating-linear-gradient(180deg,transparent 0px,transparent 24px,rgba(0,0,0,0.12) 24px,rgba(0,0,0,0.12) 26px)"}}/>
                        {isRec && recRank !== undefined && recRank >= 0 && (
                          <div style={{position:"absolute" as const,top:4,right:6,background:"rgba(37,99,235,0.9)",borderRadius:3,padding:"1px 5px",fontSize:8,fontWeight:700,color:"#fff"}}>
                            {recRank===0?"🥇":recRank===1?"🥈":"🥉"} 추천
                          </div>
                        )}
                      </div>
                      <div style={{padding:"5px 8px"}}>
                        <div style={{fontSize:10,fontWeight:isRec?700:500,color:isRec?"#e8edf3":"#6b7280",lineHeight:1.3}}>{product.name}</div>
                        <div style={{fontSize:9,color:"#4a5568",marginTop:1}}>⚡{product.energySave}% 절감</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
