import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User, Menu, X, Settings, Globe, ShoppingBag } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useState } from 'react';
import { authService } from '../services/authService';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { user, isAdmin } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse group">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <ShoppingBag className="text-white" size={20} />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">Haybah</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10 rtl:space-x-reverse">
            <Link to="/" className="text-sm font-bold text-gray-500 hover:text-black transition-colors relative group">
              {t('nav.home')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
            </Link>
            <Link to="/products" className="text-sm font-bold text-gray-500 hover:text-black transition-colors relative group">
              {t('nav.products')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
            </Link>
            <Link to="/contact" className="text-sm font-bold text-gray-500 hover:text-black transition-colors relative group">
              {t('nav.contact')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              <Globe size={14} />
              <span>{i18n.language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            <Link 
              to="/cart" 
              className="p-2.5 hover:bg-gray-50 rounded-xl transition-colors relative group"
            >
              <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-black text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Link 
                  to={isAdmin ? "/admin" : "/profile"} 
                  className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse p-1.5 pr-4 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-8 h-8 rounded-full border border-gray-100"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <User size={16} />
                    </div>
                  )}
                  <span className="text-xs font-bold truncate max-w-[100px]">
                    {isAdmin ? t('nav.admin') : t('nav.profile')}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary py-2 px-6 text-sm"
              >
                {t('nav.login')}
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2.5 hover:bg-gray-50 rounded-xl transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container-custom py-8 flex flex-col space-y-6">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black tracking-tight hover:text-gray-600 transition-colors">{t('nav.home')}</Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black tracking-tight hover:text-gray-600 transition-colors">{t('nav.products')}</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black tracking-tight hover:text-gray-600 transition-colors">{t('nav.contact')}</Link>
              {user && (
                <Link to={isAdmin ? "/admin" : "/profile"} onClick={() => setIsMenuOpen(false)} className="text-2xl font-black tracking-tight hover:text-gray-600 transition-colors">
                  {isAdmin ? t('nav.admin') : t('nav.profile')}
                </Link>
              )}
              <div className="pt-6 border-t border-gray-100 flex flex-col space-y-4">
                <button
                  onClick={() => { toggleLanguage(); setIsMenuOpen(false); }}
                  className="flex items-center space-x-3 rtl:space-x-reverse text-lg font-bold"
                >
                  <Globe size={20} />
                  <span>{i18n.language === 'en' ? 'Switch to Arabic' : 'Switch to English'}</span>
                </button>
                {!user && (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary text-center"
                  >
                    {t('nav.login')}
                  </Link>
                )}
                {user && (
                  <button onClick={handleLogout} className="text-lg font-bold text-red-600 text-left rtl:text-right">{t('nav.logout')}</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
