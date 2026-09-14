import { PromptGenerationParams } from '../types';
import { getAgeStyle } from '../lib/ageStyle';
import { assembleFinalCanvaPrompt } from '../lib/canvaPromptEngine';

function isVowel(char: string): boolean {
  return ['a', 'e', 'i', 'o', 'u'].includes(char.toLowerCase());
}

function adaptArticle(word: string): string {
  const clean = word.trim();
  const lower = clean.toLowerCase();

  const uncountables = [
    'rice', 'bread', 'milk', 'water', 'juice', 'meat', 'beef', 'pork', 'chicken', 'fish', 'lemonade', 'tea', 'coffee', 'soup'
  ];

  if (uncountables.includes(lower)) {
    return clean;
  }

  if (isVowel(clean.charAt(0))) {
    return `an ${clean}`;
  }

  return `a ${clean}`;
}

function adaptModelSentence(pattern: string, word: string): string {
  const articleForm = adaptArticle(word);
  const cleanWord = word.trim();

  if (pattern.toLowerCase().includes('like')) {
    return `I like ${cleanWord}.`;
  }
  if (pattern.toLowerCase().includes('have') || pattern.toLowerCase().includes('has')) {
    return `I have ${articleForm}.`;
  }
  if (pattern.toLowerCase().includes('want')) {
    return `I want ${articleForm}.`;
  }
  if (pattern.toLowerCase().includes('is a') || pattern.toLowerCase().includes('this is')) {
    return `This is ${articleForm}.`;
  }

  return `I like ${cleanWord}.`;
}

