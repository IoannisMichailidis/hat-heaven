import bcrypt from "bcryptjs"; // encrypt the password of the hardcoded users

const users = [
  {
    id: "683b717c6ddafbb339562cae",
    name: "Admin User",
    email: "admin@email.com",
    password: "123456",
    isAdmin: true,
  },
  {
    id: "683b717c6ddafbb339562cb0",
    name: "Giannis",
    email: "giannis@email.com",
    password: "123456",
    isAdmin: false,
  },
  {
    id: "683b717c6ddafbb339562caf",
    name: "Kostas",
    email: "kostas@email.com",
    password: "123456",
    isAdmin: false,
  },
];

export default users;
