import type { WebsocketProvider } from "y-websocket";

export const getRemoteUsersCount = (provider: WebsocketProvider, setRemoteUserCount: (remoteUserCount: number) => void) => {

    const getCount = () => Math.max(0 , provider.awareness.getStates().size - 1);
    setRemoteUserCount(getCount());

    const handleAwarenessUpdate = ({ added, removed }: { added: number[], removed: number[] }) => {

        if(added.length === 0 && removed.length === 0) return ;
        const remoteUsers = provider.awareness.getStates();
        console.log("[awareness] total states:", remoteUsers.size); // debug
        setRemoteUserCount(remoteUsers.size - 1);
    }

    provider.awareness.on('update', handleAwarenessUpdate);

    return () => { provider.awareness.off('update' , handleAwarenessUpdate) }
}