'use client';

import { useEffect, useCallback } from 'react';
import { useNearbyStores } from '@/lib/nearby-stores-context';
import { useDebounce } from './use-debounce';

/**
 * A custom React hook that manages cache refresh functionality for nearby coffee stores.
 * 
 * This hook automatically refreshes cached store data when certain conditions are met:
 * - Implements a 30-second threshold to prevent excessive refreshes
 * - Listens for page visibility changes (e.g., returning from another tab or page)
 * - Listens for window focus events
 * - Uses debouncing to prevent rapid successive API calls
 * 
 * The hook will only attempt to refresh if there are existing nearby stores and
 * enough time has passed since the last refresh operation.
 * 
 * @example
 * ```typescript
 * function CoffeeStoresList() {
 *   useCacheRefresh(); // Automatically handles cache refresh logic
 *   
 *   // Your component logic here
 * }
 * ```
 * 
 * @throws Will log errors to console if the store synchronization fails
 */
export function useCacheRefresh() {
    const { nearbyStores, syncStoresWithDatabase, setNearbyStores, lastRefresh } = useNearbyStores();

    const refreshStores = useCallback(async () => {
        if (nearbyStores.length > 0) {
            // Only refresh if more than 30 seconds have passed since last refresh
            const now = Date.now();
            const REFRESH_THRESHOLD = 30 * 1000; // 30 seconds

            if (!lastRefresh || (now - lastRefresh) > REFRESH_THRESHOLD) {
                try {
                    const refreshedStores = await syncStoresWithDatabase(nearbyStores);
                    setNearbyStores(refreshedStores);
                } catch (error) {
                    console.error('Error refreshing cached stores:', error);
                }
            }
        }
    }, [nearbyStores, syncStoresWithDatabase, setNearbyStores, lastRefresh]);

    // Debounce the refresh function to prevent excessive API calls
    const debouncedRefresh = useDebounce(refreshStores, 1000);

    useEffect(() => {
        const handleVisibilityChange = () => {
            // Refresh data when user comes back to the page (from detail page navigation)
            if (document.visibilityState === 'visible') {
                debouncedRefresh();
            }
        };

        const handleFocus = () => {
            // Refresh data when window gains focus
            debouncedRefresh();
        };

        // Listen for page visibility changes (e.g., tab switching, coming back from detail page)
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Listen for window focus events
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [debouncedRefresh]);
}