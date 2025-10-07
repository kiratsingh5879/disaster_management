import multer from 'multer'
import { uploadBufferToS3 } from '../services/s3Service.js'
import { v4 as uuidv4 } from 'uuid'

const storage = multer.memoryStorage()
export const upload = multer({ storage })

export async function uploadFile(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: { code: 'NO_FILE', message: 'No file uploaded' } })
    const key = `uploads/${uuidv4()}-${req.file.originalname}`
    const out = await uploadBufferToS3({ buffer: req.file.buffer, key, contentType: req.file.mimetype })
    res.status(201).json({ data: { url: out.url }, meta: { timestamp: new Date().toISOString() } })
  } catch (err) { next(err) }
}
