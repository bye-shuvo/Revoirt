import Editor from "@monaco-editor/react"
import { useRef, useEffect, useState } from "react";

import { useFilePath, useValue } from "../states/store.ts";
import { getAllFiles } from "./utils/useIndexedDB.ts";


interface file {
  path: string,  // primary key
  name: string,
  type: string,
  extension: string,
  parentPath: string,
  content: string,
  createdAt: Date,
  updatedAt: Date,
}

const RevoirtEditor = () => {
  const editorRef = useRef(null);
  const path = useFilePath((state) => state.path);

  const setValue = useValue((state) => state.setValue);
  const [file, setFile] = useState<file>();

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleEditorChange = (value: any) => setValue(value);

  useEffect(() => {
    (async () => {
      const files: file[] = await getAllFiles();
      const openFile = files.find((file: file) => file.path === path)
      setFile(openFile);
    })();
  }, [path]);

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
            value={file?.content}
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
            onChange={handleEditorChange}
          />
      }
    </>
  )
}

export default RevoirtEditor
