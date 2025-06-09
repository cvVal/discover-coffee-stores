import { NextRequest, NextResponse } from 'next/server';
import { getCoffeeStore } from '@/lib/airtable';
import { CoffeeStoreType } from '@/types';

/**
 * Syncs coffee store data with the database by fetching voting information.
 * 
 * This endpoint accepts an array of coffee stores and enriches each store
 * with its current voting count from the database. If a store doesn't exist
 * in the database or an error occurs during fetching, the voting count
 * defaults to 0.
 * 
 * @param request - The NextRequest object containing the POST request data
 * @returns A NextResponse containing:
 *   - Success (200): Array of coffee stores with voting information
 *   - Bad Request (400): When stores data is invalid or missing
 *   - Internal Server Error (500): When database sync fails
 * 
 * @example
 * Request body:
 * ```json
 * {
 *   "stores": [
 *     { "id": "store1", "name": "Coffee Shop A" },
 *     { "id": "store2", "name": "Coffee Shop B" }
 *   ]
 * }
 * ```
 * 
 * Response:
 * ```json
 * [
 *   { "id": "store1", "name": "Coffee Shop A", "voting": 5 },
 *   { "id": "store2", "name": "Coffee Shop B", "voting": 0 }
 * ]
 * ```
 */
export async function POST(request: NextRequest) {
    try {
        const { stores }: { stores: CoffeeStoreType[] } = await request.json();

        if (!stores || !Array.isArray(stores)) {
            return NextResponse.json(
                { error: 'Invalid stores data' },
                { status: 400 }
            );
        }

        const storesWithVoting = await Promise.all(
            stores.map(async (store) => {
                try {
                    const dbStore = await getCoffeeStore(store.id);
                    return {
                        ...store,
                        voting: dbStore?.voting || 0
                    };
                } catch (error) {
                    console.error(`Error fetching store ${store.id}:`, error);
                    return {
                        ...store,
                        voting: 0
                    };
                }
            })
        );

        return NextResponse.json(storesWithVoting);
    } catch (error) {
        console.error('Error syncing stores with database:', error);
        return NextResponse.json(
            { error: 'Failed to sync stores' },
            { status: 500 }
        );
    }
}
