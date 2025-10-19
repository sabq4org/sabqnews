# خارطة طريق نظام إدارة المحتوى التحريري - سبق الذكية

## 📋 نظرة عامة

هذا المستند يوضح البنية التحريرية الكاملة المطلوبة لنظام إدارة المحتوى (CMS) الخاص بـ "سبق الذكية"، بما في ذلك ما تم إنجازه والخطوات التالية المطلوبة.

---

## ✅ ما تم إنجازه

### 1. البنية التحتية لقاعدة البيانات

**الجداول المُنشأة:**
- ✅ `articles` - المقالات الأساسية (محدّث)
- ✅ `article_revisions` - الإصدارات والمراجعات
- ✅ `editorial_comments` - الملاحظات التحريرية
- ✅ `workflow_history` - سجل سير العمل
- ✅ `tags` - الوسوم
- ✅ `article_tags` - علاقة المقالات بالوسوم
- ✅ `topics` - الموضوعات الخاصة/السلاسل
- ✅ `article_topics` - علاقة المقالات بالموضوعات
- ✅ `categories` - التصنيفات (مع صور الهيرو)
- ✅ `media` - الوسائط
- ✅ `users` - المستخدمون

**التحديثات على جدول `articles`:**
- ✅ `content` - تم تحويله إلى JSONB لدعم Blocks Editor
- ✅ `status` - تم توسيعه ليشمل: draft, review, approved, scheduled, published, killed
- ✅ `scheduledAt` - تاريخ الجدولة
- ✅ `currentRevision` - رقم النسخة الحالية
- ✅ `lastEditedBy` - آخر محرر

### 2. نظام إدارة المستخدمين والصلاحيات
- ✅ صفحة إدارة المستخدمين `/admin/users`
- ✅ API endpoints للمستخدمين
- ✅ نظام الصلاحيات (user, writer, editor, admin)
- ✅ تسجيل الدخول والمصادقة

### 3. نظام إدارة التصنيفات
- ✅ صفحة إدارة التصنيفات `/admin/categories`
- ✅ API endpoints للتصنيفات
- ✅ رفع صور الهيرو (Vercel Blob)
- ✅ 10 تصنيفات رسمية جاهزة

### 4. نظام رفع الوسائط
- ✅ API endpoint `/api/upload` لرفع الصور
- ✅ تكامل Vercel Blob Storage
- ✅ دعم رفع صور حتى 5MB
- ✅ أسماء ملفات فريدة تلقائياً

---

## 🚧 المتطلبات المتبقية

### 1. API Endpoints للمقالات (أولوية عالية)

**المطلوب إنشاء `server/routers/articles.ts`:**

```typescript
// العمليات الأساسية
- articles.list({ search, status, categoryId, authorId, limit, offset })
- articles.getById({ id })
- articles.create({ title, slug, content, excerpt, categoryId, ... })
- articles.update({ id, ... })
- articles.delete({ id })

// سير العمل
- articles.changeStatus({ id, toStatus, comment })
- articles.getWorkflowHistory({ id })

// المراجعات
- articles.getRevisions({ id })
- articles.createRevision({ articleId, changes, editReason })
- articles.restoreRevision({ articleId, revisionNumber })

// الملاحظات التحريرية
- articles.addEditorialComment({ articleId, blockId, content })
- articles.getEditorialComments({ articleId })
- articles.resolveComment({ commentId })

// الجدولة
- articles.schedule({ id, scheduledAt })
- articles.publish({ id })

// الوسوم والموضوعات
- articles.addTag({ articleId, tagId })
- articles.removeTag({ articleId, tagId })
- articles.addTopic({ articleId, topicId })
- articles.removeTopic({ articleId, topicId })
```

### 2. محرر المقالات الاحترافي (أولوية عالية)

**المطلوب إنشاء `/app/admin/articles/editor/page.tsx`:**

