import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "products": "Products",
        "contact": "Contact",
        "admin": "Admin Dashboard",
        "login": "Login",
        "logout": "Logout"
      },
      "hero": {
        "title": "Elegance in Every Detail.",
        "subtitle": "Discover our curated collection of premium essentials designed for the modern lifestyle.",
        "cta": "Shop Collection"
      },
      "features": {
        "quality": "Premium Quality",
        "quality_desc": "Crafted from the finest materials to ensure longevity and comfort.",
        "delivery": "Fast Delivery",
        "delivery_desc": "Express shipping worldwide. Your style, delivered at your doorstep.",
        "secure": "Secure Checkout",
        "secure_desc": "Your security is our priority. Shop with confidence and peace of mind."
      },
      "featured": {
        "title": "Featured Products",
        "subtitle": "Handpicked items from our latest collection.",
        "view_all": "View All"
      },
      "categories": {
        "men": "Men's Collection",
        "women": "Women's Collection",
        "children": "Children's Collection",
        "unisex": "Unisex Collection",
        "explore": "Explore"
      },
      "cart": {
        "title": "Shopping Cart",
        "empty": "Your cart is empty",
        "empty_desc": "Looks like you haven't added anything to your cart yet.",
        "start_shopping": "Start Shopping",
        "summary": "Order Summary",
        "subtotal": "Subtotal",
        "shipping": "Shipping",
        "shipping_desc": "Calculated at next step",
        "total": "Total",
        "checkout": "Checkout via WhatsApp",
        "checkout_desc": "By clicking checkout, you will be redirected to WhatsApp to complete your order."
      },
      "contact": {
        "title": "Get in Touch.",
        "subtitle": "Have a question about our products or an order? We're here to help.",
        "email": "Email Us",
        "call": "Call Us",
        "visit": "Visit Us",
        "location": "Qena, 23 July Street",
        "form": {
          "first_name": "First Name",
          "last_name": "Last Name",
          "email": "Email Address",
          "message": "Message",
          "placeholder_first": "John",
          "placeholder_last": "Doe",
          "placeholder_email": "john@example.com",
          "placeholder_message": "How can we help you?",
          "send": "Send Message"
        }
      },
      "auth": {
        "login_title": "Welcome Back",
        "signup_title": "Create Account",
        "login_desc": "Enter your details to access your account",
        "signup_desc": "Join Haybah for the best shopping experience",
        "email": "Email Address",
        "password": "Password",
        "signin": "Sign In",
        "signup": "Sign Up",
        "no_account": "Don't have an account? Sign Up",
        "has_account": "Already have an account? Sign In"
      },
      "admin": {
        "title": "Admin Dashboard",
        "subtitle": "Manage your store's catalog and inventory.",
        "add_product": "Add Product",
        "total_products": "Total Products",
        "delete_success": "Product deleted successfully",
        "table": {
          "product": "Product",
          "price": "Price",
          "sizes": "Sizes",
          "actions": "Actions"
        }
      }
    }
  },
  ar: {
    translation: {
      "nav": {
        "home": "الرئيسية",
        "products": "المنتجات",
        "contact": "اتصل بنا",
        "admin": "لوحة التحكم",
        "login": "تسجيل الدخول",
        "logout": "تسجيل الخروج"
      },
      "hero": {
        "title": "الأناقة في كل تفصيلة.",
        "subtitle": "اكتشف مجموعتنا المختارة من الأساسيات الفاخرة المصممة لنمط الحياة العصري.",
        "cta": "تسوق المجموعة"
      },
      "features": {
        "quality": "جودة ممتازة",
        "quality_desc": "مصنوعة من أجود المواد لضمان الاستدامة والراحة.",
        "delivery": "توصيل سريع",
        "delivery_desc": "شحن سريع لجميع أنحاء العالم. أسلوبك، يصل إلى باب منزلك.",
        "secure": "دفع آمن",
        "secure_desc": "أمنك هو أولويتنا. تسوق بثقة وراحة بال."
      },
      "featured": {
        "title": "منتجات مميزة",
        "subtitle": "قطع مختارة بعناية من أحدث مجموعاتنا.",
        "view_all": "عرض الكل"
      },
      "categories": {
        "men": "مجموعة الرجال",
        "women": "مجموعة النساء",
        "children": "مجموعة الأطفال",
        "unisex": "مجموعة للجنسين",
        "explore": "استكشف"
      },
      "cart": {
        "title": "سلة التسوق",
        "empty": "سلتك فارغة",
        "empty_desc": "يبدو أنك لم تضف أي شيء إلى سلتك بعد.",
        "start_shopping": "ابدأ التسوق",
        "summary": "ملخص الطلب",
        "subtotal": "المجموع الفرعي",
        "shipping": "الشحن",
        "shipping_desc": "يتم حسابه في الخطوة التالية",
        "total": "الإجمالي",
        "checkout": "إتمام الطلب عبر واتساب",
        "checkout_desc": "بالنقر على إتمام الطلب، سيتم توجيهك إلى واتساب لإكمال طلبك."
      },
      "contact": {
        "title": "تواصل معنا.",
        "subtitle": "لديك سؤال حول منتجاتنا أو طلبك؟ نحن هنا للمساعدة.",
        "email": "راسلنا",
        "call": "اتصل بنا",
        "visit": "زورنا",
        "location": "قنا، شارع 23 يوليو",
        "form": {
          "first_name": "الاسم الأول",
          "last_name": "الاسم الأخير",
          "email": "البريد الإلكتروني",
          "message": "الرسالة",
          "placeholder_first": "أحمد",
          "placeholder_last": "علي",
          "placeholder_email": "ahmed@example.com",
          "placeholder_message": "كيف يمكننا مساعدتك؟",
          "send": "إرسال الرسالة"
        }
      },
      "auth": {
        "login_title": "مرحباً بعودتك",
        "signup_title": "إنشاء حساب",
        "login_desc": "أدخل بياناتك للوصول إلى حسابك",
        "signup_desc": "انضم إلى هيبة للحصول على أفضل تجربة تسوق",
        "email": "البريد الإلكتروني",
        "password": "كلمة المرور",
        "signin": "تسجيل الدخول",
        "signup": "إنشاء حساب",
        "no_account": "ليس لديك حساب؟ سجل الآن",
        "has_account": "لديك حساب بالفعل؟ سجل دخولك"
      },
      "admin": {
        "title": "لوحة التحكم",
        "subtitle": "إدارة كتالوج المتجر والمخزون.",
        "add_product": "إضافة منتج",
        "total_products": "إجمالي المنتجات",
        "delete_success": "تم حذف المنتج بنجاح",
        "table": {
          "product": "المنتج",
          "price": "السعر",
          "sizes": "المقاسات",
          "actions": "الإجراءات"
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
