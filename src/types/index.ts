export type PlanTier =
  | 'free' | 'hobby' | 'pro' | 'max'
  | 'team' | 'business' | 'enterprise'
  | 'api_direct' | 'individual' | 'ultra';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export type ToolName =
  | 'cursor'
  | 'github_copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'windsurf';

export interface ToolInput {
  tool: ToolName;
  plan: PlanTier;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCase;
  email?: string;
  companyName?: string;
  role?: string;
}

export interface ToolAuditResult {
  tool: ToolName;
  currentSpend: number;
  recommendedAction: string;
  suggestedPlan?: string;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
}

export interface AuditResult {
  input: AuditInput;
  results: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary?: string;
  createdAt: string;
  id: string;
}