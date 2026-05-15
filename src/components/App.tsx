import react, { Activity, lazy, Suspense } from "react";
import {
  Group,
  Panel,
  Separator,
  usePanelRef,
  type PanelSize,
} from "react-resizable-panels";

import FileExplorer from "./Explorer/FileExplorer.tsx";
const RevoirtTerminal = lazy(() => import("./Terminal/RevoirtTerminal"));
import Navigation from "./utility/Navigation.tsx";
import RevoirtEditor from "./Editor/RevoirtEditor.tsx";
import Tooltip from "./utility/Tooltip.tsx";
import { useTerminalShortcut } from "../utills/services/TerminalShortcut.ts";
import {
  useCloseTerm,
  useIsCollaborating,
  useIsSessionEnded,
} from "../states/store.ts";
import CollaborationModal from "./utility/CollaborationModal.tsx";
import Toast from "../utills/hooks/useToast.tsx";

const App = () => {
  const termPanelRef = usePanelRef();
  useTerminalShortcut(termPanelRef);
  const setCloseTerm = useCloseTerm((state) => state.setCloseTerm);
  const isCollaborating = useIsCollaborating((state) => state.state);
  const setIsCollaborating = useIsCollaborating((state) => state.setState);
  const isSessionEnded = useIsSessionEnded((state) => state.state);
  const setIsSessionEnded = useIsSessionEnded((state) => state.setState);

  return (
    <main className="h-screen w-screen flex flex-col justify-end font-jetbrains-mono">
      {
        <Activity mode={isCollaborating ? "visible" : "hidden"}>
          <CollaborationModal />
          <div
            id="overlay"
            className="absolute h-full w-full top-0 left-0 bg-neutral-900/10 z-50"
          ></div>
        </Activity>
      }
      {isSessionEnded && (
        <Toast
          type={"success"}
          message="Session Stopped"
          duration={1500}
          onDone={() => {setIsSessionEnded(false); setIsCollaborating(false)}}
          bottom="5%"
          left="50%"
        />
      )}
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
            <Panel
              id="terminal"
              panelRef={termPanelRef}
              collapsible
              collapsedSize={0}
              defaultSize={0}
              minSize={"40%"}
              maxSize={"74%"}
              onResize={(panelSize: PanelSize) => {
                panelSize.inPixels === 0
                  ? setCloseTerm(true)
                  : setCloseTerm(false);
              }}
            >
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
