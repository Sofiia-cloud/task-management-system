import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import { Board } from '../../types';
import styles from './BoardCard.module.css';

interface BoardCardProps {
  board: Board;
  onDelete: (boardId: string) => Promise<void>; // Меняем на обязательный пропс
}

export const BoardCard = ({ board, onDelete }: BoardCardProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsDeleting(true);
    try {
      await onDelete(board.id);
    } catch (error) {
      console.error('Failed to delete board:', error);
      alert('Failed to delete board. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={styles.card} onClick={() => navigate(`/board/${board.id}`)}>
      <CardContent className={styles.content}>
        <Typography variant="h6" className={styles.title}>
          {board.title}
        </Typography>
        <Button
          size="small"
          className={styles.deleteButton}
          onClick={handleDelete}
          disabled={isDeleting}
          startIcon={isDeleting ? <CircularProgress size={16} /> : null}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </CardContent>
    </Card>
  );
};
