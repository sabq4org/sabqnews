-- ========================================
-- إنشاء قاعدة بيانات بوابة سبق الذكية
-- ========================================

-- إنشاء الأنواع (Enums)
CREATE TYPE "public"."article_status" AS ENUM('draft', 'published', 'archived');
CREATE TYPE "public"."comment_status" AS ENUM('pending', 'approved', 'rejected');
CREATE TYPE "public"."notification_type" AS ENUM('info', 'warning', 'success', 'error');
CREATE TYPE "public"."user_role" AS ENUM('user', 'editor', 'admin');

-- إنشاء الجداول
CREATE TABLE "activity_logs" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(50),
	"entity_id" varchar(64),
	"details" json,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "ai_features" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"article_id" varchar(64) NOT NULL,
	"summary" text,
	"sentiment" varchar(50),
	"keywords" json,
	"suggested_titles" json,
	"related_topics" json,
	"fact_check_status" varchar(50),
	"readability_score" integer,
	"tone_analysis" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE "analytics" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"article_id" varchar(64) NOT NULL,
	"date" timestamp NOT NULL,
	"views" integer DEFAULT 0,
	"unique_views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"comments" integer DEFAULT 0,
	"avg_read_time" integer,
	"bounce_rate" integer
);

CREATE TABLE "articles" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"author_id" varchar(64) NOT NULL,
	"category_id" varchar(64),
	"status" "article_status" DEFAULT 'draft' NOT NULL,
	"featured_image" varchar(500),
	"tags" json,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"is_featured" boolean DEFAULT false,
	"is_breaking" boolean DEFAULT false,
	"published_at" timestamp,
	"seo_title" varchar(255),
	"seo_description" text,
	"seo_keywords" json,
	"reading_time" integer,
	"video_url" varchar(500),
	"audio_url" varchar(500),
	"source_url" varchar(500),
	"source_name" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);

CREATE TABLE "categories" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"icon_url" varchar(500),
	"color" varchar(50),
	"parent_id" varchar(64),
	"display_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);

CREATE TABLE "comments" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"article_id" varchar(64) NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"parent_id" varchar(64),
	"content" text NOT NULL,
	"status" "comment_status" DEFAULT 'pending' NOT NULL,
	"likes" integer DEFAULT 0,
	"is_edited" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE "media" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"filename" varchar(255) NOT NULL,
	"url" varchar(500) NOT NULL,
	"mime_type" varchar(100),
	"size" integer,
	"width" integer,
	"height" integer,
	"uploader_id" varchar(64) NOT NULL,
	"alt" text,
	"caption" text,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "notifications" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"type" "notification_type" DEFAULT 'info' NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE "users" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" text,
	"email" varchar(320),
	"login_method" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"avatar_url" varchar(500),
	"bio" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_signed_in" timestamp DEFAULT now()
);

-- إنشاء الفهارس (Indexes)
CREATE INDEX "activity_logs_user_idx" ON "activity_logs" USING btree ("user_id");
CREATE INDEX "activity_logs_action_idx" ON "activity_logs" USING btree ("action");
CREATE INDEX "activity_logs_entity_idx" ON "activity_logs" USING btree ("entity_type","entity_id");
CREATE INDEX "ai_features_article_idx" ON "ai_features" USING btree ("article_id");
CREATE INDEX "analytics_article_idx" ON "analytics" USING btree ("article_id");
CREATE INDEX "analytics_date_idx" ON "analytics" USING btree ("date");
CREATE INDEX "analytics_views_idx" ON "analytics" USING btree ("views");
CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");
CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_id");
CREATE INDEX "articles_status_idx" ON "articles" USING btree ("status");
CREATE INDEX "articles_published_idx" ON "articles" USING btree ("published_at");
CREATE INDEX "articles_featured_idx" ON "articles" USING btree ("is_featured");
CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");
CREATE INDEX "categories_active_idx" ON "categories" USING btree ("is_active");
CREATE INDEX "comments_article_idx" ON "comments" USING btree ("article_id");
CREATE INDEX "comments_user_idx" ON "comments" USING btree ("user_id");
CREATE INDEX "comments_parent_idx" ON "comments" USING btree ("parent_id");
CREATE INDEX "comments_status_idx" ON "comments" USING btree ("status");
CREATE INDEX "media_uploader_idx" ON "media" USING btree ("uploader_id");
CREATE INDEX "media_mime_idx" ON "media" USING btree ("mime_type");
CREATE INDEX "notifications_user_idx" ON "notifications" USING btree ("user_id");
CREATE INDEX "notifications_read_idx" ON "notifications" USING btree ("is_read");
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");

