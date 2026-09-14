import {
  GradeLevel,
  TextbookChoice,
  MaterialTypeId,
  TeacherContentInput,
  SavedPromptItem,
  AspectRatioChoice,
  ArtStyleChoice,
  AgeStyleOverride,
  PromptHistoryRecord,
} from '../types';

export const STORAGE_KEYS = {
  GRADE: 'englishVisualPromptStudio.grade',
  TEXTBOOK: 'englishVisualPromptStudio.textbook',
  UNIT_ID: 'englishVisualPromptStudio.unitId',
  CUSTOM_TOPIC: 'englishVisualPromptStudio.customTopic',
  MATERIAL_TYPE: 'englishVisualPromptStudio.materialType',
  ART_STYLE: 'englishVisualPromptStudio.artStyle',
  AGE_STYLE_OVERRIDE: 'englishVisualPromptStudio.ageStyleOverride',
  ASPECT_RATIO: 'englishVisualPromptStudio.aspectRatio',
  RECENT_INPUT: 'englishVisualPromptStudio.recentInput',
  SAVED_PROMPTS: 'englishVisualPromptStudio.savedPrompts',
  FAVORITE_UNITS: 'englishVisualPromptStudio.favoriteUnits',
  PROMPT_HISTORY: 'englishVisualPromptStudio.promptHistory',
};

// Legacy fallback keys for backward compatibility
const LEGACY_KEYS: Record<string, string> = {
  [STORAGE_KEYS.GRADE]: 'evps_grade',
  [STORAGE_KEYS.TEXTBOOK]: 'evps_textbook',
  [STORAGE_KEYS.UNIT_ID]: 'evps_unit_id',
  [STORAGE_KEYS.CUSTOM_TOPIC]: 'evps_custom_topic',
  [STORAGE_KEYS.MATERIAL_TYPE]: 'evps_material_type',
  [STORAGE_KEYS.ART_STYLE]: 'evps_art_style',
  [STORAGE_KEYS.ASPECT_RATIO]: 'evps_aspect_ratio',
  [STORAGE_KEYS.RECENT_INPUT]: 'evps_recent_input',
  [STORAGE_KEYS.SAVED_PROMPTS]: 'evps_saved_prompts',
  [STORAGE_KEYS.FAVORITE_UNITS]: 'evps_fav_units',
};

// Clean up deprecated recent units storage keys
try {
  localStorage.removeItem('englishVisualPromptStudio.recentUnits');
  localStorage.removeItem('evps_recent_units');
} catch {}

function safeGetItem(key: string): string | null {
  try {
    const val = localStorage.getItem(key);
    if (val !== null) return val;
    const legacy = LEGACY_KEYS[key];
    if (legacy) {
      return localStorage.getItem(legacy);
    }
  } catch {
    // ignore
  }
  return null;
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

const VALID_GRADES: GradeLevel[] = [
  'Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5', 'Lớp 6',
  'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12',
];

export function getStoredGrade(): GradeLevel {
  try {
    const val = safeGetItem(STORAGE_KEYS.GRADE);
    if (val && VALID_GRADES.includes(val as GradeLevel)) {
      return val as GradeLevel;
    }
    if (val) {
      const match = val.match(/\d+/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num >= 1 && num <= 12) {
          return `Lớp ${num}` as GradeLevel;
        }
      }
    }
  } catch {}
  return 'Lớp 3';
}

export function saveStoredGrade(grade: GradeLevel): void {
  safeSetItem(STORAGE_KEYS.GRADE, grade);
}

export function getStoredTextbook(): TextbookChoice {
  try {
    const val = safeGetItem(STORAGE_KEYS.TEXTBOOK);
    if (val === 'Global Success' || val === 'Chủ đề tự nhập') {
      return val;
    }
  } catch {}
  return 'Global Success';
}

export function saveStoredTextbook(textbook: TextbookChoice): void {
  safeSetItem(STORAGE_KEYS.TEXTBOOK, textbook);
}

export function getStoredUnitId(): string {
  try {
    return safeGetItem(STORAGE_KEYS.UNIT_ID) || '';
  } catch {
    return '';
  }
}

export function saveStoredUnitId(unitId: string): void {
  safeSetItem(STORAGE_KEYS.UNIT_ID, unitId);
}

export function getStoredCustomTopic(): string {
  try {
    return safeGetItem(STORAGE_KEYS.CUSTOM_TOPIC) || '';
  } catch {
    return '';
  }
}

export function saveStoredCustomTopic(topic: string): void {
  safeSetItem(STORAGE_KEYS.CUSTOM_TOPIC, topic);
}

export function getStoredMaterialType(): MaterialTypeId {
  try {
    const val = safeGetItem(STORAGE_KEYS.MATERIAL_TYPE);
    const validTypes: MaterialTypeId[] = [
      'vocabulary',
      'tracing',
      'exercise',
      'speakingWriting',
      'speakingReading',
      'mindmap',
    ];
    if (val && validTypes.includes(val as MaterialTypeId)) {
      return val as MaterialTypeId;
    }
  } catch {}
  return 'vocabulary';
}

