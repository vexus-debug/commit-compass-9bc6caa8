
-- Table to track shared allocation events (when Staff B helps Staff A complete a case)
CREATE TABLE public.ld_shared_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.ld_cases(id) ON DELETE CASCADE,
  original_tech_id UUID NOT NULL REFERENCES public.ld_staff(id),
  helper_tech_id UUID NOT NULL REFERENCES public.ld_staff(id),
  share_percentage NUMERIC NOT NULL DEFAULT 50,
  reason TEXT,
  recorded_by UUID,
  recorded_by_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT different_techs CHECK (original_tech_id != helper_tech_id),
  CONSTRAINT valid_share CHECK (share_percentage > 0 AND share_percentage <= 100)
);

-- Enable RLS
ALTER TABLE public.ld_shared_allocations ENABLE ROW LEVEL SECURITY;

-- Policies: authenticated users can read, insert
CREATE POLICY "Authenticated users can view shared allocations"
  ON public.ld_shared_allocations FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create shared allocations"
  ON public.ld_shared_allocations FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete shared allocations"
  ON public.ld_shared_allocations FOR DELETE TO authenticated USING (true);

-- Index for fast lookups by case
CREATE INDEX idx_ld_shared_allocations_case ON public.ld_shared_allocations(case_id);
CREATE INDEX idx_ld_shared_allocations_original_tech ON public.ld_shared_allocations(original_tech_id);
CREATE INDEX idx_ld_shared_allocations_helper_tech ON public.ld_shared_allocations(helper_tech_id);
