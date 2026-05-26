import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: registrations, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase fetch error:", error)
      return NextResponse.json(
        { success: false, message: "حدث خطأ في جلب البيانات" },
        { status: 500 }
      )
    }

    // Transform snake_case to camelCase for frontend compatibility
    const transformedRegistrations = registrations.map((reg) => ({
      id: reg.id,
      fullName: reg.full_name,
      nin: reg.nin,
      cardLast8: reg.card_last8,
      cardExpiry: reg.card_expiry,
      phone1: reg.phone1,
      phone2: reg.phone2,
      hasPreviousInstallment: reg.has_previous_installment,
      selectedCarId: reg.selected_car_id,
      status: reg.status,
      createdAt: reg.created_at,
    }))

    return NextResponse.json({ 
      success: true,
      registrations: transformedRegistrations
    })
  } catch (error) {
    console.error("[v0] Registrations fetch error:", error)
    return NextResponse.json(
      { success: false, message: "حدث خطأ في جلب البيانات" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "معرف التسجيل والحالة مطلوبان" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    const { data: registration, error } = await supabase
      .from("registrations")
      .update({ status })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase update error:", error)
      return NextResponse.json(
        { success: false, message: "حدث خطأ في تحديث الحالة" },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: "تم تحديث الحالة بنجاح",
      registration
    })
  } catch (error) {
    console.error("[v0] Status update error:", error)
    return NextResponse.json(
      { success: false, message: "حدث خطأ في تحديث الحالة" },
      { status: 500 }
    )
  }
}
