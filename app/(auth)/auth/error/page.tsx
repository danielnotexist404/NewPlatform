import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthErrorView } from "@/components/auth/auth-error-view";
import { AUTH } from "@/content/he/site";

export const metadata: Metadata = {
  title: AUTH.error.meta.title,
  robots: { index: false, follow: false },
};

/** /auth/error?reason=expired|oauth|unknown (Part 03 §3.4). */
export default function AuthErrorPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 pt-24 pb-12">
      <Suspense fallback={null}>
        <AuthErrorView />
      </Suspense>
    </div>
  );
}
