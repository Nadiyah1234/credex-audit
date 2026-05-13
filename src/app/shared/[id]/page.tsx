import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data } = await supabase
    .from('audits')
    .select('total_monthly_savings, total_annual_savings')
    .eq('id', id)
    .single();

  const savings = data?.total_monthly_savings ?? 0;

  return {
    title: 'AI Spend Audit Report',
    description: `This team could save $${savings}/month on AI tools.`,
    openGraph: {
      title: 'AI Spend Audit Report',
      description: `This team could save $${savings}/month on AI tools.`,
      url: `https://yourcomain.com/shared/${id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: 'AI Spend Audit Report',
      description: `This team could save $${savings}/month on AI tools.`,
    },
  };
}

export default async function SharedAuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  const results = data.results as {
    tool: string;
    currentSpend: number;
    recommendedAction: string;
    monthlySavings: number;
    reason: string;
  }[];

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-green-400 text-sm font-medium mb-1">Shared Audit Report</p>
          <h1 className="text-3xl font-bold mb-2">AI Spend Audit</h1>
          <p className="text-gray-400">Here is the audit report for this team.</p>
        </div>

        <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-6 mb-8 text-center">
          <p className="text-green-400 text-sm font-medium mb-1">Potential Monthly Savings</p>
          <p className="text-5xl font-bold text-white mb-1">${data.total_monthly_savings}</p>
          <p className="text-gray-400 text-sm">${data.total_annual_savings} per year</p>
        </div>

        {data.ai_summary && (
          <div className="bg-gray-900 rounded-xl p-6 mb-8">
            <p className="text-sm text-gray-400 font-medium mb-2">AI Analysis</p>
            <p className="text-gray-300 text-sm leading-relaxed">{data.ai_summary}</p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          {results.map((result, index) => (
            <div key={index} className="bg-gray-900 rounded-xl p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-semibold text-lg capitalize">{result.tool.replace('_', ' ')}</h2>
                {result.monthlySavings > 0 ? (
                  <span className="text-green-400 font-semibold">Save ${result.monthlySavings}/mo</span>
                ) : (
                  <span className="text-gray-400 text-sm">Optimised</span>
                )}
              </div>
              <p className="text-sm text-gray-400 mb-1">Current spend: ${result.currentSpend}/mo</p>
              <p className="text-sm text-white mb-2">{result.recommendedAction}</p>
              <p className="text-sm text-gray-400">{result.reason}</p>
            </div>
          ))}
        </div>

        <a href="/" className="block text-center bg-green-500 hover:bg-green-400 text-black font-semibold py-3 rounded-xl transition-colors">
          Run Your Own Audit
        </a>
      </div>
    </main>
  );
}