import {
  MaterialTypeInfo,
  CurriculumUnit,
  GradeCurriculum,
  CurriculumStatus,
  TextbookVocabItem,
} from '../types';

export { type CurriculumUnit, type GradeCurriculum };

export const MATERIAL_TYPES: MaterialTypeInfo[] = [
  {
    id: 'vocabulary',
    name: 'Vocabulary',
    helperLabel: 'Thẻ từ vựng (16:9)',
    description: 'Thẻ từ vựng 16:9, hình bên trái, khung từ vựng + IPA + nghĩa bên phải',
    defaultAspectRatio: '16:9',
    badge: 'Flashcards 16:9',
  },
  {
    id: 'tracing',
    name: 'Tracing',
    helperLabel: 'Phiếu luyện viết (A4 dọc)',
    description: 'Phiếu A4 dọc luyện viết chữ cái, câu mẫu với dòng kẻ và nét đứt mờ',
    defaultAspectRatio: '3:4',
    badge: 'Worksheet A4',
  },
  {
    id: 'exercise',
    name: 'Exercise',
    helperLabel: 'Bài tập 8 ô (16:9)',
    description: 'Bố cục đúng 8 thẻ bài tập đánh số 1–8 đối xứng (2 hàng x 4 cột)',
    defaultAspectRatio: '16:9',
    badge: '8 Cards 16:9',
  },
  {
    id: 'speakingWriting',
    name: 'Speaking / Writing',
    helperLabel: 'Nói và viết (16:9)',
    description: 'Phía trái 45% nhân vật và hộp thông tin, phía phải 55% câu viết điền khuyết',
    defaultAspectRatio: '16:9',
    badge: 'Dual Zone 16:9',
  },
  {
    id: 'speakingReading',
    name: 'Speaking / Reading',
    helperLabel: 'Nói / đọc hình (16:9)',
    description: 'Nhân vật bên trái 25%, bảng 4–8 hàng ngang thay thế từ trong ngoặc bằng icon',
    defaultAspectRatio: '16:9',
    badge: 'Visual Reader 16:9',
  },
  {
    id: 'mindmap',
    name: 'Mindmap',
    helperLabel: 'Sơ đồ tư duy (16:9)',
    description: '3 dạng sơ đồ: Theo chủ đề, Một nhân vật, hoặc Nhiều nhân vật',
    defaultAspectRatio: '16:9',
    badge: 'Mindmap 16:9',
  },
];

export const GRADE_LIST = [
  'Lớp 1',
  'Lớp 2',
  'Lớp 3',
  'Lớp 4',
  'Lớp 5',
  'Lớp 6',
  'Lớp 7',
  'Lớp 8',
  'Lớp 9',
  'Lớp 10',
  'Lớp 11',
  'Lớp 12',
] as const;

function makeUnit(
  grade: number,
  unit: number,
  title: string,
  data?: {
    textbookVocabulary?: TextbookVocabItem[];
    textbookPatterns?: string[];
    curriculumStatus?: CurriculumStatus;
  }
): CurriculumUnit {
  const textbookVocabulary = data?.textbookVocabulary || [];
  const textbookPatterns = data?.textbookPatterns || [];
  const curriculumStatus =
    data?.curriculumStatus ||
    (textbookVocabulary.length > 0 ? 'verified' : 'unit-title-only');

  return {
    grade,
    unit,
    title,
    textbookVocabulary,
    textbookPatterns,
    curriculumStatus,
    vocabulary: textbookVocabulary.map((v) => v.word),
    sentencePatterns: textbookPatterns,
  };
}

