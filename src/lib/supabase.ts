// Supabase client — used by all frontend components to read/write inventory
// Credentials come from .env.local (never hardcoded)

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript type matching the inventory table schema
export interface InventoryItem {
  item_id: string;
  name: string;
  status: "in_stock" | "shipped" | "damaged" | "spoiled" | "reserved";
  quantity: number;
  location: string;
  last_updated: string;
  notes: string | null;
}
