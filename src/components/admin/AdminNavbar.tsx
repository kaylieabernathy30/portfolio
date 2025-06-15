"use client";

import { Logo } from "@/components/icons/Logo";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/firebase/authService";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { LogOut, PlusCircle } from "lucide-react";
// Import useProjectDialogStore or similar if using Zustand/Context for dialog state
// For simplicity, ProjectFormDialog might be controlled by local state in ProjectDataTable or dashboard page

export function AdminNavbar() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await signOutUser();
    if (error) {
      toast({
        title: "Logout Failed",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/admin");
      router.refresh(); 
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Logo />
        <div className="flex items-center space-x-4">
          {/* Add Project button will be part of ProjectDataTable or dashboard page to trigger dialog */}
          <Button variant="ghost" onClick={handleLogout} aria-label="Log out">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
