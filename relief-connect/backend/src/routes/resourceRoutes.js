import { Router } from 'express';
import { body } from 'express-validator';
import { listResources, upsertResource } from '../controllers/resourceController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, requireRole('ADMIN', 'MODERATOR'), listResources);

router.post('/', requireAuth, requireRole('ADMIN', 'MODERATOR'), [
  body('type').isString(),
  body('location').optional().isObject(),
  body('location.coordinates').optional().isArray({ min: 2, max: 2 })
], validate, upsertResource);

export default router;
