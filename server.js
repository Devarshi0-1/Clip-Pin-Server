import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import { connectDB } from './database/mongo.js';
import AuthRouter from './routes/auth.routes.js';
import NoteRouter from './routes/note.routes.js';
import TagRouter from './routes/tag.routes.js';

const PORT = process.env.PORT || 3000;
const app = express();
connectDB();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/notes', NoteRouter);
app.use('/api/v1/tags', TagRouter);

app.get('/test', (req, res) => {
	res.status(200).json({
		message: 'Working Well',
	});
});

app.listen(PORT, () => {
	console.log(`Listening on PORT: http://localhost:${PORT}`);
});
