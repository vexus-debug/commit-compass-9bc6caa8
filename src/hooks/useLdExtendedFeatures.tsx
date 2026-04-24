import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ==================== TYPES ====================

export interface LdRecurringOrder {
  id: string;
  client_id: string | null;
  work_type_id: string | null;
  work_type_name: string;
  patient_name: string;
  frequency: string;
  next_due_date: string | null;
  last_generated_date: string | null;
  lab_fee: number;
  shade: string | null;
  instructions: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface LdExternalLab {
  id: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  specialties: string[];
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LdOutsourcedCase {
  id: string;
  case_id: string | null;
  external_lab_id: string | null;
  sent_date: string | null;
  expected_return_date: string | null;
  actual_return_date: string | null;
  cost: number;
  status: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface LdShipment {
  id: string;
  shipment_number: string;
  client_id: string | null;
  shipment_date: string;
  delivery_method: string;
  courier_name: string | null;
  tracking_number: string | null;
  status: string;
  total_cases: number;
  notes: string | null;
  dispatched_by: string | null;
  dispatched_at: string | null;
  created_by: string | null;
  created_at: string;
}

export interface LdCaseMaterial {
  id: string;
  case_id: string | null;
  inventory_id: string | null;
  material_name: string;
  quantity_used: number;
  unit: string;
  unit_cost: number;
  total_cost: number;
  used_by: string | null;
  used_at: string;
  notes: string | null;
}

export interface LdEquipment {
  id: string;
  name: string;
  model: string | null;
  serial_number: string | null;
  purchase_date: string | null;
  warranty_expiry: string | null;
  status: string;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LdEquipmentMaintenance {
  id: string;
  equipment_id: string | null;
  maintenance_type: string;
  maintenance_date: string;
  next_maintenance_date: string | null;
  performed_by: string | null;
  cost: number | null;
  description: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface LdClientPrice {
  id: string;
  client_id: string | null;
  work_type_id: string | null;
  custom_price: number;
  discount_percent: number | null;
  effective_from: string | null;
  effective_to: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface LdWarranty {
  id: string;
  case_id: string | null;
  warranty_months: number;
  start_date: string;
  end_date: string;
  status: string;
  claim_date: string | null;
  claim_reason: string | null;
  claim_resolution: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LdCommunication {
  id: string;
  client_id: string | null;
  case_id: string | null;
  communication_type: string;
  direction: string;
  subject: string | null;
  content: string | null;
  contact_person: string | null;
  communicated_by: string | null;
  communicated_by_name: string | null;
  communicated_at: string;
  follow_up_required: boolean;
  follow_up_date: string | null;
  created_at: string;
}

export interface LdDigitalFile {
  id: string;
  case_id: string | null;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size_kb: number | null;
  description: string | null;
  uploaded_by: string | null;
  uploaded_by_name: string | null;
  created_at: string;
}

export interface LdShadeLibrary {
  id: string;
  shade_code: string;
  shade_name: string;
  shade_system: string;
  color_hex: string | null;
  image_url: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LdTechnicianSkill {
  id: string;
  technician_id: string | null;
  work_type_id: string | null;
  proficiency_level: string;
  certified: boolean;
  certification_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LdPickupSchedule {
  id: string;
  client_id: string | null;
  pickup_date: string;
  pickup_time: string | null;
  pickup_type: string;
  driver_name: string | null;
  driver_phone: string | null;
  status: string;
  estimated_cases: number | null;
  notes: string | null;
  completed_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// ==================== RECURRING ORDERS ====================

export function useLdRecurringOrders() {
  return useQuery({
    queryKey: ["ld_recurring_orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_recurring_orders" as any)
        .select("*")
        .order("next_due_date", { ascending: true });
      if (error) throw error;
      return data as unknown as LdRecurringOrder[];
    },
  });
}

export function useAddLdRecurringOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (order: Omit<LdRecurringOrder, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("ld_recurring_orders" as any).insert(order as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_recurring_orders"] }),
  });
}

export function useUpdateLdRecurringOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<LdRecurringOrder>) => {
      const { error } = await supabase.from("ld_recurring_orders" as any).update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_recurring_orders"] }),
  });
}

export function useDeleteLdRecurringOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ld_recurring_orders" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_recurring_orders"] }),
  });
}

