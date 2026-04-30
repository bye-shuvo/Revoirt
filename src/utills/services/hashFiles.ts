import crypto from 'crypto-js'
import type { file } from "../../states/store";
const serect_key = import.meta.env.VITE_FILES_SECRECT_KEY ;

export const encryptHashFiles = async (files : file[] | undefined) => {
    if(!files) return;
    const serializedFiles = JSON.stringify(files , Object.keys(files[0]).sort());
    const hash = crypto.AES.encrypt(serializedFiles , serect_key).toString();
    await window.cookieStore.set('files' , hash);
}

export const decryptHashFiles = () => {
    const filesHashFragment = window.location.hash ;
    const filesHash = filesHashFragment.split("=").at(-1)?.split("-").at(-1);
    if(!filesHash) return ;
    const files = crypto.AES.decrypt(filesHash , serect_key);
    console.log(files);
    return JSON.parse(files.toString(crypto.enc.Utf8));
}