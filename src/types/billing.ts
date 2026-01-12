export interface Subscription {
  plan: 'Free' | 'Pro' | 'Enterprise';
  status: 'active' | 'canceled' | 'past_due';
  nextBillingDate: string;
  price: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed';
}