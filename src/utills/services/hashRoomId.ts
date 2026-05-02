import crypto from 'crypto-js'
const serect_key = import.meta.env.VITE_FILES_SECRECT_KEY ;

export const encryptRoomId = async (roomId : string) => {
    const hash = crypto.AES.encrypt(roomId, serect_key).toString();
    await window.cookieStore.set('files' , hash);
    return hash ;
}

export const decryptRoomId = () => {
    const roomIdHashFragment = decodeURIComponent(window.location.hash) ;
    const roomIdHash = roomIdHashFragment.split("=").at(-1)?.split("-").at(-1);
    if(!roomIdHash) return ;
    return roomIdHash ;
}