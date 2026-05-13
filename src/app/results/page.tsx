'use client';

import { useEffect, useState } from 'react';
import { AuditInput, AuditResult } from '@/types';
import { runAudit } from '@/lib/auditEngine';

export default function ResultsPage() {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('auditInput');
    if (saved) {
      const input: AuditInput = JSON.parse(saved);
      const result = runAudit(input);
      setAudit(result);
      generateSummary(result);
    }
  }, []);

  const generateSummary = async (auditResult: AuditResult) => {
    setLoadingSummary(true);
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditResult }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch {
      setSummary('Based on your current AI tool usage, there are opportunities to optimise your spend by reviewing your plan tiers and seat counts.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleSave = async () => {
    if (!email || !audit) return;
    setSaving(true);
    try {
      const response = await fetch('/api/save-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditResult: audit, email, companyName, role }),
      });
      const data = await response.json();
      if (data.id) {
        setSaved(true);
        setShareUrl(`${window.location.origin}/shared/${data.id}`);
      }
    } catch {
      console.error('Failed to save audit');
    } finally {
      setSaving(false);
    }
  };

  if (!audit) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">No audit data found. <a href="/audit" className="text-green-400 underline">Start an audit</a></p>
      </main>
    );
  }

  const { results, totalMonthlySavings, totalAnnualSavings } = audit;

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Your Audit Results</h1>
        <p className="text-gray-400 mb-8">Here is what we found based on your AI tool spend.</p>

        {/* Hero savings */}
        <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-6 mb-8 text-center">
          <p className="text-green-400 text-sm font-medium mb-1">Potential Monthly Savings</p>
          <p className="text-5xl font-bold text-white mb-1">${totalMonthlySavings.toFixed(0)}</p>
          <p className="text-gray-400 text-sm">${totalAnnualSavings.toFixed(0)} per year</p>
        </div>

        {/* AI Summary */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-400 font-medium mb-2">AI Analysis</p>
          {loadingSummary ? (
            <p className="text-gray-400 text-sm animate-pulse">Generating your personalised summary...</p>
          ) : (
            <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
          )}
        </div>

        {/* Credex CTA for high savings */}
        {totalMonthlySavings > 500 && (
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-6 mb-8">
            <p className="text-blue-400 font-semibold mb-1">You qualify for Credex credits</p>
            <p className="text-gray-300 text-sm mb-3">With over $500/mo in potential savings, Credex can help you access discounted AI credits and save even more.</p>
            <a href="https://credex.rocks" target="_blank" className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
              Book a Credex Consultation
            </a>
          </div>
        )}

        {/* Per tool breakdown */}
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

        {/* Lead capture */}
        {!saved ? (
          <div className="bg-gray-900 rounded-xl p-6 mb-6">
            <h2 className="font-semibold text-lg mb-1">Save and share your report</h2>
            <p className="text-gray-400 text-sm mb-4">Get a shareable link and we will notify you when new optimisations apply to your stack.</p>
            <input
              type="email"
              placeholder="Your email (required)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white mb-3 text-sm"
            />
            <input
              type="text"
              placeholder="Company name (optional)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white mb-3 text-sm"
            />
            <input
              type="text"
              placeholder="Your role (optional)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white mb-4 text-sm"
            />
            <button
              onClick={handleSave}
              disabled={!email || saving}
              className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-semibold py-3 rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save My Report'}
            </button>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl p-6 mb-6">
            <p className="text-green-400 font-semibold mb-2">Report saved!</p>
            <p className="text-gray-400 text-sm mb-3">Share your audit with this link:</p>
            <div className="bg-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 break-all mb-3">{shareUrl}</div>
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="w-full border border-gray-700 rounded-lg py-2 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Copy Link
            </button>
          </div>
        )}

        {/* Optimal spend message */}
        {totalMonthlySavings < 100 && (
          <div className="bg-gray-900 rounded-xl p-6 mb-6 text-center">
            <p className="text-white font-semibold mb-1">You are spending well</p>
            <p className="text-gray-400 text-sm">Your current AI stack looks optimised. We will notify you when new savings apply to your tools.</p>
          </div>
        )}

        <a href="/audit" className="block text-center border border-gray-700 rounded-xl py-3 text-gray-400 hover:text-white transition-colors">
          Back to Edit My Tools
        </a>
      </div>
    </main>
  );
}