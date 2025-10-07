import { Router } from 'express';
import { body, param } from 'express-validator';
import { verifyReport } from '../controllers/moderationController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/:reportId/verify', requireAuth, requireRole('MODERATOR', 'ADMIN'), [
  param('reportId').isMongoId(),
  body('verified').isBoolean()
], validate, verifyReport);

export default router;
