import { PromptGenerationParams, SinglePromptItem } from '../types';
import { getAgeStyle } from '../lib/ageStyle';
import { lookupWord } from '../data/dictionary';
import { assembleFinalCanvaPrompt } from '../lib/canvaPromptEngine';

export interface ParsedVocabItem {
  word: string;
  ipa: string;
  meaning: string;
  category: 'noun' | 'action' | 'sport';
}

export function parseVocabularyItems(raw: string): ParsedVocabItem[] {
  if (!raw || !raw.trim()) return [];

  // Split by newlines or commas
  const lines = raw
    .split(/\n|,/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return lines.map((line) => {
    // Check if teacher supplied inline custom format: word / ipa / meaning
    if (line.includes('/')) {
      const parts = line.split('/').map((p) => p.trim());
      const word = parts[0] || '';
      const ipa = parts[1] ? (parts[1].startsWith('/') ? parts[1] : `/${parts[1]}/`) : '';
      const meaning = parts[2] || '';
      const lookup = lookupWord(word);
      return {
        word,
        ipa: ipa || lookup.ipa,
        meaning: meaning || lookup.meaning,
        category: lookup.category,
      };
    }

    // Lookup standard dictionary
    const lookup = lookupWord(line);
    return {
      word: line,
      ipa: lookup.ipa,
      meaning: lookup.meaning,
      category: lookup.category,
    };
  });
}

function getPaletteDescription(palette: string): string {
  switch (palette) {
    case 'Màu 2 — Tím Lavender + Vàng sáng':
      return 'Color Palette: Elegant Lavender Purple and bright Sunny Yellow accents with soft pastel contours on a pure clean white background (#FFFFFF).';
    case 'Màu 3 — Xanh dương + Vàng sáng':
      return 'Color Palette: Dynamic Royal Blue and bright Sunny Yellow accents with soft pastel contours on a pure clean white background (#FFFFFF).';
    case 'Màu 1 — Xanh lá + Hồng đậm':
    default:
      return 'Color Palette: Fresh vibrant Green and bold Deep Pink / Magenta accents with soft pastel contours on a pure clean white background (#FFFFFF).';
  }
}

function getIllustrationRule(item: ParsedVocabItem): string {
  if (item.category === 'sport') {
    return `One or two cheerful school pupils actively performing and playing "${item.word}" in a friendly school environment with clear athletic poses, dynamic sports gear, and strictly no unrelated sports or objects.`;
  } else if (item.category === 'action') {
    return `Show a school pupil actively performing the action of "${item.word}" with clear expressive posture, relatable classroom/home context, cheerful body language, and strictly no other unrelated actions.`;
  } else {
    return `Large, prominent, high-clarity illustration of "${item.word}" centered on the left side with sharp outlines, vibrant colors, charming educational details, and strictly no other unrelated objects or vocabulary.`;
  }
}

function buildSingleCardPrompt(
  item: ParsedVocabItem,
  params: PromptGenerationParams,
  index?: number
): string {
  const { grade, content, textbook, unitTitle, artStyle } = params;
  const ageStyle = getAgeStyle(grade, params.ageStyleOverride || content.ageStyleOverride);
  const paletteDesc = getPaletteDescription(content.vocabPalette || 'Màu 1 — Xanh lá + Hồng đậm');
  const showIpa = content.vocabShowIpa !== false;
  const showMeaning = content.vocabShowMeaning !== false;
  const strictness = params.strictness || content.promptStrictness || 'Rất chặt';

  const contentLines: string[] = [`Word: "${item.word}"`];
  if (showIpa && item.ipa) {
    contentLines.push(`Phonetic Transcription (IPA): "${item.ipa}"`);
  }
  if (showMeaning && item.meaning) {
    contentLines.push(`Vietnamese Meaning: "${item.meaning}"`);
  }

  const layoutDescription = [
    'Single horizontal 16:9 flashcard split symmetrically into two distinct functional halves (approx. 50/50 width):',
    `- LEFT SIDE (approx. 50% width): Dedicated spacious illustration zone featuring a large, prominent illustration of "${item.word}" centered with balanced margins.`,
    `- RIGHT SIDE (approx. 50% width): Large rounded rectangular pastel text panel with smooth pill-shaped borders containing:`,
    `  * Line 1: English word "${item.word}" printed in very large, bold red typography.`,
    showIpa && item.ipa
      ? `  * Line 2: Phonetic transcription "${item.ipa}" printed in clear medium-sized black typography.`
      : null,
    showMeaning && item.meaning
      ? `  * Line 3: Vietnamese meaning "${item.meaning}" printed in clear medium-sized blue typography.`
      : null,
  ]
    .filter(Boolean)
    .join('\n');

  return assembleFinalCanvaPrompt({
    create: `Create ONE colorful 16:9 primary-school English Vocabulary flashcard for "${item.word}".`,
    curriculumContext: {
      textbook,
      grade,
      unitTitle,
    },
    content: contentLines.join('\n'),
    layout: layoutDescription,
    visuals: `${getIllustrationRule(item)}\n${paletteDesc}`,
    style: `${artStyle} art style. ${ageStyle}. Pure clean background (#FFFFFF), crisp typography alignment, balanced negative space, zero cluttered artifacts.`,
    exactCountRule: `EXACTLY 1 vocabulary item ("${item.word}") on this card. No unrelated vocabulary. Do not add extra cards.`,
    additionalDoNots: [
      'do not add any unrelated vocabulary or extraneous objects; focus solely on the specified word',
      'do not print unlisted words or secondary illustrations',
    ],
    strictness,
  });
}

export function buildVocabularyBatchPrompts(params: PromptGenerationParams): SinglePromptItem[] {
  const raw = params.content.vocabInput || params.content.vocabularyList || '';
  const items = parseVocabularyItems(raw);

  if (items.length === 0) {
    return [];
  }

  // Maximum recommended batch: 5 prompts
  const targetItems = items.slice(0, 5);

  return targetItems.map((item, idx) => ({
    id: `vocab-prompt-${idx + 1}`,
    label: `Thẻ ${idx + 1}: ${item.word}`,
    word: item.word,
    promptText: buildSingleCardPrompt(item, params, idx + 1),
  }));
}

export function buildVocabularyPrompt(params: PromptGenerationParams): string {
  const exportType = params.content.vocabExportType || '1 từ = 1 prompt';
  const raw = params.content.vocabInput || params.content.vocabularyList || '';
  const items = parseVocabularyItems(raw);

  if (items.length === 0) {
    return 'Lỗi: Vui lòng nhập ít nhất 1 từ vựng (ví dụ: apple, cat, bike) để tạo prompt.';
  }

  if (exportType === '1 từ = 1 prompt') {
    const batch = buildVocabularyBatchPrompts(params);
    if (batch.length === 1) {
      return batch[0].promptText;
    }
    // Return main prompt for first card or join
    return batch[0].promptText;
  }

  // Nhiều từ = 1 worksheet
  const { grade, content, textbook, unitTitle, artStyle } = params;
  const ageStyle = getAgeStyle(grade, params.ageStyleOverride || content.ageStyleOverride);
  const paletteDesc = getPaletteDescription(content.vocabPalette || 'Màu 1 — Xanh lá + Hồng đậm');
  const showIpa = content.vocabShowIpa !== false;
  const showMeaning = content.vocabShowMeaning !== false;
  const strictness = params.strictness || content.promptStrictness || 'Rất chặt';

  const targetItems = items.slice(0, 6);

  const contentLines = targetItems.map(
    (item, idx) =>
      `${idx + 1}. Word: "${item.word}"${showIpa && item.ipa ? ` | IPA: "${item.ipa}"` : ''}${showMeaning && item.meaning ? ` | Meaning: "${item.meaning}"` : ''}`
  );

  const cardsDesc = targetItems.map((item, idx) => {
    const textLines = [`Word "${item.word}" (very large red)`];
    if (showIpa && item.ipa) textLines.push(`IPA "${item.ipa}" (black)`);
    if (showMeaning && item.meaning) textLines.push(`Meaning "${item.meaning}" (blue)`);
    return `Block ${idx + 1} ("${item.word}"): Left half shows ${getIllustrationRule(item)}; Right half shows rounded text panel with: ${textLines.join(', ')}.`;
  });

  return assembleFinalCanvaPrompt({
    create: `Create ONE colorful 16:9 primary-school English Vocabulary worksheet displaying ${targetItems.length} flashcard blocks.`,
    curriculumContext: {
      textbook,
      grade,
      unitTitle,
    },
    content: contentLines.join('\n'),
    layout: [
      `Symmetrical grid displaying ${targetItems.length} flashcard blocks with balanced margins and rounded pastel dividing borders:`,
      ...cardsDesc.map((c) => `- ${c}`),
    ].join('\n'),
    visuals: `Child-friendly illustrations for each vocabulary item with crisp outlines. ${paletteDesc}`,
    style: `${artStyle} art style. ${ageStyle}. Pure clean background (#FFFFFF), crisp typography alignment.`,
    exactCountRule: `EXACTLY ${targetItems.length} vocabulary blocks on this worksheet. Do not add or remove cards.`,
    strictness,
  });
}
