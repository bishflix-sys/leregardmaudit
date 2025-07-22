'use server';

/**
 * @fileOverview An anomaly interpretation AI agent.
 *
 * - interpretAnomaly - A function that handles the anomaly interpretation process.
 * - InterpretAnomalyInput - The input type for the interpretAnomaly function.
 * - InterpretAnomalyOutput - The return type for the interpretAnomaly function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretAnomalyInputSchema = z.object({
  id: z.string().describe('The numerical ID to analyze.'),
  movementData: z.string().describe('A stringified JSON array of the movement history of the ID, with timestamps and coordinates.'),
  metadata: z.string().optional().describe('Optional metadata associated with the ID, useful for context.'),
});
export type InterpretAnomalyInput = z.infer<typeof InterpretAnomalyInputSchema>;

const InterpretAnomalyOutputSchema = z.object({
  interpretation: z.string().describe('An interpretation of any unusual movement patterns, and potential explanations.'),
  confidence: z.number().describe('A confidence score (0-1) of the interpretation accuracy.'),
});
export type InterpretAnomalyOutput = z.infer<typeof InterpretAnomalyOutputSchema>;

export async function interpretAnomaly(input: InterpretAnomalyInput): Promise<InterpretAnomalyOutput> {
  return interpretAnomalyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretAnomalyPrompt',
  input: {schema: InterpretAnomalyInputSchema},
  output: {schema: InterpretAnomalyOutputSchema},
  prompt: `You are an expert in analyzing movement data to detect anomalies and provide insightful interpretations.

  Analyze the movement data of the ID provided below. Consider the provided metadata, if any, to provide context.

  Movement Data: {{{movementData}}}
  ID: {{{id}}}
  Metadata: {{{metadata}}}

  Provide an interpretation of any unusual movement patterns and potential explanations for these anomalies. Also, provide a confidence score (0-1) indicating the accuracy of your interpretation.

  Format your response as a JSON object conforming to the InterpretAnomalyOutputSchema. Provide explanations for your reasoning and thought process.`, 
});

const interpretAnomalyFlow = ai.defineFlow(
  {
    name: 'interpretAnomalyFlow',
    inputSchema: InterpretAnomalyInputSchema,
    outputSchema: InterpretAnomalyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