// ==================== EXTERNAL LABS ====================

export function useLdExternalLabs() {
  return useQuery({
    queryKey: ["ld_external_labs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_external_labs" as any)
        .select("*")
        .order("name");
      if (error) throw error;
      return data as unknown as LdExternalLab[];
    },
  });
}

export function useAddLdExternalLab() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lab: Omit<LdExternalLab, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("ld_external_labs" as any).insert(lab as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_external_labs"] }),
  });
}

export function useUpdateLdExternalLab() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<LdExternalLab>) => {
      const { error } = await supabase.from("ld_external_labs" as any).update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_external_labs"] }),
  });
}

export function useDeleteLdExternalLab() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ld_external_labs" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_external_labs"] }),
  });
}

// ==================== OUTSOURCED CASES ====================

export function useLdOutsourcedCases() {
  return useQuery({
    queryKey: ["ld_outsourced_cases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_outsourced_cases" as any)
        .select("*")
        .order("sent_date", { ascending: false });
      if (error) throw error;
      return data as unknown as LdOutsourcedCase[];
    },
  });
}

export function useAddLdOutsourcedCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (outsourced: Omit<LdOutsourcedCase, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("ld_outsourced_cases" as any).insert(outsourced as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_outsourced_cases"] }),
  });
}

export function useUpdateLdOutsourcedCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<LdOutsourcedCase>) => {
      const { error } = await supabase.from("ld_outsourced_cases" as any).update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_outsourced_cases"] }),
  });
}

// ==================== SHIPMENTS ====================

export function useLdShipments() {
  return useQuery({
    queryKey: ["ld_shipments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_shipments" as any)
        .select("*")
        .order("shipment_date", { ascending: false });
      if (error) throw error;
      return data as unknown as LdShipment[];
    },
  });
}

export function useAddLdShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (shipment: Omit<LdShipment, "id" | "created_at">) => {
      const { data, error } = await supabase.from("ld_shipments" as any).insert(shipment as any).select().single();
      if (error) throw error;
      return data as unknown as LdShipment;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_shipments"] }),
  });
}

export function useUpdateLdShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<LdShipment>) => {
      const { error } = await supabase.from("ld_shipments" as any).update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_shipments"] }),
  });
}

export function useLdShipmentCases(shipmentId: string | undefined) {
  return useQuery({
    queryKey: ["ld_shipment_cases", shipmentId],
    enabled: !!shipmentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_shipment_cases" as any)
        .select("*")
        .eq("shipment_id", shipmentId);
      if (error) throw error;
      return data as unknown as { id: string; shipment_id: string; case_id: string; created_at: string }[];
    },
  });
}

export function useAddCasesToShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ shipmentId, caseIds }: { shipmentId: string; caseIds: string[] }) => {
      const rows = caseIds.map(case_id => ({ shipment_id: shipmentId, case_id }));
      const { error } = await supabase.from("ld_shipment_cases" as any).insert(rows as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ld_shipment_cases"] });
      qc.invalidateQueries({ queryKey: ["ld_shipments"] });
    },
  });
}

// ==================== CASE MATERIALS (COGS) ====================

export function useLdCaseMaterials(caseId: string | undefined) {
  return useQuery({
    queryKey: ["ld_case_materials", caseId],
    enabled: !!caseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_case_materials" as any)
        .select("*")
        .eq("case_id", caseId)
        .order("used_at", { ascending: false });
      if (error) throw error;
      return data as unknown as LdCaseMaterial[];
    },
  });
}

