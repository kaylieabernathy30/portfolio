// src/app/admin/signup/page.tsx
import { SignupForm } from "@/components/auth/SignupForm";
import { Suspense } from "react";

export default function AdminSignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Suspense fallback={<div className="text-foreground">Loading form...</div>}>
         <SignupForm />
      </Suspense>
    </div>
  );
}