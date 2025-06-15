import { AdminAuthGuard } from "@/components/auth/AdminAuthGuard";
import { AdminNavbar } from "@/components/admin/AdminNavbar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="flex flex-col min-h-screen">
        <AdminNavbar />
        <main className="flex-grow p-4 md:p-8 container mx-auto">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
