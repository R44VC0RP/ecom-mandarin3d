'use client';

import { useCart } from 'components/cart/cart-context';
import Price from 'components/price';
import { CartLine } from 'lib/types/cart';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaCheckCircle, FaCog, FaDownload, FaSave, FaTrash } from 'react-icons/fa';

interface PrintSettings {
  layerHeight?: string;
  infillAmount?: string;
}

const ComplexityBadge = ({ complexity }: { complexity: 'Low' | 'Medium' | 'High' | 'Very High' }) => {
  const colors = {
    Low: 'bg-green-500/10 text-green-400',
    Medium: 'bg-yellow-500/10 text-yellow-400',
    High: 'bg-orange-500/10 text-orange-400',
    'Very High': 'bg-red-500/10 text-red-400'
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[complexity]}`}>
      {complexity} Complexity
    </span>
  );
};

export default function CartPage() {
  const { cart, updateCartItem } = useCart();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showPrintSettings, setShowPrintSettings] = useState<Set<string>>(new Set());

  const toggleItemSelection = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const togglePrintSettings = (id: string) => {
    const newSettings = new Set(showPrintSettings);
    if (newSettings.has(id)) {
      newSettings.delete(id);
    } else {
      newSettings.add(id);
    }
    setShowPrintSettings(newSettings);
  };

  const selectAll = () => {
    const allIds = cart?.lines.map(line => line.merchandise.id) || [];
    setSelectedItems(new Set(allIds));
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const downloadSelected = () => {
    // Implement download functionality
    console.log('Downloading selected items:', selectedItems);
  };

  const saveSelected = () => {
    // Implement save functionality
    console.log('Saving selected items:', selectedItems);
  };

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="mx-auto grid gap-3 px-3 pb-3">
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-[#1e1f22] p-6">
          <div className="mb-4 text-4xl">🛒</div>
          <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
          <p className="text-neutral-400">Add some awesome 3D prints to get started!</p>
          <Link
            href="/"
            className="mt-4 rounded-full bg-[--m3d-primary-border] px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid gap-3 px-3 pb-3 max-w-7xl">
      <div className="flex items-center justify-between rounded-lg bg-[#1e1f22] p-3">
        <h1 className="text-lg font-bold leading-none">Shopping Cart</h1>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="flex items-center gap-1.5 rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
          >
            <FaCheckCircle className="h-3.5 w-3.5" />
            Select All
          </button>
          {selectedItems.size > 0 && (
            <>
              <button
                onClick={clearSelection}
                className="flex items-center gap-1.5 rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
              >
                <FaTrash className="h-3.5 w-3.5" />
                Clear Selection
              </button>
              <button
                onClick={downloadSelected}
                className="flex items-center gap-1.5 rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
              >
                <FaDownload className="h-3.5 w-3.5" />
                Download
              </button>
              <button
                onClick={saveSelected}
                className="flex items-center gap-1.5 rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
              >
                <FaSave className="h-3.5 w-3.5" />
                Save
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="col-span-2 space-y-3">
          {cart.lines.map((item: CartLine) => (
            <div
              key={item.merchandise.id}
              className="rounded-lg bg-[#1e1f22] p-3"
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.merchandise.id)}
                  onChange={() => toggleItemSelection(item.merchandise.id)}
                  className="mt-1.5 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-[--m3d-primary-border]"
                />
                <div className="relative h-20 w-20 overflow-hidden rounded-md border border-neutral-700 bg-neutral-900">
                  {item.merchandise.product.featuredImage && (
                    <Image
                      fill
                      src={item.merchandise.product.featuredImage.url}
                      alt={item.merchandise.product.featuredImage.altText || item.merchandise.product.title}
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{item.merchandise.product.title}</h3>
                      <div className="mt-1 space-x-2">
                        <ComplexityBadge complexity="Medium" />
                        <span className="text-xs text-neutral-400">Mass: 125g</span>
                        <span className="text-xs text-neutral-400">Est. Print Time: 2h 30m</span>
                      </div>
                    </div>
                    <Price
                      className="text-right"
                      amount={item.merchandise.price.amount}
                      currencyCode={item.merchandise.price.currencyCode}
                    />
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => togglePrintSettings(item.merchandise.id)}
                      className="flex items-center gap-1.5 rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
                    >
                      <FaCog className="h-3.5 w-3.5" />
                      Print Settings
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartItem(item.merchandise.id, 'minus')}
                        className="rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item.merchandise.id, 'plus')}
                        className="rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {showPrintSettings.has(item.merchandise.id) && (
                    <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg bg-neutral-900 p-3">
                      <div>
                        <label className="text-xs text-neutral-400">Layer Height</label>
                        <select className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm">
                          <option value="0.1">0.1mm</option>
                          <option value="0.2">0.2mm</option>
                          <option value="0.3">0.3mm</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-neutral-400">Infill Amount</label>
                        <select className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm">
                          <option value="20">20%</option>
                          <option value="50">50%</option>
                          <option value="100">100%</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-[#1e1f22] p-3">
          <h2 className="text-lg font-bold leading-none">Order Summary</h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Subtotal</span>
              <Price
                amount={cart.cost.subtotalAmount.amount}
                currencyCode={cart.cost.subtotalAmount.currencyCode}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Tax</span>
              <Price
                amount={cart.cost.totalTaxAmount.amount}
                currencyCode={cart.cost.totalTaxAmount.currencyCode}
              />
            </div>
            <div className="border-t border-neutral-700 pt-3">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <Price
                  className="text-lg font-bold"
                  amount={cart.cost.totalAmount.amount}
                  currencyCode={cart.cost.totalAmount.currencyCode}
                />
              </div>
            </div>
            <button className="w-full rounded-full bg-[--m3d-primary-border] py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 