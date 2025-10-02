import { Router } from 'express';
import { generateFromChat } from '../controllers/chat.controller.js';

const router = Router();

router.post('/chat', generateFromChat);

export default router;