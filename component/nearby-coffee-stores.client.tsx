'use client';

import React, { useEffect, useState } from 'react';
import Banner from './banner.client';
import useTrackLocation from '@/hooks/use-track-location';
import Card from './card.server';
import { CoffeeStoreType } from '@/types';
import { useNearbyStores } from '@/lib/nearby-stores-context';
import { useCacheRefresh } from '@/hooks/use-cache-refresh';

export default function NearbyCoffeeStores() {
    const { handleTrackLocation, isFindingLocation, longLat, locationErrorMsg } =
        useTrackLocation();

    const {
        nearbyStores,
        setNearbyStores,
        syncStoresWithDatabase,
        isLoading: isLoadingSync,
        clearCache
    } = useNearbyStores();

    const [isLoadingStores, setIsLoadingStores] = useState(false);

    // Use cache refresh hook to keep data synchronized
    useCacheRefresh();

    const handleOnClick = () => {
        handleTrackLocation();
    };

    const handleRefreshStores = async () => {
        if (nearbyStores.length > 0) {
            const refreshedStores = await syncStoresWithDatabase(nearbyStores);
            setNearbyStores(refreshedStores);
        }
    };

    const handleClearAndRefetch = () => {
        clearCache();
        handleTrackLocation();
    };

    useEffect(() => {
        async function coffeeStoresByLocation() {
            if (longLat) {
                setIsLoadingStores(true);
                try {
                    const limit = 10;
                    const response = await fetch(
                        `/api/getCoffeeStoresByLocation?longLat=${longLat}&limit=${limit}`
                    );
                    const coffeeStores = await response.json();

                    // Sync with database to get voting data
                    const storesWithVoting = await syncStoresWithDatabase(coffeeStores);
                    setNearbyStores(storesWithVoting);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoadingStores(false);
                }
            }
        }

        // Only fetch if we don't have cached stores or if location changed
        if (longLat && nearbyStores.length === 0) {
            coffeeStoresByLocation();
        }
    }, [longLat, nearbyStores.length, setNearbyStores, syncStoresWithDatabase]);

    const isLoading = isLoadingStores || isLoadingSync;

    return (
        <div className="w-full">
            {/* Action Section */}
            <div className="text-center mb-8">
                <Banner
                    handleOnClick={handleOnClick}
                    buttonText={isFindingLocation ? 'Locating...' : isLoading ? 'Loading stores...' : 'View stores nearby'}
                />
                {locationErrorMsg && (
                    <p className="mt-4 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3 backdrop-blur-md">
                        Error: {locationErrorMsg}
                    </p>
                )}
            </div>

            {/* Stores Display */}
            {nearbyStores.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-4xl font-bold text-white">
                            Stores near me {isLoading && <span className="text-sm text-gray-400">(Syncing...)</span>}
                        </h2>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRefreshStores}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 disabled:bg-white/5 border border-white/20 rounded-lg text-white transition-all duration-300 backdrop-blur-md"
                            >
                                {isLoading ? 'Syncing...' : 'Refresh Votes'}
                            </button>
                            <button
                                onClick={handleClearAndRefetch}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 disabled:bg-red-500/10 border border-red-500/30 rounded-lg text-white transition-all duration-300 backdrop-blur-md"
                            >
                                Clear Cache
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:gap-6">
                        {nearbyStores.map((coffeeStore: CoffeeStoreType, idx: number) => (
                            <Card
                                key={`${coffeeStore.name}-${coffeeStore.id}`}
                                name={coffeeStore.name}
                                imgUrl={coffeeStore.imgUrl}
                                href={`/coffee-store/${coffeeStore.id}?idx=${idx}`}
                                voting={coffeeStore.voting}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State when no nearby stores but no error */}
            {nearbyStores.length === 0 && !locationErrorMsg && !isLoading && (
                <div className="text-center py-12">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md mx-auto">
                        <div className="text-6xl mb-4">📍</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No nearby stores found</h3>
                        <p className="text-gray-300 text-sm">
                            Click &ldquo;View stores nearby&rdquo; to find coffee shops in your area
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}