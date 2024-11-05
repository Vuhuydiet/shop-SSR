const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  transactionOptions: {
    maxWait: 2000, // default: 2000
    timeout: 5000, // default: 5000
  },
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;
