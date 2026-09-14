import { PromptStrictness, GradeLevel, TextbookChoice } from '../types';

export interface FinalCanvaPromptSpec {
  create: string;
  curriculumContext: {
    textbook: TextbookChoice;
    grade: GradeLevel;
    unitTitle: string;
  };
  content: string;
  layout: string;
  visuals: string;
  style: string;
  exactCountRule?: string;
  additionalDoNots?: string[];
  strictness?: PromptStrictness;
}

/**
 * Deterministic template assembler adhering strictly to the final Canva Dream Lab prompt specification.
 * Structure:
 * CREATE:
 * CURRICULUM CONTEXT:
 * CONTENT:
 * LAYOUT:
 * VISUALS:
 * TEXT QUALITY:
 * STYLE:
 * CONTENT LOCK:
 * DO NOT:
 * CANVA CANDIDATE RULE:
 */
export function assembleFinalCanvaPrompt(spec: FinalCanvaPromptSpec): string {
  const strictness: PromptStrictness = spec.strictness || 'Rất chặt';

  // 1. CREATE: One short sentence + ONE WORKSHEET RULE
  let createText = spec.create.trim();
  const oneWorksheetRule =
    'Create ONE complete standalone educational worksheet per generated image. Do not create a contact sheet. Do not place several alternative worksheet designs inside the same image.';
  if (!createText.includes('Create ONE complete standalone educational')) {
    createText = `${createText}\n${oneWorksheetRule}`;
  }

  // 2. CURRICULUM CONTEXT
  const curriculumSection = [
    'CURRICULUM CONTEXT:',
    `Textbook:\n${spec.curriculumContext.textbook}`,
    `Grade:\n${spec.curriculumContext.grade}`,
    `Unit:\n${spec.curriculumContext.unitTitle || 'General English Unit'}`,
    'This section provides context only.\nTeacher-entered content has higher priority.',
  ].join('\n\n');

  // 3. CONTENT
  const contentSection = [
    'CONTENT:',
    spec.content.trim(),
  ].join('\n\n');

  // 4. LAYOUT
  const layoutParts = [spec.layout.trim()];
  if (strictness === 'Rất chặt' && spec.exactCountRule) {
    layoutParts.push(spec.exactCountRule.trim());
  }
  const layoutSection = [
    'LAYOUT:',
    layoutParts.join('\n\n'),
  ].join('\n\n');

  // 5. VISUALS
  const visualsSection = [
    'VISUALS:',
    spec.visuals.trim(),
  ].join('\n\n');

  // 6. TEXT QUALITY
  const textQualitySection = [
    'TEXT QUALITY:',
    'Use large, bold, highly legible classroom text.\nKeep English spelling exact.\nDo not create gibberish.\nDo not duplicate letters or words.\nDo not truncate labels.\nKeep text fully inside its intended panel.',
  ].join('\n\n');

  // 7. STYLE
  const styleSection = [
    'STYLE:',
    spec.style.trim(),
  ].join('\n\n');

  // 8. CONTENT LOCK
  const contentLockSection = [
    'CONTENT LOCK:',
    'Preserve every supplied name, word, phrase, sentence, age, class code, number, date, day, month and time exactly as provided.\n\nDo not substitute names.\nDo not replace vocabulary.\nDo not change numbers.\nDo not create new educational information.\nDo not omit supplied items.',
  ].join('\n\n');

  // 9. DO NOT
  const doNotItems = [
    'invent extra text',
    'change supplied data',
    'duplicate cards',
    'omit cards',
    'add extra characters',
    'add a watermark',
    'add a logo',
    'create a collage of multiple worksheets',
    'create several worksheet versions inside one image',
  ];

  if (strictness === 'Rất chặt' && spec.exactCountRule) {
    doNotItems.push(`do not add or remove cards; ${spec.exactCountRule.toLowerCase()}`);
  }

  if (spec.additionalDoNots && spec.additionalDoNots.length > 0) {
    doNotItems.push(...spec.additionalDoNots);
  }

  const doNotSection = [
    'DO NOT:',
    doNotItems.map((item) => `- ${item}`).join('\n'),
  ].join('\n\n');

  // 10. CANVA CANDIDATE RULE
  const candidateRuleSection = [
    'CANVA CANDIDATE RULE:',
    'If Canva produces multiple candidate images, every candidate must preserve exactly the same educational content.\n\nCandidates may vary only in visual treatment such as:\n- character pose\n- small decorations\n- border styling\n- spacing\n- pastel color distribution\n\nCandidates MUST NOT vary:\n- names\n- vocabulary\n- sentences\n- ages\n- classes\n- numbers\n- dates\n- times\n- number of cards\n- educational meaning',
  ].join('\n\n');

  return [
    `CREATE:\n${createText}`,
    curriculumSection,
    contentSection,
    layoutSection,
    visualsSection,
    textQualitySection,
    styleSection,
    contentLockSection,
    doNotSection,
    candidateRuleSection,
  ].join('\n\n');
}

/**
 * Extracts ONLY the prompt structure from CREATE: to CANVA CANDIDATE RULE:
 * Strips any UI text, debugging info, JSON, or surrounding artifacts.
 */
export function extractCanvaPromptForClipboard(rawText: string): string {
  if (!rawText) return '';
  const text = rawText.trim();
  const createIdx = text.indexOf('CREATE:');
  if (createIdx === -1) {
    return text;
  }
  return text.substring(createIdx).trim();
}
