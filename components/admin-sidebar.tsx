"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Car, 
  Settings, 
  Home, 
  LogOut,
  User
} from "lucide-react"
import { useState } from "react"

interface AdminSidebarProps {
  username: string
}

export default function AdminSidebar({ username }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoggingOut(false)
    }
  }

  const navItems = [
    { href: "/admin/dashboard", label: "نظرة عامة", icon: LayoutDashboard },
    { href: "/admin/dashboard/orders", label: "الطلبات", icon: ShoppingCart },
    { href: "/admin/dashboard/cars", label: "السيارات", icon: Car },
    { href: "/admin/dashboard/settings", label: "الإعدادات", icon: Settings },
  ]

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-l border-sidebar-border flex-shrink-0 flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold">لوحة تحكم المشرف</h1>
        <p className="text-sm text-sidebar-foreground/60">Showroom Auto Dzair</p>
      </div>
      
      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sidebar-foreground">{username}</p>
            <p className="text-xs text-sidebar-foreground/60">مشرف</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                  : "hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground/60"
        >
          <Home className="h-5 w-5" />
          <span>العودة للموقع</span>
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 transition-colors text-destructive disabled:opacity-50"
        >
          <LogOut className="h-5 w-5" />
          <span>{loggingOut ? "جاري الخروج..." : "تسجيل الخروج"}</span>
        </button>
      </div>
    </aside>
  )
}
