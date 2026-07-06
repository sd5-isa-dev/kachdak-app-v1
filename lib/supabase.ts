import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'mock';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Category = {
  id: string;
  name: string;
  created_at?: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  created_at?: string;
};
