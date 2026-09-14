export type GradeLevel =
  | 'Lớp 1'
  | 'Lớp 2'
  | 'Lớp 3'
  | 'Lớp 4'
  | 'Lớp 5'
  | 'Lớp 6'
  | 'Lớp 7'
  | 'Lớp 8'
  | 'Lớp 9'
  | 'Lớp 10'
  | 'Lớp 11'
  | 'Lớp 12';

export type TextbookChoice = 'Global Success' | 'Chủ đề tự nhập';

export type MaterialTypeId =
  | 'vocabulary'
  | 'tracing'
  | 'exercise'
  | 'speakingWriting'
  | 'speakingReading'
  | 'mindmap';

export type AspectRatioChoice = '1:1' | '3:4' | '4:3' | '16:9';

export type ArtStyleChoice =
  | '2D Vector Flat'
  | '3D Cute Animation'
  | 'Clean Line Art'
  | 'Watercolor Picture Book'
  | 'Educational Infographic';

export type VocabColorPalette =
  | 'Màu 1 — Xanh lá + Hồng đậm'
  | 'Màu 2 — Tím Lavender + Vàng sáng'
  | 'Màu 3 — Xanh dương + Vàng sáng';

export type VocabExportType = '1 từ = 1 prompt' | 'Nhiều từ = 1 worksheet';

export type MindmapSubtype =
  | 'Dạng 1 — Theo chủ đề'
  | 'Dạng 2 — Một nhân vật'
  | 'Dạng 3 — Nhiều nhân vật';

export type PromptStrictness = 'Normal' | 'Chặt' | 'Rất chặt';

export type AgeStyleOverride =
  | 'Tự động'
  | 'Dễ thương tiểu học'
  | 'Cartoon giáo dục'
  | 'Flat illustration'
  | 'Modern student'
  | 'Infographic'
  | 'Semi-realistic';

export interface MaterialTypeInfo {
  id: MaterialTypeId;
  name: string;
  helperLabel: string;
  description: string;
  defaultAspectRatio: AspectRatioChoice;
  badge: string;
}

export type CurriculumStatus = 'verified' | 'partial' | 'unit-title-only';

export type ContentSourceType = 'textbook' | 'teacher';

export interface TextbookVocabItem {
  word: string;
  vietnamese?: string;
  ipa?: string;
}

export interface CurriculumUnit {
  grade?: number;
  unit: number;
  title: string;

  textbookVocabulary: TextbookVocabItem[];
  textbookPatterns: string[];

  curriculumStatus: CurriculumStatus;

  // Legacy backwards compatibility
  vocabulary?: string[];
  sentencePatterns?: string[];
}

export interface GradeCurriculum {
  grade: number;
  units: CurriculumUnit[];
}

export interface RecentUnitRecord {
  grade: number;
  unit: number;
  title: string;
  timestamp: number;
}

export interface TeacherContentInput {
  // Legacy & shared
  vocabularyList?: string;
  vocabInput?: string;
  sentencePattern?: string;
  activityTitle?: string;
  targetLetter?: string;
  notes?: string;

  // Mode 1: Vocabulary
  vocabPalette: VocabColorPalette;
  vocabShowIpa: boolean;
  vocabShowMeaning: boolean;
  vocabExportType: VocabExportType;

  // Mode 2: Tracing
  tracingTitle: string;
  tracingContent: string;

  // Mode 3: Exercise
  exerciseTitle: string;
  exerciseSample1: string;
  exerciseSample2: string;
  exerciseRows: string;

  // Mode 4: Speaking / Writing
  speakingWritingContent: string;

  // Mode 5: Speaking / Reading
  speakingReadingContent: string;

  // Mode 6: Mindmap
  mindmapSubtype: MindmapSubtype;
  mindmapType1Title: string;
  mindmapType1Topic: string;
  mindmapType1Pattern: string;
  mindmapType1Keywords: string;

  mindmapType2Name: string;
  mindmapType2Info: string;

  mindmapType3Topic: string;
  mindmapType3ModelPattern: string;
  mindmapType3Characters: string;

  // Strictness setting: Normal | Chặt | Rất chặt
  promptStrictness?: PromptStrictness;

  // Age style override: Tự động (default) or teacher override
  ageStyleOverride?: AgeStyleOverride;
}

export interface SinglePromptItem {
  id: string;
  label: string;
  word?: string;
  promptText: string;
}

export interface GeneratedPromptResult {
  mainPrompt: string;
  batchPrompts?: SinglePromptItem[];
}

export interface SavedPromptItem {
  id: string;
  timestamp: number;
  grade: GradeLevel;
  textbook: TextbookChoice;
  unitTitle: string;
  materialType: MaterialTypeId;
  materialTypeName: string;
  aspectRatio: AspectRatioChoice;
  promptText: string;
  summary: string;
}

export interface PromptHistoryRecord {
  id: string;
  timestamp: number;
  dateTime: string;
  grade: GradeLevel;
  unit: string;
  materialType: MaterialTypeId;
  materialTypeName: string;
  prompt: string;
}

export interface PromptGenerationParams {
  grade: GradeLevel;
  textbook: TextbookChoice;
  unitTitle: string;
  materialType: MaterialTypeId;
  artStyle: ArtStyleChoice;
  aspectRatio: AspectRatioChoice;
  content: TeacherContentInput;
  strictness?: PromptStrictness;
  ageStyleOverride?: AgeStyleOverride;
}
