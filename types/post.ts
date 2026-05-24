import { ObjectId } from "mongodb";

export interface PostDocument {
  _id: ObjectId;
  title: string;
  excerpt: string;
  author: string;
  date: string;         // ISO string, e.g. "2025-01-15"
  category: string;
  readTime: string;     // e.g. "5 min read"
  imageColor: string;   // hex color for the card image bg
  createdAt: Date;
}

// Shape sent to the client (id as string, no ObjectId)
export interface Post {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  imageColor: string;
}

export interface PostsApiResponse {
  posts: Post[];
  hasMore: boolean;
  total: number;
}
