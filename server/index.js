import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';
import reportRoutes from './routes/report.js';
import uploadRoutes from './routes/upload.js';


const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Allow all origins for dev mobility
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/upload', uploadRoutes);


app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
