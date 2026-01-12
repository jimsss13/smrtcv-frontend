import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Subscription, Invoice } from '@/types/billing';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_API_URL;

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  isCurrent: boolean;
  popular?: boolean;
}

interface BillingResponse {
  data: {
    subscription: Subscription;
    invoices: Invoice[];
    plans: Plan[];
  };
}

export const useBilling = (): UseQueryResult<BillingResponse, Error> => {
  return useQuery<BillingResponse, Error>({
    queryKey: ['billing'],
    queryFn: async () => {
      const url = `${API_BASE_URL}/api/v1/user/billing`;
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch billing data: ${response.statusText}`);
      }
      
      const json = await response.json();
      const currentPlan = json.data.subscription.plan;

      // Injecting the plans mock data into the response
      const plans: Plan[] = [
        {
          name: 'Free',
          price: '$0',
          description: 'Perfect for getting started.',
          features: ['3 Resumes', 'Standard Templates', 'Basic AI Support'],
          isCurrent: currentPlan === 'Free',
        },
        {
          name: 'Pro',
          price: '$12',
          description: 'Best for active job seekers.',
          features: ['Unlimited Resumes', 'Premium Templates', 'Advanced AI Writer', 'Custom Branding'],
          isCurrent: currentPlan === 'Pro',
          popular: true,
        },
        {
          name: 'Enterprise',
          price: '$49',
          description: 'For teams and organizations.',
          features: ['Team Collaboration', 'Bulk Export', 'Dedicated Support', 'API Access'],
          isCurrent: currentPlan === 'Enterprise',
        }
      ];

      return {
        ...json,
        data: {
          ...json.data,
          plans
        }
      };
    },
  });
};
