import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { postSeeder } from "./post.seeder";
import { userSeeder } from "./user.seeder";
import { reactionSeeder } from "./reaction.seeder";



async function seed() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);

        // Seeders to run
        await userSeeder();
        await postSeeder()
        await reactionSeeder()

        console.info("Seeding completed");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

seed();