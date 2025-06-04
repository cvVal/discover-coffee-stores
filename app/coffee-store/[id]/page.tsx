import React from 'react'
import Link from 'next/link';
import { fetchCoffeeStore, fetchCoffeeStores } from '@/lib/coffee-stores';
import Image from "next/image";
import { CoffeeStoreType } from '@/types';

/**
 * Fetch a single coffee store by ID
 */
async function getCoffeeStore(id: string): Promise<CoffeeStoreType> {
  return await fetchCoffeeStore(id);
}

/**
 * Generate static params for all known coffee stores
 */
export async function generateStaticParams() {
  const coffeeStores = await fetchCoffeeStores();
  return coffeeStores.map((coffeeStore) => ({
    id: coffeeStore.id,
  }));
}

/**
 * Coffee store page component
 */
export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const coffeeStore = await getCoffeeStore(id);
  const { name = '', address = '', imgUrl = '' } = coffeeStore;
  const fallbackImgUrl = 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80';
  return (
    <div className='h-full pb-80'>
      <div className='m-auto grid max-w-full px-12 py-12 lg:max-w-6xl lg:grid-cols-2 lg:gap-4'>
        <div>
          <div className='mb-2 mt-24 text-lg font-bold'>
            <Link href="/">← Back to Home</Link>
          </div>
          <div className='my-4'>
            <h1 className='text-4xl'>{name}</h1>
          </div>
          <Image
            className='max-h-[420px] min-w-full max-w-full rounded-lg border-2 lg:max-w-[470px] sepia'
            src={imgUrl || fallbackImgUrl}
            alt={name || 'Coffee store'}
            width={740}
            height={360}
            style={{
              maxWidth: "100%",
              height: "auto"
            }} />
        </div>
        <div className='glass mt-12 flex-col rounded-lg p-4 lg:mt-48'>
          {address && (
            <div className='mb-4 flex'>
              <p className='pl-2'>{address}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}