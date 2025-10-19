# 📰 بوابة سبق الإخبارية

نظام إدارة محتوى متقدم للأخبار والمقالات، مدعوم بالذكاء الاصطناعي.

## ✨ الميزات الرئيسية

### 🎨 محرر المقالات المتقدم
- محرر نصوص غني (Rich Text Editor) مع دعم كامل للعربية
- تنسيق متقدم: عريض، مائل، تحته خط، عناوين، قوائم، اقتباسات
- إدراج الصور وفيديوهات YouTube والروابط
- محاذاة النص (يمين، وسط، يسار)
- التراجع والإعادة

### 🤖 مساعد الذكاء الاصطناعي
- **التلخيص التلقائي**: توليد ملخص موجز للمقال
- **اقتراح العناوين**: 5 عناوين بديلة جذابة
- **الكلمات المفتاحية**: استخراج أهم 10 كلمات مفتاحية
- **تحليل المشاعر**: تحديد النبرة العامة (إيجابي، سلبي، محايد)
- **تحسين SEO**: توليد عنوان ووصف محسّن لمحركات البحث
- **التحليل الشامل**: تحليل كامل للمقال مع اقتراحات التحسين

### 📱 الصفحات العامة
- **الصفحة الرئيسية**: عرض أحدث المقالات والفئات
- **صفحة المقال**: عرض كامل مع أزرار المشاركة
- **صفحة الفئة**: عرض جميع مقالات الفئة
- **صفحة البحث**: بحث متقدم في المقالات

### 📊 إدارة المقالات
- قائمة المقالات مع فلترة وبحث
- سير عمل كامل (مسودة → مراجعة → نشر)
- نظام المراجعات والملاحظات التحريرية
- جدولة النشر
- إدارة الوسوم والموضوعات

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 15.5.6 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **API**: tRPC
- **Rich Text**: Tiptap
- **AI**: OpenAI GPT-4
- **Package Manager**: pnpm

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+
- PostgreSQL
- pnpm

### التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/sabq4org/sabqnews.git
cd sabqnews

# تثبيت الحزم
pnpm install

# إعداد المتغيرات البيئية
cp .env.example .env.local
# ثم قم بتحرير .env.local وإضافة المفاتيح المطلوبة

# تهيئة قاعدة البيانات
pnpm db:push

# تشغيل الخادم
pnpm dev
```

افتح المتصفح على [http://localhost:3000](http://localhost:3000)

### المتغيرات البيئية المطلوبة

```env
# Database
POSTGRES_URL=postgresql://...

# OpenAI
OPENAI_API_KEY=sk-...

# JWT
JWT_SECRET=your-secret-key

# ElevenLabs (اختياري)
ELEVENLABS_API_KEY=sk_...
```

## 📖 التوثيق

للتوثيق الكامل، راجع:
- [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) - التوثيق الشامل
- [ARTICLES_API_DOCUMENTATION.md](./ARTICLES_API_DOCUMENTATION.md) - توثيق API المقالات

## 🏗️ بنية المشروع

```
sabq-news/
├── app/                    # Next.js App Router
│   ├── (public)/          # الصفحات العامة
│   ├── admin/             # لوحة التحكم
│   ├── articles/          # صفحات المقالات
│   ├── categories/        # صفحات الفئات
│   └── search/            # صفحة البحث
├── server/                # Backend API
│   └── routers/           # tRPC Routers
├── lib/                   # مكتبات مساعدة
└── drizzle/              # Database Schema
```

## 🎯 API Endpoints

### المقالات
- `articles.list` - قائمة المقالات
- `articles.getById` - تفاصيل مقال
- `articles.create` - إنشاء مقال
- `articles.update` - تحديث مقال
- `articles.delete` - حذف مقال
- `articles.changeStatus` - تغيير حالة المقال
- `articles.publish` - نشر مقال
- `articles.schedule` - جدولة مقال

### الذكاء الاصطناعي
- `ai.generateSummary` - توليد ملخص
- `ai.suggestTitles` - اقتراح عناوين
- `ai.suggestKeywords` - اقتراح كلمات مفتاحية
- `ai.analyzeSentiment` - تحليل المشاعر
- `ai.generateSEODescription` - توليد وصف SEO
- `ai.analyzeArticle` - تحليل شامل

## 🔐 المصادقة

النظام يستخدم JWT للمصادقة مع 4 أدوار:
- **admin**: صلاحيات كاملة
- **editor**: تحرير ومراجعة
- **author**: كتابة فقط
- **viewer**: قراءة فقط

## 📝 الحالات

المقالات تمر بالحالات التالية:
1. **draft** - مسودة
2. **review** - قيد المراجعة
3. **approved** - معتمد
4. **scheduled** - مجدول
5. **published** - منشور
6. **killed** - ملغي

## 🎨 التصميم

- دعم كامل للعربية (RTL)
- تصميم متجاوب مع جميع الأجهزة
- واجهة عصرية وسهلة الاستخدام
- ألوان متناسقة ومريحة للعين

## 🚢 النشر

### Vercel (موصى به)

```bash
# ربط المشروع مع Vercel
vercel

# النشر للإنتاج
vercel --prod
```

تأكد من إضافة جميع المتغيرات البيئية في إعدادات Vercel.

## 🤝 المساهمة

نرحب بجميع المساهمات! يمكنك:
- فتح Issues للمشاكل والاقتراحات
- إرسال Pull Requests للتحسينات
- مشاركة الأفكار والملاحظات

## 📄 الترخيص

جميع الحقوق محفوظة © 2025 سبق الإخبارية

## 🙏 شكر وتقدير

- [Next.js](https://nextjs.org/)
- [tRPC](https://trpc.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tiptap](https://tiptap.dev/)
- [OpenAI](https://openai.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**صُنع بـ ❤️ في المملكة العربية السعودية**

