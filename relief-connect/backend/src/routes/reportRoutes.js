import { Router } from 'express';
import { body, query } from 'express-validator';
import { createReport, listReports, getReport } from '../controllers/reportController.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, [
  body('description').isString().isLength({ min: 5 }),
  body('category').isIn(['fire', 'medical', 'flood', 'blocked_road', 'other']),
  body('location').isObject(),
  body('location.coordinates').isArray({ min: 2, max: 2 })
], validate, createReport);

router.get('/', [
  query('category').optional().isString(),
  query('status').optional().isString(),
  query('since').optional().isISO8601(),
  query('lon').optional().isFloat(),
  query('lat').optional().isFloat(),
  query('withinKm').optional().isFloat()
], validate, listReports);

router.get('/:id', getReport);

export default router;
