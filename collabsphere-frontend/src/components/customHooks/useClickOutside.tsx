import { useEffect } from "react";

export function useClickOutside(ref: React.RefObject<HTMLElement | null> | null, callback: () => void) {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref && ref.current && !ref.current.contains(e.target as Node)) {
                callback();
            }
        };
        document.addEventListener("pointerdown", handleClick);
        return () => document.removeEventListener("pointerdown", handleClick);
    }, [ref, callback]);
}
