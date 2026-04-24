export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          created_at: string
          description: string
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          chair: string | null
          created_at: string
          id: string
          is_walk_in: boolean
          notes: string | null
          patient_id: string
          series_id: string | null
          staff_id: string
          status: string
          treatment_id: string | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          chair?: string | null
          created_at?: string
          id?: string
          is_walk_in?: boolean
          notes?: string | null
          patient_id: string
          series_id?: string | null
          staff_id: string
          status?: string
          treatment_id?: string | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          chair?: string | null
          created_at?: string
          id?: string
          is_walk_in?: boolean
          notes?: string | null
          patient_id?: string
          series_id?: string | null
          staff_id?: string
          status?: string
          treatment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "recurring_appointment_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_chairs: {
        Row: {
          created_at: string
          id: string
          name: string
          room: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          room?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          room?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      clinic_documents: {
        Row: {
          category: string
          created_at: string
          expiry_date: string | null
          file_url: string
          id: string
          notes: string | null
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          expiry_date?: string | null
          file_url: string
          id?: string
          notes?: string | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          expiry_date?: string | null
          file_url?: string
          id?: string
          notes?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      clinic_settings: {
        Row: {
          address: string | null
          clinic_name: string
          closing_time: string | null
          email: string | null
          id: string
          opening_time: string | null
          phone: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          clinic_name?: string
          closing_time?: string | null
          email?: string | null
          id?: string
          opening_time?: string | null
          phone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          clinic_name?: string
          closing_time?: string | null
          email?: string | null
          id?: string
          opening_time?: string | null
          phone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      clinical_notes: {
        Row: {
          appointment_id: string | null
          assessment: string | null
          created_at: string
          created_by: string | null
          id: string
          objective: string | null
          patient_id: string
          plan: string | null
          subjective: string | null
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          assessment?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          objective?: string | null
          patient_id: string
          plan?: string | null
          subjective?: string | null
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          assessment?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          objective?: string | null
          patient_id?: string
          plan?: string | null
          subjective?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_notes_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_notes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_form_templates: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      dental_chart_entries: {
        Row: {
          created_at: string
          dentist_id: string | null
          entry_date: string
          id: string
          notes: string | null
          patient_id: string
          procedure: string
          status: string
          tooth_number: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          dentist_id?: string | null
          entry_date?: string
          id?: string
          notes?: string | null
          patient_id: string
          procedure: string
          status?: string
          tooth_number: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          dentist_id?: string | null
          entry_date?: string
          id?: string
          notes?: string | null
          patient_id?: string
          procedure?: string
          status?: string
          tooth_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dental_chart_entries_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dental_chart_entries_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          expense_date: string
          id: string
          payment_method: string | null
          receipt_reference: string | null
          updated_at: string
          vendor: string
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          payment_method?: string | null
          receipt_reference?: string | null
          updated_at?: string
          vendor?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          payment_method?: string | null
          receipt_reference?: string | null
          updated_at?: string
          vendor?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category: string
          created_at: string
          id: string
          last_restocked: string | null
          min_stock: number
          name: string
          quantity: number
          supplier: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          last_restocked?: string | null
          min_stock?: number
          name: string
          quantity?: number
          supplier?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          last_restocked?: string | null
          min_stock?: number
          name?: string
          quantity?: number
          supplier?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          line_total: number
          quantity: number
          treatment_id: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          invoice_id: string
          line_total?: number
          quantity?: number
          treatment_id?: string | null
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          line_total?: number
          quantity?: number
          treatment_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number
          created_at: string
          discount_percent: number
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          patient_id: string
          payment_method: string | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          created_at?: string
          discount_percent?: number
          id?: string
          invoice_date?: string
          invoice_number: string
          notes?: string | null
          patient_id: string
          payment_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          discount_percent?: number
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          patient_id?: string
          payment_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_allocation_rules: {
        Row: {
          category: string
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean
          percentage: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          percentage?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          percentage?: number
          updated_at?: string
        }
        Relationships: []
      }
      lab_case_history: {
        Row: {
          changed_by: string | null
          created_at: string
          field_changed: string
          id: string
          lab_case_id: string
          new_value: string | null
          old_value: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          field_changed: string
          id?: string
          lab_case_id: string
          new_value?: string | null
          old_value?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          field_changed?: string
          id?: string
          lab_case_id?: string
          new_value?: string | null
          old_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_case_history_lab_case_id_fkey"
            columns: ["lab_case_id"]
            isOneToOne: false
            referencedRelation: "lab_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_case_images: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          lab_case_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          lab_case_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          lab_case_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_case_images_lab_case_id_fkey"
            columns: ["lab_case_id"]
            isOneToOne: false
            referencedRelation: "lab_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_case_notes: {
        Row: {
          created_at: string
          id: string
          lab_case_id: string
          note: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lab_case_id: string
          note: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lab_case_id?: string
          note?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lab_case_notes_lab_case_id_fkey"
            columns: ["lab_case_id"]
            isOneToOne: false
            referencedRelation: "lab_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_cases: {
        Row: {
          assigned_technician_id: string | null
          case_number: string
          clinic_code: string | null
          clinic_doctor_name: string | null
          completed_date: string | null
          created_at: string
          delivered_date: string | null
          delivery_method: string | null
          dentist_id: string
          discount: number | null
          due_date: string | null
          id: string
          instructions: string | null
          is_paid: boolean
          is_urgent: boolean
          job_description: string | null
          job_instructions: string[] | null
          lab_client_id: string | null
          lab_fee: number
          net_amount: number | null
          patient_id: string
          registered_by: string | null
          registered_by_name: string | null
          remark: string | null
          sent_date: string | null
          shade: string | null
          status: string
          tooth_number: number | null
          treatment_id: string | null
          updated_at: string
          work_type: string
        }
        Insert: {
          assigned_technician_id?: string | null
          case_number?: string
          clinic_code?: string | null
          clinic_doctor_name?: string | null
          completed_date?: string | null
          created_at?: string
          delivered_date?: string | null
          delivery_method?: string | null
          dentist_id: string
          discount?: number | null
          due_date?: string | null
          id?: string
          instructions?: string | null
          is_paid?: boolean
          is_urgent?: boolean
          job_description?: string | null
          job_instructions?: string[] | null
          lab_client_id?: string | null
          lab_fee?: number
          net_amount?: number | null
          patient_id: string
          registered_by?: string | null
          registered_by_name?: string | null
          remark?: string | null
          sent_date?: string | null
          shade?: string | null
          status?: string
          tooth_number?: number | null
          treatment_id?: string | null
          updated_at?: string
          work_type: string
        }
        Update: {
          assigned_technician_id?: string | null
          case_number?: string
          clinic_code?: string | null
          clinic_doctor_name?: string | null
          completed_date?: string | null
          created_at?: string
          delivered_date?: string | null
          delivery_method?: string | null
          dentist_id?: string
          discount?: number | null
          due_date?: string | null
          id?: string
          instructions?: string | null
          is_paid?: boolean
          is_urgent?: boolean
          job_description?: string | null
          job_instructions?: string[] | null
          lab_client_id?: string | null
          lab_fee?: number
          net_amount?: number | null
          patient_id?: string
          registered_by?: string | null
          registered_by_name?: string | null
          remark?: string | null
          sent_date?: string | null
          shade?: string | null
          status?: string
          tooth_number?: number | null
          treatment_id?: string | null
          updated_at?: string
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_cases_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_cases_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_cases_lab_client_id_fkey"
            columns: ["lab_client_id"]
            isOneToOne: false
            referencedRelation: "lab_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_cases_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_cases_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_clients: {
        Row: {
          address: string | null
          clinic_code: string | null
          clinic_name: string
          created_at: string
          doctor_name: string
          email: string | null
          id: string
          notes: string | null
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          clinic_code?: string | null
          clinic_name: string
          created_at?: string
          doctor_name: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          clinic_code?: string | null
          clinic_name?: string
          created_at?: string
          doctor_name?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      lab_invoices: {
        Row: {
          amount_paid: number
          clinic_code: string | null
          clinic_doctor_name: string | null
          created_at: string
          created_by: string | null
          deposit_amount: number
          discount: number
          due_date: string | null
          id: string
          invoice_date: string
          invoice_number: string
          lab_case_id: string | null
          notes: string | null
          patient_name: string | null
          status: string
          subtotal: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          clinic_code?: string | null
          clinic_doctor_name?: string | null
          created_at?: string
          created_by?: string | null
          deposit_amount?: number
          discount?: number
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          lab_case_id?: string | null
          notes?: string | null
          patient_name?: string | null
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          clinic_code?: string | null
          clinic_doctor_name?: string | null
          created_at?: string
          created_by?: string | null
          deposit_amount?: number
          discount?: number
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          lab_case_id?: string | null
          notes?: string | null
          patient_name?: string | null
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_invoices_lab_case_id_fkey"
            columns: ["lab_case_id"]
            isOneToOne: false
            referencedRelation: "lab_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_orders: {
        Row: {
          created_at: string
          dentist_id: string
          due_date: string | null
          id: string
          lab_name: string
          lab_work_type: string
          notes: string | null
          patient_id: string
          received_date: string | null
          sent_date: string | null
          status: string
          treatment_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dentist_id: string
          due_date?: string | null
          id?: string
          lab_name?: string
          lab_work_type: string
          notes?: string | null
          patient_id: string
          received_date?: string | null
          sent_date?: string | null
          status?: string
          treatment_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dentist_id?: string
          due_date?: string | null
          id?: string
          lab_name?: string
          lab_work_type?: string
          notes?: string | null
          patient_id?: string
          received_date?: string | null
          sent_date?: string | null
          status?: string
          treatment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_orders_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_orders_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_revenue_allocations: {
        Row: {
          amount: number
          category: string
          created_at: string
          id: string
          lab_invoice_id: string
          percentage: number
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          id?: string
          lab_invoice_id: string
          percentage: number
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          lab_invoice_id?: string
          percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "lab_revenue_allocations_lab_invoice_id_fkey"
            columns: ["lab_invoice_id"]
            isOneToOne: false
            referencedRelation: "lab_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_settings: {
        Row: {
          address: string | null
          email: string | null
          id: string
          lab_name: string
          phone: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          email?: string | null
          id?: string
          lab_name?: string
          phone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          email?: string | null
          id?: string
          lab_name?: string
          phone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      ld_activity_log: {
        Row: {
          created_at: string
          description: string
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ld_case_history: {
        Row: {
          changed_by: string | null
          changed_by_name: string | null
          created_at: string
          field_changed: string
          id: string
          lab_case_id: string
          new_value: string | null
          old_value: string | null
        }
        Insert: {
          changed_by?: string | null
          changed_by_name?: string | null
          created_at?: string
          field_changed: string
          id?: string
          lab_case_id: string
          new_value?: string | null
          old_value?: string | null
        }
        Update: {
          changed_by?: string | null
          changed_by_name?: string | null
          created_at?: string
          field_changed?: string
          id?: string
          lab_case_id?: string
          new_value?: string | null
          old_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ld_case_history_lab_case_id_fkey"
            columns: ["lab_case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_case_images: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          lab_case_id: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          lab_case_id: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          lab_case_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ld_case_images_lab_case_id_fkey"
            columns: ["lab_case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_case_materials: {
        Row: {
          case_id: string | null
          id: string
          inventory_id: string | null
          material_name: string
          notes: string | null
          quantity_used: number
          total_cost: number
          unit: string
          unit_cost: number
          used_at: string
          used_by: string | null
        }
        Insert: {
          case_id?: string | null
          id?: string
          inventory_id?: string | null
          material_name: string
          notes?: string | null
          quantity_used?: number
          total_cost?: number
          unit?: string
          unit_cost?: number
          used_at?: string
          used_by?: string | null
        }
        Update: {
          case_id?: string | null
          id?: string
          inventory_id?: string | null
          material_name?: string
          notes?: string | null
          quantity_used?: number
          total_cost?: number
          unit?: string
          unit_cost?: number
          used_at?: string
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ld_case_materials_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_case_materials_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "ld_inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_case_notes: {
        Row: {
          created_at: string
          id: string
          lab_case_id: string
          note: string
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lab_case_id: string
          note: string
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lab_case_id?: string
          note?: string
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ld_case_notes_lab_case_id_fkey"
            columns: ["lab_case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_cases: {
        Row: {
          assigned_technician_id: string | null
          bonus_reassignment_tech_id: string | null
          case_number: string
          clasp_cost: number | null
          clasp_units: number | null
          client_id: string | null
          completed_date: string | null
          completion_type: string | null
          courier_amount: number | null
          courier_name: string | null
          created_at: string
          created_by: string | null
          date_out: string | null
          delivered_date: string | null
          delivery_method: string | null
          delivery_notes: string | null
          deposit_amount: number | null
          discount: number | null
          due_date: string | null
          express_surcharge: number | null
          external_lab_id: string | null
          gingival_masking: boolean | null
          gingival_masking_cost: number | null
          id: string
          instructions: string | null
          is_paid: boolean
          is_urgent: boolean
          job_description: string | null
          lab_fee: number
          net_amount: number | null
          original_technician_id: string | null
          patient_name: string
          qc_passed: boolean | null
          qc_passed_at: string | null
          qc_passed_by: string | null
          received_date: string | null
          remark: string | null
          repeat_of_case_id: string | null
          shade: string | null
          started_date: string | null
          status: string
          tooth_number: number | null
          tracking_number: string | null
          updated_at: string
          work_type_id: string | null
          work_type_name: string
        }
        Insert: {
          assigned_technician_id?: string | null
          bonus_reassignment_tech_id?: string | null
          case_number?: string
          clasp_cost?: number | null
          clasp_units?: number | null
          client_id?: string | null
          completed_date?: string | null
          completion_type?: string | null
          courier_amount?: number | null
          courier_name?: string | null
          created_at?: string
          created_by?: string | null
          date_out?: string | null
          delivered_date?: string | null
          delivery_method?: string | null
          delivery_notes?: string | null
          deposit_amount?: number | null
          discount?: number | null
          due_date?: string | null
          express_surcharge?: number | null
          external_lab_id?: string | null
          gingival_masking?: boolean | null
          gingival_masking_cost?: number | null
          id?: string
          instructions?: string | null
          is_paid?: boolean
          is_urgent?: boolean
          job_description?: string | null
          lab_fee?: number
          net_amount?: number | null
          original_technician_id?: string | null
          patient_name?: string
          qc_passed?: boolean | null
          qc_passed_at?: string | null
          qc_passed_by?: string | null
          received_date?: string | null
          remark?: string | null
          repeat_of_case_id?: string | null
          shade?: string | null
          started_date?: string | null
          status?: string
          tooth_number?: number | null
          tracking_number?: string | null
          updated_at?: string
          work_type_id?: string | null
          work_type_name?: string
        }
        Update: {
          assigned_technician_id?: string | null
          bonus_reassignment_tech_id?: string | null
          case_number?: string
          clasp_cost?: number | null
          clasp_units?: number | null
          client_id?: string | null
          completed_date?: string | null
          completion_type?: string | null
          courier_amount?: number | null
          courier_name?: string | null
          created_at?: string
          created_by?: string | null
          date_out?: string | null
          delivered_date?: string | null
          delivery_method?: string | null
          delivery_notes?: string | null
          deposit_amount?: number | null
          discount?: number | null
          due_date?: string | null
          express_surcharge?: number | null
          external_lab_id?: string | null
          gingival_masking?: boolean | null
          gingival_masking_cost?: number | null
          id?: string
          instructions?: string | null
          is_paid?: boolean
          is_urgent?: boolean
          job_description?: string | null
          lab_fee?: number
          net_amount?: number | null
          original_technician_id?: string | null
          patient_name?: string
          qc_passed?: boolean | null
          qc_passed_at?: string | null
          qc_passed_by?: string | null
          received_date?: string | null
          remark?: string | null
          repeat_of_case_id?: string | null
          shade?: string | null
          started_date?: string | null
          status?: string
          tooth_number?: number | null
          tracking_number?: string | null
          updated_at?: string
          work_type_id?: string | null
          work_type_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "ld_cases_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "ld_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_cases_bonus_reassignment_tech_id_fkey"
            columns: ["bonus_reassignment_tech_id"]
            isOneToOne: false
            referencedRelation: "ld_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_cases_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "ld_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_cases_external_lab_id_fkey"
            columns: ["external_lab_id"]
            isOneToOne: false
            referencedRelation: "ld_external_labs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_cases_original_technician_id_fkey"
            columns: ["original_technician_id"]
            isOneToOne: false
            referencedRelation: "ld_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_cases_repeat_of_case_id_fkey"
            columns: ["repeat_of_case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_cases_work_type_id_fkey"
            columns: ["work_type_id"]
            isOneToOne: false
            referencedRelation: "ld_work_types"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_client_prices: {
        Row: {
          client_id: string | null
          created_at: string
          created_by: string | null
          custom_price: number
          discount_percent: number | null
          effective_from: string | null
          effective_to: string | null
          id: string
          notes: string | null
          updated_at: string
          work_type_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          custom_price?: number
          discount_percent?: number | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
          work_type_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          custom_price?: number
          discount_percent?: number | null
          effective_from?: string | null
          effective_to?: string | null
          id?: string
          notes?: string | null
          updated_at?: string
          work_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ld_client_prices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "ld_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_client_prices_work_type_id_fkey"
            columns: ["work_type_id"]
            isOneToOne: false
            referencedRelation: "ld_work_types"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_clients: {
        Row: {
          address: string | null
          clinic_code: string | null
          clinic_name: string
          created_at: string
          doctor_name: string
          email: string | null
          id: string
          notes: string | null
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          clinic_code?: string | null
          clinic_name: string
          created_at?: string
          doctor_name: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          clinic_code?: string | null
          clinic_name?: string
          created_at?: string
          doctor_name?: string
          email?: string | null
          id?: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      ld_communications: {
        Row: {
          case_id: string | null
          client_id: string | null
          communicated_at: string
          communicated_by: string | null
          communicated_by_name: string | null
          communication_type: string
          contact_person: string | null
          content: string | null
          created_at: string
          direction: string
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          subject: string | null
        }
        Insert: {
          case_id?: string | null
          client_id?: string | null
          communicated_at?: string
          communicated_by?: string | null
          communicated_by_name?: string | null
          communication_type?: string
          contact_person?: string | null
          content?: string | null
          created_at?: string
          direction?: string
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          subject?: string | null
        }
        Update: {
          case_id?: string | null
          client_id?: string | null
          communicated_at?: string
          communicated_by?: string | null
          communicated_by_name?: string | null
          communication_type?: string
          contact_person?: string | null
          content?: string | null
          created_at?: string
          direction?: string
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ld_communications_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_communications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "ld_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_credit_notes: {
        Row: {
          amount: number
          case_id: string | null
          client_id: string | null
          created_at: string
          created_by: string | null
          id: string
          invoice_id: string | null
          note_number: string
          reason: string
          type: string
        }
        Insert: {
          amount?: number
          case_id?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          note_number?: string
          reason?: string
          type?: string
        }
        Update: {
          amount?: number
          case_id?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          note_number?: string
          reason?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ld_credit_notes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_credit_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "ld_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_credit_notes_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "ld_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_digital_files: {
        Row: {
          case_id: string | null
          created_at: string
          description: string | null
          file_name: string
          file_size_kb: number | null
          file_type: string
          file_url: string
          id: string
          uploaded_by: string | null
          uploaded_by_name: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          description?: string | null
          file_name: string
          file_size_kb?: number | null
          file_type?: string
          file_url: string
          id?: string
          uploaded_by?: string | null
          uploaded_by_name?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string
          description?: string | null
          file_name?: string
          file_size_kb?: number | null
          file_type?: string
          file_url?: string
          id?: string
          uploaded_by?: string | null
          uploaded_by_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ld_digital_files_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_equipment: {
        Row: {
          created_at: string
          id: string
          location: string | null
          model: string | null
          name: string
          notes: string | null
          purchase_date: string | null
          serial_number: string | null
          status: string
          updated_at: string
          warranty_expiry: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          model?: string | null
          name: string
          notes?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
          warranty_expiry?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          model?: string | null
          name?: string
          notes?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string
          updated_at?: string
          warranty_expiry?: string | null
        }
        Relationships: []
      }
      ld_equipment_maintenance: {
        Row: {
          cost: number | null
          created_at: string
          created_by: string | null
          description: string | null
          equipment_id: string | null
          id: string
          maintenance_date: string
          maintenance_type: string
          next_maintenance_date: string | null
          notes: string | null
          performed_by: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          equipment_id?: string | null
          id?: string
          maintenance_date?: string
          maintenance_type?: string
          next_maintenance_date?: string | null
          notes?: string | null
          performed_by?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          equipment_id?: string | null
          id?: string
          maintenance_date?: string
          maintenance_type?: string
          next_maintenance_date?: string | null
          notes?: string | null
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ld_equipment_maintenance_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "ld_equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_expense_categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      ld_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          expense_date: string
          id: string
          payment_method: string | null
          receipt_reference: string | null
          updated_at: string | null
          vendor: string | null
        }
        Insert: {
          amount?: number
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          payment_method?: string | null
          receipt_reference?: string | null
          updated_at?: string | null
          vendor?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          payment_method?: string | null
          receipt_reference?: string | null
          updated_at?: string | null
          vendor?: string | null
        }
        Relationships: []
      }
      ld_external_lab_payments: {
        Row: {
          amount: number
          case_id: string | null
          created_at: string
          created_by: string | null
          external_lab_id: string
          id: string
          notes: string | null
          payment_date: string
          unit_type: string
          units: number
          updated_at: string
        }
        Insert: {
          amount?: number
          case_id?: string | null
          created_at?: string
          created_by?: string | null
          external_lab_id: string
          id?: string
          notes?: string | null
          payment_date?: string
          unit_type?: string
          units?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          case_id?: string | null
          created_at?: string
          created_by?: string | null
          external_lab_id?: string
          id?: string
          notes?: string | null
          payment_date?: string
          unit_type?: string
          units?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ld_external_lab_payments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_external_lab_payments_external_lab_id_fkey"
            columns: ["external_lab_id"]
            isOneToOne: false
            referencedRelation: "ld_external_labs"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_external_labs: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          specialties: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      ld_inventory: {
        Row: {
          category: string
          created_at: string
          id: string
          last_restocked: string | null
          min_stock: number
          name: string
          notes: string | null
          quantity: number
          supplier: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          last_restocked?: string | null
          min_stock?: number
          name: string
          notes?: string | null
          quantity?: number
          supplier?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          last_restocked?: string | null
          min_stock?: number
          name?: string
          notes?: string | null
          quantity?: number
          supplier?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      ld_invoice_items: {
        Row: {
          code: string | null
          created_at: string | null
          date_in: string | null
          id: string
          invoice_id: string
          job_description: string | null
          lab_case_id: string | null
          patient_name: string | null
          total_cost: number | null
          unit_price: number | null
          units: number | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          date_in?: string | null
          id?: string
          invoice_id: string
          job_description?: string | null
          lab_case_id?: string | null
          patient_name?: string | null
          total_cost?: number | null
          unit_price?: number | null
          units?: number | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          date_in?: string | null
          id?: string
          invoice_id?: string
          job_description?: string | null
          lab_case_id?: string | null
          patient_name?: string | null
          total_cost?: number | null
          unit_price?: number | null
          units?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ld_invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "ld_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_invoice_items_lab_case_id_fkey"
            columns: ["lab_case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_invoices: {
        Row: {
          amount_paid: number
          case_id: string | null
          client_id: string | null
          created_at: string
          created_by: string | null
          date_from: string | null
          date_to: string | null
          deposit_amount: number | null
          discount: number
          due_date: string | null
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          patient_name: string | null
          status: string
          subtotal: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          case_id?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          date_from?: string | null
          date_to?: string | null
          deposit_amount?: number | null
          discount?: number
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          patient_name?: string | null
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          case_id?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          date_from?: string | null
          date_to?: string | null
          deposit_amount?: number | null
          discount?: number
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          patient_name?: string | null
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ld_invoices_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "ld_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_outsourced_cases: {
        Row: {
          actual_return_date: string | null
          case_id: string | null
          cost: number
          created_at: string
          created_by: string | null
          expected_return_date: string | null
          external_lab_id: string | null
          id: string
          notes: string | null
          sent_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          actual_return_date?: string | null
          case_id?: string | null
          cost?: number
          created_at?: string
          created_by?: string | null
          expected_return_date?: string | null
          external_lab_id?: string | null
          id?: string
          notes?: string | null
          sent_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          actual_return_date?: string | null
          case_id?: string | null
          cost?: number
          created_at?: string
          created_by?: string | null
          expected_return_date?: string | null
          external_lab_id?: string | null
          id?: string
          notes?: string | null
          sent_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ld_outsourced_cases_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_outsourced_cases_external_lab_id_fkey"
            columns: ["external_lab_id"]
            isOneToOne: false
            referencedRelation: "ld_external_labs"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_payments: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string
          id: string
          invoice_id: string | null
          payment_date: string
          payment_method: string
          reference: string | null
          remark: string | null
        }
        Insert: {
          amount?: number
          client_id?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          payment_date?: string
          payment_method?: string
          reference?: string | null
          remark?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          payment_date?: string
          payment_method?: string
          reference?: string | null
          remark?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ld_payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "ld_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "ld_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_pickup_schedules: {
        Row: {
          client_id: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          driver_name: string | null
          driver_phone: string | null
          estimated_cases: number | null
          id: string
          notes: string | null
          pickup_date: string
          pickup_time: string | null
          pickup_type: string
          status: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          estimated_cases?: number | null
          id?: string
          notes?: string | null
          pickup_date: string
          pickup_time?: string | null
          pickup_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          estimated_cases?: number | null
          id?: string
          notes?: string | null
          pickup_date?: string
          pickup_time?: string | null
          pickup_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ld_pickup_schedules_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "ld_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_quality_checks: {
        Row: {
          check_item: string
          checked_at: string | null
          checked_by: string | null
          checked_by_name: string | null
          created_at: string
          id: string
          is_passed: boolean
          lab_case_id: string
          notes: string | null
        }
        Insert: {
          check_item: string
          checked_at?: string | null
          checked_by?: string | null
          checked_by_name?: string | null
          created_at?: string
          id?: string
          is_passed?: boolean
          lab_case_id: string
          notes?: string | null
        }
        Update: {
          check_item?: string
          checked_at?: string | null
          checked_by?: string | null
          checked_by_name?: string | null
          created_at?: string
          id?: string
          is_passed?: boolean
          lab_case_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ld_quality_checks_lab_case_id_fkey"
            columns: ["lab_case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_recurring_orders: {
        Row: {
          client_id: string | null
          created_at: string
          created_by: string | null
          frequency: string
          id: string
          instructions: string | null
          is_active: boolean
          lab_fee: number
          last_generated_date: string | null
          next_due_date: string | null
          patient_name: string
          shade: string | null
          updated_at: string
          work_type_id: string | null
          work_type_name: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          frequency?: string
          id?: string
          instructions?: string | null
          is_active?: boolean
          lab_fee?: number
          last_generated_date?: string | null
          next_due_date?: string | null
          patient_name?: string
          shade?: string | null
          updated_at?: string
          work_type_id?: string | null
          work_type_name?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          frequency?: string
          id?: string
          instructions?: string | null
          is_active?: boolean
          lab_fee?: number
          last_generated_date?: string | null
          next_due_date?: string | null
          patient_name?: string
          shade?: string | null
          updated_at?: string
          work_type_id?: string | null
          work_type_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "ld_recurring_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "ld_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_recurring_orders_work_type_id_fkey"
            columns: ["work_type_id"]
            isOneToOne: false
            referencedRelation: "ld_work_types"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_remaining_categories: {
        Row: {
          category_name: string
          created_at: string
          id: string
          is_active: boolean
          percentage: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_name: string
          created_at?: string
          id?: string
          is_active?: boolean
          percentage?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          percentage?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      ld_salary_config: {
        Row: {
          basic_percentage: number
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          output_percentage: number
          staff_id: string
          updated_at: string
        }
        Insert: {
          basic_percentage?: number
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          output_percentage?: number
          staff_id: string
          updated_at?: string
        }
        Update: {
          basic_percentage?: number
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          output_percentage?: number
          staff_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ld_salary_config_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "ld_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_salary_deductions: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          deduction_type: string
          id: string
          notes: string | null
          period_end: string
          period_start: string
          staff_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          created_by?: string | null
          deduction_type: string
          id?: string
          notes?: string | null
          period_end: string
          period_start: string
          staff_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          deduction_type?: string
          id?: string
          notes?: string | null
          period_end?: string
          period_start?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ld_salary_deductions_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "ld_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_settings: {
        Row: {
          address: string | null
          email: string | null
          id: string
          lab_name: string
          logo_url: string | null
          phone: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          email?: string | null
          id?: string
          lab_name?: string
          logo_url?: string | null
          phone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          email?: string | null
          id?: string
          lab_name?: string
          logo_url?: string | null
          phone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      ld_shade_library: {
        Row: {
          color_hex: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          shade_code: string
          shade_name: string
          shade_system: string
          updated_at: string
        }
        Insert: {
          color_hex?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          shade_code: string
          shade_name: string
          shade_system?: string
          updated_at?: string
        }
        Update: {
          color_hex?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          shade_code?: string
          shade_name?: string
          shade_system?: string
          updated_at?: string
        }
        Relationships: []
      }
      ld_shared_allocations: {
        Row: {
          case_id: string
          created_at: string
          helper_tech_id: string
          id: string
          original_tech_id: string
          reason: string | null
          recorded_by: string | null
          recorded_by_name: string | null
          share_percentage: number
        }
        Insert: {
          case_id: string
          created_at?: string
          helper_tech_id: string
          id?: string
          original_tech_id: string
          reason?: string | null
          recorded_by?: string | null
          recorded_by_name?: string | null
          share_percentage?: number
        }
        Update: {
          case_id?: string
          created_at?: string
          helper_tech_id?: string
          id?: string
          original_tech_id?: string
          reason?: string | null
          recorded_by?: string | null
          recorded_by_name?: string | null
          share_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "ld_shared_allocations_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_shared_allocations_helper_tech_id_fkey"
            columns: ["helper_tech_id"]
            isOneToOne: false
            referencedRelation: "ld_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_shared_allocations_original_tech_id_fkey"
            columns: ["original_tech_id"]
            isOneToOne: false
            referencedRelation: "ld_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_shipment_cases: {
        Row: {
          case_id: string | null
          created_at: string
          id: string
          shipment_id: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          id?: string
          shipment_id?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string
          id?: string
          shipment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ld_shipment_cases_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_shipment_cases_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "ld_shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_shipments: {
        Row: {
          client_id: string | null
          courier_name: string | null
          created_at: string
          created_by: string | null
          delivery_method: string
          dispatched_at: string | null
          dispatched_by: string | null
          id: string
          notes: string | null
          shipment_date: string
          shipment_number: string
          status: string
          total_cases: number
          tracking_number: string | null
        }
        Insert: {
          client_id?: string | null
          courier_name?: string | null
          created_at?: string
          created_by?: string | null
          delivery_method?: string
          dispatched_at?: string | null
          dispatched_by?: string | null
          id?: string
          notes?: string | null
          shipment_date?: string
          shipment_number?: string
          status?: string
          total_cases?: number
          tracking_number?: string | null
        }
        Update: {
          client_id?: string | null
          courier_name?: string | null
          created_at?: string
          created_by?: string | null
          delivery_method?: string
          dispatched_at?: string | null
          dispatched_by?: string | null
          id?: string
          notes?: string | null
          shipment_date?: string
          shipment_number?: string
          status?: string
          total_cases?: number
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ld_shipments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "ld_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_staff: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          role: string
          seniority_level: number | null
          specialty: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          role?: string
          seniority_level?: number | null
          specialty?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: string
          seniority_level?: number | null
          specialty?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ld_staff_revenue_allocations: {
        Row: {
          allocated_amount: number | null
          allocation_type: string
          created_at: string | null
          id: string
          jobs_count: number | null
          notes: string | null
          period_end: string
          period_start: string
          staff_id: string
          total_revenue: number | null
        }
        Insert: {
          allocated_amount?: number | null
          allocation_type?: string
          created_at?: string | null
          id?: string
          jobs_count?: number | null
          notes?: string | null
          period_end: string
          period_start: string
          staff_id: string
          total_revenue?: number | null
        }
        Update: {
          allocated_amount?: number | null
          allocation_type?: string
          created_at?: string | null
          id?: string
          jobs_count?: number | null
          notes?: string | null
          period_end?: string
          period_start?: string
          staff_id?: string
          total_revenue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ld_staff_revenue_allocations_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "ld_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_technician_skills: {
        Row: {
          certification_date: string | null
          certified: boolean | null
          created_at: string
          id: string
          notes: string | null
          proficiency_level: string
          technician_id: string | null
          updated_at: string
          work_type_id: string | null
        }
        Insert: {
          certification_date?: string | null
          certified?: boolean | null
          created_at?: string
          id?: string
          notes?: string | null
          proficiency_level?: string
          technician_id?: string | null
          updated_at?: string
          work_type_id?: string | null
        }
        Update: {
          certification_date?: string | null
          certified?: boolean | null
          created_at?: string
          id?: string
          notes?: string | null
          proficiency_level?: string
          technician_id?: string | null
          updated_at?: string
          work_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ld_technician_skills_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "ld_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ld_technician_skills_work_type_id_fkey"
            columns: ["work_type_id"]
            isOneToOne: false
            referencedRelation: "ld_work_types"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_warranties: {
        Row: {
          case_id: string | null
          claim_date: string | null
          claim_reason: string | null
          claim_resolution: string | null
          created_at: string
          end_date: string
          id: string
          notes: string | null
          start_date: string
          status: string
          updated_at: string
          warranty_months: number
        }
        Insert: {
          case_id?: string | null
          claim_date?: string | null
          claim_reason?: string | null
          claim_resolution?: string | null
          created_at?: string
          end_date: string
          id?: string
          notes?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          warranty_months?: number
        }
        Update: {
          case_id?: string | null
          claim_date?: string | null
          claim_reason?: string | null
          claim_resolution?: string | null
          created_at?: string
          end_date?: string
          id?: string
          notes?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          warranty_months?: number
        }
        Relationships: [
          {
            foreignKeyName: "ld_warranties_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "ld_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      ld_work_types: {
        Row: {
          base_price: number
          category: string
          created_at: string
          description: string | null
          estimated_days: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          base_price?: number
          category?: string
          created_at?: string
          description?: string | null
          estimated_days?: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          base_price?: number
          category?: string
          created_at?: string
          description?: string | null
          estimated_days?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          channel: string
          created_at: string
          created_by: string | null
          delivered_count: number
          failed_count: number
          id: string
          media_urls: string[] | null
          message_body: string
          name: string
          read_count: number
          scheduled_at: string | null
          sent_at: string | null
          status: string
          subject: string | null
          target_filter: Json | null
          template_name: string | null
          total_recipients: number
          updated_at: string
        }
        Insert: {
          channel?: string
          created_at?: string
          created_by?: string | null
          delivered_count?: number
          failed_count?: number
          id?: string
          media_urls?: string[] | null
          message_body?: string
          name: string
          read_count?: number
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          target_filter?: Json | null
          template_name?: string | null
          total_recipients?: number
          updated_at?: string
        }
        Update: {
          channel?: string
          created_at?: string
          created_by?: string | null
          delivered_count?: number
          failed_count?: number
          id?: string
          media_urls?: string[] | null
          message_body?: string
          name?: string
          read_count?: number
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          target_filter?: Json | null
          template_name?: string | null
          total_recipients?: number
          updated_at?: string
        }
        Relationships: []
      }
      marketing_messages: {
        Row: {
          campaign_id: string
          channel: string
          created_at: string
          delivered_at: string | null
          error_message: string | null
          id: string
          patient_id: string
          read_at: string | null
          recipient_email: string | null
          recipient_phone: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          campaign_id: string
          channel?: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          patient_id: string
          read_at?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          campaign_id?: string
          channel?: string
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          patient_id?: string
          read_at?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_messages_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_templates: {
        Row: {
          body: string
          category: string
          channel: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          media_urls: string[] | null
          name: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          body?: string
          category?: string
          channel?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          media_urls?: string[] | null
          name: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          category?: string
          channel?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          media_urls?: string[] | null
          name?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      message_attachments: {
        Row: {
          created_at: string
          entity_id: string
          entity_label: string
          entity_type: string
          id: string
          message_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_label?: string
          entity_type: string
          id?: string
          message_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_label?: string
          entity_type?: string
          id?: string
          message_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_recipients: {
        Row: {
          created_at: string
          id: string
          message_id: string
          read: boolean
          read_at: string | null
          recipient_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          read?: boolean
          read_at?: string | null
          recipient_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          read?: boolean
          read_at?: string | null
          recipient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_recipients_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          broadcast_role: string | null
          content: string
          created_at: string
          id: string
          is_broadcast: boolean
          sender_id: string
        }
        Insert: {
          broadcast_role?: string | null
          content: string
          created_at?: string
          id?: string
          is_broadcast?: boolean
          sender_id: string
        }
        Update: {
          broadcast_role?: string | null
          content?: string
          created_at?: string
          id?: string
          is_broadcast?: boolean
          sender_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          appointment_reminders: boolean
          id: string
          lab_completion_alerts: boolean
          low_stock_alerts: boolean
          payment_alerts: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_reminders?: boolean
          id?: string
          lab_completion_alerts?: boolean
          low_stock_alerts?: boolean
          payment_alerts?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_reminders?: boolean
          id?: string
          lab_completion_alerts?: boolean
          low_stock_alerts?: boolean
          payment_alerts?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message?: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      patient_consent_forms: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: string
          patient_id: string
          signed_at: string | null
          signer_name: string | null
          status: string
          template_id: string | null
          title: string
          treatment_plan_id: string | null
          updated_at: string
          witnessed_by: string | null
        }
        Insert: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          patient_id: string
          signed_at?: string | null
          signer_name?: string | null
          status?: string
          template_id?: string | null
          title: string
          treatment_plan_id?: string | null
          updated_at?: string
          witnessed_by?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: string
          patient_id?: string
          signed_at?: string | null
          signer_name?: string | null
          status?: string
          template_id?: string | null
          title?: string
          treatment_plan_id?: string | null
          updated_at?: string
          witnessed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_consent_forms_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_consent_forms_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "consent_form_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_consent_forms_treatment_plan_id_fkey"
            columns: ["treatment_plan_id"]
            isOneToOne: false
            referencedRelation: "treatment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_documents: {
        Row: {
          category: string
          created_at: string
          file_url: string
          id: string
          notes: string | null
          patient_id: string
          title: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          file_url: string
          id?: string
          notes?: string | null
          patient_id: string
          title: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          file_url?: string
          id?: string
          notes?: string | null
          patient_id?: string
          title?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_images: {
        Row: {
          clinical_note_id: string | null
          created_at: string
          date_taken: string | null
          description: string | null
          id: string
          image_type: string
          image_url: string
          patient_id: string
          tooth_number: number | null
          uploaded_by: string | null
        }
        Insert: {
          clinical_note_id?: string | null
          created_at?: string
          date_taken?: string | null
          description?: string | null
          id?: string
          image_type?: string
          image_url: string
          patient_id: string
          tooth_number?: number | null
          uploaded_by?: string | null
        }
        Update: {
          clinical_note_id?: string | null
          created_at?: string
          date_taken?: string | null
          description?: string | null
          id?: string
          image_type?: string
          image_url?: string
          patient_id?: string
          tooth_number?: number | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_images_clinical_note_id_fkey"
            columns: ["clinical_note_id"]
            isOneToOne: false
            referencedRelation: "clinical_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_images_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_reviews: {
        Row: {
          appointment_id: string | null
          comments: string | null
          created_at: string
          dentist_id: string | null
          id: string
          patient_id: string
          rating: number
          recorded_by: string | null
          service_categories: string[] | null
        }
        Insert: {
          appointment_id?: string | null
          comments?: string | null
          created_at?: string
          dentist_id?: string | null
          id?: string
          patient_id: string
          rating: number
          recorded_by?: string | null
          service_categories?: string[] | null
        }
        Update: {
          appointment_id?: string | null
          comments?: string | null
          created_at?: string
          dentist_id?: string | null
          id?: string
          patient_id?: string
          rating?: number
          recorded_by?: string | null
          service_categories?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_reviews_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_reviews_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          allergies: string | null
          blood_group: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          medical_history: string | null
          phone: string
          referral_source: string | null
          registered_date: string
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          allergies?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          medical_history?: string | null
          phone?: string
          referral_source?: string | null
          registered_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          allergies?: string | null
          blood_group?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          medical_history?: string | null
          phone?: string
          referral_source?: string | null
          registered_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          payment_date: string
          payment_method: string
          reference: string | null
          remark: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id: string
          payment_date?: string
          payment_method?: string
          reference?: string | null
          remark?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          payment_date?: string
          payment_method?: string
          reference?: string | null
          remark?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      prescription_medications: {
        Row: {
          created_at: string
          dosage: string
          duration: string
          frequency: string
          id: string
          name: string
          prescription_id: string
        }
        Insert: {
          created_at?: string
          dosage?: string
          duration?: string
          frequency?: string
          id?: string
          name: string
          prescription_id: string
        }
        Update: {
          created_at?: string
          dosage?: string
          duration?: string
          frequency?: string
          id?: string
          name?: string
          prescription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescription_medications_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          dentist_id: string
          diagnosis: string | null
          id: string
          notes: string | null
          patient_id: string
          prescription_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dentist_id: string
          diagnosis?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          prescription_date?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dentist_id?: string
          diagnosis?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          prescription_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_dentist_id_fkey"
            columns: ["dentist_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      product_orders: {
        Row: {
          approved_by: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          id: string
          notes: string | null
          product_id: string | null
          product_name: string
          quantity: number
          status: string
          total_amount: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          notes?: string | null
          product_id?: string | null
          product_name: string
          quantity?: number
          status?: string
          total_amount?: number
          unit_price?: number
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          notes?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          status?: string
          total_amount?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          name: string
          price: number
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          name: string
          price?: number
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          name?: string
          price?: number
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recurring_appointment_rules: {
        Row: {
          chair: string | null
          created_at: string
          created_by: string | null
          day_of_week: number | null
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean
          notes: string | null
          occurrences: number | null
          patient_id: string
          staff_id: string
          treatment_id: string | null
        }
        Insert: {
          chair?: string | null
          created_at?: string
          created_by?: string | null
          day_of_week?: number | null
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          occurrences?: number | null
          patient_id: string
          staff_id: string
          treatment_id?: string | null
        }
        Update: {
          chair?: string | null
          created_at?: string
          created_by?: string | null
          day_of_week?: number | null
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          occurrences?: number | null
          patient_id?: string
          staff_id?: string
          treatment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_appointment_rules_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_appointment_rules_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_appointment_rules_treatment_id_fkey"
            columns: ["treatment_id"]
            isOneToOne: false
            referencedRelation: "treatments"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_fees: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          payment_date: string
          payment_method: string | null
          recorded_by: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          payment_date?: string
          payment_method?: string | null
          recorded_by?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          payment_date?: string
          payment_method?: string | null
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registration_fees_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      revenue_allocation_rules: {
        Row: {
          category: string
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean
          percentage: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          percentage?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          percentage?: number
          updated_at?: string
        }
        Relationships: []
      }
      revenue_allocations: {
        Row: {
          amount: number
          category: string
          created_at: string
          id: string
          payment_id: string
          percentage: number
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          id?: string
          payment_id: string
          percentage: number
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          payment_id?: string
          percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "revenue_allocations_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          phone: string | null
          role: string
          specialty: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          role?: string
          specialty?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: string
          specialty?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      staff_allocation_rules: {
        Row: {
          created_at: string
          effective_from: string
          effective_to: string | null
          id: string
          is_active: boolean
          percentage: number
          role_title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          percentage?: number
          role_title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          effective_from?: string
          effective_to?: string | null
          id?: string
          is_active?: boolean
          percentage?: number
          role_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff_revenue_allocations: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_id: string
          percentage: number
          role_title: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          payment_id: string
          percentage: number
          role_title: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_id?: string
          percentage?: number
          role_title?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_revenue_allocations_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_plan_procedures: {
        Row: {
          completed_date: string | null
          created_at: string
          estimated_cost: number | null
          id: string
          plan_id: string
          procedure_name: string
          status: string
          tooth_number: number | null
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          estimated_cost?: number | null
          id?: string
          plan_id: string
          procedure_name: string
          status?: string
          tooth_number?: number | null
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          estimated_cost?: number | null
          id?: string
          plan_id?: string
          procedure_name?: string
          status?: string
          tooth_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_plan_procedures_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "treatment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_plans: {
        Row: {
          consent_date: string | null
          consent_status: string | null
          created_at: string
          estimated_end: string | null
          id: string
          name: string
          paid_amount: number
          patient_id: string
          start_date: string
          status: string
          total_cost: number
          updated_at: string
        }
        Insert: {
          consent_date?: string | null
          consent_status?: string | null
          created_at?: string
          estimated_end?: string | null
          id?: string
          name: string
          paid_amount?: number
          patient_id: string
          start_date?: string
          status?: string
          total_cost?: number
          updated_at?: string
        }
        Update: {
          consent_date?: string | null
          consent_status?: string | null
          created_at?: string
          estimated_end?: string | null
          id?: string
          name?: string
          paid_amount?: number
          patient_id?: string
          start_date?: string
          status?: string
          total_cost?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_plans_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration: string | null
          id: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      war_chest_entries: {
        Row: {
          created_at: string
          excess_amount: number
          id: string
          payment_id: string
        }
        Insert: {
          created_at?: string
          excess_amount?: number
          id?: string
          payment_id: string
        }
        Update: {
          created_at?: string
          excess_amount?: number
          id?: string
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "war_chest_entries_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      website_content: {
        Row: {
          content_type: string
          content_value: string
          created_at: string
          display_order: number
          id: string
          label: string
          section_group: string
          section_key: string
          updated_at: string
        }
        Insert: {
          content_type?: string
          content_value?: string
          created_at?: string
          display_order?: number
          id?: string
          label?: string
          section_group?: string
          section_key: string
          updated_at?: string
        }
        Update: {
          content_type?: string
          content_value?: string
          created_at?: string
          display_order?: number
          id?: string
          label?: string
          section_group?: string
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      website_faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      website_gallery: {
        Row: {
          before_image_url: string | null
          category: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          before_image_url?: string | null
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          before_image_url?: string | null
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      website_promotions: {
        Row: {
          badge_text: string | null
          created_at: string
          cta_text: string | null
          description: string
          discount_percent: number
          end_date: string | null
          id: string
          image_url: string | null
          included_services: string[] | null
          is_active: boolean
          promo_type: string
          start_date: string | null
          terms: string | null
          title: string
          updated_at: string
        }
        Insert: {
          badge_text?: string | null
          created_at?: string
          cta_text?: string | null
          description?: string
          discount_percent?: number
          end_date?: string | null
          id?: string
          image_url?: string | null
          included_services?: string[] | null
          is_active?: boolean
          promo_type?: string
          start_date?: string | null
          terms?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          badge_text?: string | null
          created_at?: string
          cta_text?: string | null
          description?: string
          discount_percent?: number
          end_date?: string | null
          id?: string
          image_url?: string | null
          included_services?: string[] | null
          is_active?: boolean
          promo_type?: string
          start_date?: string | null
          terms?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      website_team_members: {
        Row: {
          bio: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          role: string
          specialties: string[] | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          role?: string
          specialties?: string[] | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          role?: string
          specialties?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      website_testimonials: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          is_featured: boolean
          name: string
          rating: number
          role: string
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name: string
          rating?: number
          role?: string
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_featured?: boolean
          name?: string
          rating?: number
          role?: string
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_message_recipient: {
        Args: { _message_id: string; _user_id: string }
        Returns: boolean
      }
      is_message_sender: {
        Args: { _message_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "dentist"
        | "assistant"
        | "hygienist"
        | "receptionist"
        | "accountant"
        | "lab_technician"
        | "lab_entry_clerk"
        | "lab_manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "dentist",
        "assistant",
        "hygienist",
        "receptionist",
        "accountant",
        "lab_technician",
        "lab_entry_clerk",
        "lab_manager",
      ],
    },
  },
} as const
