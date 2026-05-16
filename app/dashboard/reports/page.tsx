"use client"

import { useEffect, useState } from "react"
import { cars, formatPrice, Registration } from "@/lib/data"
import { TrendingUp, Car, DollarSign, Users, BarChart3 } from "lucide-react"

export default function ReportsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("registrations")
    if (stored) {
      setRegistrations(JSON.parse(stored))
    }
  }, [])

  // Calculate statistics
  const totalInventoryValue = cars.reduce((sum, car) => sum + car.price, 0)
  const totalPotentialRevenue = registrations.reduce((sum, reg) => {
    const car = cars.find(c => c.id === reg.selectedCarId)
    return sum + (car?.price || 0)
  }, 0)
  const approvedRevenue = registrations
    .filter(r => r.status === "approved")
    .reduce((sum, reg) => {
      const car = cars.find(c => c.id === reg.selectedCarId)
      return sum + (car?.price || 0)
    }, 0)

  // Popular cars
  const carPopularity = registrations.reduce((acc, reg) => {
    acc[reg.selectedCarId] = (acc[reg.selectedCarId] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const popularCars = Object.entries(carPopularity)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([carId, count]) => ({
      car: cars.find(c => c.id === carId),
      count,
    }))

  // Brand distribution
  const brandDistribution = cars.reduce((acc, car) => {
    acc[car.brand] = (acc[car.brand] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Price ranges
  const priceRanges = [
    { label: "أقل من 2 مليون", min: 0, max: 2000000 },
    { label: "2-3 مليون", min: 2000000, max: 3000000 },
    { label: "3-4 مليون", min: 3000000, max: 4000000 },
    { label: "أكثر من 4 مليون", min: 4000000, max: Infinity },
  ].map(range => ({
    ...range,
    count: cars.filter(car => car.price >= range.min && car.price < range.max).length,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">التقارير</h1>
        <p className="text-muted-foreground mt-1">تحليلات وإحصائيات المعرض</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Car className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">قيمة المخزون</p>
          </div>
          <p className="text-2xl font-bold text-card-foreground">{formatPrice(totalInventoryValue)}</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground">الإيرادات المحتملة</p>
          </div>
          <p className="text-2xl font-bold text-card-foreground">{formatPrice(totalPotentialRevenue)}</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground">المبيعات المؤكدة</p>
          </div>
          <p className="text-2xl font-bold text-green-500">{formatPrice(approvedRevenue)}</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-purple-500/10 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-sm text-muted-foreground">معدل التحويل</p>
          </div>
          <p className="text-2xl font-bold text-card-foreground">
            {registrations.length > 0 
              ? Math.round((registrations.filter(r => r.status === "approved").length / registrations.length) * 100)
              : 0}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Cars */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-card-foreground mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            السيارات الأكثر طلباً
          </h3>
          {popularCars.length > 0 ? (
            <div className="space-y-4">
              {popularCars.map(({ car, count }, index) => (
                <div key={car?.id || index} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-card-foreground">{car?.brand} {car?.model}</p>
                    <p className="text-sm text-muted-foreground">{formatPrice(car?.price || 0)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(count / (popularCars[0]?.count || 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>لا توجد بيانات كافية</p>
            </div>
          )}
        </div>

        {/* Brand Distribution */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">توزيع العلامات التجارية</h3>
          <div className="space-y-4">
            {Object.entries(brandDistribution).map(([brand, count]) => (
              <div key={brand} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium text-card-foreground">{brand}</div>
                <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-primary to-primary/60 rounded-full transition-all flex items-center justify-end pr-2"
                    style={{ width: `${(count / cars.length) * 100}%` }}
                  >
                    <span className="text-xs text-primary-foreground font-medium">{count}</span>
                  </div>
                </div>
                <div className="w-12 text-sm text-muted-foreground text-left">
                  {Math.round((count / cars.length) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Distribution */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">توزيع الأسعار</h3>
          <div className="space-y-4">
            {priceRanges.map((range) => (
              <div key={range.label} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-card-foreground">{range.label}</div>
                <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-blue-500 to-blue-400 rounded-full transition-all flex items-center justify-end pr-2"
                    style={{ width: `${(range.count / cars.length) * 100}%` }}
                  >
                    {range.count > 0 && (
                      <span className="text-xs text-white font-medium">{range.count}</span>
                    )}
                  </div>
                </div>
                <div className="w-12 text-sm text-muted-foreground text-left">
                  {Math.round((range.count / cars.length) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fuel Type Distribution */}
        <div className="bg-card p-6 rounded-xl border border-border">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">أنواع الوقود</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(
              cars.reduce((acc, car) => {
                acc[car.fuelType] = (acc[car.fuelType] || 0) + 1
                return acc
              }, {} as Record<string, number>)
            ).map(([fuel, count]) => (
              <div key={fuel} className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold text-card-foreground">{count}</p>
                <p className="text-sm text-muted-foreground">{fuel}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
