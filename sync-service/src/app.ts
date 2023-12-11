import 'dotenv/config';
import express from 'express';
import listRoutes from './routes/list'
import morgan from 'morgan';

const app = express();
const port = process.env.PORT;

const router = express.Router();


router.use(morgan('dev'));

router.use(express.urlencoded({ extended: false }));

router.use(express.json());

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');

        return res.status(200).json({});
    }
})



app.use(express.json());

app.use('/list', listRoutes);

app.get('/', (req, res) => {

});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
