import { Router } from 'express';
import { generateFromDocument } from '../controllers/document.controller.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// terima file pdf/txt/docx
router.post('/document', upload.single('document'), generateFromDocument);

export default router;