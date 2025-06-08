import Card from '@/component/card.server';
import NearbyCoffeeStores from '@/component/nearby-coffee-stores.client';
import { getCoffeeStoresWithVoting } from '@/lib/coffee-stores-with-voting';
import { CoffeeStoreType } from '@/types';

async function getCoffeeStores() {
  //Mapbox API to get coffee stores with voting data
  const longLat = '-83.13123458507118%2C42.679827991377444';
  return await getCoffeeStoresWithVoting(longLat, 6);
}

export default async function Home() {
  const coffeeStores = await getCoffeeStores();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <NearbyCoffeeStores />
        <div className='mt-20'>
          <h2 className='mt-8 pb-8 text-4xl font-bold text-white'>
            Coffee Stores
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:gap-6">
            {coffeeStores.map((coffeeStore: CoffeeStoreType) => (
              <Card
                key={`${coffeeStore.name}-${coffeeStore.id}`}
                name={coffeeStore.name}
                imgUrl={coffeeStore.imgUrl}
                href={`/coffee-store/${coffeeStore.id}`}
                voting={coffeeStore.voting}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
