import Banner from '@/component/banner.client';
import Card from '@/component/card.server';

export default function Home() {
  const coffeeStores = [
    {
      id: "dark-horse-coffee",
      name: "Dark Horse Coffee",
      imgUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1000",
      address: "123 Main Street",
      neighbourhood: "Downtown"
    },
    {
      id: "brew-haven",
      name: "Brew Haven",
      imgUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000",
      address: "456 Oak Avenue",
      neighbourhood: "West Side"
    },
    {
      id: "caffeine-culture",
      name: "Caffeine Culture",
      imgUrl: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=1000",
      address: "789 Elm Street",
      neighbourhood: "East Village"
    },
    {
      id: "bean-bliss",
      name: "Bean Bliss",
      imgUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1000",
      address: "321 Pine Road",
      neighbourhood: "Harbor District"
    },
    {
      id: "roast-retreat",
      name: "Roast Retreat",
      imgUrl: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?q=80&w=1000",
      address: "654 Maple Drive",
      neighbourhood: "North Heights"
    },
    {
      id: "espresso-emporium",
      name: "Espresso Emporium",
      imgUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000",
      address: "987 Cedar Lane",
      neighbourhood: "South Park"
    }
  ];
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Banner />
        <div className='mt-20'>
          <h2 className='mt-8 pb-8 text-4xl font-bold text-white'>
            Coffee Stores
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2 lg:grid-cols-3 lg:gap-6">
            {coffeeStores.map((coffeeStore, idx) => (
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
