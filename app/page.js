export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-8">
      <h1 className="text-5xl font-bold text-zinc-900 mb-4">
        Monterrey Energy Map
      </h1>
      <p className="text-xl text-zinc-600 mb-8">
        Descubre los proyectos de energía o solares cerca de tí
      </p>
      <button className="bg-blue-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-full transition-colors">
        Explorar el mapa
      </button>
    </main>
  );
}