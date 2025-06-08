import { fetchCoffeeStores } from '@/lib/coffee-stores';
import { getCoffeeStore } from '@/lib/airtable';
import { CoffeeStoreType } from '@/types';

export async function getCoffeeStoresWithVoting(longLat: string, limit: number = 6) {
    try {
        // Fetch coffee stores from API
        const coffeeStores = await fetchCoffeeStores(longLat, limit);

        // Get voting data from database for each store
        const coffeeStoresWithVoting = await Promise.all(
            coffeeStores.map(async (store: CoffeeStoreType) => {
                const dbStore = await getCoffeeStore(store.id);
                return {
                    ...store,
                    voting: dbStore?.voting || 0
                };
            })
        );

        return coffeeStoresWithVoting;
    } catch (error) {
        console.error('Error getting coffee stores with voting:', error);
        return [];
    }
}
