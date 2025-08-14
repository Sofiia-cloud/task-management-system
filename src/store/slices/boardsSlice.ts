import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Board {
  id: string;
  title: string;
  createdAt?: string;
  isTemp?: boolean;
}

interface BoardsState {
  boards: Board[];
  currentBoardId: string | null;
}

const loadBoardsFromLocalStorage = (): Board[] => {
  try {
    const saved = localStorage.getItem('boards');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load boards from localStorage', error);
    return [];
  }
};

const initialState: BoardsState = {
  boards: loadBoardsFromLocalStorage(),
  currentBoardId: null,
};

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    addBoard: (state, action: PayloadAction<Board>) => {
      state.boards.push(action.payload);
      localStorage.setItem('boards', JSON.stringify(state.boards));
    },
    removeBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter((board) => board.id !== action.payload);
      localStorage.setItem('boards', JSON.stringify(state.boards));
    },
    setCurrentBoard: (state, action: PayloadAction<string>) => {
      state.currentBoardId = action.payload;
    },
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
      localStorage.setItem('boards', JSON.stringify(state.boards));
    },
  },
});

export const { addBoard, removeBoard, setCurrentBoard, setBoards } = boardsSlice.actions;
export default boardsSlice.reducer;
