import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Task } from '../../types';
import { createTask as createTaskApi, deleteTask as deleteTaskApi } from '../../services/api';

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
    moveTask: (state, action) => {
      const { taskId, newColumnId } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        task.columnId = newColumnId;
      }
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    },
    addTaskLocally: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      });
  },
});

export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData: Omit<Task, 'id'>, { rejectWithValue }) => {
    try {
      const taskId = await createTaskApi(taskData);
      return { ...taskData, id: taskId };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (taskId: string, { rejectWithValue }) => {
    try {
      await deleteTaskApi(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const { addTask, removeTask, moveTask, setTasks, addTaskLocally } = tasksSlice.actions;
export default tasksSlice.reducer;
