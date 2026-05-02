import { useState, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,600;0,800;1,400&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'JetBrains Mono',monospace!important;background:#181818}
  ::-webkit-scrollbar{width:3px;background:#111}
  ::-webkit-scrollbar-thumb{background:#2a2a2a}
  @keyframes rv-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
  @keyframes rv-slide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
  @keyframes rv-up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  @keyframes rv-dot{0%,100%{opacity:.3}50%{opacity:1}}
  @keyframes rv-glow{0%,100%{opacity:.06}50%{opacity:.14}}
  .rv-blink{animation:rv-blink 1.1s step-end infinite}
  .rv-slide{animation:rv-slide .4s ease both}
  .rv-up{animation:rv-up .5s ease both}
  .rv-dot{animation:rv-dot 2s ease-in-out infinite}
  .rv-glow{animation:rv-glow 3s ease-in-out infinite}
`;

const NAV = ["Features", "Docs", "Changelog", "GitHub"];

const LOG_LINES = [
  { ms:"000", tag:"SYS",  col:"#555",    msg:"revoirt v0.9.1 initializing..." },
  { ms:"012", tag:"IDB",  col:"#22c55e", msg:"IndexedDB mount OK  ·  17.5 KB" },
  { ms:"045", tag:"WS",   col:"#38bdf8", msg:"WebSocket handshake  ·  room/alpha-squad" },
  { ms:"048", tag:"CRDT", col:"#8b5cf6", msg:"Yjs doc loaded  ·  3 peers connected" },
  { ms:"071", tag:"TERM", col:"#f59e0b", msg:"xterm.js session spawned  ·  shared i/o" },
  { ms:"089", tag:"FS",   col:"#22c55e", msg:"File tree hydrated  ·  8 entries" },
  { ms:"093", tag:"MON",  col:"#8b5cf6", msg:"Monaco language server ready  ·  TypeScript" },
  { ms:"101", tag:"SYNC", col:"#38bdf8", msg:"Initial sync complete  ·  <50 ms" },
  { ms:"___", tag:"READY",col:"#22c55e", msg:"Session live" },
];

const CODE = [
  [{c:"#c678dd",t:"import "},{c:"#e5e7eb",t:"{ revoirt } "},{c:"#c678dd",t:"from "},{c:"#98c379",t:"'@revoirt/core'"}],
  [],
  [{c:"#5c6370",t:"// connect to a collaborative session"}],
  [{c:"#c678dd",t:"const "},{c:"#61afef",t:"session"},{c:"#e5e7eb",t:" = "},{c:"#c678dd",t:"await "},{c:"#e5e7eb",t:"revoirt."},{c:"#61afef",t:"connect"},{c:"#e5e7eb",t:"({"}],
  [{c:"#e06c75",t:"  room"},{c:"#e5e7eb",t:": "},{c:"#98c379",t:"'alpha-squad'"},{c:"#e5e7eb",t:","}],
  [{c:"#e06c75",t:"  collab"},{c:"#e5e7eb",t:": "},{c:"#d19a66",t:"true"},{c:"#e5e7eb",t:","}],
  [{c:"#e06c75",t:"  terminal"},{c:"#e5e7eb",t:": "},{c:"#d19a66",t:"true"},{c:"#e5e7eb",t:","}],
  [{c:"#e06c75",t:"  storage"},{c:"#e5e7eb",t:": "},{c:"#98c379",t:"'idb'"}],
  [{c:"#e5e7eb",t:"})"}],
  [],
  [{c:"#5c6370",t:"// real-time presence"}],
  [{c:"#e5e7eb",t:"session."},{c:"#61afef",t:"onJoin"},{c:"#e5e7eb",t:"(("},{c:"#e06c75",t:"u"},{c:"#e5e7eb",t:") => console."},{c:"#61afef",t:"log"},{c:"#e5e7eb",t:"(u."},{c:"#e06c75",t:"name"},{c:"#e5e7eb",t:"))"}],
];

const CURSORS = [
  { i:"AK", name:"Arjun", color:"#8b5cf6", line:4 },
  { i:"SR", name:"Sara",  color:"#38bdf8", line:7 },
  { i:"JK", name:"Jake",  color:"#22c55e", line:11 },
];

const FILES = [
  { icon:"▾", n:"src",          d:0, dir:true },
  { icon:"·", n:"editor.ts",   d:1, active:true },
  { icon:"·", n:"session.ts",  d:1 },
  { icon:"·", n:"terminal.ts", d:1 },
  { icon:"·", n:"idb.ts",      d:1 },
  { icon:"·", n:"types.ts",    d:1 },
  { icon:"·", n:".env",        d:0 },
  { icon:"·", n:"package.json",d:0 },
];

const FEATURES = [
  { id:"F1", accent:"#8b5cf6", tag:"monaco · yjs · ws",           span:2, title:"Collaborative Editor",  body:"Monaco-powered, real-time CRDT sync. Named cursors, shared selections, conflict-free replicated edits across every connected session." },
  { id:"F2", accent:"#38bdf8", tag:"xterm.js · shared i/o",       span:1, title:"Web Terminal",          body:"xterm.js shell — every keystroke shared. Run commands, see output together. No SSH. No setup." },
  { id:"F3", accent:"#22c55e", tag:"idb · sessionstorage",        span:1, title:"Local File Explorer",   body:"Entire filesystem in IndexedDB + sessionStorage. No uploads. Your files never leave the browser." },
  { id:"F4", accent:"#f59e0b", tag:"rooms · rbac",                span:1, title:"User Groups & Rooms",   body:"Invite by link, assign roles, restrict writes. Private and public sessions with granular permissions." },
  { id:"F5", accent:"#ef4444", tag:"<50ms · crdt v2 · offline-first", span:2, title:"Zero-Latency Sync", body:"Sub-50ms WebSocket sync with CRDT. No merge conflicts. Offline-first with auto-reconcile on reconnect." },
];

const STEPS = [
  { n:"01", title:"Create a Room",    body:"Name it, pick access mode, grab the invite link. Done in 10 seconds." },
  { n:"02", title:"Invite Your Team", body:"Share the link. Everyone lands in the same editor with live cursors." },
  { n:"03", title:"Ship Together",    body:"Edit, run the terminal, manage files — zero config, zero latency." },
];

const M = "'JetBrains Mono', monospace";

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
    <div className="min-h-screen overflow-x-hidden text-[#e5e7eb]" style={{background:"#181818", fontFamily:M}}>

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-12 flex items-center border-b border-[#222]"
        style={{background:"rgba(20,20,20,.97)", backdropFilter:"blur(6px)"}}>
        <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="0" y="0" width="7" height="7" stroke="#8b5cf6" strokeWidth="1" fill="none"/>
              <rect x="11" y="11" width="7" height="7" stroke="#38bdf8" strokeWidth="1" fill="none"/>
              <line x1="7" y1="3.5" x2="14.5" y2="3.5" stroke="#8b5cf6" strokeWidth="1"/>
              <line x1="14.5" y1="3.5" x2="14.5" y2="11" stroke="#8b5cf6" strokeWidth="1"/>
              <line x1="3.5" y1="7" x2="3.5" y2="14.5" stroke="#38bdf8" strokeWidth="1"/>
              <line x1="3.5" y1="14.5" x2="11" y2="14.5" stroke="#38bdf8" strokeWidth="1"/>
            </svg>
            <span className="text-[#8b5cf6] font-extrabold text-[12px] tracking-[.18em]">REVOIRT</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {NAV.map(l=>(
              <a key={l} href="#" className="text-[11px] tracking-widest text-[#444] no-underline transition-colors duration-150 hover:text-[#e5e7eb]">{l}</a>
            ))}
          </div>

          <div className="flex gap-2">
            <button className="text-[11px] px-4 py-2 bg-transparent border border-[#2a2a2a] text-[#666] cursor-pointer transition-all duration-150 hover:border-[#555] hover:text-[#ccc]"
              style={{fontFamily:M}}>Sign In</button>
            <button className="text-[11px] px-5 py-2 font-bold tracking-wider bg-[#8b5cf6] text-white border-none cursor-pointer transition-colors duration-150 hover:bg-[#7c3aed]"
              style={{fontFamily:M}}>GET STARTED</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen pt-12 overflow-hidden flex items-center">

        {/* dot grid bg */}
        <div className="absolute inset-0 pointer-events-none"
          style={{opacity:.025, backgroundImage:"radial-gradient(#e5e7eb 1px,transparent 1px)", backgroundSize:"32px 32px"}}/>

        {/* violet center glow */}
        <div className="rv-glow absolute pointer-events-none"
          style={{width:600, height:240, left:"50%", top:"45%", transform:"translate(-50%,-50%)",
            background:"radial-gradient(ellipse, rgba(139,92,246,.35) 0%, transparent 70%)", filter:"blur(40px)"}}/>

        {/* ── corner circuit lines ── */}
        {/* TL */}
        <div className="absolute pointer-events-none" style={{top:"14%",left:0,width:"16vw",height:1,background:"rgba(139,92,246,.2)"}}>
          <div className="absolute" style={{right:0,top:0,width:1,height:"30vh",background:"rgba(139,92,246,.2)"}}>
            <div className="absolute" style={{bottom:0,left:0,width:"12vw",height:1,background:"rgba(139,92,246,.2)"}}/>
            <div className="absolute bg-[#8b5cf6] opacity-50" style={{top:-3,left:-3,width:6,height:6}}/>
          </div>
          <div className="absolute bg-[#8b5cf6] opacity-30" style={{left:0,top:-3,width:6,height:6}}/>
        </div>
        {/* TR */}
        <div className="absolute pointer-events-none" style={{top:0,right:"22%",width:1,height:"10vh",background:"rgba(56,189,248,.15)"}}>
          <div className="absolute" style={{top:0,left:0,width:"18vw",height:1,background:"rgba(56,189,248,.15)"}}>
            <div className="absolute" style={{top:0,right:0,width:1,height:"14vh",background:"rgba(56,189,248,.15)"}}/>
          </div>
        </div>
        {/* BR */}
        <div className="absolute pointer-events-none" style={{bottom:"12%",right:0,width:"16vw",height:1,background:"rgba(56,189,248,.12)"}}>
          <div className="absolute" style={{left:0,bottom:0,width:1,height:"22vh",background:"rgba(56,189,248,.12)"}}>
            <div className="absolute" style={{top:0,right:0,width:"10vw",height:1,background:"rgba(56,189,248,.12)"}}/>
          </div>
        </div>
        {/* BL */}
        <div className="absolute pointer-events-none" style={{bottom:0,left:"20%",width:1,height:"10vh",background:"rgba(34,197,94,.1)"}}>
          <div className="absolute" style={{bottom:0,left:0,width:"18vw",height:1,background:"rgba(34,197,94,.1)"}}>
            <div className="absolute" style={{bottom:0,left:0,width:1,height:"12vh",background:"rgba(34,197,94,.1)"}}/>
          </div>
          <div className="absolute bg-[#22c55e] opacity-35" style={{bottom:-3,left:-3,width:6,height:6}}/>
        </div>

        {/* ── split content ── */}
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 grid grid-cols-2 gap-0 items-center"
          style={{minHeight:"calc(100vh - 48px)"}}>

          {/* LEFT */}
          <div className="rv-up py-16 pr-12 flex flex-col">

            <div className="rv-dot inline-flex items-center gap-2 mb-10 text-[10px] tracking-[.25em] text-[#8b5cf6] border border-[#252525] self-start px-3 py-1.5">
              <span className="rv-dot inline-block w-1.5 h-1.5 bg-[#22c55e]"/>
              PUBLIC BETA · NOW LIVE
            </div>

            <h1 className="font-extrabold text-[#8b5cf6] leading-none inline-block border border-[rgba(139,92,246,.22)] px-5 py-1 mb-8 self-start"
              style={{fontSize:"clamp(3.5rem,9vw,7rem)", letterSpacing:"-0.02em", textShadow:"0 0 120px rgba(139,92,246,.18)"}}>
              REVOIRT
            </h1>

            <p className="mb-4 tracking-[.04em] text-[#4a4a4a]"
              style={{fontSize:"clamp(14px,1.8vw,18px)", minHeight:"1.6em"}}>
              {typed}<span className="rv-blink text-[#38bdf8]">▌</span>
            </p>

            <p className="text-[12px] text-[#343434] leading-[1.85] mb-11" style={{maxWidth:440}}>
              Browser-native collaborative IDE — Monaco editor, integrated terminal,
              and a full file explorer powered entirely by IndexedDB.
            </p>

            <div className="flex flex-wrap gap-3 mb-14">
              <button className="text-[11px] font-bold tracking-[.12em] px-7 py-3 bg-[#8b5cf6] text-white border-none cursor-pointer transition-colors duration-150 hover:bg-[#7c3aed]"
                style={{fontFamily:M}}>START FOR FREE →</button>
              <button className="text-[11px] tracking-[.12em] px-7 py-3 bg-transparent border border-[#2a2a2a] text-[#555] cursor-pointer transition-all duration-150 hover:border-[#8b5cf6] hover:text-[#ccc]"
                style={{fontFamily:M}}>VIEW DEMO</button>
            </div>

            {/* stats */}
            <div className="grid grid-cols-3 border border-[#222]" style={{maxWidth:300}}>
              {[["12k+","DEVS"],["<50ms","SYNC"],["99.9%","UPTIME"]].map(([v,l],i)=>(
                <div key={l} className="py-4 text-center" style={{borderRight:i<2?"1px solid #222":"none"}}>
                  <div className="text-[15px] font-bold text-[#e5e7eb]">{v}</div>
                  <div className="text-[9px] text-[#363636] tracking-[.2em] mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — boot log */}
          <div className="py-16 pl-10 flex flex-col gap-4">

            <div className="border border-[#252525] overflow-hidden">
              {/* chrome */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#1c1c1c] border-b border-[#252525]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-[#ff5f57]"/>
                  <div className="w-2.5 h-2.5 bg-[#febc2e]"/>
                  <div className="w-2.5 h-2.5 bg-[#28c840]"/>
                </div>
                <span className="text-[9px] text-[#2e2e2e] tracking-[.2em]">REVOIRT TERMINAL · boot sequence</span>
                <span className="rv-dot text-[9px] text-[#22c55e]">● LIVE</span>
              </div>

              {/* log body */}
              <div className="bg-[#0f0f0f] px-5 py-5 flex flex-col gap-0.5" style={{minHeight:320}}>
                {LOG_LINES.map((line,i)=>(
                  logVisible.includes(i) && (
                    <div key={i} className="rv-slide flex items-baseline gap-3 text-[11px]">
                      <span className="text-[#252525] shrink-0 text-right" style={{minWidth:28}}>{line.ms}</span>
                      <span className="shrink-0 font-bold" style={{color:line.col, minWidth:40}}>[{line.tag}]</span>
                      <span style={{color:i===LOG_LINES.length-1?"#d4d4d4":"#3a3a3a"}}>
                        {line.msg}
                        {i===LOG_LINES.length-1 && <span className="rv-blink text-[#22c55e]"> ▌</span>}
                      </span>
                    </div>
                  )
                ))}
              </div>

              {/* prompt bar */}
              <div className="flex items-center gap-3 px-5 py-2.5 bg-[#0f0f0f] border-t border-[#1a1a1a]">
                <span className="text-[11px] font-extrabold text-[#8b5cf6]">Revoirt</span>
                <span className="text-[11px] text-[#22c55e]">❯</span>
                <span className="text-[11px] text-[#2e2e2e]">npm run dev</span>
                <span className="rv-blink text-[11px] text-[#38bdf8] ml-auto">▌</span>
              </div>
            </div>

            {/* collab badge */}
            <div className="flex items-center gap-3 px-4 py-3 border border-[#1e1e1e] bg-[#141414]">
              <div className="flex" style={{marginLeft:4}}>
                {CURSORS.map(u=>(
                  <div key={u.i} className="flex items-center justify-center text-[8px] font-extrabold text-white border border-[#181818]"
                    style={{width:22,height:22,background:u.color,marginLeft:-4}}>{u.i}</div>
                ))}
              </div>
              <span className="text-[10px] text-[#363636]">3 collaborators online · room/alpha-squad</span>
              <span className="rv-dot ml-auto text-[9px] text-[#22c55e]">● synced</span>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none">
          <div className="text-[9px] text-[#252525] tracking-[.3em]">SCROLL</div>
          <div className="w-px h-7" style={{background:"linear-gradient(to bottom,#252525,transparent)"}}/>
        </div>
      </section>

      {/* ── IDE PREVIEW ─────────────────────────────────────────── */}
      <section className="border-t border-[#222] py-24 px-6">
        <div className="max-w-[1200px] mx-auto">

          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <p className="text-[10px] text-[#8b5cf6] tracking-[.3em] mb-2">// THE EDITOR</p>
              <h2 className="font-bold text-[#e5e7eb]" style={{fontSize:"clamp(22px,3.5vw,36px)"}}>Everything in one window.</h2>
            </div>
            <div className="text-[11px] text-[#2e2e2e] border-l-2 border-[#252525] pl-4 leading-relaxed">
              Monaco · xterm.js<br/><span className="text-[#22c55e]">IndexedDB · CRDT</span>
            </div>
          </div>

          {/* IDE shell */}
          <div className="border border-[#252525] overflow-hidden">

            {/* chrome */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#1c1c1c] border-b border-[#252525]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 bg-[#ff5f57]"/>
                <div className="w-2.5 h-2.5 bg-[#febc2e]"/>
                <div className="w-2.5 h-2.5 bg-[#28c840]"/>
              </div>
              <div className="flex-1 text-center text-[10px] text-[#363636] tracking-[.15em]">REVOIRT · room/alpha-squad</div>
              <div className="flex" style={{gap:2}}>
                {CURSORS.map(u=>(
                  <div key={u.i} className="flex items-center justify-center text-[8px] font-extrabold text-white border border-[#181818]"
                    style={{width:20,height:20,background:u.color,marginLeft:-3}}>{u.i}</div>
                ))}
              </div>
            </div>

            {/* editor body */}
            <div className="flex" style={{height:380}}>

              {/* sidebar */}
              <div className="w-40 bg-[#161616] border-r border-[#222] py-3 shrink-0 overflow-y-auto">
                <div className="text-[9px] text-[#2a2a2a] tracking-[.25em] px-3 pb-2 mb-1 border-b border-[#1e1e1e]">EXPLORER</div>
                {FILES.map(f=>(
                  <div key={f.n} className="flex items-center gap-1.5 py-[3px] cursor-pointer transition-colors duration-100"
                    style={{
                      paddingLeft:`${f.d*10+12}px`, paddingRight:8, fontSize:11,
                      color:f.active?"#8b5cf6":"#333",
                      background:f.active?"rgba(139,92,246,.08)":"transparent",
                      borderLeft:f.active?"2px solid #8b5cf6":"2px solid transparent",
                    }}
                    onMouseEnter={e=>{if(!f.active)(e.currentTarget.style.color="#666")}}
                    onMouseLeave={e=>{if(!f.active)(e.currentTarget.style.color="#333")}}>
                    <span style={{opacity:.35,fontSize:9}}>{f.icon}</span>
                    <span className="truncate">{f.n}</span>
                  </div>
                ))}
              </div>

              {/* editor pane */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* tabs */}
                <div className="flex text-[11px] shrink-0 bg-[#161616] border-b border-[#222]">
                  {["editor.ts","session.ts"].map((t,i)=>(
                    <div key={t} className="px-4 py-2 border-r border-[#222] shrink-0"
                      style={{
                        color:i===0?"#e5e7eb":"#333",
                        background:i===0?"#181818":"transparent",
                        borderTop:i===0?"1px solid #8b5cf6":"none",
                      }}>{t}</div>
                  ))}
                </div>
                {/* code */}
                <div className="flex-1 bg-[#181818] px-4 py-3 overflow-y-auto" style={{fontSize:12,lineHeight:"20px"}}>
                  {CODE.map((tokens,i)=>(
                    <div key={i} className="flex relative">
                      <span className="shrink-0 text-right text-[#252525] mr-4 select-none text-[11px]" style={{width:28}}>{i+1}</span>
                      <span className="flex-1 relative">
                        {CURSORS.find(c=>c.line===i) && (
                          <span className="absolute z-10 text-[8px] font-extrabold text-white px-1.5 leading-4 whitespace-nowrap"
                            style={{top:-1,left:0,background:CURSORS.find(c=>c.line===i)!.color}}>
                            {CURSORS.find(c=>c.line===i)!.name}
                          </span>
                        )}
                        {CURSORS.some(c=>c.line===i) && (
                          <span className="absolute inset-0" style={{opacity:.06, background:CURSORS.find(c=>c.line===i)!.color}}/>
                        )}
                        {tokens.map((tok,j)=><span key={j} style={{color:tok.c}}>{tok.t}</span>)}
                        {CURSORS[activeCur].line===i && (
                          <span className="inline-block align-middle ml-0.5"
                            style={{width:2,height:14,background:CURSORS[activeCur].color,opacity:curOn?1:0}}/>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* terminal strip */}
            <div className="border-t border-[#222]">
              <div className="flex text-[10px] border-b border-[#1a1a1a]">
                {["TERMINAL","PROBLEMS","OUTPUT"].map((t,i)=>(
                  <div key={t} className="px-4 py-1.5 tracking-[.15em] shrink-0"
                    style={{color:i===0?"#22c55e":"#282828", borderBottom:i===0?"1px solid #22c55e":"none"}}>{t}</div>
                ))}
              </div>
              <div className="bg-[#181818] px-4 py-2.5 h-[68px] text-[11px] leading-[1.6]">
                <div><span className="text-[#8b5cf6] font-extrabold">Revoirt </span><span className="text-[#22c55e]">❯ </span><span className="text-[#424242]">npm run dev</span></div>
                <div className="text-[#252525] text-[10px] mt-0.5">{"  "}→ Ready on <span className="text-[#38bdf8]">http://localhost:3000</span></div>
                <div className="text-[#252525] text-[10px]">{"  "}✓ Compiled in 847ms · 3 peers connected</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ──────────────────────────────────────── */}
      <section className="border-t border-[#222] py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-12">
            <p className="text-[10px] text-[#8b5cf6] tracking-[.3em] mb-2">// FEATURES</p>
            <h2 className="font-bold text-[#e5e7eb]" style={{fontSize:"clamp(22px,3.5vw,36px)"}}>Built for teams who ship.</h2>
          </div>

          {/* gap-px bento: parent bg = gap color */}
          <div className="grid grid-cols-3 gap-px bg-[#222]">
            {FEATURES.map(f=>(
              <div key={f.id}
                className="relative overflow-hidden bg-[#181818] p-9 cursor-default transition-colors duration-150 hover:bg-[#1c1c1c]"
                style={{gridColumn:f.span===2?"span 2":"span 1"}}>
                {/* accent top line */}
                <div className="absolute top-0 left-0 right-0 h-px" style={{background:f.accent, opacity:.65}}/>
                {/* watermark */}
                <div className="absolute bottom-[-12px] right-[-4px] font-extrabold leading-none select-none pointer-events-none text-[#1d1d1d]"
                  style={{fontSize:"5rem"}}>{f.id}</div>
                <p className="text-[11px] font-semibold tracking-[.18em] mb-4" style={{color:f.accent}}>[{f.tag}]</p>
                <h3 className="text-[15px] font-bold text-[#e5e7eb] mb-2.5 relative">{f.title}</h3>
                <p className="text-[12px] text-[#424242] leading-[1.8] relative">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLLAB SECTION ──────────────────────────────────────── */}
      <section className="border-t border-[#222] py-24 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 gap-20 items-start">

          <div>
            <p className="text-[10px] text-[#38bdf8] tracking-[.3em] mb-4">// REAL-TIME PRESENCE</p>
            <h2 className="font-bold text-[#e5e7eb] mb-5" style={{fontSize:"clamp(20px,3vw,32px)"}}>
              See everyone's cursor.<br/>Always.
            </h2>
            <p className="text-[12px] text-[#424242] leading-[1.85] mb-8">
              Every keystroke, selection, and terminal command is synchronized across all collaborators.
              User groups let you control who sees what and who can edit.
            </p>
            <div className="flex flex-col gap-3">
              {[
                {label:"Conflict-free CRDT (Yjs) under the hood", color:"#8b5cf6"},
                {label:"Named cursors · color-coded selections",   color:"#38bdf8"},
                {label:"Shared xterm.js terminal sessions",        color:"#22c55e"},
                {label:"Role-based access control (RBAC)",         color:"#f59e0b"},
                {label:"Offline-first · auto-reconcile on reconnect", color:"#ef4444"},
              ].map(({label,color})=>(
                <div key={label} className="flex items-center gap-3 text-[12px] text-[#424242]">
                  <div className="shrink-0" style={{width:4,height:4,background:color}}/>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* session panel */}
          <div className="border border-[#222] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-[#161616] border-b border-[#222]">
              <span className="text-[9px] text-[#282828] tracking-[.2em]">ACTIVE SESSION · room/alpha-squad</span>
              <span className="rv-dot text-[9px] text-[#22c55e]">● live</span>
            </div>
            {CURSORS.map(u=>(
              <div key={u.i} className="flex items-center gap-4 px-4 py-3.5 border-b border-[#1a1a1a] transition-colors duration-100 hover:bg-[#1c1c1c]">
                <div className="flex items-center justify-center text-[11px] font-extrabold text-white shrink-0"
                  style={{width:32,height:32,background:u.color}}>{u.i}</div>
                <div className="flex-1">
                  <div className="text-[13px] text-[#b0b0b0] mb-0.5">{u.name}</div>
                  <div className="text-[10px] text-[#2e2e2e]">Line {u.line} · editor.ts</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rv-dot" style={{width:6,height:6,background:"#22c55e"}}/>
                  <span className="text-[10px] text-[#2e2e2e]">editing</span>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#141414] text-[10px] text-[#252525]">
              <span className="text-[#22c55e]">●</span>
              3 users · last sync 8ms · CRDT v2
            </div>
          </div>
        </div>
      </section>

      {/* ── FILE EXPLORER SECTION ───────────────────────────────── */}
      <section className="border-t border-[#222] py-24 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 gap-20 items-start">

          {/* file explorer mockup */}
          <div className="border border-[#222] overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 bg-[#161616] border-b border-[#222]">
              <span className="text-[9px] text-[#282828] tracking-[.2em]">FILE EXPLORER · idb://revoirt</span>
              <span className="text-[9px] text-[#22c55e]">● synced</span>
            </div>
            <div className="px-4 py-1.5 text-[10px] text-[#2e2e2e] border-b border-[#1a1a1a]">
              root / src / <span className="text-[#8b5cf6]">editor.ts</span>
            </div>
            {/* col header */}
            <div className="grid px-4 py-1.5 text-[9px] text-[#242424] tracking-[.1em] border-b border-[#1a1a1a]"
              style={{gridTemplateColumns:"24px 1fr 64px 72px"}}>
              <span/><span>NAME</span>
              <span className="text-right">SIZE</span>
              <span className="text-right">MODIFIED</span>
            </div>
            {[
              {icon:"▾",name:"root",      size:"—",     mod:"just now",dir:true},
              {icon:"▾",name:"src",       size:"—",     mod:"2m ago",  dir:true},
              {icon:"·",name:"editor.ts", size:"4.2 KB",mod:"just now",active:true},
              {icon:"·",name:"session.ts",size:"2.1 KB",mod:"5m ago"},
              {icon:"·",name:"idb.ts",    size:"6.8 KB",mod:"12m ago"},
              {icon:"·",name:"terminal.ts",size:"3.3 KB",mod:"1h ago"},
              {icon:"·",name:"types.ts",  size:"1.1 KB",mod:"2h ago"},
            ].map((f,i)=>(
              <div key={i} className="grid items-center px-4 py-[7px] cursor-pointer transition-colors duration-100"
                style={{
                  gridTemplateColumns:"24px 1fr 64px 72px", fontSize:11,
                  color:f.active?"#8b5cf6":"#3a3a3a",
                  background:f.active?"rgba(139,92,246,.07)":i%2?"rgba(255,255,255,.008)":"transparent",
                  borderLeft:f.active?"2px solid #8b5cf6":"2px solid transparent",
                }}
                onMouseEnter={e=>{if(!f.active)(e.currentTarget.style.color="#666")}}
                onMouseLeave={e=>{if(!f.active)(e.currentTarget.style.color="#3a3a3a")}}>
                <span style={{opacity:.3}}>{f.icon}</span>
                <span>{f.name}</span>
                <span className="text-right text-[#1e1e1e]">{f.size}</span>
                <span className="text-right text-[10px] text-[#1c1c1c]">{f.mod}</span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-2 text-[10px] text-[#202020] border-t border-[#1a1a1a]">
              <span>7 items · 17.5 KB</span><span>stored in idb</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-[#22c55e] tracking-[.3em] mb-4">// BROWSER-NATIVE STORAGE</p>
            <h2 className="font-bold text-[#e5e7eb] mb-5" style={{fontSize:"clamp(20px,3vw,32px)"}}>
              Your files never<br/>leave the browser.
            </h2>
            <p className="text-[12px] text-[#424242] leading-[1.85] mb-8">
              The file explorer runs entirely on IndexedDB and sessionStorage.
              No cloud uploads. No S3 buckets. No latency.
              Files persist across sessions; collaboration sync is via CRDT patches — not file transfers.
            </p>
            <div className="flex flex-col gap-3">
              {[
                {label:"IndexedDB persistence",            color:"#22c55e"},
                {label:"sessionStorage for ephemeral state",color:"#38bdf8"},
                {label:"CRDT patch-based collaboration",   color:"#8b5cf6"},
                {label:"Zero server file uploads",         color:"#f59e0b"},
                {label:"Works offline · reconciles on reconnect",color:"#ef4444"},
              ].map(({label,color})=>(
                <div key={label} className="flex items-center gap-3 text-[12px] text-[#424242]">
                  <div className="shrink-0" style={{width:4,height:4,background:color}}/>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="border-t border-[#222] py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] text-[#8b5cf6] tracking-[.3em] mb-2">// HOW IT WORKS</p>
            <h2 className="font-bold text-[#e5e7eb]" style={{fontSize:"clamp(22px,4vw,38px)"}}>Up in 60 seconds.</h2>
          </div>
          <div className="grid grid-cols-3 gap-px bg-[#222]">
            {STEPS.map((s,i)=>(
              <div key={s.n} className="relative bg-[#181818] px-9 py-12 overflow-hidden">
                <div className="absolute top-[-16px] right-[-4px] font-extrabold text-[#1c1c1c] leading-none select-none pointer-events-none"
                  style={{fontSize:"7rem"}}>{s.n}</div>
                {i<2 && <div className="absolute top-1/2 right-0 w-px h-8 bg-[#222] -translate-y-1/2"/>}
                <p className="text-[10px] text-[#8b5cf6] tracking-[.25em] mb-5 relative">{s.n}</p>
                <h3 className="text-[15px] font-bold text-[#e5e7eb] mb-2.5 relative">{s.title}</h3>
                <p className="text-[12px] text-[#424242] leading-[1.7] relative">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="relative border-t border-[#222] py-24 px-6 overflow-hidden">
        {/* corner brackets */}
        <div className="absolute top-0 left-0 h-px w-16 bg-[rgba(139,92,246,.22)]"/>
        <div className="absolute top-0 left-0 w-px h-16 bg-[rgba(139,92,246,.22)]"/>
        <div className="absolute bottom-0 right-0 h-px w-16 bg-[rgba(56,189,248,.16)]"/>
        <div className="absolute bottom-0 right-0 w-px h-16 bg-[rgba(56,189,248,.16)]"/>

        {/* glow */}
        <div className="rv-glow absolute pointer-events-none"
          style={{width:500,height:180,left:"50%",top:"50%",transform:"translate(-50%,-50%)",
            background:"radial-gradient(ellipse,rgba(139,92,246,.2) 0%,transparent 70%)",filter:"blur(30px)"}}/>

        <div className="relative z-10 max-w-[520px] mx-auto text-center">
          <p className="text-[10px] text-[#8b5cf6] tracking-[.3em] mb-4">// GET EARLY ACCESS</p>
          <h2 className="font-extrabold text-[#e5e7eb] mb-2 leading-[1.1]"
            style={{fontSize:"clamp(28px,5vw,52px)"}}>
            Start coding<br/>
            <span className="text-[#8b5cf6]">together</span>
            <span className="rv-blink text-[#38bdf8]">▌</span>
          </h2>
          <p className="text-[12px] text-[#343434] mb-10">Free for teams up to 5. No credit card required.</p>
          <div className="flex">
            <input type="email" placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-[#141414] border border-[#282828] text-[#e5e7eb] text-[11px] outline-none transition-colors duration-150 focus:border-[#8b5cf6]"
              style={{fontFamily:M, borderRight:"none"}}/>
            <button className="shrink-0 px-6 py-3 bg-[#8b5cf6] text-white text-[11px] font-bold tracking-[.1em] border-none cursor-pointer transition-colors duration-150 hover:bg-[#7c3aed]"
              style={{fontFamily:M}}>GET ACCESS →</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-[#222] py-6 px-6">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <rect x="0" y="0" width="7" height="7" stroke="#8b5cf6" strokeWidth="1" fill="none"/>
              <rect x="11" y="11" width="7" height="7" stroke="#38bdf8" strokeWidth="1" fill="none"/>
              <line x1="7" y1="3.5" x2="14.5" y2="3.5" stroke="#8b5cf6" strokeWidth="1"/>
              <line x1="14.5" y1="3.5" x2="14.5" y2="11" stroke="#8b5cf6" strokeWidth="1"/>
              <line x1="3.5" y1="7" x2="3.5" y2="14.5" stroke="#38bdf8" strokeWidth="1"/>
              <line x1="3.5" y1="14.5" x2="11" y2="14.5" stroke="#38bdf8" strokeWidth="1"/>
            </svg>
            <span className="text-[#8b5cf6] font-extrabold text-[11px] tracking-[.18em]">REVOIRT</span>
          </div>
          <span className="text-[9px] text-[#232323]">© 2025 Revoirt Inc. All rights reserved.</span>
          <div className="flex gap-6">
            {["Privacy","Terms","GitHub","Twitter"].map(l=>(
              <a key={l} href="#" className="text-[9px] text-[#272727] no-underline tracking-[.12em] transition-colors duration-150 hover:text-[#666]">{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}