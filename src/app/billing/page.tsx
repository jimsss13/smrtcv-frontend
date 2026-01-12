'use client';

import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BillingHero } from '@/components/billing/BillingHero';
import { CurrentSubscriptionCard } from '@/components/billing/CurrentSubscriptionCard';
import { PlanComparison } from '@/components/billing/PlanComparison';
import { BillingHistory } from '@/components/billing/BillingHistory';
import { PaymentMethods } from '@/components/billing/PaymentMethods';
import { useBilling } from '@/hooks/query/useBilling';

/**
 * Billing and Subscription Management Page.
 * Allows users to manage their plan, view invoices, and update payment methods.
 */
export default function BillingPage() {
  const { data, isLoading, error } = useBilling();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center p-24">
          <p className="text-gray-500 font-bold">Loading billing information...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="flex justify-center p-24 text-red-500 font-bold">
          <p>Error loading billing data. Please try again later.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <BillingHero />

      <div className="max-w-6xl mx-auto px-4 space-y-12 mb-24">
        {/* Current Subscription Card */}
        <CurrentSubscriptionCard subscription={data.data.subscription} />

        {/* Plan Comparison */}
        <PlanComparison plans={data.data.plans} />

        {/* Billing History */}
        <BillingHistory invoices={data.data.invoices} />

        {/* Payment Methods */}
        <PaymentMethods />
      </div>
    </DashboardLayout>
  );
}
