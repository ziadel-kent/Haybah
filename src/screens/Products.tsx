import { useState, useEffect } from 'react';
import { Product } from '../types';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Search, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { t } = useTranslation();

  const categories = ['All', 'Men', 'Women', 'Children'];

  useEffect(() => {
    const unsubscribe = productService.subscribeToProducts((allProducts) => {
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const filtered = products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.section === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black">{t('nav.products')}</h1>
          <p className="text-gray-500 mt-4 text-lg leading-relaxed">{t('featured.subtitle')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          <div className="bg-gray-50 p-1 rounded-2xl flex overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-white shadow-sm text-black' 
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 rtl:left-auto rtl:right-4" size={20} />
            <input
              type="text"
              placeholder={t('nav.products') + '...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base pl-12 rtl:pl-4 rtl:pr-12"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-32 bg-gray-50 rounded-[3rem] mt-12 border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Search size={32} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-black">No products found</h3>
          <p className="text-gray-500 mt-2 max-w-xs mx-auto">Try adjusting your search or category filters to find what you're looking for.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="mt-8 text-sm font-bold underline underline-offset-4 hover:text-gray-600 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
