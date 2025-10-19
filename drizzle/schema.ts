import { pgTable, index, varchar, json, text, timestamp, integer, uniqueIndex, unique, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const articleStatus = pgEnum("article_status", ['draft', 'published', 'archived', 'review', 'approved', 'scheduled', 'killed'])
export const commentStatus = pgEnum("comment_status", ['pending', 'approved', 'rejected'])
export const notificationType = pgEnum("notification_type", ['info', 'warning', 'success', 'error'])
export const userRole = pgEnum("user_role", ['user', 'editor', 'admin'])


export const activityLogs = pgTable("activity_logs", {
	id: varchar({ length: 64 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 64 }).notNull(),
	action: varchar({ length: 100 }).notNull(),
	entityType: varchar("entity_type", { length: 50 }),
	entityId: varchar("entity_id", { length: 64 }),
	details: json(),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("activity_logs_action_idx").using("btree", table.action.asc().nullsLast().op("text_ops")),
	index("activity_logs_entity_idx").using("btree", table.entityType.asc().nullsLast().op("text_ops"), table.entityId.asc().nullsLast().op("text_ops")),
	index("activity_logs_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const aiFeatures = pgTable("ai_features", {
	id: varchar({ length: 64 }).primaryKey().notNull(),
	articleId: varchar("article_id", { length: 64 }).notNull(),
	summary: text(),
	sentiment: varchar({ length: 50 }),
	keywords: json(),
	suggestedTitles: json("suggested_titles"),
	relatedTopics: json("related_topics"),
	factCheckStatus: varchar("fact_check_status", { length: 50 }),
	readabilityScore: integer("readability_score"),
	toneAnalysis: text("tone_analysis"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("ai_features_article_idx").using("btree", table.articleId.asc().nullsLast().op("text_ops")),
]);

export const analytics = pgTable("analytics", {
	id: varchar({ length: 64 }).primaryKey().notNull(),
	articleId: varchar("article_id", { length: 64 }).notNull(),
	date: timestamp({ mode: 'string' }).notNull(),
	views: integer().default(0),
	uniqueViews: integer("unique_views").default(0),
	likes: integer().default(0),
	shares: integer().default(0),
	comments: integer().default(0),
	avgReadTime: integer("avg_read_time"),
	bounceRate: integer("bounce_rate"),
}, (table) => [
	index("analytics_article_idx").using("btree", table.articleId.asc().nullsLast().op("text_ops")),
	index("analytics_date_idx").using("btree", table.date.asc().nullsLast().op("timestamp_ops")),
	index("analytics_views_idx").using("btree", table.views.asc().nullsLast().op("int4_ops")),
]);

export const categories = pgTable("categories", {
	id: varchar({ length: 64 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	description: text(),
	iconUrl: varchar("icon_url", { length: 500 }),
	color: varchar({ length: 50 }),
	parentId: varchar("parent_id", { length: 64 }),
	displayOrder: integer("display_order").default(0),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	heroImage: varchar("hero_image", { length: 500 }),
}, (table) => [
	index("categories_active_idx").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	index("categories_parent_idx").using("btree", table.parentId.asc().nullsLast().op("text_ops")),
	uniqueIndex("categories_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	unique("categories_slug_unique").on(table.slug),
]);

export const comments = pgTable("comments", {
	id: varchar({ length: 64 }).primaryKey().notNull(),
	articleId: varchar("article_id", { length: 64 }).notNull(),
	userId: varchar("user_id", { length: 64 }).notNull(),
	parentId: varchar("parent_id", { length: 64 }),
	content: text().notNull(),
	status: commentStatus().default('pending').notNull(),
	likes: integer().default(0),
	isEdited: boolean("is_edited").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("comments_article_idx").using("btree", table.articleId.asc().nullsLast().op("text_ops")),
	index("comments_parent_idx").using("btree", table.parentId.asc().nullsLast().op("text_ops")),
	index("comments_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("comments_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const media = pgTable("media", {
	id: varchar({ length: 64 }).primaryKey().notNull(),
	filename: varchar({ length: 255 }).notNull(),
	url: varchar({ length: 500 }).notNull(),
	mimeType: varchar("mime_type", { length: 100 }),
	size: integer(),
	width: integer(),
	height: integer(),
	uploaderId: varchar("uploader_id", { length: 64 }).notNull(),
	alt: text(),
	caption: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("media_mime_idx").using("btree", table.mimeType.asc().nullsLast().op("text_ops")),
	index("media_uploader_idx").using("btree", table.uploaderId.asc().nullsLast().op("text_ops")),
]);

export const notifications = pgTable("notifications", {
	id: varchar({ length: 64 }).primaryKey().notNull(),
	userId: varchar("user_id", { length: 64 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	message: text().notNull(),
	type: notificationType().default('info').notNull(),
	isRead: boolean("is_read").default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("notifications_read_idx").using("btree", table.isRead.asc().nullsLast().op("bool_ops")),
	index("notifications_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const users = pgTable("users", {
	id: varchar({ length: 64 }).primaryKey().notNull(),
	name: text(),
	email: varchar({ length: 320 }),
	loginMethod: varchar("login_method", { length: 64 }),
	role: userRole().default('user').notNull(),
	avatarUrl: varchar("avatar_url", { length: 500 }),
	bio: text(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	lastSignedIn: timestamp("last_signed_in", { mode: 'string' }).defaultNow(),
	password: varchar({ length: 255 }),
}, (table) => [
	index("users_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("users_role_idx").using("btree", table.role.asc().nullsLast().op("enum_ops")),
]);

export const editorialComments = pgTable("editorial_comments", {
	id: varchar({ length: 64 }).primaryKey().notNull(),
	articleId: varchar("article_id", { length: 64 }).notNull(),
	userId: varchar("user_id", { length: 64 }).notNull(),
	blockId: varchar("block_id", { length: 64 }),
	content: text().notNull(),
	isResolved: boolean("is_resolved").default(false),
	resolvedBy: varchar("resolved_by", { length: 64 }),
	resolvedAt: timestamp("resolved_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("editorial_comments_article_idx").using("btree", table.articleId.asc().nullsLast().op("text_ops")),
	index("editorial_comments_block_idx").using("btree", table.blockId.asc().nullsLast().op("text_ops")),
	index("editorial_comments_resolved_idx").using("btree", table.isResolved.asc().nullsLast().op("bool_ops")),
	index("editorial_comments_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const workflowHistory = pgTable("workflow_history", {
	id: varchar({ length: 64 }).primaryKey().notNull(),
	articleId: varchar("article_id", { length: 64 }).notNull(),
	fromStatus: articleStatus("from_status").notNull(),
	toStatus: articleStatus("to_status").notNull(),
	userId: varchar("user_id", { length: 64 }).notNull(),
	comment: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("workflow_history_article_idx").using("btree", table.articleId.asc().nullsLast().op("text_ops")),
	index("workflow_history_status_idx").using("btree", table.toStatus.asc().nullsLast().op("enum_ops")),
	index("workflow_history_user_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
]);

export const articleRevisions = pgTable("article_revisions", {
	id: varchar({ length: 64 }).primaryKey().notNull(),
	articleId: varchar("article_id", { length: 64 }).notNull(),
	revisionNumber: integer("revision_number").notNull(),
	title: varchar({ length: 500 }).notNull(),
	content: jsonb().notNull(),
	excerpt: text(),
	changes: jsonb(),
	editedBy: varchar("edited_by", { length: 64 }).notNull(),
	editReason: text("edit_reason"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	subtitle: varchar({ length: 500 }),
}, (table) => [
	index("article_revisions_article_idx").using("btree", table.articleId.asc().nullsLast().op("text_ops")),
	index("article_revisions_revision_idx").using("btree", table.articleId.asc().nullsLast().op("int4_ops"), table.revisionNumber.asc().nullsLast().op("int4_ops")),
]);

export const tags = pgTable("tags", {
	id: varchar({ length: 64 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	description: text(),
	usageCount: integer("usage_count").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("tags_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	uniqueIndex("tags_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	unique("tags_name_key").on(table.name),
	unique("tags_slug_key").on(table.slug),
]);

export const articleTags = pgTable("article_tags", {
	articleId: varchar("article_id", { length: 64 }).notNull(),
	tagId: varchar("tag_id", { length: 64 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("article_tags_article_idx").using("btree", table.articleId.asc().nullsLast().op("text_ops")),
	index("article_tags_pk").using("btree", table.articleId.asc().nullsLast().op("text_ops"), table.tagId.asc().nullsLast().op("text_ops")),
	index("article_tags_tag_idx").using("btree", table.tagId.asc().nullsLast().op("text_ops")),
]);

export const topics = pgTable("topics", {
	id: varchar({ length: 64 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	description: text(),
	coverImage: varchar("cover_image", { length: 500 }),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("topics_active_idx").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	uniqueIndex("topics_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	unique("topics_slug_key").on(table.slug),
]);

export const articleTopics = pgTable("article_topics", {
	articleId: varchar("article_id", { length: 64 }).notNull(),
	topicId: varchar("topic_id", { length: 64 }).notNull(),
	displayOrder: integer("display_order").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("article_topics_article_idx").using("btree", table.articleId.asc().nullsLast().op("text_ops")),
	index("article_topics_pk").using("btree", table.articleId.asc().nullsLast().op("text_ops"), table.topicId.asc().nullsLast().op("text_ops")),
	index("article_topics_topic_idx").using("btree", table.topicId.asc().nullsLast().op("text_ops")),
]);

export const articles = pgTable("articles", {
	id: varchar({ length: 64 }).primaryKey().notNull(),
	title: varchar({ length: 500 }).notNull(),
	slug: varchar({ length: 500 }).notNull(),
	content: text().notNull(),
	excerpt: text(),
	authorId: varchar("author_id", { length: 64 }).notNull(),
	categoryId: varchar("category_id", { length: 64 }),
	status: articleStatus().default('draft').notNull(),
	featuredImage: varchar("featured_image", { length: 500 }),
	tags: json(),
	views: integer().default(0),
	likes: integer().default(0),
	isFeatured: boolean("is_featured").default(false),
	isBreaking: boolean("is_breaking").default(false),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	seoTitle: varchar("seo_title", { length: 255 }),
	seoDescription: text("seo_description"),
	seoKeywords: json("seo_keywords"),
	readingTime: integer("reading_time"),
	videoUrl: varchar("video_url", { length: 500 }),
	audioUrl: varchar("audio_url", { length: 500 }),
	sourceUrl: varchar("source_url", { length: 500 }),
	sourceName: varchar("source_name", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	subtitle: varchar({ length: 500 }),
	scheduledAt: timestamp("scheduled_at", { mode: 'string' }),
	currentRevision: integer("current_revision").default(1),
	lastEditedBy: varchar("last_edited_by", { length: 64 }),
}, (table) => [
	index("articles_author_idx").using("btree", table.authorId.asc().nullsLast().op("text_ops")),
	index("articles_category_idx").using("btree", table.categoryId.asc().nullsLast().op("text_ops")),
	index("articles_featured_idx").using("btree", table.isFeatured.asc().nullsLast().op("bool_ops")),
	index("articles_published_idx").using("btree", table.publishedAt.asc().nullsLast().op("timestamp_ops")),
	uniqueIndex("articles_slug_idx").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("articles_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("articles_created_at_idx").using("btree", table.createdAt.desc().nullsLast().op("timestamp_ops")),
	unique("articles_slug_unique").on(table.slug),
]);
