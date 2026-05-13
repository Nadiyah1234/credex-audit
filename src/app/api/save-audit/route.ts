import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const body = await request.json();
    const { auditResult, email, companyName, role } = body;

    const { data, error } = await supabase
      .from('audits')
      .insert([{
        email,
        company_name: companyName,
        role,
        team_size: auditResult.input.teamSize,
        use_case: auditResult.input.useCase,
        tools: auditResult.input.tools,
        results: auditResult.results,
        total_monthly_savings: auditResult.totalMonthlySavings,
        total_annual_savings: auditResult.totalAnnualSavings,
        ai_summary: auditResult.aiSummary,
      }])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error('Save audit error:', error);
    return NextResponse.json({ error: 'Failed to save audit' }, { status: 500 });
  }
}