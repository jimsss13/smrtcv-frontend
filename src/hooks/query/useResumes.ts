import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ResumeDB, resumeService } from '@/services/resumeService';

export const useResumes = (): UseQueryResult<{ data: ResumeDB[] }, Error> => {
  return useQuery<{ data: ResumeDB[] }, Error>({
    queryKey: ['resumes'],
    queryFn: async () => {
      const resumes = await resumeService.listResumes();
      return { data: resumes };
    },
  });
};
