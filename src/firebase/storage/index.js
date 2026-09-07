import app from '../app';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const storage = getStorage(app);

// MIME → extensión canónica. El backend (assertTrustedProofUrl) exige que la
// URL termine en una extensión de imagen permitida, así que el nombre generado
// SIEMPRE debe llevar una.
const EXT_BY_MIME = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

const extFor = (file) => {
  if (EXT_BY_MIME[file.type]) return EXT_BY_MIME[file.type];
  const m = (file.name || '').match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : 'jpg';
};

// Nombre único e imposible de adivinar. Elimina las colisiones/sobrescrituras
// accidentales (dos archivos con el mismo file.name en la misma carpeta) y el
// bug de `undefined` (Blob de cámara sin .name).
const uniqueName = (file) => {
  const uuid =
    (typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID()) ||
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${uuid}.${extFor(file)}`;
};

/**
 * Sube un archivo a `images/<folder>/<uuid>.<ext>` y devuelve la download URL
 * tokenizada. Firma sin cambios: los call-sites siguen pasando (folder, file).
 */
export const uploadFile = async (folder, file) => {
  const storageRef = ref(storage, `images/${folder}/${uniqueName(file)}`);
  await uploadBytes(storageRef, file, {
    contentType: file.type || 'application/octet-stream',
    // Los nombres UUID son inmutables → cache agresivo, menos transferencia.
    cacheControl: 'public,max-age=31536000,immutable',
  });
  return getDownloadURL(storageRef);
};

export const deleteFile = async (url) => {
  if (!url || !url.includes('firebasestorage.googleapis.com')) return;
  const match = url.match(/\/o\/([^?]+)/);
  if (!match) return;
  const path = decodeURIComponent(match[1]);
  await deleteObject(ref(storage, path));
};
