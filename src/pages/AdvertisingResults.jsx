import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Target, CheckCircle, ChevronDown, ChevronUp, Zap, LayoutGrid } from "lucide-react";

function Section({ title, color, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{border:"0.5px solid #e5e7eb",borderRadius:12,overflow:"hidden",marginBottom:14}}>
      <button onClick={() => setOpen(o => !o)}
        style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 16px",background:"#f9fafb",border:"none",cursor:"pointer"}}>
        <h3 style={{fontSize:14,fontWeight:600,color,margin:0}}>{title}</h3>
        {open ? <ChevronUp size={16} color="#9ca3af"/> : <ChevronDown size={16} color="#9ca3af"/>}
      </button>
      {open && <div style={{padding:"14px 16px",background:"white"}}>{children}</div>}
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"8px 0",borderBottom:"0.5px solid #f3f4f6"}}>
      <span style={{fontSize:11,color:"#9ca3af",width:140,flexShrink:0,paddingTop:1}}>{label}</span>
      <span style={{fontSize:12,color:"#111827",flex:1,lineHeight:1.6}}>{value}</span>
    </div>
  );
}

function Tag({ text, color }) {
  return <span style={{fontSize:10,background:color+"20",color,padding:"2px 8px",borderRadius:4,marginRight:4,display:"inline-block",marginBottom:4}}>{text}</span>;
}

