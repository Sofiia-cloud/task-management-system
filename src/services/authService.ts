import { auth, googleProvider } from './firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { AppDispatch } from '../store';
import { setUser, setError, setLoading, logout } from '../store/slices/authSlice';

// Вспомогательная функция для обработки ошибок
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
      return true; // Успешный вход
    } catch (error) {
      dispatch(setError(getErrorMessage(error)));
      return false; // Ошибка входа
    } finally {
      dispatch(setLoading(false));
    }
  };

export const signInWithGoogle = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const result = await signInWithPopup(auth, googleProvider);
    dispatch(setUser(result.user));
    return true; // Успешный вход
  } catch (error) {
    dispatch(setError(getErrorMessage(error)));
    return false; // Ошибка входа
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
      return true; // Успешная регистрация
    } catch (error) {
      dispatch(setError(getErrorMessage(error)));
      return false; // Ошибка регистрации
    } finally {
      dispatch(setLoading(false));
    }
  };

export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await signOut(auth);
    dispatch(logout()); // Теперь logout доступен
  } catch (error) {
    dispatch(setError(getErrorMessage(error)));
  }
};