export function buildMindmapPrompt(params: PromptGenerationParams): string {
  const { grade, content, textbook, unitTitle, artStyle } = params;
  const subtype = content.mindmapSubtype || 'Dạng 1 — Theo chủ đề';
  const ageStyle = getAgeStyle(grade, params.ageStyleOverride || content.ageStyleOverride);
  const strictness = params.strictness || content.promptStrictness || 'Rất chặt';

  // ==========================================
  // DẠNG 1 — THEO CHỦ ĐỀ
  // ==========================================
  if (subtype === 'Dạng 1 — Theo chủ đề') {
    const title = content.mindmapType1Title?.trim() || 'Mindmap Topic';
    const centralTopic = content.mindmapType1Topic?.trim() || 'Topic';
    const modelPattern = content.mindmapType1Pattern?.trim() || 'pizza / a pizza / I like pizza.';
    const rawKeywords = content.mindmapType1Keywords?.trim() || '';

    const keywords = rawKeywords
      .split(/\n|,/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (keywords.length === 0) {
      return 'Lỗi Mindmap Dạng 1: Vui lòng nhập ít nhất 1 từ khoá (ví dụ: pizza, rice, bread, milk).';
    }

    const contentItems = [
      `Mindmap Title: "${title}"`,
      `Central Topic: "${centralTopic}"`,
      `Model Pattern: "${modelPattern}"`,
      `Branch Keywords (${keywords.length} total):`,
      ...keywords.map(
        (kw, idx) =>
          `${idx + 1}. Keyword: "${kw}" | Indefinite Article Form: "${adaptArticle(kw)}" | Adapted Sentence: "${adaptModelSentence(modelPattern, kw)}"`
      ),
    ].join('\n');

    const cardsDesc = keywords.map((kw, idx) => {
      const articleForm = adaptArticle(kw);
      const sentence = adaptModelSentence(modelPattern, kw);
      return [
        `  * Branch Card ${idx + 1} ("${kw}"):`,
        `    - Clear colorful illustration of "${kw}".`,
        `    - Word label: "${kw}" (bold lettering).`,
        `    - Article form: "${articleForm}".`,
        `    - Practice sentence: "${sentence}".`,
      ].join('\n');
    });

    const layoutDescription = [
      `Radial mindmap chart with centered topic and radiating branches:`,
      `Header: Centered title "${title}" in bold display font.`,
      `- CENTRAL TOPIC NODE: Prominent circular badge at the exact center featuring "${centralTopic}" with a vibrant thematic central icon.`,
      `- RADIATING BRANCH CARDS: Exactly ${keywords.length} branch cards evenly spaced around the center, connected by smooth pastel curved lines:`,
      ...cardsDesc,
    ].join('\n');

    return assembleFinalCanvaPrompt({
      create: `Create ONE colorful 16:9 primary-school English Topic Mindmap chart.`,
      curriculumContext: {
        textbook,
        grade,
        unitTitle,
      },
      content: contentItems,
      layout: layoutDescription,
      visuals: `Vibrant isolated illustrations for each keyword (${keywords.join(', ')}). Central thematic icon for "${centralTopic}". Soft pastel branch lines.`,
      style: `${artStyle} art style. ${ageStyle}. Pure white canvas (#FFFFFF), colorful node badges, sharp typography.`,
      exactCountRule: `EXACTLY ${keywords.length} branch cards. Do not add or remove cards.`,
      strictness,
    });
  }

  // ==========================================
  // DẠNG 2 — MỘT NHÂN VẬT
  // ==========================================
  if (subtype === 'Dạng 2 — Một nhân vật') {
    const pupilName = content.mindmapType2Name?.trim() || 'Pupil';
    const rawInfo = content.mindmapType2Info?.trim() || '';

    const infoLines = rawInfo
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (infoLines.length === 0) {
      return 'Lỗi Mindmap Dạng 2: Vui lòng nhập danh sách thông tin nhân vật (ví dụ: From: Vietnam, Age: 9, Class: 4A6, Hobby: riding a bike).';
    }

    const contentItems = [
      `Pupil Name: "${pupilName}"`,
      `Profile Information (${infoLines.length} items):`,
      ...infoLines.map((line, idx) => `${idx + 1}. ${line}`),
    ].join('\n');

    const boxesDesc = infoLines.map((line, idx) => {
      let titleTab = 'Info';
      let value = line;
      if (line.includes(':')) {
        const parts = line.split(':');
        titleTab = parts[0].trim();
        value = parts.slice(1).join(':').trim();
      }

      return [
        `  * Info Card ${idx + 1} [Title tab: "${titleTab}"]:`,
        `    - Clear miniature thematic illustration representing "${titleTab}: ${value}".`,
        `    - Supplied value clearly printed: "${value}".`,
        `    - Linked to central student by a smooth curved branch line.`,
      ].join('\n');
    });

    const layoutDescription = [
      `Single character profile mindmap layout:`,
      `- CENTER: Large, friendly, full-body school pupil illustration representing "${pupilName}".`,
      `- NAME HEADER: Stylish decorative name banner directly above the central pupil reading: "${pupilName}".`,
      `- SURROUNDING INFORMATION CARDS: Exactly ${infoLines.length} individual rectangular cards positioned neatly around the student:`,
      ...boxesDesc,
    ].join('\n');

    return assembleFinalCanvaPrompt({
      create: `Create ONE colorful 16:9 primary-school English Character Profile Mindmap for "${pupilName}".`,
      curriculumContext: {
        textbook,
        grade,
        unitTitle,
      },
      content: contentItems,
      layout: layoutDescription,
      visuals: `Friendly full-body school pupil character illustration standing at the center. Cohesive 2–4 pastel color palette for info badges.`,
      style: `${artStyle} art style. ${ageStyle}. Pristine white canvas (#FFFFFF), neat line-work, friendly classroom aesthetic.`,
      exactCountRule: `EXACTLY ${infoLines.length} information cards. Do not add or remove cards.`,
      strictness,
    });
  }

  // ==========================================
  // DẠNG 3 — NHIỀU NHÂN VẬT
  // ==========================================
  const topic = content.mindmapType3Topic?.trim() || 'Our Friends';
  const modelSentence = content.mindmapType3ModelPattern?.trim() || 'This is Lina. She is 7 years old. She is in class 2A1.';
  const rawChars = content.mindmapType3Characters?.trim() || '';

  const charLines = rawChars
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (charLines.length === 0) {
    return 'Lỗi Mindmap Dạng 3: Vui lòng nhập danh sách nhân vật (ví dụ: Lina / 7 / 2A1).';
  }

  const parsedCharacters = charLines.map((line, idx) => {
    const parts = line.split('/').map((p) => p.trim());
    return {
      index: idx + 1,
      name: parts[0] || `Student ${idx + 1}`,
      age: parts[1] || '',
      classCode: parts[2] || '',
    };
  });

  const contentItems = [
    `Worksheet Topic: "${topic}"`,
    `Model Sentence (Card 1): "${modelSentence}"`,
    `Characters (${parsedCharacters.length} total):`,
    ...parsedCharacters.map(
      (c) =>
        `Card ${c.index} (${c.index === 1 ? 'Model Card' : 'Practice Card'}): Name: "${c.name}", Age: "${c.age || 'N/A'}", Class: "${c.classCode || 'N/A'}"`
    ),
  ].join('\n');

  const cardsDesc = parsedCharacters.map((char, idx) => {
    if (idx === 0) {
      return [
        `CARD 1 — MODEL CARD (Character: "${char.name}"):`,
        `  - Highlighted with a special golden border badge reading "MODEL EXAMPLE".`,
        `  - Illustrated student avatar of "${char.name}" (Age ${char.age}, Class ${char.classCode}).`,
        `  - Full supplied model sentence: "${modelSentence}".`,
      ].join('\n');
    } else {
      const details = [];
      if (char.age) details.push(`Age: ${char.age}`);
      if (char.classCode) details.push(`Class: ${char.classCode}`);
      return [
        `CARD ${char.index} — PRACTICE CARD (Character: "${char.name}"):`,
        `  - Illustrated student avatar of "${char.name}".`,
        `  - Name clearly printed: "${char.name}".`,
        `  - Concise data only: ${details.join(' • ')}.`,
        `  - Neat blank speech bubble outline for students to practice speaking/writing.`,
      ].join('\n');
    }
  });

  const layoutDescription = [
    `Horizontal character set grid displaying EXACTLY ${parsedCharacters.length} PUPIL CARDS:`,
    `Header: Top centered title: "${topic}" in bold playful font.`,
    ...cardsDesc,
  ].join('\n');

  return assembleFinalCanvaPrompt({
    create: `Create ONE colorful 16:9 primary-school English Character Set worksheet.`,
    curriculumContext: {
      textbook,
      grade,
      unitTitle,
    },
    content: contentItems,
    layout: layoutDescription,
    visuals: `Friendly primary student avatars for each character (${parsedCharacters.map((c) => c.name).join(', ')}). Golden badge on Card 1.`,
    style: `${artStyle} art style. ${ageStyle}. Pure clean white background (#FFFFFF), sharp vector graphics.`,
    exactCountRule: `EXACTLY ${parsedCharacters.length} pupil cards. Do not add a fifth character or extra cards.`,
    additionalDoNots: [
      `never add a fifth character or unlisted student name (such as Sophie)`,
      `never invent unlisted classes (such as 5A3) or unsupplied ages`,
      `render EXACTLY the ${parsedCharacters.length} supplied pupil cards and no more`,
    ],
    strictness,
  });
}
