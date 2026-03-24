import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold tracking-tighter mb-4">Haybah</h2>
            <p className="text-gray-500 max-w-xs">
              {t('hero.subtitle')}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">{t('nav.products')}</h3>
            <ul className="space-y-2">
              <li><a href="/products" className="text-gray-500 hover:text-black transition-colors">{t('featured.view_all')}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">{t('nav.contact')}</h3>
            <ul className="space-y-2">
              <li><a href="/contact" className="text-gray-500 hover:text-black transition-colors">{t('nav.contact')}</a></li>
              <li className="text-gray-500">{t('contact.location')}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2026 Haybah. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-black transition-colors">Instagram</a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
