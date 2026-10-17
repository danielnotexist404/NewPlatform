"use client";
import * as React from "react";
import Link from "next/link";
import { X } from "lucide-react";

const ID = "meta-campaigns-v1";

export function AnnouncementBar() {
  const [hidden, setHidden] = React.useState(true);
  React.useEffect(() => {
    try { setHidden(localStorage.getItem(`announcement.dismissed.${ID}`) === "1"); } catch { setHidden(false); }
  }, []);
  if (hidden) return null;
  return (
    <div className="relative flex h-9 items-center justify-center bg-surface-2 px-10 text-small">
      <Link href="/hooks" className="truncate hover:underline">
        חדש: ספריית הוקים בעברית לפי נישה. מעתיקים בחינם ←
      </Link>
      <button
        type="button"
        aria-label="סגירת ההודעה"
        className="absolute inset-e-2 rounded-full p-1.5 text-text-2 hover:text-text"
        onClick={() => {
          setHidden(true);
          try { localStorage.setItem(`announcement.dismissed.${ID}`, "1"); } catch { /* ignore */ }
        }}
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
