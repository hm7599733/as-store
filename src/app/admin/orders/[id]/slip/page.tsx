import React from 'react';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import PackingSlipClient from './PackingSlipClient';
import type { Order } from '@/types/database';

export const revalidate = 0;

export default async function PackingSlipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServiceClient();

  const [orderRes, settingsRes] = await Promise.all([
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('settings').select('*').eq('id', 1).maybeSingle(),
  ]);

  if (!orderRes.data) {
    notFound();
  }

  const order = orderRes.data as Order;
  const settings = settingsRes.data;

  return <PackingSlipClient order={order} settings={settings} />;
}
