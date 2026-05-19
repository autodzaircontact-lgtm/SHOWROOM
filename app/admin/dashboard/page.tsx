"use client"

import { useEffect, useState } from "react"
import { Car, Users, DollarSign, TrendingUp, ShoppingCart, Clock } from "lucide-react"
import { cars, formatPrice, Registration } from "@/lib/data"
import Link from "next/link"

interface Stats {
  totalCars: number
  totalOrders: number
  pendingOrders: number
  approvedOrders: number
  rejectedOrders: number
  totalPotentialRevenue: number
}

export default function AdminDashboardPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [stats, setStats] = useState<Stats>({
    totalCars: cars.length,
    totalOrders: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    rejectedOrders: 0,
    totalPotentialRevenue: 0,
  })

  useEffect(() => {
    const stored = localStorage.getItem("registrations")
    if (stored) {
      const regs: Registration[] = JSON.parse(stored)
      setRegistrations(regs)
      
      const pending = regs.filter(r => r.status === "pending").length
      const approved = regs.filter(r => r.status === "approved").length
      const rejected = regs.filter(r => r.status === "rejected").length
      
      const revenue = regs.reduce((sum, reg) => {
        const car = cars.find(c => c.id === reg.selectedCarId)
        return sum + (car?.price || 0)
      }, 0)

      setStats({
        totalCars: cars.length,
        totalOrders: regs.length,
        pendingOrders: pending,
        approvedOrders: approved,
        rejectedOrders: rejected,
        totalPotentialRevenue: revenue,
      })
    }
  }, [])

  const recentOrders = registrations.slice(-5).reverse()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">نظرة عامة</h1>
        <p className="text-muted-foreground mt-1">مرحباً بك في لوحة تحكم المشرف</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
              <p className="text-3xl font-bold text-card-foreground mt-1">{stats.totalOrders}</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
          </div>
          <Link href="/admin/dashboard/orders" className="mt-4 text-sm text-primary hover:underline inline-block">
            عرض جميع الطلبات
          </Link>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">قيد الانتظار</p>
              <p className="text-3xl font-bold text-amber-500 mt-1">{stats.pendingOrders}</p>
            </div>
            <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            يحتاج {stats.pendingOrders} طلب للمراجعة
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">الإيرادات المحتملة</p>
              <p className="text-2xl font-bold text-card-foreground mt-1">{formatPrice(stats.totalPotentialRevenue)}</p>
            </div>
            <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>من {stats.totalOrders} طلب</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">إجمالي السيارات</p>
              <p className="text-3xl font-bold text-card-foreground mt-1">{stats.totalCars}</p>
            </div>
            <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Car className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <Link href="/admin/dashboard/cars" className="mt-4 text-sm text-primary hover:underline inline-block">
            إدارة السيارات
          </Link>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">إحصائيات الطلبات</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">مقبولة</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${stats.totalOrders ? (stats.approvedOrders / stats.totalOrders) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-green-500 font-medium w-8">{stats.approvedOrders}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">قيد الانتظار</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${stats.totalOrders ? (stats.pendingOrders / stats.totalOrders) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-amber-500 font-medium w-8">{stats.pendingOrders}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">مرفوضة</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${stats.totalOrders ? (stats.rejectedOrders / stats.totalOrders) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-red-500 font-medium w-8">{stats.rejectedOrders}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">آخر الطلبات</h3>
            <Link href="/admin/dashboard/orders" className="text-sm text-primary hover:underline">
              عرض الكل
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const car = cars.find(c => c.id === order.selectedCarId)
                return (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{order.fullName}</p>
                        <p className="text-sm text-muted-foreground">{car?.brand} {car?.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-card-foreground">
                        {car ? formatPrice(car.price) : "-"}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "pending" 
                          ? "bg-amber-100 text-amber-700" 
                          : order.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {order.status === "pending" ? "قيد الانتظار" : order.status === "approved" ? "مقبول" : "مرفوض"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>لا توجد طلبات بعد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
