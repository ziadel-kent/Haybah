import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { user, profile, isAdmin } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-8 border border-gray-50"
      >
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8 mb-12">
          <div className="relative">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'} 
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-50"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                <User size={48} className="text-gray-400" />
              </div>
            )}
            <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${isAdmin ? 'bg-amber-500' : 'bg-green-500'}`} />
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tighter mb-2">{user.displayName || t('nav.profile')}</h1>
            <p className="text-gray-500 font-medium">{user.email}</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isAdmin ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                {isAdmin ? 'Admin' : 'User'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-gray-50 space-y-4">
            <div className="flex items-center space-x-3 text-gray-600">
              <Mail size={20} />
              <span className="text-sm font-medium">{t('auth.email')}</span>
            </div>
            <p className="font-semibold">{user.email}</p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 space-y-4">
            <div className="flex items-center space-x-3 text-gray-600">
              <Shield size={20} />
              <span className="text-sm font-medium">Role</span>
            </div>
            <p className="font-semibold capitalize">{profile?.role || 'User'}</p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 space-y-4">
            <div className="flex items-center space-x-3 text-gray-600">
              <Calendar size={20} />
              <span className="text-sm font-medium">Member Since</span>
            </div>
            <p className="font-semibold">
              {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 space-y-4">
            <div className="flex items-center space-x-3 text-gray-600">
              <User size={20} />
              <span className="text-sm font-medium">User ID</span>
            </div>
            <p className="font-mono text-xs break-all">{user.uid}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
