
-- Add effective dating to revenue_allocation_rules
ALTER TABLE public.revenue_allocation_rules
  ADD COLUMN IF NOT EXISTS effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS effective_to DATE DEFAULT NULL;

-- Add effective dating to staff_allocation_rules
ALTER TABLE public.staff_allocation_rules
  ADD COLUMN IF NOT EXISTS effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS effective_to DATE DEFAULT NULL;

-- Add effective dating to lab_allocation_rules
ALTER TABLE public.lab_allocation_rules
  ADD COLUMN IF NOT EXISTS effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS effective_to DATE DEFAULT NULL;

-- Add indexes for date range lookups
CREATE INDEX IF NOT EXISTS idx_revenue_allocation_rules_dates ON public.revenue_allocation_rules (effective_from, effective_to);
CREATE INDEX IF NOT EXISTS idx_staff_allocation_rules_dates ON public.staff_allocation_rules (effective_from, effective_to);
CREATE INDEX IF NOT EXISTS idx_lab_allocation_rules_dates ON public.lab_allocation_rules (effective_from, effective_to);
