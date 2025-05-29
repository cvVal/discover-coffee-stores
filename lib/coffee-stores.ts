import { MapBoxType } from "@/types";

const transformCoffeeData = (result: MapBoxType) => {
    return {
        id: result.id,
        address: result.properties?.place_formatted || "No address available",
        name: result.properties?.name || "Unnamed Coffee Store",
        imgUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000",
    }
}

export const fetchCoffeeStores = async () => {
    try {
        const response = await fetch(
            `https://api.mapbox.com/search/geocode/v6/forward?q=coffee&limit=3&proximity=-83.13123458507118%2C42.679827991377444&access_token=${process.env.MAPBOX_API_KEY}`
        )
        const data = await response.json();
        return data.features.map((result: MapBoxType) => transformCoffeeData(result));
    } catch (error) {
        console.error("Error fetching coffee stores:", error);
        return [];
    }
};

export const fetchCoffeeStore = async (id: string) => {
    try {
        const response = await fetch(
            `https://api.mapbox.com/search/geocode/v6/forward?q=${id}&proximity=ip&access_token=${process.env.MAPBOX_API_KEY}`
        )
        const data = await response.json();
        const coffeeStore = data.features.map((result: MapBoxType) => transformCoffeeData(result));
        return coffeeStore.length > 0 ? coffeeStore[0] : {};
    } catch (error) {
        console.error("Error fetching coffee store:", error);
        return [];
    }
}