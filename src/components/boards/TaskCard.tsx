import { useDraggable } from '@dnd-kit/core';
import { Task } from '../../types';
import styles from './TaskCard.module.css';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch } from '../../hooks/hooks';
import { deleteTask } from '../../store/slices/tasksSlice';

interface TaskCardProps {
  task: Task;
  columnId: string;
}

export const TaskCard = ({ task, columnId }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { columnId },
  });
  const dispatch = useAppDispatch();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(task.id)).unwrap();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : {};

  return (
    <div ref={setNodeRef} className={styles.card} style={style} {...attributes}>
      <div className={styles.cardContent}>
        <div {...listeners} className={styles.dragHandle}>
          {}
          <h4 className={styles.title}>{task.title}</h4>
          {task.description && <p className={styles.description}>{task.description}</p>}
        </div>
        <IconButton
          onClick={handleDelete}
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
