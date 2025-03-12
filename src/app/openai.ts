import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openai4oModel = openai('gpt-4o');

export const openaiDallE2Model = openai.image('dall-e-2');
export const openaiDallE3Model = openai.image('dall-e-3');