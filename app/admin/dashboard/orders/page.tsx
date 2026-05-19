"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { cars, formatPrice, Registration } from "@/lib/data"
import { 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Trash2,
  Edit,
  Eye,
  Phone,
  CreditCard,
  User,
  Calendar,
  Car,
  Filter,
  Download,
  MoreVertical,
  X,
  AlertTriangle
} from "lucide-react"

export default function OrdersPage() {
  const router = useRouter()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Registration | null>(null)
  const [editingOrder, setEditingOrder] = useState<Registration | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = () => {
    const stored = localStorage.getItem("registrations")
    if (stored) {
      setRegistrations(JSON.parse(stored))
    }
  }

  const saveRegistrations = (regs: Registration[]) => {
    localStorage.setItem("registrations", JSON.stringify(regs))
    setRegistrations(regs)
  }

  const updateStatus = (id: string, status: "pending" | "approved" | "rejected") => {
    const updated = registrations.map(r => 
      r.id === id ? { ...r, status } : r
    )
    saveRegistrations(updated)
    if (selectedOrder?.id === id) {
      setSelectedOrder({ ...selectedOrder, status })
    }
  }

  const deleteOrder = (id: string) => {
    const updated = registrations.filter(r => r.id !== id)
    saveRegistrations(updated)
    if (selectedOrder?.id === id) {
      setSelectedOrder(null)
    }
    setShowDeleteConfirm(null)
  }

  const updateOrder = (updatedOrder: Registration) => {
    const updated = registrations.map(r => 
      r.id === updatedOrder.id ? updatedOrder : r
    )
    saveRegistrations(updated)
    setEditingOrder(null)
    if (selectedOrder?.id === updatedOrder.id) {
      setSelectedOrder(updatedOrder)
    }
  }

  const exportOrders = () => {
    const csv = [
      ["الاسم", "رقم الهاتف", "السيارة", "السعر", "الحالة", "تاريخ التسجيل"].join(","),
      ...filteredRegistrations.map(reg => {
        const car = cars.find(c => c.id === reg.selectedCarId)
        return [
          reg.fullName,
          reg.phone1,
          `${car?.brand} ${car?.model}`,
          car?.price || 0,
          reg.status === "pending" ? "قيد الانتظار" : reg.status === "approved" ? "مقبول" : "مرفوض",
          new Date(reg.createdAt).toLocaleDateString("ar-DZ")
        ].join(",")
      })
    ].join("\n")
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          reg.phone1.includes(searchQuery) ||
                          reg.nin.includes(searchQuery)
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
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
          >
            <ArrowRight className="h-5 w-5" />
            <span>العودة للوحة التحكم</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">الطلبات</h1>
            <p className="text-muted-foreground mt-1">إدارة طلبات العملاء</p>
          </div>
        </div>
        <button
          onClick={exportOrders}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Download className="h-5 w-5" />
          <span>تصدير CSV</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
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
            placeholder="البحث بالاسم أو رقم الهاتف أو رقم التعريف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-3 rounded-lg border border-input bg-background text-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
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
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {filteredRegistrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">العميل</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">رقم الهاتف</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">السيارة</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">السعر</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">الحالة</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">التاريخ</th>
                  <th className="text-center py-4 px-4 text-sm font-medium text-muted-foreground">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map(reg => {
                  const car = cars.find(c => c.id === reg.selectedCarId)
                  return (
                    <tr key={reg.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground">{reg.fullName}</p>
                            <p className="text-xs text-muted-foreground">NIN: {reg.nin}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground" dir="ltr">{reg.phone1}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          {car?.brand} {car?.model}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-card-foreground">
                        {car ? formatPrice(car.price) : "-"}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          reg.status === "pending" 
                            ? "bg-amber-100 text-amber-700" 
                            : reg.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {reg.status === "pending" ? "قيد الانتظار" : reg.status === "approved" ? "مقبول" : "مرفوض"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground text-sm">
                        {new Date(reg.createdAt).toLocaleDateString("ar-DZ")}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(reg)
                              setShowDetailModal(true)
                            }}
                            className="p-2 rounded-lg hover:bg-muted transition-colors text-primary"
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingOrder(reg)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors text-blue-500"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(reg.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-destructive"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="relative group">
                            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            <div className="absolute left-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[150px]">
                              <button
                                onClick={() => updateStatus(reg.id, "approved")}
                                className="w-full text-right px-4 py-2 hover:bg-muted text-green-600 text-sm"
                              >
                                قبول الطلب
                              </button>
                              <button
                                onClick={() => updateStatus(reg.id, "pending")}
                                className="w-full text-right px-4 py-2 hover:bg-muted text-amber-600 text-sm"
                              >
                                تعليق الطلب
                              </button>
                              <button
                                onClick={() => updateStatus(reg.id, "rejected")}
                                className="w-full text-right px-4 py-2 hover:bg-muted text-red-600 text-sm"
                              >
                                رفض الطلب
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>لا توجد طلبات</p>
            {searchQuery || statusFilter !== "all" ? (
              <button
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                }}
                className="mt-2 text-primary hover:underline text-sm"
              >
                مسح الفلاتر
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
              <h2 className="text-xl font-bold text-card-foreground">تفاصيل الطلب</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedOrder(null)
                }}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  معلومات العميل
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">الاسم الكامل</p>
                    <p className="font-medium text-card-foreground">{selectedOrder.fullName}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">رقم التعريف الوطني</p>
                    <p className="font-medium text-card-foreground">{selectedOrder.nin}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">رقم الهاتف الرئيسي</p>
                    <p className="font-medium text-card-foreground" dir="ltr">{selectedOrder.phone1}</p>
                  </div>
                  {selectedOrder.phone2 && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">رقم الهاتف الثانوي</p>
                      <p className="font-medium text-card-foreground" dir="ltr">{selectedOrder.phone2}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  معلومات البطاقة الذهبية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">آخر 8 أرقام</p>
                    <p className="font-medium text-card-foreground">****{selectedOrder.cardLast8}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">تاريخ الانتهاء</p>
                    <p className="font-medium text-card-foreground">{selectedOrder.cardExpiry}</p>
                  </div>
                </div>
              </div>

              {/* Car Info */}
              {(() => {
                const car = cars.find(c => c.id === selectedOrder.selectedCarId)
                return car ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      السيارة المختارة
                    </h3>
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">العلامة والموديل</p>
                          <p className="font-bold text-card-foreground">{car.brand} {car.model}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">السعر الإجمالي</p>
                          <p className="font-bold text-primary">{formatPrice(car.price)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">القسط الشهري</p>
                          <p className="font-bold text-card-foreground">{formatPrice(car.monthlyPayment)}/شهر</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">السنة</p>
                          <p className="font-medium text-card-foreground">{car.year}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">نوع الوقود</p>
                          <p className="font-medium text-card-foreground">{car.fuelType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">ناقل الحركة</p>
                          <p className="font-medium text-card-foreground">{car.transmission}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null
              })()}

              {/* Additional Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  معلومات إضافية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">تقسيط سابق</p>
                    <p className="font-medium text-card-foreground">
                      {selectedOrder.hasPreviousInstallment ? "نعم" : "لا"}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">تاريخ التسجيل</p>
                    <p className="font-medium text-card-foreground">
                      {new Date(selectedOrder.createdAt).toLocaleDateString("ar-DZ", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-card-foreground mb-3">تحديث حالة الطلب</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      updateStatus(selectedOrder.id, "approved")
                      setShowDetailModal(false)
                    }}
                    className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    قبول
                  </button>
                  <button
                    onClick={() => {
                      updateStatus(selectedOrder.id, "rejected")
                      setShowDetailModal(false)
                    }}
                    className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="h-5 w-5" />
                    رفض
                  </button>
                  <button
                    onClick={() => {
                      updateStatus(selectedOrder.id, "pending")
                      setShowDetailModal(false)
                    }}
                    className="flex-1 bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Clock className="h-5 w-5" />
                    تعليق
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={updateOrder}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-md p-6">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">تأكيد الحذف</h3>
              <p className="text-muted-foreground mb-6">
                هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-lg border border-border hover:bg-muted transition-colors font-medium"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => deleteOrder(showDeleteConfirm)}
                  className="flex-1 py-3 rounded-lg bg-destructive text-white hover:bg-destructive/90 transition-colors font-medium"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Edit Order Modal Component
function EditOrderModal({ 
  order, 
  onClose, 
  onSave 
}: { 
  order: Registration
  onClose: () => void
  onSave: (order: Registration) => void 
}) {
  const [formData, setFormData] = useState({
    fullName: order.fullName,
    phone1: order.phone1,
    phone2: order.phone2 || "",
    nin: order.nin,
    cardLast8: order.cardLast8,
    cardExpiry: order.cardExpiry,
    selectedCarId: order.selectedCarId,
    hasPreviousInstallment: order.hasPreviousInstallment,
    status: order.status,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...order,
      ...formData,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
          <h2 className="text-xl font-bold text-card-foreground">تعديل الطلب</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                الاسم الكامل
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                رقم التعريف الوطني
              </label>
              <input
                type="text"
                value={formData.nin}
                onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                رقم الهاتف الرئيسي
              </label>
              <input
                type="tel"
                value={formData.phone1}
                onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                required
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                رقم الهاتف الثانوي (اختياري)
              </label>
              <input
                type="tel"
                value={formData.phone2}
                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                آخر 8 أرقام من البطاقة
              </label>
              <input
                type="text"
                value={formData.cardLast8}
                onChange={(e) => setFormData({ ...formData, cardLast8: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                تاريخ انتهاء البطاقة
              </label>
              <input
                type="text"
                value={formData.cardExpiry}
                onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                placeholder="MM/YY"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                السيارة المختارة
              </label>
              <select
                value={formData.selectedCarId}
                onChange={(e) => setFormData({ ...formData, selectedCarId: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                required
              >
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.brand} {car.model} - {formatPrice(car.price)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                الحالة
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Registration["status"] })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground"
                required
              >
                <option value="pending">قيد الانتظار</option>
                <option value="approved">مقبول</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasPreviousInstallment"
              checked={formData.hasPreviousInstallment}
              onChange={(e) => setFormData({ ...formData, hasPreviousInstallment: e.target.checked })}
              className="h-4 w-4 rounded border-input"
            />
            <label htmlFor="hasPreviousInstallment" className="text-sm text-card-foreground">
              لديه تقسيط سابق
            </label>
          </div>
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-border hover:bg-muted transition-colors font-medium"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            >
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
