import { QuoteItem } from './clientQuote';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type OrderStatus = 'placed' | 'paid' | 'ready' | 'completed' | 'cancelled';

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
          last_login: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
          last_login?: string | null;
        };
      };
      orders: {
        Row: {
          id: string;
          client_id: string | null;
          items: QuoteItem[];
          order_number: string;
          status: OrderStatus;
          total_amount: number | null;
          currency: string;
          guest_name: string | null;
          guest_email: string | null;
          guest_phone: string | null;
          share_token: string;
          share_expires_at: string;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
          notes: string | null;
          metadata: Json;
        };
        Insert: {
          id?: string;
          client_id?: string | null;
          items: QuoteItem[];
          order_number?: string;
          status?: OrderStatus;
          total_amount?: number | null;
          currency?: string;
          guest_name?: string | null;
          guest_email?: string | null;
          guest_phone?: string | null;
          share_token?: string;
          share_expires_at?: string;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
          notes?: string | null;
          metadata?: Json;
        };
        Update: {
          id?: string;
          client_id?: string | null;
          items?: QuoteItem[];
          order_number?: string;
          status?: OrderStatus;
          total_amount?: number | null;
          currency?: string;
          guest_name?: string | null;
          guest_email?: string | null;
          guest_phone?: string | null;
          share_token?: string;
          share_expires_at?: string;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
          notes?: string | null;
          metadata?: Json;
        };
      };
      order_events: {
        Row: {
          id: string;
          order_id: string;
          event_type: string;
          old_value: string | null;
          new_value: string | null;
          metadata: Json;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          event_type: string;
          old_value?: string | null;
          new_value?: string | null;
          metadata?: Json;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          event_type?: string;
          old_value?: string | null;
          new_value?: string | null;
          metadata?: Json;
          created_at?: string;
          created_by?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types for easier access
export type Client = Database['public']['Tables']['clients']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderEvent = Database['public']['Tables']['order_events']['Row'];

export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderEventInsert = Database['public']['Tables']['order_events']['Insert'];

export type ClientUpdate = Database['public']['Tables']['clients']['Update'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];
export type OrderEventUpdate = Database['public']['Tables']['order_events']['Update'];

