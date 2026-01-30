'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Genre } from '@/types';
import Dropdown from '@/components/ui/Dropdown';

interface DiscoverFiltersProps {
  basePath: '/movies' | '/tv-shows';
  genres: Genre[];
  yearOptions: number[];
  currentGenre: string;
  currentYear: string;
}

export default function DiscoverFilters({
  basePath,
  genres,
  yearOptions,
  currentGenre,
  currentYear,
}: DiscoverFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (genre: string, year: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (genre) params.set('genre', genre);
    else params.delete('genre');
    if (year) params.set('year', year);
    else params.delete('year');
    params.delete('page'); // reset to page 1 on filter change
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  const genreOptions = [
    { value: '', label: 'All' },
    ...genres.map((g) => ({ value: String(g.id), label: g.name })),
  ];
  const yearOptionsList = [
    { value: '', label: 'All' },
    ...yearOptions.map((y) => ({ value: String(y), label: String(y) })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Dropdown
        id="genre-filter"
        label="Genre"
        value={currentGenre}
        options={genreOptions}
        onChange={(genre) => updateFilters(genre, currentYear)}
        triggerClassName="min-w-[140px]"
      />
      <Dropdown
        id="year-filter"
        label="Year"
        value={currentYear}
        options={yearOptionsList}
        onChange={(year) => updateFilters(currentGenre, year)}
        triggerClassName="min-w-[100px]"
      />
    </div>
  );
}
