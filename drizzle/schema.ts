import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * مخطط قاعدة البيانات لبوابة سبق الذكية
 * يتضمن جميع الجداول اللازمة لنظام إدارة المحتوى الإعلامي
 */

// ============================================
// جدول المستخدمين (Users)
// ============================================
export const users = mysqlTable(
  "users",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "editor", "admin"]).default("user").notNull(),
    avatarUrl: varchar("avatarUrl", { length: 500 }),
    bio: text("bio"),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow(),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    roleIdx: index("role_idx").on(table.role),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// جدول التصنيفات (Categories)
// ============================================
export const categories = mysqlTable(
  "categories",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    iconUrl: varchar("iconUrl", { length: 500 }),
    color: varchar("color", { length: 50 }),
    parentId: varchar("parentId", { length: 64 }),
    displayOrder: int("displayOrder").default(0),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("slug_idx").on(table.slug),
    parentIdx: index("parent_idx").on(table.parentId),
    activeIdx: index("active_idx").on(table.isActive),
  })
);

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// علاقات التصنيفات (للتصنيفات الفرعية)
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "subcategories",
  }),
  children: many(categories, { relationName: "subcategories" }),
  articles: many(articles),
}));

// ============================================
// جدول المقالات (Articles)
// ============================================
export const articles = mysqlTable(
  "articles",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).notNull().unique(),
    content: text("content").notNull(), // محتوى المقال بصيغة HTML أو JSON
    excerpt: text("excerpt"),
    authorId: varchar("authorId", { length: 64 }).notNull(),
    categoryId: varchar("categoryId", { length: 64 }),
    status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
    featuredImage: varchar("featuredImage", { length: 500 }),
    featuredImageAlt: varchar("featuredImageAlt", { length: 255 }),
    tags: json("tags").$type<string[]>(),
    publishedAt: timestamp("publishedAt"),
    scheduledFor: timestamp("scheduledFor"),
    views: int("views").default(0),
    likes: int("likes").default(0),
    shares: int("shares").default(0),
    // حقول SEO
    seoTitle: varchar("seoTitle", { length: 255 }),
    seoDescription: text("seoDescription"),
    seoKeywords: text("seoKeywords"),
    // حقول إضافية
    isFeatured: boolean("isFeatured").default(false),
    isBreaking: boolean("isBreaking").default(false),
    allowComments: boolean("allowComments").default(true),
    readingTime: int("readingTime"), // بالدقائق
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("article_slug_idx").on(table.slug),
    authorIdx: index("author_idx").on(table.authorId),
    categoryIdx: index("category_idx").on(table.categoryId),
    statusIdx: index("status_idx").on(table.status),
    publishedIdx: index("published_idx").on(table.publishedAt),
    featuredIdx: index("featured_idx").on(table.isFeatured),
  })
);

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

// علاقات المقالات
export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
  aiFeatures: one(aiFeatures),
  comments: many(comments),
}));

// ============================================
// جدول مميزات الذكاء الاصطناعي (AI Features)
// ============================================
export const aiFeatures = mysqlTable(
  "ai_features",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    articleId: varchar("articleId", { length: 64 }).notNull().unique(),
    // الملخص التلقائي
    summary: text("summary"),
    // عناوين مقترحة
    suggestedTitles: json("suggestedTitles").$type<string[]>(),
    // تحليل المشاعر
    sentiment: mysqlEnum("sentiment", ["positive", "negative", "neutral"]),
    sentimentScore: int("sentimentScore"), // من 0 إلى 100
    // كلمات مفتاحية مقترحة
    keywords: json("keywords").$type<string[]>(),
    // درجة سهولة القراءة
    readabilityScore: int("readabilityScore"), // من 0 إلى 100
    // فحص الانتحال
    plagiarismCheck: json("plagiarismCheck").$type<{
      checked: boolean;
      score: number;
      sources?: string[];
    }>(),
    // اقتراحات تحسين
    suggestions: json("suggestions").$type<string[]>(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  },
  (table) => ({
    articleIdx: uniqueIndex("article_ai_idx").on(table.articleId),
  })
);

export type AiFeature = typeof aiFeatures.$inferSelect;
export type InsertAiFeature = typeof aiFeatures.$inferInsert;