function Retarget({ step }) {
  const colors = ["#534AB7","#185FA5","#0F6E56"];
  const c = colors[(step.step - 1) % 3];
  return (
    <div style={{display:"flex",gap:12,marginBottom:10}}>
      <div style={{width:28,height:28,borderRadius:"50%",background:c,color:"white",fontSize:11,fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{step.step}</div>
      <div style={{flex:1,background:"#f9fafb",borderRadius:8,padding:"10px 12px",borderLeft:`3px solid ${c}`}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
          <span style={{fontSize:11,fontWeight:500,color:c}}>{step.trigger}</span>
          <span style={{fontSize:10,color:"#9ca3af"}}>{step.timing}</span>
        </div>
        <p style={{fontSize:12,color:"#374151",margin:"0 0 4px"}}><strong>Ad:</strong> {step.ad_type}</p>
        <p style={{fontSize:12,color:"#374151",margin:0}}><strong>Message:</strong> {step.message}</p>
      </div>
    </div>
  );
}

export default function AdvertisingResults() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const strategyId = params.get("strategyId");
    const success = params.get("success");
    if (strategyId && success === "true") {
      fetch(`/api/get-advertising-strategy?id=${strategyId}`)
        .then(r => r.json())
        .then(d => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    } else setLoading(false);
  }, []);

  if (loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:40,height:40,border:"3px solid #e5e7eb",borderTop:"3px solid #2563EB",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 12px"}}/>
        <p style={{color:"#6b7280",fontSize:14}}>Loading your strategy...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (!data) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{textAlign:"center"}}>
        <h2 style={{fontSize:22,fontWeight:600,color:"#111827",marginBottom:8}}>Strategy not found</h2>
        <p style={{color:"#6b7280",marginBottom:16}}>Check your email for your strategy guide.</p>
        <Link to="/" style={{color:"#2563EB",fontSize:14}}>Back to home</Link>
      </div>
    </div>
  );

  const s = typeof data.strategy === "string" ? JSON.parse(data.strategy) : data.strategy;

  return (
    <div style={{minHeight:"100vh",background:"white",fontFamily:"Arial,sans-serif"}}>
      <header style={{borderBottom:"1px solid #e5e7eb",padding:"16px 24px",display:"flex",alignItems:"center",gap:8}}>
        <Link to="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#2563EB,#4F46E5)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Target size={16} color="white"/>
          </div>
          <span style={{fontWeight:700,color:"#111827",fontSize:15}}>Advertising Strategy Guide</span>
        </Link>
      </header>

      <div style={{maxWidth:720,margin:"0 auto",padding:"24px 16px"}}>

        <div style={{background:"linear-gradient(135deg,#2563EB,#4F46E5)",borderRadius:12,padding:24,marginBottom:16,color:"white"}}>
          <p style={{fontSize:10,opacity:.7,textTransform:"uppercase",letterSpacing:".1em",margin:"0 0 4px"}}>Fire-Works Advertising Strategy Guide</p>
          <h2 style={{fontSize:20,fontWeight:600,margin:"0 0 2px"}}>{data.business_name}</h2>
          <p style={{fontSize:12,opacity:.7,margin:0}}>Personalized advertising roadmap · {data.monthly_budget} budget</p>
        </div>

        <div style={{background:"#ECFDF5",border:"1px solid #6EE7B7",borderRadius:12,padding:16,marginBottom:16,display:"flex",alignItems:"flex-start",gap:12}}>
          <CheckCircle size={20} color="#059669" style={{flexShrink:0,marginTop:1}}/>
          <div>
            <p style={{margin:0,fontWeight:500,color:"#065F46",fontSize:14}}>Payment confirmed — your ad strategy is ready</p>
            <p style={{margin:"4px 0 0",color:"#047857",fontSize:13}}>Check {data.email} for your full PDF. Your complete strategy is below.</p>
          </div>
        </div>

        {s?.platform_recommendation && (
          <Section title="Platform Recommendation" color="#2563EB">
            <div style={{marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <span style={{fontSize:11,fontWeight:500,color:"#9ca3af"}}>PRIMARY PLATFORM</span>
                <Tag text={s.platform_recommendation.primary} color="#2563EB"/>
              </div>
              <p style={{fontSize:13,color:"#374151",margin:"0 0 12px",lineHeight:1.6}}>{s.platform_recommendation.primary_reason}</p>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <span style={{fontSize:11,fontWeight:500,color:"#9ca3af"}}>SECONDARY PLATFORM</span>
                <Tag text={s.platform_recommendation.secondary} color="#7C3AED"/>
              </div>
              <p style={{fontSize:13,color:"#374151",margin:"0 0 12px",lineHeight:1.6}}>{s.platform_recommendation.secondary_reason}</p>
              {s.platform_recommendation.skip && (
                <div style={{background:"#FEF2F2",borderRadius:8,padding:"10px 12px",borderLeft:"3px solid #EF4444"}}>
                  <p style={{fontSize:12,color:"#991B1B",margin:0}}><strong>Skip:</strong> {s.platform_recommendation.skip}</p>
                </div>
              )}
            </div>
          </Section>
        )}

        {s?.google_strategy?.use && (
          <Section title="Google Ads Strategy" color="#059669">
            <Row label="Campaign Type" value={s.google_strategy.campaign_type}/>
            <Row label="Why This Type" value={s.google_strategy.campaign_type_reason}/>
            <Row label="Targeting" value={s.google_strategy.targeting}/>
            <Row label="Budget Allocation" value={s.google_strategy.budget_allocation}/>
            <Row label="Setup Priority" value={s.google_strategy.setup_priority}/>
            {s.google_strategy.example_keywords?.length > 0 && (
              <div style={{padding:"8px 0"}}>
                <p style={{fontSize:11,color:"#9ca3af",margin:"0 0 6px"}}>EXAMPLE KEYWORDS</p>
                <div>{s.google_strategy.example_keywords.map((k,i) => <Tag key={i} text={k} color="#059669"/>)}</div>
              </div>
            )}
            <div style={{marginTop:10,background:"#ECFDF5",borderRadius:8,padding:"10px 12px",borderLeft:"3px solid #059669"}}>
              <p style={{fontSize:11,color:"#065F46",fontWeight:500,margin:"0 0 2px"}}>Pro Tip</p>
              <p style={{fontSize:12,color:"#047857",margin:0}}>{s.google_strategy.pro_tip}</p>
            </div>
          </Section>
        )}

        {s?.meta_strategy?.use && (
          <Section title="Meta Ads Strategy (Facebook + Instagram)" color="#E53E3E">
            <Row label="Campaign Objective" value={s.meta_strategy.objective}/>
            <Row label="Why This Objective" value={s.meta_strategy.objective_reason}/>
            <Row label="Target Audience" value={s.meta_strategy.audience}/>
            <Row label="Creative Type" value={s.meta_strategy.creative_type}/>
            <Row label="Budget Allocation" value={s.meta_strategy.budget_allocation}/>
            <Row label="Setup Priority" value={s.meta_strategy.setup_priority}/>
            <div style={{marginTop:10,background:"#FEF2F2",borderRadius:8,padding:"10px 12px",borderLeft:"3px solid #E53E3E"}}>
              <p style={{fontSize:11,color:"#991B1B",fontWeight:500,margin:"0 0 2px"}}>Pro Tip</p>
              <p style={{fontSize:12,color:"#B91C1C",margin:0}}>{s.meta_strategy.pro_tip}</p>
            </div>
          </Section>
        )}

        {s?.retargeting_strategy && (
          <Section title="Retargeting Strategy" color="#7C3AED">
            <div style={{marginBottom:12}}>
              {s.retargeting_strategy.ready_to_retarget ? (
                <div style={{background:"#ECFDF5",borderRadius:8,padding:"10px 12px",marginBottom:12,borderLeft:"3px solid #059669"}}>
                  <p style={{fontSize:12,color:"#065F46",margin:0}}>✓ You are ready to set up retargeting. {s.retargeting_strategy.why}</p>
                </div>
              ) : (
                <div style={{background:"#FEF2F2",borderRadius:8,padding:"10px 12px",marginBottom:12,borderLeft:"3px solid #EF4444"}}>
                  <p style={{fontSize:12,color:"#991B1B",margin:0}}>⚠ Not yet ready for retargeting: {s.retargeting_strategy.why}</p>
                </div>
              )}
              <p style={{fontSize:12,fontWeight:500,color:"#374151",margin:"0 0 10px"}}>Your retargeting sequence:</p>
              {s.retargeting_strategy.sequence?.map((step, i) => <Retarget key={i} step={step}/>)}
              <div style={{background:"#F5F3FF",borderRadius:8,padding:"10px 12px",borderLeft:"3px solid #7C3AED",marginTop:10}}>
                <p style={{fontSize:11,color:"#5B21B6",fontWeight:500,margin:"0 0 2px"}}>Setup Instructions</p>
                <p style={{fontSize:12,color:"#6D28D9",margin:0}}>{s.retargeting_strategy.setup_instructions}</p>
              </div>
            </div>
          </Section>
        )}

        {s?.budget_plan && (
          <Section title="Budget Plan" color="#D97706">
            <Row label="Total Budget" value={s.budget_plan.total}/>
            {s.budget_plan.breakdown?.map((b,i) => (
              <Row key={i} label={b.platform} value={`${b.amount} — ${b.reason}`}/>
            ))}
            <Row label="Test Period" value={s.budget_plan.minimum_test_period}/>
            <div style={{marginTop:10,background:"#FFFBEB",borderRadius:8,padding:"10px 12px",borderLeft:"3px solid #D97706"}}>
              <p style={{fontSize:11,color:"#92400E",fontWeight:500,margin:"0 0 2px"}}>Realistic Expectation</p>
              <p style={{fontSize:12,color:"#B45309",margin:0}}>{s.budget_plan.expected_results}</p>
            </div>
          </Section>
        )}

        {s?.action_plan && (
          <Section title="Your Action Plan" color="#0F6E56">
            {s.action_plan.before_ads?.length > 0 && (
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <span style={{fontSize:11,fontWeight:600,color:"#EF4444",textTransform:"uppercase",letterSpacing:".06em"}}>Before you spend a dollar on ads</span>
                </div>
                {s.action_plan.before_ads.map((a,i) => (
                  <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
                    <span style={{color:"#EF4444",fontWeight:500,flexShrink:0}}>!</span>
                    <p style={{fontSize:12,color:"#374151",margin:0}}>{a}</p>
                  </div>
                ))}
              </div>
            )}
            {[
              {label:"Week 1–2", items:s.action_plan.week1_2, color:"#534AB7"},
              {label:"Week 3–4", items:s.action_plan.week3_4, color:"#185FA5"},
              {label:"Month 2+", items:s.action_plan.month2_plus, color:"#0F6E56"},
            ].map((ph,i) => ph.items?.length > 0 && (
              <div key={i} style={{marginBottom:12,borderLeft:`3px solid ${ph.color}`,paddingLeft:12}}>
                <p style={{fontSize:11,fontWeight:600,color:ph.color,margin:"0 0 6px",textTransform:"uppercase",letterSpacing:".06em"}}>{ph.label}</p>
                {ph.items.map((a,j) => (
                  <div key={j} style={{display:"flex",gap:8,marginBottom:5}}>
                    <span style={{color:ph.color,fontWeight:500,flexShrink:0}}>✓</span>
                    <p style={{fontSize:12,color:"#374151",margin:0}}>{a}</p>
                  </div>
                ))}
              </div>
            ))}
          </Section>
        )}

        {(s?.biggest_mistake || s?.competitor_strategy || s?.success_metrics) && (
          <Section title="Key Insights" color="#374151">
            {s.biggest_mistake && (
              <div style={{background:"#FEF2F2",borderRadius:8,padding:"10px 12px",borderLeft:"3px solid #EF4444",marginBottom:10}}>
                <p style={{fontSize:11,color:"#991B1B",fontWeight:500,margin:"0 0 2px"}}>The #1 Mistake Businesses Like Yours Make</p>
                <p style={{fontSize:12,color:"#B91C1C",margin:0}}>{s.biggest_mistake}</p>
              </div>
            )}
            {s.competitor_strategy && (
              <div style={{background:"#F5F3FF",borderRadius:8,padding:"10px 12px",borderLeft:"3px solid #7C3AED",marginBottom:10}}>
                <p style={{fontSize:11,color:"#5B21B6",fontWeight:500,margin:"0 0 2px"}}>Competitor Strategy</p>
                <p style={{fontSize:12,color:"#6D28D9",margin:0}}>{s.competitor_strategy}</p>
              </div>
            )}
            {s.success_metrics?.length > 0 && (
              <div>
                <p style={{fontSize:11,color:"#9ca3af",fontWeight:500,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:".06em"}}>Track These Metrics</p>
                {s.success_metrics.map((m,i) => (
                  <div key={i} style={{display:"flex",gap:8,marginBottom:5}}>
                    <span style={{color:"#059669",fontWeight:500,flexShrink:0}}>→</span>
                    <p style={{fontSize:12,color:"#374151",margin:0}}>{m}</p>
                  </div>
                ))}
              </div>
            )}
          </Section>
        )}

        <div style={{borderRadius:10,padding:16,border:"1.5px dashed #93C5FD",background:"#EFF6FF",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
            <Zap size={18} color="#2563EB" style={{flexShrink:0,marginTop:2}}/>
            <div>
              <p style={{fontSize:13,fontWeight:600,color:"#1E40AF",margin:"0 0 4px"}}>Ready to build your actual ad campaigns?</p>
              <p style={{fontSize:12,color:"#374151",margin:"0 0 10px"}}>The Fire-Works AI Campaign Builder generates your complete Google Ads or Meta Ads campaign — 15 headlines, descriptions, keywords, audience targeting, hooks, and creative direction. No agency needed.</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
                <span style={{fontSize:10,background:"white",border:"0.5px solid #e5e7eb",borderRadius:4,padding:"2px 8px"}}>Google Ads — $9.99</span>
                <span style={{fontSize:10,background:"white",border:"0.5px solid #e5e7eb",borderRadius:4,padding:"2px 8px"}}>Meta Ads — $9.99</span>
                <span style={{fontSize:10,background:"white",border:"0.5px solid #e5e7eb",borderRadius:4,padding:"2px 8px"}}>Google + Meta — $16.99</span>
              </div>
              <a href="https://www.fireworks-campaignbuilder.com" target="_blank" rel="noreferrer" style={{fontSize:11,color:"#2563EB",fontWeight:500}}>
                Visit fireworks-campaignbuilder.com → Build your campaigns in minutes
              </a>
            </div>
          </div>
        </div>

        <div style={{background:"#f9fafb",border:"0.5px solid #e5e7eb",borderRadius:12,padding:14,textAlign:"center",marginBottom:16}}>
          <p style={{fontSize:12,fontWeight:500,color:"#2563EB",margin:"0 0 2px"}}>Know your platform · Set your budget · Retarget strategically</p>
          <p style={{fontSize:10,color:"#9ca3af",margin:0}}>Generated by Fire-Works Marketing Blueprint · A Colonna Media tool</p>
        </div>

        <div style={{textAlign:"center",paddingBottom:32,display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <Link to="/">
            <button style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:10,border:"1px solid #e5e7eb",background:"white",fontSize:13,fontWeight:500,color:"#374151",cursor:"pointer"}}>
              <LayoutGrid size={14}/> Back to Home
            </button>
          </Link>
          <Link to="/questionnaire">
            <button style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 20px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#7C3AED,#2563EB)",fontSize:13,fontWeight:500,color:"white",cursor:"pointer"}}>
              Get the Marketing Blueprint
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
