import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';

interface HandicapData {
  handicap: number | null;
  courses: number;
  courseNames: string[];
}

export function useHandicap() {
  const { data, isLoading } = useSWR<HandicapData>(
    '/api/game-plans/handicap',
    fetcher,
  );

  return {
    handicap: data?.handicap ?? null,
    courseCount: data?.courses ?? 0,
    courseNames: data?.courseNames ?? [],
    isLoading,
  };
}