**المكونات الأساسية:**
- Blocks Editor (باستخدام Editor.js أو Tiptap)
- أنواع Blocks:
  - فقرة (Paragraph)
  - عنوان (Heading)
  - صورة (Image) مع رفع
  - اقتباس (Quote)
  - فيديو (Video/Embed)
  - تضمينات سوشيال (Social Embeds)
  - جداول (Tables)
  - روابط داخلية (Internal Links)
  - قوائم (Lists)
  - كود (Code Block)

**الوظائف المطلوبة:**
- حفظ تلقائي كل 30 ثانية
- كشف التعارض عند التحرير المتزامن
- معاينة مباشرة (Live Preview)
- Checklist تحريرية قبل النشر:
  - عنوان مناسب (50-70 حرف)
  - مقدمة/ديب موجودة
  - صورة مميزة موجودة
  - تصنيف محدد
  - وسوم مضافة (3-5 وسوم)
  - SEO: عنوان، وصف، كلمات مفتاحية
  - مصدر محدد (إن وجد)

**الشريط الجانبي (Sidebar):**
- معلومات المقال (عنوان، slug، مقدمة)
- التصنيف والوسوم
- الصورة المميزة
- SEO
- الحالة والنشر
- الجدولة
- المصدر

### 3. صفحة قائمة المقالات (أولوية عالية)

**المطلوب إنشاء `/app/admin/articles/page.tsx`:**

**الوظائف:**
- عرض جميع المقالات في جدول
- فلترة حسب:
  - الحالة (draft, review, approved, scheduled, published, killed)
  - التصنيف
  - الكاتب
  - التاريخ
- بحث نصي
- إجراءات سريعة:
  - تحرير
  - معاينة
  - تغيير الحالة
  - حذف
  - نسخ

### 4. نظام إدارة الوسائط (DAM) (أولوية متوسطة)

**المطلوب إنشاء `/app/admin/media/page.tsx`:**

**الوظائف:**
- مكتبة وسائط قابلة للبحث
- رفع متعدد (Drag & Drop)
- معاينة الصور والفيديو
- تحرير البيانات الوصفية:
  - ALT (إلزامي)
  - Caption
  - حقوق/مصدر
- قص وتحجيم الصور
- أحجام متعددة تلقائية:
  - thumbnail (150x150)
  - medium (300x300)
  - large (1024x1024)
  - original
- فلترة حسب النوع (صور، فيديو، مستندات)
- حذف جماعي

### 5. نظام الوسوم والموضوعات (أولوية متوسطة)

**المطلوب إنشاء:**
- `/app/admin/tags/page.tsx` - إدارة الوسوم
- `/app/admin/topics/page.tsx` - إدارة الموضوعات/السلاسل

**API Endpoints:**
```typescript
// الوسوم
- tags.list()
- tags.create({ name, slug, description })
- tags.update({ id, ... })
- tags.delete({ id })
- tags.getMostUsed({ limit })

// الموضوعات
- topics.list()
- topics.create({ name, slug, description, coverImage })
- topics.update({ id, ... })
- topics.delete({ id })
- topics.getArticles({ topicId })
```

### 6. نظام النشر والجدولة (أولوية عالية)

**المطلوب:**
- Cron Job لنشر المقالات المجدولة
- Webhooks للواجهة العامة عند النشر
- إشعارات للفريق التحريري
- قنوات متعددة:
  - موقع (Next.js)
  - RSS Feed
  - AMP (اختياري)
  - إشعارات Push
  - X (Twitter)

**المطلوب إنشاء:**
- `/app/api/cron/publish-scheduled/route.ts` - Cron Job
- `/app/api/webhooks/article-published/route.ts` - Webhook
- `lib/publishers/` - مكتبات النشر لكل قناة

### 7. لوحة التحكم الرئيسية (أولوية متوسطة)

**المطلوب تحديث `/app/admin/page.tsx`:**

**الإحصائيات:**
- عدد المقالات حسب الحالة
- عدد المقالات المنشورة اليوم/هذا الأسبوع
- عدد المقالات المجدولة
- عدد الملاحظات التحريرية غير المحلولة
- أكثر الكتّاب نشاطاً
- أكثر التصنيفات استخداماً