export function useAddLdCaseMaterial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (material: Omit<LdCaseMaterial, "id">) => {
      const { error } = await supabase.from("ld_case_materials" as any).insert(material as any);
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["ld_case_materials", vars.case_id] }),
  });
}

export function useDeleteLdCaseMaterial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, caseId }: { id: string; caseId: string }) => {
      const { error } = await supabase.from("ld_case_materials" as any).delete().eq("id", id);
      if (error) throw error;
      return caseId;
    },
    onSuccess: (caseId) => qc.invalidateQueries({ queryKey: ["ld_case_materials", caseId] }),
  });
}

// ==================== EQUIPMENT ====================

export function useLdEquipment() {
  return useQuery({
    queryKey: ["ld_equipment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_equipment" as any)
        .select("*")
        .order("name");
      if (error) throw error;
      return data as unknown as LdEquipment[];
    },
  });
}

export function useAddLdEquipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (equipment: Omit<LdEquipment, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("ld_equipment" as any).insert(equipment as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_equipment"] }),
  });
}

export function useUpdateLdEquipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<LdEquipment>) => {
      const { error } = await supabase.from("ld_equipment" as any).update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_equipment"] }),
  });
}

export function useDeleteLdEquipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ld_equipment" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_equipment"] }),
  });
}

export function useLdEquipmentMaintenance(equipmentId: string | undefined) {
  return useQuery({
    queryKey: ["ld_equipment_maintenance", equipmentId],
    enabled: !!equipmentId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_equipment_maintenance" as any)
        .select("*")
        .eq("equipment_id", equipmentId)
        .order("maintenance_date", { ascending: false });
      if (error) throw error;
      return data as unknown as LdEquipmentMaintenance[];
    },
  });
}

export function useAddLdEquipmentMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (maintenance: Omit<LdEquipmentMaintenance, "id" | "created_at">) => {
      const { error } = await supabase.from("ld_equipment_maintenance" as any).insert(maintenance as any);
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["ld_equipment_maintenance", vars.equipment_id] }),
  });
}

// ==================== CLIENT PRICES ====================

export function useLdClientPrices(clientId?: string) {
  return useQuery({
    queryKey: ["ld_client_prices", clientId],
    queryFn: async () => {
      let query = supabase.from("ld_client_prices" as any).select("*");
      if (clientId) query = query.eq("client_id", clientId);
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as LdClientPrice[];
    },
  });
}

export function useAddLdClientPrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (price: Omit<LdClientPrice, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("ld_client_prices" as any).insert(price as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_client_prices"] }),
  });
}

export function useUpdateLdClientPrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<LdClientPrice>) => {
      const { error } = await supabase.from("ld_client_prices" as any).update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_client_prices"] }),
  });
}

export function useDeleteLdClientPrice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ld_client_prices" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_client_prices"] }),
  });
}

// ==================== WARRANTIES ====================

export function useLdWarranties() {
  return useQuery({
    queryKey: ["ld_warranties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_warranties" as any)
        .select("*")
        .order("end_date", { ascending: true });
      if (error) throw error;
      return data as unknown as LdWarranty[];
    },
  });
}

export function useAddLdWarranty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (warranty: Omit<LdWarranty, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("ld_warranties" as any).insert(warranty as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_warranties"] }),
  });
}

export function useUpdateLdWarranty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<LdWarranty>) => {
      const { error } = await supabase.from("ld_warranties" as any).update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_warranties"] }),
  });
}

// ==================== COMMUNICATIONS ====================

export function useLdCommunications(clientId?: string) {
  return useQuery({
    queryKey: ["ld_communications", clientId],
    queryFn: async () => {
      let query = supabase.from("ld_communications" as any).select("*");
      if (clientId) query = query.eq("client_id", clientId);
      const { data, error } = await query.order("communicated_at", { ascending: false }).limit(200);
      if (error) throw error;
      return data as unknown as LdCommunication[];
    },
  });
}

