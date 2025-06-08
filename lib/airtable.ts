import { CoffeeStoreType } from '@/types';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('app5qqOn1zxf1Xqd5');
const table = base('coffee-stores');

// Transform Airtable records to a simpler format
const getMinifiedRecord = (records: Array<Airtable.Record<Airtable.FieldSet>>) =>
    records.map(record => ({ recordId: record.id, ...record.fields }));

// Find a record by ID
const findRecordByFilter = async (id: string) => {
    const records = await table.select({
        filterByFormula: `id="${id}"`
    }).firstPage();

    return getMinifiedRecord([...records]);
};

// Create or retrieve a coffee store record
export const createCoffeeStore = async (coffeeStore: CoffeeStoreType, id: string) => {
    if (!id) {
        console.error("Coffee store ID is required");
        return [];
    }

    try {
        // First check if the record already exists
        const records = await findRecordByFilter(id);

        if (records.length > 0) {
            console.log("Record already exists:", records[0].recordId);
            return records;
        }

        // Extract store data with defaults
        const { name, address = '', imgUrl = '', voting = 0 } = coffeeStore;

        // Create a new record
        console.log("Creating new record:", id);
        const newRecord = await table.create([
            { fields: { id, name, address, imgUrl, voting } }
        ]);

        return getMinifiedRecord([...newRecord]);
    } catch (error) {
        console.error("Error managing coffee store record:", error);
        return [];
    }
};