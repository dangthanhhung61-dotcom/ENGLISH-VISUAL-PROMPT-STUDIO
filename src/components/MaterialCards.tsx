import React from 'react';
import { MaterialTypeId } from '../types';
import { MATERIAL_TYPES } from '../data/globalSuccess';
import {
  Image,
  PenTool,
  Grid,
  MessageSquare,
  BookOpenCheck,
  GitFork,
  CheckCircle2,
} from 'lucide-react';

interface MaterialCardsProps {
  selectedType: MaterialTypeId;
  onSelectType: (type: MaterialTypeId) => void;
}

const SHORT_LABELS: Record<MaterialTypeId, string> = {
  vocabulary: 'Thẻ từ vựng',
  tracing: 'Phiếu luyện viết',
  exercise: 'Bài tập 8 ô',
  speakingWriting: 'Nói và viết',
  speakingReading: 'Nói / đọc hình',
  mindmap: 'Sơ đồ tư duy',
};

const MATERIAL_DESCRIPTIONS: Record<MaterialTypeId, string> = {
  vocabulary: 'Thẻ từ vựng 16:9, hình minh họa bên trái, từ vựng + IPA + nghĩa bên phải',
  tracing: 'Phiếu luyện viết A4 dọc, trái hình – phải tracing chữ cái & câu mẫu',
  exercise: '8 ô minh họa đánh số 1–8 đối xứng (2 hàng x 4 cột)',
  speakingWriting: 'Phía trái 45% nhân vật & thông tin, phía phải 55% bài tập điền khuyết',
  speakingReading: 'Bảng 4–8 hàng ngang, thay thế từ trong ngoặc bằng icon minh họa',
  mindmap: 'Sơ đồ tư duy theo 3 dạng: Theo chủ đề, Một nhân vật, hoặc Nhiều nhân vật',
};

export const MaterialCards: React.FC<MaterialCardsProps> = ({
  selectedType,
  onSelectType,
}) => {
  const getIcon = (id: MaterialTypeId) => {
    switch (id) {
      case 'vocabulary':
        return Image;
      case 'tracing':
        return PenTool;
      case 'exercise':
        return Grid;
      case 'speakingWriting':
        return MessageSquare;
      case 'speakingReading':
        return BookOpenCheck;
      case 'mindmap':
        return GitFork;
      default:
        return Image;
    }
  };

  const currentItem =
    MATERIAL_TYPES.find((item) => item.id === selectedType) || MATERIAL_TYPES[0];

  return (
    <div id="section-material-types" className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
            2
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              DẠNG HỌC LIỆU
            </h2>
            <p className="text-[11px] text-slate-500">
              Chọn định dạng học liệu hình ảnh tối ưu cho Canva Dream Lab
            </p>
          </div>
        </div>
      </div>

      {/* 2-column x 3-row compact grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
        {MATERIAL_TYPES.map((item) => {
          const isSelected = selectedType === item.id;
          const Icon = getIcon(item.id);

          return (
            <div
              key={item.id}
              id={`card-material-${item.id}`}
              onClick={() => onSelectType(item.id)}
              className={`relative rounded-xl p-2.5 sm:p-3 border-2 transition-all cursor-pointer text-left flex flex-col justify-center min-h-[85px] sm:min-h-[88px] ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 w-full">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.name}
                    </div>
                    <div
                      className={`text-[11px] truncate ${
                        isSelected ? 'font-semibold text-blue-700' : 'font-medium text-slate-500'
                      }`}
                    >
                      {SHORT_LABELS[item.id]}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.defaultAspectRatio}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Description for currently selected material */}
      <div className="bg-blue-50/60 border border-blue-200/70 rounded-xl px-3 py-2 text-[11px] sm:text-xs text-slate-700 flex items-start sm:items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1 sm:mt-0" />
        <div className="leading-snug">
          <span className="font-bold text-blue-900">{currentItem.name}:</span>{' '}
          <span className="text-slate-700">
            {MATERIAL_DESCRIPTIONS[selectedType] || currentItem.description}
          </span>
          <span className="text-slate-400 mx-1.5">·</span>
          <span className="font-semibold text-blue-800 whitespace-nowrap">
            Tỉ lệ chuẩn {currentItem.defaultAspectRatio}
          </span>
        </div>
      </div>
    </div>
  );
};
