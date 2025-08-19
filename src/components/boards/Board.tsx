import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { moveTaskAsync } from '../../store/slices/tasksSlice';
import { Column } from './Column';
import { Task } from '../../types';
import styles from './Board.module.css';

interface BoardProps {
  tasks: Task[];
}

export const Board = ({ tasks }: BoardProps) => {
  const dispatch = useAppDispatch();
  const { columns } = useAppSelector((state) => state.tasks);
  const currentBoardId = useAppSelector((state) => state.boards.currentBoardId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event) => {
        if (event.key === 'ArrowLeft') return { x: -1, y: 0 };
        if (event.key === 'ArrowRight') return { x: 1, y: 0 };
        return { x: 0, y: 0 };
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    dispatch(
      moveTaskAsync({
        taskId: active.id.toString(),
        newColumnId: over.data.current?.columnId || over.id.toString(),
      }),
    );
  };

  if (!currentBoardId) {
    return <div>Please select a board first</div>;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className={styles.boardContainer}>
        <SortableContext
          items={Object.values(columns).map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          {Object.values(columns).map((column) => (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter((task) => task.columnId === column.id)}
              boardId={currentBoardId}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};
