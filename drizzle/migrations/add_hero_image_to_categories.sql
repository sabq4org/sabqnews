-- إضافة حقل heroImage إلى جدول categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS hero_image VARCHAR(500);
