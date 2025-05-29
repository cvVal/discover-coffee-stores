export type CoffeeStoreType = {
    id: string;
    name: string;
    address?: string;
    imgUrl: string;
};

export type MapBoxType = {
    id: string;
    properties: {
        place_formatted: string;
        name: string;
    };
};