'use client';

import Image from 'next/image';
import { MouseEventHandler } from 'react';

const Banner = ({
    handleOnClick,
    buttonText,
}: {
    handleOnClick: MouseEventHandler<HTMLButtonElement> | undefined;
    buttonText: string;
}) => {
    return (
        <div className="mb-12 grid lg:mb-24 lg:grid-cols-2">
            <div className="z-20 flex flex-col px-2 md:pt-12">
                <h1 className="my-2 flex-wrap">
                    <span className="pr-2 text-white">Coffee</span>
                    <span className="text-gray-900">Connoisseur</span>
                </h1>
                <p className="font-sans text-xl font-semibold text-gray-900 md:mt-5 lg:text-2xl">
                    Discover your local coffee shops!
                </p>

                <div className="mt-12">
                    <button
                        onClick={handleOnClick}
                        className="view-stores-btn group relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {buttonText}
                            <svg
                                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </button>
                </div>
            </div>
            <div className="absolute top-2 z-10 md:top-0 md:mt-12 md:pl-10 md:pt-0 lg:right-1/4 lg:flex lg:pl-20">
                <Image
                    src="/static/hero-image.png"
                    width={800}
                    height={300}
                    alt="hero image"
                    priority={true}
                    style={{
                        width: "100%",
                        height: "auto"
                    }} />
            </div>
        </div>
    );
};

export default Banner;