import type { WebsocketProvider } from "y-websocket";

export const getRemoteUsersCount = (provider: WebsocketProvider, setRemoteUserCount: (remoteUserCount: number) => void) => {

    const getCount = () => Math.max(0 , provider.awareness.getStates().size);

    const handleChange = () => {
        setRemoteUserCount(getCount());
        window.sessionStorage.setItem('connected_users' , JSON.stringify(getCount()));
    }

    provider.awareness.on('change' , handleChange);

    return () => { 
         provider.awareness.off('change' , handleChange);
          window.sessionStorage.setItem('connected_users' , JSON.stringify(Math.max(0 , provider.awareness.getStates().size))); };
}