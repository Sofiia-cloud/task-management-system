import { useEffect } from 'react';
import { useAppDispatch } from './hooks';
import { auth } from '../services/firebase';
import { setUser } from '../store/slices/authSlice';
import { onAuthStateChanged } from 'firebase/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setUser(user));
    });
    return () => unsubscribe();
  }, [dispatch]);
};
