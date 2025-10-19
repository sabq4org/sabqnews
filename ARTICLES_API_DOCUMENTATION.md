# توثيق API endpoints للمقالات

## نظرة عامة

تم تنفيذ جميع endpoints المطلوبة لإدارة المقالات في نظام سبق الإخبارية. جميع هذه الـ endpoints متاحة عبر tRPC Router في `server/routers/articles.ts`.

---

## العمليات الأساسية

### 1. قائمة المقالات (List Articles)
```typescript
articles.list({
  search?: string,
  status?: 'draft' | 'review' | 'approved' | 'scheduled' | 'published' | 'killed',
  categoryId?: string,
  authorId?: string,
  limit?: number,  // افتراضي: 10، الحد الأقصى: 100
  offset?: number  // افتراضي: 0
})
```
**الوصف:** جلب قائمة المقالات مع إمكانية البحث والفلترة  
**الصلاحيات:** admin, editor, writer  
**الإرجاع:** `{ articles: Article[], total: number }`

---

### 2. الحصول على مقال بالمعرف (Get Article by ID)
```typescript
articles.getById({ id: string })
```
**الوصف:** جلب تفاصيل مقال محدد  
**الصلاحيات:** admin, editor, writer  
**الإرجاع:** `Article`

---

### 3. إنشاء مقال جديد (Create Article)
```typescript
articles.create({
  title: string,
  slug: string,
  content: any,  // Blocks Editor content
  excerpt?: string,
  categoryId?: string,
  featuredImage?: string,
  tags?: string[],
  seoTitle?: string,
  seoDescription?: string,
  seoKeywords?: string[],
  videoUrl?: string,
  audioUrl?: string,
  sourceUrl?: string,
  sourceName?: string
})
```
**الوصف:** إنشاء مقال جديد بحالة "draft"  
**الصلاحيات:** admin, editor, writer  
**الإرجاع:** `Article`  
**ملاحظات:**
- يتم إنشاء أول مراجعة (revision) تلقائياً
- يتم تعيين المؤلف (authorId) تلقائياً من المستخدم الحالي

---

### 4. تحديث مقال (Update Article)
```typescript
articles.update({
  id: string,
  title?: string,
  slug?: string,
  content?: any,
  excerpt?: string,
  categoryId?: string,
  featuredImage?: string,
  tags?: string[],
  seoTitle?: string,
  seoDescription?: string,
  seoKeywords?: string[],
  videoUrl?: string,
  audioUrl?: string,
  sourceUrl?: string,
  sourceName?: string,
  isFeatured?: boolean,
  isBreaking?: boolean
})
```
**الوصف:** تحديث مقال موجود  
**الصلاحيات:** 
- admin, editor: يمكنهم تحديث أي مقال
- writer: يمكنه تحديث مقالاته فقط  
**الإرجاع:** `Article`  
**ملاحظات:**
- يتم إنشاء مراجعة جديدة تلقائياً عند تحديث المحتوى أو العنوان
- يتم زيادة رقم المراجعة (currentRevision) تلقائياً

---

### 5. حذف مقال (Delete Article)
```typescript
articles.delete({ id: string })
```
**الوصف:** حذف مقال نهائياً  
**الصلاحيات:** admin, editor  
**الإرجاع:** `{ success: boolean, message: string }`

---

## سير العمل (Workflow)

### 6. تغيير حالة المقال (Change Status)
```typescript
articles.changeStatus({
  id: string,
  toStatus: 'draft' | 'review' | 'approved' | 'scheduled' | 'published' | 'killed',
  comment?: string
})
```
**الوصف:** تغيير حالة المقال في سير العمل  
**الصلاحيات:** admin, editor  
**الإرجاع:** `Article`  
**ملاحظات:**
- يتم تسجيل التغيير في جدول `workflow_history`
- عند النشر (published)، يتم تعيين `publishedAt` تلقائياً

---

### 7. سجل سير العمل (Workflow History)
```typescript
articles.getWorkflowHistory({ id: string })
```
**الوصف:** جلب سجل تغييرات حالة المقال  
**الصلاحيات:** admin, editor, writer  
**الإرجاع:** `WorkflowHistory[]`

---

## المراجعات (Revisions)

### 8. قائمة المراجعات (Get Revisions)
```typescript
articles.getRevisions({ id: string })
```
**الوصف:** جلب جميع مراجعات المقال  
**الصلاحيات:** admin, editor, writer  
**الإرجاع:** `ArticleRevision[]`

---

### 9. إنشاء مراجعة (Create Revision)
```typescript
articles.createRevision({
  articleId: string,
  changes: any,
  editReason: string
})
```
**الوصف:** إنشاء مراجعة جديدة للمقال  
**الصلاحيات:** admin, editor, writer  
**الإرجاع:** `ArticleRevision`  
**ملاحظات:**
- يتم حفظ نسخة من المحتوى الحالي
- يتم تحديث `currentRevision` في جدول المقالات

---

### 10. استعادة مراجعة (Restore Revision)
```typescript
articles.restoreRevision({
  articleId: string,
  revisionNumber: number
})
```
**الوصف:** استعادة محتوى المقال من مراجعة سابقة  
**الصلاحيات:** admin, editor  
**الإرجاع:** `Article`

---

## الملاحظات التحريرية (Editorial Comments)

