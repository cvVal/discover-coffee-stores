import React from 'react'
import Link from 'next/link';
import { fetchCoffeeStore, fetchCoffeeStores } from '@/lib/coffee-stores';
import Image from "next/image";
import { CoffeeStoreType } from '@/types';
import { createCoffeeStore } from '@/lib/airtable';
import Upvote from '@/component/upvote.client';
import RatingStats from '@/component/rating-stats.client';

/**
 * Fetch a single coffee store by ID
 */
async function getCoffeeStore(id: string): Promise<CoffeeStoreType> {
  const coffeeStoreFromMapbox = await fetchCoffeeStore(id);
  // Create or update the coffee store in Airtable
  const _createCoffeeStore = await createCoffeeStore(coffeeStoreFromMapbox, id);
  const voting = _createCoffeeStore ? _createCoffeeStore[0].voting : 0;

  return coffeeStoreFromMapbox ? {
    ...coffeeStoreFromMapbox,
    voting,
  } : {
    id: '',
    name: '',
    imgUrl: '',
    voting: 0,
  };
}

/**
 * Generate static params for all known coffee stores
 */
export async function generateStaticParams() {
  const longLat = '-83.13123458507118%2C42.679827991377444';
  const coffeeStores = await fetchCoffeeStores(longLat, 6);
  return coffeeStores.map((coffeeStore) => ({
    id: coffeeStore.id,
  }));
}

/**
 * Coffee store page component
 */
export default async function Page(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const { id } = params;

  const coffeeStore = await getCoffeeStore(id);
  const { name = '', address = '', imgUrl = '', voting } = coffeeStore;
  const fallbackImgUrl = 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80';

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Enhanced Background overlay with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-indigo-900/10"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-pink-900/10 via-transparent to-cyan-900/10"></div>

      {/* Floating background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Enhanced Back to Home Button */}
        <div className='mb-8'>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 border border-white/20 shadow-lg group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className='grid lg:grid-cols-2 gap-8 lg:gap-16 items-start'>
          {/* Left Column - Image and Title */}
          <div className="space-y-8">
            {/* Enhanced Title Section */}
            <div className="space-y-4">
              <div className="inline-block">
                <div className="h-2 w-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mb-4 opacity-80"></div>
                <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-2 leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent'>
                  {name || 'Coffee Store'}
                </h1>
                <p className="text-lg text-gray-300 font-light">
                  Discover your perfect cup of coffee
                </p>
              </div>
            </div>

            {/* Enhanced Image Section */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition duration-1000 animate-pulse"></div>
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  className='w-full h-[400px] lg:h-[500px] xl:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105'
                  src={imgUrl || fallbackImgUrl}
                  alt={name || 'Coffee store'}
                  width={740}
                  height={600}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Image overlay info */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="glass rounded-xl p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-sm font-medium">📸 Professional coffee photography</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Info Box */}
          <div className="lg:sticky lg:top-8">
            <div className="coffee-info-box glass rounded-2xl p-8 space-y-8 backdrop-blur-xl bg-white/15 border border-white/20 shadow-2xl">
              {/* Store Info Header */}
              <div className="text-center pb-6 border-b border-white/20">
                <h2 className="text-2xl font-bold text-white mb-2">Store Information</h2>
                <p className="text-gray-300 text-sm">Everything you need to know</p>
              </div>

              {/* Address Section */}
              {address && (
                <div className="address-section">
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors duration-300">
                    <div className="icon-wrapper bg-blue-500/20 p-3 rounded-xl border border-blue-400/30 flex-shrink-0">
                      <Image
                        src="/static/icons/places.svg"
                        width="24"
                        height="24"
                        alt="location icon"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wide mb-1">Location</h3>
                      <p className="text-white font-medium text-base leading-relaxed">{address}</p>
                      <button className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                        📍 View on Map
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Store Features */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '☕', label: 'Premium Coffee' },
                    { icon: '🥐', label: 'Fresh Pastries' },
                    { icon: '📶', label: 'Free WiFi' },
                    { icon: '🪑', label: 'Cozy Seating' }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <span className="text-lg">{feature.icon}</span>
                      <span className="text-sm text-gray-300">{feature.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="divider border-t border-white/20"></div>

              {/* Enhanced Upvote Section */}
              <div className="upvote-section text-center">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Rate this Coffee Shop</h3>
                    <p className="text-sm text-gray-300">Share your experience with the community</p>
                  </div>

                  <div className="flex justify-center">
                    <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                      <Upvote voting={voting} id={id} />
                    </div>
                  </div>

                  {/* Rating Stats */}
                  <RatingStats initialVoting={voting} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg">
                  ☕ Add to Favorites
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-white/20">
                  📱 Share Store
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}