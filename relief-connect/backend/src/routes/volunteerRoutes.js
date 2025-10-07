import { Router } from 'express';
import { body, query } from 'express-validator';
import { upsertVolunteer, nearbyVolunteers } from '../controllers/volunteerController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, requireRole('VOLUNTEER', 'ADMIN', 'MODERATOR'), [
  body('skills').optional().isArray(),
  body('location').optional().isObject(),
  body('location.coordinates').optional().isArray({ min: 2, max: 2 }),
  body('available').optional().isBoolean()
], validate, upsertVolunteer);

router.get('/nearby', requireAuth, requireRole('ADMIN', 'MODERATOR'), [
  query('lon').isFloat(),
  query('lat').isFloat(),
  query('withinKm').optional().isFloat()
], validate, nearbyVolunteers);

export default router;
