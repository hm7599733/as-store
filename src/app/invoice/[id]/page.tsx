import React from 'react';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import type { Order } from '@/types/database';
import InvoiceClient from './InvoiceClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InvoicePage({ params }: Props) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .maybeSingle();

  if (error || !order) {
    notFound();
  }

  return <InvoiceClient order={order as Order} />;
}
