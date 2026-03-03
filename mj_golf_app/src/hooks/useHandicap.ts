import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';

interface HandicapData {
  handicap: number | null;
  courses: number;
}

export function useHandicap() {
  const { data, isLoading } = useSWR<HandicapData>(
    '/api/game-plans/handicap',
    fetcher,
  );

  return {
    handicap: data?.handicap ?? null,
    courseCount: data?.courses ?? 0,
    isLoading,
  };
}
