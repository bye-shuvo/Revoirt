import { useEffect, useRef } from "react";

import { Terminal } from "@xterm/xterm"
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import "@xterm/xterm/css/xterm.css";
import { useCloseTerm, useFiles, useFilePath, type file } from "../states/store.ts";
import { runCurrentFile } from "./utils/runtimes/javascriptRuntime.ts";

const PROMPT = "\x1B[1;3;37mRevoirt \x1B[0m\x1b[37m>\x1b[0m "; // green ❯ prompt

const RevoirtTerminal = () => {
  const terminalElementRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal>(null);
  const fileNames = useRef<string[] | undefined>(null);

  const closeTerm = useCloseTerm((state) => state.closeTerm);
  const setCloseTerm = useCloseTerm((state) => state.setCloseTerm);
  const files = useFiles((state) => state.files);
  const path = useFilePath((state) => state.path);
  const filesRef = useRef(files);
  const pathRef = useRef(path);

  const inputBuffer = useRef<string>("");

  const writePrompt = () => {
    termRef.current?.write("\r\n" + PROMPT);
  }
  const initialRenderPrompt = () => {
    termRef.current?.write(`
\t\t\t░█████████                                   ░██            ░██    
\t\t\t░██     ░██                                                 ░██    
\t\t\t░██     ░██  ░███████  ░██    ░██  ░███████  ░██ ░██░████ ░████████ 
\t\t\t░█████████  ░██    ░██ ░██    ░██ ░██    ░██ ░██ ░███        ░██    
\t\t\t░██   ░██   ░█████████  ░██  ░██  ░██    ░██ ░██ ░██         ░██    
\t\t\t░██    ░██  ░██          ░██░██   ░██    ░██ ░██ ░██         ░██    
\t\t\t░██     ░██  ░███████     ░███     ░███████  ░██ ░██         ░████ 
\n\t\t\t \x1b[38;5;208m --- A Collaborative Code Editor\x1b[0m\n`)
  }


  const handleCommand = async (command: string , file? : file) => {
    const term = termRef.current;
    if (!term) return;

    const cmd = command.trim();

    if (!cmd) {
      writePrompt();
      return;
    }

    if (cmd === "clear" || cmd === "cls" || cmd === "clc") {
      term.clear();
      term.write("\x1b[2J\x1b[H");
      initialRenderPrompt();
      writePrompt();
      return;
    }

    if (cmd === "help" || cmd === "--h") {
      term.write("\r\n\x1b[42m\tAvailable commands:\x1b[0m \n\t 1.clear or clc or cls \n\t 2.help or --h \n\t 3.exit \n\t 4.version or --v \n\t 5.files or --f \n\t 6.run\n");
      writePrompt();
      return;
    }

    if (cmd === "exit") {
      writePrompt();
      setCloseTerm(true);
      return;
    }

    if (cmd === "version" || cmd === "--v") {
      term.write(`\n\x1b[46m\tRevoirt Terminal 1.0.0\x1b[0m\n`);
      writePrompt();
      return;
    }

    if (cmd === "files" || cmd === "--f") {
      term.write(`\n\x1b[45m\tRevoirt File Explorer:\x1b[0m`);
      fileNames.current?.map((name, index) => {
        term.write(`\n\t\x1b[37m${index + 1}. ${name}\x1b[0m`);
      })
      term.write(`\n`);
      writePrompt();
      return;
    }

    if (cmd === "run") {
      runCurrentFile(term, file, writePrompt);   // async — writePrompt() called inside when done
      return;
    }

    term.write(`\r\n\x1b[41m\tCommand not found:\x1b[0m ${cmd} \n`);
    writePrompt();
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

    const term = termRef.current;

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    fitAddon.fit();

    const ro = new ResizeObserver(() => { requestAnimationFrame(() => { fitAddon.fit() }) });
    ro.observe(terminalElementRef.current);

    term.open(terminalElementRef.current);
    initialRenderPrompt();
    writePrompt();
    term.focus();

    term.onData((data) => {
      switch (data) {

        //Enter keystroke to submit the current buffer as cmd
        case "\r": {
          const cmd = inputBuffer.current;
          inputBuffer.current = "";
          if(cmd === "run"){
            const file = filesRef.current?.find((f) => f.path === pathRef.current);
            handleCommand(cmd , file);
          }
          else{
            handleCommand(cmd);
          }
          break;
        }

        //BackSpace keystroke to remove the last char from the buffer and erase from the screen
        case "\x7f": {
          if (inputBuffer.current.length === 0) return;
          inputBuffer.current = inputBuffer.current.slice(0, -1);
          term.write("\b \b");
          break;
        }

        //Ctrl + C to cancle current line
        case "\x03": {
          inputBuffer.current = "";
          term.write("^C");
          writePrompt();
          break;
        }

        // Ctrl+L — clear screen
        case "\x0c": {
          term.clear();
          term.write("\x1b[2J\x1b[H")
          initialRenderPrompt();
          writePrompt();
          break;
        }

        default: {
          if (data.startsWith("\x1b")) return;
          term.write(data);
          inputBuffer.current += data;
        }

      }
    });

    return () => { term.dispose(); ro.disconnect() };
  }, [])

  useEffect(() => {
    if (closeTerm) {
      termRef.current?.blur();
    }
  }, [closeTerm])

  useEffect(() => {
    fileNames.current = files?.map((file) => {
      return file.name;
    })
  }, [files])


  useEffect(() => {
    filesRef.current = files;
    if (!termRef.current || !files || !pathRef.current) return;
    const name = filesRef.current?.find((f) => f.path === pathRef.current)?.name;
    termRef.current?.write(`\x1b[32m${name} is saved\x1b[0m\r\n`); writePrompt()
  }, [files]);

  useEffect(() => { pathRef.current = path; }, [path]);

  return (
    <div ref={terminalElementRef} className="bg-[#181818] w-full h-full border-t border-t-gray-600 p-5 no-scrollbar overflow-y-scroll">

    </div>
  )
}

export default RevoirtTerminal;
