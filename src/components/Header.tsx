import React from 'react';
import { Sparkles, Bookmark, ExternalLink, History } from 'lucide-react';

interface HeaderProps {
  savedCount: number;
  onOpenSavedModal: () => void;
  historyCount?: number;
  onOpenHistoryModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  savedCount,
  onOpenSavedModal,
  historyCount = 0,
  onOpenHistoryModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-900">
                LỚP HỌC THẦY KIÊN
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Sẵn sàng tạo prompt
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Tạo prompt học liệu tiếng Anh cho Canva Dream Lab
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          {onOpenHistoryModal && (
            <button
              id="btn-view-prompt-history"
              type="button"
              onClick={onOpenHistoryModal}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
              title="Xem 20 prompt gần đây"
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>Lịch sử ({historyCount})</span>
            </button>
          )}

          <button
            id="btn-view-saved-prompts"
            type="button"
            onClick={onOpenSavedModal}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-blue-600" />
            <span>Đã lưu ({savedCount})</span>
          </button>

          <a
            id="link-open-canva"
            href="https://www.canva.com/dream-lab"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 cursor-pointer"
            title="Mở Canva Dream Lab"
          >
            <span>Canva Dream Lab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
};
