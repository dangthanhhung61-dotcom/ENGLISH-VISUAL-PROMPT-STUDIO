import { PromptGenerationParams } from '../types';
import { getAgeStyle } from '../lib/ageStyle';
import { assembleFinalCanvaPrompt } from '../lib/canvaPromptEngine';

export interface SpeakingWritingSlot {
  sentenceNumber: number;
  originalSentence: string;
  writingSentence: string;
  boxTitle: string;
  slotValue: string;
  illustrationDesc: string;
}

function deduceBoxTitle(sentence: string, slotValue: string): string {
  const lower = sentence.toLowerCase();
  const slotLower = slotValue.toLowerCase();

  if (lower.includes('name') || slotLower.match(/^[A-Z][a-z]+$/)) {
    return 'Name';
  }
  if (lower.includes('from') || lower.includes('country') || lower.includes('nationality')) {
    return 'Country';
  }
  if (lower.includes('class') || lower.includes('grade')) {
    return 'Class';
  }
  if (lower.includes('hobby') || lower.includes('like') || lower.includes('free time') || lower.includes('favorite')) {
    return 'Hobby';
  }
  if (lower.includes('birthday') || lower.includes('born') || lower.includes('month')) {
    return 'Birthday';
  }
  if (lower.includes('school')) {
    return 'School';
  }
  if (lower.includes('lunch') || lower.includes('eat') || lower.includes('food')) {
    return 'Lunch / Food';
  }
  if (lower.includes('future') || lower.includes('want to be') || lower.includes('dream')) {
    return 'Future / Job';
  }
  if (lower.includes('animal') || lower.includes('pet')) {
    return 'Pet / Animal';
  }
  if (lower.includes('color') || lower.includes('colour')) {
    return 'Favorite Color';
  }
  if (lower.includes('time') || lower.includes("o'clock")) {
    return 'Time';
  }

  return 'Info';
}

function getSlotIllustration(boxTitle: string, slotValue: string): string {
  switch (boxTitle) {
    case 'Country':
      return `national flag or landmark icon of "${slotValue}" with tag "${slotValue}"`;
    case 'Class':
      return `classroom chalkboard plaque displaying class code "${slotValue}"`;
    case 'Hobby':
      return `vibrant action illustration of "${slotValue}" with small label "${slotValue}"`;
    case 'Birthday':
      return `festive calendar or birthday cake icon showing "${slotValue}"`;
    case 'School':
      return `friendly school building badge with school name "${slotValue}"`;
    case 'Lunch / Food':
      return `appetizing food illustration of "${slotValue}" with label "${slotValue}"`;
    case 'Future / Job':
      return `professional costume or career icon representing "${slotValue}"`;
    case 'Name':
      return `decorative colored ribbon banner containing name "${slotValue}"`;
    default:
      return `thematic illustration representing "${slotValue}" with answer badge "${slotValue}"`;
  }
}

export function parseSpeakingWriting(raw: string): SpeakingWritingSlot[] {
  if (!raw || !raw.trim()) return [];

  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const slots: SpeakingWritingSlot[] = [];
  let counter = 1;

  for (const line of lines) {
    const matches = line.match(/\(([^)]+)\)/g);
    if (matches && matches.length > 0) {
      const slotMatch = matches[0];
      const slotValue = slotMatch.slice(1, -1).trim();

      const writingSentence = line.replace(
        slotMatch,
        '________________________________________'
      );

      const boxTitle = deduceBoxTitle(line, slotValue);
      const illustrationDesc = getSlotIllustration(boxTitle, slotValue);

      slots.push({
        sentenceNumber: counter++,
        originalSentence: line,
        writingSentence,
        boxTitle,
        slotValue,
        illustrationDesc,
      });
    } else {
      slots.push({
        sentenceNumber: counter++,
        originalSentence: line,
        writingSentence: line,
        boxTitle: 'Info',
        slotValue: '',
        illustrationDesc: 'thematic illustration badge',
      });
    }
  }

  return slots;
}

export function buildSpeakingWritingPrompt(params: PromptGenerationParams): string {
  const { grade, content, textbook, unitTitle, artStyle } = params;
  const ageStyle = getAgeStyle(grade, params.ageStyleOverride || content.ageStyleOverride);
  const strictness = params.strictness || content.promptStrictness || 'Rất chặt';

  const raw = content.speakingWritingContent?.trim() || '';
  const slots = parseSpeakingWriting(raw);

  if (slots.length === 0) {
    return 'Lỗi: Vui lòng nhập ít nhất 1 câu có từ cần điền trong ngoặc tròn (ví dụ: Her name is (Mali).) để tạo prompt.';
  }

  let pupilName = 'Pupil';
  for (const s of slots) {
    if (s.boxTitle === 'Name' && s.slotValue) {
      pupilName = s.slotValue;
      break;
    }
  }

  const cleanModelSentence = (str: string) => str.replace(/[()]/g, '');

  const contentItems = [
    `Pupil Profile: "${pupilName}"`,
    `Sentence & Cue Items (${slots.length} total):`,
    ...slots.map(
      (s) =>
        `- Model Sentence: "${cleanModelSentence(s.originalSentence)}" | Writing Blank: "${s.writingSentence}" | Cue Tag: "${s.slotValue}" [${s.boxTitle}]`
    ),
  ].join('\n');

  const writingLinesDesc = slots.map(
    (s) => `  * Line ${s.sentenceNumber}: "${s.writingSentence}" (long blank line for handwriting)`
  );

  const cueBadgesDesc = slots.map(
    (s) =>
      `  * Speaking Cue Badge [${s.boxTitle}]: Contains ONLY the concise cue tag "${s.slotValue}" and ${s.illustrationDesc} (Strictly NO full sentence in this box).`
  );

  const layoutDescription = [
    `Asymmetric two-panel horizontal 16:9 layout:`,
    `- LEFT SIDE — SPEAKING ZONE (approx. 45% width):`,
    `  * Large, friendly full-body student character illustration for "${pupilName}".`,
    `  * Exactly ${slots.length} distinct compact speaking cue badges/cards arranged neatly around or beside the character:`,
    ...cueBadgesDesc,
    `  * IMPORTANT: Speaking boxes must contain ONLY concise cue words/icons. They MUST NOT contain full source sentences.`,
    `- RIGHT SIDE — WRITING ZONE (approx. 55% width):`,
    `  * Spacious writing worksheet panel with ${slots.length} numbered gap-fill sentence lines featuring long neat blank lines for handwriting:`,
    ...writingLinesDesc,
    `  * Absolutely NO parentheses ( ) displayed on any sentence line.`,
  ].join('\n');

  return assembleFinalCanvaPrompt({
    create: `Create ONE colorful 16:9 primary-school English Speaking and Writing worksheet.`,
    curriculumContext: {
      textbook,
      grade,
      unitTitle,
    },
    content: contentItems,
    layout: layoutDescription,
    visuals: `Friendly full-body pupil character illustration for "${pupilName}". Crisp speaking cue badges with miniature icons.`,
    style: `${artStyle} art style. ${ageStyle}. Pure white background (#FFFFFF), clean card borders, balanced margins.`,
    exactCountRule: `EXACTLY 1 pupil character, EXACTLY ${slots.length} speaking cue badges on the left, and EXACTLY ${slots.length} sentence rows on the right. Do not add extra characters or sentences.`,
    additionalDoNots: [
      'do not print parentheses ( ) anywhere on the worksheet or inside the sentences',
      'speaking boxes must not contain full source sentences; they must contain only concise cue tags and visual badges',
      'do not shorten or remove the long blank underlines in the writing lines',
    ],
    strictness,
  });
}
