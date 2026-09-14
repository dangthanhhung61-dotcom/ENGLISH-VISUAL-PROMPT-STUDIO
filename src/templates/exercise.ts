import { PromptGenerationParams } from '../types';
import { getAgeStyle } from '../lib/ageStyle';
import { assembleFinalCanvaPrompt } from '../lib/canvaPromptEngine';

export interface ExerciseRowParsed {
  cardNumber: number;
  part1Main: string;
  part2TopRight: string;
  part3BottomLeft: string;
  part4BottomRight: string;
}

export function formatExerciseToken(token: string): string {
  const clean = token.trim().toLowerCase();
  if (clean === 'tick') {
    return 'a neat green check mark inside a white/green circle icon';
  }
  if (clean === 'cross') {
    return 'a neat red X mark inside a white/red circle icon';
  }
  if (clean === 'he' || clean === 'his') {
    return 'a friendly young schoolboy character illustration avatar';
  }
  if (clean === 'she' || clean === 'her') {
    return 'a friendly young schoolgirl character illustration avatar';
  }
  if (clean === 'our') {
    return 'a small group of cheerful school pupils illustration';
  }
  if (!token.trim()) {
    return 'Empty';
  }
  return `text label or tag "${token.trim()}"`;
}

export function parseExerciseRows(raw: string): ExerciseRowParsed[] {
  if (!raw || !raw.trim()) return [];

  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return lines.slice(0, 8).map((line, idx) => {
    const parts = line.split('/').map((p) => p.trim());
    return {
      cardNumber: idx + 1,
      part1Main: parts[0] || '',
      part2TopRight: parts[1] || '',
      part3BottomLeft: parts[2] || '',
      part4BottomRight: parts[3] || '',
    };
  });
}

export function buildExercisePrompt(params: PromptGenerationParams): string {
  const { grade, content, textbook, unitTitle, artStyle } = params;
  const ageStyle = getAgeStyle(grade, params.ageStyleOverride || content.ageStyleOverride);
  const strictness = params.strictness || content.promptStrictness || 'Rất chặt';

  const title = content.exerciseTitle?.trim() || 'Exercise';
  const sample1 = content.exerciseSample1?.trim() || '';
  const sample2 = content.exerciseSample2?.trim() || '';
  const rawRows = content.exerciseRows?.trim() || content.vocabularyList?.trim() || '';
  const rows = parseExerciseRows(rawRows);

  if (rows.length !== 8) {
    return `Lỗi: Dạng bài tập Exercise yêu cầu chính xác 8 hàng dữ liệu (hiện tại có ${rows.length} hàng). Mỗi hàng theo cú pháp: nội dung chính / góc trên phải / góc dưới trái / góc dưới phải.`;
  }

  const contentItems: string[] = [
    `Worksheet Title: "${title}"`,
  ];
  if (sample1) contentItems.push(`Model Dialogue A: "${sample1}"`);
  if (sample2) contentItems.push(`Model Dialogue B: "${sample2}"`);
  contentItems.push(
    `Cards Data (8 items):`,
    ...rows.map(
      (r) =>
        `Card ${r.cardNumber}: Main: "${r.part1Main}" | Top-Right: "${r.part2TopRight || 'none'}" | Bottom-Left: "${r.part3BottomLeft || 'none'}" | Bottom-Right: "${r.part4BottomRight || 'none'}"`
    )
  );

  const cardsLayout = rows.map((r) => {
    const cornerSpecs = [];
    if (r.part2TopRight) cornerSpecs.push(`Top-Right Corner: ${formatExerciseToken(r.part2TopRight)}`);
    if (r.part3BottomLeft) cornerSpecs.push(`Bottom-Left Corner: ${formatExerciseToken(r.part3BottomLeft)}`);
    if (r.part4BottomRight) cornerSpecs.push(`Bottom-Right Corner: ${formatExerciseToken(r.part4BottomRight)}`);

    const missingCorners = [];
    if (!r.part2TopRight) missingCorners.push('Top-Right');
    if (!r.part3BottomLeft) missingCorners.push('Bottom-Left');
    if (!r.part4BottomRight) missingCorners.push('Bottom-Right');
    if (missingCorners.length > 0) {
      cornerSpecs.push(`Missing corners (${missingCorners.join(', ')}): Must remain completely empty and blank`);
    }

    return [
      `Card ${r.cardNumber}:`,
      `  - Circular badge "${r.cardNumber}" in top-left corner.`,
      `  - Center: Large clear illustration of "${r.part1Main}" with text label "${r.part1Main}" printed below.`,
      ...cornerSpecs.map((cs) => `  - ${cs}.`),
    ].join('\n');
  });

  const layoutDescription = [
    `Organized as EXACTLY 8 NUMBERED CARDS in a symmetrical 2x4 grid layout:`,
    `- Top row: 4 cards (Cards 1, 2, 3, 4)`,
    `- Bottom row: 4 cards (Cards 5, 6, 7, 8)`,
    `Header Section: Centered title "${title}" in bold display lettering.${sample1 || sample2 ? ` Prominent model dialogue banner directly beneath title.` : ''}`,
    `Card Specifications:`,
    ...cardsLayout,
  ].join('\n');

  return assembleFinalCanvaPrompt({
    create: `Create ONE colorful 16:9 primary-school English Exercise worksheet with EXACTLY 8 cards.`,
    curriculumContext: {
      textbook,
      grade,
      unitTitle,
    },
    content: contentItems.join('\n'),
    layout: layoutDescription,
    visuals: `Vibrant, high-clarity illustrations for each card's activity or item (${rows.map((r) => `"${r.part1Main}"`).join(', ')}). Distinct visual cues (check ticks, cross marks, avatars).`,
    style: `${artStyle} art style. ${ageStyle}. Pure white background (#FFFFFF), clean card borders, balanced margins.`,
    exactCountRule: `EXACTLY 8 cards. No ninth card. Do not add or remove cards.`,
    additionalDoNots: [
      'never create a ninth card under any circumstances; the worksheet has strictly 8 cards in a 2x4 grid',
      'missing sections without supplied data must remain completely empty; do not invent filler icons or text for unsupplied corners',
    ],
    strictness,
  });
}
