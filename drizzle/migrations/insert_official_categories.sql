-- إضافة التصنيفات الرسمية العشرة

INSERT INTO categories (id, name, slug, description, icon_url, color, display_order, is_active)
VALUES 
  ('cat_local_001', 'محليات', 'local', 'أخبار المناطق والمدن السعودية', '🗺️', '#3B82F6', 1, true),
  ('cat_world_002', 'العالم', 'world', 'أخبار العالم والتحليلات الدولية', '🌍', '#6366F1', 2, true),
  ('cat_life_003', 'حياتنا', 'life', 'نمط الحياة، الصحة، الأسرة والمجتمع', '🌱', '#F472B6', 3, true),
  ('cat_stations_004', 'محطات', 'stations', 'تقارير خاصة وملفات متنوعة', '🛤️', '#FBBF24', 4, true),
  ('cat_sports_005', 'رياضة', 'sports', 'أخبار رياضية محلية وعالمية', '⚽', '#F59E0B', 5, true),
  ('cat_tourism_006', 'سياحة', 'tourism', 'تقارير سياحية ومواقع مميزة', '🧳', '#34D399', 6, true),
  ('cat_business_007', 'أعمال', 'business', 'أخبار الأعمال والشركات وريادة الأعمال', '💼', '#10B981', 7, true),
  ('cat_tech_008', 'تقنية', 'technology', 'أخبار وتطورات التقنية والذكاء الاصطناعي', '💻', '#8B5CF6', 8, true),
  ('cat_cars_009', 'سيارات', 'cars', 'أخبار وتقارير السيارات', '🚗', '#0EA5E9', 9, true),
  ('cat_media_010', 'ميديا', 'media', 'فيديوهات وصور وإعلام رقمي', '🎬', '#EAB308', 10, true)
ON CONFLICT (slug) DO NOTHING;

