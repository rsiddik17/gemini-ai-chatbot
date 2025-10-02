import { Router } from 'express';
import { generateFromImage } from '../controllers/image.controller.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/image', upload.single('image'), generateFromImage);

export default router;
