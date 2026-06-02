"use client"

import Image from "next/image"
import { Car, formatPrice } from "@/lib/data"
import { Fuel, Settings, Users } from "lucide-react"

interface CarCardProps {
  car: Car
  onSelect: (car: Car) => void
}

export function CarCard({ car, onSelect }: CarCardProps) {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-border">
      <div className="relative h-48 bg-muted">
        <Image
          src={car.image}
          alt={`${car.brand} ${car.model} ${car.year}`}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
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

        <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-lg">
          <div>
            <p className="text-xs text-muted-foreground">السعر</p>
            <p className="font-bold text-card-foreground">{formatPrice(car.price)}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground">القسط الشهري</p>
            <p className="font-bold text-primary">{formatPrice(car.monthlyPayment)}</p>
          </div>
        </div>

        <button
          onClick={() => onSelect(car)}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          اختر هذه السيارة
        </button>
      </div>
    </div>
  )
}
