import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const uri = process.env.MONGODB_URI!;
console.log("Connecting to:", uri);
const DB_NAME = process.env.MONGODB_DB ?? "blog";

const CATEGORIES = ["Design", "Engineering", "Product", "Culture", "Insights"];
const AUTHORS = ["Maya Lin", "Theo Park", "Sasha Volkov", "Ines Ferreira", "Juno Reid"];
const COLORS = ["#1a1a2e", "#16213e", "#0f3460", "#1b4332", "#3d0c11", "#2d1b69", "#1a3c34"];

const TITLES = [
  "The Architecture of Calm Systems",
  "When Design Becomes Infrastructure",
  "Notes on Building with Intention",
  "The Quiet Revolution in Interface Design",
  "On Constraints and Creative Freedom",
  "What Data Cannot Tell You",
  "Rethinking the Default State",
  "Invisible Design, Tangible Impact",
  "The Space Between Interactions",
  "Engineering Empathy at Scale",
  "Shipping Without Regret",
  "The Aesthetics of Reliability",
  "On Saying No to Features",
  "Designing for the Unhappy Path",
  "When Speed Is the Wrong Goal",
  "The Cost of Complexity",
  "Refactoring as Care Work",
  "What Great Onboarding Feels Like",
  "Building Systems That Explain Themselves",
  "The Ethics of Defaults",
  "Slow Software, Fast Thinking",
  "The Joy of Boring Infrastructure",
  "Naming Things Well",
  "Accessibility Is Not a Feature",
  "The Shape of Good Feedback",
  "On Writing Code for Strangers",
  "Metrics That Matter Less Than You Think",
  "The Underrated Art of Error Messages",
  "Why Consistency Beats Cleverness",
  "Designing Trust, Not Just UI",
];

const EXCERPTS = [
  "Exploring how thoughtful system design creates products that feel effortless to use.",
  "Infrastructure is never just technical — it shapes how teams think and products evolve.",
  "Building slowly and deliberately produces better outcomes than moving fast and breaking things.",
  "A quiet shift is happening in how we think about the surfaces people touch every day.",
  "The most creative work often happens within the tightest constraints.",
  "Metrics tell a partial story. The rest lives in the spaces between the numbers.",
  "What does it mean to design the state before anything has happened?",
  "Great design disappears. It leaves only the experience behind.",
  "Micro-moments accumulate into the overall feeling of a product.",
  "Designing systems that scale without losing their human quality.",
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected!");
    const db = client.db(DB_NAME);
    const collection = db.collection("posts");
    await collection.deleteMany({});
    const posts = Array.from({ length: 30 }, (_, i) => ({
      title: TITLES[i % TITLES.length],
      excerpt: EXCERPTS[i % EXCERPTS.length],
      author: AUTHORS[i % AUTHORS.length],
      date: new Date(2025, 0, 1 + i).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
      category: CATEGORIES[i % CATEGORIES.length],
      readTime: `${3 + (i % 8)} min read`,
      imageColor: COLORS[i % COLORS.length],
      createdAt: new Date(2025, 0, 1 + i),
    }));
    const result = await collection.insertMany(posts);
    console.log(`✅ Inserted ${result.insertedCount} posts into ${DB_NAME}.posts`);
  } finally {
    await client.close();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});