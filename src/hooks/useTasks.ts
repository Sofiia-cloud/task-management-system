import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { fetchTasks } from '../store/slices/tasksSlice';
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
        await dispatch(fetchTasks(boardId)).unwrap();
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };

    loadTasks();
  }, [boardId, dispatch]);

  return { tasks };
};
