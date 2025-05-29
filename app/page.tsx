import Banner from '@/component/banner.client';
import Card from '@/component/card.server';
import { fetchCoffeeStores } from '@/lib/coffee-stores';
import { CoffeeStoreType } from '@/types';

async function getCoffeeStores() {
  //Mapbox API to get coffee stores
  return await fetchCoffeeStores();
}

export default async function Home() {
  const coffeeStores = await getCoffeeStores();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Banner />
        <div className='mt-20'>
          <h2 className='mt-8 pb-8 text-4xl font-bold text-white'>
            Coffee Stores
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:gap-6">
            {coffeeStores.map((coffeeStore: CoffeeStoreType, idx: number) => (
              <Card
                key={`${coffeeStore.name}-${idx}`}
                name={coffeeStore.name}
                imgUrl={coffeeStore.imgUrl}
                href={`/coffee-store/${coffeeStore.id}`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
