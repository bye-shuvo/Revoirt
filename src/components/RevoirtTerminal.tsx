import { useEffect, useRef } from "react";

import { Terminal } from "@xterm/xterm"
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import "@xterm/xterm/css/xterm.css";
import { useCloseTerm } from "../states/store";

const PROMPT = "\x1B[1;3;31mRevoirt \x1B[0m\x1b[1;32m❯\x1b[0m "; // green ❯ prompt

const RevoirtTerminal = () => {
  const terminalElementRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal>(null);

  const setCloseTerm = useCloseTerm((state) => state.setCloseTerm);

  const inputBuffer = useRef<string>("");

  const writePromt = () => {
    termRef.current?.write("\r\n" + PROMPT);
  }

  const handleCommand = (command : string) => {
    const term = termRef.current;
    if(!term) return ;

    const cmd = command.trim();

    if(!cmd){
      writePromt();
      return;
    }

    if(cmd === "clear" || cmd === "cls" || cmd === "clc"){
      term.write("\x1b[2J\x1b[H");
      term.write('Hello from \x1B[1;3;31mRevoirt\x1B[0m');
      writePromt();
      return;
    }

    if(cmd === "help"){
      term.write("\r\n\x1b[36mavailable commands:\x1b[0m clear, help");
      writePromt();
      return;
    }

    if(cmd === "exit"){
      term.write("\x1b[2J\x1b[H");
      setCloseTerm(true);
    }

  term.write(`\r\n\x1b[31mcommand not found:\x1b[0m ${cmd}`);
  writePromt();
  }

  useEffect(() => {
    termRef.current = new Terminal({
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

    const term = termRef.current ;

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    term.open(terminalElementRef.current);
    term.write('Hello from \x1B[1;3;31mRevoirt\x1B[0m');
    writePromt();

    term.onData((data) => {
      switch (data) {

        //Enter keystroke to submit the current buffer as cmd
        case "\r" : {
          const cmd = inputBuffer.current;
          inputBuffer.current = "";
          handleCommand(cmd);
          break;
        }

        //BackSpace keystroke to remove the last char from the buffer and erase from the screen
        case "\x7f" : {
          if(inputBuffer.current.length === 0) return ;
          inputBuffer.current = inputBuffer.current.slice(0 , -1);
          term.write("\b \b");
          break;
        }

        //Ctrl + C to cancle current line
        case "\x03" : {
          inputBuffer.current = "" ;
          term.write("^C");
          writePromt();
          break;
        }

        // Ctrl+L — clear screen
        case "\x0c" : {
          term.clear();
          term.write('Hello from \x1B[1;3;31mRevoirt\x1B[0m');
          writePromt();
          break;
        }

        default : {
          if(data.startsWith("\x1b")) return ;
          term.write(data);
          inputBuffer.current += data ;
        }

      }
    });

    return () => {term.dispose()};
  }, [])

  return (
    <div ref={terminalElementRef} className="bg-[#181818] w-full h-full border-t border-t-gray-600 p-5">

    </div>
  )
}

export default RevoirtTerminal;
