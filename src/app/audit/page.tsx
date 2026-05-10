'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuditInput, ToolInput, ToolName, PlanTier, UseCase } from '@/types';

const TOOLS: { id: ToolName; label: string; plans: { value: PlanTier; label: string }[] }[] = [
  {
    id: 'cursor',
    label: 'Cursor',
    plans: [
      { value: 'hobby', label: 'Hobby (Free)' },
      { value: 'pro', label: 'Pro ($20/user)' },
      { value: 'business', label: 'Business ($40/user)' },
      { value: 'enterprise', label: 'Enterprise (custom)' },
    ],
  },
  {
    id: 'github_copilot',
    label: 'GitHub Copilot',
    plans: [
      { value: 'individual', label: 'Individual ($10/user)' },
      { value: 'business', label: 'Business ($19/user)' },
      { value: 'enterprise', label: 'Enterprise ($39/user)' },
    ],
  },
  {
    id: 'claude',
    label: 'Claude (Anthropic)',
    plans: [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Pro ($20/user)' },
      { value: 'max', label: 'Max ($100/user)' },
      { value: 'team', label: 'Team ($30/user)' },
      { value: 'enterprise', label: 'Enterprise (custom)' },
      { value: 'api_direct', label: 'API Direct (usage-based)' },
    ],
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT (OpenAI)',
    plans: [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Plus ($20/user)' },
      { value: 'team', label: 'Team ($30/user)' },
      { value: 'enterprise', label: 'Enterprise (custom)' },
      { value: 'api_direct', label: 'API Direct (usage-based)' },
    ],
  },
  {
    id: 'anthropic_api',
    label: 'Anthropic API',
    plans: [{ value: 'api_direct', label: 'API Direct (usage-based)' }],
  },
  {
    id: 'openai_api',
    label: 'OpenAI API',
    plans: [{ value: 'api_direct', label: 'API Direct (usage-based)' }],
  },
  {
    id: 'gemini',
    label: 'Gemini (Google)',
    plans: [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Google One AI Premium ($19.99/user)' },
      { value: 'api_direct', label: 'API Direct (usage-based)' },
    ],
  },
  {
    id: 'windsurf',
    label: 'Windsurf',
    plans: [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Pro ($15/user)' },
      { value: 'team', label: 'Team ($35/user)' },
    ],
  },
];

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: 'coding', label: 'Coding / Engineering' },
  { value: 'writing', label: 'Writing / Content' },
  { value: 'data', label: 'Data / Analytics' },
  { value: 'research', label: 'Research' },
  { value: 'mixed', label: 'Mixed / General' },
];

const defaultTool = (): ToolInput => ({
  tool: 'cursor',
  plan: 'pro',
  monthlySpend: 0,
  seats: 1,
});

export default function AuditPage() {
  const router = useRouter();
  const [tools, setTools] = useState<ToolInput[]>([defaultTool()]);
  const [teamSize, setTeamSize] = useState<number>(1);
  const [useCase, setUseCase] = useState<UseCase>('coding');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('auditInput');
    if (saved) {
      const parsed: AuditInput = JSON.parse(saved);
      setTools(parsed.tools);
      setTeamSize(parsed.teamSize);
      setUseCase(parsed.useCase);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    const data: AuditInput = { tools, teamSize, useCase };
    localStorage.setItem('auditInput', JSON.stringify(data));
  }, [tools, teamSize, useCase]);

  const addTool = () => setTools([...tools, defaultTool()]);

  const removeTool = (index: number) =>
    setTools(tools.filter((_, i) => i !== index));

  const updateTool = (index: number, field: keyof ToolInput, value: string | number) => {
    const updated = [...tools];
    updated[index] = { ...updated[index], [field]: value };
    setTools(updated);
  };

  const handleSubmit = () => {
    const data: AuditInput = { tools, teamSize, useCase };
    localStorage.setItem('auditInput', JSON.stringify(data));
    router.push('/results');
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">AI Spend Audit</h1>
        <p className="text-gray-400 mb-8">Enter your current AI tools and we'll find where you're overspending.</p>

        {/* Team Info */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Your Team</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Team Size</label>
              <input
                type="number"
                min={1}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Primary Use Case</label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value as UseCase)}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white"
              >
                {USE_CASES.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tools */}
        {tools.map((tool, index) => {
          const toolDef = TOOLS.find((t) => t.id === tool.tool);
          return (
            <div key={index} className="bg-gray-900 rounded-xl p-6 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Tool {index + 1}</h2>
                {tools.length > 1 && (
                  <button
                    onClick={() => removeTool(index)}
                    className="text-red-400 text-sm hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Tool</label>
                  <select
                    value={tool.tool}
                    onChange={(e) => updateTool(index, 'tool', e.target.value)}
                    className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white"
                  >
                    {TOOLS.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Plan</label>
                  <select
                    value={tool.plan}
                    onChange={(e) => updateTool(index, 'plan', e.target.value)}
                    className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white"
                  >
                    {toolDef?.plans.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Monthly Spend ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={tool.monthlySpend}
                    onChange={(e) => updateTool(index, 'monthlySpend', Number(e.target.value))}
                    className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Number of Seats</label>
                  <input
                    type="number"
                    min={1}
                    value={tool.seats}
                    onChange={(e) => updateTool(index, 'seats', Number(e.target.value))}
                    className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>
          );
        })}

        <button
          onClick={addTool}
          className="w-full border border-gray-700 rounded-xl py-3 text-gray-400 hover:text-white hover:border-gray-500 transition-colors mb-6"
        >
          + Add Another Tool
        </button>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-4 rounded-xl text-lg transition-colors"
        >
          Run My Audit →
        </button>
      </div>
    </main>
  );
}