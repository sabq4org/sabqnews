-- إضافة حقل password إلى جدول users
ALTER TABLE users ADD COLUMN IF NOT EXISTS password varchar(255);

-- إضافة مستخدم admin تجريبي
-- كلمة المرور: admin123
-- Hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyVpLzMfxue6
INSERT INTO users (id, name, email, password, role, is_active)
VALUES (
  'admin-001',
  'مدير النظام',
  'admin@sabq.org',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyVpLzMfxue6',
  'admin',
  true
)
ON CONFLICT (id) DO UPDATE
SET password = EXCLUDED.password,
    role = EXCLUDED.role;

-- إضافة محرر تجريبي
-- كلمة المرور: editor123
INSERT INTO users (id, name, email, password, role, is_active)
VALUES (
  'editor-001',
  'محرر الأخبار',
  'editor@sabq.org',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyVpLzMfxue6',
  'editor',
  true
)
ON CONFLICT (id) DO UPDATE
SET password = EXCLUDED.password,
    role = EXCLUDED.role;

-- إضافة كاتب تجريبي
-- كلمة المرور: writer123
INSERT INTO users (id, name, email, password, role, is_active)
VALUES (
  'writer-001',
  'كاتب المقالات',
  'writer@sabq.org',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyVpLzMfxue6',
  'writer',
  true
)
ON CONFLICT (id) DO UPDATE
SET password = EXCLUDED.password,
    role = EXCLUDED.role;

