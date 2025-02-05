'use client';

import { useCart } from 'components/cart/cart-context';
import Price from 'components/price';
import { AnimatePresence, motion } from 'framer-motion';
import { CartLine } from 'lib/types/cart';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaCheckCircle, FaChevronDown, FaCog, FaCopy, FaDownload, FaInfoCircle, FaSave, FaTimes, FaTrash } from 'react-icons/fa';

interface PrintSettings {
  layerHeight?: string;
  infillAmount?: string;
}

const ComplexityBadge = ({ complexity }: { complexity: 'Low' | 'Medium' | 'High' | 'Very High' }) => {
  const colors = {
    Low: 'text-green-400',
    Medium: 'text-yellow-400',
    High: 'text-orange-400',
    'Very High': 'text-red-400'
  };

  return (
    <span className={`text-xs font-medium ${colors[complexity]}`}>
      {complexity} Complexity
    </span>
  );
};

const fadeInOut = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 }
};

const slideDownUp = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.2 }
};

const LAYER_HEIGHT_OPTIONS = [0.08, 0.12, 0.16, 0.20, 0.24];
const INFILL_OPTIONS = Array.from({ length: 8 }, (_, i) => (i + 1) * 10);

export default function CartPage() {
  const { cart, updateCartItem, updatePrintSettings } = useCart();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showPrintSettings, setShowPrintSettings] = useState<Set<string>>(new Set());
  const [showPrintAddons, setShowPrintAddons] = useState(false);
  const [showSpecialInstructions, setShowSpecialInstructions] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

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

  const copyItem = (item: CartLine) => {
    // Implement copy functionality
    console.log('Copying item:', item);
  };

  const deleteItem = (item: CartLine) => {
    updateCartItem(item.merchandise.id, 'delete');
  };

  const handlePrintSettingsChange = (
    merchandiseId: string,
    layerHeight: number,
    infill: number
  ) => {
    updatePrintSettings(merchandiseId, layerHeight, infill);
  };

  if (!cart || cart.lines.length === 0) {
    return (
      <motion.div 
        className="mx-auto grid gap-3 px-3 pb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-[#1e1f22] p-6">
          <div className="mb-4 text-4xl">🛒</div>
          <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
          <p className="text-neutral-400">Add some awesome 3D prints to get started!</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full bg-[--m3d-primary-border] px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
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
          <AnimatePresence mode="popLayout">
            {cart.lines.map((item: CartLine) => (
              <motion.div
                key={item.merchandise.id}
                {...fadeInOut}
                className="flex flex-col rounded-lg border border-neutral-700/50 bg-[#1e1f22] p-4"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.merchandise.id)}
                    onChange={() => toggleItemSelection(item.merchandise.id)}
                    className="mt-1.5 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-[--m3d-primary-border]"
                  />
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-neutral-700/50 bg-neutral-900">
                    {item.merchandise.product.featuredImage && (
                      <Image
                        fill
                        src={item.merchandise.product.featuredImage.url}
                        alt={item.merchandise.product.featuredImage.altText || item.merchandise.product.title}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{item.merchandise.product.title}</h3>
                        <div className="mt-1">
                          <ComplexityBadge complexity="High" />
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-xs text-neutral-400">
                          <span className="bg-emerald-500/10 px-2 py-0.5 text-[--m3d-primary-border] font-bold rounded-md">Mass: 450 g</span>
                          <span className="bg-emerald-500/10 px-2 py-0.5 text-emerald-400 font-bold rounded-md">Est. Print Time: ~ 360 min</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyItem(item)}
                            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                          >
                            <FaCopy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteItem(item)}
                            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
                          >
                            <FaTimes className="h-4 w-4" />
                          </button>
                        </div>
                        <Price
                          amount={item.merchandise.price.amount}
                          currencyCode={item.merchandise.price.currencyCode}
                        />
                        <div className="mt-2">
                          <select
                            value={item.quantity}
                            onChange={(e) => {
                              const newQuantity = parseInt(e.target.value);
                              updateCartItem(item.merchandise.id, 'set', newQuantity);
                            }}
                            className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm"
                          >
                            {[...Array(20)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <button
                        onClick={() => togglePrintSettings(item.merchandise.id)}
                        className="flex items-center gap-1.5 rounded-md border border-neutral-700/50 bg-neutral-800/50 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-700/50"
                      >
                        <FaCog className="h-3.5 w-3.5" />
                        Print Settings
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {showPrintSettings.has(item.merchandise.id) && (
                        <motion.div
                          {...slideDownUp}
                          className="mt-3 grid grid-cols-2 gap-3 rounded-lg bg-neutral-900/50 p-3"
                        >
                          <div>
                            <label className="text-xs text-neutral-400">Layer Height</label>
                            <select 
                              className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
                              value={item.printSettings?.layerHeight || 0.20}
                              onChange={(e) => handlePrintSettingsChange(
                                item.merchandise.id,
                                parseFloat(e.target.value),
                                item.printSettings?.infill || 20
                              )}
                            >
                              {LAYER_HEIGHT_OPTIONS.map((height) => (
                                <option key={height} value={height}>
                                  {height.toFixed(2)}mm
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-neutral-400">Infill Amount</label>
                            <select 
                              className="mt-1 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
                              value={item.printSettings?.infill || 20}
                              onChange={(e) => handlePrintSettingsChange(
                                item.merchandise.id,
                                item.printSettings?.layerHeight || 0.20,
                                parseInt(e.target.value)
                              )}
                            >
                              {INFILL_OPTIONS.map((amount) => (
                                <option key={amount} value={amount}>
                                  {amount}%
                                </option>
                              ))}
                            </select>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="rounded-lg bg-[#1e1f22] p-4">
          <h2 className="text-lg font-bold leading-none">Order Summary</h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Items ( {cart.lines.length} )</span>
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

            <div className="rounded-md bg-emerald-500/5 p-2 text-xs text-emerald-400">
              You qualify for free shipping!
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setShowPrintAddons(!showPrintAddons)}
                className="flex w-full items-center justify-between rounded-md border border-neutral-700/50 bg-neutral-800/50 px-3 py-2 text-sm font-medium text-neutral-200"
              >
                Print Add-ons
                <FaChevronDown className={`h-3 w-3 transform transition-transform ${showPrintAddons ? 'rotate-180' : ''}`} />
              </button>
              {showPrintAddons && (
                <motion.div
                  {...slideDownUp}
                  className="rounded-md border border-neutral-700/50 bg-neutral-900/50 p-3"
                >
                  {/* Add print add-ons options here */}
                </motion.div>
              )}

              <button
                onClick={() => setShowSpecialInstructions(!showSpecialInstructions)}
                className="flex w-full items-center justify-between rounded-md border border-neutral-700/50 bg-neutral-800/50 px-3 py-2 text-sm font-medium text-neutral-200"
              >
                Special Instructions
                <FaChevronDown className={`h-3 w-3 transform transition-transform ${showSpecialInstructions ? 'rotate-180' : ''}`} />
              </button>
              {showSpecialInstructions && (
                <motion.div
                  {...slideDownUp}
                  className="rounded-md border border-neutral-700/50 bg-neutral-900/50 p-3"
                >
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Add any special instructions for your order..."
                    className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500"
                    rows={3}
                  />
                </motion.div>
              )}
            </div>

            <div className="rounded-md bg-blue-500/5 p-3 text-xs text-blue-400">
              <div className="flex items-start gap-2">
                <FaInfoCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="font-medium">Estimated completion time:</p>
                  <p className="mt-1">4-5 business days</p>
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.1 }}
              className="w-full rounded-full bg-[--m3d-primary-border] py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Proceed to Checkout
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
} 