import { GradeLevel, AgeStyleOverride } from '../types';

export function getAutomaticAgeStyleLabel(grade: GradeLevel): string {
  const gradeNum = parseInt(grade.replace(/\D/g, ''), 10) || 1;
  if (gradeNum <= 2) {
    return 'Tiểu học nhỏ';
  } else if (gradeNum <= 5) {
    return 'Tiểu học';
  } else if (gradeNum <= 9) {
    return 'THCS';
  } else {
    return 'THPT';
  }
}

export const AGE_STYLE_OVERRIDE_OPTIONS: { id: AgeStyleOverride; label: string; desc: string }[] = [
  { id: 'Tự động', label: 'Tự động', desc: 'Tự động đồng bộ theo khối lớp học sinh' },
  { id: 'Dễ thương tiểu học', label: 'Dễ thương tiểu học', desc: 'Đường nét mềm mại, nhân vật đáng yêu cho lớp nhỏ' },
  { id: 'Cartoon giáo dục', label: 'Cartoon giáo dục', desc: 'Phong cách hoạt hình sinh động, chuẩn sách giáo khoa' },
  { id: 'Flat illustration', label: 'Flat illustration', desc: 'Minh hoạ phẳng hiện đại, tinh gọn và rõ ràng' },
  { id: 'Modern student', label: 'Modern student', desc: 'Phong cách thanh thiếu niên năng động, phù hợp THCS' },
  { id: 'Infographic', label: 'Infographic', desc: 'Khoa học, bố cục rõ nhánh, phù hợp THPT' },
  { id: 'Semi-realistic', label: 'Semi-realistic', desc: 'Bán thực tế nhẹ nhàng, chiều sâu tự nhiên' },
];

export function getAgeStyle(grade: GradeLevel, override?: AgeStyleOverride): string {
  if (override && override !== 'Tự động') {
    switch (override) {
      case 'Dễ thương tiểu học':
        return 'Target audience visual tone: Cute young primary cartoon style, large bold friendly illustrations, soft curved outlines, bright engaging pastel palette, strictly age-appropriate.';
      case 'Cartoon giáo dục':
        return 'Target audience visual tone: Colorful primary educational cartoon style, vibrant cheerful palette, expressive cheerful student characters, clear visual hierarchy.';
      case 'Flat illustration':
        return 'Target audience visual tone: Clean 2D flat illustration style, crisp geometric shapes, balanced minimalist palette, modern school vector art.';
      case 'Modern student':
        return 'Target audience visual tone: Modern student illustration style, cleaner lines, contemporary school aesthetic, relatable youth styling, mature and relatable.';
      case 'Infographic':
        return 'Target audience visual tone: Educational infographic style, clean academic diagram feeling, sleek layout, crisp typography and iconography, strictly avoiding preschool styling.';
      case 'Semi-realistic':
        return 'Target audience visual tone: Semi-realistic educational illustration, soft natural lighting, grounded realistic proportions, mature school environment.';
    }
  }

  const gradeNum = parseInt(grade.replace(/\D/g, ''), 10) || 1;

  if (gradeNum <= 2) {
    return 'Target audience visual tone: Cute young primary cartoon style for Grades 1–2 pupils, featuring large bold illustrations, friendly soft curves, bright engaging elements, and very little decoration complexity.';
  } else if (gradeNum <= 5) {
    return 'Target audience visual tone: Colorful primary educational cartoon style for Grades 3–5 pupils, vibrant cheerful palette, expressive student characters, clear visual hierarchy.';
  } else if (gradeNum <= 9) {
    return 'Target audience visual tone: Modern student illustration style for Grades 6–9 secondary pupils, cleaner lines, contemporary school aesthetic, relatable youth styling, less childish.';
  } else {
    return 'Target audience visual tone: Modern teen educational graphics for Grades 10–12 high school students, clean academic and infographic feeling, sleek layout, strictly avoiding preschool or childish styling.';
  }
}

