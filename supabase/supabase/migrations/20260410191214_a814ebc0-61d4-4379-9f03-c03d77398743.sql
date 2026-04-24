
CREATE OR REPLACE FUNCTION public.allocate_revenue_on_payment()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  rule RECORD;
  staff_rule RECORD;
  inv RECORD;
  total_paid numeric;
  excess numeric;
  base_ops_amount numeric := 0;
  payment_dt date;
BEGIN
  BEGIN
    payment_dt := COALESCE(NEW.payment_date::date, CURRENT_DATE);

    -- Check if allocation is active (using date-filtered rules)
    IF NOT EXISTS (
      SELECT 1 FROM public.revenue_allocation_rules
      WHERE is_active = true
        AND effective_from <= payment_dt
        AND (effective_to IS NULL OR effective_to >= payment_dt)
      LIMIT 1
    ) THEN
      RETURN NEW;
    END IF;

    -- Insert allocation rows for each active rule effective on payment date
    FOR rule IN
      SELECT category, percentage FROM public.revenue_allocation_rules
      WHERE is_active = true
        AND effective_from <= payment_dt
        AND (effective_to IS NULL OR effective_to >= payment_dt)
    LOOP
      INSERT INTO public.revenue_allocations (payment_id, category, percentage, amount)
      VALUES (NEW.id, rule.category, rule.percentage, ROUND(NEW.amount * rule.percentage / 100, 2));

      IF rule.category = 'Base Operations' THEN
        base_ops_amount := ROUND(NEW.amount * rule.percentage / 100, 2);
      END IF;
    END LOOP;

    -- Staff sub-allocations from Base Operations (date-filtered)
    IF base_ops_amount > 0 THEN
      FOR staff_rule IN
        SELECT role_title, percentage FROM public.staff_allocation_rules
        WHERE is_active = true
          AND effective_from <= payment_dt
          AND (effective_to IS NULL OR effective_to >= payment_dt)
      LOOP
        INSERT INTO public.staff_revenue_allocations (payment_id, role_title, percentage, amount)
        VALUES (NEW.id, staff_rule.role_title, staff_rule.percentage, ROUND(base_ops_amount * staff_rule.percentage / 100, 2));
      END LOOP;
    END IF;

    -- Check for excess payment (war chest)
    SELECT total_amount, amount_paid INTO inv FROM public.invoices WHERE id = NEW.invoice_id;
    IF inv IS NOT NULL THEN
      total_paid := inv.amount_paid + NEW.amount;
      IF total_paid > inv.total_amount THEN
        excess := total_paid - inv.total_amount;
        IF excess > NEW.amount THEN
          excess := NEW.amount;
        END IF;
        INSERT INTO public.war_chest_entries (payment_id, excess_amount)
        VALUES (NEW.id, excess);
      END IF;
    END IF;

  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Revenue allocation failed for payment %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$function$;
