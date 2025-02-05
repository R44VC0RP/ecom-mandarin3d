'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBox, FaClock, FaDollarSign, FaExclamationTriangle } from 'react-icons/fa';

const mockOrders = [
  {
    id: '1',
    status: 'PENDING',
    createdAt: new Date(),
    totalAmount: { amount: '149.99', currencyCode: 'USD' },
    items: [
      {
        id: '1',
        quantity: 1,
        product: {
          title: 'Custom 3D Print',
          featuredImage: { url: '/placeholder.jpg', altText: 'Custom 3D Print' }
        }
      }
    ]
  }
];

function OrderStatus({ status }: { status: string }) {
  const statusConfig = {
    PENDING: { color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', icon: FaClock },
    PROCESSING: { color: 'text-blue-400', bgColor: 'bg-blue-500/10', icon: FaBox },
    COMPLETED: { color: 'text-green-400', bgColor: 'bg-green-500/10', icon: FaBox },
    CANCELLED: { color: 'text-red-400', bgColor: 'bg-red-500/10', icon: FaExclamationTriangle }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 rounded-full ${config.bgColor} px-2 py-1`}>
      <Icon className={`h-3 w-3 ${config.color}`} />
      <span className={`text-xs font-medium ${config.color}`}>{status}</span>
    </div>
  );
}

export default function OrdersPage() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  if (mockOrders.length === 0) {
    return (
      <div className="mx-auto grid gap-3 px-3 pb-3">
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-neutral-700/50 bg-[#1e1f22] p-6">
          <FaBox className="mb-4 h-12 w-12 text-neutral-400" />
          <h2 className="text-xl font-bold text-neutral-100">No Orders Yet</h2>
          <p className="mt-2 text-center text-sm text-neutral-400">
            You haven't placed any orders yet.
            <br />
            Start shopping to see your orders here.
          </p>
          <Link
            href="/search"
            className="mt-4 rounded-full bg-[--m3d-primary-border] px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid gap-3 px-3 pb-3">
      <div className="rounded-lg border border-neutral-700/50 bg-[#1e1f22] p-6">
        <h1 className="text-2xl font-bold text-neutral-100">Your Orders</h1>
        <div className="mt-6 space-y-4">
          {mockOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-neutral-700/50 bg-neutral-800/50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-neutral-700/50">
                    {order.items[0]?.product.featuredImage && (
                      <Image
                        src={order.items[0].product.featuredImage.url}
                        alt={order.items[0].product.featuredImage.altText || ''}
                        className="object-cover"
                        fill
                        sizes="64px"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-100">
                      Order #{order.id}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-400">
                      {order.createdAt.toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      <OrderStatus status={order.status} />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium text-neutral-100">
                    <FaDollarSign className="h-3 w-3" />
                    {order.totalAmount.amount}
                  </div>
                  <div className="mt-2">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-xs text-[--m3d-primary-border] hover:underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 