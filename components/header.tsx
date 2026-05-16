"use client"

import Link from "next/link"
import Image from "next/image"
import { Phone, Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Showroom Auto Dzair Logo" 
              width={48} 
              height={48}
              className="w-12 h-12 object-contain"
            />
            <span className="text-2xl font-bold">Showroom Auto Dzair</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-primary-foreground/80 transition-colors">
              الرئيسية
            </Link>
            <Link href="#cars" className="hover:text-primary-foreground/80 transition-colors">
              السيارات
            </Link>
            <Link href="#installment" className="hover:text-primary-foreground/80 transition-colors">
              التقسيط
            </Link>
            <Link href="#register" className="hover:text-primary-foreground/80 transition-colors">
              التسجيل
            </Link>
            <Link href="#contact" className="hover:text-primary-foreground/80 transition-colors">
              اتصل بنا
            </Link>
          </nav>

          <a
            href="tel:+213559365082"
            className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span dir="ltr">0559 365 082</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10 flex flex-col gap-4">
            <Link href="/" className="hover:text-primary-foreground/80 transition-colors">
              الرئيسية
            </Link>
            <Link href="#cars" className="hover:text-primary-foreground/80 transition-colors">
              السيارات
            </Link>
            <Link href="#installment" className="hover:text-primary-foreground/80 transition-colors">
              التقسيط
            </Link>
            <Link href="#register" className="hover:text-primary-foreground/80 transition-colors">
              التسجيل
            </Link>
            <Link href="#contact" className="hover:text-primary-foreground/80 transition-colors">
              اتصل بنا
            </Link>
            <a
              href="tel:+213559365082"
              className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors w-fit"
            >
              <Phone className="h-4 w-4" />
              <span dir="ltr">0559 365 082</span>
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
