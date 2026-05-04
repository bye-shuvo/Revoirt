import type { WebsocketProvider } from "y-websocket";

export const getRemoteUsersCount = (provider: WebsocketProvider, setRemoteUserCount: (remoteUserCount: number) => void) => {
    const handleAwarenessUpdate = ({ added, removed, updated }: { added: number[], removed: number[], updated: number[] }) => {
        if(added.length === 0 && removed.length === 0) return ;
        const remoteUsers = provider.awareness.getStates();
        console.log("[awareness] total states:", remoteUsers.size); // debug
        setRemoteUserCount(remoteUsers.size);
    }

    provider.awareness.on('change', handleAwarenessUpdate);

    return () => { provider.awareness.off('change' , handleAwarenessUpdate) }
}