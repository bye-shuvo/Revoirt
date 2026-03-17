import { create } from "zustand";

type ValueState = {
  value: string;
  setValue: (nextValue: string) => void;
};

type selectedFileState = {
    selectedFile : number ,
    setSelectedFile : (nextValue : number) => void
}

export const useValue = create<ValueState>()((set) => ({
    value : "" ,
    setValue : (nextValue) => set({ value: nextValue })
}));

export const useSelectedFile = create<selectedFileState>()((set) => ({
    selectedFile : 0 ,
    setSelectedFile : (nextValue) => set({selectedFile : nextValue})
}))

type fileName = {
    name : string ,
    setName? : (nextValue : string) => void ;
}

type fileContent = {
    content : string ,
    setContent? : (nextValue : string) => void ;
}

type fileState = {
    files : (fileName & fileContent)[] ,
    setFiles : (nextValue : (fileName & fileContent)) => void
}

export const useFiles = create<fileState>()((set) => ({
    files : [{name : "index.js" , content : ""}] ,
    setFiles : (nextValue) => set((state) => ({ files : [...state.files , nextValue]}))
}))


type path = {
    path : string ,
    setPath : (next : string) => void ;
}

export const useFilePath = create<path>((set) => ({
    path : "" , 
    setPath : (next) => set({path : next})
}))