export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-white"></div>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Loading movies...</p>
      </div>
    </div>
  );
}
