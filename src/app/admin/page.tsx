import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Suspense fallback={<div className="text-foreground">Loading form...</div>}>
         <LoginForm />
      </Suspense>
    </div>
  );
}
