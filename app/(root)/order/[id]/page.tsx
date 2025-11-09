import { getOrderById } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';
import { ShippingAddress } from '@/types';
import OrderDetailsTable from './order-details-table';
import { auth } from '@/auth';

export const metadata = {
  title: 'Order Details',
};

const OrderDetailsPage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const params = await props.params;

  const { id } = params;

  const order = await getOrderById(id);
  if (!order) notFound();

  // Defensive: ensure order is a plain object and log if something unexpected is returned
  try {
    if (typeof order !== 'object' || order === null) {
      throw new Error('Invalid order data');
    }
  } catch (err) {
    // Log normalized error on the server for debugging
    // eslint-disable-next-line no-console
    console.error('Error while preparing order page:', err);
    throw err;
  }

  const session = await auth();

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      isAdmin={session?.user.role === 'admin' || false}
    />
  );
};

export default OrderDetailsPage;
