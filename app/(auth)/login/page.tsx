import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { LoginArt } from "@/components/auth/login-art";
import { Skeleton } from "@/components/ui/misc";
import { AUTH } from "@/content/he/site";

export const metadata: Metadata = {
  title: AUTH.meta.title,
  description: AUTH.meta.description,
  robots: { index: false, follow: false },
};

function FormFallback() {
  return (
    <div aria-hidden className="flex flex-col gap-6">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-12 w-full rounded-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full rounded-full" />
    </div>
  );
}

/** /login — one screen for sign-in and sign-up (Part 03 §3.1). Both methods are mocked during the UI pass. */
export default function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="relative flex flex-col justify-center px-4 pt-24 pb-12 md:px-10">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-projector" />
        <div className="relative mx-auto w-full max-w-[420px]">
          <Suspense fallback={<FormFallback />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
      <aside className="relative hidden overflow-hidden bg-surface-2 lg:block">
        <LoginArt />
      </aside>
    </div>
  );
}
