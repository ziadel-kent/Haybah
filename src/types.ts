export interface UserProfile {
  uid: string;
  email: string;
  phoneNumber?: string;
  role: 'admin' | 'user';
  createdAt: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  imageUrls: string[];
  sizes: string[];
  colors?: string[];
  category: string;
  section?: string;
  isFavorite?: boolean; // Client-side state or user-specific
  isInCart?: boolean; // Client-side state
  createdAt: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: 'pending' | 'completed';
  createdAt: number;
}
