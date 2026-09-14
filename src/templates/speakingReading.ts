import { PromptGenerationParams } from '../types';
import { getAgeStyle } from '../lib/ageStyle';
import { assembleFinalCanvaPrompt } from '../lib/canvaPromptEngine';

export interface VisualSlotInfo {
  token: string;
  type: string;
  visualDirective: string;
}

export function classifyVisualSlot(slot: string): VisualSlotInfo {
  const clean = slot.trim();
  const lower = clean.toLowerCase();

  // Country
  if (
    [
      'vietnam', 'england', 'america', 'usa', 'japan', 'australia', 'malaysia', 'singapore', 'thailand', 'france', 'korea', 'china'
    ].includes(lower)
  ) {
    return {
      token: clean,
      type: 'country',
      visualDirective: `a miniature national flag of ${clean} inside a tiny rounded flag shield container`,
    };
  }

  // Time
  if (lower.includes(':') || lower.includes("o'clock") || lower.includes('am') || lower.includes('pm') || lower.match(/^\d{1,2}\s*(am|pm)$/)) {
    return {
      token: clean,
      type: 'time',
      visualDirective: `a small analog clock face clearly displaying ${clean}`,
    };
  }

  // Date / Month / Day
  if (
    [
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'
    ].includes(lower) ||
    lower.match(/^\d{1,2}(st|nd|rd|th)?(\s+of)?\s+[a-z]+$/)
  ) {
    return {
      token: clean,
      type: 'date/month/day',
      visualDirective: `a miniature desk calendar icon showing the text date "${clean}"`,
    };
  }

  // Class code
  if (lower.match(/^\d+[a-z]\d*$/i)) {
    return {
      token: clean,
      type: 'class',
      visualDirective: `a small wooden chalkboard or class plaque displaying the class code "${clean}"`,
    };
  }

  // Transport / Vehicle
  if (['bike', 'bicycle', 'bus', 'car', 'train', 'plane', 'boat', 'motorbike'].includes(lower)) {
    return {
      token: clean,
      type: 'transport',
      visualDirective: `a clean miniature vehicle icon illustrating ${clean} (picture only, no text word)`,
    };
  }

  // Food / Drink
  if (['apple', 'banana', 'orange', 'bread', 'rice', 'milk', 'water', 'juice', 'pizza', 'chicken', 'fish', 'noodles', 'egg', 'cake', 'ice cream'].includes(lower)) {
    return {
      token: clean,
      type: 'food',
      visualDirective: `a crisp miniature food illustration of ${clean} (picture only, no printed word)`,
    };
  }

  // Action
  if (
    lower.endsWith('ing') ||
    ['read', 'write', 'draw', 'sing', 'dance', 'cook', 'swim', 'run', 'walk', 'skip', 'play football', 'play badminton'].includes(lower)
  ) {
    return {
      token: clean,
      type: 'action',
      visualDirective: `a dynamic miniature action vignette showing a student ${clean} (picture only, no text word)`,
    };
  }

  // Number / Age
  if (lower.match(/^\d+$/)) {
    return {
      token: clean,
      type: 'number/age',
      visualDirective: `a colorful circular number badge containing the numeral "${clean}"`,
    };
  }

  // Person Name (capitalized single word)
  if (clean.match(/^[A-Z][a-z]+$/) && !['School', 'Street', 'Road', 'Park'].includes(clean)) {
    return {
      token: clean,
      type: 'name',
      visualDirective: `a miniature cute avatar portrait with a visible nametag ribbon reading "${clean}"`,
    };
  }

  return {
    token: clean,
    type: 'object',
    visualDirective: `a crisp miniature illustration representing "${clean}"`,
  };
}

export interface ReadingRowParsed {
  rowNumber: number;
  originalSentence: string;
  sentenceWithRebus: string;
  slots: VisualSlotInfo[];
}

export function parseSpeakingReadingContent(raw: string): { pupilName: string; rows: ReadingRowParsed[] } {
  if (!raw || !raw.trim()) return { pupilName: 'Pupil', rows: [] };

  // Split into sentences by line or sentence delimiters
  const rawSentences = raw
    .split(/\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  let detectedPupilName = 'Pupil';
  const rows: ReadingRowParsed[] = [];

  let count = 0;
  for (const sentence of rawSentences) {
    if (count >= 8) break; // Maximum 8 rows

    const matches = Array.from(sentence.matchAll(/\(([^)]+)\)/g));
    if (matches.length === 0) {
      rows.push({
        rowNumber: count + 1,
        originalSentence: sentence,
        sentenceWithRebus: sentence,
        slots: [],
      });
      count++;
      continue;
    }

    const rowSlots: VisualSlotInfo[] = [];
    let sentenceWithRebus = sentence;

    for (const match of matches) {
      const fullMatch = match[0];
      const slotValue = match[1].trim();
      const classified = classifyVisualSlot(slotValue);
      rowSlots.push(classified);

      if (classified.type === 'name' && detectedPupilName === 'Pupil') {
        detectedPupilName = classified.token;
      }

      // Replace (slot) with visual placeholder tag
      sentenceWithRebus = sentenceWithRebus.replace(fullMatch, `[ICON: ${classified.token}]`);
    }

    rows.push({
      rowNumber: count + 1,
      originalSentence: sentence,
      sentenceWithRebus,
      slots: rowSlots,
    });

    count++;
  }

  return { pupilName: detectedPupilName, rows };
}

