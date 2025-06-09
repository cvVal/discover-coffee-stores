import TabbedInterface from '@/component/tabbed-interface.client';
import { getCoffeeStoresWithVoting } from '@/lib/coffee-stores-with-voting';
import { NearbyStoresProvider } from '@/lib/nearby-stores-context';

async function getCoffeeStores() {
  //Mapbox API to get coffee stores with voting data
  const longLat = '-83.13123458507118%2C42.679827991377444';
  return await getCoffeeStoresWithVoting(longLat, 6);
}

export default async function Home() {
  const coffeeStores = await getCoffeeStores();
  return (
    <NearbyStoresProvider>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-7xl">
          <TabbedInterface coffeeStores={coffeeStores} />
        </main>
      </div>
    </NearbyStoresProvider>
  );
}
