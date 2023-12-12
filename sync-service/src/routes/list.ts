import express from 'express';
import {
  getList,
  createList,
  deleteList,
  updateList,
  debug,
  testFlow
} from  '../controllers/list';

const router = express.Router();

router.get('/debug', debug);
router.get('/test-flow', testFlow);
router.get('/:uuid', getList);
router.post('/', createList);
router.delete('/:uuid', deleteList);
router.put('/:uuid', updateList);

export default router;
