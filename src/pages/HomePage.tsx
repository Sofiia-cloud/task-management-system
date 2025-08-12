import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { BoardCard } from '../components/boards/BoardCard';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { createBoard, fetchBoards } from '../services/api';
import { setBoards } from '../store/slices/boardsSlice';

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { boards } = useAppSelector((state) => state.boards);

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const boardsData = await fetchBoards();
        dispatch(setBoards(boardsData));
      } catch (error) {
        console.error('Failed to load boards:', error);
      }
    };
    loadBoards();
  }, [dispatch]);

  const handleCreateBoard = async () => {
    if (!user) return;

    try {
      const newBoard = {
        title: 'New Board',
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      };
      const newBoardId = await createBoard(newBoard);
      navigate(`/board/${newBoardId}`);
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        My Boards
      </Typography>
      <Button variant="contained" onClick={handleCreateBoard} style={{ marginBottom: '20px' }}>
        Create New Board
      </Button>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {boards.map((board) => (
          <div key={board.id}>
            <BoardCard board={board} />
          </div>
        ))}
      </div>
    </div>
  );
};
