import type { PanelImperativeHandle } from "react-resizable-panels";
import { useEffect, useRef } from "react";
import { useCloseTerm } from "../../states/store";

export const useTerminalShortcut = (termPanelRef: React.RefObject<PanelImperativeHandle | null>) => {
    
    const closeTerm = useCloseTerm((state) => state.closeTerm);
    const setCloseTerm = useCloseTerm((state) => state.setCloseTerm);

    const closeTermRef = useRef(closeTerm);

    useEffect(() => {
        closeTermRef.current = closeTerm ;
        console.log(closeTermRef.current);
    } ,[closeTerm])

    useEffect(() => {
        const handleTerminalOpen = (e: KeyboardEvent) => {
            e.stopPropagation();
            if ((e.ctrlKey || e.metaKey) && e.key === '`') {
                e.preventDefault();
                if(closeTermRef.current){
                    termPanelRef.current?.collapse();
                    setCloseTerm(false);
                }
                else{
                    termPanelRef.current?.expand();
                    setCloseTerm(true);
                }
            }
        }
        document.addEventListener("keydown", handleTerminalOpen);
        return () => document.removeEventListener("keydown", handleTerminalOpen);
    }, []);
}