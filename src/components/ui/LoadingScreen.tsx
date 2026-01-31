import Spinner from '@/components/ui/Spinner';

interface LoadingScreenProps {
  /** Message below the spinner (e.g. "Loading movies...", "Searching...") */
  message?: string;
  /** If false, uses min-h-[60vh] instead of full screen (e.g. for search) */
  fullScreen?: boolean;
}

export default function LoadingScreen({ message = 'Loading...', fullScreen = true }: LoadingScreenProps) {
  return (
    <div
      className={`flex items-center justify-center bg-black px-4 ${
        fullScreen ? 'min-h-screen' : 'min-h-[60vh]'
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-zinc-400">{message}</p>
      </div>
    </div>
  );
}
