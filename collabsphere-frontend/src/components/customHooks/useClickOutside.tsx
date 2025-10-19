import { useEffect } from "react";

export function useClickOutside(ref: React.RefObject<HTMLElement | null> | null, callback: () => void) {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref && ref.current && !ref.current.contains(e.target as Node)) {
                callback();
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [ref, callback]);
}
