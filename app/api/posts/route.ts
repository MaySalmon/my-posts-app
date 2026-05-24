import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import type { PostDocument, PostsApiResponse, Post } from "@/types/post";

const PAGE_SIZE = 6;
const DB_NAME = process.env.MONGODB_DB ?? "blog";
const COLLECTION = "posts";

export async function GET(request: NextRequest): Promise<NextResponse<PostsApiResponse | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = Math.min(50, parseInt(searchParams.get("pageSize") ?? String(PAGE_SIZE), 10));
    const skip = (page - 1) * pageSize;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection<PostDocument>(COLLECTION);

    const [docs, total] = await Promise.all([
      collection
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      collection.countDocuments(),
    ]);

    const posts: Post[] = docs.map((doc) => ({
      id: doc._id.toHexString(),
      title: doc.title,
      excerpt: doc.excerpt,
      author: doc.author,
      date: doc.date,
      category: doc.category,
      readTime: doc.readTime,
      imageColor: doc.imageColor,
    }));

    return NextResponse.json({
      posts,
      hasMore: skip + posts.length < total,
      total,
    });
  } catch (err) {
    console.error("[GET /api/posts]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
