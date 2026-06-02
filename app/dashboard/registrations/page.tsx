"use client"

import { useEffect, useState } from "react"
import { cars, formatPrice, Registration } from "@/lib/data"
import { Search, Clock, CheckCircle, XCircle, Phone, CreditCard, User } from "lucide-react"

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("registrations")
    if (stored) {
      setRegistrations(JSON.parse(stored))
    }
  }, [])

  const updateStatus = (id: string, status: "pending" | "approved" | "rejected") => {
    const updated = registrations.map(r => 
      r.id === id ? { ...r, status } : r
    )
    setRegistrations(updated)
    localStorage.setItem("registrations", JSON.stringify(updated))
    if (selectedRegistration?.id === id) {
      setSelectedRegistration({ ...selectedRegistration, status })
    }
  }

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          reg.phone1.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || reg.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === "pending").length,
    approved: registrations.filter(r => r.status === "approved").length,
    rejected: registrations.filter(r => r.status === "rejected").length,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">التسجيلات</h1>
        <p className="text-muted-foreground mt-1">إدارة طلبات التسجيل</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">إجمالي التسجيلات</p>
          <p className="text-3xl font-bold text-card-foreground mt-1">{stats.total}</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-2 text-amber-500">
            <Clock className="h-5 w-5" />
            <p className="text-sm">قيد الانتظار</p>
          </div>
          <p className="text-3xl font-bold text-amber-500 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle className="h-5 w-5" />
            <p className="text-sm">مقبولة</p>
          </div>
          <p className="text-3xl font-bold text-green-500 mt-1">{stats.approved}</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-2 text-red-500">
            <XCircle className="h-5 w-5" />
            <p className="text-sm">مرفوضة</p>
          </div>
          <p className="text-3xl font-bold text-red-500 mt-1">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="البحث بالاسم أو رقم الهاتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-3 rounded-lg border border-input bg-background text-foreground"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-lg border border-input bg-background text-foreground"
        >
          <option value="all">جميع الحالات</option>
          <option value="pending">قيد الانتظار</option>
          <option value="approved">مقبولة</option>
          <option value="rejected">مرفوضة</option>
        </select>
      </div>

      {/* Content */}
      <div className="flex gap-6">
        {/* List */}
        <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden">
          {filteredRegistrations.length > 0 ? (
            <div className="divide-y divide-border">
              {filteredRegistrations.map(reg => {
                const car = cars.find(c => c.id === reg.selectedCarId)
                return (
                  <button
                    key={reg.id}
                    onClick={() => setSelectedRegistration(reg)}
                    className={`w-full p-4 text-right hover:bg-muted/50 transition-colors ${
                      selectedRegistration?.id === reg.id ? "bg-muted" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-card-foreground">{reg.fullName}</p>
                        <p className="text-sm text-muted-foreground">{car?.brand} {car?.model}</p>
                        <p className="text-sm text-muted-foreground mt-1">{reg.phone1}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        reg.status === "pending" 
                          ? "bg-amber-100 text-amber-700" 
                          : reg.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {reg.status === "pending" ? "قيد الانتظار" : reg.status === "approved" ? "مقبول" : "مرفوض"}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>لا توجد تسجيلات</p>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedRegistration && (
          <div className="w-96 bg-card rounded-xl border border-border p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-4">تفاصيل التسجيل</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">الاسم الكامل</p>
                    <p className="font-medium text-card-foreground">{selectedRegistration.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">رقم التعريف الوطني</p>
                    <p className="font-medium text-card-foreground">{selectedRegistration.nin}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                    <p className="font-medium text-card-foreground" dir="ltr">{selectedRegistration.phone1}</p>
                    {selectedRegistration.phone2 && (
                      <p className="text-sm text-muted-foreground" dir="ltr">{selectedRegistration.phone2}</p>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">البطاقة الذهبية</p>
                  <p className="font-medium text-card-foreground">****{selectedRegistration.cardLast8}</p>
                  <p className="text-sm text-muted-foreground">تنتهي: {selectedRegistration.cardExpiry}</p>
                </div>

                {(() => {
                  const car = cars.find(c => c.id === selectedRegistration.selectedCarId)
                  return car ? (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-1">السيارة المختارة</p>
                      <p className="font-bold text-card-foreground">{car.brand} {car.model}</p>
                      <p className="text-primary font-bold mt-1">{formatPrice(car.price)}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(car.monthlyPayment)}/شهر</p>
                    </div>
                  ) : null
                })()}

                <div>
                  <p className="text-sm text-muted-foreground mb-1">تقسيط سابق</p>
                  <p className="font-medium text-card-foreground">
                    {selectedRegistration.hasPreviousInstallment ? "نعم" : "لا"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-border space-y-3">
              <p className="text-sm font-medium text-card-foreground">تحديث الحالة</p>
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(selectedRegistration.id, "approved")}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  قبول
                </button>
                <button
                  onClick={() => updateStatus(selectedRegistration.id, "rejected")}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  رفض
                </button>
                <button
                  onClick={() => updateStatus(selectedRegistration.id, "pending")}
                  className="flex-1 bg-amber-500 text-white py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
                >
                  انتظار
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
