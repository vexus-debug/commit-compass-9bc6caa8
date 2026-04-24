import { describe, expect, it } from "vitest";
import { calculateLdStaffAllocation } from "../lib/ld-staff-allocation";

const staff = [
  { id: "tech-a", full_name: "Olas", role: "Senior Technician", status: "active" },
  { id: "tech-b", full_name: "Tech B", role: "Senior Technician", status: "active" },
  { id: "manager", full_name: "Pringshak", role: "Manager", status: "active" },
  { id: "supervisor", full_name: "Kyuni", role: "Supervisor", status: "active" },
  { id: "dispatch", full_name: "Jonathan", role: "Dispatch Rider", status: "active" },
];

const salaryConfigs = [
  { staff_id: "tech-a", basic_percentage: 28.452, output_percentage: 55 },
  { staff_id: "tech-b", basic_percentage: 12.324, output_percentage: 55 },
  { staff_id: "manager", basic_percentage: 13.192, output_percentage: 20 },
  { staff_id: "supervisor", basic_percentage: 13.192, output_percentage: 25 },
  { staff_id: "dispatch", basic_percentage: 6.824, output_percentage: 0 },
];

describe("calculateLdStaffAllocation", () => {
  it("uses case work type value for basic and output with unassigned cases sent to extras", () => {
    const result = calculateLdStaffAllocation(
      [
        {
          id: "case-1",
          created_at: "2026-04-05T10:00:00.000Z",
          received_date: "2026-04-05",
          assigned_technician_id: "tech-a",
          lab_fee: 10000,
          tooth_number: 1,
          discount: 0,
          case_number: "LD-1",
          work_type_name: "RPD",
        },
        {
          id: "case-2",
          created_at: "2026-04-06T10:00:00.000Z",
          received_date: "2026-04-06",
          assigned_technician_id: "tech-b",
          lab_fee: 20000,
          tooth_number: 1,
          discount: 0,
          case_number: "LD-2",
          work_type_name: "PFM",
        },
        {
          id: "case-3",
          created_at: "2026-04-07T10:00:00.000Z",
          received_date: "2026-04-07",
          assigned_technician_id: null,
          lab_fee: 10000,
          tooth_number: 1,
          discount: 0,
          case_number: "LD-3",
          work_type_name: "RPD",
        },
      ],
      staff,
      salaryConfigs,
      new Date("2026-04-01T00:00:00.000Z"),
      new Date("2026-04-30T23:59:59.999Z")
    );

    expect(result.totalProductiveRevenue).toBe(30000);
    expect(result.outputPool).toBe(6000);
    expect(result.basicPool).toBe(3000);
    expect(result.totalRemaining).toBe(21000); // 70% remaining
    expect(result.totalJobs).toBe(2);
    expect(result.unassignedCasesCount).toBe(1);
    expect(result.extrasTotal).toBe(10000);

    const techA = result.allocations.find((item: any) => item.staff_id === "tech-a");
    const techB = result.allocations.find((item: any) => item.staff_id === "tech-b");
    const manager = result.allocations.find((item: any) => item.staff_id === "manager");
    const supervisor = result.allocations.find((item: any) => item.staff_id === "supervisor");

    // Technician output: unitOutputBase * 55% * units
    expect(techA?.output_allocation).toBe(1100); // 10000*0.2*0.55*1
    expect(techB?.output_allocation).toBe(2200); // 20000*0.2*0.55*1
    // Manager output: unitOutputBase * 20% per case (not per unit)
    expect(manager?.output_allocation).toBe(1200); // (2000*0.20) + (4000*0.20)
    // Supervisor output: unitOutputBase * 25% per case
    expect(supervisor?.output_allocation).toBe(1500); // (2000*0.25) + (4000*0.25)
  });

  it("counts technician output by units while manager and supervisor stay on case count", () => {
    const result = calculateLdStaffAllocation(
      [
        {
          id: "case-4",
          created_at: "2026-04-10T10:00:00.000Z",
          received_date: "2026-04-10",
          assigned_technician_id: "tech-a",
          lab_fee: 20000,
          tooth_number: 2,
          discount: 0,
          case_number: "LD-4",
          work_type_name: "PFM",
        },
      ],
      staff,
      salaryConfigs,
      new Date("2026-04-01T00:00:00.000Z"),
      new Date("2026-04-30T23:59:59.999Z")
    );

    const techA = result.allocations.find((item: any) => item.staff_id === "tech-a");
    const manager = result.allocations.find((item: any) => item.staff_id === "manager");
    const supervisor = result.allocations.find((item: any) => item.staff_id === "supervisor");

    // Total case value = 20000 * 2 = 40000
    expect(result.outputPool).toBe(8000); // 40000 * 0.2
    expect(result.basicPool).toBe(4000); // 40000 * 0.1
    expect(result.totalRemaining).toBe(28000); // 40000 * 0.7

    // Tech: unitOutputBase * 55% * units = 4000 * 0.55 * 2 = 4400
    expect(techA?.jobs_units).toBe(2);
    expect(techA?.output_allocation).toBe(4400);

    // Manager: unitOutputBase * 20% * 1 case = 4000 * 0.20 = 800
    expect(manager?.output_allocation).toBe(800);
    // Supervisor: unitOutputBase * 25% * 1 case = 4000 * 0.25 = 1000
    expect(supervisor?.output_allocation).toBe(1000);
  });

  it("produces per-work-type breakdowns", () => {
    const result = calculateLdStaffAllocation(
      [
        {
          id: "case-a", created_at: "2026-04-05T10:00:00.000Z",
          received_date: "2026-04-05", assigned_technician_id: "tech-a",
          lab_fee: 10000, tooth_number: 1, discount: 0,
          case_number: "LD-A", work_type_name: "RPD",
        },
        {
          id: "case-b", created_at: "2026-04-06T10:00:00.000Z",
          received_date: "2026-04-06", assigned_technician_id: "tech-b",
          lab_fee: 20000, tooth_number: 1, discount: 0,
          case_number: "LD-B", work_type_name: "PFM",
        },
        {
          id: "case-c", created_at: "2026-04-07T10:00:00.000Z",
          received_date: "2026-04-07", assigned_technician_id: "tech-a",
          lab_fee: 10000, tooth_number: 2, discount: 0,
          case_number: "LD-C", work_type_name: "RPD",
        },
      ],
      staff, salaryConfigs,
      new Date("2026-04-01T00:00:00.000Z"),
      new Date("2026-04-30T23:59:59.999Z")
    );

    expect(result.workTypeBreakdowns.length).toBe(2);

    const rpd = result.workTypeBreakdowns.find(w => w.work_type === "RPD");
    const pfm = result.workTypeBreakdowns.find(w => w.work_type === "PFM");

    // RPD: case-a (10000×1) + case-c (10000×2) = 30000 total
    expect(rpd?.caseCount).toBe(2);
    expect(rpd?.totalUnits).toBe(3);
    expect(rpd?.totalCaseValue).toBe(30000);
    expect(rpd?.basicPool).toBe(3000); // 30000 * 0.1
    expect(rpd?.outputPool).toBe(6000); // 30000 * 0.2
    expect(rpd?.remaining).toBe(21000); // 30000 * 0.7

    // PFM: case-b (20000×1) = 20000 total
    expect(pfm?.caseCount).toBe(1);
    expect(pfm?.totalCaseValue).toBe(20000);
    expect(pfm?.basicPool).toBe(2000);
    expect(pfm?.outputPool).toBe(4000);
    expect(pfm?.remaining).toBe(14000);
  });

  it("handles custom/discounted prices correctly", () => {
    const result = calculateLdStaffAllocation(
      [
        {
          id: "case-d", created_at: "2026-04-05T10:00:00.000Z",
          received_date: "2026-04-05", assigned_technician_id: "tech-a",
          lab_fee: 15000, tooth_number: 1, discount: 5000,
          case_number: "LD-D", work_type_name: "PFM",
        },
      ],
      staff, salaryConfigs,
      new Date("2026-04-01T00:00:00.000Z"),
      new Date("2026-04-30T23:59:59.999Z")
    );

    // Effective unit price = 15000 - 5000/1 = 10000
    // Case base = 10000 * 1 = 10000
    expect(result.totalProductiveRevenue).toBe(10000);
    expect(result.basicPool).toBe(1000);
    expect(result.outputPool).toBe(2000);
    expect(result.totalRemaining).toBe(7000);

    const techA = result.allocations.find((item: any) => item.staff_id === "tech-a");
    expect(techA?.output_allocation).toBe(1100); // 2000 * 0.55
  });

  it("dispatch rider with 0% output gets no output allocation", () => {
    const result = calculateLdStaffAllocation(
      [
        {
          id: "case-e", created_at: "2026-04-05T10:00:00.000Z",
          received_date: "2026-04-05", assigned_technician_id: "tech-a",
          lab_fee: 10000, tooth_number: 1, discount: 0,
          case_number: "LD-E", work_type_name: "RPD",
        },
      ],
      staff, salaryConfigs,
      new Date("2026-04-01T00:00:00.000Z"),
      new Date("2026-04-30T23:59:59.999Z")
    );

    const dispatch = result.allocations.find((item: any) => item.staff_id === "dispatch");
    expect(dispatch?.output_allocation).toBe(0);
    // But dispatch still gets basic allocation
    expect(dispatch?.basic_allocation).toBeGreaterThan(0);
    expect(dispatch?.basic_allocation).toBeCloseTo(1000 * 6.824 / 100, 2); // 68.24
  });

  it("counts only the final case in a repeat chain for totals and work type breakdowns", () => {
    const result = calculateLdStaffAllocation(
      [
        {
          id: "case-parent",
          created_at: "2026-04-05T10:00:00.000Z",
          received_date: "2026-04-05",
          assigned_technician_id: "tech-a",
          original_technician_id: "tech-a",
          lab_fee: 10000,
          tooth_number: 1,
          discount: 0,
          case_number: "LD-PARENT",
          work_type_name: "RPD",
        },
        {
          id: "case-repeat",
          created_at: "2026-04-08T10:00:00.000Z",
          received_date: "2026-04-08",
          assigned_technician_id: "tech-a",
          original_technician_id: "tech-a",
          repeat_of_case_id: "case-parent",
          remark: "Repeat",
          lab_fee: 10000,
          tooth_number: 2,
          discount: 0,
          case_number: "LD-REPEAT",
          work_type_name: "RPD",
        },
      ],
      staff,
      salaryConfigs,
      new Date("2026-04-01T00:00:00.000Z"),
      new Date("2026-04-30T23:59:59.999Z"),
    );

    expect(result.totalJobs).toBe(1);
    expect(result.totalUnits).toBe(2);
    expect(result.repeatCasesCount).toBe(1);

    const rpd = result.workTypeBreakdowns.find((item) => item.work_type === "RPD");
    expect(rpd?.caseCount).toBe(1);
    expect(rpd?.totalUnits).toBe(2);
    expect(rpd?.totalCaseValue).toBe(20000);
  });
});
