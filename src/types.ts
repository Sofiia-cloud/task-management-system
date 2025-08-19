export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Board {
  id: string;
  title: string;
  ownerId: string;
  createdAt?: string;
  isTemp?: boolean;
}

export interface Column {
  id: string;
  title: string;
  boardId: string;
  order: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  boardId: string;
  createdAt: string;
  createdBy: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  labels?: Label[];
  order: number;
}

export interface Label {
  id: string;
  text: string;
  color: string;
  boardId: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface BoardsState {
  boards: Board[];
  currentBoardId: string | null;
  loading: boolean;
  error: string | null;
}

export interface TasksState {
  tasks: Task[];
  columns: Column[];
  loading: boolean;
  error: string | null;
}

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

export interface BoardFormValues {
  title: string;
}

export interface TaskFormValues {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  labels?: string[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface TaskFilters {
  search?: string;
  priority?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  labels?: string[];
}
