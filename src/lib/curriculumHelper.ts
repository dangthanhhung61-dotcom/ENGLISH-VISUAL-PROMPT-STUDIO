import {
  MaterialTypeId,
  CurriculumUnit,
  TeacherContentInput,
  ContentSourceType,
  TextbookVocabItem,
} from '../types';

/**
 * Check the origin/source of a word or phrase against current curriculum unit.
 * Guaranteed to NEVER claim unverified content is SGK.
 * Only two sources exist: 'textbook' and 'teacher'.
 */
export function determineWordSource(
  word: string,
  unit: CurriculumUnit | null
): ContentSourceType {
  if (!unit) return 'teacher';
  const clean = word.trim().toLowerCase();
  if (!clean) return 'teacher';

  const inTextbook = unit.textbookVocabulary.some(
    (item) => item.word.toLowerCase() === clean
  );
  if (inTextbook) return 'textbook';

  return 'teacher';
}

/**
 * Format verified textbook data for the active material mode.
 * STRICT RULE: Only verified textbook content is used. Nothing invented.
 */
export function formatTextbookDataForMode(
  materialType: MaterialTypeId,
  unit: CurriculumUnit
): Partial<TeacherContentInput> {
  const title = `Unit ${unit.unit}: ${unit.title}`;
  const words = unit.textbookVocabulary || [];
  const patterns = unit.textbookPatterns || [];

  if (words.length === 0 && patterns.length === 0) {
    return {};
  }

  switch (materialType) {
    case 'vocabulary': {
      // Build lines: "word / /ipa/ / vietnamese" or simply "word"
      const lines = words.map((v) => {
        if (v.ipa && v.vietnamese) {
          return `${v.word} / ${v.ipa} / ${v.vietnamese}`;
        }
        if (v.vietnamese) {
          return `${v.word} / ${v.vietnamese}`;
        }
        return v.word;
      });
      const text = lines.join('\n');
      return {
        vocabInput: text,
        vocabularyList: text,
        activityTitle: title,
      };
    }

    case 'tracing': {
      // Build handwriting tracing lines with repeat counts
      const lines: string[] = [];
      // Word tracing lines: word / 3
      words.forEach((v) => {
        lines.push(`${v.word} / 3`);
      });
      // Pattern tracing lines: pattern / 2
      patterns.slice(0, 3).forEach((p) => {
        lines.push(`${p} / 2`);
      });

      return {
        tracingTitle: title,
        tracingContent: lines.join('\n'),
      };
    }

    case 'exercise': {
      // 8 Cards exercise layout:
      // Rows format: Label | Type | Text / Target | Visual prompt
      // Label in UI: "Dữ liệu gợi ý – có thể chỉnh sửa"
      const rows: string[] = [];
      const count = Math.min(8, Math.max(words.length, patterns.length));

      for (let i = 0; i < 8; i++) {
        const num = i + 1;
        if (i < words.length) {
          const w = words[i].word;
          rows.push(`Card ${num} | Look and write | ${w} | Illustration of ${w} for elementary school`);
        } else if (i - words.length < patterns.length) {
          const p = patterns[i - words.length];
          rows.push(`Card ${num} | Read and tick | ${p} | Illustration depicting ${p}`);
        } else if (words.length > 0) {
          const w = words[i % words.length].word;
          rows.push(`Card ${num} | Match the picture | ${w} | Clear educational icon of ${w}`);
        } else {
          rows.push(`Card ${num} | Practice | Question ${num} | Educational illustration`);
        }
      }

      return {
        exerciseTitle: title,
        exerciseSample1: words[0]?.word ? `Sample 1: ${words[0].word}` : 'Sample A',
        exerciseSample2: words[1]?.word ? `Sample 2: ${words[1].word}` : 'Sample B',
        exerciseRows: rows.join('\n'),
      };
    }

    case 'speakingWriting': {
      // 45% character on left, 55% fill-in sentences with (...)
      const lines: string[] = [];
      patterns.slice(0, 5).forEach((p) => {
        // Enclose keywords in parentheses for fill-in-the-blank
        let formatted = p;
        for (const w of words) {
          const regex = new RegExp(`\\b(${w.word})\\b`, 'i');
          if (regex.test(formatted)) {
            formatted = formatted.replace(regex, '($1)');
            break;
          }
        }
        if (!formatted.includes('(')) {
          // If no word matched, wrap last word in parentheses
          const parts = formatted.split(' ');
          if (parts.length > 1) {
            const last = parts[parts.length - 1].replace(/[.!?]/, '');
            formatted = formatted.replace(last, `(${last})`);
          }
        }
        lines.push(formatted);
      });

      return {
        activityTitle: title,
        speakingWritingContent: lines.join('\n'),
      };
    }

    case 'speakingReading': {
      // Rebus reader sentences with (icon word)
      const lines: string[] = [];
      patterns.slice(0, 6).forEach((p) => {
        let formatted = p;
        for (const w of words) {
          const regex = new RegExp(`\\b(${w.word})\\b`, 'i');
          if (regex.test(formatted)) {
            formatted = formatted.replace(regex, '($1)');
            break;
          }
        }
        if (!formatted.includes('(')) {
          const parts = formatted.split(' ');
          if (parts.length > 1) {
            const last = parts[parts.length - 1].replace(/[.!?]/, '');
            formatted = formatted.replace(last, `(${last})`);
          }
        }
        lines.push(formatted);
      });

      return {
        activityTitle: title,
        speakingReadingContent: lines.join('\n'),
      };
    }

    case 'mindmap': {
      const kw = words.map((w) => w.word).join(', ');
      return {
        mindmapType1Title: title,
        mindmapType1Topic: unit.title,
        mindmapType1Pattern: patterns[0] || '',
        mindmapType1Keywords: kw,
      };
    }

    default:
      return {};
  }
}
