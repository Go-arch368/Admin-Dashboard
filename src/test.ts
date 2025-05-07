// src/test.ts
import { supabase } from '@/lib/supabase';
async function test() {
    const { data, error } = await supabase.from('studentdata').select('*');
    console.log({ data, error });
}
test();