import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">Welcome to Movflex</h1>
        <p className="text-lg">Movflex is a free online movie streaming application.</p>
      </main>
    </div>
  );
}
