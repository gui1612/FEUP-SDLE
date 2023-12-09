import 'dotenv/config';
import express from 'express';
import { AWSet } from '../lib/crdts/AWSet';

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
