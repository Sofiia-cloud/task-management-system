import { useDraggable } from '@dnd-kit/core';
import { Task } from '../../types';
import styles from './TaskCard.module.css';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch } from '../../hooks/hooks';
import { deleteTask } from '../../store/slices/tasksSlice';
import { CSS } from '@dnd-kit/utilities';
import React, { useCallback } from 'react';

interface TaskCardProps {
  task: Task;
  columnId: string;
  transition?: {
    duration: number;
    easing: string;
  };
}

export const TaskCard = ({ task, columnId }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { columnId },
  });
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (window.confirm('Are you sure you want to delete this task?')) {
        dispatch(deleteTask(task.id));
      }
    },
    [dispatch, task.id],
  );

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.card} {...attributes}>
      <div className={styles.cardContent}>
        <div className={styles.dragHandle} {...listeners}>
          <h4 className={styles.title}>{task.title}</h4>
          {task.description && <p className={styles.description}>{task.description}</p>}
        </div>
        <IconButton
          onClick={handleDelete}
          onTouchEnd={handleDelete}
          size="small"
          className={styles.deleteButton}
          aria-label="delete task"
          onMouseDown={(e) => e.stopPropagation()} // Важно для предотвращения конфликтов
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
};
