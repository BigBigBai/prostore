import { getMyCart } from '@/lib/actions/cart.actions';
import CartTable from './cart-table';

import { useTransition } from 'react';

export const metadata = {
  title: 'Shipping Cart',
};

const CartPage = async () => {
  const cart = await getMyCart();

  return (
    <>
      <CartTable cart={cart} />
    </>
  );
};

export default CartPage;
