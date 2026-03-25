import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { productService } from '../services/productService';
import { authService } from '../services/authService';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const unsubscribe = productService.subscribeToProducts((products) => {
      setFeaturedProducts(products.slice(0, 4));
    });
    return unsubscribe;
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1584227440498-72412e87d036?auto=format&fit=crop&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-[0.2em] mb-6">
              {t('hero.subtitle')}
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold text-white leading-[1.1] tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="mt-8 text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed">
              Experience the perfect blend of tradition and modern elegance with our exclusive collection.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="btn-primary bg-white text-black hover:bg-gray-100 px-10 py-4 text-lg text-center"
              >
                {t('hero.cta')}
              </Link>
              <Link
                to="/products"
                className="px-10 py-4 rounded-xl font-bold text-white border border-white/30 hover:bg-white/10 transition-all backdrop-blur-sm text-lg text-center"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShoppingBag, title: t('features.quality'), desc: t('features.quality_desc') },
              { icon: Zap, title: t('features.delivery'), desc: t('features.delivery_desc') },
              { icon: ShieldCheck, title: t('features.secure'), desc: t('features.secure_desc') }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-spacing">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black">{t('featured.title')}</h2>
              <p className="text-gray-500 mt-4 text-lg">{t('featured.subtitle')}</p>
            </div>
            <Link 
              to="/products" 
              className="group flex items-center gap-2 text-black font-bold hover:gap-4 transition-all"
            >
              <span>{t('featured.view_all')}</span>
              <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Banners */}
      <section className="section-spacing pt-0">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-[500px] rounded-[3rem] overflow-hidden group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80"
                alt="Men's Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-12 left-12">
                <h3 className="text-4xl font-bold text-white mb-4">{t('categories.men')}</h3>
                <Link to="/products" className="btn-primary bg-white text-black hover:bg-gray-100">
                  {t('categories.explore')}
                </Link>
              </div>
            </div>
            <div className="relative h-[500px] rounded-[3rem] overflow-hidden group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80"
                alt="Women's Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-12 left-12">
                <h3 className="text-4xl font-bold text-white mb-4">{t('categories.women')}</h3>
                <Link to="/products" className="btn-primary bg-white text-black hover:bg-gray-100">
                  {t('categories.explore')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section (Opening Soon style) */}
      <section className="section-spacing bg-white">
        <div className="container-custom max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <h2 className="text-4xl md:text-6xl font-extrabold text-black mb-6">
              {t('newsletter.title')}
            </h2>
            <p className="text-gray-500 text-lg md:text-xl mb-12 max-w-2xl">
              {t('newsletter.subtitle')}
            </p>
            
            <NewsletterForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function NewsletterForm() {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    try {
      await authService.subscribeToNewsletter(phone);
      
      setSubmitted(true);
      setPhone('');
    } catch (error) {
      console.error('Newsletter signup failed', error);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 text-green-600 font-bold text-xl"
      >
        <ShieldCheck size={28} />
        <span>{t('newsletter.success')}</span>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col sm:flex-row gap-4">
      <input
        type="tel"
        placeholder={t('newsletter.placeholder')}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="flex-grow px-8 py-4 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-lg"
        required
      />
      <button
        type="submit"
        className="btn-primary px-10 py-4 text-lg whitespace-nowrap"
      >
        {t('newsletter.button')}
      </button>
    </form>
  );
}
