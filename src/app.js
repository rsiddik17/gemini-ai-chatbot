import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.routes.js';
import imageRoutes from './routes/image.routes.js';
import documentRoutes from './routes/document.routes.js';
import audioRoutes from './routes/audio.routes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.use('/api', chatRoutes);
app.use('/api', imageRoutes);
app.use('/api', documentRoutes);
app.use('/api', audioRoutes);

export default app;