import { fetchCoffeeStores } from "@/lib/coffee-stores";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Ensure this route is always fresh

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const longLat = searchParams.get("longLat") || '';
        const limit = searchParams.get("limit") || '6';
        if (longLat) {
            const response = await fetchCoffeeStores(longLat, parseInt(limit));
            return NextResponse.json(response, { status: 200 });
        }
    } catch (error) {
        console.error("Error fetching coffee stores by location:", error);
        return NextResponse.json({ message: "Error fetching coffee stores" }, { status: 500 });
    }
}