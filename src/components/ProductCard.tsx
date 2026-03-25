import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { Edit, Trash2, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAdmin } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        
        {/* Admin Actions */}
        {isAdmin && (onEdit || onDelete) && (
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit?.(product)}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            >
              <Edit size={16} className="text-gray-600" />
            </button>
            <button
              onClick={() => onDelete?.(product.id)}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        )}

        {/* Add to Cart Overlay */}
        {!isAdmin && (
          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-black text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-gray-900 transition-colors"
            >
              <Plus size={18} />
              <span>Add to Cart</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{product.title}</h3>
          <div className="flex flex-col space-y-1 mt-1">
            {product.section && (
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">
                {product.section}
              </span>
            )}
            <p className="text-xs text-gray-500">
              {product.sizes.join(', ')}
              {product.colors && product.colors.length > 0 && ` • ${product.colors.join(', ')}`}
            </p>
          </div>
        </div>
        <p className="text-sm font-bold text-gray-900">${product.price}</p>
      </div>
    </motion.div>
  );
}
