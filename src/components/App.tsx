import Editor from "@monaco-editor/react";
import { useRef } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

import FileExplorer from "./FileExplorer";
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
  };

  const handleEditorChange = (value: any) => setValue(value);

  return (
    <main className="h-screen w-screen flex flex-col justify-end">
      <Navigation />
      <Group
        id="Revoirt-editor"
        className="max-h-[92%]"
        orientation="horizontal"
      >
        <Panel
          id="file-explorer"
          collapsible
          defaultSize={"20%"}
          maxSize={"25%"}
          minSize={"10%"}
        >
          <FileExplorer />
        </Panel>
        <Separator className="w-1.25 outline-none hover:bg-blue-400" />
        <Panel id="edtor-terminal">
          <Group id="editor-terminal-group" orientation="vertical">
            <Panel id="editor" defaultSize={"100%"}>
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
                  fontFamily: "Fira Code",
                }}
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
              />
            </Panel>
            <Panel id="terminal" collapsible defaultSize={0} minSize={"10%"}>
              <Terminal />
            </Panel>
          </Group>
        </Panel>
      </Group>
    </main>
  );
};

export default App;
