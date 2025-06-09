'use client';

import { upvoteAction } from '@/actions';
import Image from 'next/image'
import React, { useState } from 'react'

export default function Upvote({ voting, id }: { voting: number, id: string }) {
    const [votes, setVotes] = useState(voting);
    const [hasVoted, setHasVoted] = useState(false);

    const handleUpvote = async () => {
        if (!hasVoted) {
            setVotes(prev => prev + 1);
            setHasVoted(true);

            // Call the server action to update the database
            try {
                await upvoteAction(id);
                console.log('Vote updated in database');

                // Dispatch custom event to update rating stats
                const event = new CustomEvent('votingUpdated', {
                    detail: {
                        newVoting: votes + 1,
                        storeId: id
                    }
                });
                window.dispatchEvent(event);
            } catch (error) {
                console.error('Failed to update vote:', error);
                // Revert the UI state if the server action fails
                setVotes(prev => prev - 1);
                setHasVoted(false);
            }
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            {/* Vote Button */}
            <button
                onClick={handleUpvote}
                disabled={hasVoted}
                className={`group relative flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-300 transform hover:scale-110 disabled:cursor-not-allowed ${hasVoted
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-400/25'
                    : 'bg-white/20 hover:bg-white/30 border-2 border-white/30 hover:border-white/50'
                    }`}
            >
                <Image
                    src="/static/icons/star.svg"
                    width="28"
                    height="28"
                    alt="upvote icon"
                    className={`transition-all duration-300 ${hasVoted
                        ? 'filter drop-shadow-sm'
                        : 'group-hover:scale-110'
                        }`}
                />

                {/* Sparkle animation for voted state */}
                {hasVoted && (
                    <div className="absolute inset-0 rounded-2xl animate-ping bg-yellow-400/30"></div>
                )}
            </button>

            {/* Vote Count */}
            <div className="text-center">
                <div className="text-2xl font-bold text-white">
                    {votes}
                </div>
                <div className="text-xs text-gray-300 uppercase tracking-wide">
                    {votes === 1 ? 'Vote' : 'Votes'}
                </div>
            </div>

            {/* Thank you message */}
            {hasVoted && (
                <div className="text-center animate-fade-in">
                    <p className="text-sm text-green-400 font-medium">
                        ✨ Thank you for rating!
                    </p>
                </div>
            )}
        </div>
    )
}
