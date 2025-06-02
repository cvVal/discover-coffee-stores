import { MapBoxType, CoffeeStoreType } from "@/types";

/**
 * Fetches coffee store photos from Unsplash
 */
const getListOfCoffeeStorePhotos = async (): Promise<string[]> => {
    const splashUrl = `https://api.unsplash.com/search/photos?query="coffee shop"&page=1&per_page=6&client_id=${process.env.UNSPLASH_API_KEY}`
    try {
        const response = await fetch(splashUrl, { next: { revalidate: 60 * 60 } }); // Cache for an hour
        const photos = await response.json();
        const results = photos?.results || [];
        return results.map((result: { urls: { small: string } }) => result.urls['small'])
    }
    catch (error) {
        console.error("Error fetching coffee store photos:", error);
        return []; // Return empty array on error
    }
}

/**
 * Transforms raw MapBox data into our application's format
 */
const transformCoffeeData = (
    idx: number,
    result: MapBoxType,
    photos: Array<string>
): CoffeeStoreType => {
    return {
        id: result.id,
        address: result.properties?.place_formatted || "No address available",
        name: result.properties?.name || "Unnamed Coffee Store",
        imgUrl: photos.length > 0 ? photos[idx % photos.length] : '', // Use modulo to cycle through available photos
    }
}

/**
 * Fetches all coffee stores
 */
export const fetchCoffeeStores = async (): Promise<CoffeeStoreType[]> => {
    const mapBoxUrl = `https://api.mapbox.com/search/geocode/v6/forward?q=coffee&limit=6&proximity=-83.13123458507118%2C42.679827991377444&access_token=${process.env.MAPBOX_API_KEY}`
    try {
        const response = await fetch(mapBoxUrl, { next: { revalidate: 60 * 60 } }); // Cache for an hour
        const data = await response.json();
        const photos = await getListOfCoffeeStorePhotos();

        return data.features.map((result: MapBoxType, idx: number) =>
            transformCoffeeData(idx, result, photos)
        );
    } catch (error) {
        console.error("Error fetching coffee stores:", error);
        return [];
    }
};

/**
 * Fetches a single coffee store by id
 */
export const fetchCoffeeStore = async (id: string): Promise<CoffeeStoreType> => {
    try {
        // First try to find the store in our existing list
        const coffeeStores = await fetchCoffeeStores();
        const existingStore = coffeeStores.find(store => store.id === id);
        if (existingStore) {
            return existingStore;
        }

        // If not found in our list, make a specific request
        const mapBoxUrl = `https://api.mapbox.com/search/geocode/v6/forward?q=${id}&proximity=ip&access_token=${process.env.MAPBOX_API_KEY}`
        const response = await fetch(mapBoxUrl, { next: { revalidate: 60 * 60 } });
        const data = await response.json();
        const photos = await getListOfCoffeeStorePhotos();

        if (data.features && data.features.length > 0) {
            return transformCoffeeData(0, data.features[0], photos);
        }

        // Return empty store if nothing found
        return {
            id: '',
            name: '',
            address: '',
            imgUrl: ''
        };
    } catch (error) {
        console.error("Error fetching coffee store:", error);
        return {
            id: '',
            name: '',
            address: '',
            imgUrl: ''
        };
    }
}