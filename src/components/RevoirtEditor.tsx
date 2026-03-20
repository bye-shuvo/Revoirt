import Editor from "@monaco-editor/react"
import { useRef, useEffect, useState } from "react";

import { useFilePath } from "../states/store.ts";
import { putFile, getAllFiles } from "./utils/useIndexedDB.ts";

interface file {
  path: string,  // primary key
  name: string,
  type: string,
  extension: string,
  parentPath: string,
  content: string,
  createdAt: number,
  updatedAt: number,
}

const RevoirtEditor = () => {
  const editorRef = useRef(null);
  const path = useFilePath((state) => state.path);

  const [file, setFile] = useState<file>();
  const [value, setValue] = useState("");

  const refreshEditor = async (): Promise<void> => {
    const files: file[] = await getAllFiles();
    const openFile = files.find((file: file) => file.path === path)
    setFile(openFile);
    setValue(openFile?.content ?? "");
  }

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleValueChange = (value: string | undefined) => {
    if (value !== undefined) {
      setValue(value);
    }
  }

  const updateFile = async (e: KeyboardEvent): Promise<void> => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();

      if (!file) return;

      const updatedFile: file = { ...file, content: value, updatedAt: Date.now() }

      await putFile(updatedFile);
    }
  }

  useEffect(() => {
    refreshEditor();
  }, [path]);

  useEffect(() => {
    document.addEventListener("keydown", updateFile);
    return () => document.removeEventListener("keydown", updateFile);
  }, [file , value])

  return (
    <>
      {
        !path ? <div className="h-full bg-inherit flex justify-center items-center flex-col gap-5 text-white">
          <h1 className="text-5xl">Welcome To <span className="font-bold text-transparent bg-linear-90 from-red-500 to-blue-500 bg-clip-text">Revoirt</span></h1>
          <h2 className="text-xl border border-gray-400 p-2">Code Together | Build Fast</h2>
          <p className="text-2xl text-white">Create a new file to get started !!!</p>
        </div> :
          <Editor
            height="100%"
            language={file?.type}
            value={value}
            theme="vs-dark"
            path={path}
            options={{
              fontSize: 20,
              minimap: { enabled: true },
              automaticLayout: true,
              wordWrap: "on",
              tabSize: 2,
              cursorStyle: "line",
              formatOnPaste: true,
              renderLineHighlight: "all",
              mouseWheelZoom: true,
              fontFamily: "Fira Code",
            }}
            onMount={handleEditorDidMount}
            onChange={handleValueChange}
          />
      }
    </>
  )
}

export default RevoirtEditor
