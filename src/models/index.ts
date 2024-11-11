import { Schema, model, Document, Model, Types } from "mongoose";

// Define an interface for User input
export interface UserInput {
    firstName: string;
    lastName: string;
    email: string;
}

// Define an interface for User document
export interface IUserDoc extends UserInput, Document {
    fullName: string;
}

// Define an interface for User model with static methods
export interface IUserModel extends Model<IUserDoc> { }

// Define the schema for User
export const userSchema = new Schema<IUserDoc>(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },

    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", function (next) {
    this.fullName = this.firstName + " " + this.lastName
    console.log(this.fullName)
    next()
})
// Define the User model
export const User = model<IUserDoc, IUserModel>("User", userSchema);


// Define an interface for Post input
export interface PostInput {
    content: string;
    author: Types.ObjectId;
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
}

// Define an interface for Post document
export interface IPostDoc extends PostInput, Document { }

// Define an interface for Post model with static methods
export interface IPostModel extends Model<IPostDoc> { }

// Define the schema for Post
export const postSchema = new Schema<IPostDoc>(
    {
        content: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        like: { type: Number, default: 0 },
        love: { type: Number, default: 0 },
        haha: { type: Number, default: 0 },
        wow: { type: Number, default: 0 },
        sad: { type: Number, default: 0 },
        angry: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

// Define the Post model
export const Post = model<IPostDoc, IPostModel>("Post", postSchema);

// Define an interface for Reaction input
export interface ReactionInput {
    postId: Types.ObjectId;
    userId: Types.ObjectId;
    reactionType: string;  // "like", "love", "haha", etc.
}

// Define an interface for Reaction document
export interface IReactionDoc extends ReactionInput, Document { }

// Define an interface for Reaction model with static methods
export interface IReactionModel extends Model<IReactionDoc> { }


export const REACTIONS = ["like", "love", "haha", "wow", "sad", "angry"]
// Define the schema for Reaction
export const reactionSchema = new Schema<IReactionDoc>(
    {
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reactionType: {
            type: String,
            enum: REACTIONS,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Define the Reaction model
export const Reaction = model<IReactionDoc, IReactionModel>("Reaction", reactionSchema);
