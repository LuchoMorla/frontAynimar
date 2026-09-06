import app from '../app';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const storage = getStorage(app);

export const uploadFile = async (folder, file) => {
  const storageRef = ref(storage, `images/${folder}/${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const deleteFile = async (url) => {
  if (!url || !url.includes('firebasestorage.googleapis.com')) return;
  const match = url.match(/\/o\/([^?]+)/);
  if (!match) return;
  const path = decodeURIComponent(match[1]);
  await deleteObject(ref(storage, path));
};
