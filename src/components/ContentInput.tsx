import React from 'react';
import {
  GradeLevel,
  MaterialTypeId,
  TeacherContentInput,
  ArtStyleChoice,
  AspectRatioChoice,
  CurriculumUnit,
  VocabColorPalette,
  VocabExportType,
  MindmapSubtype,
  PromptStrictness,
  AgeStyleOverride,
} from '../types';
import {
  Sparkles,
  Palette,
  Ratio,
  HelpCircle,
  Check,
  Info,
  AlertCircle,
  AlertTriangle,
  Layers,
  FileSpreadsheet,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { parseVocabularyItems } from '../templates/vocabulary';
import { parseTracingContent } from '../templates/tracing';
import { parseExerciseRows } from '../templates/exercise';
import { parseSpeakingWriting } from '../templates/speakingWriting';
import { parseSpeakingReading } from '../templates/speakingReading';
import { validateTeacherInput } from '../lib/validation';
import { checkDuplicateEntries } from '../lib/duplicateCheck';
import { getAutomaticAgeStyleLabel, AGE_STYLE_OVERRIDE_OPTIONS } from '../lib/ageStyle';
import { determineWordSource } from '../lib/curriculumHelper';

interface ContentInputProps {
  grade: GradeLevel;
  materialType: MaterialTypeId;
  content: TeacherContentInput;
  onChange: (newContent: TeacherContentInput) => void;
  artStyle: ArtStyleChoice;
  onArtStyleChange: (style: ArtStyleChoice) => void;
  aspectRatio: AspectRatioChoice;
  onAspectRatioChange: (ratio: AspectRatioChoice) => void;
  currentUnit: CurriculumUnit | null;
  onGenerate: () => void;
  onUseTextbookContent?: () => void;
}

const ART_STYLES: { id: ArtStyleChoice; label: string; desc: string }[] = [
  { id: '2D Vector Flat', label: '2D Vector Flat', desc: 'Minh hoạ phẳng, nét gọn, màu sắc tươi sáng' },
  { id: '3D Cute Animation', label: '3D Hoạt hình', desc: 'Phong cách 3D tròn trịa đáng yêu như Pixar' },
  { id: 'Clean Line Art', label: 'Nét đơn Line Art', desc: 'Trắng đen rõ nét, thích hợp in phiếu tô màu' },
  { id: 'Watercolor Picture Book', label: 'Màu nước minh hoạ', desc: 'Màu nước mềm mại kiểu sách truyện tranh' },
  { id: 'Educational Infographic', label: 'Infographic giáo dục', desc: 'Bố cục khoa học, hiện đại, rõ nhánh' },
];

const ASPECT_RATIOS: { id: AspectRatioChoice; label: string; desc: string }[] = [
  { id: '16:9', label: '16:9 (Ngang)', desc: 'Chuẩn cho Vocabulary, Exercise, Speaking, Mindmap' },
  { id: '3:4', label: '3:4 (A4 Dọc)', desc: 'Chuẩn phiếu Tracing A4 in ấn' },
  { id: '4:3', label: '4:3 (Ngang vừa)', desc: 'Trình chiếu slide bài giảng' },
  { id: '1:1', label: '1:1 (Vuông)', desc: 'Flashcard vuông, avatar' },
];

const VOCAB_PALETTES: { id: VocabColorPalette; label: string; color1: string; color2: string }[] = [
  {
    id: 'Màu 1 — Xanh lá + Hồng đậm',
    label: 'Xanh lá + Hồng đậm',
    color1: '#10B981',
    color2: '#E11D48',
  },
  {
    id: 'Màu 2 — Tím Lavender + Vàng sáng',
    label: 'Tím Lavender + Vàng sáng',
    color1: '#8B5CF6',
    color2: '#FACC15',
  },
  {
    id: 'Màu 3 — Xanh dương + Vàng sáng',
    label: 'Xanh dương + Vàng sáng',
    color1: '#2563EB',
    color2: '#FACC15',
  },
];

export const ContentInput: React.FC<ContentInputProps> = ({
  grade,
  materialType,
  content,
  onChange,
  artStyle,
  onArtStyleChange,
  aspectRatio,
  onAspectRatioChange,
  currentUnit,
  onGenerate,
  onUseTextbookContent,
}) => {
  const validation = validateTeacherInput(materialType, content);
  const duplicateCheck = checkDuplicateEntries(materialType, content);

  const handleFieldChange = (field: keyof TeacherContentInput, value: any) => {
    onChange({
      ...content,
      [field]: value,
    });
  };

  const hasVerifiedTextbook = Boolean(
    currentUnit &&
    currentUnit.curriculumStatus !== 'unit-title-only' &&
    (currentUnit.textbookVocabulary.length > 0 || currentUnit.textbookPatterns.length > 0)
  );

  const renderDataActionButtons = (prefix: string) => (
    <button
      id={`btn-use-textbook-content-${prefix}`}
      type="button"
      onClick={onUseTextbookContent}
      disabled={!hasVerifiedTextbook}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
        hasVerifiedTextbook
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
      }`}
      title={
        hasVerifiedTextbook
          ? 'Dùng đúng từ vựng và mẫu câu đã xác minh từ SGK'
          : undefined
      }
    >
      <Check className="w-3.5 h-3.5" />
      <span>DÙNG NỘI DUNG SGK</span>
    </button>
  );

  const parsedVocabItems = parseVocabularyItems(content.vocabInput ?? content.vocabularyList ?? '');

  return (
    <div id="section-content-input" className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
            3
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              NỘI DUNG BÀI DẠY THEO CHUẨN
            </h2>
            <p className="text-[11px] text-slate-500">
              Nội dung do giáo viên nhập có quyền ưu tiên tuyệt đối — Không bị AI bịa đặt
            </p>
          </div>
        </div>
      </div>

      {/* Duplicate Check Warning Callout */}
      {duplicateCheck.hasDuplicate && (
        <div
          id="duplicate-warning-callout"
          className="p-3 bg-amber-50 border-2 border-amber-400 rounded-xl flex items-start gap-2.5 text-amber-900 shadow-xs"
        >
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold block">Phát hiện nội dung trùng lặp.</span>
            <span className="text-amber-800 leading-relaxed block mt-0.5">
              {duplicateCheck.message} (Dữ liệu của bạn được giữ nguyên trọn vẹn, không bị tự ý xóa).
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 1: VOCABULARY */}
      {/* ======================================================== */}
      {materialType === 'vocabulary' && (
        <div className="space-y-3.5" id="mode-vocabulary-inputs">
          {/* Quick Input Bar for Mode */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              DANH SÁCH TỪ VỰNG
            </span>
            {renderDataActionButtons('vocab')}
          </div>

          <div>
            <textarea
              id="input-vocab-list"
              rows={4}
              value={content.vocabInput ?? content.vocabularyList ?? ''}
              onChange={(e) => {
                handleFieldChange('vocabInput', e.target.value);
                handleFieldChange('vocabularyList', e.target.value);
              }}
              placeholder={`apple, banana, orange, bike, cat, dog\nhoặc mỗi từ một dòng:\napple / /ˈæp.əl/ / quả táo`}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 font-mono"
            />
            {/* Short example and character counter */}
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>Ví dụ: <code className="text-blue-700 font-semibold">apple, banana, orange</code></span>
              <span className="font-mono text-slate-400">
                {(content.vocabInput ?? content.vocabularyList ?? '').length} ký tự • {parsedVocabItems.length} từ
              </span>
            </div>

            {/* LIVE CONTENT SOURCE LABELS (TEST C & SECTION 13) */}
            {parsedVocabItems.length > 0 && (
              <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center gap-1.5" id="vocab-source-badges">
                <span className="text-[11px] font-bold text-slate-600 mr-1">
                  Nguồn nội dung:
                </span>
                {parsedVocabItems.map((item, idx) => {
                  const source = determineWordSource(item.word, currentUnit);
                  return (
                    <span
                      key={`source-badge-${item.word}-${idx}`}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                        source === 'textbook'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      <span className="font-extrabold text-[10px]">
                        {source === 'textbook' ? '✓ SGK' : '✎ Tự nhập'}
                      </span>
                      <span>{item.word}</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Expandable "Xem cách nhập" */}
            <details className="mt-2 text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <summary className="font-semibold text-blue-700 cursor-pointer select-none flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Xem cách nhập từ vựng</span>
                <ChevronDown className="w-3 h-3 ml-auto text-slate-400" />
              </summary>
              <div className="mt-2 pt-2 border-t border-slate-200 text-slate-600 space-y-1">
                <p>• Cách 1 (Nhanh nhất): Nhập các từ cách nhau bởi dấu phẩy hoặc xuống dòng (hệ thống tự động tra phiên âm IPA và nghĩa tiếng Việt chuẩn).</p>
                <p>• Cách 2 (Tùy chỉnh): Nhập theo cú pháp: <code className="bg-slate-200 px-1 py-0.5 rounded text-blue-800">từ vựng / phiên âm / nghĩa tiếng Việt</code></p>
              </div>
            </details>
          </div>

          {/* SUBSECTION: CẤU HÌNH TẠO PROMPT TỪ VỰNG */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              CẤU HÌNH PROMPT TỪ VỰNG
            </span>

            {/* Export Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                CHẾ ĐỘ TẠO PROMPT TỪ VỰNG
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(
                  [
                    {
                      id: '1 từ = 1 prompt',
                      title: '1 từ = 1 prompt (Thẻ đơn)',
                      desc: 'Tạo hàng loạt prompt riêng cho từng từ vựng để tạo thẻ flashcard độc lập.',
                    },
                    {
                      id: 'Nhiều từ = 1 prompt',
                      title: 'Nhiều từ = 1 prompt (Worksheet tổng hợp)',
                      desc: 'Tạo 1 prompt tổng hợp tất cả từ vựng lên một trang tranh 16:9.',
                    },
                  ] as { id: VocabExportType; title: string; desc: string }[]
                ).map((mode) => {
                  const isSelected = (content.vocabExportType || '1 từ = 1 prompt') === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => handleFieldChange('vocabExportType', mode.id)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer h-full flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-2xs font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm">{mode.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 font-normal leading-tight">
                        {mode.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Palette Choice */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                BẢNG MÀU PHỐI (COLOR PALETTE)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {VOCAB_PALETTES.map((pal) => {
                  const isSelected = (content.vocabPalette || 'Màu 1 — Xanh lá + Hồng đậm') === pal.id;
                  return (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => handleFieldChange('vocabPalette', pal.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-500 text-blue-900 ring-2 ring-blue-500/20'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{pal.label}</div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: pal.color1 }}></span>
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: pal.color2 }}></span>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggle Switches for IPA and Meaning */}
            <div className="flex flex-wrap gap-4 pt-0.5 text-xs">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={content.vocabShowIpa !== false}
                  onChange={(e) => handleFieldChange('vocabShowIpa', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-semibold text-slate-700">Hiển thị phiên âm IPA chuẩn</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={content.vocabShowMeaning !== false}
                  onChange={(e) => handleFieldChange('vocabShowMeaning', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-semibold text-slate-700">Hiển thị nghĩa tiếng Việt</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: TRACING (LUYỆN VIẾT CHỮ) */}
      {/* ======================================================== */}
      {materialType === 'tracing' && (
        <div className="space-y-3.5" id="mode-tracing-inputs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              PHIẾU TẬP VIẾT (TRACING A4 DỌC)
            </span>
            {renderDataActionButtons('tracing')}
          </div>

          <div>
            <label htmlFor="input-tracing-title" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Tiêu đề phiếu bài tập
            </label>
            <input
              id="input-tracing-title"
              type="text"
              value={content.tracingTitle || ''}
              onChange={(e) => handleFieldChange('tracingTitle', e.target.value)}
              placeholder="Handwriting Practice - Sports"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="input-tracing-content" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Khối từ & câu luyện viết (kèm số lần lặp)
            </label>
            <textarea
              id="input-tracing-content"
              rows={5}
              value={content.tracingContent || ''}
              onChange={(e) => handleFieldChange('tracingContent', e.target.value)}
              placeholder={`badminton\nbadminton / 3\nThis is badminton. / 2\nI like badminton. / 1\n\nfootball\nfootball / 3\nThis is football. / 2\nI can play football. / 1`}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed"
            />
            {/* Short example and character counter */}
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>Ví dụ: <code className="text-blue-700 font-semibold">badminton / 3</code> (tập viết 3 dòng)</span>
              <span className="font-mono text-slate-400">
                {(content.tracingContent || '').length} ký tự • {parseTracingContent(content.tracingContent || '').length} khối
              </span>
            </div>

            {/* Expandable "Xem cách nhập" */}
            <details className="mt-2 text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <summary className="font-semibold text-blue-700 cursor-pointer select-none flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Xem cách nhập Tracing</span>
                <ChevronDown className="w-3 h-3 ml-auto text-slate-400" />
              </summary>
              <div className="mt-2 pt-2 border-t border-slate-200 text-slate-600 space-y-1">
                <p>• Dòng đầu tiên của mỗi khối là từ vựng chính (sẽ có hình minh họa cạnh tiêu đề).</p>
                <p>• Các dòng sau là câu/chữ cần tập viết kèm dấu gạch chéo và số dòng kẻ: <code className="bg-slate-200 px-1 py-0.5 rounded text-blue-800">từ hoặc câu / số dòng</code></p>
                <p>• Ngăn cách giữa các khối bài bằng 1 dòng trống.</p>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3: EXERCISE (BÀI TẬP 8 Ô) */}
      {/* ======================================================== */}
      {materialType === 'exercise' && (
        <div className="space-y-3.5" id="mode-exercise-inputs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              BÀI TẬP ĐỐI XỨNG 8 Ô (2 HÀNG X 4 CỘT)
            </span>
            {renderDataActionButtons('exercise')}
          </div>

          <div>
            <label htmlFor="input-exercise-title" className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Tiêu đề bài tập
            </label>
            <input
              id="input-exercise-title"
              type="text"
              value={content.exerciseTitle || ''}
              onChange={(e) => handleFieldChange('exerciseTitle', e.target.value)}
              placeholder="Daily Activities Worksheet"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="input-exercise-sample1" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Câu mẫu 1 (Model Dialogue A)
              </label>
              <input
                id="input-exercise-sample1"
                type="text"
                value={content.exerciseSample1 || ''}
                onChange={(e) => handleFieldChange('exerciseSample1', e.target.value)}
                placeholder="Do you do housework? - Yes, I do."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="input-exercise-sample2" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Câu mẫu 2 (Tùy chọn)
              </label>
              <input
                id="input-exercise-sample2"
                type="text"
                value={content.exerciseSample2 || ''}
                onChange={(e) => handleFieldChange('exerciseSample2', e.target.value)}
                placeholder="What time do you get up? - At 6:00."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="input-exercise-rows" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                NỘI DUNG CHÍNH XÁC 8 Ô BÀI TẬP (2 HÀNG X 4 CỘT)
              </label>
              <span className={`text-xs font-bold ${parseExerciseRows(content.exerciseRows || '').length === 8 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {parseExerciseRows(content.exerciseRows || '').length} / 8 hàng
              </span>
            </div>
            <textarea
              id="input-exercise-rows"
              rows={7}
              value={content.exerciseRows || ''}
              onChange={(e) => handleFieldChange('exerciseRows', e.target.value)}
              placeholder={`Do housework / Mondays / she\nGet up / 6:00\nGo to school / 7:00 / he\nHave lunch / 11:30\nschool / tick / our\nWatch TV / 19:30 / she\nDo homework / 20:00 / he\nGo to bed / 21:30`}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed"
            />
            {/* Short example and character counter */}
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>Cú pháp: <code className="text-blue-700 font-semibold">nội dung chính / góc trên phải / góc dưới trái / góc dưới phải</code></span>
              <span className="font-mono text-slate-400">
                {(content.exerciseRows || '').length} ký tự
              </span>
            </div>

            {/* Expandable "Xem cách nhập" */}
            <details className="mt-2 text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <summary className="font-semibold text-blue-700 cursor-pointer select-none flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Xem cách nhập Exercise</span>
                <ChevronDown className="w-3 h-3 ml-auto text-slate-400" />
              </summary>
              <div className="mt-2 pt-2 border-t border-slate-200 text-slate-600 space-y-1">
                <p>• Nhập đúng 8 dòng ứng với 8 ô đánh số 1–8 trên khung ảnh 16:9.</p>
                <p>• Hỗ trợ các ký hiệu: <span className="font-semibold text-emerald-700">tick</span> (dấu tích xanh), <span className="font-semibold text-red-700">cross</span> (dấu X đỏ), <span className="font-semibold text-blue-700">he</span> (cậu bé), <span className="font-semibold text-pink-700">she</span> (cô bé), <span className="font-semibold text-indigo-700">our</span> (nhóm bạn).</p>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 4: SPEAKING / WRITING */}
      {/* ======================================================== */}
      {materialType === 'speakingWriting' && (
        <div className="space-y-3.5" id="mode-speaking-writing-inputs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              CÂU THỰC HÀNH NÓI VÀ VIẾT
            </span>
            {renderDataActionButtons('speaking-writing')}
          </div>

          <div>
            <textarea
              id="input-speaking-writing"
              rows={4}
              value={content.speakingWritingContent || ''}
              onChange={(e) => handleFieldChange('speakingWritingContent', e.target.value)}
              placeholder={`Her name is (Mali).\nShe is from (Thailand).\nShe is in class (4C1).\nHer hobby is (swimming).`}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed"
            />
            {/* Short example and character counter */}
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>Ví dụ: <code className="text-blue-700 font-semibold">Her name is (Mali).</code></span>
              <span className="font-mono text-slate-400">
                {(content.speakingWritingContent || '').length} ký tự • {parseSpeakingWriting(content.speakingWritingContent || '').length} ô gợi ý
              </span>
            </div>

            {/* Expandable "Xem cách nhập" */}
            <details className="mt-2 text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <summary className="font-semibold text-blue-700 cursor-pointer select-none flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Xem cách nhập Speaking / Writing</span>
                <ChevronDown className="w-3 h-3 ml-auto text-slate-400" />
              </summary>
              <div className="mt-2 pt-2 border-t border-slate-200 text-slate-600 space-y-1">
                <p>• Đặt từ hoặc cụm từ khóa muốn minh họa vào trong dấu ngoặc đơn <code className="bg-slate-200 px-1 py-0.5 rounded text-blue-800">( )</code>.</p>
                <p>• Phía trái 45% sẽ hiển thị nhân vật và các hộp thông tin hình ảnh; phía phải 55% là các câu luyện viết có dòng kẻ điền khuyết dài.</p>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 5: SPEAKING / READING */}
      {/* ======================================================== */}
      {materialType === 'speakingReading' && (
        <div className="space-y-3.5" id="mode-speaking-reading-inputs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              ĐOẠN VĂN ĐỌC BẰNG HÌNH (REBUS STORY)
            </span>
            {renderDataActionButtons('speaking-reading')}
          </div>

          <div>
            <textarea
              id="input-speaking-reading"
              rows={4}
              value={content.speakingReadingContent || ''}
              onChange={(e) => handleFieldChange('speakingReadingContent', e.target.value)}
              placeholder={`Every morning, I get up at (6:00).\nI eat (bread) and drink (milk).\nThen I ride my (bike) to (school) with (Nam).\nIn the afternoon, we play (football) in the park.`}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed"
            />
            {/* Short example and character counter */}
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>Ví dụ: <code className="text-blue-700 font-semibold">I ride my (bike) to school.</code></span>
              <span className="font-mono text-slate-400">
                {(content.speakingReadingContent || '').length} ký tự • {parseSpeakingReading(content.speakingReadingContent || '').slots.length} hình minh hoạ
              </span>
            </div>

            {/* Expandable "Xem cách nhập" */}
            <details className="mt-2 text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <summary className="font-semibold text-blue-700 cursor-pointer select-none flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Xem cách nhập Speaking / Reading</span>
                <ChevronDown className="w-3 h-3 ml-auto text-slate-400" />
              </summary>
              <div className="mt-2 pt-2 border-t border-slate-200 text-slate-600 space-y-1">
                <p>• Đặt từ/cụm từ cần thay thế bằng hình ảnh trong dấu ngoặc tròn <code className="bg-slate-200 px-1 py-0.5 rounded text-blue-800">( )</code>.</p>
                <p>• Hệ thống tự động chuyển đổi từ trong ngoặc thành biểu tượng Rebus (giờ &rarr; đồng hồ, quốc gia &rarr; cờ, xe cộ/đồ ăn &rarr; hình minh họa).</p>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 6: MINDMAP */}
      {/* ======================================================== */}
      {materialType === 'mindmap' && (
        <div className="space-y-3.5" id="mode-mindmap-inputs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              DẠNG SƠ ĐỒ TƯ DUY (MINDMAP SUBTYPE)
            </span>
            {renderDataActionButtons('mindmap')}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(
              [
                'Dạng 1 — Theo chủ đề',
                'Dạng 2 — Một nhân vật',
                'Dạng 3 — Nhiều nhân vật',
              ] as MindmapSubtype[]
            ).map((st) => {
              const isSelected = (content.mindmapSubtype || 'Dạng 1 — Theo chủ đề') === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleFieldChange('mindmapSubtype', st)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>

          {/* Dạng 1: Theo chủ đề */}
          {(content.mindmapSubtype || 'Dạng 1 — Theo chủ đề') === 'Dạng 1 — Theo chủ đề' && (
            <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tiêu đề sơ đồ</label>
                  <input
                    type="text"
                    value={content.mindmapType1Title || ''}
                    onChange={(e) => handleFieldChange('mindmapType1Title', e.target.value)}
                    placeholder="VD: Unit 1: Hello"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chủ đề trung tâm</label>
                  <input
                    type="text"
                    value={content.mindmapType1Topic || ''}
                    onChange={(e) => handleFieldChange('mindmapType1Topic', e.target.value)}
                    placeholder="VD: Animals, School, Hobbies..."
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 font-semibold text-blue-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mẫu câu nhánh</label>
                <input
                  type="text"
                  value={content.mindmapType1Pattern || ''}
                  onChange={(e) => handleFieldChange('mindmapType1Pattern', e.target.value)}
                  placeholder="VD: I have a... / It is a..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Từ khóa các nhánh</label>
                <textarea
                  rows={2}
                  value={content.mindmapType1Keywords || ''}
                  onChange={(e) => handleFieldChange('mindmapType1Keywords', e.target.value)}
                  placeholder="Nhập các từ khóa cách nhau bởi dấu phẩy"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span>Các nhánh sơ đồ phân tách theo dấu phẩy</span>
                  <span className="font-mono text-slate-400">
                    {(content.mindmapType1Keywords || '').length} ký tự
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Dạng 2: Một nhân vật */}
          {content.mindmapSubtype === 'Dạng 2 — Một nhân vật' && (
            <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tên nhân vật</label>
                <input
                  type="text"
                  value={content.mindmapType2Name || ''}
                  onChange={(e) => handleFieldChange('mindmapType2Name', e.target.value)}
                  placeholder="Nam"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 font-bold text-blue-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Danh sách thông tin nhân vật (Mỗi dòng một mục)
                </label>
                <textarea
                  rows={4}
                  value={content.mindmapType2Info || ''}
                  onChange={(e) => handleFieldChange('mindmapType2Info', e.target.value)}
                  placeholder={`From: Vietnam\nBirthday: October\nAge: 9\nClass: 4A6\nSchool: Dai Dong Primary School\nFavorite animal: hamster\nHobby: riding a bike`}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed"
                />
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span>Ví dụ: <code className="text-blue-700 font-semibold">Age: 9</code> hoặc <code className="text-blue-700 font-semibold">Hobby: riding a bike</code></span>
                  <span className="font-mono text-slate-400">
                    {(content.mindmapType2Info || '').length} ký tự
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Dạng 3: Nhiều nhân vật */}
          {content.mindmapSubtype === 'Dạng 3 — Nhiều nhân vật' && (
            <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chủ đề</label>
                  <input
                    type="text"
                    value={content.mindmapType3Topic || ''}
                    onChange={(e) => handleFieldChange('mindmapType3Topic', e.target.value)}
                    placeholder="Our Class Friends"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mẫu câu cho nhân vật 1</label>
                  <input
                    type="text"
                    value={content.mindmapType3ModelPattern || ''}
                    onChange={(e) => handleFieldChange('mindmapType3ModelPattern', e.target.value)}
                    placeholder="This is Lina. She is 7 years old. She is in class 2A1."
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Danh sách nhân vật (Định dạng: Tên / Tuổi / Lớp)
                </label>
                <textarea
                  rows={4}
                  value={content.mindmapType3Characters || ''}
                  onChange={(e) => handleFieldChange('mindmapType3Characters', e.target.value)}
                  placeholder={`Lina / 7 / 2A1\nEmma / 8 / 3A2\nJack / 9 / 4A1\nMia / 10 / 5A2`}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed"
                />
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span>Ví dụ: <code className="text-blue-700 font-semibold">Lina / 7 / 2A1</code></span>
                  <span className="font-mono text-slate-400">
                    {(content.mindmapType3Characters || '').length} ký tự
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBSECTION: PHONG CÁCH & ĐỘ TUỔI */}
      {/* ======================================================== */}
      <div className="pt-3.5 border-t border-slate-100 space-y-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          PHONG CÁCH & ĐỘ TUỔI
        </span>

        {/* AGE STYLE BADGE & TEACHER OVERRIDE */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                ĐỘ TUỔI HỌC SINH & PHONG CÁCH TẠO HÌNH
              </label>
              <p className="text-[11px] text-slate-500">
                Nhận diện tự động theo khối lớp, cho phép giáo viên ghi đè linh hoạt
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-100 text-blue-900 rounded-full text-[11px] font-bold border border-blue-200 shadow-2xs">
              <span>Độ tuổi tự động:</span>
              <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px]">
                {getAutomaticAgeStyleLabel(grade)} ({grade})
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="select-age-style-override" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Tùy chọn phong cách theo lứa tuổi:
            </label>
            <select
              id="select-age-style-override"
              value={content.ageStyleOverride || 'Tự động'}
              onChange={(e) => handleFieldChange('ageStyleOverride', e.target.value as AgeStyleOverride)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {AGE_STYLE_OVERRIDE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label} — {opt.desc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Art Style Choice */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-blue-600" />
            <span>Phong cách nghệ thuật (Art Style)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {ART_STYLES.map((style) => {
              const isSelected = artStyle === style.id;
              return (
                <button
                  key={style.id}
                  id={`btn-style-${style.id.replace(/\s+/g, '-').toLowerCase()}`}
                  type="button"
                  onClick={() => onArtStyleChange(style.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer h-full flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm">{style.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                      {style.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUBSECTION: TÙY CHỌN HÌNH ẢNH & ĐỘ CHẶT */}
      {/* ======================================================== */}
      <div className="pt-3.5 border-t border-slate-100 space-y-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          TÙY CHỌN HÌNH ẢNH & ĐỘ CHẶT
        </span>

        {/* Aspect Ratio Choice */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Ratio className="w-3.5 h-3.5 text-blue-600" />
            <span>Tỉ lệ khung hình (Canva Aspect Ratio)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ASPECT_RATIOS.map((ratio) => {
              const isSelected = aspectRatio === ratio.id;
              return (
                <button
                  key={ratio.id}
                  id={`btn-ratio-${ratio.id.replace(':', '-')}`}
                  type="button"
                  onClick={() => onAspectRatioChange(ratio.id)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-center items-center min-h-[70px] sm:min-h-[74px] ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs leading-tight whitespace-nowrap">
                    {ratio.label}
                  </div>
                  <div
                    className={`text-[9.5px] sm:text-[10px] leading-snug mt-1 line-clamp-2 max-w-full ${
                      isSelected ? 'text-blue-100' : 'text-slate-500'
                    }`}
                    title={ratio.desc}
                  >
                    {ratio.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ĐỘ CHẶT PROMPT */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Độ chặt prompt (Prompt Strictness)</span>
            </label>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Mặc định: Rất chặt
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['Normal', 'Chặt', 'Rất chặt'] as PromptStrictness[]).map((level) => {
              const currentLevel = content.promptStrictness || 'Rất chặt';
              const isSelected = currentLevel === level;
              return (
                <button
                  key={level}
                  id={`btn-strictness-${level.toLowerCase().replace(/\s+/g, '-')}`}
                  type="button"
                  onClick={() => handleFieldChange('promptStrictness', level)}
                  className={`p-2 sm:p-2.5 rounded-xl border text-left sm:text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-2xs font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-medium'
                  }`}
                >
                  <div className="flex items-center justify-between sm:justify-center gap-1">
                    <span className="text-xs sm:text-sm">{level}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                    {level === 'Rất chặt'
                      ? 'Khóa số lượng thẻ & nhân vật tuyệt đối'
                      : level === 'Chặt'
                      ? 'Khóa nội dung giáo viên nhập'
                      : 'Bình thường, linh hoạt bố cục'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUBSECTION: YÊU CẦU BỔ SUNG CHO CANVA */}
      {/* ======================================================== */}
      <div className="pt-3.5 border-t border-slate-100 space-y-1.5">
        <label
          htmlFor="input-teacher-notes"
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1"
        >
          <span>Yêu cầu bổ sung cho Canva (Tùy chọn)</span>
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
        </label>
        <input
          id="input-teacher-notes"
          type="text"
          value={content.notes || ''}
          onChange={(e) => handleFieldChange('notes', e.target.value)}
          placeholder="Ví dụ: vibrant pastel colors, clean borders, friendly smile, extra space on top..."
          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Validation Message Display */}
      {!validation.isValid && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Cần bổ sung dữ liệu:</span>
            <span>{validation.errorMessage}</span>
          </div>
        </div>
      )}

      {/* Mobile inline Generate Trigger */}
      <div className="pt-1 sm:hidden">
        <button
          type="button"
          onClick={onGenerate}
          disabled={!validation.isValid}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>TẠO PROMPT</span>
        </button>
      </div>
    </div>
  );
};
