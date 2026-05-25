"use client"

import { useEffect, useState } from "react"
import { Car, Users, DollarSign, TrendingUp, Calendar, FileText } from "lucide-react"
import { cars, formatPrice, Registration } from "@/lib/data"
import { createClient } from "@/lib/supabase/client"

// Map Supabase snake_case to camelCase
function mapRegistration(row: any): Registration {
  return {
    id: row.id,
    fullName: row.full_name,
    nin: row.nin,
    cardLast8: row.card_last8,
    cardExpiry: row.card_expiry,
    phone1: row.phone1,
    phone2: row.phone2,
    hasPreviousInstallment: row.has_previous_installment,
    selectedCarId: row.selected_car_id,
    createdAt: row.created_at,
    status: row.status,
  }
}

interface Stats {
  totalCars: number
  totalRegistrations: number
  pendingRegistrations: number
  approvedRegistrations: number
  totalPotentialRevenue: number
  averageCarPrice: number
}

export default function DashboardPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [stats, setStats] = useState<Stats>({
    totalCars: cars.length,
    totalRegistrations: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    totalPotentialRevenue: 0,
    averageCarPrice: 0,
  })

  useEffect(() => {
    // Load registrations from Supabase
    async function fetchRegistrations() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error("[v0] Error fetching registrations:", error)
        return
      }
      
      const regs: Registration[] = (data || []).map(mapRegistration)
      setRegistrations(regs)
      
      const pending = regs.filter(r => r.status === "pending").length
      const approved = regs.filter(r => r.status === "approved").length
      
      // Calculate potential revenue
      const revenue = regs.reduce((sum, reg) => {
        const car = cars.find(c => c.id === reg.selectedCarId)
        return sum + (car?.price || 0)
      }, 0)

      setStats({
        totalCars: cars.length,
        totalRegistrations: regs.length,
        pendingRegistrations: pending,
        approvedRegistrations: approved,
        totalPotentialRevenue: revenue,
        averageCarPrice: Math.round(cars.reduce((sum, car) => sum + car.price, 0) / cars.length),
      })
    }
    
    fetchRegistrations()
  }, [])

  // Count cars by brand
  const carsByBrand = cars.reduce((acc, car) => {
    acc[car.brand] = (acc[car.brand] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Recent registrations
  const recentRegistrations = registrations.slice(-5).reverse()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">نظرة عامة</h1>
        <p className="text-muted-foreground mt-1">مرحباً بك في لوحة تحكم المعرض</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">إجمالي السيارات</p>
              <p className="text-3xl font-bold text-card-foreground mt-1">{stats.totalCars}</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Car className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{Object.keys(carsByBrand).length} علامات تجارية</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">التسجيلات</p>
              <p className="text-3xl font-bold text-card-foreground mt-1">{stats.totalRegistrations}</p>
            </div>
            <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="text-amber-500">{stats.pendingRegistrations} قيد الانتظار</span>
            <span className="text-green-500">{stats.approvedRegistrations} مقبولة</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">الإيرادات المحتملة</p>
              <p className="text-2xl font-bold text-card-foreground mt-1">{formatPrice(stats.totalPotentialRevenue)}</p>
            </div>
            <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>من {stats.totalRegistrations} تسجيل</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">متوسط سعر السيارة</p>
              <p className="text-2xl font-bold text-card-foreground mt-1">{formatPrice(stats.averageCarPrice)}</p>
            </div>
            <div className="h-12 w-12 bg-purple-500/10 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span>عبر {stats.totalCars} سيارة</span>
          </div>
        </div>
      </div>

      {/* Charts/Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cars by Brand */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">السيارات حسب العلامة</h3>
          <div className="space-y-4">
            {Object.entries(carsByBrand).map(([brand, count]) => (
              <div key={brand} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium text-card-foreground">{brand}</div>
                <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(count / stats.totalCars) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-sm text-muted-foreground text-left">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">آخر التسجيلات</h3>
          {recentRegistrations.length > 0 ? (
            <div className="space-y-4">
              {recentRegistrations.map((reg) => {
                const car = cars.find(c => c.id === reg.selectedCarId)
                return (
                  <div key={reg.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-card-foreground">{reg.fullName}</p>
                      <p className="text-sm text-muted-foreground">{car?.brand} {car?.model}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        reg.status === "pending" 
                          ? "bg-amber-100 text-amber-700" 
                          : reg.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {reg.status === "pending" ? "قيد الانتظار" : reg.status === "approved" ? "مقبول" : "مرفوض"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>لا توجد تسجيلات بعد</p>
            </div>
          )}
        </div>
      </div>

      {/* Car Inventory Summary */}
      <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">ملخص المخزون</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">السيارة</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">العلامة</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">السنة</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">نوع الوقود</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">السعر</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">القسط الشهري</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium text-card-foreground">{car.model}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {car.brand}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{car.year}</td>
                  <td className="py-3 px-4 text-muted-foreground">{car.fuelType}</td>
                  <td className="py-3 px-4 font-medium text-card-foreground">{formatPrice(car.price)}</td>
                  <td className="py-3 px-4 text-primary font-medium">{formatPrice(car.monthlyPayment)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
