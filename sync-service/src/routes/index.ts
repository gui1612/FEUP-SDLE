import express from 'express';
import listRoutes from './list';

const router = express.Router();

router.use('/list', listRoutes);

export default router;