**الإجراءات السريعة:**
- مقال جديد
- مقالات تحتاج مراجعة
- مقالات مجدولة
- ملاحظات تحريرية

### 8. نظام الإشعارات (أولوية منخفضة)

**المطلوب:**
- إشعارات في الوقت الفعلي (WebSocket أو Polling)
- أنواع الإشعارات:
  - مقال جديد يحتاج مراجعة
  - ملاحظة تحريرية جديدة
  - تغيير حالة مقال
  - مقال جاهز للنشر
  - خطأ في النشر

---

## 📦 الحزم المطلوبة

```bash
# محرر Blocks
pnpm add @editorjs/editorjs @editorjs/paragraph @editorjs/header @editorjs/image @editorjs/quote @editorjs/embed @editorjs/table @editorjs/list @editorjs/code

# أو بديل Tiptap
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link

# معالجة الصور
pnpm add sharp

# Cron Jobs
pnpm add node-cron

# WebSockets (للإشعارات)
pnpm add socket.io socket.io-client

# Diff للمراجعات
pnpm add diff

# RSS Feed
pnpm add rss
```

---

## 🎯 خطة التنفيذ المقترحة

### المرحلة 1: الأساسيات (1-2 أسابيع)
1. ✅ API endpoints للمقالات
2. ✅ صفحة قائمة المقالات
3. ✅ محرر المقالات الأساسي (بدون Blocks)
4. ✅ سير العمل الأساسي (draft → published)

### المرحلة 2: المحرر الاحترافي (1 أسبوع)
1. ✅ تكامل Blocks Editor
2. ✅ رفع الصور داخل المحرر
3. ✅ حفظ تلقائي
4. ✅ معاينة مباشرة

### المرحلة 3: سير العمل الكامل (1 أسبوع)
1. ✅ جميع حالات سير العمل
2. ✅ الملاحظات التحريرية
3. ✅ المراجعات والإصدارات
4. ✅ Checklist تحريرية

### المرحلة 4: إدارة الوسائط (1 أسبوع)
1. ✅ مكتبة الوسائط
2. ✅ رفع متعدد
3. ✅ قص وتحجيم
4. ✅ البيانات الوصفية

### المرحلة 5: النشر والجدولة (1 أسبوع)
1. ✅ Cron Job للنشر
2. ✅ Webhooks
3. ✅ قنوات متعددة
4. ✅ RSS Feed

### المرحلة 6: التحسينات (مستمر)
1. ✅ الإشعارات
2. ✅ التحليلات
3. ✅ الأداء
4. ✅ الأمان

---

## 📝 ملاحظات مهمة

### الأمان
- جميع API endpoints يجب أن تكون محمية بـ `protectedProcedure`
- التحقق من الصلاحيات حسب الدور:
  - `writer`: إنشاء وتحرير مقالاته فقط
  - `editor`: مراجعة وتحرير جميع المقالات في قسمه
  - `admin`: صلاحيات كاملة

### الأداء
- استخدام Pagination في جميع القوائم
- Caching للمقالات المنشورة
- Lazy Loading للصور
- Debouncing للبحث والحفظ التلقائي

### تجربة المستخدم
- تصميم متجاوب (Mobile-First)
- اختصارات لوحة المفاتيح
- Drag & Drop للصور
- معاينة مباشرة
- رسائل خطأ واضحة

---

## 🔗 الموارد المفيدة

- [Editor.js Documentation](https://editorjs.io/)
- [Tiptap Documentation](https://tiptap.dev/)
- [tRPC Documentation](https://trpc.io/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)

---

## 📞 الدعم

للأسئلة أو المساعدة، يرجى التواصل عبر:
- GitHub Issues: https://github.com/sabq4org/sabqnews/issues
- البريد الإلكتروني: support@sabq.org

---

**آخر تحديث:** 19 أكتوبر 2025
**الحالة:** قيد التطوير - المرحلة 1 مكتملة جزئياً
