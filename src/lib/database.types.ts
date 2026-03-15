export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          phone: string
          name: string
          role: 'owner' | 'manager' | 'worker'
          workspace_id: string
          created_at: string
        }
        Insert: {
          id?: string
          phone: string
          name: string
          role?: 'owner' | 'manager' | 'worker'
          workspace_id: string
          created_at?: string
        }
        Update: {
          id?: string
          phone?: string
          name?: string
          role?: 'owner' | 'manager' | 'worker'
          workspace_id?: string
          created_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          name: string
          owner_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          created_at?: string
        }
      }
      batches: {
        Row: {
          id: string
          name: string
          client: string | null
          production_type: 'cmt' | 'full'
          status: 'planned' | 'cutting' | 'sewing' | 'packing' | 'done'
          workspace_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          client?: string | null
          production_type: 'cmt' | 'full'
          status?: 'planned' | 'cutting' | 'sewing' | 'packing' | 'done'
          workspace_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          client?: string | null
          production_type?: 'cmt' | 'full'
          status?: 'planned' | 'cutting' | 'sewing' | 'packing' | 'done'
          workspace_id?: string
          created_at?: string
        }
      }
      operations: {
        Row: {
          id: string
          batch_id: string
          name: string
          price: number
          quantity_required: number
          created_at: string
        }
        Insert: {
          id?: string
          batch_id: string
          name: string
          price: number
          quantity_required: number
          created_at?: string
        }
        Update: {
          id?: string
          batch_id?: string
          name?: string
          price?: number
          quantity_required?: number
          created_at?: string
        }
      }
      production_logs: {
        Row: {
          id: string
          worker_id: string
          operation_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          operation_id: string
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          operation_id?: string
          quantity?: number
          created_at?: string
        }
      }
      advances: {
        Row: {
          id: string
          worker_id: string
          amount: number
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          amount: number
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          amount?: number
          created_by?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
