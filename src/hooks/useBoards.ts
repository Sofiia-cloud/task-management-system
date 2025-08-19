import { useEffect } from 'react';
import { useAppDispatch } from './hooks';
import { fetchBoards } from '../services/api';
import { setBoards } from '../store/slices/boardsSlice';

export const useBoards = (userId: string) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadBoards = async () => {
      const boards = await fetchBoards(userId);
      dispatch(setBoards(boards));
    };
    loadBoards();
  }, [dispatch, userId]);
};
