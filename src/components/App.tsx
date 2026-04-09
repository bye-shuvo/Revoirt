import { lazy, Suspense, useEffect, useRef } from "react";
import { Group, Panel, Separator , usePanelRef} from "react-resizable-panels";

import FileExplorer from "./FileExplorer";
const RevoirtTerminal = lazy(() => import("./RevoirtTerminal"));
import Navigation from "./Navigation";
import RevoirtEditor from "./RevoirtEditor";
import Tooltip from "./Tooltip";
import { useCloseTerm } from "../states/store";
import { useTerminalShortcut } from "./utils/useTerminalShortcut";

const App = () => { 

  const closeTerm = useCloseTerm((state) => state.closeTerm);
  const setCloseTerm = useCloseTerm((state) => state.setCloseTerm);
  const termPanelRef = usePanelRef();

  const isFirstRun = useRef(true);

  useEffect(() => {
    if(!termPanelRef.current) return;

    if(isFirstRun.current){
      isFirstRun.current = false ;
      return;
    }

    if(closeTerm) {
      termPanelRef.current?.collapse();
      isFirstRun.current = true;
      setCloseTerm(false);
    }
    else{
      termPanelRef.current.expand()
    }
  } , [closeTerm]);

  useTerminalShortcut(termPanelRef , closeTerm);

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
            <Panel panelRef={termPanelRef} id="terminal" collapsible collapsedSize={0} defaultSize={0} minSize={"30%"} maxSize={"74%"}>
              <Suspense fallback={null}>
                <RevoirtTerminal />
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
