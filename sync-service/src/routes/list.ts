import express from 'express';
import {
  getList,
  createList,
  deleteList,
  updateList,
  debug
} from  '../controllers/list';

const router = express.Router();

router.get('/debug', debug);
router.get('/:uuid', getList);
router.post('/', createList);
router.delete('/:uuid', deleteList);
router.put('/:uuid', updateList);

export default router;
