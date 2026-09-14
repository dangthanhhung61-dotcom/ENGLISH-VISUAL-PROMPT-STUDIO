import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  GradeLevel,
  TextbookChoice,
  MaterialTypeId,
  ArtStyleChoice,
  AspectRatioChoice,
  TeacherContentInput,
  CurriculumUnit,
  SavedPromptItem,
  PromptGenerationParams,
  SinglePromptItem,
  PromptHistoryRecord,
} from './types';
import {
  MATERIAL_TYPES,
  getUnits,
  getUnit,
} from './data/globalSuccess';
import { generateCanvaPromptResult } from './lib/promptBuilder';
import { extractCanvaPromptForClipboard } from './lib/canvaPromptEngine';
import {
  getStoredGrade,
  saveStoredGrade,
  getStoredTextbook,
  saveStoredTextbook,
  getStoredUnitId,
  saveStoredUnitId,
  getStoredCustomTopic,
  saveStoredCustomTopic,
  getStoredMaterialType,
  saveStoredMaterialType,
  getStoredArtStyle,
  saveStoredArtStyle,
  getStoredAspectRatio,
  saveStoredAspectRatio,
  getStoredRecentInput,
  saveStoredRecentInput,
  getStoredSavedPrompts,
  savePromptItem,
  deleteSavedPrompt,
  clearAllSavedPrompts,
  getFavoriteUnits,
  toggleFavoriteUnit,
  getStoredPromptHistory,
  addPromptHistoryRecord,
  deletePromptHistoryRecord,
  clearPromptHistory,
} from './lib/storage';
import { formatTextbookDataForMode } from './lib/curriculumHelper';

import { Header } from './components/Header';
import { WorkflowSteps } from './components/WorkflowSteps';
import { CurriculumControls } from './components/CurriculumControls';
import { MaterialCards } from './components/MaterialCards';
import { ContentInput } from './components/ContentInput';
import { OutputPanel } from './components/OutputPanel';
import { SavedPromptsModal } from './components/SavedPromptsModal';
import { PromptHistoryModal } from './components/PromptHistoryModal';
import { Toast, ToastMessage } from './components/Toast';

function parseGradeNumber(grade: GradeLevel): number {
  const num = parseInt(grade.replace(/\D/g, ''), 10);
  return isNaN(num) || num < 1 || num > 12 ? 3 : num;
}

