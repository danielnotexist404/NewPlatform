import { BLOG_UI, type BlogPost } from "@/content/he/blog";
import { blocksText, parseBlocks } from "./markdown";
import { plainText } from "./inline";
import { formatHeDate } from "./dates";

/** ceil(words / 200) minutes (Part 02 §8.1). */
export function readingMinutes(post: BlogPost): number {
  const words = plainText(blocksText(parseBlocks(post.body))).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function wordCount(post: BlogPost): number {
  return plainText(blocksText(parseBlocks(post.body))).split(/\s+/).filter(Boolean).length;
}

/** "{author} · {date} · {n} דקות קריאה" */
export function metaParts(post: BlogPost): string[] {
  return [post.author, formatHeDate(post.date), BLOG_UI.readingTime(readingMinutes(post))];
}
