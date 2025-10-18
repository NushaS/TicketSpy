import { createClient } from '@/utils/supabase/server';

export default async function Instruments() {
  const supabase = await createClient();
  const { data: usersTable } = await supabase.from("users").select();
  const { data: enforcement_sightingsTable } = await supabase.from("enforcement_sightings").select();
  const { data: ticketsTable } = await supabase.from("tickets").select();

  const allTables = { usersTable, enforcement_sightingsTable, ticketsTable}

  // Pre = "render exactly as is, no compression or line breaks added 
  return (<pre>  
    {JSON.stringify(allTables, null, 2)}
  </pre>);
}