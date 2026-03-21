import { create } from "zustand";

type path = {
    path : string ,
    setPath : (next : string) => void ;
}

export const useFilePath = create<path>((set) => ({
    path : "" , 
    setPath : (next) => set({path : next})
}))

interface IDBfile {
  path: string;  // primary key
  name: string;
  type: string;
  extension: string;
  parentPath: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

type files = {
    files : IDBfile[] | undefined,
    setFiles : (next : IDBfile[]) => void ;
}

export const useFiles = create<files>((set) => ({
    files : undefined ,
    setFiles : (next) => set({files : next})
}))

type lineCount = {
    lineCount : number , 
    setLineCount : (next : number) => void
}

export const useLineCount = create<lineCount>((set) => ({
    lineCount : 0 ,
    setLineCount : (next) => set({lineCount : next})
}))