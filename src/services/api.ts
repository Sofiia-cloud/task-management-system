import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Board, Task } from '../types';

// Boards API
export const fetchBoards = async (): Promise<Board[]> => {
  const querySnapshot = await getDocs(collection(db, 'boards'));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Board);
};

export const createBoard = async (boardData: Omit<Board, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'boards'), {
    ...boardData,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const deleteBoard = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'boards', id));
};

// Tasks API
export const fetchTasks = async (boardId: string): Promise<Task[]> => {
  const querySnapshot = await getDocs(collection(db, 'tasks'));
  return querySnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Task)
    .filter((task) => task.boardId === boardId);
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'tasks'), {
    ...task,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<void> => {
  await updateDoc(doc(db, 'tasks', taskId), updates);
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await deleteDoc(doc(db, 'tasks', taskId));
};
