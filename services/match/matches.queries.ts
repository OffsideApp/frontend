import { useQuery } from '@tanstack/react-query';
import { MatchService } from './match.service';

export const useMatches = (date?: string) => {
  return useQuery({
    queryKey: ['matches', date || 'today'],
    queryFn: () => MatchService.getMatches(date),
    refetchInterval: 60000, // Silently refetch every 60 seconds to keep lobby scores updated!
  });
};