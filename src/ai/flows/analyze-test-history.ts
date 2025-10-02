'use server';

/**
 * @fileOverview An AI flow for analyzing patient test history and providing summarized insights.
 *
 * - analyzeTestHistory - A function that takes test results and provides AI-driven insights.
 * - AnalyzeTestHistoryInput - The input type for the analyzeTestHistory function.
 * - AnalyzeTestHistoryOutput - The return type for the analyzeTestHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTestHistoryInputSchema = z.object({
  testResults: z.string().describe('The historical test results of the patient in JSON format.'),
});
export type AnalyzeTestHistoryInput = z.infer<typeof AnalyzeTestHistoryInputSchema>;

const AnalyzeTestHistoryOutputSchema = z.object({
  insights: z.string().describe('AI-generated insights and trends from the test history.'),
});
export type AnalyzeTestHistoryOutput = z.infer<typeof AnalyzeTestHistoryOutputSchema>;

export async function analyzeTestHistory(input: AnalyzeTestHistoryInput): Promise<AnalyzeTestHistoryOutput> {
  return analyzeTestHistoryFlow(input);
}

const analyzeTestHistoryPrompt = ai.definePrompt({
  name: 'analyzeTestHistoryPrompt',
  input: {schema: AnalyzeTestHistoryInputSchema},
  output: {schema: AnalyzeTestHistoryOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing patient medical test history.

  Given the following historical test results, provide summarized insights and identify potential trends or health concerns. Provide your analysis in a clear and concise manner.

  Test Results:
  {{testResults}}`,
});

const analyzeTestHistoryFlow = ai.defineFlow(
  {
    name: 'analyzeTestHistoryFlow',
    inputSchema: AnalyzeTestHistoryInputSchema,
    outputSchema: AnalyzeTestHistoryOutputSchema,
  },
  async input => {
    const {output} = await analyzeTestHistoryPrompt(input);
    return output!;
  }
);
