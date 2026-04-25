const mongoose = require("mongoose");
const Post = require("./models/Post");

const MONGODB_URI =
  "mongodb+srv://AMOL:amolSIH@cluster0.3eye1sz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Local image paths - these will be served by the backend
const localImages = {
  "tree-planting": "/images/1.webp",
  recycling: "/images/2.jpg",
  "energy-saving": "/images/3.webp",
  "water-conservation": "/images/4.webp",
  other: "/images/5.jpg",
};

async function updateWithLocalImages() {
  try {
    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas successfully!");

    // Get all posts
    const posts = await Post.find({});
    console.log(`📝 Found ${posts.length} posts to update`);

    // Update each post with local image path
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const imagePath = localImages[post.category] || localImages["other"];

      // Update the image field with local path
      post.image = {
        filename: `${post.category}-${i + 1}.jpg`,
        path: imagePath,
        mimetype: "image/jpeg",
        size: 500000 + i * 100000, // Varying sizes
      };

      await post.save();
      console.log(`✅ Updated post: ${post.title}`);
      console.log(`   Image path: ${imagePath}`);
    }

    console.log("\n🎉 All posts updated with local images!");

    // Display updated posts
    const updatedPosts = await Post.find({});
    console.log("\n📸 Posts with Local Images:");
    updatedPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   Category: ${post.category} (${post.ecoPoints} points)`);
      console.log(`   Local Image: ${post.image.path}`);
      console.log("");
    });

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error updating images:", error);
    process.exit(1);
  }
}

updateWithLocalImages();
