import React from 'react';
import ProductsClient from './ProductsClient';

export const metadata = {
  title: 'Product Management | AS Store Admin',
  description: 'Manage products, pricing, stock and catalogue for AS Store',
};

export default function AdminProductsPage() {
  return <ProductsClient />;
}
