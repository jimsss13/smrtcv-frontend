import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Resume } from '@/types/dashboard-resume';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API_URL;

interface ResumesResponse {
  data: Resume[];
}

export const useResumes = (): UseQueryResult<ResumesResponse, Error> => {
  return useQuery<ResumesResponse, Error>({
    queryKey: ['resumes'],
    queryFn: async () => {
      const url = `${API_BASE_URL}/api/v1/user/resume`;
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch resumes: ${response.statusText}`);
      }
      return response.json();
    },
  });
};
