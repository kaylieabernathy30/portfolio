import { ProjectDataTable } from "@/components/admin/ProjectDataTable";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard - Devfolio Noir",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <Suspense fallback={
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-3 text-muted-foreground">Loading dashboard...</p>
        </div>
      }>
        <ProjectDataTable />
      </Suspense>
    </div>
  );
}
