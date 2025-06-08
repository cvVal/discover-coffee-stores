export type CoffeeStoreType = {
    id: string;
    name: string;
    address?: string;
    imgUrl: string;
    voting: number;
};

export type MapBoxType = {
    id: string;
    properties: {
        place_formatted: string;
        name: string;
    };
};

export type AirtableType = {
    id: string;
    recordId: string;
    fields: CoffeeStoreType;
};