import { Router } from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/register', [
  body('name').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], validate, register);

router.post('/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], validate, login);

export default router;
