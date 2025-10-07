import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

export async function register(req, res, next) {
  try {
    const { name, email, phone, password, role } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, passwordHash, role: role || 'CITIZEN' });
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, env.jwtSecret, { expiresIn: '7d' });
    res.json({ data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, meta: { timestamp: new Date().toISOString() } });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, env.jwtSecret, { expiresIn: '7d' });
    res.json({ data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }, meta: { timestamp: new Date().toISOString() } });
  } catch (err) { next(err); }
}
