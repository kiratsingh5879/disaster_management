import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/reliefdb',
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  corsOrigins: (process.env.CORS_ORIGINS || '').split(',').filter(Boolean),
  s3: {
    bucket: process.env.S3_BUCKET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'ap-south-1'
  }
};
