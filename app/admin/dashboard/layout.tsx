import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import AdminSidebar from "@/components/admin-sidebar"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  
  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen flex" dir="rtl">
      <AdminSidebar username={session.username} />
      <main className="flex-1 bg-background overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
