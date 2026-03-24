import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Loader2, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!isLogin) {
      if (!phoneNumber) newErrors.phoneNumber = 'Phone number is required';
      else if (!/^\+?[\d\s-]{8,}$/.test(phoneNumber)) newErrors.phoneNumber = 'Invalid phone number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      if (isLogin) {
        await authService.login(email, password);
        toast.success(t('auth.signin') + '!');
      } else {
        await authService.signUp(email, password, role, phoneNumber);
        toast.success(t('auth.signup') + '!');
      }
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-gray-100 p-8 border border-gray-50"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">
            {isLogin ? t('auth.login_title') : t('auth.signup_title')}
          </h1>
          <p className="text-gray-500">
            {isLogin ? t('auth.login_desc') : t('auth.signup_desc')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('auth.email')}</label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-400'} rtl:left-auto rtl:right-4`} size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all rtl:pl-4 rtl:pr-12 ${
                  errors.email 
                    ? 'border-red-200 bg-red-50 focus:ring-red-500' 
                    : 'border-gray-100 focus:ring-black'
                } focus:ring-2 focus:border-transparent`}
                placeholder={t('contact.form.placeholder_email')}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 font-medium ml-2">{errors.email}</p>}
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.phoneNumber ? 'text-red-400' : 'text-gray-400'} rtl:left-auto rtl:right-4`} size={18} />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: '' }));
                  }}
                  className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all rtl:pl-4 rtl:pr-12 ${
                    errors.phoneNumber 
                      ? 'border-red-200 bg-red-50 focus:ring-red-500' 
                      : 'border-gray-100 focus:ring-black'
                  } focus:ring-2 focus:border-transparent`}
                  placeholder="+123 456 7890"
                />
              </div>
              {errors.phoneNumber && <p className="text-xs text-red-500 font-medium ml-2">{errors.phoneNumber}</p>}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('auth.password')}</label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-400'} rtl:left-auto rtl:right-4`} size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border transition-all rtl:pl-4 rtl:pr-12 ${
                  errors.password 
                    ? 'border-red-200 bg-red-50 focus:ring-red-500' 
                    : 'border-gray-100 focus:ring-black'
                } focus:ring-2 focus:border-transparent`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 font-medium ml-2">{errors.password}</p>}
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-3 rounded-2xl border transition-all font-medium ${
                    role === 'user' 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                  }`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-3 rounded-2xl border transition-all font-medium ${
                    role === 'admin' 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 rtl:space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>{isLogin ? t('auth.signin') : t('auth.signup')}</span>
                <ArrowRight size={20} className="rtl:rotate-180" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center space-x-4">
          <div className="flex-grow h-px bg-gray-100"></div>
          <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">or</span>
          <div className="flex-grow h-px bg-gray-100"></div>
        </div>

        <button
          onClick={async () => {
            setLoading(true);
            try {
              await authService.signInWithGoogle(isLogin ? 'user' : role);
              toast.success(t('auth.signin') + '!');
              navigate('/');
            } catch (error: any) {
              toast.error(error.message || 'Google Sign-In failed');
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="w-full mt-6 bg-white border border-gray-100 text-black py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-[0.98] flex items-center justify-center space-x-3 disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebase/anonymous-scan.png" alt="Google" className="w-5 h-5 hidden" />
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            {isLogin ? t('auth.no_account') : t('auth.has_account')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
