export interface UserData {
  data: Array<{
    account: {
      id: string;
      isActive: boolean;
      role: string;
      email: string;
      name: {
        firstName: string;
        lastName: string;
        fullName: string;
      };
      location: {
        city: string;
        country: string;
      };
      auth: {
        provider: string;
        providerId: string;
        emailVerified: boolean;
        accessToken: string;
      };
      profilePicture: {
        url: string;
        updatedAt: string;
      };
      timestamps: {
        createdAt: string;
        updatedAt: string;
        lastLoginAt: string;
      };
    };
  }>;
}