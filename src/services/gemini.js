import { getModelPricing } from '../utils/pricing';
import { READING_FORMAT_INSTRUCTION } from '../utils/parseReading';

const SPREAD_ROLES = [
  'Past influence or root of the situation',
  'Present energy or current challenge',
  'Hidden factor or subconscious influence',
  'Advice or recommended action',
  'Likely outcome if the current path continues',
  'Final guidance or closing message',
];

function buildFortunePrompt(question, spread) {
  const cardLines = spread
    .map(({ card, position }, index) => {
      const keywords =
        position === 'upright' ? card.uprightPoints.join(', ') : card.reversedPoints.join(', ');
      const description = position === 'upright' ? card.upDesc : card.revDesc;
      const role = SPREAD_ROLES[index] ?? `Position ${index + 1}`;

      return [
        `[${role}]`,
        `Card ${index + 1}: ${card.cardName}`,
        `Suit/Category: ${card.cardCategory}`,
        `Arcana: ${card.cardType}`,
        `Drawn position: ${position}`,
        `Keywords (${position}): ${keywords}`,
        `Traditional meaning (${position}): ${description}`,
      ].join('\n');
    })
    .join('\n\n');

  return `You are an experienced tarot reader giving a detailed, accurate reading. Stay grounded in the card meanings provided — do not invent symbols or cards that were not drawn.

The querent's question:
"${question.trim()}"

Six-card spread (in order):

${cardLines}

Write a thorough reading with this exact structure:

${READING_FORMAT_INSTRUCTION}

1. **Opening** (1 short paragraph)
   Restate the question in your own words and set the tone for the reading.

2. **Card-by-card analysis** (one substantial paragraph per card, in spread order)
   For each card you MUST:
   - Name the card and state whether it is upright or reversed
   - Explain its role in that spread position
   - Connect its keywords and traditional meaning to the querent's question
   - Be specific — avoid vague phrases like "something may change" without explaining what, why, and how the card suggests it

3. **Overall synthesis** (2–3 paragraphs)
   Weave all six cards into one coherent story. Show how earlier cards lead to later ones. Address tensions, confirmations, and contradictions between cards.

4. **Practical guidance** (1–2 paragraphs)
   Give clear, actionable advice tied directly to the question and the cards. Include what to focus on, what to avoid, and what mindset to adopt.

Rules:
- Minimum 700 words, aim for 900–1100 words
- Use the card data provided; do not contradict upright/reversed meanings
- Write in warm, clear prose — no bullet lists in the final reading
- Be specific to the question asked, not generic life advice`;
}

function buildReadingAidPrompt(question, spread) {
  const cardLines = spread
    .map(({ card, position }, index) => {
      const keywords =
        position === 'upright' ? card.uprightPoints.join(', ') : card.reversedPoints.join(', ');
      const description = position === 'upright' ? card.upDesc : card.revDesc;

      return [
        `Card ${index + 1}: ${card.cardName}`,
        `Category: ${card.cardCategory} · ${card.cardType}`,
        `Selected position: ${position}`,
        `Keywords (${position}): ${keywords}`,
        `Meaning (${position}): ${description}`,
      ].join('\n');
    })
    .join('\n\n');

  return `You are an experienced tarot reader helping someone interpret cards from their personal Reading Aid. These are reference cards the querent saved and chose an upright or reversed orientation for each.

The querent's question:
"${question.trim()}"

Saved Reading Aid cards (with selected orientations):

${cardLines}

Write a detailed, accurate reading with this exact structure:

${READING_FORMAT_INSTRUCTION}

1. **Opening** (1 short paragraph)
   Acknowledge the question and explain how the saved cards relate to it.

2. **Card-by-card analysis** (one substantial paragraph per saved card)
   For each card you MUST:
   - Name the card and honour the upright or reversed position the querent selected
   - Tie the card's keywords and meaning directly to the question
   - Be specific — explain concrete implications, not vague generalities

3. **Combined message** (2 paragraphs)
   Show how the cards work together. Highlight patterns, repeated themes, or tensions across the saved cards.

4. **Practical guidance** (1–2 paragraphs)
   Offer clear advice the querent can act on, grounded in the cards above.

Rules:
- Minimum 550 words, aim for 700–900 words
- Use only the selected orientation for each card — do not flip orientations
- Base interpretations on the card meanings provided
- Write in warm, clear prose — no bullet lists in the final reading
- Be specific to the question asked`;
}

async function callGemini({ apiKey, model, prompt }) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey.trim())}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.65,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message ?? 'Gemini could not complete the reading. Check your API key and model.';
    throw new Error(message);
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join('\n')
    .trim();

  if (!text) {
    throw new Error('Gemini returned an empty reading. Try again.');
  }

  const usage = data.usageMetadata ?? {};
  const inputTokens = usage.promptTokenCount ?? 0;
  const outputTokens = usage.candidatesTokenCount ?? 0;
  const totalTokens = usage.totalTokenCount ?? inputTokens + outputTokens;

  return {
    text,
    usage: {
      inputTokens,
      outputTokens,
      totalTokens,
      model,
    },
  };
}

export async function generateTarotReading({ apiKey, model, question, spread }) {
  if (!apiKey?.trim()) {
    throw new Error('Add your Gemini API key in Settings before requesting a reading.');
  }

  if (!question?.trim()) {
    throw new Error('Please enter your question before requesting a reading.');
  }

  if (!spread?.length) {
    throw new Error('Draw your cards first by tapping Start.');
  }

  const prompt = buildFortunePrompt(question, spread);
  return callGemini({ apiKey, model, prompt });
}

export async function generateReadingAidReading({ apiKey, model, question, spread }) {
  if (!apiKey?.trim()) {
    throw new Error('Add your Gemini API key in Settings before requesting a reading.');
  }

  if (!question?.trim()) {
    throw new Error('Please enter your question before requesting a reading.');
  }

  if (!spread?.length) {
    throw new Error('Add cards to your Reading Aid first.');
  }

  const prompt = buildReadingAidPrompt(question, spread);
  return callGemini({ apiKey, model, prompt });
}

export function estimateReadingCostMyr(spread, question, modelId, usdToMyr) {
  const pricing = getModelPricing(modelId);
  const samplePrompt = buildFortunePrompt(question || 'Sample question', spread);
  const estimatedInput = Math.ceil(samplePrompt.length / 4);
  const estimatedOutput = 900;
  const usd =
    (estimatedInput / 1_000_000) * pricing.inputPerMillionUsd +
    (estimatedOutput / 1_000_000) * pricing.outputPerMillionUsd;

  return {
    estimatedInput,
    estimatedOutput,
    estimatedMyr: usd * usdToMyr,
  };
}
