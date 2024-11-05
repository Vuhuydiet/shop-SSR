const prisma = require('../../models');

const { getHashedPassword } = require('../../libraries/password');

module.exports = {
  registerUser: async (username, password) => {
    const hashedPassword = getHashedPassword(password);

    await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      }
    })
  },

  userExists: async (username) => {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      }
    });

    return user !== null;
  }
}