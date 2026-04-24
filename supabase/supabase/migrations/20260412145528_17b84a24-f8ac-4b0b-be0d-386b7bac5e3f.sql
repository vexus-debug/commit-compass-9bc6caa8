
-- Table to store how the 70% remaining revenue is split into categories
CREATE TABLE public.ld_remaining_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name TEXT NOT NULL,
  percentage NUMERIC NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ld_remaining_categories ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Authenticated users can view remaining categories"
  ON public.ld_remaining_categories FOR SELECT
  TO authenticated USING (true);

-- Allow admin/manager to manage
CREATE POLICY "Admin can manage remaining categories"
  ON public.ld_remaining_categories FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Auto-update timestamp
CREATE TRIGGER update_ld_remaining_categories_updated_at
  BEFORE UPDATE ON public.ld_remaining_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default categories
INSERT INTO public.ld_remaining_categories (category_name, percentage, sort_order) VALUES
  ('Rent', 10, 1),
  ('Expenses', 15, 2),
  ('Tithe', 10, 3),
  ('Savings', 15, 4),
  ('Referral', 10, 5),
  ('Dental Materials', 40, 6);
