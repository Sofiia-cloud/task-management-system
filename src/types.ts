// Тип для пользователя
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Тип для доски (Board)
export interface Board {
  id: string;
  title: string;
  ownerId: string;
  createdAt?: string;
  isTemp?: boolean;
}

// Тип для колонки (Column)
export interface Column {
  id: string;
  title: string;
  boardId: string;
  order: number;
}

// Тип для задачи (Task)
export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  boardId: string;
  createdAt: string;
  createdBy: string; // ID пользователя
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  labels?: Label[];
  order: number;
}

// Тип для метки (Label)
export interface Label {
  id: string;
  text: string;
  color: string;
  boardId: string;
}

// Тип для состояния аутентификации
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Тип для состояния досок
export interface BoardsState {
  boards: Board[];
  currentBoardId: string | null;
  loading: boolean;
  error: string | null;
}

// Тип для состояния задач
export interface TasksState {
  tasks: Task[];
  columns: Column[];
  loading: boolean;
  error: string | null;
}

// Тип для Drag & Drop результата
export interface DragResult {
  draggableId: string;
  type: string;
  source: {
    index: number;
    droppableId: string;
  };
  reason?: string;
  mode?: string;
  destination?: {
    droppableId: string;
    index: number;
  };
  combine?: {
    draggableId: string;
    droppableId: string;
  } | null;
}

// Тип для формы создания/редактирования доски
export interface BoardFormValues {
  title: string;
}

// Тип для формы создания/редактирования задачи
export interface TaskFormValues {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  labels?: string[];
}

// Тип для ответа API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Тип для пагинации
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

// Тип для фильтров задач
export interface TaskFilters {
  search?: string;
  priority?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  labels?: string[];
}
