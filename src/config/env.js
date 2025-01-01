require('dotenv').config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('EMAIL_USER or EMAIL_PASS is not defined');
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

if (!process.env.JWT_PRIVATE_KEY || !process.env.JWT_PUBLIC_KEY) {
  throw new Error('JWT_PRIVATE_KEY or JWT_PUBLIC_KEY is not defined');
}

module.exports = {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  DATABASE_URL: process.env.DATABASE_URL,

  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,

  JWT_EXPIRATION_DAYS: process.env.JWT_EXPIRATION_DAYS || 1,
}