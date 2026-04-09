import type { PanelImperativeHandle } from "react-resizable-panels";
import { useEffect } from "react";

export const useTerminalShortcut = (termPanelRef: React.RefObject<PanelImperativeHandle | null>, closeTerm: boolean) => {


    useEffect(() => {
        const handleTerminalOpen = (e: KeyboardEvent) => {
            e.stopPropagation();
            console.log(e.key);
            if ((e.ctrlKey || e.metaKey) && e.key === '`') {
                e.preventDefault();
                termPanelRef.current?.expand();
            }
        }
        document.addEventListener("keydown", handleTerminalOpen);
        return () => document.removeEventListener("keydown", handleTerminalOpen);
    }, []);
}