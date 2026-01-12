"use client";

import React from "react";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/query/useAuth";
import { GreetingSection } from "@/components/dashboard/GreetingSection";
import { GreetingSkeleton } from "@/components/dashboard/GreetingSkeleton";
import { CardSection } from "@/components/dashboard/CardSection";

/**
 * Dashboard Overview Page.
 * Displays primary entry points for resume creation and enhancement.
 */
export default function DashboardPage() {
  const { data, isLoading, error } = useAuth();

  return (
    <DashboardLayout>
      {/* Greeting Section */}
      {isLoading ? <GreetingSkeleton /> : <GreetingSection data={data}/>}
      {/* Action Cards */}
      <CardSection />
    </DashboardLayout>
  );
}
