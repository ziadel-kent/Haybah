import { useCart } from '../hooks/useCart';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // In a real app, you would integrate a payment gateway here.
    // For now, we just clear the cart and show a success message.
    clearCart();
    toast.success(t('cart.checkout') + '!');
  };

  if (isAdmin) return null;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold mb-4">{t('cart.empty')}</h2>
        <p className="text-gray-500 mb-8">{t('cart.empty_desc')}</p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-900 transition-all"
        >
          <span>{t('cart.start_shopping')}</span>
          <ArrowRight size={20} className="rtl:rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-12">{t('cart.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-8">
          {cart.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-6 rtl:space-x-reverse pb-8 border-b border-gray-100"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">{item.sizes.join(', ')}</p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse bg-gray-50 px-3 py-1 rounded-xl">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:text-black transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:text-black transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-3xl p-8 sticky top-24">
            <h2 className="text-xl font-bold mb-6">{t('cart.summary')}</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-500">
                <span>{t('cart.subtotal')}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>{t('cart.shipping')}</span>
                <span>{t('cart.shipping_desc')}</span>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-lg font-bold">{t('cart.total')}</span>
                <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <span>{t('cart.checkout')}</span>
              <ArrowRight size={20} className="rtl:rotate-180" />
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">
              {t('cart.checkout_desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
