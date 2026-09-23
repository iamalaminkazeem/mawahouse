import AuthProvider from "@/components/admin/AuthProvider";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col md:flex-row bg-mawa-cream">
        <AdminSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </AuthProvider>
  );
}
