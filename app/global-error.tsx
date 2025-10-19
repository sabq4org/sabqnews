'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-red-600 mb-4">خطأ</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">حدث خطأ غير متوقع</h2>
            <p className="text-gray-600 mb-8">عذراً، حدث خطأ أثناء معالجة طلبك.</p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              المحاولة مرة أخرى
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

