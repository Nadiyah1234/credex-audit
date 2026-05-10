'use client';

import { useEffect, useState } from 'react';
import { AuditInput } from '@/types';

export default function ResultsPage() {
  const [input, setInput] = useState<AuditInput | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('auditInput');
    if (saved) {
      setInput(JSON.parse(saved));
    }
  }, []);

  if (!input) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">No audit data found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Your Audit Results</h1>
        <p className="text-gray-400 mb-8">Here is what we found.</p>
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Your Tools</h2>
          {input.tools.map((tool, index) => (
            <div key={index} className="flex justify-between py-2 border-b border-gray-800 last:border-0">
              <span className="text-gray-300">{tool.tool}</span>
              <span className="text-white font-medium">${tool.monthlySpend}/mo x {tool.seats} seats</span>
            </div>
          ))}
        </div>
        <a href="/audit" className="block text-center border border-gray-700 rounded-xl py-3 text-gray-400 hover:text-white transition-colors">
          Back to Edit My Tools
        </a>
      </div>
    </main>
  );
}