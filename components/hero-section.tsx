import Link from "next/link"
import { Shield, Clock, CreditCard } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[600px] bg-gradient-to-bl from-primary/90 to-primary flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('/hero-bg.jpg')`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-primary-foreground">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            امتلك سيارة أحلامك بالتقسيط المريح
          </h1>
          <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 text-pretty">
            سيارات فيات وجيلي الجديدة متوفرة الآن في الجزائر بأقساط شهرية مناسبة وبدون فوائد مخفية
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="#cars"
              className="bg-accent text-accent-foreground px-8 py-4 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
            >
              تصفح السيارات
            </Link>
            <Link
              href="#register"
              className="bg-white/10 backdrop-blur text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              سجل الآن
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <CreditCard className="h-10 w-10 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold text-lg mb-2">تقسيط مريح</h3>
              <p className="text-sm text-primary-foreground/80">أقساط شهرية تناسب ميزانيتك</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <Shield className="h-10 w-10 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold text-lg mb-2">ضمان شامل</h3>
              <p className="text-sm text-primary-foreground/80">ضمان المصنع على جميع السيارات</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
              <Clock className="h-10 w-10 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold text-lg mb-2">إجراءات سريعة</h3>
              <p className="text-sm text-primary-foreground/80">ملف بسيط وموافقة سريعة</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
