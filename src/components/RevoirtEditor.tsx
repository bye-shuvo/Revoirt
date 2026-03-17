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
  const setPath = useFilePath((state) => state.setPath);

  const setValue = useValue((state) => state.setValue);
  const [file, setFile] = useState<file>();

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleEditorChange = (value: any) => setValue(value);

  useEffect(() => {
    (async () => {
      const files : file[] = await getAllFiles();
      setPath(files[0].path);
      const openFile = files.find((file: file) => file.path === path)
      setFile(openFile);
      console.log(files);
      console.log(path);
      console.log(openFile);
    })();
  }, [path]);

  return (
    <>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={file?.content}
        defaultValue="//Hi , Welcome To Revoirt "
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
    </>
  )
}

export default RevoirtEditor
