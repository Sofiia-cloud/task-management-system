import { useDraggable } from '@dnd-kit/core';
import { Task } from '../../types';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  columnId: string;
}

export const TaskCard = ({ task, columnId }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { columnId },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : {};

  return (
    <div ref={setNodeRef} className={styles.card} style={style} {...listeners} {...attributes}>
      <h4 className={styles.title}>{task.title}</h4>
      {task.description && <p className={styles.description}>{task.description}</p>}
    </div>
  );
};
