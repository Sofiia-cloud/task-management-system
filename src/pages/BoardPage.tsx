import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { setCurrentBoard } from '../store/slices/boardsSlice';
import { useTasks } from '../hooks/useTasks';
import { fetchTasks } from '../store/slices/tasksSlice';
import { Board } from '../components/boards/Board';
import { AppBar, Toolbar, Typography } from '@mui/material';
import styles from './BoardPage.module.css';

export const BoardPage = () => {
  const { boardId } = useParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const board = useAppSelector((state) =>
    state.boards.boards.find((b) => b.id === boardId && b.ownerId === user?.uid),
  );

  useEffect(() => {
    if (boardId && user?.uid) {
      dispatch(setCurrentBoard(boardId));
      dispatch(fetchTasks(boardId));
    }
  }, [boardId, user, dispatch]);

  if (!board) {
    return <div className={styles.notFound}>Board not found</div>;
  }
  const { tasks } = useTasks(boardId || '');
  return (
    <div className={styles.container}>
      <AppBar position="static" className={styles.appBar}>
        <Toolbar>
          <Typography variant="h6" className={styles.title}>
            {board.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={styles.boardContainer}>
        <Board tasks={tasks} />
      </div>
    </div>
  );
};
