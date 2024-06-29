import express from 'express';
import dotenv from 'dotenv';
import router from './src/routes/index.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const allowedOrigins = ['http://localhost:5173', 'https://proyect-books.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Si necesitas enviar cookies o credenciales
}));
app.use(express.json());
app.use('/', router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
