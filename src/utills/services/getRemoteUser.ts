import type { WebsocketProvider } from "y-websocket";

export const getRemoteUsersCount = (provider: WebsocketProvider, setRemoteUserCount: (remoteUserCount: number) => void) => {
    let remoteUsers = null;

    const handleAwarenessUpdate = () => {
        remoteUsers = provider.awareness.getStates();
        setRemoteUserCount(remoteUsers.size);
    }

    provider.awareness.on('update', handleAwarenessUpdate);

    return () => { provider.awareness.off('update' , handleAwarenessUpdate) }
}