export function parseSpeakingReading(raw: string): { rows: ReadingRowParsed[]; slots: VisualSlotInfo[] } {
  const { rows } = parseSpeakingReadingContent(raw);
  const allSlots: VisualSlotInfo[] = [];
  rows.forEach((r) => allSlots.push(...r.slots));
  return { rows, slots: allSlots };
}

export function buildSpeakingReadingPrompt(params: PromptGenerationParams): string {
  const { grade, content, textbook, unitTitle, artStyle } = params;
  const ageStyle = getAgeStyle(grade, params.ageStyleOverride || content.ageStyleOverride);
  const strictness = params.strictness || content.promptStrictness || 'Rất chặt';

  const raw = content.speakingReadingContent?.trim() || '';
  const { pupilName, rows } = parseSpeakingReadingContent(raw);

  if (rows.length === 0) {
    return 'Lỗi: Vui lòng nhập ít nhất một đoạn văn có từ nằm trong ngoặc đơn (ví dụ: I ride my (bike) to school.) để tạo rebus icon.';
  }

  const allSlots: VisualSlotInfo[] = [];
  rows.forEach((r) => allSlots.push(...r.slots));

  const contentItems = [
    `Main Pupil Character: "${pupilName}"`,
    `Reading Sentences (${rows.length} horizontal rows total):`,
    ...rows.map(
      (r) =>
        `- Sentence: "${r.sentenceWithRebus}" (Visual slots: ${r.slots.map((s) => `"${s.token}" -> ${s.visualDirective}`).join('; ') || 'none'})`
    ),
  ].join('\n');

  const rowsLayout = rows.map((r) => {
    const slotDirectives = r.slots.map((s) => `[ICON: ${s.token}] replaced by ${s.visualDirective}`).join(', ');
    return [
      `  * Horizontal Row:`,
      `    - Spacious rounded rectangular reading bar with soft pastel fill and neat border.`,
      `    - Clean text: "${r.sentenceWithRebus}" in large high-contrast typography.`,
      slotDirectives ? `    - Inline icons: ${slotDirectives}.` : null,
      `    - Strictly NO row numbers or prefixes (do NOT write "${r.rowNumber}." or "Row ${r.rowNumber}").`,
    ]
      .filter(Boolean)
      .join('\n');
  });

  const layoutDescription = [
    `Horizontal 16:9 two-panel asymmetric layout:`,
    `- LEFT PANEL (approx. 30% width): One large, prominent full-body illustration of student "${pupilName}" standing cheerfully, smiling and gesturing towards the reading sentences on the right. Below the pupil is a neat nametag ribbon reading "${pupilName}".`,
    `- RIGHT PANEL (approx. 70% width): Stack of exactly ${rows.length} full-width horizontal reading rows:`,
    `  * All sentences are displayed as full-width horizontal rows stacked vertically.`,
    `  * Absolutely NO vertical columns.`,
    `  * Absolutely NO numbered rows (no "1.", "2.", "Row 1", "Row 2" prefixes).`,
    `  * Every parenthesized slot is converted to the designated inline educational icon.`,
    ...rowsLayout,
  ].join('\n');

  const visualsDescription = [
    `Large, cheerful, high-detail pupil character illustration for "${pupilName}" on the left side.`,
    `Integrated rebus visual icons replacing keywords inside the reading sentences on the right:`,
    ...allSlots.map((s) => `- "${s.token}": ${s.visualDirective}`),
  ].join('\n');

  return assembleFinalCanvaPrompt({
    create: `Create ONE colorful 16:9 primary-school English Speaking and Reading Rebus worksheet.`,
    curriculumContext: {
      textbook,
      grade,
      unitTitle,
    },
    content: contentItems,
    layout: layoutDescription,
    visuals: visualsDescription,
    style: `${artStyle} art style. ${ageStyle}. Pure white background (#FFFFFF), clean speech bubbles, high contrast text.`,
    exactCountRule: `EXACTLY 1 large pupil illustration on the left and EXACTLY ${rows.length} horizontal reading rows on the right. Do not add or remove rows. Do not divide into vertical columns. Do not add row numbers.`,
    additionalDoNots: [
      'do not divide the right side into vertical columns; arrange strictly as full-width horizontal rows',
      'do not print row numbers (no "1.", "2.", "Row 1", etc.) before the sentences',
      'do not show parentheses ( ) anywhere in the artwork or sentences',
      'do not add extra characters or multiple pupil avatars; show only ONE large pupil on the left',
    ],
    strictness,
  });
}
