const toRoleText = (staffMember: any) =>
  `${staffMember?.full_name || ""} ${staffMember?.role || ""} ${staffMember?.specialty || ""}`.toLowerCase();

export function getLdSuggestedSalaryConfig(staffMember: any) {
  const roleText = toRoleText(staffMember);
  const isSupervisorOnly = roleText.includes("supervisor") && !roleText.includes("technician") && !roleText.includes("technologist");

  return {
    basic_percentage: isSupervisorOnly ? 0 : 0,
    output_percentage: isSupervisorOnly ? 25 : 0,
  };
}

export function mergeLdSalaryConfigsWithStaff(staff: any[], salaryConfigs: any[]) {
  const activeStaff = (staff || []).filter((member: any) => member.status === "active");
  const configsByStaffId = new Map((salaryConfigs || []).map((config: any) => [config.staff_id, config]));

  return activeStaff
    .map((member: any) => {
      const existing = configsByStaffId.get(member.id);
      const suggested = getLdSuggestedSalaryConfig(member);

      return {
        id: existing?.id,
        staff_id: member.id,
        basic_percentage: Number(existing?.basic_percentage ?? suggested.basic_percentage) || 0,
        output_percentage: Number(existing?.output_percentage ?? suggested.output_percentage) || 0,
        effective_from: existing?.effective_from ?? null,
        effective_to: existing?.effective_to ?? null,
        staff: existing?.staff || member,
        isSuggested: !existing,
      };
    })
    .sort((a: any, b: any) => (a.staff?.full_name || "").localeCompare(b.staff?.full_name || ""));
}