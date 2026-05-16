"use client"

import { useState } from "react"
import { Save, Phone, Mail, MapPin, Clock } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    showroomName: "Showroom Auto Dzair",
    phone: "0559 365 082",
    email: "autodzaircontact@gmail.com",
    address: "الجزائر العاصمة، شارع ديدوش مراد",
    workingHours: "السبت - الخميس: 8:00 - 17:00",
    closedDays: "الجمعة: مغلق",
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // In a real app, this would save to a database
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">الإعدادات</h1>
        <p className="text-muted-foreground mt-1">إدارة إعدادات المعرض</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Showroom Info */}
        <div className="bg-card p-6 rounded-xl border border-border space-y-6">
          <h3 className="text-lg font-semibold text-card-foreground">معلومات المعرض</h3>
          
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              اسم المعرض
            </label>
            <input
              type="text"
              value={settings.showroomName}
              onChange={(e) => setSettings({ ...settings, showroomName: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-card p-6 rounded-xl border border-border space-y-6">
          <h3 className="text-lg font-semibold text-card-foreground">معلومات الاتصال</h3>
          
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              رقم الهاتف
            </label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              العنوان
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
            />
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-card p-6 rounded-xl border border-border space-y-6">
          <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Clock className="h-5 w-5" />
            أوقات العمل
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              أيام العمل
            </label>
            <input
              type="text"
              value={settings.workingHours}
              onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              أيام الإغلاق
            </label>
            <input
              type="text"
              value={settings.closedDays}
              onChange={(e) => setSettings({ ...settings, closedDays: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          <Save className="h-5 w-5" />
          حفظ الإعدادات
        </button>

        {saved && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg">
            تم حفظ الإعدادات بنجاح
          </div>
        )}
      </div>
    </div>
  )
}
