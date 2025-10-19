CREATE TYPE "public"."article_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."comment_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('info', 'warning', 'success', 'error');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'editor', 'admin');--> statement-breakpoint
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
--> statement-breakpoint
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
--> statement-breakpoint
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
--> statement-breakpoint
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
--> statement-breakpoint
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
--> statement-breakpoint
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
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"type" "notification_type" DEFAULT 'info' NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
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
--> statement-breakpoint
CREATE INDEX "activity_logs_user_idx" ON "activity_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "activity_logs_action_idx" ON "activity_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "activity_logs_entity_idx" ON "activity_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "ai_features_article_idx" ON "ai_features" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "analytics_article_idx" ON "analytics" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "analytics_date_idx" ON "analytics" USING btree ("date");--> statement-breakpoint
CREATE INDEX "analytics_views_idx" ON "analytics" USING btree ("views");--> statement-breakpoint
CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "articles_author_idx" ON "articles" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "articles_status_idx" ON "articles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "articles_published_idx" ON "articles" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "articles_featured_idx" ON "articles" USING btree ("is_featured");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_parent_idx" ON "categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "categories_active_idx" ON "categories" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "comments_article_idx" ON "comments" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "comments_user_idx" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "comments_parent_idx" ON "comments" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "comments_status_idx" ON "comments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "media_uploader_idx" ON "media" USING btree ("uploader_id");--> statement-breakpoint
CREATE INDEX "media_mime_idx" ON "media" USING btree ("mime_type");--> statement-breakpoint
CREATE INDEX "notifications_user_idx" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notifications_read_idx" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");