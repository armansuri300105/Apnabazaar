import express from 'express';
const router = express.Router();
import { chatBot } from '../controller/chatBotController.js';

router.post('/ai', chatBot);

export default router;
