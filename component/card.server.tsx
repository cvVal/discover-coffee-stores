import Image from "next/image";
import Link from 'next/link';

type CardType = {
    name: string;
    imgUrl: string;
    href: string;
    voting?: number;
};

export default function Card({ name, imgUrl, href, voting = 0 }: CardType) {
    // Calculate dynamic stats based on voting count (matching detail page logic)
    const rating = voting === 0 ? "N/A" : Math.min(4.2 + (voting * 0.1), 5.0).toFixed(1);
    const reviews = voting;
    const getQualityStars = (votes: number) => {
        if (votes === 0) return "☆☆☆☆☆";
        if (votes <= 10) return "★★★☆☆";
        if (votes <= 20) return "★★★★☆";
        return "★★★★★";
    };
    const qualityStars = getQualityStars(voting);
    return (
        <Link href={href} className="group block transform transition-all duration-300 hover:scale-105">
            <div className="glass overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:bg-white/15 hover:shadow-3xl">
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                    <Image
                        className="transition-transform duration-700 group-hover:scale-110"
                        src={imgUrl}
                        alt={`${name} coffee store`}
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8/+ZNPQAIoQM4xp5zkgAAAABJRU5ErkJggg=="
                        placeholder="blur"
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        style={{
                            objectFit: "cover"
                        }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                    {/* Hover overlay with coffee icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
                            <span className="text-2xl">☕</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                    <h2 className="truncate text-xl font-bold text-white transition-colors duration-300 group-hover:text-blue-200">
                        {name}
                    </h2>

                    {/* Interactive elements */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">{qualityStars}</span>
                            <span className="ml-2 text-sm text-gray-300">{rating}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <span>👍</span>
                            <span>{reviews} votes</span>
                        </div>
                    </div>

                    {/* Animated bottom border */}
                    <div className="mt-4 h-1 w-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 group-hover:w-full"></div>
                </div>
            </div>
        </Link>
    );
}