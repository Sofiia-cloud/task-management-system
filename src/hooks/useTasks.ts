import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { fetchTasks } from '../services/api';
import { setTasks } from '../store/slices/tasksSlice';
import { RootState } from '../store';

export const useTasks = (boardId: string) => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state: RootState) =>
    state.tasks.tasks.filter((task) => task.boardId === boardId),
  );

  useEffect(() => {
    if (!boardId) return;

    const loadTasks = async () => {
      try {
        const tasks = await fetchTasks(boardId);
        dispatch(setTasks(tasks));
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };

    loadTasks();
  }, [boardId, dispatch]);

  return { tasks };
};
