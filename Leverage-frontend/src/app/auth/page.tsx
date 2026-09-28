"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthGateway } from "@/components/AuthGateway";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  return (
    <AuthGateway
      onSuccess={() => router.push(redirectPath)}
      allowSkip={true}
    />
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthGateway allowSkip={true} />}>
      <AuthPageContent />
    </Suspense>
  );
}
