import { Volunteer } from '../models/Volunteer.js';

export async function upsertVolunteer(req, res, next) {
  try {
    const { skills = [], location, available = true } = req.body;
    const data = {
      userId: req.user.id,
      skills,
      available,
      lastSeen: new Date()
    };
    if (location?.coordinates?.length === 2) {
      data.location = { type: 'Point', coordinates: location.coordinates };
    }
    const v = await Volunteer.findOneAndUpdate({ userId: req.user.id }, data, { new: true, upsert: true, setDefaultsOnInsert: true });
    res.json({ data: v, meta: { timestamp: new Date().toISOString() } });
  } catch (err) { next(err); }
}

export async function nearbyVolunteers(req, res, next) {
  try {
    const { lon, lat, withinKm = 10 } = req.query;
    if (!lon || !lat) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Missing lon/lat' } });
    const volunteers = await Volunteer.find({
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [Number(lon), Number(lat)] },
          $maxDistance: Number(withinKm) * 1000
        }
      }
    }).limit(100);
    res.json({ data: volunteers, meta: { timestamp: new Date().toISOString() } });
  } catch (err) { next(err); }
}
