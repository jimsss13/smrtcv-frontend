import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Template } from '@/types/templates';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API_URL;

interface TemplatesResponse {
  data: Template[];
}

export const useTemplates = (): UseQueryResult<TemplatesResponse, Error> => {
  return useQuery<TemplatesResponse, Error>({
    queryKey: ['templates'],
    queryFn: async () => {
      const url = `${API_BASE_URL}/api/v1/user/templates`;
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.statusText}`);
      }
      return response.json();
    },
  });
};
