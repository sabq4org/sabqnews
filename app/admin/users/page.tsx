"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderOpen,
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  Key,
  UserCheck,
  UserX,
  X,
  Eye,
  Shield,
  Activity,
} from "lucide-react";

type UserRole = "user" | "writer" | "editor" | "admin";

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  bio: string;
  isActive: boolean;
}

interface EditUserFormData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio: string;
  isActive: boolean;
}

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "user",
    bio: "",
    isActive: true,
  });

  const [editFormData, setEditFormData] = useState<EditUserFormData>({
    id: "",
    name: "",
    email: "",
    role: "user",
    bio: "",
    isActive: true,
  });

  // Queries
  const { data: usersData, isLoading, refetch } = trpc.users.list.useQuery({
    search: searchQuery || undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
    isActive: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
    limit: 100,
    offset: 0,
  });

  const { data: stats } = trpc.users.stats.useQuery();

  // Mutations
  const createUser = trpc.users.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowAddModal(false);
      resetForm();
      alert("تم إضافة المستخدم بنجاح");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const updateUser = trpc.users.update.useMutation({
    onSuccess: () => {
      refetch();
      setShowEditModal(false);
      alert("تم تحديث المستخدم بنجاح");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const deleteUser = trpc.users.delete.useMutation({
    onSuccess: () => {
      refetch();
      setShowDeleteModal(false);
      setSelectedUserId(null);
      alert("تم حذف المستخدم بنجاح");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const resetPassword = trpc.users.resetPassword.useMutation({
    onSuccess: () => {
      refetch();
      setShowResetPasswordModal(false);
      setSelectedUserId(null);
      setNewPassword("");
      alert("تم إعادة تعيين كلمة المرور بنجاح");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      bio: "",
      isActive: true,
    });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    createUser.mutate(formData);
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser.mutate(editFormData);
  };

  const handleDeleteUser = () => {
    if (selectedUserId) {
      deleteUser.mutate({ id: selectedUserId });
    }
  };

  const handleResetPassword = () => {
    if (selectedUserId && newPassword) {
      resetPassword.mutate({ id: selectedUserId, newPassword });
    }
  };

  const openEditModal = (user: any) => {
    setEditFormData({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      role: user.role,
      bio: user.bio || "",
      isActive: user.isActive,
    });
    setShowEditModal(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "editor":
        return "bg-blue-100 text-blue-700";
      case "writer":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "مدير";
      case "editor":
        return "محرر";
      case "writer":
        return "كاتب";
      default:
        return "مستخدم";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl font-sans">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">إدارة المستخدمين</h2>
        <p className="text-gray-600">إدارة حسابات المستخدمين والصلاحيات</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-[#f0f0ef] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {stats?.total || 0}
          </div>
          <div className="text-sm text-gray-600">إجمالي المستخدمين</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#f0f0ef] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <UserCheck className="text-green-600" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {stats?.active || 0}
          </div>
          <div className="text-sm text-gray-600">مستخدمون نشطون</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#f0f0ef] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <Shield className="text-red-600" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {stats?.byRole.admin || 0}
          </div>
          <div className="text-sm text-gray-600">مديرون</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#f0f0ef] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Activity className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">
            {stats?.byRole.writer || 0}
          </div>
          <div className="text-sm text-gray-600">كتّاب</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 border border-[#f0f0ef] shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="البحث عن مستخدم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | "all")}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الأدوار</option>
              <option value="admin">مدير</option>
              <option value="editor">محرر</option>
              <option value="writer">كاتب</option>
              <option value="user">مستخدم</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <PlusCircle size={20} />
              <span>إضافة مستخدم</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#f0f0ef] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f0f0ef]">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الاسم</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">البريد الإلكتروني</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الدور</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">تاريخ الإنشاء</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersData?.users && usersData.users.length > 0 ? (
                usersData.users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{user.name || "بدون اسم"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="flex items-center gap-2 text-green-600">
                          <UserCheck size={16} />
                          <span className="text-sm font-semibold">نشط</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-red-600">
                          <UserX size={16} />
                          <span className="text-sm font-semibold">غير نشط</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString("ar-SA") : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="تعديل"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setShowResetPasswordModal(true);
                          }}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                          title="إعادة تعيين كلمة المرور"
                        >
                          <Key size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Users size={48} className="mx-auto mb-4 opacity-30" />
                    <p>لا توجد مستخدمون</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-gray-800">إضافة مستخدم جديد</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل الاسم الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="example@sabq.org"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="كلمة المرور (6 أحرف على الأقل)"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الدور</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">مستخدم</option>
                  <option value="writer">كاتب</option>
                  <option value="editor">محرر</option>
                  <option value="admin">مدير</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">نبذة تعريفية (اختياري)</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="نبذة مختصرة عن المستخدم"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                  حساب نشط
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createUser.isPending}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                >
                  {createUser.isPending ? "جاري الإضافة..." : "إضافة المستخدم"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-gray-800">تعديل بيانات المستخدم</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم الكامل</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الدور</label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as UserRole })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">مستخدم</option>
                  <option value="writer">كاتب</option>
                  <option value="editor">محرر</option>
                  <option value="admin">مدير</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">نبذة تعريفية</label>
                <textarea
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editFormData.isActive}
                  onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="editIsActive" className="text-sm font-semibold text-gray-700">
                  حساب نشط
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={updateUser.isPending}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                >
                  {updateUser.isPending ? "جاري التحديث..." : "حفظ التغييرات"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
              <p className="text-gray-600">هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteUser}
                disabled={deleteUser.isPending}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
              >
                {deleteUser.isPending ? "جاري الحذف..." : "نعم، احذف"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUserId(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">إعادة تعيين كلمة المرور</h3>
              <button
                onClick={() => {
                  setShowResetPasswordModal(false);
                  setSelectedUserId(null);
                  setNewPassword("");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور الجديدة</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل كلمة المرور الجديدة (6 أحرف على الأقل)"
                minLength={6}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleResetPassword}
                disabled={resetPassword.isPending || !newPassword || newPassword.length < 6}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
              >
                {resetPassword.isPending ? "جاري التحديث..." : "تحديث كلمة المرور"}
              </button>
              <button
                onClick={() => {
                  setShowResetPasswordModal(false);
                  setSelectedUserId(null);
                  setNewPassword("");
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

