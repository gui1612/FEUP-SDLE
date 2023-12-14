import 'dotenv/config';
import express from 'express';
import listRoutes from './routes/list'
import morgan from 'morgan';
import cors from 'cors';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: '*' }));

app.use('/list', listRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
  return res.status(200);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
