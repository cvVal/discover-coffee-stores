/**
 * Context for managing nearby coffee stores data with caching and synchronization capabilities.
 * 
 * This context provides functionality to:
 * - Store and retrieve nearby coffee stores from localStorage
 * - Synchronize store data with the database
 * - Handle voting updates and refresh relevant stores
 * - Manage loading states and cache clearing
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <NearbyStoresProvider>
 *       <YourComponent />
 *     </NearbyStoresProvider>
 *   );
 * }
 * 
 * function YourComponent() {
 *   const { nearbyStores, setNearbyStores, isLoading } = useNearbyStores();
 *   // Use the context values
 * }
 * ```
 */

/**
 * Type definition for the nearby stores context value.
 * 
 * @interface NearbyStoresContextType
 * @property {CoffeeStoreType[]} nearbyStores - Array of nearby coffee stores
 * @property {(stores: CoffeeStoreType[]) => void} setNearbyStores - Function to update nearby stores and cache them
 * @property {(stores: CoffeeStoreType[]) => Promise<CoffeeStoreType[]>} syncStoresWithDatabase - Function to sync stores with database and get updated voting data
 * @property {boolean} isLoading - Loading state for database operations
 * @property {() => void} clearCache - Function to clear all cached data
 * @property {number | null} lastRefresh - Timestamp of last database sync
 */

/**
 * Hook to access the nearby stores context.
 * 
 * @throws {Error} Throws an error if used outside of NearbyStoresProvider
 * @returns {NearbyStoresContextType} The nearby stores context value
 * 
 * @example
 * ```tsx
 * const { nearbyStores, setNearbyStores, isLoading } = useNearbyStores();
 * ```
 */

/**
 * Props for the NearbyStoresProvider component.
 * 
 * @interface NearbyStoresProviderProps
 * @property {ReactNode} children - Child components to be wrapped by the provider
 */

/**
 * Provider component for nearby stores context.
 * 
 * Features:
 * - Automatically loads cached stores from localStorage on mount
 * - Listens for 'votingUpdated' events to refresh relevant stores
 * - Provides methods to sync with database and manage cache
 * - Handles error states and fallbacks gracefully
 * 
 * @param {NearbyStoresProviderProps} props - The component props
 * @returns {JSX.Element} The provider component wrapping children
 * 
 * @example
 * ```tsx
 * <NearbyStoresProvider>
 *   <App />
 * </NearbyStoresProvider>
 * ```
 */
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CoffeeStoreType } from '@/types';

interface NearbyStoresContextType {
    nearbyStores: CoffeeStoreType[];
    setNearbyStores: (stores: CoffeeStoreType[]) => void;
    syncStoresWithDatabase: (stores: CoffeeStoreType[]) => Promise<CoffeeStoreType[]>;
    isLoading: boolean;
    clearCache: () => void;
    lastRefresh: number | null;
}

const NearbyStoresContext = createContext<NearbyStoresContextType | undefined>(undefined);

export const useNearbyStores = () => {
    const context = useContext(NearbyStoresContext);
    if (!context) {
        throw new Error('useNearbyStores must be used within a NearbyStoresProvider');
    }
    return context;
};

interface NearbyStoresProviderProps {
    children: ReactNode;
}

export const NearbyStoresProvider: React.FC<NearbyStoresProviderProps> = ({ children }) => {
    const [nearbyStores, setNearbyStoresState] = useState<CoffeeStoreType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastRefresh, setLastRefresh] = useState<number | null>(null);

    // Load cached stores from localStorage on component mount
    useEffect(() => {
        const cachedStores = localStorage.getItem('nearbyStores');
        if (cachedStores) {
            try {
                const stores = JSON.parse(cachedStores);
                setNearbyStoresState(stores);
            } catch (error) {
                console.error('Error parsing cached stores:', error);
                localStorage.removeItem('nearbyStores');
            }
        }
    }, []);

    // Listen for voting updates to refresh database data
    useEffect(() => {
        const handleVotingUpdate = async (event: Event) => {
            const customEvent = event as CustomEvent;
            if (nearbyStores.length > 0) {
                // Only refresh if the voted store is in our nearby stores
                const votedStoreId = customEvent.detail?.storeId;
                const isNearbyStore = votedStoreId && nearbyStores.some(store => store.id === votedStoreId);

                if (isNearbyStore) {
                    console.log('Refreshing nearby stores due to voting update for store:', votedStoreId);
                    const updatedStores = await syncStoresWithDatabase(nearbyStores);
                    setNearbyStoresState(updatedStores);
                    localStorage.setItem('nearbyStores', JSON.stringify(updatedStores));
                }
            }
        };

        window.addEventListener('votingUpdated', handleVotingUpdate);
        return () => window.removeEventListener('votingUpdated', handleVotingUpdate);
    }, [nearbyStores]);

    const setNearbyStores = (stores: CoffeeStoreType[]) => {
        setNearbyStoresState(stores);
        localStorage.setItem('nearbyStores', JSON.stringify(stores));
    };

    const syncStoresWithDatabase = async (stores: CoffeeStoreType[]): Promise<CoffeeStoreType[]> => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/syncStoresWithDatabase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stores }),
            });

            if (!response.ok) {
                throw new Error('Failed to sync stores with database');
            }

            const storesWithVoting = await response.json();
            setLastRefresh(Date.now());
            return storesWithVoting;
        } catch (error) {
            console.error('Error syncing stores with database:', error);
            return stores.map(store => ({ ...store, voting: 0 }));
        } finally {
            setIsLoading(false);
        }
    };

    const clearCache = () => {
        setNearbyStoresState([]);
        setLastRefresh(null);
        localStorage.removeItem('nearbyStores');
    };

    return (
        <NearbyStoresContext.Provider
            value={{
                nearbyStores,
                setNearbyStores,
                syncStoresWithDatabase,
                isLoading,
                clearCache,
                lastRefresh
            }}
        >
            {children}
        </NearbyStoresContext.Provider>
    );
};
