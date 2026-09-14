import { MaterialTypeId, TeacherContentInput } from '../types';
import { parseVocabularyItems } from '../templates/vocabulary';
import { parseTracingContent } from '../templates/tracing';
import { parseExerciseRows } from '../templates/exercise';
import { parseSpeakingWriting } from '../templates/speakingWriting';
import { parseSpeakingReading } from '../templates/speakingReading';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  itemCount?: number;
  expectedCount?: number;
}

export function validateTeacherInput(
  materialType: MaterialTypeId,
  content: TeacherContentInput
): ValidationResult {
  switch (materialType) {
    case 'vocabulary': {
      const raw = content.vocabInput || content.vocabularyList || '';
      const items = parseVocabularyItems(raw);
      if (items.length === 0) {
        return {
          isValid: false,
          errorMessage: 'Vui lòng nhập ít nhất 1 từ vựng (ví dụ: apple, cat, bike).',
          itemCount: 0,
        };
      }
      return { isValid: true, itemCount: items.length };
    }

    case 'tracing': {
      const raw = content.tracingContent || content.vocabularyList || '';
      const blocks = parseTracingContent(raw);
      if (blocks.length === 0) {
        return {
          isValid: false,
          errorMessage: 'Vui lòng nhập ít nhất 1 khối nội dung luyện viết (từ vựng và câu kèm số lần lặp).',
          itemCount: 0,
        };
      }
      return { isValid: true, itemCount: blocks.length };
    }

    case 'exercise': {
      const raw = content.exerciseRows || content.vocabularyList || '';
      const rows = parseExerciseRows(raw);
      if (rows.length !== 8) {
        return {
          isValid: false,
          errorMessage: `Dạng bài Exercise yêu cầu đúng chính xác 8 hàng dữ liệu (hiện có ${rows.length} / 8 hàng). Cú pháp: nội dung chính / góc trên phải / góc dưới trái / góc dưới phải.`,
          itemCount: rows.length,
          expectedCount: 8,
        };
      }
      return { isValid: true, itemCount: 8 };
    }

    case 'speakingWriting': {
      const raw = content.speakingWritingContent || content.sentencePattern || '';
      const slots = parseSpeakingWriting(raw);
      if (slots.length === 0) {
        return {
          isValid: false,
          errorMessage: 'Vui lòng nhập ít nhất một câu có chứa từ/cụm từ cần minh họa đặt trong ngoặc đơn ( ). Ví dụ: Her name is (Mali).',
          itemCount: 0,
        };
      }
      return { isValid: true, itemCount: slots.length };
    }

    case 'speakingReading': {
      const raw = content.speakingReadingContent || content.sentencePattern || '';
      const { slots } = parseSpeakingReading(raw);
      if (slots.length === 0) {
        return {
          isValid: false,
          errorMessage: 'Vui lòng nhập đoạn văn có chứa từ/cụm từ cần chuyển thành hình đặt trong ngoặc đơn ( ). Ví dụ: I get up at (6:00).',
          itemCount: 0,
        };
      }
      return { isValid: true, itemCount: slots.length };
    }

    case 'mindmap': {
      const subtype = content.mindmapSubtype || 'Dạng 1 — Theo chủ đề';
      if (subtype === 'Dạng 1 — Theo chủ đề') {
        const rawKeywords = content.mindmapType1Keywords || content.vocabularyList || '';
        const keywords = rawKeywords
          .split(/,|\n/)
          .map((k) => k.trim())
          .filter((k) => k.length > 0);
        if (keywords.length === 0) {
          return {
            isValid: false,
            errorMessage: 'Mindmap Dạng 1 yêu cầu nhập danh sách từ khóa (ví dụ: pizza, rice, bread, milk).',
            itemCount: 0,
          };
        }
        return { isValid: true, itemCount: keywords.length };
      }

      if (subtype === 'Dạng 2 — Một nhân vật') {
        const name = content.mindmapType2Name?.trim();
        const rawInfo = content.mindmapType2Info?.trim();
        const infoLines = (rawInfo || '')
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.length > 0);

        if (!name) {
          return {
            isValid: false,
            errorMessage: 'Mindmap Dạng 2 yêu cầu nhập Tên nhân vật (ví dụ: Nam, Mai).',
          };
        }
        if (infoLines.length === 0) {
          return {
            isValid: false,
            errorMessage: 'Mindmap Dạng 2 yêu cầu nhập ít nhất 1 dòng thông tin (ví dụ: From: Vietnam, Age: 9).',
          };
        }
        return { isValid: true, itemCount: infoLines.length };
      }

      if (subtype === 'Dạng 3 — Nhiều nhân vật') {
        const rawChars = content.mindmapType3Characters?.trim() || '';
        const charLines = rawChars
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.length > 0);

        if (charLines.length === 0) {
          return {
            isValid: false,
            errorMessage: 'Mindmap Dạng 3 yêu cầu nhập danh sách nhân vật (ví dụ: Lina / 7 / 2A1).',
            itemCount: 0,
          };
        }
        return { isValid: true, itemCount: charLines.length };
      }

      return { isValid: true };
    }

    default:
      return { isValid: true };
  }
}
