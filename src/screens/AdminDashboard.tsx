import { useState, useEffect } from 'react';
import { Product, UserProfile } from '../types';
import { productService } from '../services/productService';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Plus, Package, Trash2, Edit, Users, Shield, User as UserIcon, Mail, Database } from 'lucide-react';
import AdminProductForm from '../components/AdminProductForm';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { getApiUrl } from '../lib/api';

interface SendEmailModalProps {
  user: UserProfile;
  onClose: () => void;
}

function SendEmailModal({ user, onClose }: SendEmailModalProps) {
  const [subject, setSubject] = useState('A Message from Haybah 🌸 | رسالة من هيبة');
  const [message, setMessage] = useState(`Assalamu Alaikum! ✨

We hope you are having a wonderful day. We are reaching out to you because...

Haybah regards,
The Haybah Team 🌿

---

السلام عليكم! ✨

نتمنى أن تكون في أفضل حال. نحن نتواصل معك بخصوص...

مع تحيات هيبة،
فريق هيبة 🌿`);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!subject.trim()) newErrors.subject = 'Subject is required';
    if (!message.trim()) newErrors.message = 'Message is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSending(true);
    try {
      const response = await fetch(getApiUrl('send-email'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user.email,
          subject,
          text: message,
        }),
      });
      if (response.ok) {
        toast.success('Email sent successfully');
        onClose();
      } else {
        toast.error('Failed to send email');
      }
    } catch (error) {
      toast.error('Error sending email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
        <h2 className="text-xl font-bold mb-6">Send Message to {user.email}</h2>
        <form onSubmit={handleSend} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-tight">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => {
                setSubject(e.target.value);
                if (errors.subject) setErrors(prev => ({ ...prev, subject: '' }));
              }}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                errors.subject ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
              } focus:ring-2 focus:border-transparent`}
              placeholder="Email Subject"
            />
            {errors.subject && <p className="text-xs text-red-500 font-medium">{errors.subject}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-tight">Message</label>
            <textarea
              rows={5}
              value={message}
              onChange={e => {
                setMessage(e.target.value);
                if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
              }}
              className={`w-full px-4 py-3 rounded-xl border transition-all ${
                errors.message ? 'border-red-300 bg-red-50 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
              } focus:ring-2 focus:border-transparent`}
              placeholder="Write your message here..."
            />
            {errors.message && <p className="text-xs text-red-500 font-medium">{errors.message}</p>}
          </div>
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [emailingUser, setEmailingUser] = useState<UserProfile | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [showSeedConfirm, setShowSeedConfirm] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = productService.subscribeToProducts(setProducts);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (activeTab === 'users' && isAdmin) {
      authService.getAllUsers().then(setUsers).catch(console.error);
    }
  }, [activeTab, isAdmin]);

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/" />;

  const handleDelete = async () => {
    if (!deletingProductId) return;
    
    try {
      await productService.deleteProduct(deletingProductId);
      toast.success(t('admin.delete_success'));
      setDeletingProductId(null);
    } catch (error) {
      toast.error('Error deleting product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleToggleRole = async (user: UserProfile) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await authService.updateUserRole(user.uid, newRole);
      setUsers(users.map(u => u.uid === user.uid ? { ...u, role: newRole } : u));
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleSeedDemoData = async () => {
    setIsSeeding(true);
    setShowSeedConfirm(false);
    
    try {
      const demoProducts = [
        {
          title: 'Men\'s Premium Silk Thobe',
          description: 'An elegant, high-quality silk thobe designed for formal occasions. Breathable and comfortable.',
          price: 85.00,
          stock: 15,
          category: 'Thobes',
          section: 'Men',
          imageUrl: 'https://picsum.photos/seed/men1/800/1000',
          imageUrls: [],
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['White', 'Cream', 'Navy'],
          createdAt: Date.now()
        },
        {
          title: 'Women\'s Midnight Abaya',
          description: 'A stunning midnight black abaya with intricate embroidery on the sleeves. Perfect for evening wear.',
          price: 120.00,
          stock: 10,
          category: 'Abayas',
          section: 'Women',
          imageUrl: 'https://picsum.photos/seed/women1/800/1000',
          imageUrls: [],
          sizes: ['M', 'L', 'XL'],
          colors: ['Black', 'Deep Purple'],
          createdAt: Date.now()
        },
        {
          title: 'Children\'s Cotton Play Set',
          description: 'Soft, 100% organic cotton set for children. Durable and gentle on sensitive skin.',
          price: 45.00,
          stock: 20,
          category: 'Sets',
          section: 'Children',
          imageUrl: 'https://picsum.photos/seed/child1/800/1000',
          imageUrls: [],
          sizes: ['2Y', '4Y', '6Y'],
          colors: ['Blue', 'Yellow', 'Pink'],
          createdAt: Date.now()
        },
        {
          title: 'Men\'s Casual Linen Shirt',
          description: 'Lightweight linen shirt for a relaxed yet professional look. Available in multiple colors.',
          price: 35.00,
          stock: 25,
          category: 'Shirts',
          section: 'Men',
          imageUrl: 'https://picsum.photos/seed/men2/800/1000',
          imageUrls: [],
          sizes: ['M', 'L', 'XL', 'XXL'],
          colors: ['Light Blue', 'Beige', 'White'],
          createdAt: Date.now()
        },
        {
          title: 'Women\'s Floral Silk Hijab',
          description: 'A beautiful, lightweight silk hijab with a delicate floral pattern. Adds a touch of elegance to any outfit.',
          price: 25.00,
          stock: 50,
          category: 'Hijabs',
          section: 'Women',
          imageUrl: 'https://picsum.photos/seed/women2/800/1000',
          imageUrls: [],
          sizes: ['Standard'],
          colors: ['Floral Pink', 'Floral Blue'],
          createdAt: Date.now()
        },
        {
          title: 'Children\'s Festive Jubba',
          description: 'A traditional jubba for children, perfect for Eid and other special celebrations.',
          price: 65.00,
          stock: 8,
          category: 'Jubbas',
          section: 'Children',
          imageUrl: 'https://picsum.photos/seed/child2/800/1000',
          imageUrls: [],
          sizes: ['4Y', '6Y', '8Y', '10Y'],
          colors: ['White', 'Gold', 'Silver'],
          createdAt: Date.now()
        }
      ];

      for (const p of demoProducts) {
        await productService.addProduct(p);
      }
      toast.success('Successfully added 6 demo products! 🌟');
    } catch (error) {
      toast.error('Failed to add demo products');
      console.error(error);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{t('admin.title')}</h1>
          <p className="text-gray-500 mt-2">{t('admin.manage_products')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div className="bg-gray-100 p-1 rounded-2xl flex w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <Package size={16} />
                <span>Products</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <Users size={16} />
                <span>Users</span>
              </div>
            </button>
          </div>
          {activeTab === 'products' && (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowSeedConfirm(true)}
                disabled={isSeeding}
                className="btn-secondary flex-1 sm:flex-none px-4 flex items-center justify-center disabled:opacity-50"
                title="Seed Demo Data"
              >
                <Database size={20} className={isSeeding ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={() => {
                  setEditingProduct(undefined);
                  setIsFormOpen(true);
                }}
                className="btn-primary flex-1 sm:flex-none flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <Plus size={20} />
                <span>{t('admin.add_product')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
            <Package size={24} className="text-gray-600" />
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{t('admin.product')}</p>
          <p className="text-4xl font-bold mt-1">{products.length}</p>
        </div>
        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
            <Users size={24} className="text-gray-600" />
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Users</p>
          <p className="text-4xl font-bold mt-1">{users.length || '...'}</p>
        </div>
      </div>

      {activeTab === 'products' ? (
        <div className="card-base overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left rtl:text-right">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">{t('admin.product')}</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Stock</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">{t('admin.price')}</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right rtl:text-left">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-sm">{product.title}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 rounded-md text-[10px] font-bold uppercase tracking-wider text-gray-600">
                        {product.section} / {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold text-sm ${product.stock < 5 ? 'text-red-500' : 'text-gray-900'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm">${product.price}</td>
                    <td className="px-6 py-4 text-right rtl:text-left">
                      <div className="flex justify-end rtl:justify-start space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-400 hover:text-black transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeletingProductId(product.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {products.map((product) => (
              <div key={product.id} className="p-4 space-y-4">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-16 h-16 rounded-2xl object-cover border border-gray-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-base">{product.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-gray-100 rounded-md text-[10px] font-bold uppercase tracking-wider text-gray-600">
                        {product.section} / {product.category}
                      </span>
                      <span className="text-sm font-bold text-gray-900">${product.price}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm">
                    <span className="text-gray-500">Stock: </span>
                    <span className={`font-bold ${product.stock < 5 ? 'text-red-500' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => setDeletingProductId(product.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card-base overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left rtl:text-right">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">User</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Phone</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Role</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right rtl:text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.uid} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-100">
                          <UserIcon size={20} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{u.email}</p>
                          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter">{u.uid}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {u.phoneNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right rtl:text-left">
                      <div className="flex justify-end rtl:justify-start items-center space-x-3 rtl:space-x-reverse">
                        <button
                          onClick={() => setEmailingUser(u)}
                          className="p-2 text-gray-400 hover:text-black transition-colors"
                          title="Send Email"
                        >
                          <Mail size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleRole(u)}
                          className="text-xs font-bold text-black hover:underline"
                        >
                          {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {users.map((u) => (
              <div key={u.uid} className="p-4 space-y-4">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-100">
                    <UserIcon size={24} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base truncate">{u.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                      <span className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-gray-500 font-medium">
                    {u.phoneNumber || 'No phone'}
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <button
                      onClick={() => setEmailingUser(u)}
                      className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <Mail size={18} />
                    </button>
                    <button
                      onClick={() => handleToggleRole(u)}
                      className="px-3 py-2 bg-black text-white rounded-xl text-xs font-bold"
                    >
                      {u.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isFormOpen && (
        <AdminProductForm
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {emailingUser && (
        <SendEmailModal
          user={emailingUser}
          onClose={() => setEmailingUser(null)}
        />
      )}

      {deletingProductId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-center">Are you sure?</h2>
            <p className="text-gray-500 text-center mt-2">This action cannot be undone. This product will be permanently removed.</p>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setDeletingProductId(null)}
                className="flex-1 btn-secondary py-3"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all active:scale-95 py-3"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showSeedConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Database size={32} className="text-amber-500" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-center">Seed Demo Data?</h2>
            <p className="text-gray-500 text-center mt-2">This will add 6 high-quality demo products for Men, Women, and Children to your store.</p>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowSeedConfirm(false)}
                className="flex-1 btn-secondary py-3"
              >
                Cancel
              </button>
              <button
                onClick={handleSeedDemoData}
                className="flex-1 btn-primary py-3"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
