import { useState } from 'react';
import { useDroppable, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { CreateTaskForm } from './CreateTaskForm';
import { Button } from '@mui/material';
import { Task } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { createTask, moveTaskAsync, moveTaskLocally } from '../../store/slices/tasksSlice';
import styles from './Column.module.css';

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  boardId: string;
}

export const Column = ({ id, title, tasks, boardId }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'column',
      columnId: id,
    },
  });

  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleTaskCreate = async (title: string, description?: string) => {
    if (!user || !boardId) return;

    try {
      await dispatch(
        createTask({
          title,
          description,
          columnId: id,
          boardId,
          createdBy: user.uid,
          createdAt: new Date().toISOString(),
          order: tasks.length,
        }),
      ).unwrap();

      setIsCreateFormOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Проверяем, что перетаскивание завершено над другой колонкой
    if (active.id !== over.id && over.data.current?.type === 'column') {
      // Сначала локально обновляем состояние для мгновенного отклика
      dispatch(
        moveTaskLocally({
          taskId: active.id.toString(),
          newColumnId: over.id.toString(),
        }),
      );

      // Затем синхронизируем с сервером
      dispatch(
        moveTaskAsync({
          taskId: active.id.toString(),
          newColumnId: over.id.toString(),
        }),
      );
    }
  };

  return (
    <div ref={setNodeRef} className={`${styles.column} ${isOver ? styles.columnOver : ''}`}>
      <div className={styles.columnHeader}>
        <h3 className={styles.columnTitle}>{title}</h3>
        <Button
          size="small"
          variant="outlined"
          onClick={() => setIsCreateFormOpen(true)}
          className={styles.addButton}
        >
          Add Task
        </Button>
      </div>

      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className={styles.tasksContainer}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={id}
              transition={{
                duration: 150,
                easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
              }}
            />
          ))}
        </div>
      </SortableContext>

      <CreateTaskForm
        open={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onCreate={handleTaskCreate}
        boardId={boardId}
      />
    </div>
  );
};
