import type { PanelImperativeHandle } from "react-resizable-panels";
import { useEffect, useRef } from "react";

export const useTerminalShortcut = (termPanelRef: React.RefObject<PanelImperativeHandle | null>, closeTerm: boolean) => {

    const isTermOpen = useRef(false);

    useEffect(() => {
        const handleTerminalOpen = (e: KeyboardEvent) => {
            e.stopPropagation();

            if ((e.ctrlKey || e.metaKey) && e.key === '`') {
                e.preventDefault();

                if(isTermOpen.current){
                    termPanelRef.current?.collapse();
                    isTermOpen.current = false ;
                    return ;
                }
                else{
                    termPanelRef.current?.expand();
                    isTermOpen.current = true;
                }

            }
        }
        document.addEventListener("keydown", handleTerminalOpen);
        return () => document.removeEventListener("keydown", handleTerminalOpen);
    }, []);
}