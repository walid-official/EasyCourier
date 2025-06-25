import express from 'express';
import { uploadImage } from '../controllers/upload.controller';
import { upload } from '../middlewares/multer';

const router = express.Router();

// Route: POST /api/upload
router.post('/', upload.single('image'), uploadImage);

export default router;