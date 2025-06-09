'use client';

import React from 'react';

export default function BackButton() {
    const handleGoBack = () => {
        if (typeof window !== 'undefined') {
            window.history.back();
        }
    };

    return (
        <button
            onClick={handleGoBack}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 border border-white/20 shadow-lg group"
        >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Go Back</span>
        </button>
    );
}
