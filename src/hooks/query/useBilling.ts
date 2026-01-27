import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Subscription, Invoice } from '@/types/billing';

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
      // Return mock billing data since backend billing endpoints might be disabled/disconnected
      const currentPlan: string = 'Free';
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
          description: 'For power users and professionals.',
          features: ['Unlimited Resumes', 'Premium Templates', 'Advanced AI & Analytics'],
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
        data: {
          subscription: {
            plan: 'Free',
            status: 'active',
            nextBillingDate: '2025-01-01',
            price: '$0',
          },
          invoices: [
            { id: 'inv_1', date: '2024-11-01', amount: '$0', status: 'Paid' },
          ],
          plans,
        },
      } as BillingResponse;
    },
  });
};
