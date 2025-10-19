"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-900">بوابة سبق الذكية</h1>
          <p className="text-gray-600 mt-2">صحيفة سبق الإلكترونية - نسخة Next.js</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              مرحباً بك في بوابة سبق الذكية
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              بوابة إعلامية ذكية مبنية بأحدث التقنيات (Next.js 15 + tRPC + TypeScript)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-2">🚀 Server-Side Rendering</h3>
                <p className="text-sm text-blue-700">أداء عالي وSEO محسّن</p>
              </div>
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h3 className="font-bold text-indigo-900 mb-2">🔒 Type-Safe API</h3>
                <p className="text-sm text-indigo-700">tRPC مع TypeScript الكامل</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-bold text-purple-900 mb-2">🤖 الذكاء الاصطناعي</h3>
                <p className="text-sm text-purple-700">تحليل وتلخيص تلقائي</p>
              </div>
              <div className="bg-pink-50 p-6 rounded-lg">
                <h3 className="font-bold text-pink-900 mb-2">📱 متجاوب</h3>
                <p className="text-sm text-pink-700">يعمل على جميع الأجهزة</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 font-semibold">
                جاري إعداد قاعدة البيانات...
              </p>
              <p className="text-sm text-gray-600">
                يتم حالياً ربط قاعدة البيانات. يرجى المحاولة لاحقاً.
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              📊 <strong>الحالة:</strong> النسخة الأولية من البوابة جاهزة للاختبار
            </p>
            <p className="text-sm text-gray-500">
              آخر تحديث: {new Date().toLocaleDateString("ar-SA")}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">بوابة سبق الذكية</h3>
            <p className="text-gray-400">
              © 2025 بوابة سبق الذكية. جميع الحقوق محفوظة.
            </p>
            <p className="text-gray-500 text-sm mt-4">
              مبنية بـ Next.js 15 | Vercel | Supabase
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

