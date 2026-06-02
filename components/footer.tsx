import { Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Showroom Auto Dzair</h3>
            <p className="text-background/70 text-sm leading-relaxed">
              وكيلكم المعتمد لسيارات فيات وجيلي في الجزائر. نوفر لكم أفضل العروض بالتقسيط المريح مع
              خدمة ما بعد البيع المتميزة.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">اتصل بنا</h3>
            <div className="space-y-3">
              <a
                href="tel:+213559365082"
                className="flex items-center gap-3 text-background/70 hover:text-background transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span dir="ltr">0559 365 082</span>
              </a>
              <a
                href="mailto:autodzaircontact@gmail.com"
                className="flex items-center gap-3 text-background/70 hover:text-background transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>autodzaircontact@gmail.com</span>
              </a>
              <div className="flex items-center gap-3 text-background/70">
                <MapPin className="h-4 w-4" />
                <span>الجزائر العاصمة، شارع ديدوش مراد</span>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">أوقات العمل</h3>
            <div className="space-y-2 text-background/70 text-sm">
              <p>السبت - الخميس: 8:00 - 17:00</p>
              <p>الجمعة: مغلق</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background/20 text-center text-background/50 text-sm">
          <p>جميع الحقوق محفوظة &copy; 2026 Showroom Auto Dzair</p>
        </div>
      </div>
    </footer>
  )
}
