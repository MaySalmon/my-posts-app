import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
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

const REQUIRED_FIELDS = ["title", "excerpt", "author", "category", "readTime", "imageColor"] as const;

export async function POST(request: NextRequest): Promise<NextResponse<Post | { error: string }>> {
  try {
    const body = await request.json();
    const fields: Partial<Record<typeof REQUIRED_FIELDS[number], string>> = {};

    for (const key of REQUIRED_FIELDS) {
      if (typeof body[key] !== "string" || !body[key].trim()) {
        return NextResponse.json({ error: `Missing required field: ${key}` }, { status: 400 });
      }
      fields[key] = body[key].trim();
    }

    const now = new Date();
    const date = now.toISOString().split("T")[0];

    const client = await clientPromise;
    const collection = client.db(DB_NAME).collection<PostDocument>(COLLECTION);

    const insertedId = new ObjectId();
    await collection.insertOne({
      _id: insertedId,
      title: fields.title!,
      excerpt: fields.excerpt!,
      author: fields.author!,
      date,
      category: fields.category!,
      readTime: fields.readTime!,
      imageColor: fields.imageColor!,
      createdAt: now,
    });

    const post: Post = {
      id: insertedId.toHexString(),
      title: fields.title!,
      excerpt: fields.excerpt!,
      author: fields.author!,
      date,
      category: fields.category!,
      readTime: fields.readTime!,
      imageColor: fields.imageColor!,
    };

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error("[POST /api/posts]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
