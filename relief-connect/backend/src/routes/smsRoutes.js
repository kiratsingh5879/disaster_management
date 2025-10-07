import { Router } from 'express';
import { Report } from '../models/Report.js';

const router = Router();

// Example Twilio webhook: Body="#medical Injured near bridge @12.97,77.6"
router.post('/sms_inbound', async (req, res, next) => {
  try {
    const from = req.body.From || 'unknown';
    const body = (req.body.Body || '').trim();

    // Parse category (#word), description (free text), location after @lat,lon or @City
    const catMatch = body.match(/#(\w+)/);
    const category = catMatch ? catMatch[1].toLowerCase() : 'other';

    const atIndex = body.indexOf('@');
    const desc = atIndex >= 0 ? body.slice(0, atIndex).replace(/#\w+/, '').trim() : body.replace(/#\w+/, '').trim();
    let coordinates = null;
    if (atIndex >= 0) {
      const locPart = body.slice(atIndex + 1).trim();
      const latlon = locPart.split(',').map(s => s.trim());
      if (latlon.length === 2 && !isNaN(parseFloat(latlon[0])) && !isNaN(parseFloat(latlon[1]))) {
        const lat = parseFloat(latlon[0]);
        const lon = parseFloat(latlon[1]);
        // stored as [lon, lat]
        coordinates = [lon, lat];
      }
    }

    const report = await Report.create({
      reporterId: from,
      description: desc || 'SMS report',
      category: ['fire','medical','flood','blocked_road','other'].includes(category) ? category : 'other',
      location: { type: 'Point', coordinates: coordinates || [0,0] },
      source: 'sms'
    });

    req.io?.emit('report:new', { report });

    res.status(201).json({ data: { id: report._id }, meta: { timestamp: new Date().toISOString() } });
  } catch (err) { next(err); }
});

export default router;
