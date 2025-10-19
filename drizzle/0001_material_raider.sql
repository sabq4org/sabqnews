ALTER TYPE "public"."user_role" ADD VALUE 'writer' BEFORE 'editor';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" varchar(255);