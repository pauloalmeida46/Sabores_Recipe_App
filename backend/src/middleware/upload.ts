import multer from 'multer';
import { AppError } from '../utils/AppError';

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(AppError.badRequest(`Tipo de arquivo não suportado: "${file.mimetype}". Envie uma imagem.`));
      return;
    }
    cb(null, true);
  },
});