function createDefaultContent(unit: CurriculumUnit | null): TeacherContentInput {
  const vocabList = unit?.textbookVocabulary && unit.textbookVocabulary.length > 0
    ? unit.textbookVocabulary
    : (unit?.vocabulary && unit.vocabulary.length > 0 ? unit.vocabulary : ['apple', 'cat', 'bike', 'pencil', 'school bag']);
  const pattern = (unit?.textbookPatterns || unit?.sentencePatterns || [])[0] || 'I like this.';
  const unitTitle = unit ? `Unit ${unit.unit}: ${unit.title}` : 'Unit 1: Hello';
  const topicName = unit ? unit.title.replace(/^Unit\s+\d+[:\s]*/i, '') : 'English';

  return {
    vocabularyList: vocabList.slice(0, 5).join('\n'),
    sentencePattern: pattern,
    activityTitle: unitTitle,
    targetLetter: '',
    notes: '',

    vocabPalette: 'Màu 1 — Xanh lá + Hồng đậm',
    vocabShowIpa: true,
    vocabShowMeaning: true,
    vocabExportType: '1 từ = 1 prompt',

    tracingTitle: unitTitle,
    tracingContent: `${vocabList[0] || 'Hello'}\n${vocabList[0] || 'Hello'} / 3\n${pattern} / 2`,

    exerciseTitle: 'Exercise',
    exerciseSample1: 'Do you do housework on Mondays? - Yes, I do.',
    exerciseSample2: 'What time do you get up? - At 6:00.',
    exerciseRows: [
      'Do housework / Mondays / she',
      'Get up / 6:00',
      'Go to school / 7:00 / he',
      'Have lunch / 11:30',
      'Play football / tick / our',
      'Watch TV / 19:30 / she',
      'Do homework / 20:00 / he',
      'Go to bed / 21:30',
    ].join('\n'),

    speakingWritingContent: [
      'Her name is (Mali).',
      'She is from (Thailand).',
      'She is in class (4C1).',
      'Her hobby is (swimming).',
    ].join('\n'),

    speakingReadingContent:
      'Every morning, I get up at (6:00). I eat (bread) and drink (milk). Then I ride my (bike) to (school) with (Nam). In the afternoon, we play (football).',

    mindmapSubtype: 'Dạng 1 — Theo chủ đề',
    mindmapType1Title: unitTitle,
    mindmapType1Topic: topicName,
    mindmapType1Pattern: pattern,
    mindmapType1Keywords: vocabList.slice(0, 6).join(', '),

    mindmapType2Name: 'Nam',
    mindmapType2Info: [
      'From: Vietnam',
      'Birthday: October',
      'Age: 9',
      'Class: 4A6',
      'School: Primary School',
      'Favorite hobby: reading books',
    ].join('\n'),

    mindmapType3Topic: 'Classmates',
    mindmapType3ModelPattern: 'This is Lina. She is 7 years old. She is in class 2A1.',
    mindmapType3Characters: [
      'Lina / 7 / 2A1',
      'Emma / 8 / 3A2',
      'Jack / 9 / 4A1',
      'Mia / 10 / 5A2',
    ].join('\n'),
    promptStrictness: 'Rất chặt',
    ageStyleOverride: 'Tự động',
  };
}

function computeContentFingerprint(
  g: GradeLevel,
  tb: TextbookChoice,
  cust: string,
  unitNum: number,
  mType: MaterialTypeId,
  art: ArtStyleChoice,
  ratio: AspectRatioChoice,
  c: TeacherContentInput
): string {
  return JSON.stringify({
    g,
    tb,
    cust,
    unitNum,
    mType,
    art,
    ratio,
    c,
  });
}

