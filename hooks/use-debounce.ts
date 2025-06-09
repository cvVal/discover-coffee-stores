/**
 * A custom React hook that debounces a callback function.
 * 
 * @template T - The type of arguments passed to the callback function
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds before the callback is executed
 * @returns A debounced version of the callback function that delays execution until after the specified delay has passed since the last invocation
 * 
 * @example
 * ```typescript
 * const debouncedSearch = useDebounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 * 
 * // Usage in component
 * const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 *   debouncedSearch(e.target.value);
 * };
 * ```
 */
import { useRef, useCallback } from 'react';

export const useDebounce = <T extends unknown[]>(callback: (...args: T) => void, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback((...args: T) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);

    return debouncedCallback;
};
