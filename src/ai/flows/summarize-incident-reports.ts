'use server';

/**
 * @fileOverview Summarizes incident reports for a given area.
 *
 * - summarizeIncidentReports - A function that summarizes incident reports.
 * - SummarizeIncidentReportsInput - The input type for the summarizeIncidentReports function.
 * - SummarizeIncidentReportsOutput - The return type for the summarizeIncidentReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIncidentReportsInputSchema = z.object({
  areaDescription: z.string().describe('A description of the area for which to summarize incident reports.'),
  incidentReports: z.array(z.string()).describe('An array of incident reports for the area.'),
});
export type SummarizeIncidentReportsInput = z.infer<typeof SummarizeIncidentReportsInputSchema>;

const SummarizeIncidentReportsOutputSchema = z.object({
  summary: z.string().describe('A summarized version of the incident reports for the given area.'),
});
export type SummarizeIncidentReportsOutput = z.infer<typeof SummarizeIncidentReportsOutputSchema>;

export async function summarizeIncidentReports(input: SummarizeIncidentReportsInput): Promise<SummarizeIncidentReportsOutput> {
  return summarizeIncidentReportsFlow(input);
}

const summarizeIncidentReportsPrompt = ai.definePrompt({
  name: 'summarizeIncidentReportsPrompt',
  input: {schema: SummarizeIncidentReportsInputSchema},
  output: {schema: SummarizeIncidentReportsOutputSchema},
  prompt: `You are an AI assistant helping users understand safety concerns in their area.\n\n  Given the following description of an area: {{{areaDescription}}}\n  And the following incident reports: {{{incidentReports}}}\n\n  Please provide a concise summary of the key safety concerns highlighted in these reports.\n  The summary should be no more than three sentences long.\n  `,
});

const summarizeIncidentReportsFlow = ai.defineFlow(
  {
    name: 'summarizeIncidentReportsFlow',
    inputSchema: SummarizeIncidentReportsInputSchema,
    outputSchema: SummarizeIncidentReportsOutputSchema,
  },
  async input => {
    const {output} = await summarizeIncidentReportsPrompt(input);
    return output!;
  }
);
