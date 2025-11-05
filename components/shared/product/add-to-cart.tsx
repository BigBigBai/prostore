'use client';

import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
// import { ToastAction } from '@/components/ui/toast';
// import { useToast } from '@/hooks/use-toast';
// import { round2 } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { toast } from 'sonner';
import { Cart } from '@/types';
import { Minus } from 'lucide-react';
import { removeItemFromCart } from '@/lib/actions/cart.actions';

const AddToCart = ({
  cart,
  item,
}: {
  cart?: Cart;
  item: Omit<CartItem, 'cartId'>;
}) => {
  const router = useRouter();
  //   const { toast } = useToast();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success(`${item.name} added to the cart`, {
      action: {
        label: 'Go to Cart',
        onClick: () => router.push('/cart'),
      },
    });
  };

  // Remove item from cart
  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId);

    if (res.success) {
      toast.success(res.message);
    }

    return;
  };

  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
        <Minus className='w-4 h-4' />
      </Button>
      <span className='px-2'>{existItem.qty}</span>
      <Button type='button' variant='outline' onClick={handleAddToCart}>
        <Plus className='w-4 h-4' />
      </Button>
    </div>
  ) : (
    <Button className='w-full' type='button' onClick={handleAddToCart}>
      <Plus className='w-4 h-4' />
      Add to cart
    </Button>
  );
};

export default AddToCart;
