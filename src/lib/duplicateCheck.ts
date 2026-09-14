import { MaterialTypeId, TeacherContentInput } from '../types';

export interface DuplicateCheckResult {
  hasDuplicate: boolean;
  message?: string;
  duplicates: string[];
}

export function checkDuplicateEntries(
  materialType: MaterialTypeId,
  content: TeacherContentInput
): DuplicateCheckResult {
  const duplicates: string[] = [];

  switch (materialType) {
    case 'vocabulary': {
      const raw = content.vocabInput || content.vocabularyList || '';
      const items = raw
        .split(/\n|,/)
        .map((w) => w.trim().toLowerCase())
        .filter((w) => w.length > 0);

      const seen = new Set<string>();
      for (const item of items) {
        // extract pure word if formatted with slash
        const cleanWord = item.includes('/') ? item.split('/')[0].trim() : item;
        if (!cleanWord) continue;
        if (seen.has(cleanWord)) {
          if (!duplicates.includes(cleanWord)) {
            duplicates.push(cleanWord);
          }
        } else {
          seen.add(cleanWord);
        }
      }
      break;
    }

    case 'tracing': {
      const raw = content.tracingContent || content.vocabularyList || '';
      const lines = raw
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const seen = new Set<string>();
      for (const line of lines) {
        const cleanLine = line.split('/')[0].trim().toLowerCase();
        if (!cleanLine) continue;
        if (seen.has(cleanLine)) {
          if (!duplicates.includes(cleanLine)) {
            duplicates.push(cleanLine);
          }
        } else {
          seen.add(cleanLine);
        }
      }
      break;
    }

    case 'exercise': {
      const raw = content.exerciseRows || content.vocabularyList || '';
      const rows = raw
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const seen = new Set<string>();
      for (const row of rows) {
        const mainPart = row.split('/')[0].trim().toLowerCase();
        if (!mainPart) continue;
        if (seen.has(mainPart)) {
          if (!duplicates.includes(mainPart)) {
            duplicates.push(mainPart);
          }
        } else {
          seen.add(mainPart);
        }
      }
      break;
    }

    case 'speakingWriting': {
      const raw = content.speakingWritingContent || '';
      const lines = raw
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const seenSlots = new Set<string>();
      for (const line of lines) {
        const matches = line.match(/\(([^)]+)\)/g);
        if (matches) {
          for (const m of matches) {
            const val = m.slice(1, -1).trim().toLowerCase();
            if (!val) continue;
            if (seenSlots.has(val)) {
              if (!duplicates.includes(val)) {
                duplicates.push(val);
              }
            } else {
              seenSlots.add(val);
            }
          }
        }
      }
      break;
    }

    case 'speakingReading': {
      const raw = content.speakingReadingContent || '';
      const matches = raw.match(/\(([^)]+)\)/g);
      if (matches) {
        const seen = new Set<string>();
        for (const m of matches) {
          const val = m.slice(1, -1).trim().toLowerCase();
          if (!val) continue;
          if (seen.has(val)) {
            if (!duplicates.includes(val)) {
              duplicates.push(val);
            }
          } else {
            seen.add(val);
          }
        }
      }
      break;
    }

    case 'mindmap': {
      const subtype = content.mindmapSubtype || 'Dạng 1 — Theo chủ đề';
      if (subtype === 'Dạng 1 — Theo chủ đề') {
        const raw = content.mindmapType1Keywords || '';
        const words = raw
          .split(/\n|,/)
          .map((w) => w.trim().toLowerCase())
          .filter((w) => w.length > 0);
        const seen = new Set<string>();
        for (const w of words) {
          if (seen.has(w)) {
            if (!duplicates.includes(w)) {
              duplicates.push(w);
            }
          } else {
            seen.add(w);
          }
        }
      } else if (subtype === 'Dạng 2 — Một nhân vật') {
        const raw = content.mindmapType2Info || '';
        const lines = raw
          .split('\n')
          .map((l) => l.trim().toLowerCase())
          .filter((l) => l.length > 0);
        const seen = new Set<string>();
        for (const l of lines) {
          const label = l.split(':')[0].trim();
          if (!label) continue;
          if (seen.has(label)) {
            if (!duplicates.includes(label)) {
              duplicates.push(label);
            }
          } else {
            seen.add(label);
          }
        }
      } else {
        const raw = content.mindmapType3Characters || '';
        const lines = raw
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
        const seen = new Set<string>();
        for (const l of lines) {
          const charName = l.split('/')[0].trim().toLowerCase();
          if (!charName) continue;
          if (seen.has(charName)) {
            if (!duplicates.includes(charName)) {
              duplicates.push(charName);
            }
          } else {
            seen.add(charName);
          }
        }
      }
      break;
    }
  }

  if (duplicates.length > 0) {
    return {
      hasDuplicate: true,
      message: `Phát hiện nội dung trùng lặp (${duplicates.join(', ')}). Giáo viên có thể chỉnh sửa nếu muốn các mục hoàn toàn khác biệt.`,
      duplicates,
    };
  }

  return {
    hasDuplicate: false,
    duplicates: [],
  };
}
