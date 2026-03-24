import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from 'sonner';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Toaster position="top-center" richColors />
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
