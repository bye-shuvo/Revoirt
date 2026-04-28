import { useState, useEffect, useRef } from "react";

/* ── font + keyframes ─────────────────────────────────────────── */
const BOOT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,600;0,800;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'JetBrains Mono', monospace !important; }
  ::-webkit-scrollbar { width: 3px; background: #111; }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; }
  @keyframes rv-blink  { 0%,49%{opacity:1}50%,100%{opacity:0} }
  @keyframes rv-slide  { from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none} }
  @keyframes rv-up     { from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none} }
  @keyframes rv-dot    { 0%,100%{opacity:.3}50%{opacity:1} }
  @keyframes rv-scan   { from{top:-2px}to{top:100%} }
  @keyframes rv-march  { to{stroke-dashoffset:-16} }
  .blink  { animation: rv-blink  1.1s step-end infinite; }
  .slide  { animation: rv-slide  .4s ease both; }
  .up     { animation: rv-up     .5s ease both; }
  .dot    { animation: rv-dot    2s   ease-in-out infinite; }
  .march  { stroke-dasharray:4 4; animation: rv-march .6s linear infinite; }
`;

/* ── static data ──────────────────────────────────────────────── */
const NAV = ["Features", "Docs", "Changelog", "GitHub"];

const LOG_LINES = [
  { ms: "000", tag: "SYS",   col: "#555",    msg: "revoirt v0.9.1 initializing..." },
  { ms: "012", tag: "IDB",   col: "#22c55e", msg: "IndexedDB mount OK  ·  17.5 KB" },
  { ms: "045", tag: "WS",    col: "#38bdf8", msg: "WebSocket handshake  ·  room/alpha-squad" },
  { ms: "048", tag: "CRDT",  col: "#8b5cf6", msg: "Yjs doc loaded  ·  3 peers connected" },
  { ms: "071", tag: "TERM",  col: "#f59e0b", msg: "xterm.js session spawned  ·  shared i/o" },
  { ms: "089", tag: "FS",    col: "#22c55e", msg: "File tree hydrated  ·  8 entries" },
  { ms: "093", tag: "MON",   col: "#8b5cf6", msg: "Monaco language server ready  ·  TypeScript" },
  { ms: "101", tag: "SYNC",  col: "#38bdf8", msg: "Initial sync complete  ·  <50 ms" },
  { ms: "___", tag: "READY", col: "#22c55e", msg: "Session live ▌" },
];

const CODE = [
  [{ c:"#c678dd", t:"import " },{ c:"#e5e7eb", t:"{ revoirt } " },{ c:"#c678dd", t:"from " },{ c:"#98c379", t:"'@revoirt/core'" }],
  [],
  [{ c:"#5c6370", t:"// connect to a collaborative session" }],
  [{ c:"#c678dd", t:"const " },{ c:"#61afef", t:"session" },{ c:"#e5e7eb", t:" = " },{ c:"#c678dd", t:"await " },{ c:"#e5e7eb", t:"revoirt." },{ c:"#61afef", t:"connect" },{ c:"#e5e7eb", t:"({" }],
  [{ c:"#e06c75", t:"  room" },{ c:"#e5e7eb", t:": " },{ c:"#98c379", t:"'alpha-squad'" },{ c:"#e5e7eb", t:"," }],
  [{ c:"#e06c75", t:"  collab" },{ c:"#e5e7eb", t:": " },{ c:"#d19a66", t:"true" },{ c:"#e5e7eb", t:"," }],
  [{ c:"#e06c75", t:"  terminal" },{ c:"#e5e7eb", t:": " },{ c:"#d19a66", t:"true" },{ c:"#e5e7eb", t:"," }],
  [{ c:"#e06c75", t:"  storage" },{ c:"#e5e7eb", t:": " },{ c:"#98c379", t:"'idb'" }],
  [{ c:"#e5e7eb", t:"})" }],
  [],
  [{ c:"#5c6370", t:"// real-time presence" }],
  [{ c:"#e5e7eb", t:"session." },{ c:"#61afef", t:"onJoin" },{ c:"#e5e7eb", t:"((" },{ c:"#e06c75", t:"u" },{ c:"#e5e7eb", t:") => console." },{ c:"#61afef", t:"log" },{ c:"#e5e7eb", t:"(u." },{ c:"#e06c75", t:"name" },{ c:"#e5e7eb", t:"))" }],
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
  {
    id:"F1", accent:"#8b5cf6", tag:"monaco · yjs · ws", span:2,
    title:"Collaborative Editor",
    body:"Monaco-powered, real-time CRDT sync. Named cursors, shared selections, conflict-free replicated edits. Everyone codes on the same document simultaneously.",
  },
  {
    id:"F2", accent:"#38bdf8", tag:"xterm.js · shared i/o", span:1,
    title:"Web Terminal",
    body:"xterm.js shell — every keystroke shared. Run commands, see output together. No SSH. No setup.",
  },
  {
    id:"F3", accent:"#22c55e", tag:"idb · sessionstorage", span:1,
    title:"Local File Explorer",
    body:"Entire filesystem in IndexedDB + sessionStorage. No uploads. Your files never leave the browser.",
  },
  {
    id:"F4", accent:"#f59e0b", tag:"rooms · rbac", span:1,
    title:"User Groups & Rooms",
    body:"Invite by link, assign roles, restrict writes. Private and public sessions with granular permissions.",
  },
  {
    id:"F5", accent:"#ef4444", tag:"<50ms · crdt v2 · offline-first", span:2,
    title:"Zero-Latency Sync",
    body:"Sub-50ms WebSocket sync with CRDT. No merge conflicts. Offline-first with auto-reconcile on reconnect.",
  },
];

const STEPS = [
  { n:"01", title:"Create a Room",    body:"Name it, pick access mode, grab invite link in 10 seconds." },
  { n:"02", title:"Invite Your Team", body:"Share link. Everyone lands in same editor with live cursors." },
  { n:"03", title:"Ship Together",    body:"Edit, run terminal, manage files — zero config, zero latency." },
];

/* ── component ────────────────────────────────────────────────── */
export default function Home() {
  const MONO: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
  const [typed, setTyped]       = useState("");
  const [curOn,  setCurOn]      = useState(true);
  const [logIdx, setLogIdx]     = useState(0);
  const [activeCur, setActiveCur] = useState(0);
  const [logVisible, setLogVisible] = useState<number[]>([]);
  const TAGLINE = "Code together. Ship faster.";

  useEffect(() => {
    /* inject styles */
    if (!document.getElementById("rv-boot")) {
      const s = document.createElement("style");
      s.id = "rv-boot"; s.textContent = BOOT_STYLES;
      document.head.appendChild(s);
    }

    let i = 0;
    const tw = setInterval(() => { i++; setTyped(TAGLINE.slice(0, i)); if (i >= TAGLINE.length) clearInterval(tw); }, 52);
    const bl = setInterval(() => setCurOn(v => !v), 530);
    const cc = setInterval(() => setActiveCur(v => (v + 1) % CURSORS.length), 2000);

    /* boot log reveal */
    let l = 0;
    const lg = setInterval(() => {
      setLogVisible(v => [...v, l]);
      l++;
      if (l >= LOG_LINES.length) clearInterval(lg);
    }, 180);

    return () => { clearInterval(tw); clearInterval(bl); clearInterval(cc); clearInterval(lg); };
  }, []);

  /* ── accent border helper ───── */
  const accentBorder = (color: string) => ({
    borderLeft: `2px solid ${color}`,
  });

  return (
    <div style={{ ...MONO, background:"#181818", color:"#e5e7eb", minHeight:"100dvh", overflowX:"hidden" }}>

      {/* ════════════════════════════════════════════
          NAV
      ════════════════════════════════════════════ */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        background:"rgba(24,24,24,.96)", backdropFilter:"blur(4px)",
        borderBottom:"1px solid #222", height:48,
        display:"flex", alignItems:"center",
      }}>
        <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">

          {/* logo */}
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="0" y="0" width="7" height="7" stroke="#8b5cf6" strokeWidth="1" fill="none"/>
              <rect x="11" y="11" width="7" height="7" stroke="#38bdf8" strokeWidth="1" fill="none"/>
              <line x1="7" y1="3.5" x2="14.5" y2="3.5" stroke="#8b5cf6" strokeWidth="1"/>
              <line x1="14.5" y1="3.5" x2="14.5" y2="11" stroke="#8b5cf6" strokeWidth="1"/>
              <line x1="3.5" y1="7" x2="3.5" y2="14.5" stroke="#38bdf8" strokeWidth="1"/>
              <line x1="3.5" y1="14.5" x2="11" y2="14.5" stroke="#38bdf8" strokeWidth="1"/>
            </svg>
            <span style={{ color:"#8b5cf6", fontWeight:800, fontSize:12, letterSpacing:"0.18em" }}>REVOIRT</span>
          </div>

          {/* links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV.map(l => (
              <a key={l} href="#" className="text-[11px] tracking-widest transition-colors duration-150"
                style={{ color:"#444", textDecoration:"none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#e5e7eb")}
                onMouseLeave={e => (e.currentTarget.style.color = "#444")}>{l}</a>
            ))}
          </div>

          {/* cta */}
          <div className="flex gap-2">
            <button className="text-[11px] px-4 py-2 transition-colors duration-150"
              style={{ background:"none", border:"1px solid #2a2a2a", color:"#666", cursor:"pointer", ...MONO }}
              onMouseEnter={e => { (e.currentTarget.style.borderColor="#444"); (e.currentTarget.style.color="#ccc"); }}
              onMouseLeave={e => { (e.currentTarget.style.borderColor="#2a2a2a"); (e.currentTarget.style.color="#666"); }}>
              Sign In
            </button>
            <button className="text-[11px] px-5 py-2 font-bold tracking-wider"
              style={{ background:"#8b5cf6", border:"none", color:"#fff", cursor:"pointer", ...MONO }}
              onMouseEnter={e => (e.currentTarget.style.background="#7c3aed")}
              onMouseLeave={e => (e.currentTarget.style.background="#8b5cf6")}>
              GET STARTED
            </button>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════════
          HERO  —  asymmetric split: text | boot log
      ════════════════════════════════════════════ */}
      <section style={{ minHeight:"100dvh", paddingTop:48, position:"relative", overflow:"hidden" }}>

        {/* faint grid */}
        <div style={{
          position:"absolute", inset:0, opacity:.03,
          backgroundImage:"linear-gradient(#e5e7eb 1px,transparent 1px),linear-gradient(90deg,#e5e7eb 1px,transparent 1px)",
          backgroundSize:"56px 56px", pointerEvents:"none",
        }}/>

        {/* geometric corner lines (inherited pattern, refined) */}
        {/* top-left */}
        <div style={{ position:"absolute", top:"14%", left:0, width:"16vw", height:1, background:"rgba(139,92,246,.18)", pointerEvents:"none" }}>
          <div style={{ position:"absolute", right:0, top:0, width:1, height:"28vh", background:"rgba(139,92,246,.18)" }}>
            <div style={{ position:"absolute", bottom:0, left:0, width:"12vw", height:1, background:"rgba(139,92,246,.18)" }}/>
            <div style={{ position:"absolute", top:-3, left:-3, width:6, height:6, background:"#8b5cf6", opacity:.5 }}/>
          </div>
          <div style={{ position:"absolute", left:0, top:-3, width:6, height:6, background:"#8b5cf6", opacity:.3 }}/>
        </div>
        {/* top-right */}
        <div style={{ position:"absolute", top:0, right:"22%", width:1, height:"10vh", background:"rgba(56,189,248,.15)", pointerEvents:"none" }}>
          <div style={{ position:"absolute", top:0, left:0, width:"18vw", height:1, background:"rgba(56,189,248,.15)" }}>
            <div style={{ position:"absolute", top:0, right:0, width:1, height:"14vh", background:"rgba(56,189,248,.15)" }}/>
          </div>
        </div>
        {/* bottom-right */}
        <div style={{ position:"absolute", bottom:"12%", right:0, width:"16vw", height:1, background:"rgba(56,189,248,.13)", pointerEvents:"none" }}>
          <div style={{ position:"absolute", left:0, bottom:0, width:1, height:"22vh", background:"rgba(56,189,248,.13)" }}>
            <div style={{ position:"absolute", top:0, right:0, width:"10vw", height:1, background:"rgba(56,189,248,.13)" }}/>
          </div>
        </div>
        {/* bottom-left */}
        <div style={{ position:"absolute", bottom:0, left:"20%", width:1, height:"10vh", background:"rgba(34,197,94,.1)", pointerEvents:"none" }}>
          <div style={{ position:"absolute", bottom:0, left:0, width:"18vw", height:1, background:"rgba(34,197,94,.1)" }}>
            <div style={{ position:"absolute", bottom:0, left:0, width:1, height:"12vh", background:"rgba(34,197,94,.1)" }}/>
          </div>
          <div style={{ position:"absolute", bottom:-3, left:-3, width:6, height:6, background:"#22c55e", opacity:.35 }}/>
        </div>

        {/* ── split grid ── */}
        <div style={{
          maxWidth:1200, margin:"0 auto", padding:"0 24px",
          display:"grid", gridTemplateColumns:"1fr 1fr",
          gap:0, minHeight:"calc(100dvh - 48px)",
          alignItems:"center",
        }}>

          {/* LEFT — hero text */}
          <div style={{ padding:"64px 0", position:"relative", zIndex:2 }}>

            {/* badge */}
            <div className="up inline-flex items-center gap-2 mb-12 text-[10px] tracking-[.25em]"
              style={{ border:"1px solid #252525", padding:"6px 12px", color:"#8b5cf6" }}>
              <span className="dot" style={{ width:6, height:6, background:"#22c55e", display:"inline-block" }}/>
              PUBLIC BETA · NOW LIVE
            </div>

            {/* wordmark */}
            <h1 style={{
              fontSize:"clamp(3.8rem,10vw,7.5rem)", fontWeight:800, color:"#8b5cf6",
              letterSpacing:"-0.02em", lineHeight:1,
              border:"1px solid rgba(139,92,246,.2)",
              display:"inline-block", padding:"2px 20px 4px",
              marginBottom:32,
              textShadow:"0 0 100px rgba(139,92,246,.1)",
            }}>
              REVOIRT
            </h1>

            {/* typewriter */}
            <p style={{ fontSize:"clamp(15px,2vw,20px)", color:"#5a5a5a", marginBottom:16, letterSpacing:".04em", minHeight:"1.5em" }}>
              {typed}
              <span className="blink" style={{ color:"#38bdf8" }}>▌</span>
            </p>

            <p style={{ fontSize:12, color:"#363636", maxWidth:440, lineHeight:1.85, marginBottom:44 }}>
              Browser-native collaborative IDE — Monaco editor, integrated terminal,
              and a full file explorer powered entirely by IndexedDB.
            </p>

            {/* cta row */}
            <div className="flex flex-wrap gap-3 mb-16">
              <button style={{ padding:"12px 28px", background:"#8b5cf6", border:"none", color:"#fff", fontSize:11, fontWeight:700, letterSpacing:".12em", cursor:"pointer", ...MONO }}
                onMouseEnter={e => (e.currentTarget.style.background="#7c3aed")}
                onMouseLeave={e => (e.currentTarget.style.background="#8b5cf6")}>
                START FOR FREE →
              </button>
              <button style={{ padding:"12px 28px", background:"none", border:"1px solid #2a2a2a", color:"#555", fontSize:11, letterSpacing:".12em", cursor:"pointer", ...MONO }}
                onMouseEnter={e => { (e.currentTarget.style.borderColor="#8b5cf6"); (e.currentTarget.style.color="#ccc"); }}
                onMouseLeave={e => { (e.currentTarget.style.borderColor="#2a2a2a"); (e.currentTarget.style.color="#555"); }}>
                VIEW DEMO
              </button>
            </div>

            {/* stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", border:"1px solid #222", maxWidth:320 }}>
              {[["12k+","DEVS"],["<50ms","SYNC"],["99.9%","UPTIME"]].map(([v, l], i) => (
                <div key={l} style={{ padding:"16px 0", textAlign:"center", borderRight: i < 2 ? "1px solid #222" : "none" }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#e5e7eb" }}>{v}</div>
                  <div style={{ fontSize:9, color:"#383838", letterSpacing:".2em", marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — boot log terminal */}
          <div style={{ padding:"64px 0 64px 40px", position:"relative", zIndex:2 }}>
            <div style={{ border:"1px solid #252525", overflow:"hidden" }}>

              {/* terminal chrome */}
              <div style={{ background:"#1c1c1c", borderBottom:"1px solid #252525", padding:"9px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div className="flex gap-1.5">
                  <div style={{ width:9, height:9, background:"#ff5f57" }}/>
                  <div style={{ width:9, height:9, background:"#febc2e" }}/>
                  <div style={{ width:9, height:9, background:"#28c840" }}/>
                </div>
                <span style={{ fontSize:9, color:"#333", letterSpacing:".2em" }}>REVOIRT TERMINAL · boot sequence</span>
                <span className="dot" style={{ fontSize:9, color:"#22c55e" }}>● LIVE</span>
              </div>

              {/* log output */}
              <div style={{ background:"#111", padding:"20px 20px", minHeight:340, display:"flex", flexDirection:"column", gap:2 }}>
                {LOG_LINES.map((line, i) => (
                  logVisible.includes(i) && (
                    <div key={i} className="slide" style={{ display:"flex", gap:12, alignItems:"baseline", fontSize:11 }}>
                      <span style={{ color:"#2e2e2e", minWidth:28, textAlign:"right", flexShrink:0 }}>{line.ms}</span>
                      <span style={{ color:line.col, minWidth:36, flexShrink:0, fontWeight:700 }}>[{line.tag}]</span>
                      <span style={{ color: i === LOG_LINES.length - 1 ? "#e5e7eb" : "#484848" }}>
                        {line.msg}{i === LOG_LINES.length - 1 && <span className="blink" style={{ color:"#22c55e" }}>▌</span>}
                      </span>
                    </div>
                  )
                ))}
              </div>

              {/* prompt */}
              <div style={{ background:"#111", borderTop:"1px solid #1a1a1a", padding:"10px 20px", display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ color:"#8b5cf6", fontWeight:800, fontSize:11 }}>Revoirt </span>
                <span style={{ color:"#22c55e", fontSize:11 }}>❯</span>
                <span style={{ fontSize:11, color:"#333" }}>npm run dev</span>
                <span className="blink" style={{ color:"#38bdf8", fontSize:11 }}>▌</span>
              </div>
            </div>

            {/* collaborators online badge */}
            <div style={{ marginTop:16, display:"flex", alignItems:"center", gap:12, padding:"10px 14px", border:"1px solid #1e1e1e", background:"#1a1a1a" }}>
              <div className="flex -space-x-1">
                {CURSORS.map(u => (
                  <div key={u.i} style={{ width:22, height:22, background:u.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:800, color:"#fff", border:"1px solid #181818" }}>
                    {u.i}
                  </div>
                ))}
              </div>
              <span style={{ fontSize:10, color:"#383838" }}>3 collaborators online · room/alpha-squad</span>
              <span className="dot ml-auto" style={{ fontSize:9, color:"#22c55e" }}>● synced</span>
            </div>
          </div>

        </div>

        {/* scroll indicator */}
        <div style={{ position:"absolute", bottom:24, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:6, pointerEvents:"none" }}>
          <div style={{ fontSize:9, color:"#2a2a2a", letterSpacing:".3em" }}>SCROLL</div>
          <div style={{ width:1, height:28, background:"linear-gradient(to bottom,#2a2a2a,transparent)" }}/>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          IDE PREVIEW
      ════════════════════════════════════════════ */}
      <section style={{ borderTop:"1px solid #222", padding:"96px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>

          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:48, flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ fontSize:10, color:"#8b5cf6", letterSpacing:".3em", marginBottom:10 }}>// THE EDITOR</div>
              <h2 style={{ fontSize:"clamp(22px,3.5vw,36px)", fontWeight:700, color:"#e5e7eb" }}>Everything in one window.</h2>
            </div>
            <div style={{ fontSize:11, color:"#333", borderLeft:"2px solid #252525", paddingLeft:16, lineHeight:1.6 }}>
              Monaco · xterm.js<br/>
              <span style={{ color:"#22c55e" }}>IndexedDB · CRDT</span>
            </div>
          </div>

          {/* IDE shell */}
          <div style={{ border:"1px solid #252525", overflow:"hidden" }}>

            {/* chrome */}
            <div style={{ background:"#1c1c1c", borderBottom:"1px solid #252525", padding:"10px 16px", display:"flex", alignItems:"center", gap:12 }}>
              <div className="flex gap-1.5">
                <div style={{ width:10, height:10, background:"#ff5f57" }}/>
                <div style={{ width:10, height:10, background:"#febc2e" }}/>
                <div style={{ width:10, height:10, background:"#28c840" }}/>
              </div>
              <div style={{ flex:1, textAlign:"center", fontSize:10, color:"#383838", letterSpacing:".15em" }}>REVOIRT · room/alpha-squad</div>
              <div className="flex gap-0.5">
                {CURSORS.map(u => (
                  <div key={u.i} style={{ width:20, height:20, background:u.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:800, color:"#fff", marginLeft:-3, border:"1px solid #181818" }}>
                    {u.i}
                  </div>
                ))}
              </div>
            </div>

            {/* body: sidebar + editor */}
            <div style={{ display:"flex", height:380 }}>

              {/* file sidebar */}
              <div style={{ width:160, background:"#1a1a1a", borderRight:"1px solid #222", padding:"12px 0", flexShrink:0, overflowY:"auto" }}>
                <div style={{ fontSize:9, color:"#2e2e2e", letterSpacing:".25em", padding:"0 12px 8px", borderBottom:"1px solid #1e1e1e", marginBottom:4 }}>EXPLORER</div>
                {FILES.map(f => (
                  <div key={f.n} style={{
                    display:"flex", alignItems:"center", gap:6,
                    padding:`4px ${f.d * 10 + 12}px`,
                    fontSize:11, cursor:"pointer",
                    color: f.active ? "#8b5cf6" : "#3a3a3a",
                    background: f.active ? "rgba(139,92,246,.08)" : "transparent",
                    borderLeft: f.active ? "2px solid #8b5cf6" : "2px solid transparent",
                  }}
                  onMouseEnter={e => { if (!f.active) (e.currentTarget.style.color="#666"); }}
                  onMouseLeave={e => { if (!f.active) (e.currentTarget.style.color="#3a3a3a"); }}>
                    <span style={{ opacity:.4, fontSize:9 }}>{f.icon}</span>
                    <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.n}</span>
                  </div>
                ))}
              </div>

              {/* editor pane */}
              <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

                {/* tabs */}
                <div style={{ background:"#1a1a1a", borderBottom:"1px solid #222", display:"flex", fontSize:11, flexShrink:0 }}>
                  {["editor.ts","session.ts"].map((t, i) => (
                    <div key={t} style={{
                      padding:"8px 16px", borderRight:"1px solid #222",
                      color: i === 0 ? "#e5e7eb" : "#3a3a3a",
                      background: i === 0 ? "#181818" : "transparent",
                      borderTop: i === 0 ? "1px solid #8b5cf6" : "none",
                      flexShrink:0,
                    }}>{t}</div>
                  ))}
                </div>

                {/* code */}
                <div style={{ flex:1, background:"#181818", padding:"12px 16px", overflowY:"auto", fontSize:12, lineHeight:"20px" }}>
                  {CODE.map((tokens, i) => (
                    <div key={i} style={{ display:"flex", position:"relative" }}>
                      <span style={{ width:28, textAlign:"right", color:"#2e2e2e", marginRight:16, flexShrink:0, userSelect:"none", fontSize:11 }}>{i + 1}</span>
                      <span style={{ flex:1, position:"relative" }}>
                        {/* cursor flag */}
                        {CURSORS.find(c => c.line === i) && (
                          <span style={{
                            position:"absolute", top:-1, left:0,
                            fontSize:8, padding:"1px 5px", fontWeight:700,
                            color:"#fff", zIndex:2, whiteSpace:"nowrap",
                            background: CURSORS.find(c => c.line === i)!.color,
                          }}>
                            {CURSORS.find(c => c.line === i)!.name}
                          </span>
                        )}
                        {/* line bg */}
                        {CURSORS.some(c => c.line === i) && (
                          <span style={{
                            position:"absolute", inset:0, opacity:.06,
                            background: CURSORS.find(c => c.line === i)!.color,
                          }}/>
                        )}
                        {tokens.map((tok, j) => (
                          <span key={j} style={{ color:tok.c }}>{tok.t}</span>
                        ))}
                        {/* blinking cursor for active */}
                        {CURSORS[activeCur].line === i && (
                          <span style={{
                            display:"inline-block", width:2, height:14, verticalAlign:"middle", marginLeft:1,
                            background: CURSORS[activeCur].color,
                            opacity: curOn ? 1 : 0,
                          }}/>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* terminal panel */}
            <div style={{ borderTop:"1px solid #222" }}>
              <div style={{ display:"flex", borderBottom:"1px solid #1e1e1e", fontSize:10 }}>
                {["TERMINAL","PROBLEMS","OUTPUT"].map((t, i) => (
                  <div key={t} style={{
                    padding:"6px 16px", letterSpacing:".15em", flexShrink:0,
                    color: i === 0 ? "#22c55e" : "#2a2a2a",
                    borderBottom: i === 0 ? "1px solid #22c55e" : "none",
                  }}>{t}</div>
                ))}
              </div>
              <div style={{ background:"#181818", padding:"10px 16px", height:72, fontSize:11, lineHeight:1.6 }}>
                <div>
                  <span style={{ color:"#8b5cf6", fontWeight:800 }}>Revoirt </span>
                  <span style={{ color:"#22c55e" }}>❯ </span>
                  <span style={{ color:"#484848" }}>npm run dev</span>
                </div>
                <div style={{ color:"#2e2e2e", fontSize:10, marginTop:2 }}>
                  {"  "}→ Ready on <span style={{ color:"#38bdf8" }}>http://localhost:3000</span>
                </div>
                <div style={{ color:"#2e2e2e", fontSize:10 }}>{"  "}✓ Compiled in 847ms · 3 peers connected</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURES — bento gap-px grid
      ════════════════════════════════════════════ */}
      <section style={{ borderTop:"1px solid #222", padding:"96px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>

          <div style={{ marginBottom:48 }}>
            <div style={{ fontSize:10, color:"#8b5cf6", letterSpacing:".3em", marginBottom:10 }}>// FEATURES</div>
            <h2 style={{ fontSize:"clamp(22px,3.5vw,36px)", fontWeight:700, color:"#e5e7eb" }}>Built for teams who ship.</h2>
          </div>

          {/* grid — gap-px trick: parent bg = border color */}
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(3,1fr)",
            gap:1, background:"#222",
          }}>
            {FEATURES.map(f => (
              <div key={f.id} style={{
                background:"#181818", padding:"36px 32px",
                gridColumn: f.span === 2 ? "span 2" : "span 1",
                position:"relative", overflow:"hidden",
                transition:"background .15s",
                cursor:"default",
              }}
              onMouseEnter={e => (e.currentTarget.style.background="#1c1c1c")}
              onMouseLeave={e => (e.currentTarget.style.background="#181818")}>

                {/* top accent line on hover */}
                <div style={{
                  position:"absolute", top:0, left:0, right:0, height:1,
                  background:f.accent, opacity:.6,
                }}/>

                {/* large watermark id */}
                <div style={{
                  position:"absolute", bottom:-12, right:-4,
                  fontSize:"5rem", fontWeight:800, color:"#1c1c1c",
                  lineHeight:1, userSelect:"none", pointerEvents:"none",
                }}>{f.id}</div>

                <div style={{ fontSize:12, color:f.accent, letterSpacing:".2em", marginBottom:16, fontWeight:600 }}>
                  [{f.tag}]
                </div>
                <h3 style={{ fontSize:15, fontWeight:700, color:"#e5e7eb", marginBottom:10, position:"relative" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize:12, color:"#484848", lineHeight:1.8, position:"relative" }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          COLLABORATION DEEP-DIVE
      ════════════════════════════════════════════ */}
      <section style={{ borderTop:"1px solid #222", padding:"96px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"start" }}>

          {/* left */}
          <div>
            <div style={{ fontSize:10, color:"#38bdf8", letterSpacing:".3em", marginBottom:16 }}>// REAL-TIME PRESENCE</div>
            <h2 style={{ fontSize:"clamp(20px,3vw,32px)", fontWeight:700, color:"#e5e7eb", marginBottom:20 }}>
              See everyone's cursor.<br/>Always.
            </h2>
            <p style={{ fontSize:12, color:"#484848", lineHeight:1.85, marginBottom:32 }}>
              Every keystroke, selection, and terminal command is synchronized across all collaborators.
              User groups let you control who sees what and who can edit.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { label:"Conflict-free CRDT (Yjs) under the hood", color:"#8b5cf6" },
                { label:"Named cursors · color-coded selections", color:"#38bdf8" },
                { label:"Shared xterm.js terminal sessions", color:"#22c55e" },
                { label:"Role-based access control (RBAC)", color:"#f59e0b" },
                { label:"Offline-first · auto-reconcile on reconnect", color:"#ef4444" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-3" style={{ fontSize:12, color:"#484848" }}>
                  <div style={{ width:4, height:4, background:color, flexShrink:0 }}/>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* right — session panel */}
          <div style={{ border:"1px solid #222", overflow:"hidden" }}>
            <div style={{ background:"#1c1c1c", borderBottom:"1px solid #222", padding:"8px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:9, color:"#2e2e2e", letterSpacing:".2em" }}>ACTIVE SESSION · room/alpha-squad</span>
              <span className="dot" style={{ fontSize:9, color:"#22c55e" }}>● live</span>
            </div>
            {CURSORS.map(u => (
              <div key={u.i} style={{
                display:"flex", alignItems:"center", gap:14,
                padding:"14px 16px", borderBottom:"1px solid #1e1e1e",
                transition:"background .15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background="#1c1c1c")}
              onMouseLeave={e => (e.currentTarget.style.background="transparent")}>
                <div style={{ width:32, height:32, background:u.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff", flexShrink:0 }}>
                  {u.i}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:"#c0c0c0", marginBottom:2 }}>{u.name}</div>
                  <div style={{ fontSize:10, color:"#333" }}>Line {u.line} · editor.ts</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="dot" style={{ width:6, height:6, background:"#22c55e" }}/>
                  <span style={{ fontSize:10, color:"#333" }}>editing</span>
                </div>
              </div>
            ))}
            <div style={{ background:"#1a1a1a", padding:"10px 16px", fontSize:10, color:"#2a2a2a", display:"flex", gap:6, alignItems:"center" }}>
              <span style={{ color:"#22c55e" }}>●</span>
              3 users · last sync 8ms · CRDT v2
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════
          FILE EXPLORER SECTION
      ════════════════════════════════════════════ */}
      <section style={{ borderTop:"1px solid #222", padding:"96px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"start" }}>

          {/* file explorer mockup */}
          <div style={{ border:"1px solid #222", overflow:"hidden" }}>
            <div style={{ background:"#1c1c1c", borderBottom:"1px solid #222", padding:"8px 14px", display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:9, color:"#2e2e2e", letterSpacing:".2em" }}>FILE EXPLORER · idb://revoirt</span>
              <span style={{ fontSize:9, color:"#22c55e" }}>● synced</span>
            </div>
            {/* breadcrumb */}
            <div style={{ borderBottom:"1px solid #1a1a1a", padding:"6px 14px", fontSize:10, color:"#333" }}>
              root / src / <span style={{ color:"#8b5cf6" }}>editor.ts</span>
            </div>
            {/* col header */}
            <div style={{
              display:"grid", gridTemplateColumns:"24px 1fr 64px 72px",
              padding:"5px 14px", fontSize:9, color:"#2a2a2a",
              letterSpacing:".1em", borderBottom:"1px solid #1a1a1a",
            }}>
              <span/>
              <span>NAME</span><span style={{ textAlign:"right" }}>SIZE</span>
              <span style={{ textAlign:"right" }}>MODIFIED</span>
            </div>
            {[
              { icon:"▾", name:"root",       size:"—",     mod:"just now", dir:true },
              { icon:"▾", name:"src",        size:"—",     mod:"2m ago",   dir:true },
              { icon:"·", name:"editor.ts",  size:"4.2 KB",mod:"just now", active:true },
              { icon:"·", name:"session.ts", size:"2.1 KB",mod:"5m ago" },
              { icon:"·", name:"idb.ts",     size:"6.8 KB",mod:"12m ago" },
              { icon:"·", name:"terminal.ts",size:"3.3 KB",mod:"1h ago" },
              { icon:"·", name:"types.ts",   size:"1.1 KB",mod:"2h ago" },
            ].map((f, i) => (
              <div key={i} style={{
                display:"grid", gridTemplateColumns:"24px 1fr 64px 72px",
                padding:"7px 14px", fontSize:11,
                background: f.active ? "rgba(139,92,246,.07)" : i % 2 ? "rgba(255,255,255,.008)" : "transparent",
                color: f.active ? "#8b5cf6" : "#444",
                borderLeft: f.active ? "2px solid #8b5cf6" : "2px solid transparent",
                cursor:"pointer", alignItems:"center",
              }}
              onMouseEnter={e => { if (!f.active) (e.currentTarget.style.color="#777"); }}
              onMouseLeave={e => { if (!f.active) (e.currentTarget.style.color="#444"); }}>
                <span style={{ opacity:.35 }}>{f.icon}</span>
                <span>{f.name}</span>
                <span style={{ color:"#252525", textAlign:"right" }}>{f.size}</span>
                <span style={{ color:"#222", textAlign:"right", fontSize:10 }}>{f.mod}</span>
              </div>
            ))}
            <div style={{ borderTop:"1px solid #1a1a1a", padding:"8px 14px", fontSize:10, color:"#252525", display:"flex", justifyContent:"space-between" }}>
              <span>7 items · 17.5 KB</span>
              <span>stored in idb</span>
            </div>
          </div>

          {/* right — text */}
          <div>
            <div style={{ fontSize:10, color:"#22c55e", letterSpacing:".3em", marginBottom:16 }}>// BROWSER-NATIVE STORAGE</div>
            <h2 style={{ fontSize:"clamp(20px,3vw,32px)", fontWeight:700, color:"#e5e7eb", marginBottom:20 }}>
              Your files never<br/>leave the browser.
            </h2>
            <p style={{ fontSize:12, color:"#484848", lineHeight:1.85, marginBottom:32 }}>
              The file explorer runs entirely on IndexedDB and sessionStorage.
              No cloud uploads. No S3 buckets. No latency.
              Files persist across sessions; collaboration sync is via CRDT patches — not file transfers.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { label:"IndexedDB persistence", color:"#22c55e" },
                { label:"sessionStorage for ephemeral state", color:"#38bdf8" },
                { label:"CRDT patch-based collaboration", color:"#8b5cf6" },
                { label:"Zero server file uploads", color:"#f59e0b" },
                { label:"Works offline · reconciles on reconnect", color:"#ef4444" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-3" style={{ fontSize:12, color:"#484848" }}>
                  <div style={{ width:4, height:4, background:color, flexShrink:0 }}/>
                  {label}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════ */}
      <section style={{ borderTop:"1px solid #222", padding:"96px 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ fontSize:10, color:"#8b5cf6", letterSpacing:".3em", marginBottom:10 }}>// HOW IT WORKS</div>
            <h2 style={{ fontSize:"clamp(22px,4vw,38px)", fontWeight:700, color:"#e5e7eb" }}>Up in 60 seconds.</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:"#222" }}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{ background:"#181818", padding:"48px 36px", position:"relative", overflow:"hidden" }}>
                {/* watermark */}
                <div style={{ position:"absolute", top:-16, right:-4, fontSize:"7rem", fontWeight:800, color:"#1d1d1d", lineHeight:1, userSelect:"none", pointerEvents:"none" }}>{s.n}</div>
                {/* step connector */}
                {i < 2 && <div style={{ position:"absolute", top:"50%", right:0, width:1, height:32, background:"#222", transform:"translateY(-50%)" }}/>}
                <div style={{ fontSize:10, color:"#8b5cf6", letterSpacing:".25em", marginBottom:20, position:"relative" }}>{s.n}</div>
                <h3 style={{ fontSize:15, fontWeight:700, color:"#e5e7eb", marginBottom:10, position:"relative" }}>{s.title}</h3>
                <p style={{ fontSize:12, color:"#484848", lineHeight:1.7, position:"relative" }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════ */}
      <section style={{ borderTop:"1px solid #222", padding:"96px 24px", position:"relative", overflow:"hidden" }}>
        {/* corner bracket decorations */}
        <div style={{ position:"absolute", top:0, left:0, width:60, height:1, background:"rgba(139,92,246,.2)" }}/>
        <div style={{ position:"absolute", top:0, left:0, width:1, height:60, background:"rgba(139,92,246,.2)" }}/>
        <div style={{ position:"absolute", bottom:0, right:0, width:60, height:1, background:"rgba(56,189,248,.15)" }}/>
        <div style={{ position:"absolute", bottom:0, right:0, width:1, height:60, background:"rgba(56,189,248,.15)" }}/>

        <div style={{ maxWidth:560, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontSize:10, color:"#8b5cf6", letterSpacing:".3em", marginBottom:16 }}>// GET EARLY ACCESS</div>
          <h2 style={{ fontSize:"clamp(28px,5vw,52px)", fontWeight:800, color:"#e5e7eb", marginBottom:8, lineHeight:1.1 }}>
            Start coding<br/>
            <span style={{ color:"#8b5cf6" }}>together</span>
            <span className="blink" style={{ color:"#38bdf8" }}>▌</span>
          </h2>
          <p style={{ fontSize:12, color:"#383838", marginBottom:40 }}>Free for teams up to 5. No credit card required.</p>

          <div className="flex">
            <input type="email" placeholder="your@email.com" style={{
              flex:1, padding:"12px 16px", background:"#1a1a1a",
              border:"1px solid #2a2a2a", borderRight:"none",
              color:"#e5e7eb", fontSize:11, outline:"none", ...MONO,
            }}
            onFocus={e => (e.currentTarget.style.borderColor="#8b5cf6")}
            onBlur={e => (e.currentTarget.style.borderColor="#2a2a2a")}/>
            <button style={{ padding:"12px 24px", background:"#8b5cf6", border:"none", color:"#fff", fontSize:11, fontWeight:700, letterSpacing:".1em", cursor:"pointer", flexShrink:0, ...MONO }}
              onMouseEnter={e => (e.currentTarget.style.background="#7c3aed")}
              onMouseLeave={e => (e.currentTarget.style.background="#8b5cf6")}>
              GET ACCESS →
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
      <footer style={{ borderTop:"1px solid #222", padding:"24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div className="flex items-center gap-3">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <rect x="0" y="0" width="7" height="7" stroke="#8b5cf6" strokeWidth="1" fill="none"/>
              <rect x="11" y="11" width="7" height="7" stroke="#38bdf8" strokeWidth="1" fill="none"/>
              <line x1="7" y1="3.5" x2="14.5" y2="3.5" stroke="#8b5cf6" strokeWidth="1"/>
              <line x1="14.5" y1="3.5" x2="14.5" y2="11" stroke="#8b5cf6" strokeWidth="1"/>
              <line x1="3.5" y1="7" x2="3.5" y2="14.5" stroke="#38bdf8" strokeWidth="1"/>
              <line x1="3.5" y1="14.5" x2="11" y2="14.5" stroke="#38bdf8" strokeWidth="1"/>
            </svg>
            <span style={{ color:"#8b5cf6", fontWeight:800, fontSize:11, letterSpacing:".18em" }}>REVOIRT</span>
          </div>
          <span style={{ fontSize:9, color:"#252525" }}>© 2025 Revoirt Inc. All rights reserved.</span>
          <div className="flex gap-6">
            {["Privacy","Terms","GitHub","Twitter"].map(l => (
              <a key={l} href="#" style={{ fontSize:9, color:"#2a2a2a", textDecoration:"none", letterSpacing:".12em" }}
                onMouseEnter={e => (e.currentTarget.style.color="#666")}
                onMouseLeave={e => (e.currentTarget.style.color="#2a2a2a")}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
