import { Router } from 'express';
import { body, param } from 'express-validator';
import { createTask, claimTask, completeTask } from '../controllers/taskController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, requireRole('ADMIN', 'MODERATOR'), [
  body('reportId').isMongoId(),
  body('volunteerId').isMongoId()
], validate, createTask);

router.post('/:id/claim', requireAuth, requireRole('VOLUNTEER'), [
  param('id').isMongoId()
], validate, claimTask);

router.put('/:id/complete', requireAuth, requireRole('VOLUNTEER'), [
  param('id').isMongoId()
], validate, completeTask);

export default router;
