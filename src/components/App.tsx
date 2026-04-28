import { lazy, Suspense } from "react";
import { Group, Panel, Separator , usePanelRef, type PanelSize} from "react-resizable-panels";

import FileExplorer from "./Explorer/FileExplorer.tsx";
const RevoirtTerminal = lazy(() => import("./Terminal/RevoirtTerminal"));
import Navigation from "./utility/Navigation.tsx";
import RevoirtEditor from "./Editor/RevoirtEditor.tsx";
import Tooltip from "./utility/Tooltip.tsx";
import { useTerminalShortcut } from "../utills/services/TerminalShortcut.ts";
import { useCloseTerm } from "../states/store.ts";

const App = () => { 
  const termPanelRef = usePanelRef();
  useTerminalShortcut(termPanelRef);
  const setCloseTerm = useCloseTerm((state) => state.setCloseTerm);

  return (
    <main className="h-screen w-screen flex flex-col justify-end font-jetbrains-mono">
      <Navigation />
      <Group
        id="Revoirt-editor"
        className="relative max-h-[94%]"
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
            <Panel id="terminal" 
            panelRef={termPanelRef} 
            collapsible 
            collapsedSize={0} 
            defaultSize={0} 
            minSize={"40%"} 
            maxSize={"74%"} 
            onResize={(panelSize : PanelSize) => {
              (panelSize.inPixels === 0) ? setCloseTerm(true) : setCloseTerm(false) ;
            }}>
              <Suspense fallback={null}>
                <RevoirtTerminal/>
              </Suspense>
            </Panel>
          </Group>
        </Panel>
      </Group>
      <Tooltip />
    </main>
  );
};

export default App;
