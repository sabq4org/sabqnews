CREATE TABLE "article_revisions" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"article_id" varchar(64) NOT NULL,
	"revision_number" integer NOT NULL,
	"title" varchar(500) NOT NULL,
	"subtitle" varchar(500),
	"content" json NOT NULL,
	"excerpt" text,
	"changes" json,
	"edited_by" varchar(64) NOT NULL,
	"edit_reason" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "article_tags" (
	"article_id" varchar(64) NOT NULL,
	"tag_id" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "article_topics" (
	"article_id" varchar(64) NOT NULL,
	"topic_id" varchar(64) NOT NULL,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "editorial_comments" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"article_id" varchar(64) NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"block_id" varchar(64),
	"content" text NOT NULL,
	"is_resolved" boolean DEFAULT false,
	"resolved_by" varchar(64),
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "tags_name_unique" UNIQUE("name"),
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"cover_image" varchar(500),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "topics_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "workflow_history" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"article_id" varchar(64) NOT NULL,
	"from_status" "article_status" NOT NULL,
	"to_status" "article_status" NOT NULL,
	"user_id" varchar(64) NOT NULL,
	"comment" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "status" SET DEFAULT 'draft'::text;--> statement-breakpoint
ALTER TABLE "workflow_history" ALTER COLUMN "from_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "workflow_history" ALTER COLUMN "to_status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."article_status";--> statement-breakpoint
CREATE TYPE "public"."article_status" AS ENUM('draft', 'review', 'approved', 'scheduled', 'published', 'killed');--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "status" SET DEFAULT 'draft'::"public"."article_status";--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "status" SET DATA TYPE "public"."article_status" USING "status"::"public"."article_status";--> statement-breakpoint
ALTER TABLE "workflow_history" ALTER COLUMN "from_status" SET DATA TYPE "public"."article_status" USING "from_status"::"public"."article_status";--> statement-breakpoint
ALTER TABLE "workflow_history" ALTER COLUMN "to_status" SET DATA TYPE "public"."article_status" USING "to_status"::"public"."article_status";--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "content" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "subtitle" varchar(500);--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "scheduled_at" timestamp;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "current_revision" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "last_edited_by" varchar(64);--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "hero_image" varchar(500);--> statement-breakpoint
CREATE INDEX "article_revisions_article_idx" ON "article_revisions" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "article_revisions_revision_idx" ON "article_revisions" USING btree ("article_id","revision_number");--> statement-breakpoint
CREATE INDEX "article_tags_pk" ON "article_tags" USING btree ("article_id","tag_id");--> statement-breakpoint
CREATE INDEX "article_tags_article_idx" ON "article_tags" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "article_tags_tag_idx" ON "article_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "article_topics_pk" ON "article_topics" USING btree ("article_id","topic_id");--> statement-breakpoint
CREATE INDEX "article_topics_article_idx" ON "article_topics" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "article_topics_topic_idx" ON "article_topics" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX "editorial_comments_article_idx" ON "editorial_comments" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "editorial_comments_user_idx" ON "editorial_comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "editorial_comments_block_idx" ON "editorial_comments" USING btree ("block_id");--> statement-breakpoint
CREATE INDEX "editorial_comments_resolved_idx" ON "editorial_comments" USING btree ("is_resolved");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tags_name_idx" ON "tags" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "topics_slug_idx" ON "topics" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "topics_active_idx" ON "topics" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "workflow_history_article_idx" ON "workflow_history" USING btree ("article_id");--> statement-breakpoint
CREATE INDEX "workflow_history_user_idx" ON "workflow_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "workflow_history_status_idx" ON "workflow_history" USING btree ("to_status");