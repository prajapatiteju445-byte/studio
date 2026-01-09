'use server';

/**
 * @fileOverview AI-powered suggestion of threshold values for panic detection.
 *
 * - suggestThresholds - A function that suggests threshold values for panic detection based on user characteristics.
 * - SuggestThresholdsInput - The input type for the suggestThresholds function.
 * - SuggestThresholdsOutput - The return type for the suggestThresholds function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestThresholdsInputSchema = z.object({
  activityLevel: z
    .string()
    .describe(
      'The typical activity level of the user (e.g., sedentary, active, very active).'
    ),
  age: z.number().describe('The age of the user in years.'),
  deviceType: z
    .string()
    .describe(
      'The type of device being used (e.g., phone, watch). This helps in tailoring suggestions based on device sensitivity.'
    ),
});
export type SuggestThresholdsInput = z.infer<typeof SuggestThresholdsInputSchema>;

const SuggestThresholdsOutputSchema = z.object({
  accelerometerThreshold: z
    .number()
    .describe(
      'Suggested threshold for accelerometer readings to detect sudden movements (g force).'
    ),
  gyroscopeThreshold: z
    .number()
    .describe(
      'Suggested threshold for gyroscope readings to detect rapid rotations (degrees per second).'
    ),
});
export type SuggestThresholdsOutput = z.infer<typeof SuggestThresholdsOutputSchema>;

export async function suggestThresholds(
  input: SuggestThresholdsInput
): Promise<SuggestThresholdsOutput> {
  return suggestThresholdsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestThresholdsPrompt',
  input: {schema: SuggestThresholdsInputSchema},
  output: {schema: SuggestThresholdsOutputSchema},
  prompt: `You are an AI assistant that suggests reasonable threshold values for panic detection in a safety app.

  Consider the user's activity level, age, and device type to provide tailored suggestions.

  Activity Level: {{{activityLevel}}}
  Age: {{{age}}}
  Device Type: {{{deviceType}}}

  Provide suggestions for:
  - accelerometerThreshold: Threshold for accelerometer readings (g force).
  - gyroscopeThreshold: Threshold for gyroscope readings (degrees per second).

  Ensure the suggestions are appropriate for the given user characteristics.
`,
});

const suggestThresholdsFlow = ai.defineFlow(
  {
    name: 'suggestThresholdsFlow',
    inputSchema: SuggestThresholdsInputSchema,
    outputSchema: SuggestThresholdsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
