"use client";
/**
 * Browser-side store for videos generated in this browser (until Supabase exists).
 * In-memory first (survives client-side navigation, holds full-size images), then localStorage best effort
 * (images are downscaled before saving; on quota errors the video is kept without images).
 */
import * as React from "react";
import type { GenAspect, GeneratedScene } from "./types";

export interface StoredScene extends GeneratedScene { image: string | null }
export interface GeneratedVideo {
  id: string;
  createdAt: string;
  title: string;
  hookText: string;
  nicheSlug: string;
  goal: string;
  style: string;
  voice: "male" | "female" | "none";
  mood: string;
  aspect: GenAspect;
  durationSec: number;
  credits: number;
  source: "ai" | "mock";
  scenes: StoredScene[];
}

const KEY = "kdimon.videos.v1";
const memory = new Map<string, GeneratedVideo>();
const listeners = new Set<() => void>();

function readAll(): GeneratedVideo[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as GeneratedVideo[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeAll(list: GeneratedVideo[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    return true;
  } catch {
    return false;
  }
}

export function listVideos(): GeneratedVideo[] {
  const stored = readAll();
  const ids = new Set(stored.map((v) => v.id));
  const extra = [...memory.values()].filter((v) => !ids.has(v.id));
  return [...extra, ...stored.map((v) => memory.get(v.id) ?? v)].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getVideo(id: string): GeneratedVideo | null {
  return memory.get(id) ?? readAll().find((v) => v.id === id) ?? null;
}

export function saveVideo(video: GeneratedVideo) {
  memory.set(video.id, video);
  const others = readAll().filter((v) => v.id !== video.id).slice(0, 11);
  if (!writeAll([video, ...others])) {
    // quota: keep the script, drop images (the in-memory copy still has them for this session)
    writeAll([{ ...video, scenes: video.scenes.map((s) => ({ ...s, image: null })) }, ...others.map((v) => ({ ...v, scenes: v.scenes.map((s) => ({ ...s, image: null })) }))]);
  }
  listeners.forEach((l) => l());
}

export function subscribeVideos(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Downscales a data-URL image to JPEG (max 720 px wide) so a few frames fit in localStorage. */
export async function compressImage(dataUrl: string, maxWidth = 720): Promise<string> {
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = dataUrl;
    await img.decode();
    const scale = Math.min(1, maxWidth / img.naturalWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    return dataUrl;
  }
}

/** Videos generated in this browser; empty during SSR and the first client render (no hydration mismatch). */
export function useGeneratedVideos(): GeneratedVideo[] {
  const [list, setList] = React.useState<GeneratedVideo[]>([]);
  React.useEffect(() => {
    const sync = () => setList(listVideos());
    sync();
    return subscribeVideos(sync);
  }, []);
  return list;
}
