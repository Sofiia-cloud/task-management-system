import { db } from './firebase';
import { collection, addDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { AppDispatch } from '../store';
import { addBoard, removeBoard, setBoards } from '../store/slices/boardsSlice';

// Тип для Board из Firestore
interface FirestoreBoard {
  id: string;
  title: string;
  createdAt?: string;
}

export const createBoard = (title: string) => async (dispatch: AppDispatch) => {
  try {
    const docRef = await addDoc(collection(db, 'boards'), {
      title,
      createdAt: new Date().toISOString(),
    });
    dispatch(addBoard({ id: docRef.id, title }));
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

export const subscribeToBoards = () => (dispatch: AppDispatch) => {
  return onSnapshot(collection(db, 'boards'), (snapshot) => {
    const boards = snapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
      createdAt: doc.data().createdAt,
    })) as FirestoreBoard[];
    dispatch(setBoards(boards));
  });
};
