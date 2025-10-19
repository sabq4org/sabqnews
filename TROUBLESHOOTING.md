# دليل حل المشاكل (Troubleshooting)

## مشكلة: خطأ في migrations على Vercel

### الخطأ:
```
ERROR: 42601: syntax error at or near "//"
LINE 1: // العمليات الأساسية
```

### السبب:
هذا الخطأ يحدث عندما يحاول Vercel تطبيق migrations على قاعدة البيانات أثناء عملية البناء. يبدو أن هناك ملف migration يحتوي على تعليقات بصيغة `//` (JavaScript-style comments) بدلاً من `--` (SQL-style comments).

### الحل:

#### الخيار 1: تعطيل تطبيق migrations التلقائي على Vercel
1. انتقل إلى إعدادات المشروع على Vercel.
2. في قسم "Build & Development Settings"، تأكد من عدم وجود أي أوامر في "Build Command" تقوم بتشغيل migrations.
3. إذا كان هناك أمر مثل `npm run db:push` أو `drizzle-kit migrate`، قم بإزالته.

#### الخيار 2: تطبيق migrations يدوياً
بما أننا نقوم بتطبيق migrations يدوياً على قاعدة البيانات باستخدام `psql`، فلا حاجة لتطبيقها تلقائياً على Vercel.

**الخطوات:**
1. تأكد من أن جميع migrations تم تطبيقها يدوياً على قاعدة البيانات باستخدام:
   ```bash
   psql "$DATABASE_URL" < drizzle/migrations/add_editorial_structure.sql
   ```
2. تأكد من عدم وجود أي إعدادات في Vercel تقوم بتشغيل migrations تلقائياً.

#### الخيار 3: التحقق من ملفات migrations
إذا كان هناك ملفات migrations تم إنشاؤها تلقائياً بواسطة Drizzle Kit، قم بفحصها والتأكد من أنها لا تحتوي على تعليقات بصيغة `//`.

**الخطوات:**
1. افحص جميع ملفات migrations في `drizzle/migrations/`.
2. تأكد من أن جميع التعليقات تستخدم `--` بدلاً من `//`.
3. إذا وجدت أي تعليقات بصيغة `//`، قم باستبدالها بـ `--`.

---

## مشكلة: صفحة لوحة القيادة (Dashboard) لا تعمل

### الخطأ:
"جاري التحميل..." بشكل مستمر.

### السبب:
`trpc.articles.stats.useQuery()` يحاول جلب بيانات إحصائيات المقالات، ولكن `trpc.articles.stats` غير موجود في الـ API.

### الحل:
تم إنشاء `server/routers/articles.ts` مع `articles.stats` endpoint. تأكد من أن:
1. ملف `server/routers/articles.ts` موجود ويحتوي على `stats` endpoint.
2. `articlesRouter` تم دمجه في `server/routers/_app.ts`.
3. تم رفع التحديثات على GitHub ونشرها على Vercel.

---

## مشكلة: تصميم لوحة التحكم غير مناسب للهواتف الذكية

### الأعراض:
- القائمة الجانبية ثابتة في منتصف الشاشة.
- الهوامش الجانبية كبيرة جداً.
- القائمة لا تختفي تلقائياً بعد اختيار عنصر.

### الحل:
تم إعادة تصميم واجهة لوحة التحكم بالكامل:
1. إنشاء `app/admin/components/AdminHeader.tsx` - شريط علوي احترافي.
2. إنشاء `app/admin/components/AdminSidebar.tsx` - قائمة جانبية محسّنة تختفي تلقائياً على الجوال.
3. تحديث `app/admin/layout.tsx` - استخدام المكونات الجديدة.
4. تقليل الهوامش الجانبية لزيادة المساحة المتاحة للمحتوى.

---

## مشكلة: رفع صور الهيرو لا يعمل

### الأعراض:
- عند رفع صورة هيرو وحفظ التغييرات، تظهر علامة استفهام بدلاً من الصورة.
- خطأ: `Vercel Blob: This blob already exists, use allowOverwrite: true if you want to overwrite it. Or addRandomSuffix: true to generate a unique filename.`

### الحل:
تم تكامل Vercel Blob Storage:
1. تثبيت `@vercel/blob` package.
2. إنشاء `/api/upload` endpoint لرفع الصور.
3. إضافة `addRandomSuffix: true` لضمان أسماء ملفات فريدة.
4. تحديث `app/admin/categories/page.tsx` لاستخدام API الجديد.

تأكد من أن `BLOB_READ_WRITE_TOKEN` موجود في متغيرات البيئة على Vercel.

---

## مشكلة: خطأ في البناء - `Property 'length' does not exist`

### الخطأ:
```
Type error: Property 'length' does not exist on type '{ articles: any; total: any; }'.
```

### السبب:
تم تغيير استجابة `trpc.articles.list.useQuery()` لتعيد كائناً يحتوي على `articles` (كمصفوفة) و `total`، بدلاً من المصفوفة مباشرة.

### الحل:
تم تعديل `app/page.tsx` لاستخدام `articles.articles.length` بدلاً من `articles.length`.

---

## الخطوات التالية

1. **تأكد من تطبيق جميع migrations على قاعدة البيانات.**
2. **تأكد من عدم وجود إعدادات في Vercel تقوم بتشغيل migrations تلقائياً.**
3. **تأكد من أن `BLOB_READ_WRITE_TOKEN` موجود في متغيرات البيئة على Vercel.**
4. **راجع سجلات النشر على Vercel لتحديد أي أخطاء جديدة.**

---

## معلومات الاتصال

إذا واجهت أي مشاكل أخرى، يرجى:
1. فحص سجلات النشر على Vercel.
2. التحقق من سجلات المتصفح (Console) للحصول على مزيد من التفاصيل.
3. مراجعة ملف `CMS_EDITORIAL_SYSTEM_ROADMAP.md` للحصول على نظرة عامة على البنية التحتية.