export const GLOBAL_SUCCESS_CURRICULUM: GradeCurriculum[] = [
  {
    grade: 1,
    units: [
      makeUnit(1, 1, 'In the school playground'),
      makeUnit(1, 2, 'In the dining room'),
      makeUnit(1, 3, 'At the street market'),
      makeUnit(1, 4, 'In the bedroom'),
      makeUnit(1, 5, 'At the fish and chip shop'),
      makeUnit(1, 6, 'In the classroom'),
      makeUnit(1, 7, 'In the garden'),
      makeUnit(1, 8, 'In the park'),
      makeUnit(1, 9, 'In the shop'),
      makeUnit(1, 10, 'At the zoo'),
      makeUnit(1, 11, 'At the bus stop'),
      makeUnit(1, 12, 'At the lake'),
      makeUnit(1, 13, 'In the school canteen'),
      makeUnit(1, 14, 'In the toy shop'),
      makeUnit(1, 15, 'At the football match'),
      makeUnit(1, 16, 'At home'),
    ],
  },
  {
    grade: 2,
    units: [
      // UNIT 1: VERIFIED
      makeUnit(2, 1, 'At my birthday party', {
        textbookVocabulary: [
          { word: 'pasta', vietnamese: 'mì Ý', ipa: '/ˈpæs.tə/' },
          { word: 'popcorn', vietnamese: 'bắp rang bơ', ipa: '/ˈpɒp.kɔːn/' },
          { word: 'pizza', vietnamese: 'bánh pizza', ipa: '/ˈpiːt.sə/' },
          { word: 'birthday', vietnamese: 'sinh nhật', ipa: '/ˈbɜːθ.deɪ/' },
          { word: 'party', vietnamese: 'bữa tiệc', ipa: '/ˈpɑː.ti/' },
        ],
        textbookPatterns: [
          'The popcorn is yummy.',
          'The pasta is yummy.',
          'The pizza is yummy.',
          'I like pizza.',
          'I like popcorn.',
          'I like pasta.',
          "It's my birthday party.",
        ],
        curriculumStatus: 'verified',
      }),
      // UNIT 2: VERIFIED
      makeUnit(2, 2, 'In the backyard', {
        textbookVocabulary: [
          { word: 'kite', vietnamese: 'con diều', ipa: '/kaɪt/' },
          { word: 'bike', vietnamese: 'xe đạp', ipa: '/baɪk/' },
          { word: 'kitten', vietnamese: 'mèo con', ipa: '/ˈkɪt.ən/' },
        ],
        textbookPatterns: [
          'Is she flying a kite?',
          'Yes, she is.',
          'Is he riding a bike?',
          "No, he isn't.",
          'He is playing with a kitten.',
          'I see a kite.',
        ],
        curriculumStatus: 'verified',
      }),
      // UNIT 3: VERIFIED
      makeUnit(2, 3, 'At the seaside', {
        textbookVocabulary: [
          { word: 'sail', vietnamese: 'cánh buồm', ipa: '/seɪl/' },
          { word: 'sand', vietnamese: 'bãi cát', ipa: '/sænd/' },
          { word: 'sea', vietnamese: 'biển', ipa: '/siː/' },
        ],
        textbookPatterns: [
          "Let's look at the sail.",
          "Let's look at the sea.",
          "Let's look at the sand.",
          'I can see the sail.',
          'I can see the sea.',
          'I can see the sand.',
          "We're at the seaside.",
        ],
        curriculumStatus: 'verified',
      }),
      // UNIT 4: VERIFIED
      makeUnit(2, 4, 'In the countryside', {
        textbookVocabulary: [
          { word: 'rainbow', vietnamese: 'cầu vồng', ipa: '/ˈreɪn.bəʊ/' },
          { word: 'river', vietnamese: 'dòng sông', ipa: '/ˈrɪv.ər/' },
          { word: 'road', vietnamese: 'con đường', ipa: '/rəʊd/' },
        ],
        textbookPatterns: [
          'What can you see?',
          'I can see a rainbow.',
          'I can see a river.',
          'I can see a road.',
          "Let's look at the road.",
          "Let's look at the rainbow.",
        ],
        curriculumStatus: 'verified',
      }),
      makeUnit(2, 5, 'In the classroom'),
      makeUnit(2, 6, 'On the farm'),
      makeUnit(2, 7, 'In the kitchen'),
      makeUnit(2, 8, 'In the village'),
      makeUnit(2, 9, 'In the grocery store'),
      makeUnit(2, 10, 'At the zoo'),
      makeUnit(2, 11, 'In the playground'),
      makeUnit(2, 12, 'At the cafe'),
      makeUnit(2, 13, 'In the maths class'),
      makeUnit(2, 14, 'At home'),
      makeUnit(2, 15, 'In the clothes shop'),
      makeUnit(2, 16, 'At the campsite'),
    ],
  },
  {
    grade: 3,
    units: [
      makeUnit(3, 1, 'Hello'),
      makeUnit(3, 2, 'Our names'),
      makeUnit(3, 3, 'Our friends'),
      makeUnit(3, 4, 'Our bodies'),
      makeUnit(3, 5, 'My hobbies'),
      makeUnit(3, 6, 'Our school'),
      makeUnit(3, 7, 'Classroom instructions'),
      makeUnit(3, 8, 'My school things'),
      makeUnit(3, 9, 'Colours'),
      makeUnit(3, 10, 'Break time activities'),
      makeUnit(3, 11, 'My family'),
      makeUnit(3, 12, 'Jobs'),
      makeUnit(3, 13, 'My house'),
      makeUnit(3, 14, 'My bedroom'),
      makeUnit(3, 15, 'At the dining table'),
      makeUnit(3, 16, 'My pets'),
      makeUnit(3, 17, 'Our toys'),
      makeUnit(3, 18, 'Playing and doing'),
      makeUnit(3, 19, 'Outdoor activities'),
      makeUnit(3, 20, 'At the zoo'),
    ],
  },
  {
    grade: 4,
    units: [
      makeUnit(4, 1, 'My friends'),
      makeUnit(4, 2, 'Time and daily routines'),
      makeUnit(4, 3, 'My week'),
      makeUnit(4, 4, 'My birthday party'),
      makeUnit(4, 5, 'Things we can do'),
      makeUnit(4, 6, 'Our school facilities'),
      makeUnit(4, 7, 'Our timetable'),
      makeUnit(4, 8, 'My favourite subjects'),
      makeUnit(4, 9, 'Our sports day'),
      makeUnit(4, 10, 'Our summer holidays'),
      makeUnit(4, 11, 'My home'),
      makeUnit(4, 12, 'Jobs'),
      makeUnit(4, 13, 'Appearance'),
      makeUnit(4, 14, 'Daily activities'),
      makeUnit(4, 15, "My family's weekends"),
      makeUnit(4, 16, 'Weather'),
      makeUnit(4, 17, 'In the city'),
      makeUnit(4, 18, 'At the shopping centre'),
      makeUnit(4, 19, 'The animal world'),
      makeUnit(4, 20, 'At summer camp'),
    ],
  },
  {
    grade: 5,
    units: [
      makeUnit(5, 1, 'All about me'),
      makeUnit(5, 2, 'Our homes'),
      makeUnit(5, 3, 'My foreign friends'),
      makeUnit(5, 4, 'Our free-time activities'),
      makeUnit(5, 5, 'My future job'),
      makeUnit(5, 6, 'Our school rooms'),
      makeUnit(5, 7, 'Our favourite school activities'),
      makeUnit(5, 8, 'In our classroom'),
      makeUnit(5, 9, 'Our outdoor activities'),
      makeUnit(5, 10, 'Our school trip'),
      makeUnit(5, 11, 'Family time'),
      makeUnit(5, 12, 'Our Tet holiday'),
      makeUnit(5, 13, 'Our special days'),
      makeUnit(5, 14, 'Staying healthy'),
      makeUnit(5, 15, 'Our health'),
      makeUnit(5, 16, 'Seasons and the weather'),
      makeUnit(5, 17, 'Stories for children'),
      makeUnit(5, 18, 'Means of transport'),
      makeUnit(5, 19, 'Places of interest'),
      makeUnit(5, 20, 'Our summer holiday'),
    ],
  },
  {
    grade: 6,
    units: [
      makeUnit(6, 1, 'My new school'),
      makeUnit(6, 2, 'My house'),
      makeUnit(6, 3, 'My friends'),
      makeUnit(6, 4, 'My neighbourhood'),
      makeUnit(6, 5, 'Natural wonders of Viet Nam'),
      makeUnit(6, 6, 'Our Tet holiday'),
      makeUnit(6, 7, 'Television'),
      makeUnit(6, 8, 'Sports and games'),
      makeUnit(6, 9, 'Cities of the world'),
      makeUnit(6, 10, 'Our houses in the future'),
      makeUnit(6, 11, 'Our greener world'),
      makeUnit(6, 12, 'Robots'),
    ],
  },
  {
    grade: 7,
    units: [
      makeUnit(7, 1, 'Hobbies'),
      makeUnit(7, 2, 'Healthy living'),
      makeUnit(7, 3, 'Community service'),
      makeUnit(7, 4, 'Music and arts'),
      makeUnit(7, 5, 'Food and drink'),
      makeUnit(7, 6, 'A visit to a school'),
      makeUnit(7, 7, 'Traffic'),
      makeUnit(7, 8, 'Films'),
      makeUnit(7, 9, 'Festivals around the world'),
      makeUnit(7, 10, 'Energy sources'),
      makeUnit(7, 11, 'Travelling in the future'),
      makeUnit(7, 12, 'English speaking countries'),
    ],
  },
  {
    grade: 8,
    units: [
      makeUnit(8, 1, 'Leisure time'),
      makeUnit(8, 2, 'Life in the countryside'),
      makeUnit(8, 3, 'Teenagers'),
      makeUnit(8, 4, 'Ethnic groups of Viet Nam'),
      makeUnit(8, 5, 'Our customs and traditions'),
      makeUnit(8, 6, 'Lifestyles'),
      makeUnit(8, 7, 'Environmental protection'),
      makeUnit(8, 8, 'Shopping'),
      makeUnit(8, 9, 'Natural disasters'),
      makeUnit(8, 10, 'Communication in the future'),
      makeUnit(8, 11, 'Science and technology'),
      makeUnit(8, 12, 'Life on other planets'),
    ],
  },
  {
    grade: 9,
    units: [
      makeUnit(9, 1, 'Local community'),
      makeUnit(9, 2, 'City life'),
      makeUnit(9, 3, 'Healthy living for teens'),
      makeUnit(9, 4, 'Remembering the past'),
      makeUnit(9, 5, 'Our experiences'),
      makeUnit(9, 6, 'Vietnamese lifestyle: then and now'),
      makeUnit(9, 7, 'Natural wonders of the world'),
      makeUnit(9, 8, 'Tourism'),
      makeUnit(9, 9, 'World Englishes'),
      makeUnit(9, 10, 'Planet Earth'),
      makeUnit(9, 11, 'Electronic devices'),
      makeUnit(9, 12, 'Career choices'),
    ],
  },
  {
    grade: 10,
    units: [
      makeUnit(10, 1, 'Family life'),
      makeUnit(10, 2, 'Humans and the environment'),
      makeUnit(10, 3, 'Music'),
      makeUnit(10, 4, 'For a better community'),
      makeUnit(10, 5, 'Inventions'),
      makeUnit(10, 6, 'Gender equality'),
      makeUnit(10, 7, 'Viet Nam and international organisations'),
      makeUnit(10, 8, 'New ways to learn'),
      makeUnit(10, 9, 'Protecting the environment'),
      makeUnit(10, 10, 'Ecotourism'),
    ],
  },
  {
    grade: 11,
    units: [
      makeUnit(11, 1, 'A long and healthy life'),
      makeUnit(11, 2, 'The generation gap'),
      makeUnit(11, 3, 'Cities of the future'),
      makeUnit(11, 4, 'ASEAN and Viet Nam'),
      makeUnit(11, 5, 'Global warming'),
      makeUnit(11, 6, 'Preserving our heritage'),
      makeUnit(11, 7, 'Education options for school-leavers'),
      makeUnit(11, 8, 'Becoming independent'),
      makeUnit(11, 9, 'Social issues'),
      makeUnit(11, 10, 'The ecosystem'),
    ],
  },
  {
    grade: 12,
    units: [
      makeUnit(12, 1, 'Life stories we admire'),
      makeUnit(12, 2, 'A multicultural world'),
      makeUnit(12, 3, 'Green living'),
      makeUnit(12, 4, 'Urbanisation'),
      makeUnit(12, 5, 'The world of work'),
      makeUnit(12, 6, 'Artificial intelligence'),
      makeUnit(12, 7, 'The world of mass media'),
      makeUnit(12, 8, 'Wildlife conservation'),
      makeUnit(12, 9, 'Career paths'),
      makeUnit(12, 10, 'Lifelong learning'),
    ],
  },
];

