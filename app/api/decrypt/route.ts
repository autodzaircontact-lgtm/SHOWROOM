import { NextResponse } from "next/server"
import { decryptPayload } from "@/lib/crypto"

export async function POST(request: Request) {
  try {
    const { payload } = await request.json()
    if (!payload) {
      return NextResponse.json({ success: false, message: "البحوث المطلوبة مفقودة" }, { status: 400 })
    }

    const decryptedText = decryptPayload(payload)
    const data = JSON.parse(decryptedText)

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error: any) {
    console.error("[Decrypt API Error]:", error)
    return NextResponse.json(
      { success: false, message: "فشل فك تشفير البيانات. قد يكون المفتاح غير صالح." },
      { status: 400 }
    )
  }
}
