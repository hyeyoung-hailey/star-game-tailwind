import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function saveVoteAndGetPercent(selected: string) {
  if (!['A', 'B', 'C', 'D', 'E'].includes(selected)) {
    throw new Error('Invalid label');
  }

  await supabase.from('votes').insert({ selected });

  const { data, error } = await supabase.from('votes').select('selected');
  if (error || !data) throw new Error(error?.message || 'Fetch failed');

  const total = data.length;
  const count = data.filter((v) => v.selected === selected).length;
  const percent = Math.round((count / total) * 100);
  return percent;
}
