import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Rota de saúde (ping)
app.get('/ping', (req, res) => {
  res.json({ message: 'pong', status: 'OK' });
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
