import mongoose from "mongoose";
import { Reaction, Post, User, REACTIONS, IReactionDoc } from "../models";

const selectRandomData = <T>(arr: T[]): T => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
};

async function transactReaction(reaction: IReactionDoc): Promise<string> {
    let transation = "processing"
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log("\nStarted a transaction session:")
    try {
        let exist = await Reaction.findOne({ postId: reaction.postId, userId: reaction.userId, reactionType: reaction.reactionType }).session(session);
        if (exist) throw new Error(`Reaction record already exists. Reaction ID: ${exist._id}`);
        let post = await Post.findOne({ _id: reaction.postId }).session(session)
        let user = await User.findOne({ _id: reaction.userId }).session(session)
        if (!post) throw new Error(`Post with ID ${reaction.postId} not found.`)
        if (!user) throw new Error(`User with ID ${reaction.userId} not found.`)
        post[reaction.reactionType] += 1;
        await post.save({ session });
        await reaction.save({ session });
        await session.commitTransaction();
        console.info("Transaction completed.")
        transation = "succeed."
    } catch (err) {
        await session.abortTransaction();
        console.error("Transaction aborted: ", err.message)
        transation = "failed."
        throw err
    } finally {
        console.info("Ending transaction session: ", session.id.id, "\n")
        session.endSession()
        return transation
    }
}
// Seeder for Reactions
export const reactionSeeder = async () => {
    try {
        // Fetch the first post and user (for demo purposes)
        const posts = await Post.find({});
        const users = await User.find({});

        if (!posts.length) {
            console.error("No post found to create reactions.");
            return;
        }

        // Define sample reactions
        const reactions = Array.from({ length: 50 }, (_, index) => ({
            postId: selectRandomData(posts)._id as string,
            userId: selectRandomData(users)._id as string,
            reactionType: selectRandomData(REACTIONS),
        }));
        // Check if reactions already exist, if not create them
        for (let reaction of reactions) {
            await transactReaction(new Reaction(reaction))
        }


        console.info("Reactions seeding completed.");
    } catch (error) {
        console.error("Error seeding reactions", error);
    }
};
