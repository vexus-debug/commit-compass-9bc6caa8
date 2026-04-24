import {
  getLdCaseCommissionBase,
  getLdCaseUnits,
  getLdCountableCases,
  getLdEffectiveUnitPrice,
  isLdTechnicianRole,
  roundLdCurrency,
} from "@/lib/ld-allocation-utils";

export interface WorkTypeBreakdown {
  work_type: string;
  caseCount: number;
  totalUnits: number;
  totalCaseValue: number;
  basicPool: number;
  outputPool: number;
  remaining: number;
  staffBreakdown: {
    staff_id: string;
    staff_name: string;
    role: string;
    basic_amount: number;
    output_amount: number;
  }[];
}

export function calculateLdStaffAllocation(
  cases: any[],
  staff: any[],
  salaryConfigs: any[],
  periodStart: Date,
  periodEnd: Date,
  paidOnly: boolean = false,
  sharedAllocations: any[] = []
) {
  const configByStaffId = new Map(
    (salaryConfigs || []).map((config: any) => [config.staff_id, {
      basic_percentage: Number(config.basic_percentage) || 0,
      output_percentage: Number(config.output_percentage) || 0,
    }])
  );

  const activeStaff = (staff || []).filter((member: any) => member.status === "active");
  const staffById = new Map(activeStaff.map((member: any) => [member.id, member]));
  const technicianIds = new Set(activeStaff.filter(isLdTechnicianRole).map((member: any) => member.id));

  const uniqueCases = getLdCountableCases(cases, periodStart, periodEnd, paidOnly);

  const assignedCases = uniqueCases.filter((labCase: any) => !!labCase.assigned_technician_id);
  const unassignedCases = uniqueCases.filter((labCase: any) => !labCase.assigned_technician_id);

  const draftByStaffId: Record<string, any> = {};
  activeStaff.forEach((member: any) => {
    const config = configByStaffId.get(member.id) || { basic_percentage: 0, output_percentage: 0 };
    draftByStaffId[member.id] = {
      staff_id: member.id,
      staff_name: member.full_name,
      role: member.role,
      basic_percentage: config.basic_percentage,
      output_percentage: config.output_percentage,
      jobs_count: 0,
      jobs_units: 0,
      jobs_revenue: 0,
      basic_allocation_raw: 0,
      output_allocation_raw: 0,
      shared_debit_raw: 0,
      shared_credit_raw: 0,
      shared_help_needed: 0,
      shared_help_given: 0,
      bonus_reassignments: [],
    };
  });

  const technicianOutputByCaseId: Record<string, number> = {};
  const assignedCaseIds = new Set(assignedCases.map((labCase: any) => labCase.id));

  let totalProductiveRevenue = 0;
  let outputPool = 0;
  let basicPool = 0;
  let totalUnits = 0;

  // ─── Per-work-type tracking ───
  const workTypeMap: Record<string, {
    caseCount: number;
    totalUnits: number;
    totalCaseValue: number;
    basicPool: number;
    outputPool: number;
    staffBasic: Record<string, number>;
    staffOutput: Record<string, number>;
  }> = {};

  const ensureWorkType = (wt: string) => {
    if (!workTypeMap[wt]) {
      workTypeMap[wt] = {
        caseCount: 0, totalUnits: 0, totalCaseValue: 0,
        basicPool: 0, outputPool: 0,
        staffBasic: {}, staffOutput: {},
      };
    }
    return workTypeMap[wt];
  };

  assignedCases.forEach((labCase: any) => {
    const technicianId = labCase.assigned_technician_id;
    const units = getLdCaseUnits(labCase);
    const effectiveUnitPrice = getLdEffectiveUnitPrice(labCase);
    const caseBase = roundLdCurrency(effectiveUnitPrice * units);
    const caseBasicPool = roundLdCurrency(caseBase * 0.1);
    const unitOutputBase = roundLdCurrency(effectiveUnitPrice * 0.2);
    const caseOutputPool = roundLdCurrency(caseBase * 0.2);

    totalProductiveRevenue += caseBase;
    basicPool += caseBasicPool;
    outputPool += caseOutputPool;
    totalUnits += units;

    // Track per work type
    const wtName = labCase.work_type_name || labCase.work_type || "Unknown";
    const wt = ensureWorkType(wtName);
    wt.caseCount += 1;
    wt.totalUnits += units;
    wt.totalCaseValue += caseBase;
    wt.basicPool += caseBasicPool;
    wt.outputPool += caseOutputPool;

    // Basic allocation: all staff get their percentage of the case's basic pool
    activeStaff.forEach((member: any) => {
      const allocation = draftByStaffId[member.id];
      if (!allocation || allocation.basic_percentage <= 0) return;
      const amount = caseBasicPool * (allocation.basic_percentage / 100);
      allocation.basic_allocation_raw += amount;
      wt.staffBasic[member.id] = (wt.staffBasic[member.id] || 0) + amount;
    });

    // Technician output: assigned tech gets output × units
    const technicianAllocation = technicianId ? draftByStaffId[technicianId] : null;
    if (technicianAllocation) {
      technicianAllocation.jobs_count += 1;
      technicianAllocation.jobs_units += units;
      technicianAllocation.jobs_revenue += caseBase;
      const techOutput = unitOutputBase * (technicianAllocation.output_percentage / 100) * units;
      technicianOutputByCaseId[labCase.id] = techOutput;
      technicianAllocation.output_allocation_raw += techOutput;
      wt.staffOutput[technicianId] = (wt.staffOutput[technicianId] || 0) + techOutput;
    }

    // Non-technician output (manager, supervisor): per case count, NOT per unit
    activeStaff.forEach((member: any) => {
      if (member.id === technicianId || technicianIds.has(member.id)) return;
      const allocation = draftByStaffId[member.id];
      if (!allocation || allocation.output_percentage <= 0) return;
      allocation.jobs_count += 1;
      allocation.jobs_revenue += caseBase;
      const nonTechOutput = unitOutputBase * (allocation.output_percentage / 100);
      allocation.output_allocation_raw += nonTechOutput;
      wt.staffOutput[member.id] = (wt.staffOutput[member.id] || 0) + nonTechOutput;
    });
  });

  // Bonus reassignments
  uniqueCases.forEach((labCase: any) => {
    if (labCase.bonus_reassignment_tech_id && draftByStaffId[labCase.bonus_reassignment_tech_id]) {
      draftByStaffId[labCase.bonus_reassignment_tech_id].bonus_reassignments.push(labCase.case_number);
    }
  });

  // Shared allocations (helper tech)
  (sharedAllocations || []).forEach((share: any) => {
    if (!assignedCaseIds.has(share.case_id)) return;
    const debitAmount = (technicianOutputByCaseId[share.case_id] || 0) * ((Number(share.share_percentage) || 0) / 100);
    if (draftByStaffId[share.original_tech_id]) {
      draftByStaffId[share.original_tech_id].shared_debit_raw += debitAmount;
      draftByStaffId[share.original_tech_id].shared_help_needed += 1;
    }
    if (draftByStaffId[share.helper_tech_id]) {
      draftByStaffId[share.helper_tech_id].shared_credit_raw += debitAmount;
      draftByStaffId[share.helper_tech_id].shared_help_given += 1;
    }
  });

  // Repeat/Remake penalty tracking — scoped to the analysis period so a repeat
  // received in March only deducts from the original tech's March salary, not
  // from every other month. A case counts as a "repeat against the original tech"
  // only when remark is Repeat/Remake OR repeat_of_case_id is set AND
  // original_technician_id is populated.
  const repeatCounts: Record<string, number> = {};
  (cases || []).forEach((labCase: any) => {
    if (!labCase.original_technician_id) return;
    const isRepeat =
      labCase.remark === "Repeat" ||
      labCase.remark === "Remake" ||
      !!labCase.repeat_of_case_id;
    if (!isRepeat) return;
    const caseDate = new Date(labCase.received_date || labCase.created_at);
    if (caseDate < periodStart || caseDate > periodEnd) return;
    repeatCounts[labCase.original_technician_id] =
      (repeatCounts[labCase.original_technician_id] || 0) + 1;
  });

  const allocations = activeStaff
    .filter((member: any) => draftByStaffId[member.id])
    .map((member: any) => {
      const draft = draftByStaffId[member.id];
      const repeatCount = repeatCounts[member.id] || 0;
      const repeatPenalty = repeatCount > 0 && draft.jobs_count > 0
        ? repeatCount * (((draft.output_allocation_raw / draft.jobs_count) * 1.5) + (draft.basic_allocation_raw / draft.jobs_count))
        : 0;

      const grossAllocation = draft.basic_allocation_raw + draft.output_allocation_raw;
      const totalAllocation = Math.max(
        grossAllocation - repeatPenalty - draft.shared_debit_raw + draft.shared_credit_raw,
        0
      );

      return {
        staff_id: draft.staff_id,
        staff_name: draft.staff_name,
        role: draft.role,
        basic_percentage: draft.basic_percentage,
        output_percentage: draft.output_percentage,
        jobs_count: draft.jobs_count,
        jobs_units: draft.jobs_units,
        jobs_revenue: roundLdCurrency(draft.jobs_revenue),
        output_allocation: roundLdCurrency(draft.output_allocation_raw),
        basic_allocation: roundLdCurrency(draft.basic_allocation_raw),
        repeat_penalty: roundLdCurrency(repeatPenalty),
        repeat_count: repeatCount,
        shared_debit: roundLdCurrency(draft.shared_debit_raw),
        shared_credit: roundLdCurrency(draft.shared_credit_raw),
        shared_help_needed: draft.shared_help_needed,
        shared_help_given: draft.shared_help_given,
        bonus_reassignments: draft.bonus_reassignments,
        total_allocation: roundLdCurrency(totalAllocation),
      };
    });

  // Build per-work-type breakdown
  const workTypeBreakdowns: WorkTypeBreakdown[] = Object.entries(workTypeMap).map(([wtName, wt]) => ({
    work_type: wtName,
    caseCount: wt.caseCount,
    totalUnits: wt.totalUnits,
    totalCaseValue: roundLdCurrency(wt.totalCaseValue),
    basicPool: roundLdCurrency(wt.basicPool),
    outputPool: roundLdCurrency(wt.outputPool),
    remaining: roundLdCurrency(wt.totalCaseValue - wt.basicPool - wt.outputPool),
    staffBreakdown: activeStaff.map((member: any) => ({
      staff_id: member.id,
      staff_name: member.full_name,
      role: member.role,
      basic_amount: roundLdCurrency(wt.staffBasic[member.id] || 0),
      output_amount: roundLdCurrency(wt.staffOutput[member.id] || 0),
    })).filter(s => s.basic_amount > 0 || s.output_amount > 0),
  })).sort((a, b) => b.totalCaseValue - a.totalCaseValue);

  const totalRemaining = roundLdCurrency(totalProductiveRevenue - basicPool - outputPool);

  return {
    totalProductiveRevenue: roundLdCurrency(totalProductiveRevenue),
    outputPool: roundLdCurrency(outputPool),
    basicPool: roundLdCurrency(basicPool),
    totalRemaining,
    totalJobs: assignedCases.length,
    totalUnits,
    unassignedCasesCount: unassignedCases.length,
    extrasTotal: roundLdCurrency(unassignedCases.reduce((sum: number, labCase: any) => sum + getLdCaseCommissionBase(labCase), 0)),
    allocatedOutputTotal: roundLdCurrency(allocations.reduce((sum: number, item: any) => sum + item.output_allocation, 0)),
    allocatedBasicTotal: roundLdCurrency(allocations.reduce((sum: number, item: any) => sum + item.basic_allocation, 0)),
    allocations,
    workTypeBreakdowns,
    repeatCasesCount: Object.values(repeatCounts).reduce((sum, count) => sum + count, 0),
    courierTotal: roundLdCurrency(uniqueCases.reduce((sum, labCase) => sum + Number(labCase.courier_amount || 0), 0)),
    expressTotal: roundLdCurrency(uniqueCases.reduce((sum, labCase) => sum + Number(labCase.express_surcharge || 0), 0)),
  };
}
