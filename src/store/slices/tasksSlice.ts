import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types';

interface TasksState {
  tasks: Task[];
  columns: {
    [key: string]: {
      id: string;
      title: string;
    };
  };
}

const initialState: TasksState = {
  tasks: [],
  columns: {
    todo: { id: 'todo', title: 'To Do' },
    inProgress: { id: 'inProgress', title: 'In Progress' },
    done: { id: 'done', title: 'Done' },
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id'>>) => {
      const newTask = {
        ...action.payload,
        id: `task-${Date.now()}`,
      };
      state.tasks.push(newTask);
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    moveTask: (state, action: PayloadAction<{ taskId: string; newColumnId: string }>) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.columnId = action.payload.newColumnId;
      }
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
  },
});

export const { addTask, removeTask, moveTask, setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
