import { User } from "../models";

const checkIfUserExists = async (email: string) => {
  return User.findOne({ email });
};

const createUser = async (user: any) => {
  const newUser = new User(user);
  return newUser.save();
};

export const userSeeder = async () => {
  try {
    const users = [
      {
        firstName: "MD Reyad",
        lastName: "Hossain",
        email: "dev.reyadhossain@gmail.com",
      },
      {
        firstName: "MD Mehrab",
        lastName: "Hossain",
        email: "dev.mehrabhossain@gmail.com",
      },
    ];

    // Filter out users that already exist
    await Promise.all(
      users.map(async (user) => {
        const existingUser = await checkIfUserExists(user.email);
        if (!existingUser) await createUser(user);
      })
    );

    console.info("Users seeding completed.");
  } catch (error) {
    console.error("Error seeding users", error);
  }
};