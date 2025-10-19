import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * مخطط قاعدة البيانات لبوابة سبق الذكية (PostgreSQL)
 * يتضمن جميع الجداول اللازمة لنظام إدارة المحتوى الإعلامي
 */

// ============================================
// Enums
// ============================================
export const userRoleEnum = pgEnum("user_role", ["user", "editor", "admin"]);
export const articleStatusEnum = pgEnum("article_status", ["draft", "published", "archived"]);
export const commentStatusEnum = pgEnum("comment_status", ["pending", "approved", "rejected"]);
export const notificationTypeEnum = pgEnum("notification_type", ["info", "warning", "success", "error"]);

// ============================================
// جدول المستخدمين (Users)
// ============================================
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("login_method", { length: 64 }),
    role: userRoleEnum("role").default("user").notNull(),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    bio: text("bio"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    lastSignedIn: timestamp("last_signed_in").defaultNow(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// جدول التصنيفات (Categories)
// ============================================
export const categories = pgTable(
  "categories",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    iconUrl: varchar("icon_url", { length: 500 }),
    color: varchar("color", { length: 50 }),
    parentId: varchar("parent_id", { length: 64 }),
    displayOrder: integer("display_order").default(0),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("categories_slug_idx").on(table.slug),
    parentIdx: index("categories_parent_idx").on(table.parentId),
    activeIdx: index("categories_active_idx").on(table.isActive),
  })
);

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

// ============================================
// جدول المقالات (Articles)
// ============================================
export const articles = pgTable(
  "articles",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    slug: varchar("slug", { length: 500 }).notNull().unique(),
    content: text("content").notNull(),
    excerpt: text("excerpt"),
    authorId: varchar("author_id", { length: 64 }).notNull(),
    categoryId: varchar("category_id", { length: 64 }),
    status: articleStatusEnum("status").default("draft").notNull(),
    featuredImage: varchar("featured_image", { length: 500 }),
    tags: json("tags").$type<string[]>(),
    views: integer("views").default(0),
    likes: integer("likes").default(0),
    isFeatured: boolean("is_featured").default(false),
    isBreaking: boolean("is_breaking").default(false),
    publishedAt: timestamp("published_at"),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    seoKeywords: json("seo_keywords").$type<string[]>(),
    readingTime: integer("reading_time"),
    videoUrl: varchar("video_url", { length: 500 }),
    audioUrl: varchar("audio_url", { length: 500 }),
    sourceUrl: varchar("source_url", { length: 500 }),
    sourceName: varchar("source_name", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("articles_slug_idx").on(table.slug),
    authorIdx: index("articles_author_idx").on(table.authorId),
    categoryIdx: index("articles_category_idx").on(table.categoryId),
    statusIdx: index("articles_status_idx").on(table.status),
    publishedIdx: index("articles_published_idx").on(table.publishedAt),
    featuredIdx: index("articles_featured_idx").on(table.isFeatured),
  })
);

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

// ============================================
// جدول مميزات الذكاء الاصطناعي (AI Features)
// ============================================
export const aiFeatures = pgTable(
  "ai_features",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    articleId: varchar("article_id", { length: 64 }).notNull(),
    summary: text("summary"),
    sentiment: varchar("sentiment", { length: 50 }),
    keywords: json("keywords").$type<string[]>(),
    suggestedTitles: json("suggested_titles").$type<string[]>(),
    relatedTopics: json("related_topics").$type<string[]>(),
    factCheckStatus: varchar("fact_check_status", { length: 50 }),
    readabilityScore: integer("readability_score"),
    toneAnalysis: text("tone_analysis"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    articleIdx: index("ai_features_article_idx").on(table.articleId),
  })
);

export type AiFeature = typeof aiFeatures.$inferSelect;
export type InsertAiFeature = typeof aiFeatures.$inferInsert;

// ============================================
// جدول التعليقات (Comments)
// ============================================
export const comments = pgTable(
  "comments",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    articleId: varchar("article_id", { length: 64 }).notNull(),
    userId: varchar("user_id", { length: 64 }).notNull(),
    parentId: varchar("parent_id", { length: 64 }),
    content: text("content").notNull(),
    status: commentStatusEnum("status").default("pending").notNull(),
    likes: integer("likes").default(0),
    isEdited: boolean("is_edited").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    articleIdx: index("comments_article_idx").on(table.articleId),
    userIdx: index("comments_user_idx").on(table.userId),
    parentIdx: index("comments_parent_idx").on(table.parentId),
    statusIdx: index("comments_status_idx").on(table.status),
  })
);

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

// ============================================
// جدول الوسائط (Media)
// ============================================
export const media = pgTable(
  "media",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    filename: varchar("filename", { length: 255 }).notNull(),
    url: varchar("url", { length: 500 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }),
    size: integer("size"),
    width: integer("width"),
    height: integer("height"),
    uploaderId: varchar("uploader_id", { length: 64 }).notNull(),
    alt: text("alt"),
    caption: text("caption"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    uploaderIdx: index("media_uploader_idx").on(table.uploaderId),
    mimeIdx: index("media_mime_idx").on(table.mimeType),
  })
);

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

// ============================================
// جدول الإشعارات (Notifications)
// ============================================
export const notifications = pgTable(
  "notifications",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 64 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    type: notificationTypeEnum("type").default("info").notNull(),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdx: index("notifications_user_idx").on(table.userId),
    readIdx: index("notifications_read_idx").on(table.isRead),
  })
);

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ============================================
// جدول التحليلات (Analytics)
// ============================================
export const analytics = pgTable(
  "analytics",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    articleId: varchar("article_id", { length: 64 }).notNull(),
    date: timestamp("date").notNull(),
    views: integer("views").default(0),
    uniqueViews: integer("unique_views").default(0),
    likes: integer("likes").default(0),
    shares: integer("shares").default(0),
    comments: integer("comments").default(0),
    avgReadTime: integer("avg_read_time"),
    bounceRate: integer("bounce_rate"),
  },
  (table) => ({
    articleIdx: index("analytics_article_idx").on(table.articleId),
    dateIdx: index("analytics_date_idx").on(table.date),
    viewsIdx: index("analytics_views_idx").on(table.views),
  })
);

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

// ============================================
// جدول سجل النشاطات (Activity Logs)
// ============================================
export const activityLogs = pgTable(
  "activity_logs",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: varchar("user_id", { length: 64 }).notNull(),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entity_type", { length: 50 }),
    entityId: varchar("entity_id", { length: 64 }),
    details: json("details"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdx: index("activity_logs_user_idx").on(table.userId),
    actionIdx: index("activity_logs_action_idx").on(table.action),
    entityIdx: index("activity_logs_entity_idx").on(table.entityType, table.entityId),
  })
);

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;

