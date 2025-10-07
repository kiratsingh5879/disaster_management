import AWS from 'aws-sdk'
import { env } from '../config/env.js'

let s3 = null
export function getS3() {
  if (!s3) {
    if (env.s3.accessKeyId && env.s3.secretAccessKey && env.s3.region) {
      AWS.config.update({
        accessKeyId: env.s3.accessKeyId,
        secretAccessKey: env.s3.secretAccessKey,
        region: env.s3.region,
      })
      s3 = new AWS.S3()
    }
  }
  return s3
}

export async function uploadBufferToS3({ buffer, key, contentType }) {
  const client = getS3()
  if (!client || !env.s3.bucket) {
    // Fallback for dev/test: return a fake URL
    return { url: `https://fake-s3.local/${encodeURIComponent(key)}` }
  }
  const params = {
    Bucket: env.s3.bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType || 'application/octet-stream',
    ACL: 'public-read',
  }
  const out = await client.upload(params).promise()
  return { url: out.Location }
}