export default function App() {
  // 1. Curriculum State
  const [grade, setGrade] = useState<GradeLevel>(() => getStoredGrade());
  const [textbook, setTextbook] = useState<TextbookChoice>(() => getStoredTextbook());
  const [customTopic, setCustomTopic] = useState<string>(() => getStoredCustomTopic());
  const [selectedUnitNumber, setSelectedUnitNumber] = useState<number>(() => {
    const stored = getStoredUnitId();
    const num = parseInt(stored, 10);
    return !isNaN(num) && num > 0 ? num : 1;
  });
  const [favoriteUnits, setFavoriteUnits] = useState<string[]>(() => getFavoriteUnits());

  // 2. Material Type State
  const [materialType, setMaterialType] = useState<MaterialTypeId>(() => getStoredMaterialType());
  const [artStyle, setArtStyle] = useState<ArtStyleChoice>(() => getStoredArtStyle());
  const [aspectRatio, setAspectRatio] = useState<AspectRatioChoice>(() => {
    const currentStoredMat = getStoredMaterialType();
    const matched = MATERIAL_TYPES.find((m) => m.id === currentStoredMat);
    return matched ? matched.defaultAspectRatio : getStoredAspectRatio();
  });

  const gradeNumber = useMemo(() => parseGradeNumber(grade), [grade]);
  const currentGradeUnits = useMemo(() => getUnits(gradeNumber), [gradeNumber]);

  const currentUnit = useMemo(() => {
    if (textbook === 'Chủ đề tự nhập') return null;
    const found = currentGradeUnits.find((u) => u.unit === selectedUnitNumber);
    return found || currentGradeUnits[0] || null;
  }, [currentGradeUnits, selectedUnitNumber, textbook]);

  // 3. Content State
  const [content, setContent] = useState<TeacherContentInput>(() => {
    const stored = getStoredRecentInput();
    const initGradeNum = parseGradeNumber(getStoredGrade());
    const units = getUnits(initGradeNum);
    const storedUnitNum = parseInt(getStoredUnitId(), 10) || 1;
    const unit = units.find((u) => u.unit === storedUnitNum) || units[0] || null;
    const defaults = createDefaultContent(unit);

    if (stored && typeof stored === 'object') {
      return {
        ...defaults,
        ...stored,
      };
    }
    return defaults;
  });

  // 4. Output State
  const [batchPrompts, setBatchPrompts] = useState<SinglePromptItem[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>(() => {
    const initGrade = getStoredGrade();
    const initTextbook = getStoredTextbook();
    const initCustom = getStoredCustomTopic();
    const initGradeNum = parseGradeNumber(initGrade);
    const units = getUnits(initGradeNum);
    const storedUnitNum = parseInt(getStoredUnitId(), 10) || 1;
    const unit = units.find((u) => u.unit === storedUnitNum) || units[0] || null;

    const unitTitle =
      initTextbook === 'Chủ đề tự nhập'
        ? initCustom.trim() || 'Custom English Topic'
        : unit
        ? `Unit ${unit.unit}: ${unit.title}`
        : 'General English Topic';

    const defaults = createDefaultContent(unit);
    const storedInput = getStoredRecentInput();
    const initialInput = storedInput ? { ...defaults, ...storedInput } : defaults;

    const res = generateCanvaPromptResult({
      grade: initGrade,
      textbook: initTextbook,
      unitTitle,
      materialType: getStoredMaterialType(),
      artStyle: getStoredArtStyle(),
      aspectRatio: getStoredAspectRatio(),
      content: initialInput,
    });

    return res.mainPrompt;
  });

  // Track content snapshot to detect changes after prompt generation
  const [lastGeneratedFingerprint, setLastGeneratedFingerprint] = useState<string>(() => {
    const initGrade = getStoredGrade();
    const initTextbook = getStoredTextbook();
    const initCustom = getStoredCustomTopic();
    const storedUnitNum = parseInt(getStoredUnitId(), 10) || 1;
    const initGradeNum = parseGradeNumber(initGrade);
    const units = getUnits(initGradeNum);
    const unit = units.find((u) => u.unit === storedUnitNum) || units[0] || null;
    const defaults = createDefaultContent(unit);
    const storedInput = getStoredRecentInput();
    const initialInput = storedInput ? { ...defaults, ...storedInput } : defaults;

    return computeContentFingerprint(
      initGrade,
      initTextbook,
      initCustom,
      storedUnitNum,
      getStoredMaterialType(),
      getStoredArtStyle(),
      getStoredAspectRatio(),
      initialInput
    );
  });

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // 5. Workflow, Modals & History State
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(1);
  const [savedPrompts, setSavedPrompts] = useState<SavedPromptItem[]>(() => getStoredSavedPrompts());
  const [promptHistory, setPromptHistory] = useState<PromptHistoryRecord[]>(() => getStoredPromptHistory());
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Helper
  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, text, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Synchronize unit number if grade changed and previous unit number does not exist in new grade
  useEffect(() => {
    if (currentGradeUnits.length > 0) {
      const exists = currentGradeUnits.some((u) => u.unit === selectedUnitNumber);
      if (!exists) {
        const fallback = currentGradeUnits[0];
        setSelectedUnitNumber(fallback.unit);
        saveStoredUnitId(fallback.unit.toString());
      }
    }
  }, [currentGradeUnits, selectedUnitNumber]);

  // Core Prompt Generation Function (TẠO PROMPT)
  const handleGeneratePrompt = useCallback(() => {
    const unitTitle =
      textbook === 'Chủ đề tự nhập'
        ? customTopic.trim() || 'Custom English Topic'
        : currentUnit
        ? `Unit ${currentUnit.unit}: ${currentUnit.title}`
        : 'General English Topic';

    const params: PromptGenerationParams = {
      grade,
      textbook,
      unitTitle,
      materialType,
      artStyle,
      aspectRatio,
      content,
    };

    const result = generateCanvaPromptResult(params);
    setGeneratedPrompt(result.mainPrompt);
    setBatchPrompts(result.batchPrompts || []);
    setIsCopied(false);
    setIsSaved(false);
    setActiveWorkflowStep(4);

    // Update fingerprint snapshot on generate
    setLastGeneratedFingerprint(
      computeContentFingerprint(
        grade,
        textbook,
        customTopic,
        selectedUnitNumber,
        materialType,
        artStyle,
        aspectRatio,
        content
      )
    );

    if (result.mainPrompt.startsWith('Lỗi:')) {
      showToast(result.mainPrompt, 'error');
    } else {
      showToast('Đã tạo Prompt Canva thành công!', 'success');

      // Record in Prompt History (max 20 records)
      const currentMat = MATERIAL_TYPES.find((m) => m.id === materialType);
      const updatedHistory = addPromptHistoryRecord({
        grade,
        unit: unitTitle,
        materialType,
        materialTypeName: currentMat?.helperLabel || materialType,
        prompt: result.mainPrompt,
      });
      setPromptHistory(updatedHistory);
    }

    saveStoredRecentInput(content);
  }, [grade, textbook, customTopic, selectedUnitNumber, currentUnit, materialType, artStyle, aspectRatio, content, showToast]);

  // Handlers for Curriculum
  const handleGradeChange = (newGrade: GradeLevel) => {
    setGrade(newGrade);
    saveStoredGrade(newGrade);
    setActiveWorkflowStep(1);

    const newGradeNum = parseGradeNumber(newGrade);
    const units = getUnits(newGradeNum);
    if (units.length > 0) {
      const firstUnit = units[0];
      setSelectedUnitNumber(firstUnit.unit);
      saveStoredUnitId(firstUnit.unit.toString());
      setContent(createDefaultContent(firstUnit));
    }
  };

  const handleTextbookChange = (newTextbook: TextbookChoice) => {
    setTextbook(newTextbook);
    saveStoredTextbook(newTextbook);
    setActiveWorkflowStep(1);
  };

  const handleUnitSelect = (unit: CurriculumUnit) => {
    setSelectedUnitNumber(unit.unit);
    saveStoredUnitId(unit.unit.toString());

    // CRITICAL: Do not automatically overwrite teacher-entered content when Unit changes
    setContent((prev) => ({
      ...prev,
      activityTitle: `Unit ${unit.unit}: ${unit.title}`,
      tracingTitle: `Unit ${unit.unit}: ${unit.title}`,
      mindmapType1Title: `Unit ${unit.unit}: ${unit.title}`,
    }));
    setActiveWorkflowStep(2);
  };

  // Explicit handler: DÙNG NỘI DUNG SGK
  const handleUseTextbookContent = useCallback(() => {
    if (!currentUnit) return;
    if (
      currentUnit.curriculumStatus === 'unit-title-only' ||
      (currentUnit.textbookVocabulary.length === 0 && currentUnit.textbookPatterns.length === 0)
    ) {
      showToast('Chưa nạp dữ liệu SGK đã xác minh cho Unit này.', 'info');
      return;
    }

    const formatted = formatTextbookDataForMode(materialType, currentUnit);
    setContent((prev) => ({
      ...prev,
      ...formatted,
    }));
    showToast(`Đã áp dụng nội dung SGK Unit ${currentUnit.unit}!`, 'success');
  }, [currentUnit, materialType, showToast]);

  const handleSelectFavoriteUnit = (targetGradeNum: number, targetUnitNum: number) => {
    const targetGrade = `Lớp ${targetGradeNum}` as GradeLevel;
    setGrade(targetGrade);
    saveStoredGrade(targetGrade);
    setTextbook('Global Success');
    saveStoredTextbook('Global Success');

    const targetUnits = getUnits(targetGradeNum);
    const found = targetUnits.find((u) => u.unit === targetUnitNum) || targetUnits[0];
    if (found) {
      setSelectedUnitNumber(found.unit);
      saveStoredUnitId(found.unit.toString());
      setContent(createDefaultContent(found));
      showToast(`Đã mở Lớp ${targetGradeNum} - Unit ${found.unit}: ${found.title}!`, 'info');
    }
  };

  const handleCustomTopicChange = (topic: string) => {
    setCustomTopic(topic);
    saveStoredCustomTopic(topic);
  };

  const handleToggleFavorite = (unitId: string) => {
    const updated = toggleFavoriteUnit(unitId);
    setFavoriteUnits(updated);
    showToast('Đã cập nhật danh sách bài học yêu thích!', 'info');
  };

  // Handlers for Material Type
  const handleSelectMaterialType = (type: MaterialTypeId) => {
    setMaterialType(type);
    saveStoredMaterialType(type);

    const matched = MATERIAL_TYPES.find((m) => m.id === type);
    if (matched) {
      setAspectRatio(matched.defaultAspectRatio);
      saveStoredAspectRatio(matched.defaultAspectRatio);
    }

    setActiveWorkflowStep(3);
  };

  const handleArtStyleChange = (style: ArtStyleChoice) => {
    setArtStyle(style);
    saveStoredArtStyle(style);
  };

  const handleAspectRatioChange = (ratio: AspectRatioChoice) => {
    setAspectRatio(ratio);
    saveStoredAspectRatio(ratio);
  };

  // SAO CHÉP CHO CANVA
  const handleCopyPrompt = async (textToCopy?: string) => {
    const rawText = textToCopy || generatedPrompt;
    if (!rawText) return;

    const text = extractCanvaPromptForClipboard(rawText);
    if (!text) return;

    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        textarea.setAttribute('readonly', '');
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      setIsCopied(true);
      showToast('Đã sao chép prompt cho Canva thành công!', 'success');
      setTimeout(() => setIsCopied(false), 3000);
    } else {
      showToast('Không thể sao chép tự động. Vui lòng nhấn Ctrl+C để sao chép.', 'error');
    }
  };

  // LƯU PROMPT
  const handleSavePrompt = () => {
    if (!generatedPrompt.trim() || generatedPrompt.startsWith('Lỗi:')) return;

    const currentMaterial = MATERIAL_TYPES.find((m) => m.id === materialType);
    const unitTitle =
      textbook === 'Chủ đề tự nhập'
        ? customTopic.trim() || 'Chủ đề tự chọn'
        : currentUnit
        ? `Unit ${currentUnit.unit}: ${currentUnit.title}`
        : 'General English';

    const newItem: SavedPromptItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      grade,
      textbook,
      unitTitle,
      materialType,
      materialTypeName: currentMaterial?.helperLabel || materialType,
      aspectRatio,
      promptText: generatedPrompt,
      summary: `${grade} - ${currentMaterial?.name || materialType} (${unitTitle})`,
    };

    const updated = savePromptItem(newItem);
    setSavedPrompts(updated);
    setIsSaved(true);
    showToast('Đã lưu prompt vào bộ nhớ trình duyệt!', 'success');
    setTimeout(() => setIsSaved(false), 3000);

    // Also add to prompt history
    const updatedHistory = addPromptHistoryRecord({
      grade,
      unit: unitTitle,
      materialType,
      materialTypeName: currentMaterial?.helperLabel || materialType,
      prompt: generatedPrompt,
    });
    setPromptHistory(updatedHistory);
  };

  // LÀM MỚI NỘI DUNG (clear only teacher content, preserve grade, book, Unit, material type)
  const handleClearOnlyTeacherContent = () => {
    setContent((prev) => ({
      promptStrictness: prev.promptStrictness || 'Rất chặt',
      ageStyleOverride: prev.ageStyleOverride || 'Tự động',
      vocabPalette: prev.vocabPalette || 'Màu 1 — Xanh lá + Hồng đậm',
      vocabShowIpa: prev.vocabShowIpa ?? true,
      vocabShowMeaning: prev.vocabShowMeaning ?? true,
      vocabExportType: prev.vocabExportType || '1 từ = 1 prompt',

      vocabInput: '',
      vocabularyList: '',
      tracingTitle: '',
      tracingContent: '',
      exerciseTitle: '',
      exerciseSample1: '',
      exerciseSample2: '',
      exerciseRows: '',
      speakingWritingContent: '',
      speakingReadingContent: '',
      mindmapSubtype: prev.mindmapSubtype || 'Dạng 1 — Theo chủ đề',
      mindmapType1Title: '',
      mindmapType1Topic: '',
      mindmapType1Pattern: '',
      mindmapType1Keywords: '',
      mindmapType2Name: '',
      mindmapType2Info: '',
      mindmapType3Topic: '',
      mindmapType3ModelPattern: '',
      mindmapType3Characters: '',
      notes: '',
      sentencePattern: '',
      activityTitle: '',
    }));
    setLastGeneratedFingerprint('');
    showToast('Đã làm mới nội dung. Giữ nguyên khối lớp, sách, Unit và dạng học liệu.', 'info');
  };

  const handleDeleteSavedPrompt = (id: string) => {
    const updated = deleteSavedPrompt(id);
    setSavedPrompts(updated);
    showToast('Đã xóa prompt khỏi danh sách lưu.', 'info');
  };

  const handleClearAllSaved = () => {
    clearAllSavedPrompts();
    setSavedPrompts([]);
    showToast('Đã xóa toàn bộ kho prompt lưu trữ.', 'info');
  };

  const handleSelectSavedPrompt = (item: SavedPromptItem) => {
    setGrade(item.grade);
    setMaterialType(item.materialType);
    setAspectRatio(item.aspectRatio);
    setGeneratedPrompt(item.promptText);
    showToast('Đã tải prompt đã lưu vào khung làm việc!', 'success');
  };

  // Scroll to section based on workflow step click
  const handleWorkflowStepClick = (stepNumber: number) => {
    setActiveWorkflowStep(stepNumber);
    let targetId = 'section-curriculum';
    if (stepNumber === 2) targetId = 'section-material-types';
    if (stepNumber === 3) targetId = 'section-content-input';
    if (stepNumber === 4) targetId = 'section-output-panel';

    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Fingerprint comparison to detect if content changed after generation
  const currentFingerprint = useMemo(
    () =>
      computeContentFingerprint(
        grade,
        textbook,
        customTopic,
        selectedUnitNumber,
        materialType,
        artStyle,
        aspectRatio,
        content
      ),
    [grade, textbook, customTopic, selectedUnitNumber, materialType, artStyle, aspectRatio, content]
  );

  const isPromptOutdated = useMemo(() => {
    if (!generatedPrompt || generatedPrompt.startsWith('Lỗi:')) return false;
    return currentFingerprint !== lastGeneratedFingerprint;
  }, [currentFingerprint, lastGeneratedFingerprint, generatedPrompt]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Top Application Header */}
      <Header
        savedCount={savedPrompts.length}
        onOpenSavedModal={() => setIsSavedModalOpen(true)}
        historyCount={promptHistory.length}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
      />

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-5 flex-1 w-full space-y-4">
        {/* Step Indicator Banner */}
        <WorkflowSteps
          activeStep={activeWorkflowStep}
          onStepClick={handleWorkflowStepClick}
        />

        {/* ======================================================== */}
        {/* MAIN WORKSPACE: LEFT 46% (INPUTS), RIGHT 54% (STICKY PREVIEW) */}
        {/* ======================================================== */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* LEFT 46%: Curriculum and Content Input */}
          <div className="w-full lg:w-[46%] space-y-4">
            {/* Step 1: Curriculum Selector (Global Success 1-12) */}
            <CurriculumControls
              grade={grade}
              onGradeChange={handleGradeChange}
              textbook={textbook}
              onTextbookChange={handleTextbookChange}
              customTopic={customTopic}
              onCustomTopicChange={handleCustomTopicChange}
              selectedUnit={currentUnit}
              onUnitSelect={handleUnitSelect}
              onSelectUnit={handleUnitSelect}
              favoriteUnits={favoriteUnits}
              onToggleFavorite={handleToggleFavorite}
              onSelectFavoriteUnit={handleSelectFavoriteUnit}
            />

            {/* Step 2: 6 Educational Material Types */}
            <MaterialCards
              selectedType={materialType}
              onSelectType={handleSelectMaterialType}
            />

            {/* Step 3: Teacher Content Input */}
            <ContentInput
              grade={grade}
              materialType={materialType}
              content={content}
              onChange={setContent}
              artStyle={artStyle}
              onArtStyleChange={handleArtStyleChange}
              aspectRatio={aspectRatio}
              onAspectRatioChange={handleAspectRatioChange}
              currentUnit={currentUnit}
              onGenerate={handleGeneratePrompt}
              onUseTextbookContent={handleUseTextbookContent}
            />
          </div>

          {/* RIGHT 54%: Canva Prompt Preview (Sticky) */}
          <div className="w-full lg:w-[54%] lg:sticky lg:top-18">
            <OutputPanel
              prompt={generatedPrompt}
              promptText={generatedPrompt}
              batchPrompts={batchPrompts}
              onPromptChange={setGeneratedPrompt}
              isOutdated={isPromptOutdated}
              unitTitle={
                textbook === 'Chủ đề tự nhập'
                  ? customTopic.trim() || 'Chủ đề tự nhập'
                  : currentUnit
                  ? `Unit ${currentUnit.unit}: ${currentUnit.title}`
                  : ''
              }
              onGenerate={handleGeneratePrompt}
              onCopy={handleCopyPrompt}
              onClearContent={handleClearOnlyTeacherContent}
              onSave={handleSavePrompt}
              onOpenHistory={() => setIsHistoryModalOpen(true)}
              isCopied={isCopied}
              isSaved={isSaved}
              grade={grade}
              materialType={materialType}
              aspectRatio={aspectRatio}
              artStyle={artStyle}
              textbook={textbook}
            />
          </div>
        </div>
      </main>

      {/* Clean Teacher-Friendly Desktop Footer */}
      <footer className="bg-white border-t border-slate-200 py-3.5 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-700">ENGLISH VISUAL PROMPT STUDIO</span> • Dành cho giáo viên tiếng Anh Việt Nam
          </div>
          <div className="text-slate-400">
            Chương trình Global Success Lớp 1–12 • Cấu trúc chuẩn xác cho Canva Dream Lab
          </div>
        </div>
      </footer>

      {/* Saved Prompts Modal */}
      <SavedPromptsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedPrompts={savedPrompts}
        savedItems={savedPrompts}
        onSelectPrompt={handleSelectSavedPrompt}
        onSelect={handleSelectSavedPrompt}
        onDeletePrompt={handleDeleteSavedPrompt}
        onDelete={handleDeleteSavedPrompt}
        onClearAll={handleClearAllSaved}
        onCopyPrompt={handleCopyPrompt}
        onCopy={handleCopyPrompt}
      />

      {/* Prompt History Modal (Max 20 records) */}
      <PromptHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={promptHistory}
        onRestore={(record) => {
          setGeneratedPrompt(record.prompt);
          showToast(`Đã khôi phục prompt (${record.dateTime}) vào bảng xem trước!`, 'success');
        }}
        onDelete={(id) => {
          const updated = deletePromptHistoryRecord(id);
          setPromptHistory(updated);
          showToast('Đã xóa bản ghi khỏi lịch sử.', 'info');
        }}
        onClearAll={() => {
          clearPromptHistory();
          setPromptHistory([]);
          showToast('Đã xóa toàn bộ lịch sử tạo prompt.', 'info');
        }}
        onCopy={handleCopyPrompt}
      />

      {/* Toast Notification Stack */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
