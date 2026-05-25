import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import type { PostDocument, Post } from "@/types/post";

const DB_NAME = process.env.MONGODB_DB ?? "blog";
const COLLECTION = "posts";

const EDITABLE_FIELDS = ["title", "excerpt", "author", "category", "readTime", "imageColor"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log("[PATCH] id received:", JSON.stringify(id));
    console.log("[PATCH] ObjectId.isValid:", ObjectId.isValid(id));

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const body = await request.json();
    const updates: Partial<Record<typeof EDITABLE_FIELDS[number], string>> = {};

    for (const key of EDITABLE_FIELDS) {
      if (typeof body[key] === "string" && body[key].trim()) {
        updates[key] = body[key].trim();
      }
    }

    console.log("[PATCH] updates:", updates);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const client = await clientPromise;
    const collection = client.db(DB_NAME).collection<PostDocument>(COLLECTION);

    // Diagnostic: verify a document exists in this collection
    const sample = await collection.findOne({});
    console.log("[PATCH] sample _id in collection:", sample?._id?.toHexString());
    console.log("[PATCH] querying for id:", id);
    console.log("[PATCH] ids match:", sample?._id?.toHexString() === id);

    const oid = new ObjectId(id);
    const updateResult = await collection.updateOne(
      { _id: oid },
      { $set: updates }
    );

    console.log("[PATCH] matchedCount:", updateResult.matchedCount, "modifiedCount:", updateResult.modifiedCount);

    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const doc = await collection.findOne({ _id: oid });

    if (!doc) {
      return NextResponse.json({ error: "Document missing after update" }, { status: 500 });
    }

    const post: Post = {
      id: doc._id.toHexString(),
      title: doc.title,
      excerpt: doc.excerpt,
      author: doc.author,
      date: doc.date,
      category: doc.category,
      readTime: doc.readTime,
      imageColor: doc.imageColor,
    };

    return NextResponse.json(post);
  } catch (err) {
    console.error("[PATCH /api/posts/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