export function saveStoredMaterialType(type: MaterialTypeId): void {
  safeSetItem(STORAGE_KEYS.MATERIAL_TYPE, type);
}

export function getStoredArtStyle(): ArtStyleChoice {
  try {
    const val = safeGetItem(STORAGE_KEYS.ART_STYLE);
    if (val) return val as ArtStyleChoice;
  } catch {}
  return '2D Vector Flat';
}

export function saveStoredArtStyle(style: ArtStyleChoice): void {
  safeSetItem(STORAGE_KEYS.ART_STYLE, style);
}

export function getStoredAgeStyleOverride(): AgeStyleOverride {
  try {
    const val = safeGetItem(STORAGE_KEYS.AGE_STYLE_OVERRIDE);
    const validOverrides: AgeStyleOverride[] = [
      'Tự động',
      'Dễ thương tiểu học',
      'Cartoon giáo dục',
      'Flat illustration',
      'Modern student',
      'Infographic',
      'Semi-realistic',
    ];
    if (val && validOverrides.includes(val as AgeStyleOverride)) {
      return val as AgeStyleOverride;
    }
  } catch {}
  return 'Tự động';
}

export function saveStoredAgeStyleOverride(override: AgeStyleOverride): void {
  safeSetItem(STORAGE_KEYS.AGE_STYLE_OVERRIDE, override);
}

export function getStoredAspectRatio(): AspectRatioChoice {
  try {
    const val = safeGetItem(STORAGE_KEYS.ASPECT_RATIO);
    if (val === '1:1' || val === '16:9' || val === '3:4' || val === '4:3' || val === '9:16') {
      return val as AspectRatioChoice;
    }
  } catch {}
  return '1:1';
}

export function saveStoredAspectRatio(ratio: AspectRatioChoice): void {
  safeSetItem(STORAGE_KEYS.ASPECT_RATIO, ratio);
}

export function getStoredRecentInput(): TeacherContentInput | null {
  try {
    const data = safeGetItem(STORAGE_KEYS.RECENT_INPUT);
    if (data) {
      const parsed = JSON.parse(data);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as TeacherContentInput;
      }
    }
  } catch {}
  return null;
}

export function saveStoredRecentInput(input: TeacherContentInput): void {
  try {
    safeSetItem(STORAGE_KEYS.RECENT_INPUT, JSON.stringify(input));
  } catch {}
}

export function getStoredSavedPrompts(): SavedPromptItem[] {
  try {
    const data = safeGetItem(STORAGE_KEYS.SAVED_PROMPTS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function savePromptItem(item: SavedPromptItem): SavedPromptItem[] {
  try {
    const existing = getStoredSavedPrompts();
    const updated = [item, ...existing.filter((p) => p.id !== item.id)].slice(0, 50);
    safeSetItem(STORAGE_KEYS.SAVED_PROMPTS, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function deleteSavedPrompt(id: string): SavedPromptItem[] {
  try {
    const existing = getStoredSavedPrompts();
    const updated = existing.filter((p) => p.id !== id);
    safeSetItem(STORAGE_KEYS.SAVED_PROMPTS, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearAllSavedPrompts(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVED_PROMPTS);
  } catch {}
}

export function getFavoriteUnits(): string[] {
  try {
    const data = safeGetItem(STORAGE_KEYS.FAVORITE_UNITS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function toggleFavoriteUnit(unitId: string): string[] {
  try {
    const favs = getFavoriteUnits();
    const updated = favs.includes(unitId) ? favs.filter((id) => id !== unitId) : [...favs, unitId];
    safeSetItem(STORAGE_KEYS.FAVORITE_UNITS, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

// ==========================================
// PROMPT HISTORY (MAX 20 RECORDS)
// ==========================================
export function getStoredPromptHistory(): PromptHistoryRecord[] {
  try {
    const data = safeGetItem(STORAGE_KEYS.PROMPT_HISTORY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function addPromptHistoryRecord(record: {
  grade: GradeLevel;
  unit: string;
  materialType: MaterialTypeId;
  materialTypeName: string;
  prompt: string;
}): PromptHistoryRecord[] {
  try {
    const existing = getStoredPromptHistory();
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateTime = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    // Don't add duplicate if the very latest prompt is identical
    if (existing.length > 0 && existing[0].prompt === record.prompt) {
      return existing;
    }

    const newRecord: PromptHistoryRecord = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      dateTime,
      ...record,
    };

    const updated = [newRecord, ...existing].slice(0, 20);
    safeSetItem(STORAGE_KEYS.PROMPT_HISTORY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function deletePromptHistoryRecord(id: string): PromptHistoryRecord[] {
  try {
    const existing = getStoredPromptHistory();
    const updated = existing.filter((h) => h.id !== id);
    safeSetItem(STORAGE_KEYS.PROMPT_HISTORY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearPromptHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROMPT_HISTORY);
  } catch {}
}
