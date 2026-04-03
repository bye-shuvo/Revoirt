import { useRef , useCallback } from 'react'

const useDebounce = (delay: number = 3000) : Function => {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const debounce = useCallback((delayedTask : Function) => {
        if(timeoutRef?.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            delayedTask();
            timeoutRef.current = null ;
        } , delay);
    } , [delay]);
    return debounce;
}

export default useDebounce;