// علاقات مميزات الذكاء الاصطناعي
export const aiFeaturesRelations = relations(aiFeatures, ({ one }) => ({
  article: one(articles, {
    fields: [aiFeatures.articleId],
    references: [articles.id],
  }),
}));

// ============================================
// جدول التعليقات (Comments)
// ============================================
export const comments = mysqlTable(
  "comments",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    articleId: varchar("articleId", { length: 64 }).notNull(),
    userId: varchar("userId", { length: 64 }),
    authorName: varchar("authorName", { length: 255 }),
    authorEmail: varchar("authorEmail", { length: 320 }),
    content: text("content").notNull(),
    parentId: varchar("parentId", { length: 64 }), // للردود
    status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
    isApproved: boolean("isApproved").default(false),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
  },
  (table) => ({
    articleIdx: index("comment_article_idx").on(table.articleId),
    userIdx: index("comment_user_idx").on(table.userId),
    parentIdx: index("comment_parent_idx").on(table.parentId),
    statusIdx: index("comment_status_idx").on(table.status),
  })
);

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

// علاقات التعليقات
export const commentsRelations = relations(comments, ({ one, many }) => ({
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "replies",
  }),
  replies: many(comments, { relationName: "replies" }),
}));

// ============================================
// جدول الوسائط (Media)
// ============================================
export const media = mysqlTable(
  "media",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    fileName: varchar("fileName", { length: 255 }).notNull(),
    fileUrl: varchar("fileUrl", { length: 500 }).notNull(),
    fileType: varchar("fileType", { length: 100 }).notNull(), // image/jpeg, video/mp4, etc.
    fileSize: int("fileSize").notNull(), // بالبايت
    width: int("width"),
    height: int("height"),
    altText: varchar("altText", { length: 255 }),
    caption: text("caption"),
    uploadedBy: varchar("uploadedBy", { length: 64 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    uploaderIdx: index("uploader_idx").on(table.uploadedBy),
    typeIdx: index("type_idx").on(table.fileType),
  })
);

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

// علاقات الوسائط
export const mediaRelations = relations(media, ({ one }) => ({
  uploader: one(users, {
    fields: [media.uploadedBy],
    references: [users.id],
  }),
}));

// ============================================
// جدول الإشعارات (Notifications)
// ============================================
export const notifications = mysqlTable(
  "notifications",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("userId", { length: 64 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    type: mysqlEnum("type", ["info", "success", "warning", "error"]).default("info").notNull(),
    isRead: boolean("isRead").default(false),
    link: varchar("link", { length: 500 }),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    userIdx: index("notification_user_idx").on(table.userId),
    readIdx: index("notification_read_idx").on(table.isRead),
  })
);

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// علاقات الإشعارات
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

// ============================================
// جدول التحليلات (Analytics)
// ============================================
export const analytics = mysqlTable(
  "analytics",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    articleId: varchar("articleId", { length: 64 }),
    eventType: varchar("eventType", { length: 50 }).notNull(), // view, like, share, comment
    userId: varchar("userId", { length: 64 }),
    sessionId: varchar("sessionId", { length: 100 }),
    ipAddress: varchar("ipAddress", { length: 45 }),
    userAgent: text("userAgent"),
    referrer: varchar("referrer", { length: 500 }),
    metadata: json("metadata"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    articleIdx: index("analytics_article_idx").on(table.articleId),
    eventIdx: index("analytics_event_idx").on(table.eventType),
    dateIdx: index("analytics_date_idx").on(table.createdAt),
  })
);

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

// ============================================
// جدول سجل النشاطات (Activity Logs)
// ============================================
export const activityLogs = mysqlTable(
  "activity_logs",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("userId", { length: 64 }).notNull(),
    action: varchar("action", { length: 100 }).notNull(), // create, update, delete, etc.
    entityType: varchar("entityType", { length: 50 }).notNull(), // article, category, user, etc.
    entityId: varchar("entityId", { length: 64 }),
    oldValue: json("oldValue"),
    newValue: json("newValue"),
    ipAddress: varchar("ipAddress", { length: 45 }),
    userAgent: text("userAgent"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (table) => ({
    userIdx: index("log_user_idx").on(table.userId),
    entityIdx: index("log_entity_idx").on(table.entityType, table.entityId),
    dateIdx: index("log_date_idx").on(table.createdAt),
  })
);

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;

