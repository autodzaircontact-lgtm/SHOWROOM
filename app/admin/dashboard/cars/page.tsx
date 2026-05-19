"use client"

import { useRouter } from "next/navigation"
import { cars, formatPrice } from "@/lib/data"
import { ArrowRight, Car, Fuel, Settings, Users } from "lucide-react"

export default function AdminCarsPage() {
  const router = useRouter()

  // Group cars by brand
  const carsByBrand = cars.reduce((acc, car) => {
    if (!acc[car.brand]) {
      acc[car.brand] = []
    }
    acc[car.brand].push(car)
    return acc
  }, {} as Record<string, typeof cars>)

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
        >
          <ArrowRight className="h-5 w-5" />
          <span>العودة للوحة التحكم</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">السيارات</h1>
          <p className="text-muted-foreground mt-1">عرض جميع السيارات المتوفرة</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">إجمالي السيارات</p>
              <p className="text-3xl font-bold text-card-foreground mt-1">{cars.length}</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Car className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">العلامات التجارية</p>
              <p className="text-3xl font-bold text-card-foreground mt-1">{Object.keys(carsByBrand).length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Settings className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">متوسط السعر</p>
              <p className="text-xl font-bold text-card-foreground mt-1">
                {formatPrice(Math.round(cars.reduce((sum, car) => sum + car.price, 0) / cars.length))}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">أنواع الوقود</p>
              <p className="text-3xl font-bold text-card-foreground mt-1">
                {new Set(cars.map(c => c.fuelType)).size}
              </p>
            </div>
            <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center">
              <Fuel className="h-6 w-6 text-amber-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Cars by Brand */}
      {Object.entries(carsByBrand).map(([brand, brandCars]) => (
        <div key={brand} className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">{brand}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandCars.map((car) => (
              <div key={car.id} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center">
                  <Car className="h-16 w-16 text-muted-foreground/30" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-card-foreground">{car.model}</h3>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {car.year}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-2 py-1 bg-muted rounded text-muted-foreground">
                      {car.fuelType}
                    </span>
                    <span className="px-2 py-1 bg-muted rounded text-muted-foreground">
                      {car.transmission}
                    </span>
                    <span className="px-2 py-1 bg-muted rounded text-muted-foreground">
                      {car.seats} مقاعد
                    </span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">السعر</p>
                        <p className="font-bold text-primary">{formatPrice(car.price)}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground">القسط الشهري</p>
                        <p className="font-bold text-card-foreground">{formatPrice(car.monthlyPayment)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
