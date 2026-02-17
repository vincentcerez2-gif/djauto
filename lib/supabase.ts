
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eniwuiolxxswnuxhhtcw.supabase.co';
const supabaseKey = 'sb_publishable_j9dH3fTaCPCrTrh8GG7KVA_CrH0sTxY';

export const supabase = createClient(supabaseUrl, supabaseKey);
