ALTER TABLE public.ld_salary_config DROP CONSTRAINT IF EXISTS ld_salary_config_staff_id_key;

ALTER TABLE public.ld_salary_config
  ADD COLUMN IF NOT EXISTS effective_from date,
  ADD COLUMN IF NOT EXISTS effective_to date;

UPDATE public.ld_salary_config
SET effective_from = COALESCE(effective_from, created_at::date)
WHERE effective_from IS NULL;

ALTER TABLE public.ld_salary_config
  ALTER COLUMN effective_from SET DEFAULT CURRENT_DATE,
  ALTER COLUMN effective_from SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ld_salary_config_staff_id_effective_from_key
  ON public.ld_salary_config (staff_id, effective_from);

CREATE INDEX IF NOT EXISTS ld_salary_config_staff_period_idx
  ON public.ld_salary_config (staff_id, effective_from DESC, effective_to);

CREATE OR REPLACE FUNCTION public.validate_ld_salary_config_periods()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.effective_to IS NOT NULL AND NEW.effective_to < NEW.effective_from THEN
    RAISE EXCEPTION 'effective_to must be on or after effective_from';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.ld_salary_config existing
    WHERE existing.staff_id = NEW.staff_id
      AND (NEW.id IS NULL OR existing.id <> NEW.id)
      AND daterange(existing.effective_from, COALESCE(existing.effective_to + 1, 'infinity'::date), '[)')
          && daterange(NEW.effective_from, COALESCE(NEW.effective_to + 1, 'infinity'::date), '[)')
  ) THEN
    RAISE EXCEPTION 'Salary config periods cannot overlap for the same staff member';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_ld_salary_config_periods_trigger ON public.ld_salary_config;

CREATE TRIGGER validate_ld_salary_config_periods_trigger
BEFORE INSERT OR UPDATE ON public.ld_salary_config
FOR EACH ROW
EXECUTE FUNCTION public.validate_ld_salary_config_periods();