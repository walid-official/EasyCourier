import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'tmp/', 
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) return cb(null, true);
  cb(new Error('Only images are allowed'));
};

export const upload = multer({ storage, fileFilter });
