import React, { useState } from 'react';
import { SavedPromptItem } from '../types';
import { X, Copy, Trash2, Check, ExternalLink, Bookmark, Clock } from 'lucide-react';

interface SavedPromptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPrompts?: SavedPromptItem[];
  savedItems?: SavedPromptItem[];
  onDeletePrompt?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClearAll: () => void;
  onSelectPrompt?: (item: SavedPromptItem) => void;
  onSelect?: (item: SavedPromptItem) => void;
  onCopyPrompt?: (promptText: string) => void;
  onCopy?: (promptText: string) => void;
}

export const SavedPromptsModal: React.FC<SavedPromptsModalProps> = ({
  isOpen,
  onClose,
  savedPrompts,
  savedItems,
  onDeletePrompt,
  onDelete,
  onClearAll,
  onSelectPrompt,
  onSelect,
  onCopyPrompt,
  onCopy,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const items = Array.isArray(savedPrompts)
    ? savedPrompts
    : Array.isArray(savedItems)
    ? savedItems
    : [];

  const handleCopy = (id: string, text: string) => {
    const copyFn = onCopyPrompt || onCopy;
    if (copyFn) {
      copyFn(text);
    }
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleDelete = (id: string) => {
    const deleteFn = onDeletePrompt || onDelete;
    if (deleteFn) {
      deleteFn(id);
    }
  };

  const handleSelect = (item: SavedPromptItem) => {
    const selectFn = onSelectPrompt || onSelect;
    if (selectFn) {
      selectFn(item);
    }
    onClose();
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Kho Prompt đã lưu ({items.length})
              </h3>
              <p className="text-xs text-slate-500">
                Lưu trữ cục bộ trên trình duyệt của giáo viên (không gửi lên server)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Bookmark className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <p className="text-sm font-medium text-slate-600">Chưa có prompt nào được lưu</p>
              <p className="text-xs text-slate-400">
                Sau khi tạo prompt, nhấn nút &ldquo;LƯU PROMPT&rdquo; để lưu vào danh sách xem lại.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="border border-slate-200 rounded-xl p-3.5 hover:border-blue-300 transition-colors bg-slate-50/50 hover:bg-white"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
                      {item.grade}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-700">
                      {item.materialTypeName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-amber-100 text-amber-800">
                      {item.aspectRatio}
                    </span>
                    <span className="text-xs font-medium text-slate-600 truncate max-w-[180px] sm:max-w-[260px]">
                      {item.unitTitle}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatDate(item.timestamp)}
                  </span>
                </div>

                <p className="text-xs font-mono text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 line-clamp-3 leading-relaxed mb-3">
                  {item.promptText}
                </p>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>Tải vào khung làm việc</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.promptText)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border flex items-center gap-1 transition-colors ${
                        copiedId === item.id
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Xoá prompt này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          {items.length > 0 ? (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xoá tất cả</span>
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