-- ========================================
-- إضافة بيانات تجريبية
-- ========================================

-- إضافة مستخدم تجريبي
INSERT INTO users (id, name, email, role, is_active) VALUES 
('admin123', 'محرر الأخبار', 'editor@sabq.org', 'admin', true);

-- إضافة التصنيفات
INSERT INTO categories (id, name, slug, display_order, is_active) VALUES 
('cat1', 'أخبار عاجلة', 'breaking-news', 1, true),
('cat2', 'اقتصاد', 'economy', 2, true),
('cat3', 'رياضة', 'sports', 3, true),
('cat4', 'تقنية', 'technology', 4, true),
('cat5', 'ثقافة', 'culture', 5, true),
('cat6', 'صحة', 'health', 6, true);

-- إضافة مقالات تجريبية
INSERT INTO articles (id, title, slug, content, excerpt, author_id, category_id, status, featured_image, views, likes, is_featured, published_at) VALUES
('art1', 'انطلاق مؤتمر التقنية السنوي بحضور أكثر من 5000 مشارك', 'tech-conference-2025', 'شهد المؤتمر السنوي للتقنية والاتصالات انطلاقة قوية بحضور متخصصين من مختلف دول العالم. تناول المؤتمر أحدث التطورات في مجالات الذكاء الاصطناعي والحوسبة السحابية والأمن السيبراني. وقد شارك في المؤتمر أكثر من 5000 مشارك من 50 دولة حول العالم، بما في ذلك خبراء تقنيون وباحثون ورواد أعمال. تضمن المؤتمر أكثر من 100 جلسة نقاشية وورشة عمل تفاعلية، بالإضافة إلى معرض تقني ضم أحدث الابتكارات والحلول التقنية. وأكد المتحدثون على أهمية الذكاء الاصطناعي في تحسين حياة الناس وتطوير الأعمال، مع التركيز على الاستخدام الأخلاقي والمسؤول للتقنية.', 'شهد المؤتمر السنوي للتقنية والاتصالات انطلاقة قوية بحضور متخصصين من مختلف دول العالم', 'admin123', 'cat4', 'published', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop', 1250, 342, false, NOW()),
('art2', 'توقعات بنمو الاقتصاد بنسبة 4% خلال العام الجاري', 'economy-growth-2025', 'أعلنت وزارة الاقتصاد عن توقعات إيجابية لنمو الاقتصاد الوطني خلال العام الحالي بنسبة 4%، مدعومة بزيادة الاستثمارات المحلية والأجنبية وتحسن الصادرات. وأشارت الوزارة في تقريرها السنوي إلى أن القطاعات غير النفطية شهدت نمواً ملحوظاً، خاصة في قطاعات التقنية والسياحة والخدمات اللوجستية. كما أكد وزير الاقتصاد أن الإصلاحات الاقتصادية التي تم تنفيذها خلال السنوات الماضية بدأت تؤتي ثمارها، مع تحسن مؤشرات الأداء الاقتصادي وزيادة فرص العمل. وتوقع الخبراء الاقتصاديون أن يستمر هذا النمو خلال السنوات القادمة، مع استمرار تنفيذ خطط التنمية الاقتصادية.', 'أعلنت وزارة الاقتصاد عن توقعات إيجابية لنمو الاقتصاد الوطني خلال العام الحالي', 'admin123', 'cat2', 'published', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop', 892, 156, false, NOW()),
('art3', 'الفريق الوطني يحقق فوزاً تاريخياً في البطولة الآسيوية', 'national-team-victory', 'حقق الفريق الوطني لكرة القدم فوزاً مثيراً ومستحقاً على نظيره الياباني بنتيجة 3-2 في مباراة مثيرة ضمن نصف نهائي البطولة الآسيوية، ليضمن تأهله للمباراة النهائية للمرة الأولى في تاريخه. جاءت المباراة في غاية الإثارة والتشويق، حيث تقدم المنتخب الياباني بهدفين في الشوط الأول، قبل أن يعود الفريق الوطني بقوة في الشوط الثاني ويسجل ثلاثة أهداف رائعة. وقد أشاد المدرب الوطني بأداء اللاعبين وروحهم القتالية، مؤكداً أن الفريق قادر على تحقيق اللقب. وسيواجه المنتخب الوطني في المباراة النهائية الفائز من مباراة كوريا الجنوبية وأستراليا.', 'حقق الفريق الوطني لكرة القدم فوزاً مثيراً على نظيره الياباني في نصف نهائي البطولة الآسيوية', 'admin123', 'cat3', 'published', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=500&fit=crop', 2156, 589, true, NOW()),
('art4', 'إطلاق تطبيق حكومي جديد لتسهيل الخدمات الإلكترونية', 'new-gov-app', 'أطلقت الحكومة تطبيقاً إلكترونياً جديداً يوفر جميع الخدمات الحكومية في مكان واحد بسهولة وأمان، مع واجهة مستخدم عصرية وبسيطة. يتيح التطبيق للمواطنين والمقيمين الوصول إلى أكثر من 200 خدمة حكومية، بما في ذلك تجديد الوثائق، دفع الفواتير، حجز المواعيد، والاستعلام عن المعاملات. ويتميز التطبيق بنظام أمان متقدم يحمي بيانات المستخدمين، مع إمكانية التحقق من الهوية باستخدام البصمة أو التعرف على الوجه. وأكدت الحكومة أن التطبيق يأتي ضمن جهودها لتحسين تجربة المستخدم وتسهيل الوصول إلى الخدمات الحكومية.', 'أطلقت الحكومة تطبيقاً جديداً يوفر جميع الخدمات الحكومية في مكان واحد بسهولة وأمان', 'admin123', 'cat4', 'published', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop', 654, 198, false, NOW()),
('art5', 'اكتشاف علمي جديد قد يغير مسار علاج الأمراض المزمنة', 'medical-breakthrough', 'توصل فريق من الباحثين في مركز الأبحاث الطبية إلى اكتشاف علمي جديد قد يغير مسار علاج الأمراض المزمنة، بعد سنوات من الأبحاث المكثفة والتجارب السريرية. يتعلق الاكتشاف بتطوير علاج جديد يعتمد على تقنية الجينات لعلاج الأمراض المزمنة مثل السكري وأمراض القلب والسرطان. وأظهرت التجارب الأولية نتائج واعدة جداً، حيث تمكن العلاج من تحسين حالة المرضى بشكل ملحوظ دون آثار جانبية خطيرة. وأكد الباحثون أن هذا الاكتشاف يمثل نقلة نوعية في مجال الطب الحديث، وقد يساهم في إنقاذ ملايين الأرواح حول العالم.', 'توصل فريق من الباحثين إلى اكتشاف طبي جديد قد يغير مسار علاج الأمراض المزمنة', 'admin123', 'cat6', 'published', 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=800&h=500&fit=crop', 1456, 412, false, NOW()),
('art6', 'مهرجان ثقافي عالمي يجمع فنانين من 50 دولة', 'global-cultural-festival', 'تستضيف العاصمة مهرجاناً ثقافياً عالمياً ضخماً يشارك فيه فنانون وموسيقيون وعازفون من جميع أنحاء العالم، في احتفالية فنية وثقافية تستمر لمدة أسبوع كامل. يتضمن المهرجان عروضاً موسيقية متنوعة، معارض فنية، ورش عمل تفاعلية، وندوات ثقافية تناقش مواضيع مختلفة تتعلق بالفن والثقافة. ويهدف المهرجان إلى تعزيز التبادل الثقافي بين الشعوب وإبراز التنوع الثقافي الغني. وقد أعرب المنظمون عن سعادتهم بالمشاركة الواسعة من مختلف دول العالم، مؤكدين أن المهرجان يمثل فرصة فريدة للتعرف على ثقافات مختلفة والاستمتاع بالفنون العالمية.', 'تستضيف العاصمة مهرجاناً ثقافياً عالمياً يشارك فيه فنانون وعازفون من جميع أنحاء العالم', 'admin123', 'cat5', 'published', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop', 789, 267, false, NOW());

