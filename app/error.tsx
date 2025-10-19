'use client';

import { useEffect } from 'react';

export default function GlobalError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }; 
  reset: () => void;
}) {
  useEffect(() => {
    // طباعة الخطأ في console للتشخيص
    console.error('Global Error:', {
      message: error.message,
      digest: (error as any).digest,
      stack: error.stack,
      name: error.name
    });

    // يمكن إرسال الخطأ إلى خدمة logging مثل Sentry
    // fetch('/api/log-client-error', {
    //   method: 'POST',
    //   headers: {'content-type':'application/json'},
    //   body: JSON.stringify({ 
    //     message: error.message, 
    //     digest: (error as any).digest,
    //     stack: error.stack
    //   })
    // }).catch(() => {});
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              حدث خطأ في التطبيق
            </h1>
            <p className="text-gray-600 mb-4">
              نعتذر عن الإزعاج. حدث خطأ غير متوقع.
            </p>
            
            {/* عرض معلومات الخطأ للتشخيص */}
            <div className="bg-gray-100 rounded p-4 mb-4 text-left" dir="ltr">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Error:</strong> {error.message || 'Unknown error'}
              </p>
              {(error as any).digest && (
                <p className="text-sm text-gray-700">
                  <strong>Digest:</strong> {(error as any).digest}
                </p>
              )}
            </div>

            <button
              onClick={() => reset()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

