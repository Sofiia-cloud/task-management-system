import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { BoardCard } from '../components/boards/BoardCard';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { createBoard, fetchBoards, deleteBoard } from '../services/api';
import { setBoards, removeBoard } from '../store/slices/boardsSlice';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { boards } = useAppSelector((state) => state.boards);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const boardsData = await fetchBoards();
        dispatch(setBoards(boardsData));
      } catch (error) {
        console.error('Failed to load boards:', error);
      } finally {
        setIsLoading(false);
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

  const handleDeleteBoard = async (boardId: string) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      try {
        await deleteBoard(boardId);
        dispatch(removeBoard(boardId));
      } catch (error) {
        console.error('Failed to delete board:', error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading boards...</div>;
  }

  return (
    <div className={styles.container}>
      <Typography variant="h4" gutterBottom className={styles.header}>
        My Boards
      </Typography>
      <Button variant="contained" onClick={handleCreateBoard} className={styles.createButton}>
        Create New Board
      </Button>
      <div className={styles.boardsGrid}>
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} onDelete={handleDeleteBoard} />
        ))}
      </div>
    </div>
  );
};
