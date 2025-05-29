import React from 'react'
import Link from 'next/link';
import { fetchCoffeeStore } from '@/lib/coffee-stores';

async function getCoffeeStore(id: string) {
  //Mapbox API to get a coffee store by ID
  return await fetchCoffeeStore(id);
}

export default async function Page(props: { params: { id: string } }) {
  const {
    params: { id },
  } = props;

  const coffeeStore = await getCoffeeStore(id);
  console.log('Coffee Store:', coffeeStore);
  return (
    <div>
      Dynamic Coffee Store Page: {id}
      <Link href="/">
        ← Back to Home
      </Link>
    </div>
  )
}
