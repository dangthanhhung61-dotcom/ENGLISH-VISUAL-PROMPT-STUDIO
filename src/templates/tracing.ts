import { PromptGenerationParams } from '../types';
import { getAgeStyle } from '../lib/ageStyle';
import { assembleFinalCanvaPrompt } from '../lib/canvaPromptEngine';

export interface TracingLine {
  text: string;
  repeatCount: number;
}

export interface TracingBlock {
  vocabulary: string;
  lines: TracingLine[];
}

export function parseTracingContent(raw: string): TracingBlock[] {
  if (!raw || !raw.trim()) return [];

  // Separate by blank lines into blocks
  const rawBlocks = raw.split(/\n\s*\n/);
  const blocks: TracingBlock[] = [];

  for (const blockStr of rawBlocks) {
    const rawLines = blockStr
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (rawLines.length === 0) continue;

    // First line is the vocabulary item
    const vocab = rawLines[0];
    const lines: TracingLine[] = [];

    // Following lines are tracing items
    for (let i = 1; i < rawLines.length; i++) {
      const lineStr = rawLines[i];
      if (lineStr.includes('/')) {
        const parts = lineStr.split('/');
        const text = parts[0].trim();
        const count = parseInt(parts[1].trim(), 10) || 1;
        if (text) {
          lines.push({ text, repeatCount: count });
        }
      } else {
        lines.push({ text: lineStr, repeatCount: 1 });
      }
    }

    // If teacher only entered one line with no following lines, use it as tracing word repeated 3 times
    if (lines.length === 0) {
      lines.push({ text: vocab, repeatCount: 3 });
    }

    blocks.push({
      vocabulary: vocab,
      lines,
    });
  }

  return blocks;
}

export function buildTracingPrompt(params: PromptGenerationParams): string {
  const { grade, content, textbook, unitTitle, artStyle, aspectRatio } = params;
  const ageStyle = getAgeStyle(grade, params.ageStyleOverride || content.ageStyleOverride);
  const strictness = params.strictness || content.promptStrictness || 'Rất chặt';

  const title = content.tracingTitle?.trim() || 'Handwriting Practice';
  const rawContent = content.tracingContent?.trim() || content.vocabularyList?.trim() || '';
  const blocks = parseTracingContent(rawContent);

  if (blocks.length === 0) {
    return 'Lỗi: Vui lòng nhập nội dung luyện viết (từ vựng và các dòng câu kèm số lần lặp) để tạo prompt.';
  }

  const contentSummary = [
    `Worksheet Title: "${title}"`,
    `Tracing Blocks (${blocks.length} total):`,
    ...blocks.map((block, idx) => {
      const linesList = block.lines
        .map((l) => `  * Line: "${l.text}" (repeat ${l.repeatCount} time(s))`)
        .join('\n');
      return `Block ${idx + 1} (Vocabulary: "${block.vocabulary}"):\n${linesList}`;
    }),
  ].join('\n');

  const pastelColors = ['pastel sky blue', 'pastel mint green', 'pastel peach orange', 'pastel soft lavender', 'pastel buttercup yellow'];

  const blocksLayout = blocks.map((block, idx) => {
    const color = pastelColors[idx % pastelColors.length];
    const linesSpec = block.lines
      .map(
        (l) =>
          `    - Penmanship row: exact text "${l.text}" in light grey dotted/dashed font, repeated ${l.repeatCount} time(s) across 4-line guidelines (headline, midline, baseline).`
      )
      .join('\n');

    return [
      `Block ${idx + 1} ("${block.vocabulary}"):`,
      `  Framed by a thin rounded ${color} border with a soft tinted background.`,
      `  * LEFT COLUMN (approx. 30% width - Illustration): Clear educational line-art illustration of "${block.vocabulary}" with the label "${block.vocabulary}" clearly printed in bold font underneath.`,
      `  * RIGHT COLUMN (approx. 70% width - Tracing): Spacious handwriting practice area containing exact guidelines and repeat counts:`,
      linesSpec,
    ].join('\n');
  });

  const layoutDescription = [
    `Vertical A4 portrait printable layout (--aspect ${aspectRatio || '3:4'}) with EXACTLY ${blocks.length} stacked practice blocks:`,
    `Top Header: Centered title "${title}" in clean display font with a student Name & Date header line.`,
    `Stacked Practice Blocks (strictly left illustration, right tracing):`,
    ...blocksLayout,
  ].join('\n');

  return assembleFinalCanvaPrompt({
    create: `Create ONE vertical A4 portrait (${aspectRatio || '3:4'}) primary-school English Handwriting and Sentence Tracing worksheet.`,
    curriculumContext: {
      textbook,
      grade,
      unitTitle,
    },
    content: contentSummary,
    layout: layoutDescription,
    visuals: `Educational illustrations of ${blocks.map((b) => `"${b.vocabulary}"`).join(', ')} with crisp outlines suitable for student coloring. Soft pastel color frames.`,
    style: `${artStyle} art style. ${ageStyle}. High contrast, crisp printing lines, pure white paper background (#FFFFFF).`,
    exactCountRule: `EXACTLY ${blocks.length} vocabulary blocks on this worksheet. Do not add or remove blocks. Do not invent sentences.`,
    additionalDoNots: [
      'do not invent or add extra sentences, words, or unlisted practice lines',
      'do not alter the specified repeat counts for any tracing line',
      'do not add extra blocks beyond the specified blocks',
    ],
    strictness,
  });
}
