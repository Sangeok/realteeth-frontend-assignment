'use client';

import { parseDistrict } from '@/fsd/entities/district';
import { useFavorites } from '@/fsd/features/favorites';
import { WeatherDashboard } from '@/fsd/widgets/weather-dashboard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type DistrictDetailPageProps = {
  districtId: string;
};

export function DistrictDetailPage({
  districtId,
}: DistrictDetailPageProps) {
  const district = parseDistrict(decodeURIComponent(districtId));
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 p-4 py-12 sm:p-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
      >
        <ArrowLeft className="h-4 w-4" />
        뒤로
      </Link>

      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
          {district.displayName}
        </h1>
      </header>

      <WeatherDashboard
        favorites={favorites}
        addFavorite={addFavorite}
        removeFavorite={removeFavorite}
        selectedDistrict={district}
        locationState={{ status: 'idle' }}
      />
    </main>
  );
}
