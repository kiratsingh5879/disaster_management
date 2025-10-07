import { Report } from '../models/Report.js';

export async function verifyReport(req, res, next) {
  try {
    const { reportId } = req.params;
    const { verified } = req.body;
    const status = verified ? 'verified' : 'unverified';
    const r = await Report.findByIdAndUpdate(reportId, { status }, { new: true });
    if (!r) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Report not found' } });
    req.io?.emit('report:verify', { reportId: r._id.toString(), verified });
    res.json({ data: r, meta: { timestamp: new Date().toISOString() } });
  } catch (err) { next(err); }
}
