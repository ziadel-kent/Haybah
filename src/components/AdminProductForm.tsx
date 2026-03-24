import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { X, Plus, Camera, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface AdminProductFormProps {
  product?: Product;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AdminProductForm({ product, onClose, onSuccess }: AdminProductFormProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    title: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    imageUrls: [],
    sizes: [],
    colors: [],
    category: '',
    section: '',
    createdAt: Date.now(),
  });

  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  const audienceSections = ['Men', 'Women', 'Children', 'Unisex'];
  const commonColors = [
    'Black', 'White', 'Navy Blue', 'Emerald Green', 'Maroon', 
    'Beige', 'Cream', 'Grey', 'Dusty Pink', 'Lavender', 
    'Royal Blue', 'Burgundy', 'Olive', 'Gold', 'Silver'
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock || 0,
        imageUrl: product.imageUrl,
        imageUrls: product.imageUrls || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        category: product.category || '',
        section: product.section || '',
        createdAt: product.createdAt,
      });
    }
  }, [product]);

  const [colorSuggestions, setColorSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (newColor.length >= 1) {
      const filtered = commonColors.filter(c => 
        c.toLowerCase().includes(newColor.toLowerCase()) && 
        !formData.colors?.includes(c)
      );
      setColorSuggestions(filtered);
    } else {
      setColorSuggestions([]);
    }
  }, [newColor, formData.colors]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, imageUrl: base64String }));
        setIsUploading(false);
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload image');
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.section) newErrors.section = 'Audience section is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.imageUrl) newErrors.imageUrl = 'Image is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      if (product) {
        await productService.updateProduct(product.id, formData);
        toast.success(t('admin.edit_success'));
      } else {
        await productService.addProduct(formData);
        toast.success(t('admin.add_success'));
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error('Error saving product');
      console.error(error);
    }
  };

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData({ ...formData, sizes: [...formData.sizes, newSize.trim()] });
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) });
  };

  const toggleStandardSize = (size: string) => {
    if (formData.sizes.includes(size)) {
      removeSize(size);
    } else {
      setFormData({ ...formData, sizes: [...formData.sizes, size] });
    }
  };

  const addColor = (colorName?: string) => {
    const colorToAdd = (colorName || newColor).trim();
    if (colorToAdd && !formData.colors?.includes(colorToAdd)) {
      setFormData({ ...formData, colors: [...(formData.colors || []), colorToAdd] });
      setNewColor('');
      setColorSuggestions([]);
    }
  };

  const removeColor = (color: string) => {
    setFormData({ ...formData, colors: formData.colors?.filter(c => c !== color) || [] });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center p-8 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black tracking-tight">{product ? t('admin.edit') : t('admin.add_product')}</h2>
            <p className="text-gray-500 text-sm mt-1">Fill in the details below to manage your product.</p>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[75vh] overflow-y-auto no-scrollbar">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Product Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
              }}
              className={`${errors.title ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 focus:ring-black'} input-base`}
              placeholder="e.g. Premium Silk Abaya"
            />
            {errors.title && <p className="text-xs text-red-500 font-medium ml-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Audience Section</label>
              <select
                value={formData.section}
                onChange={e => {
                  setFormData({ ...formData, section: e.target.value });
                  if (errors.section) setErrors(prev => ({ ...prev, section: '' }));
                }}
                className={`${errors.section ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 focus:ring-black'} input-base appearance-none`}
              >
                <option value="">Select Audience</option>
                {audienceSections.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
              {errors.section && <p className="text-xs text-red-500 font-medium ml-1">{errors.section}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={e => {
                  setFormData({ ...formData, category: e.target.value });
                  if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                }}
                className={`${errors.category ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 focus:ring-black'} input-base`}
                placeholder="e.g. Abayas, Hijabs, Thobes"
              />
              {errors.category && <p className="text-xs text-red-500 font-medium ml-1">{errors.category}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={e => {
                  setFormData({ ...formData, price: parseFloat(e.target.value) });
                  if (errors.price) setErrors(prev => ({ ...prev, price: '' }));
                }}
                className={`${errors.price ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 focus:ring-black'} input-base`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-xs text-red-500 font-medium ml-1">{errors.price}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={e => {
                  setFormData({ ...formData, stock: parseInt(e.target.value) });
                  if (errors.stock) setErrors(prev => ({ ...prev, stock: '' }));
                }}
                className={`${errors.stock ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 focus:ring-black'} input-base`}
                placeholder="0"
              />
              {errors.stock && <p className="text-xs text-red-500 font-medium ml-1">{errors.stock}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
              }}
              className={`${errors.description ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 focus:ring-black'} input-base resize-none`}
              placeholder="Describe the product details..."
            />
            {errors.description && <p className="text-xs text-red-500 font-medium ml-1">{errors.description}</p>}
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Product Image</label>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, imageUrl: e.target.value }));
                    if (errors.imageUrl) setErrors(prev => ({ ...prev, imageUrl: '' }));
                  }}
                  className={`${errors.imageUrl ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 focus:ring-black'} input-base`}
                  placeholder="Paste image URL or upload below"
                />
                {errors.imageUrl && <p className="text-xs text-red-500 font-medium mt-1 ml-1">{errors.imageUrl}</p>}
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  ref={cameraInputRef}
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary px-4 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <Upload size={18} />
                  <span className="hidden sm:inline">Gallery</span>
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="btn-secondary px-4 flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <Camera size={18} />
                  <span className="hidden sm:inline">Camera</span>
                </button>
              </div>
            </div>

            {isUploading && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 ml-1">
                <Loader2 className="animate-spin" size={16} />
                <span>Uploading image...</span>
              </div>
            )}

            {formData.imageUrl && (
              <div className="relative w-32 h-32 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: '' })}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black transition-colors backdrop-blur-md"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Available Sizes</label>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {standardSizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleStandardSize(size)}
                  className={`px-5 py-2 rounded-xl border transition-all font-bold text-xs ${
                    formData.sizes.includes(size)
                      ? 'bg-black text-white border-black shadow-md'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSize}
                onChange={e => setNewSize(e.target.value)}
                className="input-base flex-1"
                placeholder="Add custom size (e.g. 42, 44)"
              />
              <button
                type="button"
                onClick={addSize}
                className="btn-primary px-4"
                disabled={!newSize.trim()}
              >
                <Plus size={24} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.sizes.map(size => (
                <span
                  key={size}
                  className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs font-bold flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <span>{size}</span>
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest min-w-0 ml-1">Product Colors</label>
            <div className="relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newColor}
                  onChange={e => setNewColor(e.target.value)}
                  className="input-base flex-1"
                  placeholder="Type to search colors (e.g. Black)"
                />
                <button
                  type="button"
                  onClick={() => addColor()}
                  className="btn-primary px-4"
                  disabled={!newColor.trim()}
                >
                  <Plus size={24} />
                </button>
              </div>
              
              {colorSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-48 overflow-y-auto no-scrollbar">
                  {colorSuggestions.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => addColor(color)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm font-medium border-b border-gray-50 last:border-0"
                    >
                      {color}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.colors?.map(color => (
                <span
                  key={color}
                  className="px-4 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs font-bold flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <span>{color}</span>
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : (product ? t('admin.edit') : t('admin.add_product'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
