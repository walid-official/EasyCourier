import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import fs from 'fs';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'easy-courier',
    });

    // Remove temp file after upload
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ success: false, message: 'Upload failed', error });
  }
};
