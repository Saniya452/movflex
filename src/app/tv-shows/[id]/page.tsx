import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTVShowById, getTVShowCredits, getImageUrl, getBackdropUrl } from '@/lib/tmdb';
import WatchlistButton from '@/components/ui/WatchlistButton';
import type { CastMember } from '@/types';

interface TVShowDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TVShowDetailsPageProps) {
  const { id } = await params;
  const tvId = parseInt(id, 10);
  if (Number.isNaN(tvId)) return { title: 'TV Show' };
  try {
    const show = await getTVShowById(tvId);
    return { title: `${show.name} | Movflex` };
  } catch {
    return { title: 'TV Show | Movflex' };
  }
}

function getRatingColor(v: number) {
  if (v >= 8) return 'bg-emerald-500/90 text-white';
  if (v >= 6) return 'bg-amber-500/90 text-black';
  return 'bg-zinc-600 text-white';
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function CastAvatar({ member }: { member: CastMember }) {
  if (member.profile_path) {
    return (
      <Image
        src={getImageUrl(member.profile_path, 'w185')}
        alt={member.name}
        fill
        className="object-cover transition-transform duration-200 group-hover:scale-105"
        sizes="96px"
      />
    );
  }
  return (
    <span className="text-xl font-semibold text-zinc-400 group-hover:text-zinc-300 transition-colors">
      {getInitials(member.name)}
    </span>
  );
}

export default async function TVShowDetailsPage({ params }: TVShowDetailsPageProps) {
  const { id } = await params;
  const tvId = parseInt(id, 10);
  if (Number.isNaN(tvId)) notFound();

  let show;
  let credits;
  try {
    [show, credits] = await Promise.all([
      getTVShowById(tvId),
      getTVShowCredits(tvId),
    ]);
  } catch {
    notFound();
  }

  const cast = credits.cast?.slice(0, 20) ?? [];
  const rating = show.vote_average.toFixed(1);
  const posterUrl = getImageUrl(show.poster_path, 'w500');
  const backdropUrl = show.backdrop_path ? getBackdropUrl(show.backdrop_path) : null;
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : null;

  return (
    <div className="min-h-screen bg-black">
      {/* Backdrop hero */}
      {backdropUrl && (
        <div className="fixed inset-0 z-0">
          <Image
            src={backdropUrl}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <Link
          href="/tv-shows"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:bg-white/5 transition-colors mb-6 -ml-4"
        >
          <span aria-hidden>←</span>
          Back to TV shows
        </Link>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Poster */}
          <div className="flex-shrink-0 w-full md:w-72 lg:w-80">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-800/80 shadow-2xl ring-1 ring-white/10">
              <Image
                src={posterUrl}
                alt={show.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 320px"
                priority
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3 drop-shadow-sm">
              {show.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {year && (
                <span className="text-zinc-400 text-lg font-medium">{year}</span>
              )}
              {show.number_of_seasons != null && (
                <span className="text-zinc-400 text-lg font-medium">
                  {show.number_of_seasons} season{show.number_of_seasons !== 1 ? 's' : ''}
                </span>
              )}
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg ${getRatingColor(show.vote_average)}`}
              >
                {rating}
              </span>
            </div>

            <div className="mb-7">
              <WatchlistButton
                movieId={show.id}
                mediaType="tv"
                title={show.name}
                posterPath={show.poster_path}
              />
            </div>

            {show.overview && (
              <section className="mb-8">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                  Overview
                </h2>
                <p className="text-zinc-200 leading-relaxed text-base sm:text-lg max-w-2xl">
                  {show.overview}
                </p>
              </section>
            )}

            {/* Cast */}
            {cast.length > 0 && (
              <section className="mt-auto overflow-visible">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">
                  Cast
                </h2>
                <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
                  {/* Left fade – solid at edge so cut circles merge into background */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-20 sm:w-28 z-10 pointer-events-none shrink-0"
                    style={{
                      background: 'linear-gradient(to right, #000 0%, #000 35%, rgba(0,0,0,0.6) 60%, transparent 100%)',
                    }}
                    aria-hidden
                  />
                  <div className="flex gap-5 overflow-x-auto overflow-y-visible pt-4 pb-3 px-4 sm:px-6 lg:px-8 scrollbar-hide">
                    {cast.map((member) => (
                      <div
                        key={member.id}
                        className="group flex-shrink-0 w-28 text-center pt-1"
                      >
                        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-zinc-700/90 mx-auto mb-2.5 flex items-center justify-center ring-2 ring-zinc-600/50 group-hover:ring-emerald-500/40 transition-all duration-200">
                          <CastAvatar member={member} />
                        </div>
                        <p className="text-white text-sm font-medium truncate px-1" title={member.name}>
                          {member.name}
                        </p>
                        <p className="text-zinc-500 text-xs truncate px-1" title={member.character}>
                          {member.character}
                        </p>
                      </div>
                    ))}
                  </div>
                  {/* Right fade – solid at edge so cut circles merge into background */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-20 sm:w-28 z-10 pointer-events-none shrink-0"
                    style={{
                      background: 'linear-gradient(to left, #000 0%, #000 35%, rgba(0,0,0,0.6) 60%, transparent 100%)',
                    }}
                    aria-hidden
                  />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
