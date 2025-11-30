import dotenv from 'dotenv';

const env = process.env.NODE_ENV ?? 'development';
const isTest = env === 'test';

if (!isTest) {
  dotenv.config();
}

const config = {
  env,
  isDev: env === 'development',
  isProd: env === 'production',
  port: Number.parseInt(process.env.PORT ?? '4000', 10),
  logLevel: process.env.LOG_LEVEL ?? 'info'
} as const;

export type AppConfig = typeof config;

export default config;
