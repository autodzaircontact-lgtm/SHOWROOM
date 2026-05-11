"use client"

import { useState } from "react"
import { cars, formatPrice } from "@/lib/data"
import { Search, Filter, Fuel, Settings, Users } from "lucide-react"

export default function CarsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")

  const brands = ["all", ...Array.from(new Set(cars.map(car => car.brand)))]

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          car.brand.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesBrand = selectedBrand === "all" || car.brand === selectedBrand
    return matchesSearch && matchesBrand
  })

  // Stats
  const totalValue = cars.reduce((sum, car) => sum + car.price, 0)
  const avgPrice = Math.round(totalValue / cars.length)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">السيارات</h1>
          <p className="text-muted-foreground mt-1">إدارة مخزون السيارات</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">إجمالي السيارات</p>
          <p className="text-3xl font-bold text-card-foreground mt-1">{cars.length}</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">إجمالي قيمة المخزون</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">{formatPrice(totalValue)}</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">متوسط السعر</p>
          <p className="text-2xl font-bold text-card-foreground mt-1">{formatPrice(avgPrice)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="البحث عن سيارة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-3 rounded-lg border border-input bg-background text-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-4 py-3 rounded-lg border border-input bg-background text-foreground"
          >
            <option value="all">جميع العلامات</option>
            {brands.filter(b => b !== "all").map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map(car => (
          <div key={car.id} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="h-48 bg-muted relative">
              <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                {car.brand}
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-card-foreground mb-1">
                {car.brand} {car.model}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">{car.year}</p>

              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Fuel className="h-4 w-4" />
                  <span>{car.fuelType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  <span>{car.transmission}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{car.seats}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">السعر</p>
                  <p className="font-bold text-card-foreground">{formatPrice(car.price)}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">القسط الشهري</p>
                  <p className="font-bold text-primary">{formatPrice(car.monthlyPayment)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>لا توجد سيارات مطابقة للبحث</p>
        </div>
      )}
    </div>
  )
}