export function getGrades(): number[] {
  return GLOBAL_SUCCESS_CURRICULUM.map((g) => g.grade);
}

export function getUnits(grade: number): CurriculumUnit[] {
  const item = GLOBAL_SUCCESS_CURRICULUM.find((g) => g.grade === grade);
  return item ? item.units : [];
}

export function getUnit(grade: number, unit: number): CurriculumUnit | undefined {
  const units = getUnits(grade);
  return units.find((u) => u.unit === unit);
}

export function searchUnits(query: string): { grade: number; unit: CurriculumUnit }[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const results: { grade: number; unit: CurriculumUnit }[] = [];
  for (const gc of GLOBAL_SUCCESS_CURRICULUM) {
    for (const u of gc.units) {
      const matchTitle = u.title.toLowerCase().includes(trimmed);
      const matchUnitStr = `unit ${u.unit}`.includes(trimmed);
      const matchExactUnit = u.unit.toString() === trimmed;
      if (matchTitle || matchUnitStr || matchExactUnit) {
        results.push({ grade: gc.grade, unit: u });
      }
    }
  }
  return results;
}

export function getNextUnit(grade: number, unit: number): CurriculumUnit | undefined {
  const units = getUnits(grade);
  const currentIndex = units.findIndex((u) => u.unit === unit);
  if (currentIndex >= 0 && currentIndex < units.length - 1) {
    return units[currentIndex + 1];
  }
  return undefined;
}

