import React, { useState, useMemo, useRef, useEffect } from 'react';
import { GradeLevel, TextbookChoice, CurriculumUnit } from '../types';
import {
  GRADE_LIST,
  getUnits,
  getGrades,
} from '../data/globalSuccess';
import {
  Sparkles,
  Star,
  Search,
  X,
} from 'lucide-react';

interface CurriculumControlsProps {
  grade: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
  textbook: TextbookChoice;
  onTextbookChange: (textbook: TextbookChoice) => void;
  selectedUnit: CurriculumUnit | null;
  onUnitSelect?: (unit: CurriculumUnit) => void;
  onSelectUnit?: (unit: CurriculumUnit) => void;
  customTopic: string;
  onCustomTopicChange: (topic: string) => void;
  favoriteUnits: string[];
  onToggleFavorite: (unitId: string) => void;
  onSelectFavoriteUnit?: (grade: number, unitNumber: number) => void;
}

interface UnitSearchResult {
  gradeNum: number;
  gradeStr: GradeLevel;
  unit: CurriculumUnit;
}

export const CurriculumControls: React.FC<CurriculumControlsProps> = ({
  grade,
  onGradeChange,
  textbook,
  onTextbookChange,
  selectedUnit,
  onUnitSelect,
  onSelectUnit,
  customTopic,
  onCustomTopicChange,
  favoriteUnits = [],
  onToggleFavorite,
  onSelectFavoriteUnit,
}) => {
  const gradeNumber = parseInt(grade.replace(/\D/g, ''), 10) || 1;
  const currentGradeUnits = getUnits(gradeNumber) || [];
  const safeFavoriteUnits = Array.isArray(favoriteUnits) ? favoriteUnits : [];
  const currentUnitId = selectedUnit ? `g${gradeNumber}-u${selectedUnit.unit}` : '';
  const isFavorite = safeFavoriteUnits.includes(currentUnitId);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search across ALL Global Success units across all 12 grades
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query || query.length < 2) return [];

    const results: UnitSearchResult[] = [];
    const grades = getGrades();

    for (const g of grades) {
      const units = getUnits(g);
      for (const u of units) {
        const titleMatch = u.title.toLowerCase().includes(query);
        const unitMatch = `unit ${u.unit}`.includes(query) || `bài ${u.unit}`.includes(query);
        const vocabMatch = u.vocabulary && u.vocabulary.some((v) => v.toLowerCase().includes(query));

        if (titleMatch || unitMatch || vocabMatch) {
          results.push({
            gradeNum: g,
            gradeStr: `Lớp ${g}` as GradeLevel,
            unit: u,
          });
          if (results.length >= 25) break;
        }
      }
      if (results.length >= 25) break;
    }

    return results;
  }, [searchQuery]);

  const handleUnitSelect = (unit: CurriculumUnit) => {
    if (typeof onUnitSelect === 'function') {
      onUnitSelect(unit);
    }
    if (typeof onSelectUnit === 'function') {
      onSelectUnit(unit);
    }
  };

  const handleSelectSearchResult = (result: UnitSearchResult) => {
    onGradeChange(result.gradeStr);
    onTextbookChange('Global Success');
    handleUnitSelect(result.unit);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  // Extract list of favorite units details
  const favoriteUnitsList = useMemo(() => {
    const list: { gradeNum: number; unitNum: number; title: string; id: string }[] = [];
    for (const id of safeFavoriteUnits) {
      const match = id.match(/^g(\d+)-u(\d+)$/);
      if (match) {
        const g = parseInt(match[1], 10);
        const u = parseInt(match[2], 10);
        const units = getUnits(g);
        const found = units.find((item) => item.unit === u);
        if (found) {
          list.push({
            gradeNum: g,
            unitNum: u,
            title: found.title,
            id,
          });
        }
      }
    }
    return list;
  }, [safeFavoriteUnits]);

  return (
    <div id="section-curriculum" className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
            1
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              CHƯƠNG TRÌNH HỌC & CHỦ ĐỀ
            </h2>
            <p className="text-[11px] text-slate-500">
              Chọn khối lớp và bài học hoặc nhập chủ đề giảng dạy tự do
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TÌM UNIT / CHỦ ĐỀ (GLOBAL SEARCH) */}
      {/* ======================================================== */}
      <div ref={searchContainerRef} className="relative">
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="input-search-unit"
            className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <span>TÌM UNIT / CHỦ ĐỀ</span>
          </label>
          <span className="text-[11px] text-slate-400 hidden sm:inline">Tra cứu nhanh qua tất cả 12 khối lớp</span>
        </div>
        <div className="relative">
          <input
            id="input-search-unit"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => {
              if (searchQuery.trim().length >= 2) {
                setIsSearchOpen(true);
              }
            }}
            placeholder="Gõ tên bài học hoặc từ khóa (ví dụ: Hello, Food, Family, My hobbies, Animals)..."
            className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl pl-8.5 pr-8 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim().length >= 2 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100">
            {searchResults.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-500">
                Không tìm thấy bài học nào khớp với &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              searchResults.map((res, idx) => (
                <button
                  key={`search-res-${res.gradeNum}-${res.unit.unit}-${idx}`}
                  type="button"
                  onClick={() => handleSelectSearchResult(res)}
                  className="w-full text-left p-2.5 hover:bg-blue-50/80 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-xs sm:text-sm text-slate-800 truncate">
                      Unit {res.unit.unit}: {res.unit.title}
                    </div>
                    {res.unit.vocabulary && (
                      <div className="text-[11px] text-slate-500 truncate">
                        Từ vựng: {res.unit.vocabulary.slice(0, 5).join(', ')}
                      </div>
                    )}
                  </div>
                  <span className="shrink-0 text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                    {res.gradeStr}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* ROW 1: KHỐI LỚP & BỘ SÁCH GIÁO TRÌNH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="select-grade"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            KHỐI LỚP
          </label>
          <select
            id="select-grade"
            value={grade}
            onChange={(e) => onGradeChange(e.target.value as GradeLevel)}
            className="w-full bg-white hover:bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
          >
            {GRADE_LIST.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="select-textbook"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            BỘ SÁCH GIÁO TRÌNH
          </label>
          <select
            id="select-textbook"
            value={textbook}
            onChange={(e) => onTextbookChange(e.target.value as TextbookChoice)}
            className="w-full bg-white hover:bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="Global Success">Global Success</option>
            <option value="Chủ đề tự nhập">Chủ đề tự nhập</option>
          </select>
        </div>
      </div>

      {/* ROW 2: UNIT / BÀI HỌC (FULL WIDTH) */}
      <div className="space-y-2.5">
        <div>
          <label
            htmlFor="select-unit"
            className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
          >
            {textbook === 'Global Success'
              ? `UNIT / BÀI HỌC · ${currentGradeUnits.length} UNITS`
              : 'UNIT / BÀI HỌC'}
          </label>
          <select
            id="select-unit"
            value={textbook === 'Chủ đề tự nhập' ? 'custom' : selectedUnit ? selectedUnit.unit.toString() : ''}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                onTextbookChange('Chủ đề tự nhập');
              } else {
                onTextbookChange('Global Success');
                const unitNum = parseInt(e.target.value, 10);
                const found = currentGradeUnits.find((u) => u.unit === unitNum);
                if (found) {
                  handleUnitSelect(found);
                }
              }
            }}
            className="w-full bg-white hover:bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer truncate"
          >
            {currentGradeUnits.map((u) => (
              <option key={`unit-${u.unit}`} value={u.unit.toString()}>
                Unit {u.unit}: {u.title}
              </option>
            ))}
            <option value="custom" className="font-bold text-blue-600">
              + Chủ đề tự nhập
            </option>
          </select>
        </div>

        {/* ACTIONS: ☆ Yêu thích / ★ Đã yêu thích | Áp dụng tiêu đề */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <button
            type="button"
            id={`btn-fav-unit-${selectedUnit ? selectedUnit.unit : 'none'}`}
            onClick={() => selectedUnit && onToggleFavorite(currentUnitId)}
            disabled={textbook === 'Chủ đề tự nhập' || !selectedUnit}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              isFavorite
                ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-xs ring-1 ring-amber-400/30 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            } ${textbook === 'Chủ đề tự nhập' || !selectedUnit ? 'opacity-40 cursor-not-allowed' : ''}`}
            title={isFavorite ? 'Bỏ lưu yêu thích' : 'Đánh dấu bài học yêu thích'}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
            <span>{isFavorite ? '★ Đã yêu thích' : '☆ Yêu thích'}</span>
          </button>

          {textbook === 'Global Success' && selectedUnit && (
            <button
              type="button"
              id="btn-autofill-unit"
              onClick={() => handleUnitSelect(selectedUnit)}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              title="Áp dụng tiêu đề Unit này vào nội dung bài dạy"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Áp dụng tiêu đề</span>
            </button>
          )}
        </div>

        {/* CUSTOM TOPIC INPUT (WHEN SELECTED) */}
        {textbook === 'Chủ đề tự nhập' && (
          <div className="mt-2.5 p-3 bg-blue-50/50 rounded-xl border border-blue-200 space-y-1.5">
            <label
              htmlFor="input-custom-topic"
              className="block text-xs font-bold text-slate-800 uppercase tracking-wider"
            >
              Tên chủ đề
            </label>
            <input
              id="input-custom-topic"
              type="text"
              value={customTopic}
              onChange={(e) => onCustomTopicChange(e.target.value)}
              placeholder="Ví dụ: Farm Animals, Traffic Safety, Lunar New Year in Viet Nam, Solar System..."
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-[11px] text-slate-500">
              * Lưu ý: Chủ đề tự nhập được xử lý độc lập trong prompt tạo hình Canva và không ghép với tên bài học Global Success.
            </p>
          </div>
        )}
      </div>

      {/* DANH SÁCH UNIT YÊU THÍCH (NẾU CÓ) */}
      {favoriteUnitsList.length > 0 && (
        <div className="pt-2.5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>BÀI HỌC ĐÃ YÊU THÍCH ({favoriteUnitsList.length})</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {favoriteUnitsList.map((fav) => {
              const isCurrent =
                textbook === 'Global Success' &&
                gradeNumber === fav.gradeNum &&
                selectedUnit?.unit === fav.unitNum;
              return (
                <button
                  key={fav.id}
                  type="button"
                  onClick={() => onSelectFavoriteUnit?.(fav.gradeNum, fav.unitNum)}
                  className={`px-2 py-1 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-amber-50/50 hover:bg-amber-100/70 text-amber-900 border-amber-200'
                  }`}
                >
                  <span className="font-bold">Lớp {fav.gradeNum}</span>
                  <span>•</span>
                  <span className="truncate max-w-[160px]">Unit {fav.unitNum}: {fav.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
