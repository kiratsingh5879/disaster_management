import { Report } from '../models/Report.js';

export async function createReport(req, res, next) {
  try {
    const { description, category, severity = 3, media = [], location } = req.body;
    if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid location coordinates' } });
    }
    const report = await Report.create({
      reporterId: req.user?.id || 'anonymous',
      description,
      category,
      severity,
      media,
      location,
      source: 'app'
    });
    req.io?.emit('report:new', { report });
    res.status(201).json({ data: report, meta: { timestamp: new Date().toISOString() } });
  } catch (err) { next(err); }
}

export async function listReports(req, res, next) {
  try {
    const { category, status, since, lon, lat, withinKm } = req.query;
    const q = {};
    if (category) q.category = category;
    if (status) q.status = status;
    if (since) q.createdAt = { $gte: new Date(since) };
    if (lon && lat && withinKm) {
      q.location = { $nearSphere: { $geometry: { type: 'Point', coordinates: [Number(lon), Number(lat)] }, $maxDistance: Number(withinKm) * 1000 } };
    }
    const reports = await Report.find(q).sort({ createdAt: -1 }).limit(500);
    res.json({ data: reports, meta: { timestamp: new Date().toISOString() } });
  } catch (err) { next(err); }
}

export async function getReport(req, res, next) {
  try {
    const r = await Report.findById(req.params.id);
    if (!r) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Report not found' } });
    res.json({ data: r, meta: { timestamp: new Date().toISOString() } });
  } catch (err) { next(err); }
}
