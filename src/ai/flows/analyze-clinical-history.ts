'use server';

/**
 * @fileOverview An AI flow for analyzing a patient's epilepsy clinical history.
 *
 * - analyzeClinicalHistory - Analyzes seizure trends and management adherence.
 * - AnalyzeClinicalHistoryInput - Input schema for clinical history analysis.
 * - AnalyzeClinicalHistoryOutput - Output schema for AI-driven insights.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeClinicalHistoryInputSchema = z.object({
  historyJson: z.string().describe('The historical clinical encounter data of the patient.'),
});
export type AnalyzeClinicalHistoryInput = z.infer<typeof AnalyzeClinicalHistoryInputSchema>;

const AnalyzeClinicalHistoryOutputSchema = z.object({
  insights: z.string().describe('AI-generated summary of seizure frequency trends and management gaps.'),
});
export type AnalyzeClinicalHistoryOutput = z.infer<typeof AnalyzeClinicalHistoryOutputSchema>;

export async function analyzeClinicalHistory(input: AnalyzeClinicalHistoryInput): Promise<AnalyzeClinicalHistoryOutput> {
  return analyzeClinicalHistoryFlow(input);
}

const analyzeClinicalHistoryPrompt = ai.definePrompt({
  name: 'analyzeClinicalHistoryPrompt',
  input: {schema: AnalyzeClinicalHistoryInputSchema},
  output: {schema: AnalyzeClinicalHistoryOutputSchema},
  prompt: `You are an AI Clinical Assistant specializing in epilepsy management (WHO mhGAP protocols).

  Review the following patient clinical history. Identify trends in seizure frequency, medication adherence issues, and any potential red flags that have appeared over time. Provide a concise clinical insight summary for the healthcare worker.

  Clinical History:
  {{historyJson}}`,
});

const analyzeClinicalHistoryFlow = ai.defineFlow(
  {
    name: 'analyzeClinicalHistoryFlow',
    inputSchema: AnalyzeClinicalHistoryInputSchema,
    outputSchema: AnalyzeClinicalHistoryOutputSchema,
  },
  async input => {
    const {output} = await analyzeClinicalHistoryPrompt(input);
    return output!;
  }
);
