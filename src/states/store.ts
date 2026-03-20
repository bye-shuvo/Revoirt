import { create } from "zustand";

type ValueState = {
  value: string;
  setValue: (nextValue: string) => void;
};

export const useValue = create<ValueState>()((set) => ({
    value : "" ,
    setValue : (nextValue) => set({ value: nextValue })
}));


type path = {
    path : string ,
    setPath : (next : string) => void ;
}

export const useFilePath = create<path>((set) => ({
    path : "" , 
    setPath : (next) => set({path : next})
}))