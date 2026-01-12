import React from 'react';
import { Button } from '@/components/ui/Button';
import { Subscription } from '@/types/billing';

interface CurrentSubscriptionCardProps {
  subscription: Subscription;
}

export const CurrentSubscriptionCard = ({ subscription }: CurrentSubscriptionCardProps) => {
  return (
    <section className="bg-white border border-gray-200 rounded-[32px] p-8 sm:p-12 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">Current Plan: {subscription.plan}</h2>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
              {subscription.status}
            </span>
          </div>
          <p className="text-gray-500 font-medium">
            Your next billing date is <span className="text-foreground font-bold">{subscription.nextBillingDate}</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Button variant="outline" className="rounded-2xl py-6 px-8 font-bold border-2">
            Cancel Plan
          </Button>
          <Button className="rounded-2xl py-6 px-8 font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            Update Payment
          </Button>
        </div>
      </div>
    </section>
  );
};
