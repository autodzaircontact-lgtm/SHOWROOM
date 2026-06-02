"use client"

import { useState } from "react"
import { Car } from "@/lib/data"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CarsSection } from "@/components/cars-section"
import { HowItWorks } from "@/components/how-it-works"
import { RegistrationForm } from "@/components/registration-form"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)

  const handleSelectCar = (car: Car) => {
    setSelectedCar(car)
    // Scroll to registration section
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <Header />
      <main>
        <HeroSection />
        <CarsSection onSelectCar={handleSelectCar} />
        <HowItWorks />
        <RegistrationForm selectedCar={selectedCar} onSelectCar={setSelectedCar} />
      </main>
      <Footer />
    </div>
  )
}
