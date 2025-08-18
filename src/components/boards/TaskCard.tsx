import { useDraggable } from '@dnd-kit/core';
import { Task } from '../../types';
import styles from './TaskCard.module.css';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch } from '../../hooks/hooks';
import { deleteTask } from '../../store/slices/tasksSlice';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

interface TaskCardProps {
  task: Task;
  columnId: string;
  transition?: {
    duration: number;
    easing: string;
  };
}

export const TaskCard = ({ task, columnId, transition }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { columnId },
  });
  const dispatch = useAppDispatch();

  const handleDelete = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id));
    }
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
    // Важно для работы перетаскивания
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.card} {...attributes} {...listeners}>
      <div className={styles.cardContent}>
        <div className={styles.dragHandle}>
          <h4 className={styles.title}>{task.title}</h4>
          {task.description && <p className={styles.description}>{task.description}</p>}
        </div>
        <IconButton
          onClick={(e: React.MouseEvent) => handleDelete(e)}
          onTouchEnd={(e: React.TouchEvent) => handleDelete(e)}
          size="small"
          className={styles.deleteButton}
          aria-label="delete task"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
};
