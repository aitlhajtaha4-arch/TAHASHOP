-- ============================================
-- TechVault Seed Data
-- Run this in Supabase SQL Editor AFTER the migration
-- ============================================

-- ============================================
-- BRANDS
-- ============================================
insert into public.brands (name, logo) values
('Apple', ''),
('Samsung', ''),
('Xiaomi', ''),
('Redmi', ''),
('POCO', ''),
('Huawei', ''),
('Honor', ''),
('Oppo', ''),
('Realme', ''),
('Vivo', ''),
('OnePlus', ''),
('Google Pixel', ''),
('Motorola', ''),
('Nokia', ''),
('Infinix', ''),
('Tecno', ''),
('Nothing', '')
on conflict (name) do update set logo = excluded.logo;

-- ============================================
-- PRODUCTS
-- ============================================
insert into public.products (name, brand, price, original_price, image, rating, review_count, badge, storage, ram, camera, battery, screen_size, processor, colors, category, condition, free_shipping, available, monthly_payment, description) values
('iPhone 16 Pro Max', 'Apple', 19999, 21999, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop', 4.9, 412, 'الأكثر مبيعاً', '256 GB', '8 GB', '48 MP + 12 MP + 12 MP', '4685 mAh', '6.9"', 'A18 Pro', ARRAY['تيتانيوم طبيعي','تيتانيوم أسود','تيتانيوم أبيض','تيتانيوم صحراوي'], 'flagship', 'جديد', true, true, 834, 'هاتف Apple الأعلى طرازاً مع شاشة Super Retina XDR مقاس 6.9 بوصة، كاميرا 48 ميجابيكسل ثلاثية، وشرحة A18 Pro الأقوى.'),
('iPhone 16', 'Apple', 12499, 13999, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop', 4.8, 287, 'جديد', '128 GB', '8 GB', '48 MP + 12 MP', '3561 mAh', '6.1"', 'A18', ARRAY['أسود','أزرق','أخضر','أصفر','وردي'], 'flagship', 'جديد', true, true, 521, 'هاتف iPhone 16 بشريحة A18 وشاشة Super Retina XDR مع كاميرا 48 ميجابيكسل محسّنة.'),
('iPhone 15 Pro Max', 'Apple', 16999, 19999, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop', 4.8, 342, null, '256 GB', '8 GB', '48 MP + 12 MP + 12 MP', '4441 mAh', '6.7"', 'A17 Pro', ARRAY['تيتانيوم طبيعي','تيتانيوم أزرق','تيتانيوم أبيض','تيتانيوم الأسود'], 'flagship', 'جديد', true, true, 708, 'هاتف iPhone 15 Pro Max بشريحة A17 Pro وكاميرا 48 ميجابيكسل وهيكل من التيتانيوم.'),
('Samsung Galaxy S25 Ultra', 'Samsung', 17499, 18999, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop', 4.9, 356, 'الأكثر مبيعاً', '256 GB', '12 GB', '200 MP + 50 MP + 10 MP + 50 MP', '5000 mAh', '6.9"', 'Snapdragon 8 Elite', ARRAY['الأسود السماوي','الرمادي','الأبيض الفضي','البنفسجي'], 'flagship', 'جديد', true, true, 730, 'سجّل Galaxy الأعلى طرازاً مع كاميرا 200 ميجابيكسل وقلم S Pen وشاشة Dynamic AMOLED 2X.'),
('Samsung Galaxy S25', 'Samsung', 10499, 11499, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop', 4.7, 198, 'جديد', '128 GB', '12 GB', '50 MP + 12 MP + 10 MP', '4000 mAh', '6.2"', 'Snapdragon 8 Elite', ARRAY['الكحلي','الفضي الثلجي','النعناعي','المسك الأزرق'], 'flagship', 'جديد', true, true, 438, 'Galaxy S25 بشريحة Snapdragon 8 Elite وشاشة Dynamic AMOLED 2X وكاميرا ثلاثية.'),
('Samsung Galaxy A56 5G', 'Samsung', 4999, 5499, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop', 4.4, 234, 'أفضل قيمة', '128 GB', '8 GB', '50 MP + 12 MP + 5 MP', '5000 mAh', '6.7"', 'Exynos 1580', ARRAY['الأسود','الأزرق','البنفسجي'], 'mid-range', 'جديد', true, true, 208, 'هاتف Samsung متوسط مع شاشة Super AMOLED وكاميرا 50 ميجابيكسل وبطارية 5000 مللي أمبير.'),
('Samsung Galaxy Z Fold6', 'Samsung', 19999, 21999, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop', 4.7, 156, 'بريميوم', '256 GB', '12 GB', '50 MP + 12 MP + 10 MP', '4400 mAh', '7.6"', 'Snapdragon 8 Gen 3', ARRAY['الكحلي','الوردي','الفضي'], 'flagship', 'جديد', true, true, 834, 'هاتف قابل للطي Galaxy Z Fold6 بشاشة داخلية كبيرة 7.6 بوصة وشرحة Snapdragon 8 Gen 3.'),
('Xiaomi 15 Ultra', 'Xiaomi', 12999, 14499, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop', 4.8, 189, 'عرض خاص', '512 GB', '16 GB', '50 MP + 50 MP + 50 MP + 50 MP', '5500 mAh', '6.73"', 'Snapdragon 8 Elite', ARRAY['الأسود','الأبيض'], 'flagship', 'جديد', true, true, 542, 'Xiaomi 15 Ultra بكاميرا徕카 رباعية 50 ميجابيكسل وشريحة Snapdragon 8 Elite وبطارية 5500 مللي أمبير.'),
('Xiaomi 14T Pro', 'Xiaomi', 7999, 8999, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop', 4.6, 134, null, '256 GB', '12 GB', '50 MP + 50 MP + 12 MP', '5000 mAh', '6.67"', 'MediaTek Dimensity 9300+', ARRAY['الأسود','الأبيض','اللماع'], 'flagship', 'جديد', true, true, 334, 'Xiaomi 14T Pro بكاميرا徕卡 ثلاثية وشحن سريع 120 واط وبطارية 5000 مللي أمبير.'),
('Redmi Note 14 Pro+', 'Redmi', 3499, 3999, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=600&fit=crop', 4.5, 312, 'الأكثر مبيعاً', '256 GB', '12 GB', '200 MP + 8 MP + 2 MP', '6200 mAh', '6.67"', 'MediaTek Dimensity 7300 Ultra', ARRAY['الأسود','الأبيض','البنفسجي','الأخضر'], 'mid-range', 'جديد', true, true, 146, 'Redmi Note 14 Pro+ بكاميرا 200 ميجابيكسل وبطارية ضخمة 6200 مللي أمبير ومقاومة للماء.'),
('Redmi 14C', 'Redmi', 1999, null, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=600&fit=crop', 4.2, 178, 'رخيص الثمن', '128 GB', '4 GB', '50 MP', '5160 mAh', '6.88"', 'MediaTek Helio G81', ARRAY['الأسود','الأزرق','الأخضر'], 'budget', 'جديد', false, true, 84, 'هاتف اقتصادي بشاشة كبيرة 6.88 بوصة وبطارية تدوم طوال اليوم.'),
('POCO F7 Pro', 'POCO', 4999, 5499, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop', 4.6, 223, 'أفضل قيمة', '256 GB', '12 GB', '50 MP + 8 MP + 2 MP', '6000 mAh', '6.67"', 'Snapdragon 8 Gen 3', ARRAY['الأسود','الأبيض','الأخضر'], 'mid-range', 'جديد', true, true, 208, 'POCO F7 Pro بشريحة Snapdragon 8 Gen 3 وبطارية ضخمة 6000 مللي أمبير.'),
('POCO X7 Pro', 'POCO', 3499, null, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop', 4.4, 156, null, '256 GB', '8 GB', '50 MP + 2 MP', '6000 mAh', '6.67"', 'MediaTek Dimensity 8400 Ultra', ARRAY['الأسود','الأزرق'], 'mid-range', 'جديد', true, true, 146, 'POCO X7 Pro ببطارية 6000 مللي أمبير وشاشة AMOLED 120 هرتز.'),
('Huawei Pura 70 Pro', 'Huawei', 10999, 12499, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&h=600&fit=crop', 4.6, 145, 'جديد', '256 GB', '12 GB', '50 MP + 12.5 MP + 13 MP', '5050 mAh', '6.8"', 'Kirin 9010', ARRAY['الأسود','الأخضر','الأبيض'], 'flagship', 'جديد', true, true, 458, 'Huawei Pura 70 Pro بكاميرا XMAGE محسّنة وشحن فائق السرعة 100 واط.'),
('Huawei Nova 12 Pro', 'Huawei', 6499, null, 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&h=600&fit=crop', 4.3, 89, null, '256 GB', '12 GB', '50 MP + 8 MP + 12 MP', '4700 mAh', '6.7"', 'Snapdragon 778G', ARRAY['الأسود','الأخضر','الأبيض'], 'mid-range', 'جديد', true, true, 271, 'Huawei Nova 12 Pro بتصميم أنيق وكاميرا أمامية 60 ميجابيكسل.'),
('Honor Magic7 Pro', 'Honor', 8499, 9499, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop', 4.7, 112, 'جديد', '512 GB', '12 GB', '50 MP + 50 MP + 180 MP', '5850 mAh', '6.8"', 'Snapdragon 8 Elite', ARRAY['الأسود','الأخضر','البرتقالي'], 'flagship', 'جديد', true, true, 354, 'Honor Magic7 Pro بكاميرا تéléfoto 180 ميجابيكسل وبطارية 5850 مللي أمبير.'),
('Honor 200 Pro', 'Honor', 5999, null, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop', 4.5, 98, null, '256 GB', '12 GB', '50 MP + 50 MP + 12 MP', '5200 mAh', '6.78"', 'Snapdragon 8s Gen 3', ARRAY['الأسود','الأخضر الزمردي','الوردي'], 'flagship', 'جديد', true, true, 250, 'Honor 200 Pro بتصميم أنيق وكاميرا حقيقية ثلاثية وبطارية 5200 مللي أمبير.'),
('Oppo Find X8 Pro', 'Oppo', 9499, 10999, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=600&fit=crop', 4.7, 87, 'عرض خاص', '256 GB', '16 GB', '50 MP + 50 MP + 50 MP + 50 MP', '5910 mAh', '6.78"', 'MediaTek Dimensity 9400', ARRAY['الأسود','البني'], 'flagship', 'جديد', true, true, 396, 'Oppo Find X8 Pro بكاميرا Hasselblad رباعية 50 ميجابيكسل.'),
('Realme GT 7 Pro', 'Realme', 5499, 6299, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop', 4.5, 156, 'أفضل قيمة', '256 GB', '12 GB', '50 MP + 50 MP + 8 MP', '6500 mAh', '6.78"', 'Snapdragon 8 Elite', ARRAY['الأسود الفضي','الأخضر'], 'mid-range', 'جديد', true, true, 230, 'Realme GT 7 Pro ببطارية ضخمة 6500 مللي أمبير وشريحة Snapdragon 8 Elite.'),
('Vivo X200 Pro', 'Vivo', 9499, 10999, 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=600&h=600&fit=crop', 4.7, 134, 'جديد', '256 GB', '16 GB', '50 MP + 50 MP + 200 MP', '6000 mAh', '6.78"', 'MediaTek Dimensity 9400', ARRAY['الأسود','البرتقالي','الأزرق'], 'flagship', 'جديد', true, true, 396, 'Vivo X200 Pro بكاميرا ZEISS تéléfoto 200 ميجابيكسل وبطارية 6000 مللي أمبير.'),
('OnePlus 13', 'OnePlus', 8499, 9499, 'https://images.unsplash.com/photo-1567581935017-3c9d33f4f0ec?w=600&h=600&fit=crop', 4.7, 213, 'تخفيض', '256 GB', '16 GB', '50 MP + 50 MP + 50 MP', '6000 mAh', '6.82"', 'Snapdragon 8 Elite', ARRAY['الأسود السماوي','الأخضر الفضي','ال_midnight'], 'flagship', 'جديد', true, true, 354, 'OnePlus 13 بثلاث كاميرات 50 ميجابيكسل وبطارية 6000 مللي أمبير.'),
('Google Pixel 9 Pro', 'Google Pixel', 10999, null, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=600&fit=crop', 4.8, 198, 'أفضل كاميرا', '128 GB', '16 GB', '50 MP + 48 MP + 48 MP', '5060 mAh', '6.3"', 'Google Tensor G4', ARRAY['الأسود السماوي','الخزفي','البيج','وردي'], 'flagship', 'جديد', true, true, 458, 'Google Pixel 9 Pro بأشهر كاميرا في العالم وذكاء اصطناعي مدمج.'),
('Motorola Razr (2025)', 'Motorola', 6999, 7999, 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=600&h=600&fit=crop', 4.4, 78, null, '256 GB', '12 GB', '50 MP + 13 MP', '4200 mAh', '6.9"', 'Snapdragon 8s Gen 3', ARRAY['الأسود','الوردي','الأزرق'], 'flagship', 'جديد', true, true, 292, 'Motorola Razr 2025 هاتف قابل للطي بتصميم أنيق وشاشة خارجية كبيرة.'),
('Nokia G42 5G', 'Nokia', 3299, null, 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=600&h=600&fit=crop', 4.2, 91, null, '128 GB', '6 GB', '50 MP + 8 MP + 2 MP', '5000 mAh', '6.56"', 'Snapdragon 480+', ARRAY['الرمادي','البنفسجي'], 'budget', 'جديد', false, true, 138, 'Nokia G42 5G هاتف اقتصادي بدعم 5G وبطارية 5000 مللي أمبير.'),
('Infinix GT 30 Pro', 'Infinix', 3999, 4499, 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=600&h=600&fit=crop', 4.3, 89, 'للجيمرز', '256 GB', '8 GB', '108 MP + 2 MP', '5000 mAh', '6.78"', 'MediaTek Dimensity 8200', ARRAY['الأسود','الفضي','الأخضر'], 'gaming', 'جديد', false, true, 167, 'Infinix GT 30 Pro مصمم للألعاب بشريحة قوية وكاميرا 108 ميجابيكسل.'),
('Tecno Camon 40 Pro', 'Tecno', 3499, null, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&h=600&fit=crop', 4.3, 67, 'جديد', '256 GB', '8 GB', '108 MP + 2 MP + 2 MP', '5200 mAh', '6.77"', 'MediaTek Dimensity 7300', ARRAY['الأسود','الأخضر','الذهبي'], 'mid-range', 'جديد', false, true, 146, 'Tecno Camon 40 Pro بكاميرا 108 ميجابيكسل وبطارية 5200 مللي أمبير.'),
('Nothing Phone (2)', 'Nothing', 4999, 5699, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop', 4.4, 123, null, '256 GB', '12 GB', '50 MP + 50 MP', '4700 mAh', '6.7"', 'Snapdragon 8+ Gen 1', ARRAY['الأسود','الأبيض'], 'mid-range', 'جديد', true, true, 208, 'Nothing Phone (2) بتصميم Glyph المميز وواجهة Nothing OS النظيفة.'),
('Nothing Phone (2a) Plus', 'Nothing', 3299, null, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop', 4.3, 86, 'رخيص الثمن', '256 GB', '8 GB', '50 MP + 50 MP', '5000 mAh', '6.7"', 'MediaTek Dimensity 7350 Pro', ARRAY['الأسود','الأبيض'], 'mid-range', 'جديد', false, true, 138, 'Nothing Phone (2a) Plus بتصميم Glyph وبطارية 5000 مللي أمبير.'),
('iPhone 15 Pro Max (مستعمل)', 'Apple', 13999, 19999, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop', 4.7, 45, 'مستعمل ممتاز', '256 GB', '8 GB', '48 MP + 12 MP + 12 MP', '4441 mAh', '6.7"', 'A17 Pro', ARRAY['البنفسجي','الأسود'], 'flagship', 'مستعمل', true, true, 583, 'iPhone 15 Pro Max بحالة ممتازة 95% مع كل الملحقات والضمان.'),
('Samsung Galaxy S24 Ultra (مجدد)', 'Samsung', 11999, 17999, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop', 4.5, 38, 'مجدد', '256 GB', '12 GB', '200 MP + 50 MP + 12 MP + 10 MP', '5000 mAh', '6.8"', 'Snapdragon 8 Gen 3', ARRAY['الأسود السماوي','الأخضر'], 'flagship', 'مجدد', true, true, 500, 'Samsung Galaxy S24 Ultra مجدد بحالة ممتازة مع قلم S Pen.');

-- ============================================
-- FLASH DEALS
-- ============================================
insert into public.flash_deals (name, brand, price, original_price, image, discount, ends_at) values
('Samsung Galaxy S25 Ultra', 'Samsung', 15999, 18999, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop', 16, now() + interval '3 hours'),
('Redmi Note 14 Pro+', 'Redmi', 2799, 3999, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=600&fit=crop', 30, now() + interval '6 hours'),
('OnePlus 13', 'OnePlus', 7499, 9499, 'https://images.unsplash.com/photo-1567581935017-3c9d33f4f0ec?w=600&h=600&fit=crop', 21, now() + interval '12 hours'),
('Nothing Phone (2a) Plus', 'Nothing', 2799, 3299, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop', 15, now() + interval '18 hours');
