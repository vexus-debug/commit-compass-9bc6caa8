const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export const roundLdCurrency = (value: number) => round2(value);

export const getLdCaseDate = (labCase: any) => new Date(labCase.received_date || labCase.created_at);

export const getLdCaseUnits = (labCase: any) => Math.max(Number(labCase.tooth_number) || 1, 1);

export const getLdEffectiveUnitPrice = (labCase: any) => {
  const units = getLdCaseUnits(labCase);
  const storedUnitPrice = Number(labCase.lab_fee || 0);
  const discount = Math.max(Number(labCase.discount || 0), 0);

  if (storedUnitPrice > 0) {
    return Math.max(storedUnitPrice - discount / units, 0);
  }

  const fallbackTotal = Math.max(Number(labCase.net_amount || 0), 0);
  return units > 0 ? fallbackTotal / units : 0;
};

export const getLdCaseCommissionBase = (labCase: any) => round2(getLdEffectiveUnitPrice(labCase) * getLdCaseUnits(labCase));

export const isLdTechnicianRole = (staffMember: any) => {
  const roleText = `${staffMember?.role || ""} ${staffMember?.specialty || ""}`.toLowerCase();
  return roleText.includes("technician") || roleText.includes("technologist") || roleText.includes("technology");
};

export function getLdCountableCases(
  cases: any[],
  periodStart: Date,
  periodEnd: Date,
  paidOnly: boolean = false,
) {
  const supersededCaseIds = new Set(
    (cases || [])
      .map((labCase: any) => labCase.repeat_of_case_id)
      .filter(Boolean),
  );

  const seenCaseIds = new Set<string>();

  return (cases || []).filter((labCase: any) => {
    const caseDate = getLdCaseDate(labCase);
    if (caseDate < periodStart || caseDate > periodEnd) return false;
    if (paidOnly && !labCase.is_paid) return false;
    if (supersededCaseIds.has(labCase.id)) return false;
    if (seenCaseIds.has(labCase.id)) return false;

    seenCaseIds.add(labCase.id);
    return true;
  });
}