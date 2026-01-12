import React from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const PaymentMethods = () => {
  return (
    <section className="bg-gray-900 rounded-[32px] p-8 sm:p-12 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-primary" />
            <h3 className="text-2xl font-bold">Payment Method</h3>
          </div>
          <div className="flex items-center gap-4 bg-white/10 p-6 rounded-2xl border border-white/10">
            <div className="bg-white/20 p-3 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold">Visa ending in 4242</p>
              <p className="text-white/50 text-sm">Expires 12/26</p>
            </div>
            <div className="ml-auto">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold">DEFAULT</span>
            </div>
          </div>
        </div>
        <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-2xl py-6 px-10 font-black text-lg transition-all active:scale-95">
          Change Method
        </Button>
      </div>
    </section>
  );
};
