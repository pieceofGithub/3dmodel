import TShirtCustomizer from '@/components/TShirtCustomizer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">3D T-Shirt Designer</h1>
          <p className="text-neutral-400">Create your unique custom t-shirt design</p>
        </div>
        <TShirtCustomizer />
      </div>
    </main>
  );
}