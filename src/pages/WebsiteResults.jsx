import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Globe, CheckCircle, ChevronDown, ChevronUp, Zap, LayoutGrid, Target, AlertTriangle, Star } from "lucide-react";

const PRIORITY_COLORS = { "Critical": "#DC2626", "High": "#D97706", "Medium": "#059669" };
const PRIORITY_BG = { "Critical": "#FEF2F2", "High": "#FFFBEB", "Medium": "#ECFDF5" };

function SectionCard({ section, insight }) {
  const [open, setOpen] = useState(false);
  const pc = PRIORITY_COLORS[section.priority] || "#6B7280";
  const pb = PRIORITY_BG[section.priority] || "#F9FAFB";

  return (
    <div style={{border:"0.5px solid #e5e7eb",borderRadius:10,overflow:"hidden",marginBottom:8}}>
      <button onClick={() => setOpen(o => !o)}
        style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#f9fafb",border:"none",cursor:"pointer",textAlign:"left"}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#0F766E,#059669)",color:"white",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          {section.order}
        </div>
        <div style={{flex:1}}>
          <p style={{fontSize:13,fontWeight:600,color:"#111827",margin:0}}>{section.name}</p>
        </div>
        <span style={{fontSize:10,padding:"2px 8px",borderRadius:4,background:pb,color:pc,fontWeight:500,flexShrink:0}}>{section.priority}</span>
        {open ? <ChevronUp size={14} color="#9ca3af"/> : <ChevronDown size={14} color="#9ca3af"/>}
      </button>

      {open && (
        <div style={{padding:"14px 16px",background:"white",borderTop:"0.5px solid #f3f4f6"}}>
          <p style={{fontSize:13,color:"#374151",margin:"0 0 12px",lineHeight:1.7}}>{section.desc}</p>

          {insight && (
            <div style={{background:"#EFF6FF",borderRadius:8,padding:"10px 12px",borderLeft:"3px solid #2563EB",marginBottom:12}}>
              <p style={{fontSize:11,color:"#1E40AF",fontWeight:500,margin:"0 0 2px"}}>Personalized for your business</p>
              <p style={{fontSize:12,color:"#1D4ED8",margin:0}}>{insight}</p>
            </div>
          )}

          <div>
            <p style={{fontSize:11,color:"#9ca3af",fontWeight:500,textTransform:"uppercase",letterSpacing:".06em",margin:"0 0 6px"}}>Implementation Tips</p>
            {section.tips?.map((tip, i) => (
              <div key={i} style={{display:"flex",gap:8,marginBottom:5}}>
                <CheckCircle size={13} color="#059669" style={{flexShrink:0,marginTop:1}}/>
                <p style={{fontSize:12,color:"#374151",margin:0}}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WebsiteResults() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const blueprintId = params.get("blueprintId");
    const success = params.get("success");
    if (blueprintId && success === "true") {
      fetch(`/api/get-website-blueprint?id=${blueprintId}`)
        .then(r => r.json())
        .then(d => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    } else setLoading(false);
  }, []);

  if (loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:40,height:40,border:"3px solid #e5e7eb",borderTop:"3px solid #0F766E",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 12px"}}/>
        <p style={{color:"#6b7280",fontSize:14}}>Loading your website blueprint...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (!data) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{textAlign:"center"}}>
        <h2 style={{fontSize:22,fontWeight:600,color:"#111827",marginBottom:8}}>Blueprint not found</h2>
        <p style={{color:"#6b7280",marginBottom:16}}>Check your email for your website blueprint.</p>
        <Link to="/" style={{color:"#0F766E",fontSize:14}}>Back to home</Link>
      </div>
    </div>
  );

  const bp = typeof data.blueprint === "string" ? JSON.parse(data.blueprint) : data.blueprint;
  const { structure, aiInsights } = bp;
  const insights = aiInsights?.section_insights || {};

  return (
    <div style={{minHeight:"100vh",background:"white",fontFamily:"Arial,sans-serif"}}>
      <header style={{borderBottom:"1px solid #e5e7eb",padding:"16px 24px",display:"flex",alignItems:"center",gap:8}}>
        <Link to="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#0F766E,#059669)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Globe size={16} color="white"/>
          </div>
          <span style={{fontWeight:700,color:"#111827",fontSize:15}}>Website Blueprint</span>
        </Link>
      </header>

      <div style={{maxWidth:720,margin:"0 auto",padding:"24px 16px"}}>

        <div style={{background:"linear-gradient(135deg,#0F766E,#059669)",borderRadius:12,padding:24,marginBottom:16,color:"white"}}>
          <p style={{fontSize:10,opacity:.7,textTransform:"uppercase",letterSpacing:".1em",margin:"0 0 4px"}}>Fire-Works Website Blueprint</p>
          <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 2px"}}>{data.business_name}</h2>
          <p style={{fontSize:12,opacity:.7,margin:0}}>{structure?.label} · Page-by-page website structure guide</p>
        </div>

        <div style={{background:"#ECFDF5",border:"1px solid #6EE7B7",borderRadius:12,padding:16,marginBottom:16,display:"flex",alignItems:"flex-start",gap:12}}>
          <CheckCircle size={20} color="#059669" style={{flexShrink:0,marginTop:1}}/>
          <div>
            <p style={{margin:0,fontWeight:500,color:"#065F46",fontSize:14}}>Payment confirmed — your website blueprint is ready</p>
            <p style={{margin:"4px 0 0",color:"#047857",fontSize:13}}>Check {data.email} for your PDF. Your complete page-by-page structure is below.</p>
          </div>
        </div>

        {aiInsights?.headline_recommendation && (
          <div style={{background:"#f9fafb",border:"0.5px solid #e5e7eb",borderRadius:12,padding:16,marginBottom:14}}>
            <p style={{fontSize:11,fontWeight:500,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".08em",margin:"0 0 12px"}}>AI Recommendations for Your Business</p>

            <div style={{marginBottom:12}}>
              <p style={{fontSize:11,color:"#9ca3af",margin:"0 0 4px"}}>SUGGESTED HOMEPAGE HEADLINE</p>
              <div style={{background:"white",border:"0.5px solid #e5e7eb",borderRadius:8,padding:"10px 14px"}}>
                <p style={{fontSize:14,fontWeight:600,color:"#111827",margin:0,fontStyle:"italic"}}>"{aiInsights.headline_recommendation}"</p>
              </div>
            </div>

            {aiInsights.meta_description && (
              <div style={{marginBottom:12}}>
                <p style={{fontSize:11,color:"#9ca3af",margin:"0 0 4px"}}>SUGGESTED META DESCRIPTION (SEO)</p>
                <div style={{background:"white",border:"0.5px solid #e5e7eb",borderRadius:8,padding:"10px 14px"}}>
                  <p style={{fontSize:12,color:"#374151",margin:0}}>{aiInsights.meta_description}</p>
                  <p style={{fontSize:10,color:"#9ca3af",margin:"4px 0 0"}}>{aiInsights.meta_description.length}/160 chars</p>
                </div>
              </div>
            )}

            {aiInsights.top_3_priorities?.length > 0 && (
              <div style={{marginBottom:12}}>
                <p style={{fontSize:11,color:"#9ca3af",margin:"0 0 6px"}}>TOP 3 PRIORITIES FOR YOUR WEBSITE</p>
                {aiInsights.top_3_priorities.map((p, i) => (
                  <div key={i} style={{display:"flex",gap:10,marginBottom:6}}>
                    <div style={{width:20,height:20,borderRadius:"50%",background:"linear-gradient(135deg,#0F766E,#059669)",color:"white",fontSize:10,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</div>
                    <p style={{fontSize:12,color:"#374151",margin:0,lineHeight:1.5}}>{p}</p>
                  </div>
                ))}
              </div>
            )}

            {aiInsights.common_mistake && (
              <div style={{background:"#FEF2F2",borderRadius:8,padding:"10px 12px",borderLeft:"3px solid #EF4444"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  <AlertTriangle size={12} color="#DC2626"/>
                  <p style={{fontSize:11,color:"#991B1B",fontWeight:500,margin:0}}>Most Common Mistake</p>
                </div>
                <p style={{fontSize:12,color:"#B91C1C",margin:0}}>{aiInsights.common_mistake}</p>
              </div>
            )}

            {aiInsights.builder_tip && (
              <div style={{background:"#EFF6FF",borderRadius:8,padding:"10px 12px",borderLeft:"3px solid #2563EB",marginTop:10}}>
                <p style={{fontSize:11,color:"#1E40AF",fontWeight:500,margin:"0 0 2px"}}>Tip for your builder / situation</p>
                <p style={{fontSize:12,color:"#1D4ED8",margin:0}}>{aiInsights.builder_tip}</p>
              </div>
            )}
          </div>
        )}

        <div style={{background:"#f9fafb",border:"0.5px solid #e5e7eb",borderRadius:12,padding:16,marginBottom:14}}>
          <p style={{fontSize:11,fontWeight:500,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".08em",margin:"0 0 6px"}}>Priority legend</p>
          <div style={{display:"flex",gap:12,marginBottom:14}}>
            {Object.entries(PRIORITY_COLORS).map(([k,c]) => (
              <div key={k} style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block"}}/>
                <span style={{fontSize:11,color:"#6b7280"}}>{k}</span>
              </div>
            ))}
          </div>
          <p style={{fontSize:11,fontWeight:500,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".08em",margin:"0 0 10px"}}>Your page-by-page website structure — click each section to expand</p>
          {structure?.sections?.map((section, i) => (
            <SectionCard
              key={i}
              section={section}
              insight={insights[String(section.order)]}
            />
          ))}
        </div>

        <div style={{borderRadius:10,padding:16,border:"1.5px dashed #6EE7B7",background:"#ECFDF5",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
            <Star size={18} color="#059669" style={{flexShrink:0,marginTop:2}}/>
            <div>
              <p style={{fontSize:13,fontWeight:600,color:"#065F46",margin:"0 0 4px"}}>Want the full marketing strategy for this website?</p>
              <p style={{fontSize:12,color:"#374151",margin:"0 0 10px"}}>The Business Blueprint tells you exactly what marketing channels to prioritize, what order to build in, and how to get traffic to this website. Get your 90-day roadmap for $19.99.</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                <Link to="/questionnaire">
                  <button style={{fontSize:12,background:"linear-gradient(135deg,#7C3AED,#2563EB)",color:"white",border:"none",borderRadius:8,padding:"8px 16px",cursor:"pointer",fontWeight:500}}>
                    Get the Business Blueprint — $19.99
                  </button>
                </Link>
                <Link to="/advertising">
                  <button style={{fontSize:12,background:"white",color:"#374151",border:"0.5px solid #e5e7eb",borderRadius:8,padding:"8px 16px",cursor:"pointer"}}>
                    Advertising Strategy — $14.99
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{background:"#f9fafb",border:"0.5px solid #e5e7eb",borderRadius:12,padding:14,textAlign:"center",marginBottom:16}}>
          <p style={{fontSize:12,fontWeight:500,color:"#0F766E",margin:"0 0 2px"}}>Build it right. Then fill it with traffic.</p>
          <p style={{fontSize:10,color:"#9ca3af",margin:0}}>Generated by Fire-Works Marketing Blueprint · A Colonna Media tool</p>
        </div>

        <div style={{textAlign:"center",paddingBottom:32,display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <Link to="/">
            <button style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:10,border:"1px solid #e5e7eb",background:"white",fontSize:13,fontWeight:500,color:"#374151",cursor:"pointer"}}>
              <LayoutGrid size={14}/> Back to Home
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
