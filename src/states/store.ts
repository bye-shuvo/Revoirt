import { create } from "zustand";

type path = {
    path : string ,
    setPath : (next : string) => void ;
}

export const useFilePath = create<path>((set) => ({
    path : "" , 
    setPath : (next) => set({path : next})
}))