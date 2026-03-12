import Editor from "@monaco-editor/react";
import { useRef } from "react"
import FileExplorar from "./FileExplorar";
import Terminal from "./Terminal";
import Navigation from "./Navigation";
import { useValue } from "../states/store";

const App = () => {
  const editorRef = useRef(null);
  const value = useValue((state) => state.value);
  const setValue = useValue((state) => state.setValue);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  }

  const handleEditorChange = (value : any) => setValue(value) ;

  return (
    <main className="h-screen w-screen">
      <Navigation />
      <div className="h-[95%] w-full flex items-end">
        <FileExplorar />
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
