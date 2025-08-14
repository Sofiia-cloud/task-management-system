import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { BoardCard } from '../components/boards/BoardCard';
import { CreateBoardDialog } from '../components/boards/CreateBoardDialog';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { createBoard, fetchBoards, deleteBoard } from '../services/api';
import { setBoards, addBoard, removeBoard } from '../store/slices/boardsSlice';
import styles from './HomePage.module.css';

export const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { boards } = useAppSelector((state) => state.boards);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleCreateClick = () => {
    setDialogOpen(true);
  };

  const handleCreateBoard = async (title: string) => {
    if (!user) return;

    setIsCreating(true);
    try {
      const newBoard = {
        title,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      };

      // 1. Сначала добавляем доску локально
      const tempId = `temp-${Date.now()}`;
      dispatch(
        addBoard({
          ...newBoard,
          id: tempId,
          isTemp: true,
        }),
      );

      // 2. Затем создаем на сервере
      const newBoardId = await createBoard(newBoard);

      // 3. Обновляем локальную версию с реальным ID
      dispatch(removeBoard(tempId));
      dispatch(
        addBoard({
          ...newBoard,
          id: newBoardId,
          isTemp: false,
        }),
      );

      // 4. Перенаправляем только после успешного создания
      navigate(`/board/${newBoardId}`);
    } catch (error) {
      console.error('Failed to create board:', error);
      // Удаляем временную доску в случае ошибки
      dispatch(removeBoard(`temp-${Date.now()}`));
      alert('Failed to create board. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      try {
        await deleteBoard(boardId);
        dispatch(removeBoard(boardId));
      } catch (error) {
        console.error('Failed to delete board:', error);
        alert('Failed to delete board. Please try again.');
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
      <Button
        variant="contained"
        onClick={handleCreateClick}
        className={styles.createButton}
        disabled={isCreating}
      >
        Create New Board
      </Button>

      <CreateBoardDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreateBoard}
      />

      <div className={styles.boardsGrid}>
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} onDelete={handleDeleteBoard} />
        ))}
      </div>
    </div>
  );
};
