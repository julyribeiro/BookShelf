import Image from "next/image";

export default function Home() {
  return (
    <main className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">BookShelf</h1>
        <p className="text-base sm:text-lg text-gray-700">
          Bem-vindo à sua biblioteca pessoal!
        </p>
      </div>
    </main>
  );
}
