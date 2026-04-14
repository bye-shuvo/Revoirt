import type { Terminal } from "@xterm/xterm";
import type { file } from "../../../states/store";

const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

export const runCurrentFile = async (term: Terminal, file: file | undefined, writePrompt: Function) => {
  //Babel import by bypassing the typescript
  const Babel = await import("@babel/standalone" as any);

  //open file manage for xterm
  const ext = file?.name.split(".").pop() ?? "js";
  const supportedExt = ["js", "ts", "jsx", "tsx"];

  if (!file) {
    term.write("\r\n\x1b[41m\tNo file open\x1b[0m\n");
    writePrompt();
    return
  }
  else {
    if (!supportedExt.includes(ext)) {
      term.write(`\r\n\t\x1b[41m ${file?.name} is not supported\x1b[0m\n`);
      writePrompt();
      return;
    }
    else {
      term.write(`\r\n\x1b[42m\t${file?.name} is executed.....\x1b[0m\n\n`)
    };

  }

  //Transpile ts/tsx -> js
  let js = file.content ;

  try {
    const presets: string[] = [];

    if (["ts", "tsx"].includes(ext)) presets.push("typescript");
    if (["jsx", "tsx"].includes(ext)) presets.push("react");

    js = Babel.transform(file?.content, {
      presets: presets,
      filename: file.name,
    }).code ?? file.content;

  } catch (error : any) {
    term.write(`\r\n\t\x1b[31mTranspile error : ${error?.message}\x1b[0m\n`);
    writePrompt();
    return ;
  }
 
  //  Hijacking the console to display the output in the xterm
  const prev = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
  };

  const write = (color: string, ...args: any[] ) => {
    //raw code -> raw string line
    const line : string = args.map((a) => { 
      return (typeof a === "object") ? JSON.stringify(a , null , 2).replace("\n" , "\r\n") : String(a)
    }).join(" ");

    term.write(`\t${color}${line}\x1b[0m\r\n`);
  }

  console.log = (...a) => { prev.log(a); write("\x1b[37m", ...a); };
  console.error = (...a) => { prev.error(a); write("\x1b[31m", ...a) };
  console.warn = (...a) => { prev.warn(a); write("\x1b[33m", ...a) };
  console.info = (...a) => { prev.info(a); write("\x1b[36m", ...a) };

  //code execution

  try {
    const fn = new AsyncFunction(js);
    const result = await fn();
    
    if(result !== undefined){
      write("\t\x1b[2m" , "<-" + JSON.stringify(result));
    }
  } catch (error : any) {
    write("\x1b[31m", "✖ " + error.message);
  }
  finally{
    Object.assign(console , prev); //always restore the console var .
  }

  writePrompt();
};


