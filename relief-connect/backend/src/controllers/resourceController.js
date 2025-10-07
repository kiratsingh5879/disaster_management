import { Resource } from '../models/Resource.js';

export async function listResources(req, res, next) {
  try {
    const resources = await Resource.find({}).limit(500);
    res.json({ data: resources, meta: { timestamp: new Date().toISOString() } });
  } catch (err) { next(err); }
}

export async function upsertResource(req, res, next) {
  try {
    const body = req.body;
    let resource;
    if (body._id) {
      resource = await Resource.findByIdAndUpdate(body._id, body, { new: true });
    } else {
      resource = await Resource.create(body);
    }
    res.json({ data: resource, meta: { timestamp: new Date().toISOString() } });
  } catch (err) { next(err); }
}
