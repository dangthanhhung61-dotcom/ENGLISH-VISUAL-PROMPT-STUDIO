import React, { useState } from 'react';
import { PromptHistoryRecord } from '../types';
import { X, Copy, Trash2, Check, History, RotateCcw } from 'lucide-react';
import { extractCanvaPromptForClipboard } from '../lib/canvaPromptEngine';

interface PromptHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: PromptHistoryRecord[];
  onRestore: (record: PromptHistoryRecord) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onCopy: (text: string) => void;
}

export const PromptHistoryModal: React.FC<PromptHistoryModalProps> = ({
  isOpen,
  onClose,
  history = [],
  onRestore,
  onDelete,
  onClearAll,
  onCopy,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, promptText: string) => {
    const cleanPrompt = extractCanvaPromptForClipboard(promptText);
    onCopy(cleanPrompt);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleRestore = (record: PromptHistoryRecord) => {
    onRestore(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                LỊCH SỬ TẠO PROMPT ({history.length} / 20)
              </h3>
              <p className="text-xs text-slate-500">
                Lưu tối đa 20 prompt gần nhất với ngày giờ, khối lớp, Unit và loại học liệu
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <History className="w-12 h-12 mx-auto mb-2 opacity-30 text-blue-500" />
              <p className="font-semibold text-slate-600">Chưa có lịch sử tạo prompt</p>
              <p className="text-xs text-slate-400 mt-1">
                Các câu lệnh bạn bấm &ldquo;TẠO PROMPT&rdquo; hoặc &ldquo;LƯU PROMPT&rdquo; sẽ tự động lưu lại ở đây (tối đa 20 bản ghi).
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5 hover:border-blue-300 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-md">
                      {item.grade}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-md">
                      {item.materialTypeName}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px]">
                      {item.unit}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {item.dateTime}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 max-h-24 overflow-y-auto line-clamp-3 leading-relaxed">
                  {item.prompt}
                </div>

                {/* Actions: Khôi phục, Sao chép, Xóa */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleRestore(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    title="Khôi phục prompt vào bảng xem trước"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Khôi phục</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.prompt)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      copiedId === item.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === item.id ? 'Đã chép' : 'Sao chép'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Xóa bản ghi này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        {history.length > 0 && (
          <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between rounded-b-2xl">
            <span className="text-xs text-slate-500">
              Lưu tự động trong bộ nhớ cục bộ trình duyệt
            </span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-red-600 hover:text-red-700 font-semibold px-2.5 py-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              Xóa toàn bộ lịch sử
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
