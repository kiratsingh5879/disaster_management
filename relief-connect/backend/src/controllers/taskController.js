import { Task } from '../models/Task.js';

export async function createTask(req, res, next) {
  try {
    const { reportId, volunteerId } = req.body;
    const t = await Task.create({ reportId, volunteerId, status: 'pending' });
    req.io?.emit('task:update', { task: t });
    res.status(201).json({ data: t, meta: { timestamp: new Date().toISOString() } });
  } catch (err) { next(err); }
}

export async function listTasks(req, res, next) {
  try {
    const { status, volunteerId } = req.query
    const q = {}
    if (status) q.status = status
    if (volunteerId) q.volunteerId = volunteerId
    const tasks = await Task.find(q).sort({ createdAt: -1 }).limit(200)
    res.json({ data: tasks, meta: { timestamp: new Date().toISOString() } })
  } catch (err) { next(err) }
}

export async function claimTask(req, res, next) {
  try {
    const { id } = req.params;
    const t = await Task.findById(id);
    if (!t) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
    // In a full implementation, verify volunteer owns this task
    t.status = 'in_progress';
    await t.save();
    req.io?.emit('task:update', { task: t });
    res.json({ data: t, meta: { timestamp: new Date().toISOString() } });
  } catch (err) { next(err); }
}

export async function completeTask(req, res, next) {
  try {
    const { id } = req.params;
    const t = await Task.findById(id);
    if (!t) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found' } });
    t.status = 'completed';
    await t.save();
    req.io?.emit('task:update', { task: t });
    res.json({ data: t, meta: { timestamp: new Date().toISOString() } });
  } catch (err) { next(err); }
}
