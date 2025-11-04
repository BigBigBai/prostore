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

const AddToCart = ({ item }: { item: Omit<CartItem, 'cartId'> }) => {
  const router = useRouter();
  //   const { toast } = useToast();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      console.log(23);
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

  return (
    <Button className='w-full' type='button' onClick={handleAddToCart}>
      <Plus />
      Add to cart
    </Button>
  );
};

export default AddToCart;
