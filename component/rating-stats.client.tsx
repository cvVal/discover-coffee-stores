'use client'

import { useState, useEffect } from 'react';

type RatingStatsProps = {
    initialVoting: number;
};

export default function RatingStats({ initialVoting }: RatingStatsProps) {
    const [voting, setVoting] = useState(initialVoting);

    // Listen for voting updates
    useEffect(() => {
        const handleVotingUpdate = (event: CustomEvent) => {
            setVoting(event.detail.newVoting);
        };

        window.addEventListener('votingUpdated', handleVotingUpdate as EventListener);

        return () => {
            window.removeEventListener('votingUpdated', handleVotingUpdate as EventListener);
        };
    }, []);

    // Calculate dynamic stats based on voting count
    const rating = voting === 0 ? 'N/A' : (Math.min(4.2 + (voting * 0.1), 5.0)).toFixed(1);
    const reviews = voting;
    const getQualityStars = (votes: number) => {
        if (votes === 0) return '☆☆☆☆☆';
        if (votes <= 2) return '★★★☆☆';
        if (votes <= 5) return '★★★★☆';
        return '★★★★★';
    };
    const qualityStars = getQualityStars(voting);

    return (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="text-center">
                <div className="text-2xl font-bold text-white">
                    {rating}
                </div>
                <div className="text-xs text-gray-400">Rating</div>
            </div>
            <div className="text-center">
                <div className="text-2xl font-bold text-white">{reviews}</div>
                <div className="text-xs text-gray-400">Reviews</div>
            </div>
            <div className="text-center">
                <div className="text-2xl font-bold text-white">
                    {qualityStars}
                </div>
                <div className="text-xs text-gray-400">Quality</div>
            </div>
        </div>
    );
}
