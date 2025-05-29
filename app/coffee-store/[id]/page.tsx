import React from 'react'
import Link from 'next/link';
import { fetchCoffeeStore } from '@/lib/coffee-stores';
import Image from 'next/image';

async function getCoffeeStore(id: string) {
  //Mapbox API to get a coffee store by ID
  return await fetchCoffeeStore(id);
}

export default async function Page(props: { params: { id: string } }) {
  const {
    params: { id },
  } = props;

  const coffeeStore = await getCoffeeStore(id);
  const { name = '', address = '', imgUrl = '' } = coffeeStore;
  console.log('Coffee Store:', coffeeStore);
  return (
    <div className='h-full pb-80'>
      <div className='m-auto grid max-w-full px-12 py-12 lg:max-w-6xl lg:grid-cols-2 lg:gap-4'>
        <div className=''>
          <div className='mb-2 mt-24 text-lg font-bold'>
            <Link href="/">
              ← Back to Home
            </Link>
          </div>
          <div className='my-4'>
            <h1 className='text-4xl'>{name}</h1>
          </div>
          <Image className='max-h-[420px] min-w-full max-w-full rounded-lg border-2 lg:max-w-[470px] sepia'
            src={imgUrl}
            alt={name}
            width={740}
            height={360}
          />
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
  )
}
