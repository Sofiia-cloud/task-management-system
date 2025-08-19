import { db } from './firebase';
import { collection, addDoc, doc, deleteDoc, onSnapshot, where, query } from 'firebase/firestore';
import { AppDispatch } from '../store';
import { addBoard, removeBoard, setBoards } from '../store/slices/boardsSlice';
import { Board } from '../types';

export const createBoard = (title: string, userId: string) => async (dispatch: AppDispatch) => {
  try {
    const docRef = await addDoc(collection(db, 'boards'), {
      title,
      ownerId: userId,
      createdAt: new Date().toISOString(),
    });
    dispatch(
      addBoard({
        id: docRef.id,
        title,
        ownerId: userId,
      }),
    );
  } catch (error) {
    console.error('Error adding board: ', error);
  }
};

export const deleteBoard = (boardId: string) => async (dispatch: AppDispatch) => {
  try {
    await deleteDoc(doc(db, 'boards', boardId));
    dispatch(removeBoard(boardId));
  } catch (error) {
    console.error('Error removing board: ', error);
  }
};

export const subscribeToBoards = (userId: string) => (dispatch: AppDispatch) => {
  const q = query(collection(db, 'boards'), where('ownerId', '==', userId));

  return onSnapshot(q, (snapshot) => {
    const boards = snapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      ownerId: doc.data().ownerId,
      createdAt: doc.data().createdAt,
    })) as Board[];
    dispatch(setBoards(boards));
  });
};
