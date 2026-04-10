import type { PanelImperativeHandle } from "react-resizable-panels";
import { useEffect, useRef } from "react";
import { useCloseTerm } from "../../states/store";

export const useTerminalShortcut = (termPanelRef: React.RefObject<PanelImperativeHandle | null>) => {

    const closeTerm = useCloseTerm((state) => state.closeTerm);
    const setCloseTerm = useCloseTerm((state) => state.setCloseTerm);

    const closeTermRef = useRef(closeTerm);

    useEffect(() => {
        //Terminal toggle logic
        if (closeTerm) {
            termPanelRef.current?.collapse();
            closeTermRef.current = true ;
        }
        else {
            termPanelRef.current?.expand();
            closeTermRef.current = false ;
        }
    }, [closeTerm])

    useEffect(() => {
        const handleTerminalOpen = (e: KeyboardEvent) => {
            e.stopPropagation();
            if ((e.ctrlKey || e.metaKey) && e.key === '`') {
                e.preventDefault();
                setCloseTerm(!closeTermRef.current);
            }
        }
        document.addEventListener("keydown", handleTerminalOpen);
        return () => document.removeEventListener("keydown", handleTerminalOpen);
    }, []);
}