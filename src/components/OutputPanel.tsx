import React, { useState } from 'react';
import {
  GradeLevel,
  TextbookChoice,
  MaterialTypeId,
  AspectRatioChoice,
  ArtStyleChoice,
  SinglePromptItem,
} from '../types';
import {
  Sparkles,
  Copy,
  RotateCcw,
  BookmarkPlus,
  ExternalLink,
  Check,
  FileText,
  AlertTriangle,
  Layers,
  History,
} from 'lucide-react';
import { MATERIAL_TYPES } from '../data/globalSuccess';
import { extractCanvaPromptForClipboard } from '../lib/canvaPromptEngine';

interface OutputPanelProps {
  grade: GradeLevel;
  textbook: TextbookChoice;
  unitTitle?: string;
  materialType: MaterialTypeId;
  artStyle: ArtStyleChoice;
  aspectRatio: AspectRatioChoice;
  promptText?: string;
  prompt?: string;
  batchPrompts?: SinglePromptItem[];
  onPromptChange?: (newPrompt: string) => void;
  onGenerate: () => void;
  onCopy: (text?: string) => void;
  onClearContent: () => void;
  onSave: () => void;
  onOpenHistory?: () => void;
  isCopied: boolean;
  isSaved: boolean;
  isOutdated?: boolean;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  grade,
  textbook,
  unitTitle = '',
  materialType,
  artStyle,
  aspectRatio,
  promptText,
  prompt,
  batchPrompts = [],
  onPromptChange,
  onGenerate,
  onCopy,
  onClearContent,
  onSave,
  onOpenHistory,
  isCopied,
  isSaved,
  isOutdated = false,
}) => {
  const text = (promptText ?? prompt ?? '').toString();
  const currentMaterial = MATERIAL_TYPES.find((m) => m.id === materialType);
  const materialName = currentMaterial ? `${currentMaterial.name} (${currentMaterial.helperLabel})` : materialType;
  const isError = text.startsWith('Lỗi:');

  const [activeBatchIndex, setActiveBatchIndex] = useState<number>(0);
  const [copiedBatchIndex, setCopiedBatchIndex] = useState<number | null>(null);

  const handleCopySingleBatch = (idx: number, promptString: string) => {
    const cleaned = extractCanvaPromptForClipboard(promptString);
    onCopy(cleaned);
    setCopiedBatchIndex(idx);
    setTimeout(() => {
      setCopiedBatchIndex(null);
    }, 2000);
  };

  const handleCopyMainPrompt = () => {
    const rawToCopy = hasBatch ? batchPrompts[activeBatchIndex]?.promptText || text : text;
    const cleaned = extractCanvaPromptForClipboard(rawToCopy);
    onCopy(cleaned);
  };

  const handleCopyAllBatches = () => {
    if (!batchPrompts || batchPrompts.length === 0) return;
    const combined = batchPrompts
      .map((bp) => extractCanvaPromptForClipboard(bp.promptText))
      .join('\n\n---\n\n');
    onCopy(combined);
  };

  const hasBatch = Array.isArray(batchPrompts) && batchPrompts.length > 1;
  const currentDisplayPrompt = hasBatch ? batchPrompts[activeBatchIndex]?.promptText || text : text;

  return (
    <div
      id="section-output-panel"
      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full lg:max-h-[calc(100vh-5.5rem)]"
    >
      {/* Panel Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-3.5 sm:p-4 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight">
                PROMPT CHO CANVA DREAM LAB
              </h2>
              <p className="text-[11px] text-blue-100">
                Định dạng chuẩn xác, cấu trúc khối rõ ràng, tối ưu hoá cho Canva
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="inline-flex items-center gap-1 text-xs font-semibold bg-white/15 hover:bg-white/25 text-white px-2 py-1 rounded-lg transition-colors cursor-pointer"
                title="Xem lịch sử 20 prompt gần nhất"
              >
                <History className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lịch sử</span>
              </button>
            )}
            <a
              href="https://www.canva.com/dream-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded-lg transition-colors cursor-pointer"
              title="Mở Canva Dream Lab trong tab mới"
            >
              <span>Canva</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Metadata summary */}
        <div className="mt-2.5 pt-2 border-t border-white/15 grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs">
          <div className="bg-white/10 rounded-lg p-1.5 backdrop-blur-xs">
            <span className="text-blue-200 block text-[9px] uppercase font-bold">Khối:</span>
            <span className="font-semibold text-white truncate block text-xs">{grade}</span>
          </div>
          <div className="bg-white/10 rounded-lg p-1.5 backdrop-blur-xs">
            <span className="text-blue-200 block text-[9px] uppercase font-bold">Sách:</span>
            <span className="font-semibold text-white truncate block text-xs">{textbook}</span>
          </div>
          <div className="bg-white/10 rounded-lg p-1.5 backdrop-blur-xs col-span-2 sm:col-span-1">
            <span className="text-blue-200 block text-[9px] uppercase font-bold">Unit:</span>
            <span className="font-semibold text-white truncate block text-xs" title={unitTitle || 'Tự do'}>
              {unitTitle || 'Tự do'}
            </span>
          </div>
          <div className="bg-white/10 rounded-lg p-1.5 backdrop-blur-xs">
            <span className="text-blue-200 block text-[9px] uppercase font-bold">Dạng:</span>
            <span className="font-semibold text-white truncate block text-xs" title={materialName}>
              {currentMaterial?.helperLabel || materialType}
            </span>
          </div>
          <div className="bg-white/10 rounded-lg p-1.5 backdrop-blur-xs">
            <span className="text-blue-200 block text-[9px] uppercase font-bold">Tỉ lệ:</span>
            <span className="font-bold text-amber-300 block text-xs">{aspectRatio}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col space-y-3 overflow-y-auto">
        {/* Error Callout */}
        {isError && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Lưu ý nhập liệu:</span>
              <span>{text}</span>
            </div>
          </div>
        )}

        {/* Stale Warning Callout */}
        {isOutdated && !isError && (
          <div
            id="stale-prompt-warning"
            className="p-3 bg-amber-50 border-2 border-amber-400 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-amber-900 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold text-xs sm:text-sm block">
                  Nội dung đã thay đổi. Hãy tạo lại prompt.
                </span>
                <span className="text-[11px] text-amber-800 leading-tight">
                  Dữ liệu vừa được chỉnh sửa, prompt hiện tại chưa đồng bộ với nội dung mới.
                </span>
              </div>
            </div>
            <button
              id="btn-re-generate-prompt"
              type="button"
              onClick={onGenerate}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs flex items-center gap-1.5 self-end sm:self-center"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>TẠO LẠI PROMPT</span>
            </button>
          </div>
        )}

        {/* Batch Tab Switcher for 1 từ = 1 prompt */}
        {hasBatch && (
          <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5 text-[11px]">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Đã tạo {batchPrompts.length} prompt riêng biệt (1 từ = 1 prompt):</span>
              </span>
              <span className="text-[10px] text-slate-500">
                Nhấn chọn để xem
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {batchPrompts.map((bp, idx) => {
                const isActive = activeBatchIndex === idx;
                const isItemCopied = copiedBatchIndex === idx;
                return (
                  <button
                    key={bp.id}
                    type="button"
                    onClick={() => setActiveBatchIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{bp.label}</span>
                    {isItemCopied && <Check className="w-3 h-3 text-emerald-300" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium flex items-center gap-1 text-[11px]">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            {hasBatch
              ? `Nội dung ${batchPrompts[activeBatchIndex]?.label || 'Thẻ được chọn'} (sửa được):`
              : 'Văn bản Prompt Canva (có thể chỉnh sửa trực tiếp trước khi copy):'}
          </span>
          <span className="text-[11px] font-mono font-semibold text-slate-600">
            {currentDisplayPrompt.length} ký tự
          </span>
        </div>

        <div className="relative flex-1 min-h-[220px]">
          <textarea
            id="textarea-generated-prompt"
            value={currentDisplayPrompt}
            onChange={(e) => {
              if (onPromptChange) {
                onPromptChange(e.target.value);
              }
            }}
            placeholder="Nhấn 'TẠO PROMPT' để tạo câu lệnh tiếng Anh chuẩn xác cho Canva Dream Lab..."
            className="w-full h-full min-h-[220px] p-3 text-xs sm:text-sm font-mono text-slate-800 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden leading-relaxed resize-y"
          />
        </div>

        {/* ======================================================== */}
        {/* ACTION BUTTONS: TẠO PROMPT | SAO CHÉP | LƯU | LÀM MỚI NỘI DUNG */}
        {/* ======================================================== */}
        <div className="space-y-2 pt-0.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* 1. TẠO PROMPT */}
            <button
              id="btn-generate-prompt"
              type="button"
              onClick={onGenerate}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>TẠO PROMPT</span>
            </button>

            {/* 2. SAO CHÉP PROMPT */}
            {hasBatch ? (
              <button
                id="btn-copy-canva-prompt"
                type="button"
                onClick={() => handleCopySingleBatch(activeBatchIndex, batchPrompts[activeBatchIndex]?.promptText || text)}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer ${
                  copiedBatchIndex === activeBatchIndex
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {copiedBatchIndex === activeBatchIndex ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>
                  {copiedBatchIndex === activeBatchIndex
                    ? 'ĐÃ SAO CHÉP!'
                    : `SAO CHÉP THẺ ${activeBatchIndex + 1}`}
                </span>
              </button>
            ) : (
              <button
                id="btn-copy-canva-prompt"
                type="button"
                onClick={handleCopyMainPrompt}
                disabled={!text.trim() || isError}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer ${
                  isCopied
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'ĐÃ SAO CHÉP!' : 'SAO CHÉP PROMPT'}</span>
              </button>
            )}

            {/* 3. LƯU PROMPT */}
            <button
              id="btn-save-prompt"
              type="button"
              onClick={onSave}
              disabled={!text.trim() || isError}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors border cursor-pointer ${
                isSaved
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <BookmarkPlus className="w-4 h-4 text-blue-600" />
              <span>{isSaved ? 'ĐÃ LƯU PROMPT' : 'LƯU PROMPT'}</span>
            </button>
          </div>

          <div>
            {/* 4. LÀM MỚI NỘI DUNG (clear only teacher content, preserve grade, book, unit, material type) */}
            <button
              id="btn-clear-teacher-content"
              type="button"
              onClick={onClearContent}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors border border-slate-200 cursor-pointer"
              title="Chỉ xoá nội dung giáo viên nhập, giữ nguyên khối lớp, bộ sách, Unit và dạng học liệu"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>LÀM MỚI NỘI DUNG</span>
            </button>
          </div>
        </div>

        {/* Copy All Prompts for batch */}
        {hasBatch && (
          <div className="pt-0.5">
            <button
              type="button"
              onClick={handleCopyAllBatches}
              className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-slate-600" />
              <span>SAO CHÉP TẤT CẢ {batchPrompts.length} PROMPT CÙNG LÚC</span>
            </button>
          </div>
        )}

        {/* Quick Instructions for Teachers */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <span>💡 3 bước tạo ảnh nhanh trên Canva:</span>
          </div>
          <ol className="list-decimal list-inside space-y-0.5 text-slate-600 text-[11px] leading-relaxed">
            <li>
              Bấm nút <strong className="text-emerald-700">SAO CHÉP PROMPT</strong> ở trên.
            </li>
            <li>
              Mở <strong className="text-blue-700">Canva</strong> &rarr; vào <strong>Dream Lab</strong> (hoặc ứng dụng tạo ảnh AI).
            </li>
            <li>
              Dán prompt vào ô mô tả, chọn Tỉ lệ <strong className="text-slate-800 font-bold">{aspectRatio}</strong> và tạo ảnh.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
