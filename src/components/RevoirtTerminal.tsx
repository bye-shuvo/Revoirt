import { useEffect, useRef } from "react";

import { Terminal } from "@xterm/xterm"
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import "@xterm/xterm/css/xterm.css";

const RevoirtTerminal = () => {
  const terminalElementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: "block",
      fontSize: 18,
      fontFamily: 'Fira Code, monospace',
      theme: {
        background: '#181818',
        foreground: '#e5e7eb',
        cursor: '#38bdf8',
      },
      scrollback: 2000,
      tabStopWidth: 2,
      convertEol: true,
      disableStdin: false,
    });
    if (!terminalElementRef.current) return;

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    term.open(terminalElementRef.current);
    term.write('Hello from \x1B[1;3;31mRevoirt\x1B[0m $ ')
    return () => term.dispose();
  }, [])
  return (
    <div ref={terminalElementRef} className="bg-green-400 w-full h-full">

    </div>
  )
}

export default RevoirtTerminal;
