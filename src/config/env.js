require('dotenv').config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error('EMAIL_USER or EMAIL_PASS is not defined');
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

module.exports = {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  DATABASE_URL: process.env.DATABASE_URL,
}