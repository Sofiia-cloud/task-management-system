import { auth, googleProvider } from './firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { AppDispatch } from '../store';
import { setUser, setError, setLoading, logout } from '../store/slices/authSlice';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

export const signInWithEmail =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const result = await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUser(result.user));
      return true;
    } catch (error) {
      dispatch(setError(getErrorMessage(error)));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const signInWithGoogle = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const result = await signInWithPopup(auth, googleProvider);
    dispatch(setUser(result.user));
    return true;
  } catch (error) {
    dispatch(setError(getErrorMessage(error)));
    return false;
  } finally {
    dispatch(setLoading(false));
  }
};

export const registerWithEmail =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const result = await createUserWithEmailAndPassword(auth, email, password);
      dispatch(setUser(result.user));
      return { success: true };
    } catch (error: any) {
      let errorMessage = 'Registration failed';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }

      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await signOut(auth);
    dispatch(logout());
  } catch (error) {
    dispatch(setError(getErrorMessage(error)));
  }
};
