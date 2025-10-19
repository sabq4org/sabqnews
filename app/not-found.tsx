import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          الصفحة غير موجودة
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          عذرًا، الصفحة التي تبحث عنها غير موجودة.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}

