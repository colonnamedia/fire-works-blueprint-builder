import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, CheckCircle, ChevronDown, ChevronUp, Zap } from "lucide-react";

function PriorityItem({ p, index }) {
  const [open, setOpen] = useState(false);
  const nc = ["#534AB7","#534AB7","#185FA5","#185FA5","#185FA5","#0F6E56","#0F6E56","#0F6E56"];
  const nb = ["#EEEDFE","#EEEDFE","#E6F1FB","#E6F1FB","#E6F1FB","#E1F5EE","#E1F5EE","#E1F5EE"];
  const bgs = {"Do first":"background:#EEEDFE;color:#3C3489","Week 2":"background:#E6F1FB;color:#185FA5","Month 1":"background:#E6F1FB;color:#185FA5","Month 2":"background:#E1F5EE;color:#085041","Month 3":"background:#E1F5EE;color:#085041"};
  const i = index;
  return (
    <div style={{border:"0.5px solid #e5e7eb",borderRadius:8,marginBottom:6,overflow:"hidden"}}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",background:"#f9fafb",border:"none",textAlign:"left"}}
      >
        <span style={{width:22,height:22,borderRadius:"50%",background:nc[i],color:nb[i],fontSize:10,fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.number}</span>
        <span style={{fontSize:13,fontWeight:500,color:"#111827",flex:1}}>{p.title}</span>
        <span style={{fontSize:10,padding:"2px 7px",borderRadius:4,whiteSpace:"nowrap",...Object.fromEntries((bgs[p.timing]||"").split(";").filter(Boolean).map(s=>s.split(":").map(x=>x.trim())).filter(x=>x.length===2).map(([k,v])=>[k.replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v]))}}>{p.timing}</span>
        {open ? <ChevronUp size={14} color="#9ca3af" /> : <ChevronDown size={14} color="#9ca3af" />}
      </button>
      {open && (
        <div style={{padding:"11px 14px 11px 46px",background:"white",borderTop:"0.5px solid #e5e7eb",fontSize:12,color:"#6b7280",lineHeight:1.7}}>
          {p.detail}
        </div>
      )}
    </div>
  );
}

function PhaseCard({ phase, color, badge, badgeText }) {
  return (
    <div style={{borderRadius:8,padding:"14px 16px",marginBottom:10,borderLeft:`3px solid ${color}`,background:"#f9fafb"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
        <p style={{fontSize:13,fontWeight:500,color:"#111827",margin:0}}>{phase.title}</p>
        <span style={{fontSize:10,background:badge,color:badgeText,padding:"2px 8px",borderRadius:4}}>{phase.time}</span>
      </div>
      <p style={{fontSize:12,color:"#6b7280",margin:"0 0 10px"}}>{phase.focus}</p>
      {phase.seo_note && (
        <div style={{marginBottom:10,background:"#EFF6FF",borderRadius:6,padding:"10px 12px",borderLeft:"3px solid #185FA5"}}>
          <p style={{fontSize:11,color:"#1E40AF",fontWeight:500,margin:"0 0 3px"}}>SEO note for your web designer</p>
          <p style={{fontSize:11,color:"#185FA5",margin:0}}>{phase.seo_note}</p>
        </div>
      )}
      <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:5}}>
        {phase.actions?.map((a, i) => (
          <li key={i} style={{fontSize:12,color:"#111827",display:"flex",gap:8}}>
            <span style={{color,fontWeight:500,flexShrink:0}}>✓</span>{a}
          </li>
        ))}
      </ul>
      {phase.blog_note && (
        <div style={{marginTop:10,background:"#ECFDF5",borderRadius:6,padding:"10px 12px",borderLeft:"3px solid #0F6E56"}}>
          <p style={{fontSize:11,color:"#065F46",fontWeight:500,margin:"0 0 3px"}}>Blog / content strategy</p>
          <p style={{fontSize:11,color:"#0F6E56",margin:0}}>{phase.blog_note}</p>
        </div>
      )}
    </div>
  );
}

function HubDiagram({ channels }) {
  const positions = [[110,50],[320,20],[530,50],[590,140],[530,240],[320,260],[110,240],[50,140]];
  const rects = [[-14,26],[246,0],[446,26],[506,114],[446,216],[246,236],[-14,216],[-24,114]];
  const colors = ["#E6F1FB","#E1F5EE","#FAEEDA","#E6F1FB","#FBEAF0","#EEEDFE","#EAF3DE","#F1EFE8"];
  return (
    <svg width="100%" viewBox="0 0 640 290" role="img">
      <title>Marketing hub diagram</title>
      <desc>Website at center with marketing channels radiating out</desc>
      <defs>
        <marker id="arrR" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </marker>
      </defs>
      {positions.map(([x,y],i) => (
        <line key={i} x1="320" y1="145" x2={x} y2={y} stroke="#B4B2A9" strokeWidth="1" markerEnd="url(#arrR)"/>
      ))}
      <circle cx="320" cy="145" r="44" fill="#534AB7"/>
      <text x="320" y="139" textAnchor="middle" fill="#EEEDFE" fontSize="11" fontWeight="500" fontFamily="Arial,sans-serif">Website /</text>
      <text x="320" y="153" textAnchor="middle" fill="#EEEDFE" fontSize="11" fontWeight="500" fontFamily="Arial,sans-serif">Storefront</text>
      {rects.map(([rx,ry],i) => (
        <g key={i}>
          <rect x={rx} y={ry} width="148" height="40" rx="6" fill={colors[i % colors.length]} stroke="#B4B2A9" strokeWidth="0.5"/>
          <text x={rx+74} y={ry+21} textAnchor="middle" fill="#2C2C2A" fontSize="10" fontWeight="500" fontFamily="Arial,sans-serif">
            {channels[i] || ''}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Results() {
  const [blueprint, setBlueprint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const blueprintId = params.get("blueprintId");
    const success = params.get("success");
    const emailParam = params.get("email");
    if (emailParam) setEmail(emailParam);

    if (blueprintId && success === "true") {
      fetch(`/api/get-blueprint?id=${blueprintId}`)
        .then(r => r.json())
        .then(data => {
          setBlueprint(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div style={{minHeight:"100vh",background:"white",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{textAlign:"center"}}>
          <div style={{width:40,height:40,border:"3px solid #e5e7eb",borderTop:"3px solid #7C3AED",borderRadius:"50%",animation:"spin 1s linear infinite",margin:"0 auto 12px"}}/>
          <p style={{color:"#6b7280",fontSize:14}}>Loading your blueprint...</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  if (!blueprint) {
    return (
      <div style={{minHeight:"100vh",background:"white",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <div style={{textAlign:"center"}}>
          <h2 style={{fontSize:22,fontWeight:500,color:"#111827",marginBottom:8}}>Blueprint not found</h2>
          <p style={{color:"#6b7280",marginBottom:16}}>Check your email for your blueprint results.</p>
          <Link to="/" style={{color:"#7C3AED",fontSize:14}}>Back to home</Link>
        </div>
      </div>
    );
  }

  const roadmap = typeof blueprint.roadmap === "string" ? JSON.parse(blueprint.roadmap) : blueprint.roadmap;

  return (
    <div style={{minHeight:"100vh",background:"white",fontFamily:"Arial,sans-serif"}}>
      <header style={{borderBottom:"1px solid #e5e7eb",padding:"16px 24px",display:"flex",alignItems:"center",gap:8}}>
        <Link to="/" style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
          <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#7C3AED,#2563EB)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <LayoutGrid size={16} color="white"/>
          </div>
          <span style={{fontWeight:700,color:"#111827",fontSize:15}}>Blueprint Builder</span>
        </Link>
      </header>

      <div style={{maxWidth:720,margin:"0 auto",padding:"24px 16px"}}>

        <div style={{background:"linear-gradient(135deg,#534AB7,#185FA5)",borderRadius:12,padding:24,marginBottom:16,color:"white"}}>
          <p style={{fontSize:10,opacity:.7,textTransform:"uppercase",letterSpacing:".1em",margin:"0 0 4px"}}>Fire-Works Marketing Blueprint</p>
          <h2 style={{fontSize:22,fontWeight:500,margin:"0 0 4px"}}>{blueprint.business_name}</h2>
          <p style={{fontSize:12,opacity:.7,margin:0}}>{blueprint.industry || "Business"} · 90-day marketing roadmap</p>
        </div>

        <div style={{background:"#ECFDF5",border:"1px solid #6EE7B7",borderRadius:12,padding:16,marginBottom:16,display:"flex",alignItems:"flex-start",gap:12}}>
          <CheckCircle size={20} color="#059669" style={{flexShrink:0,marginTop:1}}/>
          <div>
            <p style={{margin:0,fontWeight:500,color:"#065F46",fontSize:14}}>Payment confirmed — your blueprint is ready</p>
            <p style={{margin:"4px 0 0",color:"#047857",fontSize:13}}>Check your email for the full PDF report. Your complete 90-day roadmap is below.</p>
          </div>
        </div>

        {roadmap?.hub_channels && (
          <div style={{background:"#f9fafb",border:"0.5px solid #e5e7eb",borderRadius:12,padding:16,marginBottom:14}}>
            <p style={{fontSize:11,fontWeight:500,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".08em",margin:"0 0 10px"}}>Your marketing home base</p>
            <HubDiagram channels={roadmap.hub_channels}/>
          </div>
        )}

        {roadmap?.priorities && (
          <div style={{background:"#f9fafb",border:"0.5px solid #e5e7eb",borderRadius:12,padding:16,marginBottom:14}}>
            <p style={{fontSize:11,fontWeight:500,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".08em",margin:"0 0 12px"}}>Priority order — click each to expand</p>
            {roadmap.priorities.map((p, i) => (
              <PriorityItem key={i} p={p} index={i}/>
            ))}
          </div>
        )}

        {roadmap?.phase1 && (
          <div style={{background:"#f9fafb",border:"0.5px solid #e5e7eb",borderRadius:12,padding:16,marginBottom:14}}>
            <p style={{fontSize:11,fontWeight:500,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".08em",margin:"0 0 12px"}}>Your 90-day action plan — phase view</p>
            <PhaseCard phase={roadmap.phase1} color="#534AB7" badge="#EEEDFE" badgeText="#3C3489"/>
            <PhaseCard phase={roadmap.phase2} color="#185FA5" badge="#E6F1FB" badgeText="#0C447C"/>
            <PhaseCard phase={roadmap.phase3} color="#0F6E56" badge="#E1F5EE" badgeText="#085041"/>
          </div>
        )}

        {roadmap?.weeks && (
          <div style={{background:"#f9fafb",border:"0.5px solid #e5e7eb",borderRadius:12,padding:16,marginBottom:14}}>
            <p style={{fontSize:11,fontWeight:500,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".08em",margin:"0 0 12px"}}>Your 90-day roadmap — week by week</p>
            <div style={{position:"relative",marginBottom:14}}>
              <div style={{position:"absolute",top:17,left:0,right:0,height:2,background:"linear-gradient(to right,#534AB7,#185FA5,#0F6E56)",borderRadius:2,zIndex:0}}/>
              <div style={{display:"flex",gap:4,position:"relative",zIndex:1}}>
                {roadmap.weeks.map((w, i) => {
                  const wc = i < 2 ? "#534AB7" : i < 4 ? "#185FA5" : "#0F6E56";
                  return (
                    <div key={i} style={{flex:1,textAlign:"center"}}>
                      <div style={{width:34,height:34,borderRadius:"50%",background:wc,color:"white",fontSize:12,fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 6px"}}>{i+1}</div>
                      <p style={{fontSize:9,fontWeight:500,color:wc,margin:"0 0 2px"}}>{w.label}</p>
                      <div style={{fontSize:9,color:"#9ca3af",lineHeight:1.7}} dangerouslySetInnerHTML={{__html:(w.items||"").replace(/\n/g,"<br/>")}}/>
                    </div>
                  );
                })}
              </div>
            </div>
            {roadmap?.hcols && (
              <div style={{display:"flex",gap:4}}>
                {roadmap.hcols.map((h, i) => {
                  const hc = i === 0 ? "#534AB7" : i === 1 ? "#185FA5" : "#0F6E56";
                  return (
                    <div key={i} style={{flex:1,background:"white",border:"0.5px solid #e5e7eb",borderTop:`3px solid ${hc}`,borderRadius:8,padding:"10px 8px",textAlign:"center",minWidth:0}}>
                      <p style={{fontSize:10,fontWeight:500,color:hc,margin:"0 0 4px"}}>{h.label}</p>
                      <p style={{fontSize:9,color:"#9ca3af",lineHeight:1.7,margin:0}} dangerouslySetInnerHTML={{__html:(h.items||"").replace(/\n/g,"<br/>")}}/>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div style={{background:"#f9fafb",border:"0.5px solid #e5e7eb",borderRadius:12,padding:16,marginBottom:14}}>
          <p style={{fontSize:11,fontWeight:500,color:"#9ca3af",textTransform:"uppercase",letterSpacing:".08em",margin:"0 0 12px"}}>Understanding your advertising options</p>
          <p style={{fontSize:12,color:"#6b7280",margin:"0 0 12px"}}>Not all advertising works the same way. Here's how to think about which channels match your goals.</p>

          <div style={{borderRadius:8,padding:"14px 16px",border:"0.5px solid #e5e7eb",marginBottom:10,borderLeft:"3px solid #185FA5",background:"white"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:15}}>🔍</span>
              <p style={{fontSize:13,fontWeight:500,color:"#111827",margin:0}}>Google Ads — capture people actively searching</p>
            </div>
            <p style={{fontSize:12,color:"#6b7280",margin:"0 0 8px"}}>Google puts your business in front of people who are <em>already looking</em> for what you offer. High-intent traffic — they've already decided they need the service and are just choosing who to call or buy from.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              <div style={{background:"#EFF6FF",borderRadius:6,padding:"8px 10px"}}><p style={{fontSize:10,fontWeight:500,color:"#1E40AF",margin:"0 0 2px"}}>Best for</p><p style={{fontSize:10,color:"#185FA5",margin:0}}>Local services, emergency services, high-intent purchases, B2B</p></div>
              <div style={{background:"#FDF2F8",borderRadius:6,padding:"8px 10px"}}><p style={{fontSize:10,fontWeight:500,color:"#701A75",margin:"0 0 2px"}}>Not ideal for</p><p style={{fontSize:10,color:"#9D174D",margin:0}}>New product categories, impulse buys, brand awareness alone</p></div>
            </div>
          </div>

          <div style={{borderRadius:8,padding:"14px 16px",border:"0.5px solid #e5e7eb",marginBottom:10,borderLeft:"3px solid #E53E3E",background:"white"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:15}}>📱</span>
              <p style={{fontSize:13,fontWeight:500,color:"#111827",margin:0}}>Meta Ads — put your product in front of the right people</p>
            </div>
            <p style={{fontSize:12,color:"#6b7280",margin:"0 0 8px"}}>Meta (Facebook + Instagram) shows your ad to people who match your ideal customer profile — even if they weren't searching for you. You're interrupting their scroll, so your creative needs to stop them and make them care.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              <div style={{background:"#FDF2F8",borderRadius:6,padding:"8px 10px"}}><p style={{fontSize:10,fontWeight:500,color:"#701A75",margin:"0 0 2px"}}>Best for</p><p style={{fontSize:10,color:"#9D174D",margin:0}}>E-commerce, restaurants, events, retargeting, brand building</p></div>
              <div style={{background:"#EFF6FF",borderRadius:6,padding:"8px 10px"}}><p style={{fontSize:10,fontWeight:500,color:"#1E40AF",margin:"0 0 2px"}}>Not ideal for</p><p style={{fontSize:10,color:"#185FA5",margin:0}}>Niche B2B, emergency services, anything needing immediate intent</p></div>
            </div>
          </div>

          <div style={{borderRadius:8,padding:"14px 16px",border:"0.5px solid #e5e7eb",marginBottom:12,borderLeft:"3px solid #0F6E56",background:"white"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:15}}>🔄</span>
              <p style={{fontSize:13,fontWeight:500,color:"#111827",margin:0}}>Retargeting — follow up with people who showed interest</p>
            </div>
            <p style={{fontSize:12,color:"#6b7280",margin:"0 0 8px"}}>Someone visited your website but didn't contact you or buy. Retargeting shows them your ad again. These are your warmest leads — they convert at 3-5x the rate of cold audiences. Always set up retargeting before spending on cold traffic.</p>
            <div style={{background:"#ECFDF5",borderRadius:6,padding:"8px 10px"}}><p style={{fontSize:10,fontWeight:500,color:"#065F46",margin:"0 0 2px"}}>How to start</p><p style={{fontSize:10,color:"#0F6E56",margin:0}}>Install the Meta Pixel and Google Tag on your website. Once you have 500+ monthly visitors, create retargeting audiences targeting the last 30-60 days.</p></div>
          </div>

          <div style={{borderRadius:10,padding:16,border:"1.5px dashed #93C5FD",background:"#EFF6FF"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
              <Zap size={18} color="#2563EB" style={{flexShrink:0,marginTop:2}}/>
              <div>
                <p style={{fontSize:13,fontWeight:500,color:"#1E40AF",margin:"0 0 4px"}}>Ready to build your actual ad campaigns?</p>
                <p style={{fontSize:12,color:"#374151",margin:"0 0 10px"}}>The Fire-Works AI Campaign Builder generates your complete Google Ads or Meta Ads campaign — headlines, descriptions, keywords, audience targeting, hooks, and creative direction — all tailored to your specific business. No agency needed.</p>
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
        </div>

        <div style={{background:"#f9fafb",border:"0.5px solid #e5e7eb",borderRadius:12,padding:14,textAlign:"center",marginBottom:16}}>
          <p style={{fontSize:12,fontWeight:500,color:"#534AB7",margin:"0 0 2px"}}>Traffic → Conversion → Follow-Up → Sales</p>
          <p style={{fontSize:10,color:"#9ca3af",margin:0}}>Generated by Fire-Works Blueprint Builder · A Colonna Media tool · fireworks-businessblueprint.com</p>
        </div>

        <div style={{textAlign:"center",paddingBottom:32}}>
          <Link to="/get-started">
            <button style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 24px",borderRadius:10,border:"1px solid #e5e7eb",background:"white",fontSize:13,fontWeight:500,color:"#374151",cursor:"pointer"}}>
              <LayoutGrid size={14}/> Build Another Blueprint
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
