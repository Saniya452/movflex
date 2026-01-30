export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans">
      <div className="flex flex-col items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-800 border-t-white"></div>
        <p className="mt-4 text-lg text-zinc-400">Loading movies...</p>
      </div>
    </div>
  );
}
