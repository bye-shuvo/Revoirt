import Editor, { type Monaco } from "@monaco-editor/react";
import { useRef } from "react"

const App = () => {
  const editorRef = useRef<Monaco>(null);

  const handleEditorDidMount = (editor:any, monoco : any) => {
    editorRef.current = editor;
  }
  const showValue = () => {
    alert(editorRef.current!.getValue());
  }

  return (
    <div>
      <button onClick={showValue}>Show value</button>
      <Editor
        height="50vh"
        width={"60vw"}
        defaultLanguage="javascript"
        defaultValue="//Hi , Welcome to revoirt"
        theme="dark"
        onMount={handleEditorDidMount} />
    </div>
  )
}

export default App
