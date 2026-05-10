"use client"

import { useState } from "react"
import { cars, Car } from "@/lib/data"
import { CarCard } from "./car-card"

const brands = ["الكل", "Fiat", "Geely", "Livan", "تيرصام"] as const

interface CarsSectionProps {
  onSelectCar: (car: Car) => void
}

export function CarsSection({ onSelectCar }: CarsSectionProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>("الكل")

  const filteredCars = cars.filter((car) => {
    if (selectedBrand === "الكل") return true
    if (selectedBrand === "تيرصام") return car.brand === "Terrsam"
    return car.brand === selectedBrand
  })

  return (
    <section id="cars" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-4">
            تشكيلة سياراتنا
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            اختر من بين أفضل سيارات فيات وجيلي وليفان وشاحنات تيرصام المتوفرة بالتقسيط
          </p>
        </div>

        {/* Brand Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedBrand === brand
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground hover:bg-muted border border-border"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} onSelect={onSelectCar} />
          ))}
        </div>
      </div>
    </section>
  )
}
