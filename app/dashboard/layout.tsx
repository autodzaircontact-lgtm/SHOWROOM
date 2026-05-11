import Link from "next/link"
import { LayoutDashboard, Car, Users, FileText, Settings, Home } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-l border-sidebar-border flex-shrink-0">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold">لوحة التحكم</h1>
          <p className="text-sm text-sidebar-foreground/60">Showroom Auto Dzair</p>
        </div>
        
        <nav className="p-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>نظرة عامة</span>
          </Link>
          <Link
            href="/dashboard/cars"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <Car className="h-5 w-5" />
            <span>السيارات</span>
          </Link>
          <Link
            href="/dashboard/registrations"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <Users className="h-5 w-5" />
            <span>التسجيلات</span>
          </Link>
          <Link
            href="/dashboard/reports"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <FileText className="h-5 w-5" />
            <span>التقارير</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span>الإعدادات</span>
          </Link>
        </nav>

        <div className="absolute bottom-4 right-4 left-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/60"
          >
            <Home className="h-5 w-5" />
            <span>العودة للموقع</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
