import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { auditResult } = body;

    const totalMonthlySavings = auditResult.totalMonthlySavings;
    const totalAnnualSavings = auditResult.totalAnnualSavings;
    const tools = auditResult.input.tools.map((t: { tool: string }) => t.tool).join(', ');
    const useCase = auditResult.input.useCase;
    const teamSize = auditResult.input.teamSize;

    const prompt = `You are an AI spend analyst. Write a concise 100-word summary for a startup audit report. Be direct and specific.

Team size: ${teamSize}
Primary use case: ${useCase}
Tools being used: ${tools}
Potential monthly savings: $${totalMonthlySavings}
Potential annual savings: $${totalAnnualSavings}

Write a helpful, friendly 100-word paragraph summarising their AI spend situation and the key action they should take. Do not use bullet points. Do not use headers. Just a single paragraph.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    const summary = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Anthropic API error:', error);
    // Fallback summary if API fails
    return NextResponse.json({
      summary: 'Based on your current AI tool usage, there are opportunities to optimise your spend by reviewing your plan tiers and seat counts. Consider consolidating tools where there is overlap in functionality, and ensure each seat is actively used. Small adjustments to your current plans could lead to meaningful savings over the course of a year.',
    });
  }
}