import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { setCurrentBoard } from '../store/slices/boardsSlice';
import { Board } from '../components/boards/Board';
import { AppBar, Toolbar, Typography } from '@mui/material';
import styles from './BoardPage.module.css';

export const BoardPage = () => {
  const { boardId } = useParams();
  const dispatch = useAppDispatch();
  const board = useAppSelector((state) => state.boards.boards.find((b) => b.id === boardId));

  useEffect(() => {
    if (boardId) {
      dispatch(setCurrentBoard(boardId));
    }
  }, [boardId, dispatch]);

  if (!board) {
    return <div className={styles.notFound}>Board not found</div>;
  }

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
        <Board />
      </div>
    </div>
  );
};
