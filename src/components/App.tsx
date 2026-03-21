import { Group, Panel, Separator } from "react-resizable-panels";

import FileExplorer from "./FileExplorer";
import Terminal from "./Terminal";
import Navigation from "./Navigation";
import RevoirtEditor from "./RevoirtEditor";
import Tooltip from "./Tooltip";

const App = () => {

  return (
    <main className="h-screen w-screen flex flex-col justify-end">
      <Navigation />
      <Group
        id="Revoirt-editor"
        className="max-h-[94%]"
        orientation="horizontal"
      >
        <Panel
          id="file-explorer"
          collapsible
          defaultSize={"15%"}
          maxSize={"15%"}
          minSize={"10%"}
        >
          <FileExplorer />
        </Panel>
        <Separator className="w-1.25 outline-none hover:bg-blue-400" />
        <Panel id="edtor-terminal">
          <Group id="editor-terminal-group" orientation="vertical">
            <Panel id="editor" defaultSize={"100%"}>
              <RevoirtEditor />
            </Panel>
            <Panel id="terminal" collapsible defaultSize={0} minSize={"10%"}>
              <Terminal />
            </Panel>
          </Group>
        </Panel>
      </Group>
      <Tooltip />
    </main>
  );
};

export default App;
