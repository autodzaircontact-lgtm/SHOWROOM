import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Check, Calendar, Phone, CreditCard, User, ShieldAlert, ArrowRight, Printer } from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ConfirmationPage({ params }: PageProps) {
  const { id } = await params
  let submission = null

  try {
    const cookieStore = await cookies()
    const lastSubCookie = cookieStore.get("last_submission")
    
    if (lastSubCookie) {
      const parsed = JSON.parse(lastSubCookie.value)
      if (parsed && parsed.id === id) {
        submission = parsed
      }
    }
  } catch (e) {
    console.error("Cookie parsing failed in confirmation page", e)
  }

  // Fallback if cookie isn't available or ID mismatches
  if (!submission) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground" dir="rtl">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full text-center bg-card border border-border p-8 rounded-2xl shadow-xl">
            <ShieldAlert className="h-16 w-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
            <h1 className="text-2xl font-bold mb-2">عذراً، لم يتم العثور على الطلب</h1>
            <p className="text-muted-foreground mb-6">
              يبدو أن الجلسة قد انتهت أو أن رقم الطلب غير صحيح. يرجى التأكد من تقديم الطلب بشكل صحيح.
            </p>
            <Link 
              href="/#register" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <ArrowRight className="h-5 w-5" />
              الذهاب لصفحة التسجيل
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const { selectedCar } = submission
  const dateFormatted = new Date(submission.createdAt).toLocaleDateString("ar-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" dir="rtl">
      <Header />
      
      <main className="flex-grow py-12 md:py-20 px-4 bg-linear-to-b from-muted/50 to-background print:bg-white print:p-0">
        <div className="max-w-3xl mx-auto print:max-w-full">
          
          {/* Main Glassmorphic Receipt Container */}
          <div className="bg-card text-card-foreground rounded-3xl border border-border/80 shadow-2xl p-6 md:p-10 relative overflow-hidden transition-all duration-300 hover:shadow-primary/5 print:shadow-none print:border-none print:p-0">
            
            {/* Elegant Top Branding Ribbon (hidden on print) */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 print:hidden" />
            
            {/* Header Success Section */}
            <div className="text-center mb-8 md:mb-12 mt-4 print:mt-0">
              <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 scale-95 animate-pulse print:hidden">
                <Check className="h-10 w-10 stroke-[3]" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3">
                تم استلام طلبك بنجاح!
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto text-base">
                شكراً لثقتك بنا. لقد تم إرسال إشعار فوري بكافة التفاصيل إلى فريق المبيعات وسنتواصل معك قريباً.
              </p>
              
              <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-muted rounded-full text-sm font-semibold border border-border">
                <span className="text-muted-foreground">الرقم المرجعي للطلب:</span>
                <span className="text-primary font-mono select-all tracking-wider">{submission.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              
              {/* Customer Details Block */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold border-r-4 border-primary pr-3 flex items-center gap-2 text-foreground">
                  <User className="h-5 w-5 text-primary" />
                  معلومات العميل
                </h3>
                <div className="bg-muted/40 rounded-2xl p-5 border border-border/50 space-y-3.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">الاسم الكامل:</span>
                    <span className="font-semibold text-foreground">{submission.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">رقم التعريف الوطني:</span>
                    <span className="font-semibold text-foreground font-mono">{submission.nin}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">الهاتف الأساسي:</span>
                    <span className="font-semibold text-foreground font-mono" dir="ltr">{submission.phone1}</span>
                  </div>
                  {submission.phone2 && submission.phone2 !== "غير محدد" && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">الهاتف الاحتياطي:</span>
                      <span className="font-semibold text-foreground font-mono" dir="ltr">{submission.phone2}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">تاريخ تقديم الطلب:</span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {dateFormatted}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Card Details Block */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold border-r-4 border-primary pr-3 flex items-center gap-2 text-foreground">
                  <CreditCard className="h-5 w-5 text-primary" />
                  الضمان المالي (البطاقة الذهبية)
                </h3>
                <div className="bg-muted/40 rounded-2xl p-5 border border-border/50 space-y-3.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">رقم البطاقة الذهبية:</span>
                    <span className="font-semibold text-foreground font-mono tracking-wider">
                      **** **** **** {submission.cardLast8.slice(-4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">تاريخ انتهاء الصلاحية:</span>
                    <span className="font-semibold text-foreground font-mono">{submission.cardExpiry}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">شراء بالتقسيط سابق:</span>
                    <span className={`px-2 py-0.5 rounded-sm text-xs font-semibold ${
                      submission.hasPreviousInstallment 
                        ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" 
                        : "bg-green-500/10 text-green-500 border border-green-500/20"
                    }`}>
                      {submission.hasPreviousInstallment ? "نعم لديه" : "لا يوجد"}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      * لن يتم خصم أي مبالغ مالية حالياً. تُستخدم البطاقة كضمان قانوني لتفعيل نظام التقسيط لاحقاً عند استلام المركبة.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Selected Car Information Block */}
            {selectedCar && (
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-bold border-r-4 border-primary pr-3 text-foreground">
                  السيارة المختارة وتفاصيل الأقساط
                </h3>
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <span className="text-xs text-primary font-bold tracking-wider uppercase bg-primary/10 px-2 py-0.5 rounded-sm mb-2 inline-block">
                      تفاصيل المركبة
                    </span>
                    <h4 className="text-xl font-extrabold text-foreground">
                      {selectedCar.brand} {selectedCar.model}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">موديل سنة {selectedCar.year}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-6 md:gap-10 text-right md:text-left w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-border/40">
                    <div>
                      <span className="text-xs text-muted-foreground block">سعر السيارة الإجمالي</span>
                      <span className="text-lg font-extrabold text-foreground">
                        {new Intl.NumberFormat("ar-DZ").format(selectedCar.price)} دج
                      </span>
                    </div>
                    <div className="border-r md:border-r border-border/40 pr-6 sm:pr-0" />
                    <div>
                      <span className="text-xs text-primary font-semibold block">القسط الشهري الميسّر</span>
                      <span className="text-2xl font-black text-primary">
                        {new Intl.NumberFormat("ar-DZ").format(selectedCar.monthlyPayment)} دج <span className="text-xs font-normal text-muted-foreground">/ شهر</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps Guide Section */}
            <div className="bg-muted/30 border border-border/50 rounded-2xl p-6 mb-8 print:border-none">
              <h4 className="text-base font-bold text-foreground mb-4">📍 ما هي الخطوات القادمة؟</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>يقوم المستشار المالي بمراجعة طلبك للتأكد من استيفاء شروط الضمان خلال 24 ساعة.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>سنتصل بك هاتفياً عبر الرقم <strong className="text-foreground">{submission.phone1}</strong> لإتمام إجراءات التعاقد وحجز موعد المعاينة.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>يرجى الاحتفاظ برقم الطلب المرجعي لتسريع المعاملات عند زيارة صالة العرض.</span>
                </li>
              </ul>
            </div>

            {/* Print and Back Actions (hidden on print) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-border/80 print:hidden">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-muted-foreground px-6 py-3.5 rounded-xl font-semibold transition-colors order-2 sm:order-1"
              >
                <ArrowRight className="h-4 w-4" />
                العودة للرئيسية
              </Link>
              
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/10 transition-all hover:translate-y-[-1px] active:translate-y-0 order-1 sm:order-2"
              >
                <Printer className="h-4 w-4" />
                طباعة أو حفظ الوصل (PDF)
              </button>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
