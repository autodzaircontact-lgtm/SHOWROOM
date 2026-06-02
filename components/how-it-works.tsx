import { FileText, Wallet, Car, CreditCard } from "lucide-react"

const steps = [
  {
    number: 1,
    icon: FileText,
    title: "قدم طلبك",
    description: "إملأ الاستمارة بمعلوماتك الشخصية واختر السيارة التي تناسبك",
  },
  {
    number: 2,
    icon: Wallet,
    title: "ادفع التسبيق",
    description: "ادفع مبلغ التسبيق الأولي فقط وابدأ إجراءات التقسيط",
  },
  {
    number: 3,
    icon: Car,
    title: "استلم سيارتك",
    description: "استلم سيارتك الجديدة وابدأ بدفع الأقساط الشهرية المريحة",
  },
  {
    number: 4,
    icon: CreditCard,
    title: "أقساط مريحة",
    description: "سدد أقساطك الشهرية براحة تامة بدون فوائد مخفية",
  },
]

export function HowItWorks() {
  return (
    <section id="installment" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            كيف يعمل التقسيط؟
          </h2>
          <p className="text-muted-foreground">4 خطوات بسيطة لامتلاك سيارة أحلامك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative text-center p-6 rounded-xl bg-card border border-border"
            >
              <div className="absolute -top-4 right-1/2 translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                {step.number}
              </div>
              <step.icon className="h-12 w-12 mx-auto mb-4 mt-4 text-primary" />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
