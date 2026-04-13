import type { Terminal } from "@xterm/xterm";
import type { file } from "../../../states/store";

const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

export const runCurrentFile = async (term: Terminal, file: file | undefined, writePrompt: Function) => {
  const Babel = await import("@babel/standalone" as any);

  if (!file) 
    { term.write("\r\n\x1b[41m\tNo file open\x1b[0m\n") }
   else 
    { term.write(`\r\n\x1b[42m\t${file?.name} is executed.....\x1b[0m\n`) };

  const js = Babel.transform(file?.content, {
    presets: ["typescript"],
    filename: "file.ts",
  }).code;

  const fn = AsyncFunction(js);
  fn();
  writePrompt();
};


