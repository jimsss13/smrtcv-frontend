import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { UserData } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API_URL;

export const useAuth = (): UseQueryResult<UserData, Error> => {
  return useQuery<UserData, Error>({
    queryKey: ['user'],
    queryFn: async () => {
      const url = `${API_BASE_URL}/api/v1/user/info`;
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    },
  });
};

