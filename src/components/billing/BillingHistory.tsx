import React from 'react';
import { FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Invoice } from '@/types/billing';

interface BillingHistoryProps {
  invoices: Invoice[];
}

export const BillingHistory = ({ invoices }: BillingHistoryProps) => {
  return (
    <section className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
      <div className="p-8 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold">Billing History</h3>
        </div>
        <Button variant="outline" className="rounded-xl font-bold text-sm">
          Download All
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Invoice ID</th>
              <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-8 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-6 font-bold text-foreground">{invoice.date}</td>
                <td className="px-8 py-6 text-gray-500 font-medium">{invoice.id}</td>
                <td className="px-8 py-6 font-bold">{invoice.amount}</td>
                <td className="px-8 py-6">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {invoice.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-primary font-bold hover:underline flex items-center gap-1 ml-auto">
                    PDF <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
