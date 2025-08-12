import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  return (
    <div
      style={{
        margin: '8px',
        padding: '16px',
        background: '#fff',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      }}
    >
      <h4>{task.title}</h4>
      {task.description && <p>{task.description}</p>}
    </div>
  );
};
