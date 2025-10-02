import { Router } from 'express';
import { generateFromAudio } from '../controllers/audio.controller.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/audio', upload.single('audio'), generateFromAudio);

export default router;