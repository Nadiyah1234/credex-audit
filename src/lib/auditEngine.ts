import { AuditInput, AuditResult, ToolAuditResult, ToolInput } from '@/types';
import { v4 as uuidv4 } from 'uuid';

function auditTool(tool: ToolInput, teamSize: number, useCase: string): ToolAuditResult {
  const { tool: toolName, plan, monthlySpend, seats } = tool;
  let recommendedAction = 'No changes needed';
  let suggestedPlan = plan;
  let monthlySavings = 0;
  let reason = 'Your current plan appears to be a good fit.';

  if (toolName === 'cursor') {
    if (plan === 'business' && seats <= 3) {
      monthlySavings = seats * 20;
      suggestedPlan = 'pro';
      recommendedAction = 'Downgrade to Pro';
      reason = 'Business plan is designed for larger teams. With 3 or fewer seats, Pro ($20/user) gives the same core features at half the price.';
    } else if (plan === 'enterprise') {
      monthlySavings = 0;
      reason = 'Enterprise pricing is custom — contact Cursor to benchmark against Pro or Business rates.';
    } else if (plan === 'pro' && useCase === 'writing') {
      monthlySavings = seats * 20;
      suggestedPlan = 'hobby';
      recommendedAction = 'Consider downgrading to Hobby';
      reason = 'Cursor is optimised for coding. For writing use cases, you may get better value from Claude Pro or ChatGPT Plus.';
    }
  }

  if (toolName === 'github_copilot') {
    if (plan === 'enterprise' && seats <= 10) {
      monthlySavings = seats * 20;
      suggestedPlan = 'business';
      recommendedAction = 'Downgrade to Business';
      reason = 'Enterprise adds SSO and audit logs — useful for 50+ person orgs. Under 10 seats, Business ($19/user) covers all core coding assistance needs.';
    } else if (plan === 'business' && seats === 1) {
      monthlySavings = 9;
      suggestedPlan = 'individual';
      recommendedAction = 'Switch to Individual';
      reason = 'Individual plan ($10/user) is identical in features for solo users. Business tier only adds value for team management.';
    }
  }

  if (toolName === 'claude') {
    if (plan === 'max' && useCase !== 'research' && useCase !== 'data') {
      monthlySavings = seats * 80;
      suggestedPlan = 'pro';
      recommendedAction = 'Downgrade to Pro';
      reason = 'Max plan ($100/user) is for very heavy usage. Pro ($20/user) handles most coding and writing workloads comfortably.';
    } else if (plan === 'team' && seats <= 2) {
      monthlySavings = seats * 5;
      suggestedPlan = 'pro';
      recommendedAction = 'Switch to individual Pro plans';
      reason = 'Team plan requires minimum 5 seats. With 2 users, two individual Pro plans ($20/user) is cheaper and simpler.';
    }
  }

  if (toolName === 'chatgpt') {
    if (plan === 'team' && seats <= 2) {
      monthlySavings = seats * 5;
      suggestedPlan = 'pro';
      recommendedAction = 'Switch to individual Plus plans';
      reason = 'Team plan adds collaboration features that only matter at scale. Two Plus plans ($20/user) saves money for small teams.';
    } else if (plan === 'enterprise') {
      reason = 'Enterprise pricing is custom. Verify you are using features like SSO and advanced admin controls that justify the premium.';
    }
  }

  if (toolName === 'anthropic_api' || toolName === 'openai_api') {
    if (monthlySpend > 500) {
      monthlySavings = monthlySpend * 0.2;
      recommendedAction = 'Explore Credex credits';
      reason = `At $${monthlySpend}/mo on API spend, you qualify for discounted credits through Credex — typically 15-25% below retail rates.`;
    } else if (monthlySpend > 100) {
      reason = 'Your API spend is moderate. Monitor usage with LangSmith or Helicone to catch inefficient calls.';
    } else {
      reason = 'Low API spend — you are spending efficiently at this volume.';
    }
  }

  if (toolName === 'gemini') {
    if (plan === 'pro' && useCase === 'coding') {
      monthlySavings = seats * 5;
      suggestedPlan = 'free';
      recommendedAction = 'Consider downgrading to Free';
      reason = 'Gemini Pro adds value for research and writing. For coding, Cursor or GitHub Copilot are significantly stronger tools for the price.';
    }
  }

  if (toolName === 'windsurf') {
    if (plan === 'team' && seats <= 3) {
      monthlySavings = seats * 20;
      suggestedPlan = 'pro';
      recommendedAction = 'Downgrade to Pro';
      reason = 'Windsurf Team adds admin controls only useful for larger teams. Pro ($15/user) is sufficient for small teams.';
    }
  }

  const annualSavings = monthlySavings * 12;

  return {
    tool: toolName,
    currentSpend: monthlySpend,
    recommendedAction,
    suggestedPlan,
    monthlySavings,
    annualSavings,
    reason,
  };
}

export function runAudit(input: AuditInput): AuditResult {
  const results: ToolAuditResult[] = input.tools.map((tool) =>
    auditTool(tool, input.teamSize, input.useCase)
  );

  const totalMonthlySavings = results.reduce((sum, r) => sum + r.monthlySavings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    input,
    results,
    totalMonthlySavings,
    totalAnnualSavings,
    createdAt: new Date().toISOString(),
    id: uuidv4(),
  };
}