export function useAddLdCommunication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (comm: Omit<LdCommunication, "id" | "created_at">) => {
      const { error } = await supabase.from("ld_communications" as any).insert(comm as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_communications"] }),
  });
}

// ==================== DIGITAL FILES ====================

export function useLdDigitalFiles(caseId: string | undefined) {
  return useQuery({
    queryKey: ["ld_digital_files", caseId],
    enabled: !!caseId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_digital_files" as any)
        .select("*")
        .eq("case_id", caseId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as LdDigitalFile[];
    },
  });
}

export function useAddLdDigitalFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (file: Omit<LdDigitalFile, "id" | "created_at">) => {
      const { error } = await supabase.from("ld_digital_files" as any).insert(file as any);
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["ld_digital_files", vars.case_id] }),
  });
}

export function useDeleteLdDigitalFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, caseId }: { id: string; caseId: string }) => {
      const { error } = await supabase.from("ld_digital_files" as any).delete().eq("id", id);
      if (error) throw error;
      return caseId;
    },
    onSuccess: (caseId) => qc.invalidateQueries({ queryKey: ["ld_digital_files", caseId] }),
  });
}

// ==================== SHADE LIBRARY ====================

export function useLdShadeLibrary() {
  return useQuery({
    queryKey: ["ld_shade_library"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ld_shade_library" as any)
        .select("*")
        .order("shade_system")
        .order("shade_code");
      if (error) throw error;
      return data as unknown as LdShadeLibrary[];
    },
  });
}

export function useAddLdShade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (shade: Omit<LdShadeLibrary, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("ld_shade_library" as any).insert(shade as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_shade_library"] }),
  });
}

export function useUpdateLdShade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<LdShadeLibrary>) => {
      const { error } = await supabase.from("ld_shade_library" as any).update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_shade_library"] }),
  });
}

export function useDeleteLdShade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ld_shade_library" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_shade_library"] }),
  });
}

// ==================== TECHNICIAN SKILLS ====================

export function useLdTechnicianSkills(technicianId?: string) {
  return useQuery({
    queryKey: ["ld_technician_skills", technicianId],
    queryFn: async () => {
      let query = supabase.from("ld_technician_skills" as any).select("*");
      if (technicianId) query = query.eq("technician_id", technicianId);
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as LdTechnicianSkill[];
    },
  });
}

export function useAddLdTechnicianSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (skill: Omit<LdTechnicianSkill, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("ld_technician_skills" as any).insert(skill as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_technician_skills"] }),
  });
}

export function useUpdateLdTechnicianSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<LdTechnicianSkill>) => {
      const { error } = await supabase.from("ld_technician_skills" as any).update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_technician_skills"] }),
  });
}

export function useDeleteLdTechnicianSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ld_technician_skills" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_technician_skills"] }),
  });
}

// ==================== PICKUP SCHEDULES ====================

export function useLdPickupSchedules(dateFilter?: string) {
  return useQuery({
    queryKey: ["ld_pickup_schedules", dateFilter],
    queryFn: async () => {
      let query = supabase.from("ld_pickup_schedules" as any).select("*");
      if (dateFilter) query = query.eq("pickup_date", dateFilter);
      const { data, error } = await query.order("pickup_date", { ascending: true }).order("pickup_time", { ascending: true });
      if (error) throw error;
      return data as unknown as LdPickupSchedule[];
    },
  });
}

export function useAddLdPickupSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (schedule: Omit<LdPickupSchedule, "id" | "created_at" | "updated_at">) => {
      const { error } = await supabase.from("ld_pickup_schedules" as any).insert(schedule as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_pickup_schedules"] }),
  });
}

export function useUpdateLdPickupSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<LdPickupSchedule>) => {
      const { error } = await supabase.from("ld_pickup_schedules" as any).update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_pickup_schedules"] }),
  });
}

export function useDeleteLdPickupSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ld_pickup_schedules" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ld_pickup_schedules"] }),
  });
}
