const prisma = require("../models");
const { getHashedPassword } = require("../components/accounts/password");

const username = "admin";
const password = "admin";

const registerUser = async () => {
  const hashedPassword = getHashedPassword(password);

  const user = await prisma.admin.create({
    data: {
      username,
      hashedPassword,
      fullname: "System admin",
      dob: new Date(),
      email: "test@example.com",
      gender: "male",
    },
  });
  return user;
};

registerUser()
  .then((user) => {
    console.log(user);
  })
  .catch((error) => {
    console.error(error);
  });
