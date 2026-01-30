export default function MovieDetailsLoading() {
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse mb-6" />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-72 lg:w-80 aspect-[2/3] rounded-xl bg-zinc-800 animate-pulse" />
          <div className="flex-1 space-y-4">
            <div className="h-9 w-3/4 bg-zinc-800 rounded animate-pulse" />
            <div className="h-6 w-24 bg-zinc-800 rounded animate-pulse" />
            <div className="h-10 w-36 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
