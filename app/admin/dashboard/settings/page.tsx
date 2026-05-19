"use client"

import { useRouter } from "next/navigation"
import { ArrowRight, Shield, Key, Bell, Database, User } from "lucide-react"

export default function AdminSettingsPage() {
  const router = useRouter()

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
        >
          <ArrowRight className="h-5 w-5" />
          <span>العودة للوحة التحكم</span>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">الإعدادات</h1>
          <p className="text-muted-foreground mt-1">إعدادات لوحة تحكم المشرف</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Settings */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">الحساب</h2>
              <p className="text-sm text-muted-foreground">إعدادات حساب المشرف</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">اسم المستخدم</p>
              <p className="font-medium text-card-foreground">admin</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">الصلاحيات</p>
              <p className="font-medium text-card-foreground">مشرف كامل الصلاحيات</p>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">الأمان</h2>
              <p className="text-sm text-muted-foreground">إعدادات الأمان والحماية</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">تسجيل الدخول الآمن</p>
                <p className="text-sm text-muted-foreground">حماية الجلسة بكوكيز HTTP-Only</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                مفعل
              </span>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">انتهاء الجلسة</p>
                <p className="text-sm text-muted-foreground">الجلسة تنتهي بعد 24 ساعة</p>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                24 ساعة
              </span>
            </div>
          </div>
        </div>

        {/* Credentials Info */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Key className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">بيانات الدخول</h2>
              <p className="text-sm text-muted-foreground">معلومات تسجيل الدخول الافتراضية</p>
            </div>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 mb-2">
              <strong>ملاحظة:</strong> هذه بيانات تجريبية. في الإنتاج، استخدم متغيرات البيئة.
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-amber-700">اسم المستخدم: <code className="bg-amber-100 px-2 py-0.5 rounded">admin</code></p>
              <p className="text-amber-700">كلمة المرور: <code className="bg-amber-100 px-2 py-0.5 rounded">admin123</code></p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">الإشعارات</h2>
              <p className="text-sm text-muted-foreground">إعدادات التنبيهات والإشعارات</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">طلبات جديدة</p>
                <p className="text-sm text-muted-foreground">إشعار عند استلام طلب جديد</p>
              </div>
              <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                قريباً
              </span>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-card-foreground">تقارير يومية</p>
                <p className="text-sm text-muted-foreground">ملخص يومي للنشاط</p>
              </div>
              <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                قريباً
              </span>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Database className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">إدارة البيانات</h2>
              <p className="text-sm text-muted-foreground">تصدير واستيراد وإدارة البيانات</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-muted/50 rounded-lg text-right hover:bg-muted transition-colors">
              <p className="font-medium text-card-foreground">تصدير الطلبات</p>
              <p className="text-sm text-muted-foreground">تصدير جميع الطلبات كـ CSV</p>
            </button>
            <button className="p-4 bg-muted/50 rounded-lg text-right hover:bg-muted transition-colors">
              <p className="font-medium text-card-foreground">نسخ احتياطي</p>
              <p className="text-sm text-muted-foreground">إنشاء نسخة احتياطية</p>
            </button>
            <button 
              className="p-4 bg-red-50 border border-red-200 rounded-lg text-right hover:bg-red-100 transition-colors"
              onClick={() => {
                if (confirm("هل أنت متأكد من حذف جميع الطلبات؟ لا يمكن التراجع عن هذا الإجراء.")) {
                  localStorage.removeItem("registrations")
                  window.location.reload()
                }
              }}
            >
              <p className="font-medium text-red-700">حذف جميع الطلبات</p>
              <p className="text-sm text-red-600">إزالة جميع البيانات</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
