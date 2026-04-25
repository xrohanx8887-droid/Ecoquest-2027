const mongoose = require("mongoose");
const Post = require("./models/Post");
require("dotenv").config();

// Sample eco-action posts data
const samplePosts = [
  {
    title: "Tree Planting Drive at Central Park",
    description:
      "Organized a community tree planting event where we planted 25 native saplings including neem, mango, and gulmohar trees. Over 50 students participated and we're planning to make this a monthly event. The trees will help reduce air pollution and provide shade for future generations.",
    category: "tree-planting",
    author: "EcoWarrior Rahul",
    image: {
      filename: "tree-planting-1.jpg",
      path: "./uploads/tree-planting-1.jpg",
      mimetype: "image/jpeg",
      size: 1024000,
    },
    likes: 45,
    comments: [
      {
        author: "GreenThumb Priya",
        text: "Amazing initiative! I'll join next month's drive.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        author: "NatureLover Amit",
        text: "Great work! Trees are our best friends.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ],
    ecoPoints: 50,
    status: "approved",
  },
  {
    title: "Plastic Waste Collection Challenge",
    description:
      "Completed a week-long plastic waste collection challenge in my neighborhood. Collected 8kg of plastic bottles, bags, and packaging materials. Took everything to the local recycling center and documented the entire process. This helped clean up our area and raised awareness about plastic pollution.",
    category: "recycling",
    author: "RecycleHero Ananya",
    image: {
      filename: "recycling-1.jpg",
      path: "./uploads/recycling-1.jpg",
      mimetype: "image/jpeg",
      size: 980000,
    },
    likes: 32,
    comments: [
      {
        author: "CleanEarth Kiran",
        text: "Inspiring! I'm starting my own collection drive.",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    ],
    ecoPoints: 30,
    status: "approved",
  },
  {
    title: "LED Bulb Replacement Project",
    description:
      "Convinced my family to replace all 12 old incandescent bulbs with energy-efficient LED bulbs. This will save approximately 60% on our electricity bill and reduce our carbon footprint. Calculated that we'll save 240 kWh per year, equivalent to planting 2 trees!",
    category: "energy-saving",
    author: "EnergySaver Meera",
    image: {
      filename: "energy-saving-1.jpg",
      path: "./uploads/energy-saving-1.jpg",
      mimetype: "image/jpeg",
      size: 1150000,
    },
    likes: 28,
    comments: [
      {
        author: "PowerConscious Raj",
        text: "Smart move! I'm doing the same at home.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        author: "EcoFriendly Sita",
        text: "Great calculation! Every small step counts.",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
    ],
    ecoPoints: 40,
    status: "approved",
  },
  {
    title: "Water Conservation in School Garden",
    description:
      "Implemented a rainwater harvesting system in our school garden using old plastic drums and PVC pipes. The system collects rainwater from the school roof and stores it for watering plants. This saves approximately 200 liters of water daily during the monsoon season.",
    category: "water-conservation",
    author: "WaterGuard Arjun",
    image: {
      filename: "water-conservation-1.jpg",
      path: "./uploads/water-conservation-1.jpg",
      mimetype: "image/jpeg",
      size: 890000,
    },
    likes: 38,
    comments: [
      {
        author: "AquaProtector Zara",
        text: "Brilliant idea! Can you share the design?",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      },
      {
        author: "SustainableSam",
        text: "This should be implemented in all schools!",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    ],
    ecoPoints: 35,
    status: "approved",
  },
  {
    title: "Community Composting Initiative",
    description:
      "Started a community composting project in our apartment complex. We collect kitchen waste from 15 families and convert it into organic compost. The compost is used in our community garden and shared with local farmers. This reduces landfill waste and creates nutrient-rich soil.",
    category: "other",
    author: "CompostKing Vikram",
    image: {
      filename: "composting-1.jpg",
      path: "./uploads/composting-1.jpg",
      mimetype: "image/jpeg",
      size: 1250000,
    },
    likes: 41,
    comments: [
      {
        author: "OrganicGrower Maya",
        text: "Fantastic project! How do you manage the smell?",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        author: "WasteWarrior",
        text: "I want to start this in my neighborhood too!",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ],
    ecoPoints: 20,
    status: "approved",
  },
];

// Connect to MongoDB
async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    const MONGODB_URI =
      "mongodb+srv://AMOL:amolSIH@cluster0.3eye1sz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas successfully!");

    // Clear existing posts
    console.log("Clearing existing posts...");
    await Post.deleteMany({});
    console.log("✅ Existing posts cleared");

    // Insert sample posts
    console.log("Inserting sample posts...");
    const insertedPosts = await Post.insertMany(samplePosts);
    console.log(`✅ Successfully inserted ${insertedPosts.length} posts`);

    // Display inserted posts
    console.log("\n📝 Sample Posts Created:");
    insertedPosts.forEach((post, index) => {
      console.log(
        `${index + 1}. ${post.title} by ${post.author} (${
          post.ecoPoints
        } points)`
      );
    });

    console.log("\n🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