export function getPreviousUnit(grade: number, unit: number): CurriculumUnit | undefined {
  const units = getUnits(grade);
  const currentIndex = units.findIndex((u) => u.unit === unit);
  if (currentIndex > 0) {
    return units[currentIndex - 1];
  }
  return undefined;
}

export const EXPECTED_GRADE_UNIT_COUNTS: Record<number, number> = {
  1: 16,
  2: 16,
  3: 20,
  4: 20,
  5: 20,
  6: 12,
  7: 12,
  8: 12,
  9: 12,
  10: 10,
  11: 10,
  12: 10,
};

export function validateCurriculumDatabase(): {
  valid: boolean;
  errors: string[];
  counts: Record<number, number>;
} {
  const errors: string[] = [];
  const counts: Record<number, number> = {};

  for (const grade of getGrades()) {
    const units = getUnits(grade);
    counts[grade] = units.length;
    const expected = EXPECTED_GRADE_UNIT_COUNTS[grade];
    if (units.length !== expected) {
      errors.push(`Grade ${grade}: expected ${expected} units, got ${units.length}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    counts,
  };
}

// Development validation execution
if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
  const validation = validateCurriculumDatabase();
  if (!validation.valid) {
    console.error('Validation error in Global Success database:', validation.errors);
  }
}
