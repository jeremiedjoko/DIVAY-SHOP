-- ==========================================
-- DIVAY BEAUTY : SCHEMA SUPABASE (PHASE 1)
-- ==========================================

-- 1. CATÉGORIES BOUTIQUE
CREATE TABLE product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PRODUITS
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT,
  short_description TEXT,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  status TEXT DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, ARCHIVED
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  main_image_url TEXT,
  weight NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. IMAGES PRODUITS (Galerie)
CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CATÉGORIES PRESTATIONS
CREATE TABLE service_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PRESTATIONS (Rendez-vous)
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  booking_enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. MEDIA (Checklist Assets)
CREATE TABLE media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  type TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DONNÉES DE DÉMO (SEED) - PRODUITS VEDETTES
INSERT INTO product_categories (id, name, slug) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Sacs en Pagne', 'sacs-en-pagne');

INSERT INTO products (id, category_id, name, slug, price, main_image_url, status, is_featured, stock_quantity) VALUES
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Sac en pagne « Élégance »', 'sac-pagne-elegance', 40.00, 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80', 'PUBLISHED', true, 5),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Pochette perlée « Royal »', 'pochette-perlee-royal', 55.00, 'https://images.unsplash.com/photo-1515562141207-7a8ea4114e17?w=800&q=80', 'PUBLISHED', true, 3),
  ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 'Éventail en pagne « Prestige »', 'eventail-prestige', 25.00, 'https://images.unsplash.com/photo-1611078759083-a4c3f59e6651?w=800&q=80', 'PUBLISHED', true, 10),
  ('22222222-2222-2222-2222-222222222224', '11111111-1111-1111-1111-111111111111', 'Stylo perlé « Classy »', 'stylo-perle-classy', 12.00, 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80', 'PUBLISHED', true, 20);

-- DONNÉES DE DÉMO - PRESTATIONS
INSERT INTO service_categories (id, name, slug) VALUES 
  ('33333333-3333-3333-3333-333333333333', 'Maquillage', 'maquillage');

INSERT INTO services (category_id, name, slug, short_description, price, duration_minutes, image_url, is_active) VALUES
  ('33333333-3333-3333-3333-333333333333', 'Maquillage Mariage', 'maquillage-mariage', 'Un maquillage parfait pour le plus beau jour de votre vie.', 150.00, 90, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80', true);
