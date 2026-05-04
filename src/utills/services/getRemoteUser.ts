import type { WebsocketProvider } from "y-websocket";

export const getRemoteUsersCount = (provider: WebsocketProvider, setRemoteUserCount: (remoteUserCount: number) => void) => {

    const getCount = () => Math.max(0 , provider.awareness.getStates().size - 1);

    const handleAwarenessUpdate = ({ added, removed }: { added: number[], removed: number[] }) => {

        if(added.length === 0 && removed.length === 0) return ;
        setRemoteUserCount(getCount());
    }

    const handleSync = (isSynced : boolean) => {
        isSynced && setRemoteUserCount(getCount());
    }

    provider.awareness.on('update', handleAwarenessUpdate);
    provider.on('sync' , handleSync);

    return () => { provider.awareness.off('update' , handleAwarenessUpdate); provider.off('sync' , handleSync) };
}