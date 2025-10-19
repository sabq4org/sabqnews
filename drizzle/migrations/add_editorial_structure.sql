-- تحديث article_status enum لدعم سير العمل الكامل
DO $$ BEGIN
  ALTER TYPE article_status ADD VALUE IF NOT EXISTS 'review';
  ALTER TYPE article_status ADD VALUE IF NOT EXISTS 'approved';
  ALTER TYPE article_status ADD VALUE IF NOT EXISTS 'scheduled';
  ALTER TYPE article_status ADD VALUE IF NOT EXISTS 'killed';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- تحديث جدول articles
ALTER TABLE articles 
  ALTER COLUMN content TYPE jsonb USING content::jsonb,
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS current_revision INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS last_edited_by VARCHAR(64);

-- إنشاء جدول article_revisions
CREATE TABLE IF NOT EXISTS article_revisions (
  id VARCHAR(64) PRIMARY KEY,
  article_id VARCHAR(64) NOT NULL,
  revision_number INTEGER NOT NULL,
  title VARCHAR(500) NOT NULL,
  content JSONB NOT NULL,
  excerpt TEXT,
  changes JSONB,
  edited_by VARCHAR(64) NOT NULL,
  edit_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS article_revisions_article_idx ON article_revisions(article_id);
CREATE INDEX IF NOT EXISTS article_revisions_revision_idx ON article_revisions(article_id, revision_number);

-- إنشاء جدول editorial_comments
CREATE TABLE IF NOT EXISTS editorial_comments (
  id VARCHAR(64) PRIMARY KEY,
  article_id VARCHAR(64) NOT NULL,
  user_id VARCHAR(64) NOT NULL,
  block_id VARCHAR(64),
  content TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by VARCHAR(64),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS editorial_comments_article_idx ON editorial_comments(article_id);
CREATE INDEX IF NOT EXISTS editorial_comments_user_idx ON editorial_comments(user_id);
CREATE INDEX IF NOT EXISTS editorial_comments_block_idx ON editorial_comments(block_id);
CREATE INDEX IF NOT EXISTS editorial_comments_resolved_idx ON editorial_comments(is_resolved);

-- إنشاء جدول workflow_history
CREATE TABLE IF NOT EXISTS workflow_history (
  id VARCHAR(64) PRIMARY KEY,
  article_id VARCHAR(64) NOT NULL,
  from_status article_status NOT NULL,
  to_status article_status NOT NULL,
  user_id VARCHAR(64) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS workflow_history_article_idx ON workflow_history(article_id);
CREATE INDEX IF NOT EXISTS workflow_history_user_idx ON workflow_history(user_id);
CREATE INDEX IF NOT EXISTS workflow_history_status_idx ON workflow_history(to_status);

-- إنشاء جدول tags
CREATE TABLE IF NOT EXISTS tags (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS tags_slug_idx ON tags(slug);
CREATE INDEX IF NOT EXISTS tags_name_idx ON tags(name);

-- إنشاء جدول article_tags
CREATE TABLE IF NOT EXISTS article_tags (
  article_id VARCHAR(64) NOT NULL,
  tag_id VARCHAR(64) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS article_tags_pk ON article_tags(article_id, tag_id);
CREATE INDEX IF NOT EXISTS article_tags_article_idx ON article_tags(article_id);
CREATE INDEX IF NOT EXISTS article_tags_tag_idx ON article_tags(tag_id);

-- إنشاء جدول topics
CREATE TABLE IF NOT EXISTS topics (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  cover_image VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS topics_slug_idx ON topics(slug);
CREATE INDEX IF NOT EXISTS topics_active_idx ON topics(is_active);

-- إنشاء جدول article_topics
CREATE TABLE IF NOT EXISTS article_topics (
  article_id VARCHAR(64) NOT NULL,
  topic_id VARCHAR(64) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS article_topics_pk ON article_topics(article_id, topic_id);
CREATE INDEX IF NOT EXISTS article_topics_article_idx ON article_topics(article_id);
CREATE INDEX IF NOT EXISTS article_topics_topic_idx ON article_topics(topic_id);
