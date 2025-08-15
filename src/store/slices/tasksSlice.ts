import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Task } from '../../types';
import {
  createTask as createTaskApi,
  deleteTask as deleteTaskApi,
  fetchTasks as fetchTasksApi,
  updateTask as updateTaskApi,
} from '../../services/api';
import type { RootState } from '..';

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
    moveTaskLocally: (state, action: PayloadAction<{ taskId: string; newColumnId: string }>) => {
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
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = [
          ...state.tasks.filter((task) => task.boardId !== action.meta.arg),
          ...action.payload,
        ];
      })
      .addCase(moveTaskAsync.fulfilled, (state, action) => {
        const { taskId, newColumnId } = action.payload;
        const task = state.tasks.find((t) => t.id === taskId);
        if (task) {
          task.columnId = newColumnId;
        }
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

export const fetchTasks = createAsyncThunk(
  'tasks/fetch',
  async (boardId: string, { rejectWithValue }) => {
    try {
      return await fetchTasksApi(boardId);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const moveTaskAsync = createAsyncThunk(
  'tasks/move',
  async (
    { taskId, newColumnId }: { taskId: string; newColumnId: string },
    { getState, dispatch },
  ) => {
    const state = getState() as RootState;
    const task = state.tasks.tasks.find((t: Task) => t.id === taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    // Сохраняем предыдущую колонку для отката в случае ошибки
    const previousColumnId = task.columnId;

    try {
      // Сначала локально обновляем состояние для мгновенного отклика
      dispatch(moveTaskLocally({ taskId, newColumnId }));

      // Затем синхронизируем с сервером
      await updateTaskApi(taskId, { columnId: newColumnId });

      return { taskId, newColumnId };
    } catch (error) {
      // В случае ошибки откатываем изменения
      dispatch(moveTaskLocally({ taskId, newColumnId: previousColumnId }));
      throw error;
    }
  },
);

export const { addTask, removeTask, moveTaskLocally, setTasks, addTaskLocally } =
  tasksSlice.actions;
export default tasksSlice.reducer;
