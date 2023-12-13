import express from 'express';
import {
  getList,
  putList,
} from  '../controllers/list';

const router = express.Router();

router.get('/:uuid', getList);
router.put('/:uuid', putList);

export default router;
