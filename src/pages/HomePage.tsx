import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { BoardCard } from '../components/boards/BoardCard';
import { CreateBoardDialog } from '../components/boards/CreateBoardDialog';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { createBoard, fetchBoards, deleteBoard } from '../services/api';
import { setBoards, addBoard, removeBoard } from '../store/slices/boardsSlice';
import { logoutUser } from '../services/authService';
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
      if (!user?.uid) return;

      try {
        const boardsData = await fetchBoards(user.uid); // Передаем user.uid
        dispatch(setBoards(boardsData));
      } catch (error) {
        console.error('Failed to load boards:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBoards();
  }, [dispatch, user]); // Добавляем user в зависимости

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
        ownerId: user.uid, // Добавляем ownerId
        createdAt: new Date().toISOString(),
      };

      const tempId = `temp-${Date.now()}`;
      dispatch(
        addBoard({
          ...newBoard,
          id: tempId,
          isTemp: true,
        }),
      );

      const newBoardId = await createBoard(newBoard, user.uid); // Передаем user.uid

      dispatch(removeBoard(tempId));
      dispatch(
        addBoard({
          ...newBoard,
          id: newBoardId,
          isTemp: false,
        }),
      );

      navigate(`/board/${newBoardId}`);
    } catch (error) {
      console.error('Failed to create board:', error);
      dispatch(removeBoard(`temp-${Date.now()}`));
      alert('Failed to create board. Please try again.');
    } finally {
      setIsCreating(false);
      setDialogOpen(false);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (!user) return;

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

  const handleLogout = async () => {
    try {
      await logoutUser()(dispatch);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return <div>Loading boards...</div>;
  }

  // Фильтруем доски по владельцу (на случай, если в хранилище есть чужие доски)
  const userBoards = boards.filter((board) => board.ownerId === user?.uid);

  return (
    <div className={styles.container}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom className={styles.header}>
          My Boards
        </Typography>
        <IconButton onClick={handleLogout} className={styles.logoutButton} title="Logout">
          <LogoutIcon />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        onClick={handleCreateClick}
        className={styles.createButton}
        disabled={isCreating}
      >
        {isCreating ? 'Creating...' : 'Create New Board'}
      </Button>

      <CreateBoardDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreateBoard}
      />

      <div className={styles.boardsGrid}>
        {userBoards.length > 0 ? (
          userBoards.map((board) => (
            <BoardCard key={board.id} board={board} onDelete={handleDeleteBoard} />
          ))
        ) : (
          <Typography variant="body1" className={styles.emptyMessage}>
            You do not have any boards yet. Create your first board!
          </Typography>
        )}
      </div>
    </div>
  );
};
