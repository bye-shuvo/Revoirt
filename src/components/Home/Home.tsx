import { useState, useEffect } from "react";

const C = {
  bg:       "#14121A",
  bgCode:   "#16171D",
  bgSurface:"#1A1820",
  surf2:    "#3B3440",
  border:   "#3B3440",
  borderMid:"#2E2E32",
  primary:  "#867E8E",
  violet:   "#B39AFF",
  text:     "#FFFFFF",
  textSec:  "#98989F",
  textTer:  "#2E2E32",
  green:    "#22c55e",
  blue:     "#38bdf8",
  yellow:   "#EAB308",
  red:      "#ef4444",
};

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;800&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth;width:100%}
  body{font-family:'Inter',sans-serif!important;background:${C.bg};width:100%;overflow-x:hidden}
  ::-webkit-scrollbar{width:3px;background:${C.bg}}
  ::-webkit-scrollbar-thumb{background:${C.surf2}}
  @keyframes rv-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
  @keyframes rv-slide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
  @keyframes rv-up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
  @keyframes rv-dot{0%,100%{opacity:.3}50%{opacity:1}}
  @keyframes rv-glow{0%,100%{opacity:.07}50%{opacity:.16}}
  .rv-blink{animation:rv-blink 1.1s step-end infinite}
  .rv-slide{animation:rv-slide .4s ease both}
  .rv-up{animation:rv-up .55s ease both}
  .rv-dot{animation:rv-dot 2s ease-in-out infinite}
  .rv-glow{animation:rv-glow 3s ease-in-out infinite}
  .nav-link{color:${C.textSec};text-decoration:none;font-size:13px;letter-spacing:.04em;padding:6px 4px;border-bottom:2px solid transparent;transition:color .15s,border-color .15s;font-family:'Inter',sans-serif}
  .nav-link:hover{color:${C.violet};border-bottom-color:${C.primary}}
  .btn-primary{background:${C.primary};color:#fff;border:2px solid ${C.violet};border-radius:0;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:.1em;padding:12px 28px;cursor:pointer;transition:background .15s,border-color .15s}
  .btn-primary:hover{background:${C.violet};border-color:${C.primary}}
  .btn-primary:focus{outline:2px solid ${C.violet};outline-offset:2px}
  .btn-secondary{background:transparent;color:${C.textSec};border:1px solid ${C.surf2};border-radius:0;font-family:'Inter',sans-serif;font-size:12px;letter-spacing:.1em;padding:12px 28px;cursor:pointer;transition:border-color .15s,color .15s}
  .btn-secondary:hover{border-color:${C.text};color:${C.violet}}
  .btn-ghost{background:transparent;color:${C.text};border:none;font-family:'Inter',sans-serif;font-size:13px;padding:8px 12px;cursor:pointer;transition:color .15s,background .15s;border-radius:0}
  .btn-ghost:hover{color:${C.violet};background:rgba(179,154,255,.08)}
  .card-hover{transition:border-color .2s,box-shadow .2s}
  .card-hover:hover{border-color:${C.primary}!important;box-shadow:0 20px 25px -5px rgba(179,154,255,.15)!important}
  .feature-card{transition:border-color .2s,background .15s}
  .feature-card:hover{background:${C.bgSurface}!important}
  .file-row:hover{color:${C.textSec}!important;background:rgba(179,154,255,.04)!important}
  .collab-row:hover{background:rgba(179,154,255,.04)!important}
  .foot-link{font-size:9px;color:${C.textTer};text-decoration:none;letter-spacing:.12em;font-family:'JetBrains Mono',monospace;transition:color .15s}
  .foot-link:hover{color:${C.textSec}}
`;

const WRAP: React.CSSProperties = {
  width:"100%",
  maxWidth:1280,
  margin:"0 auto",
  padding:"0 48px",
};

const NAV  = ["Features","Docs","Changelog","GitHub"];

const LOG_LINES = [
  { ms:"000", tag:"SYS",  col:C.textSec, msg:"revoirt v0.9.1 initializing..." },
  { ms:"012", tag:"IDB",  col:C.green,   msg:"IndexedDB mount OK  ·  17.5 KB" },
  { ms:"045", tag:"WS",   col:C.blue,    msg:"WebSocket handshake  ·  room/alpha-squad" },
  { ms:"048", tag:"CRDT", col:C.violet,  msg:"Yjs doc loaded  ·  3 peers connected" },
  { ms:"071", tag:"TERM", col:C.yellow,  msg:"xterm.js session spawned  ·  shared i/o" },
  { ms:"089", tag:"FS",   col:C.green,   msg:"File tree hydrated  ·  8 entries" },
  { ms:"093", tag:"MON",  col:C.violet,  msg:"Monaco language server ready  ·  TypeScript" },
  { ms:"101", tag:"SYNC", col:C.blue,    msg:"Initial sync complete  ·  <50 ms" },
  { ms:"___", tag:"READY",col:C.green,   msg:"Session live" },
];

const CODE = [
  [{c:"#B39AFF",t:"import "},{c:C.text,t:"{ revoirt } "},{c:"#B39AFF",t:"from "},{c:C.green,t:"'@revoirt/core'"}],
  [],
  [{c:C.textSec,t:"// connect to a collaborative session"}],
  [{c:"#B39AFF",t:"const "},{c:C.blue,t:"session"},{c:C.text,t:" = "},{c:"#B39AFF",t:"await "},{c:C.text,t:"revoirt."},{c:C.blue,t:"connect"},{c:C.text,t:"({"}],
  [{c:C.red,t:"  room"},{c:C.text,t:": "},{c:C.green,t:"'alpha-squad'"},{c:C.text,t:","}],
  [{c:C.red,t:"  collab"},{c:C.text,t:": "},{c:C.yellow,t:"true"},{c:C.text,t:","}],
  [{c:C.red,t:"  terminal"},{c:C.text,t:": "},{c:C.yellow,t:"true"},{c:C.text,t:","}],
  [{c:C.red,t:"  storage"},{c:C.text,t:": "},{c:C.green,t:"'idb'"}],
  [{c:C.text,t:"})"}],
  [],
  [{c:C.textSec,t:"// real-time presence"}],
  [{c:C.text,t:"session."},{c:C.blue,t:"onJoin"},{c:C.text,t:"(("},{c:C.red,t:"u"},{c:C.text,t:") => console."},{c:C.blue,t:"log"},{c:C.text,t:"(u."},{c:C.red,t:"name"},{c:C.text,t:")"}],
];

const CURSORS = [
  { i:"AK", name:"Arjun", color:C.violet, line:4 },
  { i:"SR", name:"Sara",  color:C.blue,   line:7 },
  { i:"JK", name:"Jake",  color:C.green,  line:11 },
];

const FILES = [
  { icon:"▾", n:"src",           d:0, dir:true },
  { icon:"·", n:"editor.ts",    d:1, active:true },
  { icon:"·", n:"session.ts",   d:1 },
  { icon:"·", n:"terminal.ts",  d:1 },
  { icon:"·", n:"idb.ts",       d:1 },
  { icon:"·", n:"types.ts",     d:1 },
  { icon:"·", n:".env",         d:0 },
  { icon:"·", n:"package.json", d:0 },
];

const FEATURES = [
  { id:"F1", accent:C.violet, tag:"monaco · yjs · ws",               span:2, title:"Collaborative Editor", body:"Monaco-powered, real-time CRDT sync. Named cursors, shared selections, conflict-free replicated edits across every connected session." },
  { id:"F2", accent:C.blue,   tag:"xterm.js · shared i/o",           span:1, title:"Web Terminal",         body:"xterm.js shell — every keystroke shared. Run commands, see output together. No SSH. No setup." },
  { id:"F3", accent:C.green,  tag:"idb · sessionstorage",            span:1, title:"Local File Explorer",  body:"Entire filesystem in IndexedDB + sessionStorage. No uploads. Your files never leave the browser." },
  { id:"F4", accent:C.yellow, tag:"rooms · rbac",                    span:1, title:"User Groups & Rooms",  body:"Invite by link, assign roles, restrict writes. Private and public sessions with granular permissions." },
  { id:"F5", accent:C.red,    tag:"<50ms · crdt v2 · offline-first", span:2, title:"Zero-Latency Sync",   body:"Sub-50ms WebSocket sync with CRDT. No merge conflicts. Offline-first with auto-reconcile on reconnect." },
];

const STEPS = [
  { n:"01", title:"Create a Room",    body:"Name it, pick access mode, grab the invite link. Done in 10 seconds." },
  { n:"02", title:"Invite Your Team", body:"Share the link. Everyone lands in the same editor with live cursors." },
  { n:"03", title:"Ship Together",    body:"Edit, run the terminal, manage files — zero config, zero latency." },
];

const MONO = "'JetBrains Mono',monospace";
const SANS = "'Inter',-apple-system,sans-serif";

export default function Home() {
  const [typed,      setTyped]      = useState("");
  const [curOn,      setCurOn]      = useState(true);
  const [activeCur,  setActiveCur]  = useState(0);
  const [logVisible, setLogVisible] = useState<number[]>([]);
  const TAGLINE = "Code together. Ship faster.";

  useEffect(() => {
    if (!document.getElementById("rv-s")) {
      const s = document.createElement("style");
      s.id = "rv-s"; s.textContent = STYLES;
      document.head.appendChild(s);
    }
    let i = 0;
    const tw = setInterval(() => { i++; setTyped(TAGLINE.slice(0,i)); if(i>=TAGLINE.length) clearInterval(tw); }, 52);
    const bl = setInterval(() => setCurOn(v=>!v), 530);
    const cc = setInterval(() => setActiveCur(v=>(v+1)%CURSORS.length), 2000);
    let l = 0;
    const lg = setInterval(() => { setLogVisible(v=>[...v,l]); l++; if(l>=LOG_LINES.length) clearInterval(lg); }, 190);
    return () => { clearInterval(tw); clearInterval(bl); clearInterval(cc); clearInterval(lg); };
  }, []);

  return (
    <div style={{minHeight:"100vh",width:"100%",overflowX:"hidden",background:C.bg,color:C.text,fontFamily:SANS}}>

      {/* ── NAV ── */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:50,
        height:56,display:"flex",alignItems:"center",
        background:"rgba(20,18,26,.97)",backdropFilter:"blur(12px)",
        borderBottom:`1px solid ${C.border}`,
      }}>
        <div style={{...WRAP,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <rect x="0" y="0" width="7" height="7" stroke={C.violet} strokeWidth="1.2" fill="none"/>
              <rect x="11" y="11" width="7" height="7" stroke={C.blue} strokeWidth="1.2" fill="none"/>
              <line x1="7" y1="3.5" x2="14.5" y2="3.5" stroke={C.violet} strokeWidth="1"/>
              <line x1="14.5" y1="3.5" x2="14.5" y2="11" stroke={C.violet} strokeWidth="1"/>
              <line x1="3.5" y1="7" x2="3.5" y2="14.5" stroke={C.blue} strokeWidth="1"/>
              <line x1="3.5" y1="14.5" x2="11" y2="14.5" stroke={C.blue} strokeWidth="1"/>
            </svg>
            <span style={{color:C.violet,fontWeight:800,fontSize:13,letterSpacing:".18em",fontFamily:SANS}}>REVOIRT</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:24}}>
            {NAV.map(l => <a key={l} href="#" className="nav-link">{l}</a>)}
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button className="btn-ghost">Sign In</button>
            <button className="btn-primary" style={{padding:"9px 20px"}}>GET STARTED</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{position:"relative",minHeight:"100vh",paddingTop:56,overflow:"hidden",display:"flex",alignItems:"center",width:"100%"}}>

        {/* dot grid */}
        <div style={{position:"absolute",inset:0,pointerEvents:"none",opacity:.018,
          backgroundImage:`radial-gradient(${C.text} 1px,transparent 1px)`,backgroundSize:"32px 32px"}}/>

        {/* center glow */}
        <div className="rv-glow" style={{position:"absolute",pointerEvents:"none",
          width:700,height:280,left:"50%",top:"45%",transform:"translate(-50%,-50%)",
          background:"radial-gradient(ellipse,rgba(179,154,255,.28) 0%,transparent 70%)",filter:"blur(50px)"}}/>

        {/* TL circuit */}
        <div style={{position:"absolute",pointerEvents:"none",top:"14%",left:0,width:"15vw",height:1,background:"rgba(179,154,255,.18)"}}>
          <div style={{position:"absolute",right:0,top:0,width:1,height:"28vh",background:"rgba(179,154,255,.18)"}}>
            <div style={{position:"absolute",bottom:0,left:0,width:"11vw",height:1,background:"rgba(179,154,255,.18)"}}/>
            <div style={{position:"absolute",top:-3,left:-3,width:6,height:6,background:C.violet,opacity:.6}}/>
          </div>
          <div style={{position:"absolute",left:0,top:-3,width:6,height:6,background:C.violet,opacity:.3}}/>
        </div>
        {/* TR */}
        <div style={{position:"absolute",pointerEvents:"none",top:0,right:"22%",width:1,height:"10vh",background:"rgba(56,189,248,.12)"}}>
          <div style={{position:"absolute",top:0,left:0,width:"18vw",height:1,background:"rgba(56,189,248,.12)"}}>
            <div style={{position:"absolute",top:0,right:0,width:1,height:"13vh",background:"rgba(56,189,248,.12)"}}/>
          </div>
        </div>
        {/* BR */}
        <div style={{position:"absolute",pointerEvents:"none",bottom:"12%",right:0,width:"16vw",height:1,background:"rgba(56,189,248,.1)"}}>
          <div style={{position:"absolute",left:0,bottom:0,width:1,height:"22vh",background:"rgba(56,189,248,.1)"}}>
            <div style={{position:"absolute",top:0,right:0,width:"10vw",height:1,background:"rgba(56,189,248,.1)"}}/>
          </div>
        </div>
        {/* BL */}
        <div style={{position:"absolute",pointerEvents:"none",bottom:0,left:"20%",width:1,height:"10vh",background:"rgba(34,197,94,.08)"}}>
          <div style={{position:"absolute",bottom:0,left:0,width:"18vw",height:1,background:"rgba(34,197,94,.08)"}}>
            <div style={{position:"absolute",bottom:0,left:0,width:1,height:"12vh",background:"rgba(34,197,94,.08)"}}/>
          </div>
          <div style={{position:"absolute",bottom:-3,left:-3,width:6,height:6,background:C.green,opacity:.3}}/>
        </div>

        {/* content */}
        <div style={{...WRAP,position:"relative",zIndex:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,alignItems:"center",minHeight:"calc(100vh - 56px)"}}>

          {/* LEFT */}
          <div className="rv-up" style={{padding:"80px 64px 80px 0",display:"flex",flexDirection:"column"}}>

            <div className="rv-dot" style={{display:"inline-flex",alignItems:"center",gap:8,alignSelf:"flex-start",
              marginBottom:40,padding:"8px 16px",border:`1px solid ${C.border}`,
              fontSize:10,letterSpacing:".25em",color:C.primary,fontFamily:MONO}}>
              <span className="rv-dot" style={{display:"inline-block",width:6,height:6,background:C.green,borderRadius:"50%"}}/>
              PUBLIC BETA · NOW LIVE
            </div>

            <h1 style={{
              alignSelf:"flex-start",marginBottom:32,padding:"8px 20px",lineHeight:1,
              fontSize:"clamp(3.5rem,8vw,6.5rem)",fontWeight:800,color:C.violet,
              letterSpacing:"-0.02em",border:`1px solid rgba(179,154,255,.2)`,
              textShadow:"0 0 120px rgba(179,154,255,.16)",fontFamily:SANS,
            }}>REVOIRT</h1>

            <p style={{marginBottom:16,fontSize:"clamp(14px,1.6vw,17px)",color:C.textSec,
              minHeight:"1.6em",letterSpacing:".04em",fontFamily:MONO}}>
              {typed}<span className="rv-blink" style={{color:C.blue}}>▌</span>
            </p>

            <p style={{fontSize:13,color:C.textTer,lineHeight:1.85,marginBottom:44,maxWidth:420,fontFamily:SANS}}>
              Browser-native collaborative IDE — Monaco editor, integrated terminal,
              and a full file explorer powered entirely by IndexedDB.
            </p>

            <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:56}}>
              <button className="btn-primary">START FOR FREE →</button>
              <button className="btn-secondary">VIEW DEMO</button>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",maxWidth:300,border:`1px solid ${C.border}`}}>
              {[["12k+","DEVS"],["<50ms","SYNC"],["99.9%","UPTIME"]].map(([v,l],i)=>(
                <div key={l} style={{padding:"16px 0",textAlign:"center",borderRight:i<2?`1px solid ${C.border}`:"none"}}>
                  <div style={{fontSize:15,fontWeight:700,color:C.text}}>{v}</div>
                  <div style={{fontSize:9,color:C.textSec,letterSpacing:".2em",marginTop:4,fontFamily:MONO}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{padding:"80px 0 80px 40px",display:"flex",flexDirection:"column",gap:16}}>

            {/* terminal */}
            <div className="card-hover" style={{border:`1px solid ${C.border}`,overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"10px 16px",background:C.bgSurface,borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"flex",gap:6}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:"#ff5f57"}}/>
                  <div style={{width:10,height:10,borderRadius:"50%",background:"#febc2e"}}/>
                  <div style={{width:10,height:10,borderRadius:"50%",background:"#28c840"}}/>
                </div>
                <span style={{fontSize:9,color:C.textTer,letterSpacing:".2em",fontFamily:MONO}}>REVOIRT TERMINAL · boot sequence</span>
                <span className="rv-dot" style={{fontSize:9,color:C.green,fontFamily:MONO}}>● LIVE</span>
              </div>

              <div style={{background:C.bgCode,padding:"20px",display:"flex",flexDirection:"column",gap:2,minHeight:320}}>
                {LOG_LINES.map((line,i)=>(
                  logVisible.includes(i) && (
                    <div key={i} className="rv-slide" style={{display:"flex",alignItems:"baseline",gap:12,fontSize:11,fontFamily:MONO}}>
                      <span style={{color:C.textTer,minWidth:28,textAlign:"right",flexShrink:0}}>{line.ms}</span>
                      <span style={{color:line.col,minWidth:40,flexShrink:0,fontWeight:600}}>[{line.tag}]</span>
                      <span style={{color:i===LOG_LINES.length-1?C.text:"#3a3a3a"}}>
                        {line.msg}
                        {i===LOG_LINES.length-1&&<span className="rv-blink" style={{color:C.green}}> ▌</span>}
                      </span>
                    </div>
                  )
                ))}
              </div>

              <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 20px",
                background:C.bgCode,borderTop:`1px solid ${C.borderMid}`}}>
                <span style={{fontSize:11,fontWeight:700,color:C.violet,fontFamily:MONO}}>Revoirt</span>
                <span style={{fontSize:11,color:C.green,fontFamily:MONO}}>❯</span>
                <span style={{fontSize:11,color:C.textTer,fontFamily:MONO}}>npm run dev</span>
                <span className="rv-blink" style={{fontSize:11,color:C.blue,marginLeft:"auto",fontFamily:MONO}}>▌</span>
              </div>
            </div>

            {/* collab badge */}
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",
              border:`1px solid ${C.border}`,background:C.bgSurface}}>
              <div style={{display:"flex",marginLeft:4}}>
                {CURSORS.map(u=>(
                  <div key={u.i} style={{width:24,height:24,background:u.color,fontSize:8,fontWeight:800,
                    color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",
                    marginLeft:-4,border:`2px solid ${C.bg}`,fontFamily:SANS}}>
                    {u.i}
                  </div>
                ))}
              </div>
              <span style={{fontSize:10,color:C.textSec,fontFamily:MONO}}>3 collaborators online · room/alpha-squad</span>
              <span className="rv-dot" style={{fontSize:9,color:C.green,marginLeft:"auto",fontFamily:MONO}}>● synced</span>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",
          display:"flex",flexDirection:"column",alignItems:"center",gap:6,pointerEvents:"none"}}>
          <div style={{fontSize:9,color:C.textTer,letterSpacing:".3em",fontFamily:MONO}}>SCROLL</div>
          <div style={{width:1,height:28,background:`linear-gradient(to bottom,${C.textTer},transparent)`}}/>
        </div>
      </section>

      {/* ── IDE PREVIEW ── */}
      <section style={{borderTop:`1px solid ${C.border}`,padding:"96px 0",width:"100%"}}>
        <div style={WRAP}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:16,marginBottom:64}}>
            <div>
              <p style={{fontSize:10,color:C.violet,letterSpacing:".3em",marginBottom:8,fontFamily:MONO}}>// THE EDITOR</p>
              <h2 style={{fontSize:"clamp(22px,3.5vw,36px)",fontWeight:700,color:C.text,fontFamily:SANS}}>Everything in one window.</h2>
            </div>
            <div style={{fontSize:11,color:C.textTer,borderLeft:`2px solid ${C.border}`,paddingLeft:16,lineHeight:1.8,fontFamily:MONO}}>
              Monaco · xterm.js<br/><span style={{color:C.green}}>IndexedDB · CRDT</span>
            </div>
          </div>

          <div className="card-hover" style={{border:`1px solid ${C.border}`,overflow:"hidden"}}>
            {/* chrome */}
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",
              background:C.bgSurface,borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",gap:6}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:"#ff5f57"}}/>
                <div style={{width:10,height:10,borderRadius:"50%",background:"#febc2e"}}/>
                <div style={{width:10,height:10,borderRadius:"50%",background:"#28c840"}}/>
              </div>
              <div style={{flex:1,textAlign:"center",fontSize:10,color:C.textTer,letterSpacing:".15em",fontFamily:MONO}}>
                REVOIRT · room/alpha-squad
              </div>
              <div style={{display:"flex",gap:2}}>
                {CURSORS.map(u=>(
                  <div key={u.i} style={{width:20,height:20,background:u.color,fontSize:8,fontWeight:700,color:"#fff",
                    display:"flex",alignItems:"center",justifyContent:"center",marginLeft:-3,
                    border:`2px solid ${C.bg}`,fontFamily:SANS}}>
                    {u.i}
                  </div>
                ))}
              </div>
            </div>

            {/* body */}
            <div style={{display:"flex",height:380}}>
              {/* sidebar */}
              <div style={{width:160,background:C.bgCode,borderRight:`1px solid ${C.border}`,flexShrink:0,overflowY:"auto"}}>
                <div style={{fontSize:9,color:C.textTer,letterSpacing:".25em",padding:"10px 12px",
                  borderBottom:`1px solid ${C.borderMid}`,fontFamily:MONO}}>EXPLORER</div>
                {FILES.map(f=>(
                  <div key={f.n} className="file-row" style={{
                    display:"flex",alignItems:"center",gap:6,cursor:"pointer",
                    paddingLeft:`${f.d*10+12}px`,paddingRight:8,paddingTop:4,paddingBottom:4,fontSize:11,
                    color:f.active?C.violet:C.textTer,
                    background:f.active?`rgba(179,154,255,.08)`:"transparent",
                    borderLeft:f.active?`2px solid ${C.violet}`:"2px solid transparent",
                    fontFamily:MONO,transition:"color .12s,background .12s",
                  }}>
                    <span style={{opacity:.35,fontSize:9}}>{f.icon}</span>
                    <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.n}</span>
                  </div>
                ))}
              </div>

              {/* editor pane */}
              <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
                <div style={{display:"flex",flexShrink:0,background:C.bgCode,borderBottom:`1px solid ${C.border}`,fontSize:11}}>
                  {["editor.ts","session.ts"].map((t,i)=>(
                    <div key={t} style={{padding:"8px 16px",borderRight:`1px solid ${C.border}`,flexShrink:0,fontFamily:MONO,
                      color:i===0?C.text:C.textTer,background:i===0?C.bg:"transparent",
                      borderTop:i===0?`1px solid ${C.violet}`:"none"}}>{t}</div>
                  ))}
                </div>
                <div style={{flex:1,overflowY:"auto",padding:"12px 16px",background:C.bg,fontSize:12,lineHeight:"20px",fontFamily:MONO}}>
                  {CODE.map((tokens,i)=>(
                    <div key={i} style={{display:"flex",position:"relative"}}>
                      <span style={{width:28,flexShrink:0,textAlign:"right",color:C.textTer,marginRight:16,userSelect:"none",fontSize:11}}>{i+1}</span>
                      <span style={{flex:1,position:"relative"}}>
                        {CURSORS.find(c=>c.line===i)&&(
                          <span style={{position:"absolute",zIndex:10,fontSize:8,fontWeight:700,color:C.bg,
                            padding:"0 4px",lineHeight:"16px",whiteSpace:"nowrap",top:-1,left:0,
                            background:CURSORS.find(c=>c.line===i)!.color}}>
                            {CURSORS.find(c=>c.line===i)!.name}
                          </span>
                        )}
                        {CURSORS.some(c=>c.line===i)&&(
                          <span style={{position:"absolute",inset:0,opacity:.06,background:CURSORS.find(c=>c.line===i)!.color}}/>
                        )}
                        {tokens.map((tok,j)=><span key={j} style={{color:tok.c}}>{tok.t}</span>)}
                        {CURSORS[activeCur].line===i&&(
                          <span style={{display:"inline-block",verticalAlign:"middle",marginLeft:2,
                            width:2,height:14,background:CURSORS[activeCur].color,opacity:curOn?1:0}}/>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* terminal strip */}
            <div style={{borderTop:`1px solid ${C.border}`}}>
              <div style={{display:"flex",fontSize:10,borderBottom:`1px solid ${C.borderMid}`}}>
                {["TERMINAL","PROBLEMS","OUTPUT"].map((t,i)=>(
                  <div key={t} style={{padding:"6px 16px",letterSpacing:".15em",flexShrink:0,fontFamily:MONO,
                    color:i===0?C.green:C.textTer,borderBottom:i===0?`1px solid ${C.green}`:"none"}}>{t}</div>
                ))}
              </div>
              <div style={{background:C.bg,padding:"10px 16px",height:68,fontSize:11,lineHeight:1.6,fontFamily:MONO}}>
                <div><span style={{color:C.violet,fontWeight:700}}>Revoirt </span><span style={{color:C.green}}>❯ </span><span style={{color:C.textTer}}>npm run dev</span></div>
                <div style={{color:C.textTer,fontSize:10,marginTop:2}}>&nbsp;&nbsp;→ Ready on <span style={{color:C.blue}}>http://localhost:3000</span></div>
                <div style={{color:C.textTer,fontSize:10}}>&nbsp;&nbsp;✓ Compiled in 847ms · 3 peers connected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ── */}
      <section style={{borderTop:`1px solid ${C.border}`,padding:"96px 0",width:"100%"}}>
        <div style={WRAP}>
          <div style={{marginBottom:64}}>
            <p style={{fontSize:10,color:C.violet,letterSpacing:".3em",marginBottom:8,fontFamily:MONO}}>// FEATURES</p>
            <h2 style={{fontSize:"clamp(22px,3.5vw,36px)",fontWeight:700,color:C.text,fontFamily:SANS}}>Built for teams who ship.</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:C.border}}>
            {FEATURES.map(f=>(
              <div key={f.id} className="feature-card" style={{
                gridColumn:f.span===2?"span 2":"span 1",
                background:C.bg,padding:"36px",position:"relative",overflow:"hidden",cursor:"default",
                transition:"background .15s",
              }}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:f.accent,opacity:.7}}/>
                <div style={{position:"absolute",bottom:-12,right:-4,fontWeight:800,fontSize:"5rem",
                  color:`${C.border}55`,lineHeight:1,userSelect:"none",pointerEvents:"none"}}>{f.id}</div>
                <p style={{fontSize:10,fontWeight:600,letterSpacing:".18em",marginBottom:16,color:f.accent,fontFamily:MONO}}>[{f.tag}]</p>
                <h3 style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:10,position:"relative",fontFamily:SANS}}>{f.title}</h3>
                <p style={{fontSize:12,color:C.textSec,lineHeight:1.8,position:"relative",fontFamily:SANS}}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLAB SECTION ── */}
      <section style={{borderTop:`1px solid ${C.border}`,padding:"96px 0",width:"100%"}}>
        <div style={{...WRAP,display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"start"}}>
          <div>
            <p style={{fontSize:10,color:C.blue,letterSpacing:".3em",marginBottom:16,fontFamily:MONO}}>// REAL-TIME PRESENCE</p>
            <h2 style={{fontSize:"clamp(20px,3vw,32px)",fontWeight:700,color:C.text,marginBottom:20,lineHeight:1.25,fontFamily:SANS}}>
              See everyone's cursor.<br/>Always.
            </h2>
            <p style={{fontSize:13,color:C.textSec,lineHeight:1.85,marginBottom:32,fontFamily:SANS}}>
              Every keystroke, selection, and terminal command is synchronized across all collaborators.
              User groups let you control who sees what and who can edit.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[
                {label:"Conflict-free CRDT (Yjs) under the hood", color:C.violet},
                {label:"Named cursors · color-coded selections",   color:C.blue},
                {label:"Shared xterm.js terminal sessions",        color:C.green},
                {label:"Role-based access control (RBAC)",         color:C.yellow},
                {label:"Offline-first · auto-reconcile on reconnect", color:C.red},
              ].map(({label,color})=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:12,fontSize:12,color:C.textSec,fontFamily:SANS}}>
                  <div style={{width:4,height:4,background:color,flexShrink:0}}/>
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="card-hover" style={{border:`1px solid ${C.border}`,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
              padding:"10px 16px",background:C.bgSurface,borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:9,color:C.textTer,letterSpacing:".2em",fontFamily:MONO}}>ACTIVE SESSION · room/alpha-squad</span>
              <span className="rv-dot" style={{fontSize:9,color:C.green,fontFamily:MONO}}>● live</span>
            </div>
            {CURSORS.map(u=>(
              <div key={u.i} className="collab-row" style={{display:"flex",alignItems:"center",gap:16,
                padding:"14px 16px",borderBottom:`1px solid ${C.borderMid}`,transition:"background .12s"}}>
                <div style={{width:32,height:32,background:u.color,fontSize:11,fontWeight:800,flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontFamily:SANS}}>{u.i}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,color:C.text,marginBottom:2,fontFamily:SANS}}>{u.name}</div>
                  <div style={{fontSize:10,color:C.textTer,fontFamily:MONO}}>Line {u.line} · editor.ts</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div className="rv-dot" style={{width:6,height:6,background:C.green}}/>
                  <span style={{fontSize:10,color:C.textTer,fontFamily:MONO}}>editing</span>
                </div>
              </div>
            ))}
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",
              background:C.bgSurface,fontSize:10,color:C.textTer,fontFamily:MONO}}>
              <span style={{color:C.green}}>●</span>3 users · last sync 8ms · CRDT v2
            </div>
          </div>
        </div>
      </section>

      {/* ── FILE EXPLORER ── */}
      <section style={{borderTop:`1px solid ${C.border}`,padding:"96px 0",width:"100%"}}>
        <div style={{...WRAP,display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"start"}}>

          <div className="card-hover" style={{border:`1px solid ${C.border}`,overflow:"hidden"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"10px 16px",background:C.bgSurface,borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:9,color:C.textTer,letterSpacing:".2em",fontFamily:MONO}}>FILE EXPLORER · idb://revoirt</span>
              <span style={{fontSize:9,color:C.green,fontFamily:MONO}}>● synced</span>
            </div>
            <div style={{padding:"6px 16px",fontSize:10,color:C.textTer,borderBottom:`1px solid ${C.borderMid}`,fontFamily:MONO}}>
              root / src / <span style={{color:C.violet}}>editor.ts</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"24px 1fr 64px 72px",padding:"6px 16px",
              fontSize:9,color:C.textTer,letterSpacing:".1em",borderBottom:`1px solid ${C.borderMid}`,fontFamily:MONO}}>
              <span/><span>NAME</span><span style={{textAlign:"right"}}>SIZE</span><span style={{textAlign:"right"}}>MODIFIED</span>
            </div>
            {[
              {icon:"▾",name:"root",       size:"—",     mod:"just now",dir:true},
              {icon:"▾",name:"src",        size:"—",     mod:"2m ago",  dir:true},
              {icon:"·",name:"editor.ts",  size:"4.2 KB",mod:"just now",active:true},
              {icon:"·",name:"session.ts", size:"2.1 KB",mod:"5m ago"},
              {icon:"·",name:"idb.ts",     size:"6.8 KB",mod:"12m ago"},
              {icon:"·",name:"terminal.ts",size:"3.3 KB",mod:"1h ago"},
              {icon:"·",name:"types.ts",   size:"1.1 KB",mod:"2h ago"},
            ].map((f,i)=>(
              <div key={i} className="file-row" style={{
                display:"grid",gridTemplateColumns:"24px 1fr 64px 72px",
                alignItems:"center",padding:"7px 16px",fontSize:11,cursor:"pointer",
                color:f.active?C.violet:C.textSec,
                background:f.active?`rgba(179,154,255,.07)`:i%2?"rgba(255,255,255,.006)":"transparent",
                borderLeft:f.active?`2px solid ${C.violet}`:"2px solid transparent",
                fontFamily:MONO,transition:"color .12s,background .12s",
              }}>
                <span style={{opacity:.3}}>{f.icon}</span>
                <span>{f.name}</span>
                <span style={{textAlign:"right",color:C.textTer}}>{f.size}</span>
                <span style={{textAlign:"right",fontSize:10,color:C.textTer}}>{f.mod}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 16px",
              fontSize:10,color:C.textTer,borderTop:`1px solid ${C.borderMid}`,fontFamily:MONO}}>
              <span>7 items · 17.5 KB</span><span>stored in idb</span>
            </div>
          </div>

          <div>
            <p style={{fontSize:10,color:C.green,letterSpacing:".3em",marginBottom:16,fontFamily:MONO}}>// BROWSER-NATIVE STORAGE</p>
            <h2 style={{fontSize:"clamp(20px,3vw,32px)",fontWeight:700,color:C.text,marginBottom:20,lineHeight:1.25,fontFamily:SANS}}>
              Your files never<br/>leave the browser.
            </h2>
            <p style={{fontSize:13,color:C.textSec,lineHeight:1.85,marginBottom:32,fontFamily:SANS}}>
              The file explorer runs entirely on IndexedDB and sessionStorage.
              No cloud uploads. No S3 buckets. No latency.
              Files persist across sessions; collaboration sync is via CRDT patches — not file transfers.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[
                {label:"IndexedDB persistence",                   color:C.green},
                {label:"sessionStorage for ephemeral state",      color:C.blue},
                {label:"CRDT patch-based collaboration",          color:C.violet},
                {label:"Zero server file uploads",                color:C.yellow},
                {label:"Works offline · reconciles on reconnect", color:C.red},
              ].map(({label,color})=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:12,fontSize:12,color:C.textSec,fontFamily:SANS}}>
                  <div style={{width:4,height:4,background:color,flexShrink:0}}/>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{borderTop:`1px solid ${C.border}`,padding:"96px 0",width:"100%"}}>
        <div style={WRAP}>
          <div style={{textAlign:"center",marginBottom:64}}>
            <p style={{fontSize:10,color:C.violet,letterSpacing:".3em",marginBottom:8,fontFamily:MONO}}>// HOW IT WORKS</p>
            <h2 style={{fontSize:"clamp(22px,4vw,38px)",fontWeight:700,color:C.text,fontFamily:SANS}}>Up in 60 seconds.</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:C.border}}>
            {STEPS.map((s,i)=>(
              <div key={s.n} className="feature-card" style={{background:C.bg,padding:"48px 36px",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:-16,right:-4,fontWeight:800,fontSize:"7rem",
                  color:`${C.border}66`,lineHeight:1,userSelect:"none",pointerEvents:"none"}}>{s.n}</div>
                <p style={{fontSize:10,color:C.violet,letterSpacing:".25em",marginBottom:20,position:"relative",fontFamily:MONO}}>{s.n}</p>
                <h3 style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:10,position:"relative",fontFamily:SANS}}>{s.title}</h3>
                <p style={{fontSize:12,color:C.textSec,lineHeight:1.7,position:"relative",fontFamily:SANS}}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{borderTop:`1px solid ${C.border}`,padding:"96px 0",position:"relative",overflow:"hidden",width:"100%"}}>
        <div style={{position:"absolute",top:0,left:0,height:1,width:64,background:"rgba(179,154,255,.22)"}}/>
        <div style={{position:"absolute",top:0,left:0,width:1,height:64,background:"rgba(179,154,255,.22)"}}/>
        <div style={{position:"absolute",bottom:0,right:0,height:1,width:64,background:"rgba(56,189,248,.15)"}}/>
        <div style={{position:"absolute",bottom:0,right:0,width:1,height:64,background:"rgba(56,189,248,.15)"}}/>
        <div className="rv-glow" style={{position:"absolute",pointerEvents:"none",
          width:500,height:200,left:"50%",top:"50%",transform:"translate(-50%,-50%)",
          background:"radial-gradient(ellipse,rgba(179,154,255,.22) 0%,transparent 70%)",filter:"blur(35px)"}}/>
        <div style={{...WRAP,position:"relative",zIndex:10,display:"flex",justifyContent:"center"}}>
          <div style={{maxWidth:520,width:"100%",textAlign:"center"}}>
            <p style={{fontSize:10,color:C.violet,letterSpacing:".3em",marginBottom:16,fontFamily:MONO}}>// GET EARLY ACCESS</p>
            <h2 style={{fontSize:"clamp(28px,5vw,52px)",fontWeight:800,color:C.text,marginBottom:8,lineHeight:1.1,fontFamily:SANS}}>
              Start coding<br/>
              <span style={{color:C.violet}}>together</span>
              <span className="rv-blink" style={{color:C.blue}}>▌</span>
            </h2>
            <p style={{fontSize:12,color:C.textSec,marginBottom:40,fontFamily:SANS}}>Free for teams up to 5. No credit card required.</p>
            <div style={{display:"flex"}}>
              <input type="email" placeholder="your@email.com"
                style={{flex:1,padding:"13px 16px",background:C.bgSurface,border:`1px solid ${C.border}`,
                  borderRight:"none",color:C.text,fontSize:12,outline:"none",fontFamily:MONO}}
                onFocus={e=>{e.currentTarget.style.borderColor=C.primary}}
                onBlur={e=>{e.currentTarget.style.borderColor=C.border}}/>
              <button className="btn-primary" style={{flexShrink:0,padding:"13px 24px"}}>GET ACCESS →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{borderTop:`1px solid ${C.border}`,padding:"24px 0",width:"100%"}}>
        <div style={{...WRAP,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <rect x="0" y="0" width="7" height="7" stroke={C.violet} strokeWidth="1.2" fill="none"/>
              <rect x="11" y="11" width="7" height="7" stroke={C.blue} strokeWidth="1.2" fill="none"/>
              <line x1="7" y1="3.5" x2="14.5" y2="3.5" stroke={C.violet} strokeWidth="1"/>
              <line x1="14.5" y1="3.5" x2="14.5" y2="11" stroke={C.violet} strokeWidth="1"/>
              <line x1="3.5" y1="7" x2="3.5" y2="14.5" stroke={C.blue} strokeWidth="1"/>
              <line x1="3.5" y1="14.5" x2="11" y2="14.5" stroke={C.blue} strokeWidth="1"/>
            </svg>
            <span style={{color:C.violet,fontWeight:800,fontSize:11,letterSpacing:".18em",fontFamily:SANS}}>REVOIRT</span>
          </div>
          <span style={{fontSize:9,color:C.textTer,fontFamily:MONO}}>© 2025 Revoirt Inc. All rights reserved.</span>
          <div style={{display:"flex",gap:24}}>
            {["Privacy","Terms","GitHub","Twitter"].map(l=>(
              <a key={l} href="#" className="foot-link">{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
