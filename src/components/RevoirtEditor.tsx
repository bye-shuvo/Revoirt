import Editor from "@monaco-editor/react"
import { useRef , useEffect  ,useState} from "react";

import { useValue } from "../states/store";
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
  const value = useValue((state) => state.value);
  const setValue = useValue((state) => state.setValue);
  const [files, setFiles] = useState<file[]>([]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleEditorChange = (value: any) => setValue(value);

  useEffect(() => {
    (async () => {
      const files = await getAllFiles();
      setFiles(files);
      console.log(files);
    })();
  }, []);
  return (
    <>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={files[0]?.content}
        defaultValue="//Hi , Welcome To Revoirt "
        theme="vs-dark"
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
