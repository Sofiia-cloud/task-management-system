import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Board } from '../../types';

interface BoardCardProps {
  board: Board;
}

export const BoardCard = ({ board }: BoardCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{ minHeight: '120px', cursor: 'pointer' }}
      onClick={() => navigate(`/board/${board.id}`)}
    >
      <CardContent>
        <Typography variant="h6">{board.title}</Typography>
        <Button
          size="small"
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
