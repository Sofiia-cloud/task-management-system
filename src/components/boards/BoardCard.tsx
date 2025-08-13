import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Board } from '../../types';
import styles from './BoardCard.module.css';

interface BoardCardProps {
  board: Board;
}

export const BoardCard = ({ board }: BoardCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className={styles.card} onClick={() => navigate(`/board/${board.id}`)}>
      <CardContent className={styles.content}>
        <Typography variant="h6" className={styles.title}>
          {board.title}
        </Typography>
        <Button
          size="small"
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation();
            // Здесь можно добавить обработчик удаления
          }}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};
