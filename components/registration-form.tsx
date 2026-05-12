"use client"

import { useState } from "react"
import { Car, cars, formatPrice } from "@/lib/data"
import { User, CreditCard, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"

interface RegistrationFormProps {
  selectedCar: Car | null
  onSelectCar: (car: Car) => void
}

export function RegistrationForm({ selectedCar, onSelectCar }: RegistrationFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    nin: "",
    cardLast8: "",
    cardExpiry: "",
    phone1: "",
    phone2: "",
    hasPreviousInstallment: null as boolean | null,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const isStep1Valid =
    formData.fullName &&
    formData.nin &&
    formData.cardLast8 &&
    formData.cardExpiry &&
    formData.phone1 &&
    formData.hasPreviousInstallment !== null

  const isStep2Valid = selectedCar !== null

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    
    const registration = {
      ...formData,
      selectedCarId: selectedCar?.id,
      createdAt: new Date().toISOString(),
      status: "pending",
    }
    
    try {
      // Send email notification
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registration),
      })
    } catch (error) {
      console.error("Error sending email:", error)
    }
    
    // Store in localStorage for dashboard
    const registrations = JSON.parse(localStorage.getItem("registrations") || "[]")
    registrations.push({ ...registration, id: Date.now().toString() })
    localStorage.setItem("registrations", JSON.stringify(registrations))
    
    setIsLoading(false)
    setIsSubmitted(true)
    setStep(3)
  }

  const steps = [
    { number: 1, label: "المعلومات", icon: User },
    { number: 2, label: "السيارة", icon: CreditCard },
    { number: 3, label: "التأكيد", icon: CheckCircle },
  ]

  return (
    <section id="register" className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">سجل الآن واحصل على سيارتك</h2>
          <p className="text-primary-foreground/80">إملأ الاستمارة وسنتواصل معك في أقرب وقت</p>
        </div>

        <div className="max-w-2xl mx-auto bg-card text-card-foreground rounded-2xl p-8 shadow-xl">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div
                  className={`flex items-center gap-2 ${
                    step >= s.number ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      step >= s.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s.number}
                  </div>
                  <span className="hidden sm:inline text-sm">{s.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-2 ${
                      step > s.number ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                معلوماتك الشخصية
              </h3>

              <div>
                <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">رقم التعريف الوطني (NIN) *</label>
                <input
                  type="text"
                  name="nin"
                  value={formData.nin}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                  placeholder="أدخل رقم التعريف الوطني"
                />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  البطاقة الذهبية
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      آخر 8 أرقام من البطاقة الذهبية *
                    </label>
                    <input
                      type="text"
                      name="cardLast8"
                      dir="ltr"
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 9)
                        handleChange({ target: { name: 'cardLast8', value: digitsOnly } })
                      }}
                      maxLength={19}
                      inputMode="numeric"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground font-mono text-lg tracking-wider"
                      placeholder="6280 703* **** ****"
                      value={(() => {
                        if (!formData.cardLast8) return ''
                        const digits = formData.cardLast8
                        const digit1 = digits[0] || '*'
                        const digits2_5 = digits.slice(1, 5).padEnd(4, '*')
                        const digits6_9 = digits.slice(5, 9).padEnd(4, '*')
                        return `6280 703${digit1} ${digits2_5} ${digits6_9}`
                      })()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">تاريخ انتهاء الصلاحية *</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                      placeholder="MM/YY"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  تستعمل البطاقة في فتح حساب التقسيط ل��حب الدفعات بالت��سيط في الوقت المحدد وبكل
                  شفافية.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">رقم الهاتف الأول *</label>
                  <input
                    type="tel"
                    name="phone1"
                    value={formData.phone1}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                    placeholder="0555 123 456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    رقم الهاتف الثاني (اختياري)
                  </label>
                  <input
                    type="tel"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                    placeholder="0770 000 000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  هل سبق لك الشراء بالتقسيط؟ *
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasPreviousInstallment: true })}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                      formData.hasPreviousInstallment === true
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    نعم
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasPreviousInstallment: false })}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                      formData.hasPreviousInstallment === false
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    لا
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                التالي
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Step 2: Car Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">اختر سيارتك</h3>

              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {cars.map((car) => (
                  <button
                    key={car.id}
                    onClick={() => onSelectCar(car)}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors text-right ${
                      selectedCar?.id === car.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="w-20 h-16 bg-muted rounded-lg flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold">
                        {car.brand} {car.model}
                      </p>
                      <p className="text-sm text-muted-foreground">{car.year}</p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-primary">{formatPrice(car.price)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(car.monthlyPayment)}/شهر
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-muted text-muted-foreground py-4 rounded-lg font-semibold hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronRight className="h-5 w-5" />
                  السابق
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isStep2Valid || isLoading}
                  className="flex-1 bg-primary text-primary-foreground py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "جاري التسجيل..." : "تأكيد التسجيل"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && isSubmitted && (
            <div className="text-center py-8">
              <CheckCircle className="h-20 w-20 mx-auto mb-6 text-green-500" />
              <h3 className="text-2xl font-bold mb-4">تم التسجيل بنجاح!</h3>
              <p className="text-muted-foreground mb-6">
                شكراً لك على تسجيلك. سيتم التواصل معك قريباً لإتمام الإجراءات.
              </p>
              {selectedCar && (
                <div className="bg-muted p-4 rounded-lg inline-block">
                  <p className="font-semibold">
                    {selectedCar.brand} {selectedCar.model}
                  </p>
                  <p className="text-primary font-bold">{formatPrice(selectedCar.price)}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
