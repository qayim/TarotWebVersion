const OVERVIEW_HEADER = '## Reading Overview';
const FULL_READING_HEADER = '## Full Reading';

export function parseReading(text) {
  const normalized = text.trim();
  const overviewIndex = normalized.indexOf(OVERVIEW_HEADER);
  const fullIndex = normalized.indexOf(FULL_READING_HEADER);

  if (overviewIndex === -1 || fullIndex === -1 || fullIndex <= overviewIndex) {
    return { overview: null, body: normalized };
  }

  const overview = normalized
    .slice(overviewIndex + OVERVIEW_HEADER.length, fullIndex)
    .trim();
  const body = normalized.slice(fullIndex + FULL_READING_HEADER.length).trim();

  if (!overview || !body) {
    return { overview: null, body: normalized };
  }

  return { overview, body };
}

export const READING_FORMAT_INSTRUCTION = `
Start your response with these exact section headers:

${OVERVIEW_HEADER}
Write 3–5 sentences summarising the core message, overall tone of the spread, and the direct answer to the question. This should stand alone — someone reading only this section should grasp the key insight.

${FULL_READING_HEADER}
Continue with the full structured reading below this header.`;
