'use client';

import React, { useState, useCallback } from 'react';
import Card from '@/component/card.server';
import NearbyCoffeeStores from '@/component/nearby-coffee-stores.client';
import { CoffeeStoreType } from '@/types';

interface TabbedInterfaceProps {
    coffeeStores: CoffeeStoreType[];
}

type TabType = 'coffee-stores' | 'nearby-stores';

export default function TabbedInterface({ coffeeStores }: TabbedInterfaceProps) {
    const [activeTab, setActiveTab] = useState<TabType>('coffee-stores');

    const handleTabChange = useCallback((tab: TabType) => {
        console.log('Switching to tab:', tab);
        setActiveTab(tab);
    }, []);

    return (
        <div className="w-full">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
                <div className="flex bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2">
                    <button
                        type="button"
                        onClick={() => handleTabChange('coffee-stores')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'coffee-stores'
                            ? 'bg-white/20 text-white shadow-lg'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                        aria-pressed={activeTab === 'coffee-stores'}
                        aria-label="View Coffee Stores"
                    >
                        Coffee Stores
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabChange('nearby-stores')}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === 'nearby-stores'
                            ? 'bg-white/20 text-white shadow-lg'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                        aria-pressed={activeTab === 'nearby-stores'}
                        aria-label="View Stores Near Me"
                    >
                        Stores Near Me
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                <div style={{ display: activeTab === 'coffee-stores' ? 'block' : 'none' }}>
                    <div className="animate-fade-in">
                        <h2 className="text-4xl font-bold text-white text-center mb-8">
                            Coffee Stores
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:gap-6">
                            {coffeeStores.map((coffeeStore: CoffeeStoreType) => (
                                <Card
                                    key={`${coffeeStore.name}-${coffeeStore.id}`}
                                    name={coffeeStore.name}
                                    imgUrl={coffeeStore.imgUrl}
                                    href={`/coffee-store/${coffeeStore.id}`}
                                    voting={coffeeStore.voting}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div style={{ display: activeTab === 'nearby-stores' ? 'block' : 'none' }}>
                    <div className="animate-fade-in">
                        <NearbyCoffeeStores />
                    </div>
                </div>
            </div>
        </div>
    );
}
