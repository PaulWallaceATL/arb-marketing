import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseService =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

export async function GET(_request: NextRequest) {
  try {
    if (!supabaseService) {
      return NextResponse.json({ media: [] });
    }

    const { data, error } = await supabaseService
      .from('site_media')
      .select('key,url')
      .order('key', { ascending: true });

    if (error) {
      return NextResponse.json({ media: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({ media: data || [] });
  } catch (error: any) {
    return NextResponse.json({ media: [], error: error?.message || 'Internal error' }, { status: 500 });
  }
}
