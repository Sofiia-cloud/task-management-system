import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBIYYLlDxvHpp0wnRetuKxX2tIz_nZjPTk',
  authDomain: 'task-management-system-435f7.firebaseapp.com',
  projectId: 'task-management-system-435f7',
  storageBucket: 'task-management-system-435f7.firebasestorage.app',
  messagingSenderId: '1070120137941',
  appId: '1:1070120137941:web:bc46fee2fdcc1542ed9e5c',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
