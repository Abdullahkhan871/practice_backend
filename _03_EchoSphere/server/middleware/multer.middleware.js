import multer from 'multer';
import path from 'path';
import DatauriParser from 'datauri/parser.js';

const storage = multer.memoryStorage();
export const multerUploads = multer({ storage }).single('image');

const parser = new DatauriParser();
export const dataUri = (file) =>
  parser.format(path.extname(file.originalname).toString(), file.buffer);
