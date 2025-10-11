import { createClient } from '@/utils/supabase/server';

export default async function Instruments() {
  const supabase = await createClient();
  const { data: testTable } = await supabase.from("TestTable").select();

  return <pre>{JSON.stringify(testTable, null, 2)}</pre>
}