import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { selected } = await req.json();

  if (!['A', 'B', 'C', 'D', 'E'].includes(selected)) {
    return NextResponse.json({ error: 'Invalid label' }, { status: 400 });
  }

  // 저장
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error: insertError } = await supabase
    .from('votes')
    .insert({ selected });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // 비율 계산
  const { data, error: fetchError } = await supabase
    .from('votes')
    .select('selected');

  if (fetchError || !data) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const total = data.length;
  const count = data.filter((v) => v.selected === selected).length;
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

  return NextResponse.json({
    message: `${percent}%의 사람들이 ${selected}를 선택했어요`,
    percent,
    selected,
  });
}
