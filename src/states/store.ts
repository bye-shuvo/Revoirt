import { create } from "zustand";

type path = {
    path : string ,
    setPath : (next : string) => void ;
}

export const useFilePath = create<path>((set) => ({
    path : "" , 
    setPath : (next) => set({path : next})
}))

type deletedPath = {
    deletedPath : string ,
    setDeletedPath : (next : string) => void ;
}

export const useDeletedFilePath = create<deletedPath>((set) => ({
    deletedPath : "" ,
    setDeletedPath : (next) => set({deletedPath : next})
}))

export interface file {
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
    files : file[] | undefined,
    setFiles : (next : file[]) => void ;
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

type fileCount = {
    fileCount : number , 
    setFileCount : (next : number) => void
}

export const useFileCount = create<fileCount>((set) => ({
    fileCount : 0 ,
    setFileCount : (next) => set({fileCount : next})
}))

type cursorPosition = {
    cursorPosition : {
        ln : number ,
        col : number
    }
    setCursorPosition : (next : {ln : number , col : number}) => void;
}

export const useCursorPosition = create<cursorPosition>((set) => ({
    cursorPosition : {ln : 1 , col : 1},
    setCursorPosition : (next) => set({cursorPosition : next})
}))