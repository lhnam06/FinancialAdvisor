BEGIN;

INSERT INTO categories (
  name,
  slug,
  flow_type,
  icon_key,
  color_hex,
  sort_order,
  is_system,
  is_active
)
VALUES
  -- income categories
  ('Tiền lương', 'tien-luong', 'income', 'wallet', '#4CAF50', 1, TRUE, TRUE),
  ('Đầu tư', 'dau-tu', 'income', 'trending-up', '#2196F3', 2, TRUE, TRUE),

  -- expense categories
  ('Ăn uống', 'an-uong', 'expense', 'utensils', '#FF6B6B', 10, TRUE, TRUE),
  ('Di chuyển', 'di-chuyen', 'expense', 'car', '#4ECDC4', 11, TRUE, TRUE),
  ('Mua sắm', 'mua-sam', 'expense', 'shopping-bag', '#45B7D1', 12, TRUE, TRUE),
  ('Giải trí', 'giai-tri', 'expense', 'film', '#96CEB4', 13, TRUE, TRUE),
  ('Y tế', 'y-te', 'expense', 'heart', '#FF8A80', 14, TRUE, TRUE),
  ('Nhà cửa', 'nha-cua', 'expense', 'home', '#98D8C8', 15, TRUE, TRUE),
  ('Khác', 'khac', 'expense', 'circle', '#BDBDBD', 16, TRUE, TRUE)
ON CONFLICT (user_id, slug, flow_type) DO NOTHING;

COMMIT;