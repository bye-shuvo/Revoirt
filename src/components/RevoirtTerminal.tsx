import { Terminal } from "@xterm/xterm"
import { useEffect, useRef } from "react";

const RevoirtTerminal = () => {
  const terminalElementRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const term = new Terminal({}) ;
    if(!terminalElementRef.current) return ;
    term.open(terminalElementRef.current);
    term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
  } , [])
  return (
    <footer ref={terminalElementRef} className="bg-green-400 w-full h-full">
      
    </footer>
  )
}

export default RevoirtTerminal;
