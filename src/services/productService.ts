import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';

export const productService = {
  subscribeToProducts(callback: (products: Product[]) => void) {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Product[];
      callback(products);
    });
  },

  async addProduct(product: Omit<Product, 'id'>) {
    return await addDoc(collection(db, 'products'), product);
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const docRef = doc(db, 'products', id);
    return await updateDoc(docRef, product);
  },

  async deleteProduct(id: string) {
    const docRef = doc(db, 'products', id);
    return await deleteDoc(docRef);
  }
};
