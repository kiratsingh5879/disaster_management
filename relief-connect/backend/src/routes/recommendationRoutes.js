import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { Volunteer } from '../models/Volunteer.js'
import { Report } from '../models/Report.js'
import { calculateMatch } from '../services/matchService.js'

const router = Router()

router.get('/volunteers', requireAuth, requireRole('ADMIN', 'MODERATOR'), async (req, res, next) => {
  try {
    const { reportId } = req.query
    const report = await Report.findById(reportId)
    if (!report) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Report not found' } })
    const candidates = await Volunteer.find({ verified: true, available: true }).limit(200)
    const scored = candidates.map(v => ({ v, score: calculateMatch(v, report) }))
      .sort((a,b)=>b.score - a.score)
      .slice(0, 5)
      .map(x => ({ volunteer: x.v, score: x.score }))
    res.json({ data: scored, meta: { timestamp: new Date().toISOString() } })
  } catch (err) { next(err) }
})

export default router
