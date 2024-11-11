import { Post } from "../models";
import { User } from "../models";

// Check if a post exists by content
const checkIfPostExists = async (content: string) => {
  return Post.findOne({ content });
};

// Create a new post
const createPost = async (post: any) => {
  const newPost = new Post(post);
  return newPost.save();
};

// Seeder for Posts
export const postSeeder = async () => {
  try {
    // Fetch a user to assign as the author (for demo purposes, we assume the first user)
    const author = await User.findOne({});
    if (!author) {
      console.error("No author found to create posts.");
      return;
    }

    // Define sample posts
    const posts = [
      {
        content: "This is the first post content.",
        author: author._id,
      },
      {
        content: "This is another post content.",
        author: author._id,
      },
    ];

    // Check if posts already exist, if not create them
    await Promise.all(
      posts.map(async (post) => {
        const existingPost = await checkIfPostExists(post.content);
        if (!existingPost) await createPost(post);
      })
    );

    console.info("Posts seeding completed.");
  } catch (error) {
    console.error("Error seeding posts", error);
  }
};
