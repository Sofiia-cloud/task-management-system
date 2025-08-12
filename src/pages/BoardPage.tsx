import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { setCurrentBoard } from '../store/slices/boardsSlice';
import { Board } from '../components/boards/Board';
import { AppBar, Toolbar, Typography } from '@mui/material';

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
    return <div>Board not found</div>;
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">{board.title}</Typography>
        </Toolbar>
      </AppBar>
      <div style={{ padding: '20px' }}>
        <Board />
      </div>
    </div>
  );
};
