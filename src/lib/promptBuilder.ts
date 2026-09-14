import { PromptGenerationParams, GeneratedPromptResult } from '../types';
import { validateTeacherInput } from './validation';
import { buildVocabularyPrompt, buildVocabularyBatchPrompts } from '../templates/vocabulary';
import { buildTracingPrompt } from '../templates/tracing';
import { buildExercisePrompt } from '../templates/exercise';
import { buildSpeakingWritingPrompt } from '../templates/speakingWriting';
import { buildSpeakingReadingPrompt } from '../templates/speakingReading';
import { buildMindmapPrompt } from '../templates/mindmap';

export function generateCanvaPromptResult(params: PromptGenerationParams): GeneratedPromptResult {
  const validation = validateTeacherInput(params.materialType, params.content);
  if (!validation.isValid) {
    return {
      mainPrompt: `Lỗi: ${validation.errorMessage}`,
      batchPrompts: [],
    };
  }

  if (params.materialType === 'vocabulary') {
    const exportType = params.content.vocabExportType || '1 từ = 1 prompt';
    if (exportType === '1 từ = 1 prompt') {
      const batchPrompts = buildVocabularyBatchPrompts(params);
      const mainPrompt = buildVocabularyPrompt(params);
      return {
        mainPrompt,
        batchPrompts,
      };
    }
    return {
      mainPrompt: buildVocabularyPrompt(params),
      batchPrompts: [],
    };
  }

  let prompt = '';
  switch (params.materialType) {
    case 'tracing':
      prompt = buildTracingPrompt(params);
      break;
    case 'exercise':
      prompt = buildExercisePrompt(params);
      break;
    case 'speakingWriting':
      prompt = buildSpeakingWritingPrompt(params);
      break;
    case 'speakingReading':
      prompt = buildSpeakingReadingPrompt(params);
      break;
    case 'mindmap':
      prompt = buildMindmapPrompt(params);
      break;
    default:
      prompt = buildVocabularyPrompt(params);
      break;
  }

  return {
    mainPrompt: prompt,
    batchPrompts: [],
  };
}

export function generateCanvaPrompt(params: PromptGenerationParams): string {
  const result = generateCanvaPromptResult(params);
  return result.mainPrompt;
}
