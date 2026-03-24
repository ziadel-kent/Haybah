import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import Layout from './components/Layout';
import Home from './screens/Home';
import Products from './screens/Products';
import Cart from './screens/Cart';
import Login from './screens/Login';
import AdminDashboard from './screens/AdminDashboard';
import Contact from './screens/Contact';
import Profile from './screens/Profile';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function AuthGuard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    
    // If user is not logged in, redirect to login for protected routes
    const publicRoutes = ['/login', '/contact', '/products', '/']; // Home and products are public in this app
    const isPublic = publicRoutes.includes(location.pathname);
    
    if (!user && !isPublic) {
      navigate('/login');
    }
  }, [user, loading, navigate, location.pathname]);

  return null;
}

function AppContent() {
  const { i18n } = useTranslation();
  const { loading } = useAuth();
  
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  if (loading) return null;

  return (
    <Router>
      <AuthGuard />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
