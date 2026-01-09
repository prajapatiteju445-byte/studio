'use server';

/**
 * @fileOverview An AI agent that reasons about the best notification methods for emergency contacts.
 *
 * - reasonAboutNotificationMethods - A function that determines the best notification methods for each emergency contact.
 * - ReasonAboutNotificationMethodsInput - The input type for the reasonAboutNotificationMethods function.
 * - ReasonAboutNotificationMethodsOutput - The return type for the reasonAboutNotificationMethods function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReasonAboutNotificationMethodsInputSchema = z.object({
  contacts: z
    .array(
      z.object({
        name: z.string().describe('The name of the contact.'),
        phoneNumber: z.string().describe('The phone number of the contact.'),
        hasAppInstalled: z
          .boolean()
          .describe('Whether the contact has the app installed.'),
      })
    )
    .describe('A list of emergency contacts.'),
  situationDescription: z
    .string()
    .describe('A description of the distress situation.'),
});
export type ReasonAboutNotificationMethodsInput = z.infer<
  typeof ReasonAboutNotificationMethodsInputSchema
>;

const ReasonAboutNotificationMethodsOutputSchema = z.object({
  contactNotificationMethods: z
    .array(
      z.object({
        name: z.string().describe('The name of the contact.'),
        notificationMethods: z
          .array(z.string())
          .describe(
            'A list of suggested notification methods for the contact, e.g., SMS, email, push notification.'
          ),
        reasoning: z.string().describe('Why the contact should use those notification methods.'),
      })
    )
    .describe(
      'A list of suggested notification methods for each contact, along with the reasoning behind the suggestions.'
    ),
});
export type ReasonAboutNotificationMethodsOutput = z.infer<
  typeof ReasonAboutNotificationMethodsOutputSchema
>;

export async function reasonAboutNotificationMethods(
  input: ReasonAboutNotificationMethodsInput
): Promise<ReasonAboutNotificationMethodsOutput> {
  return reasonAboutNotificationMethodsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reasonAboutNotificationMethodsPrompt',
  input: {schema: ReasonAboutNotificationMethodsInputSchema},
  output: {schema: ReasonAboutNotificationMethodsOutputSchema},
  prompt: `You are an AI assistant that helps determine the best notification methods for emergency contacts in a distress situation.

  Given the following emergency contacts and a description of the distress situation, suggest the best notification methods for each contact.

  Emergency Contacts:
  {{#each contacts}}
  - Name: {{this.name}}, Phone Number: {{this.phoneNumber}}, App Installed: {{this.hasAppInstalled}}
  {{/each}}

  Distress Situation: {{situationDescription}}

  Consider the following factors when determining the best notification methods:
  - Whether the contact has the app installed (push notifications are preferred if they do).
  - The urgency of the situation (SMS is good for urgent situations).
  - The reliability of the notification method.

  Output the list of contact notification methods with the reasoning for each choice in JSON format.
  Ensure that the outputted JSON is valid, the list of contacts is exhaustive, and the description for each choice is detailed.
  Do not omit any contacts from the contact list, even if you believe no notification is required.
  `,
});

const reasonAboutNotificationMethodsFlow = ai.defineFlow(
  {
    name: 'reasonAboutNotificationMethodsFlow',
    inputSchema: ReasonAboutNotificationMethodsInputSchema,
    outputSchema: ReasonAboutNotificationMethodsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
