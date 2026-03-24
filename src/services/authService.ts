import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types';

export const authService = {
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
  },

  async signUp(email: string, password: string, role: 'user' | 'admin' = 'user', phoneNumber?: string): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        phoneNumber: phoneNumber,
        role: role,
        createdAt: Date.now(),
      };
      await setDoc(doc(db, 'users', user.uid), profile);
      
      // Send welcome email with a warm attitude 🌟
      try {
        const welcomeArabic = `السلام عليكم! 🌸
نحن سعداء جداً بانضمامك إلى عائلة هيبة! شكراً جزيلاً لاختيارك لنا. ✨

لقد تم تسجيل حسابك بنجاح برقم الهاتف: ${phoneNumber || 'لم يتم تقديمه بعد'}.

فريقنا هنا لضمان حصولك على تجربة أكثر أناقة وراحة مع مجموعتنا. إذا كنت بحاجة إلى أي شيء على الإطلاق، فلا تتردد في التواصل معنا.

نتمنى لك يوماً رائعاً! 💖

مع تحيات هيبة،
فريق هيبة 🌿`;

        const welcomeEnglish = `Assalamu Alaikum! 🌸
We are absolutely delighted to have you join the Haybah family! Thank you so much for choosing us. ✨

We've successfully registered your account with the phone number: ${phoneNumber || 'Not provided yet'}.

Our team is here to ensure you have the most elegant and comfortable experience with our collection. If you ever need anything at all, please don't hesitate to reach out to us.

Wishing you a wonderful day ahead! 💖

Haybah regards,
The Haybah Team 🌿`;

        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: 'Welcome to the Haybah Family! ✨ | مرحباً بك في عائلة هيبة!',
            text: `${welcomeEnglish}\n\n---\n\n${welcomeArabic}`
          })
        });

        // Placeholder for SMS sending 📱
        if (phoneNumber) {
          await fetch('/api/send-sms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: phoneNumber,
              text: `Assalamu Alaikum! ✨ Welcome to Haybah. We are so happy to have you with us! 🌸 | السلام عليكم! ✨ مرحباً بك في هيبة. نحن سعداء جداً بانضمامك إلينا! 🌸`
            })
          });
        }
      } catch (e) {
        console.error('Failed to send welcome messages', e);
      }

      return user;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('User already exists. Please sign in');
      }
      throw error;
    }
  },

  async login(email: string, password: string): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Email or password is incorrect');
      }
      throw error;
    }
  },

  async signInWithGoogle(role: 'user' | 'admin' = 'user'): Promise<User> {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    
    // Check if profile exists, if not create it
    const profile = await this.getUserProfile(user.uid);
    if (!profile) {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        role: role,
        createdAt: Date.now(),
      };
      await setDoc(doc(db, 'users', user.uid), newProfile);
    }
    return user;
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  async getAllUsers(): Promise<UserProfile[]> {
    const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as UserProfile);
  },

  async updateUserRole(uid: string, role: 'user' | 'admin'): Promise<void> {
    const { doc, updateDoc } = await import('firebase/firestore');
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, { role });
  }
};
