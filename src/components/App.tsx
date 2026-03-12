import Editor, { type Monaco } from "@monaco-editor/react";
import { useRef, useState } from "react"
import FileExplorar from "./FileExplorar";
import Terminal from "./Terminal";
import Navigation from "./Navigation";

const App = () => {
  const editorRef = useRef<Monaco>(null);
  const [value , setValue] = useState("");

  const handleEditorDidMount = (editor: any, monoco: any) => {
    editorRef.current = editor;
    editor.focus();
  }
  const showValue = () => {
    alert(editorRef.current!.getValue());

  }

  const handleEditorChange = (value : any) => setValue(value) ;

  return (
    <main className="h-screen w-screen">
      <Navigation />
      <div className="h-[95%] w-full flex items-end">
        <FileExplorar value={value}/>
        <div className="h-full w-full relative">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={value}
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
              fontFamily: "Fira Code"
            }}
            onMount={handleEditorDidMount} 
            onChange = {handleEditorChange}/>
          <Terminal />
        </div>
      </div>
    </main>
  )
}

export default App
