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

const initialState: BoardsState = {
  boards: [],
  currentBoardId: null,
};

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    addBoard: (state, action: PayloadAction<Board>) => {
      state.boards.push(action.payload);
    },
    removeBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter((board) => board.id !== action.payload);
    },
    setCurrentBoard: (state, action: PayloadAction<string>) => {
      state.currentBoardId = action.payload;
    },
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },
  },
});

export const { addBoard, removeBoard, setCurrentBoard, setBoards } = boardsSlice.actions;
export default boardsSlice.reducer;
