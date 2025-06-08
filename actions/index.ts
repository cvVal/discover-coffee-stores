'use server'

import { updateCoffeeStore } from "@/lib/airtable";
import { revalidatePath } from "next/cache";

export const upvoteAction = async (id: string) => {
    console.log("Upvote action triggered for:", id);
    const data = await updateCoffeeStore(id);

    // Revalidate both the home page and the specific coffee store page
    revalidatePath('/');
    revalidatePath(`/coffee-store/${id}`);

    return data;
}