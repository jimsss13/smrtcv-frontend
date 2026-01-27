import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { UserData } from '@/types/user';

export const useAuth = (): UseQueryResult<UserData, Error> => {
  return useQuery<UserData, Error>({
    queryKey: ['user'],
    queryFn: async () => {
      // Return mock user data since backend user endpoints might be disabled/disconnected
      return {
        data: [
          {
            account: {
              id: "mock-user-123",
              isActive: true,
              role: "user",
              email: "demo@smrtcv.com",
              name: {
                firstName: "Demo",
                lastName: "User",
                fullName: "Demo User",
              },
              location: {
                city: "New York",
                country: "USA",
              },
              auth: {
                provider: "google",
                providerId: "google-123",
                emailVerified: true,
                accessToken: "mock-token",
              },
              profilePicture: {
                url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Demo",
                updatedAt: new Date().toISOString(),
              },
              timestamps: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                lastLoginAt: new Date().toISOString(),
              },
            },
          },
        ],
      } as UserData;
    },
  });
};