### 11. إضافة ملاحظة تحريرية (Add Editorial Comment)
```typescript
articles.addEditorialComment({
  articleId: string,
  blockId?: string,  // معرف الفقرة في Blocks Editor
  content: string
})
```
**الوصف:** إضافة ملاحظة تحريرية على المقال أو على فقرة محددة  
**الصلاحيات:** admin, editor  
**الإرجاع:** `EditorialComment`

---

### 12. قائمة الملاحظات التحريرية (Get Editorial Comments)
```typescript
articles.getEditorialComments({ articleId: string })
```
**الوصف:** جلب جميع الملاحظات التحريرية للمقال  
**الصلاحيات:** admin, editor, writer  
**الإرجاع:** `EditorialComment[]`

---

### 13. حل ملاحظة (Resolve Comment)
```typescript
articles.resolveComment({ commentId: string })
```
**الوصف:** وضع علامة "محلول" على ملاحظة تحريرية  
**الصلاحيات:** admin, editor  
**الإرجاع:** `EditorialComment`

---

## الجدولة والنشر

### 14. جدولة مقال (Schedule Article)
```typescript
articles.schedule({
  id: string,
  scheduledAt: Date
})
```
**الوصف:** جدولة المقال للنشر في وقت محدد  
**الصلاحيات:** admin, editor  
**الإرجاع:** `Article`  
**ملاحظات:**
- يتم تغيير الحالة إلى "scheduled"
- يتطلب تنفيذ cron job لنشر المقالات المجدولة تلقائياً

---

### 15. نشر مقال (Publish Article)
```typescript
articles.publish({ id: string })
```
**الوصف:** نشر المقال فوراً  
**الصلاحيات:** admin, editor  
**الإرجاع:** `Article`  
**ملاحظات:**
- يتم تغيير الحالة إلى "published"
- يتم تعيين `publishedAt` للوقت الحالي
- يتم تسجيل العملية في `workflow_history`

---

## الوسوم (Tags)

### 16. إضافة وسم (Add Tag)
```typescript
articles.addTag({
  articleId: string,
  tagId: string
})
```
**الوصف:** ربط وسم بالمقال  
**الصلاحيات:** admin, editor, writer  
**الإرجاع:** `{ success: boolean }`  
**ملاحظات:**
- يتم زيادة عداد الاستخدام (usageCount) للوسم تلقائياً

---

### 17. إزالة وسم (Remove Tag)
```typescript
articles.removeTag({
  articleId: string,
  tagId: string
})
```
**الوصف:** إزالة ربط وسم من المقال  
**الصلاحيات:** admin, editor, writer  
**الإرجاع:** `{ success: boolean }`  
**ملاحظات:**
- يتم تقليل عداد الاستخدام (usageCount) للوسم تلقائياً

---

## الإحصائيات

### 18. إحصائيات المقالات (Articles Stats)
```typescript
articles.stats()
```
**الوصف:** جلب إحصائيات عامة عن المقالات  
**الصلاحيات:** admin, editor, writer  
**الإرجاع:**
```typescript
{
  totalArticles: number,
  publishedArticles: number,
  draftArticles: number,
  reviewArticles: number,
  scheduledArticles: number,
  totalViews: number
}
```

---

## أمثلة الاستخدام

### في مكون React
```typescript
'use client';

import { trpc } from '@/lib/trpc';

export default function ArticlesList() {
  const { data, isLoading } = trpc.articles.list.useQuery({
    status: 'published',
    limit: 20,
    offset: 0
  });

  if (isLoading) return <div>جاري التحميل...</div>;

  return (
    <div>
      {data?.articles.map(article => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  );
}
```

### إنشاء مقال جديد
```typescript
const createArticle = trpc.articles.create.useMutation();

const handleSubmit = async (formData) => {
  try {
    const article = await createArticle.mutateAsync({
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      excerpt: formData.excerpt,
      categoryId: formData.categoryId,
      featuredImage: formData.featuredImage
    });
    console.log('تم إنشاء المقال:', article);
  } catch (error) {
    console.error('خطأ:', error);
  }
};
```

### تغيير حالة المقال
```typescript
const changeStatus = trpc.articles.changeStatus.useMutation();

const handleApprove = async (articleId: string) => {
  await changeStatus.mutateAsync({
    id: articleId,
    toStatus: 'approved',
    comment: 'تمت الموافقة على المقال'
  });
};
```

---

## ملاحظات مهمة

1. **المصادقة:** جميع endpoints تتطلب مصادقة (protected procedures)
2. **الصلاحيات:** يتم التحقق من صلاحيات المستخدم في كل endpoint
3. **المراجعات:** يتم إنشاء مراجعة تلقائياً عند الإنشاء والتحديث
4. **سير العمل:** يتم تسجيل جميع تغييرات الحالة في `workflow_history`
5. **الأمان:** يتم التحقق من ملكية المقال للكتّاب (writers)

---

## الخطوات التالية

- [ ] إضافة endpoints للموضوعات (Topics)
- [ ] تنفيذ نظام الإشعارات عند تغيير الحالة
- [ ] إضافة cron job لنشر المقالات المجدولة
- [ ] تنفيذ نظام تتبع المشاهدات (Views Tracking)
- [ ] إضافة endpoints لميزات الذكاء الاصطناعي

---

**آخر تحديث:** 19 أكتوبر 2025

