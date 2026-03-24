import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('contact.form.send') + '!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-5xl font-bold tracking-tighter mb-6">{t('contact.title')}</h1>
          <p className="text-xl text-gray-500 mb-12 leading-relaxed">
            {t('contact.desc')}
          </p>

          <div className="space-y-8">
            <div className="flex items-start space-x-6 rtl:space-x-reverse">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Mail size={24} className="text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{t('contact.email_us')}</h3>
                <p className="text-gray-500">support@haybah.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-6 rtl:space-x-reverse">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Phone size={24} className="text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{t('contact.call_us')}</h3>
                <p className="text-gray-500">+20 100 000 0000</p>
              </div>
            </div>
            <div className="flex items-start space-x-6 rtl:space-x-reverse">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin size={24} className="text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{t('contact.visit_us')}</h3>
                <p className="text-gray-500">{t('contact.location')}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-50 p-10 rounded-[40px]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t('contact.form.name')}</label>
                <input
                  type="text"
                  required
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                  placeholder={t('contact.form.placeholder_name')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{t('contact.form.email')}</label>
                <input
                  type="email"
                  required
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                  placeholder={t('contact.form.placeholder_email')}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('contact.form.subject')}</label>
              <input
                type="text"
                required
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                placeholder={t('contact.form.placeholder_subject')}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t('contact.form.message')}</label>
              <textarea
                required
                rows={5}
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white"
                placeholder={t('contact.form.placeholder_message')}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-5 rounded-2xl font-bold hover:bg-gray-900 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <span>{t('contact.form.send')}</span>
              <Send size={20} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
