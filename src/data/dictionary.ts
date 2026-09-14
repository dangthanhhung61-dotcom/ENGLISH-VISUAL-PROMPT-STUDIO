// Standard dictionary for English Global Success Grades 1–12
// Provides standard IPA, Vietnamese meanings, and syntactic classifications (noun, action, sport)

export interface DictEntry {
  word: string;
  ipa: string;
  meaning: string;
  category: 'noun' | 'action' | 'sport';
}

export const VOCABULARY_DICTIONARY: Record<string, DictEntry> = {
  // Sports
  badminton: { word: 'badminton', ipa: '/ˈbæd.mɪn.tən/', meaning: 'môn cầu lông', category: 'sport' },
  football: { word: 'football', ipa: '/ˈfʊt.bɔːl/', meaning: 'môn bóng đá', category: 'sport' },
  soccer: { word: 'soccer', ipa: '/ˈsɒk.ər/', meaning: 'môn bóng đá', category: 'sport' },
  basketball: { word: 'basketball', ipa: '/ˈbɑː.skɪt.bɔːl/', meaning: 'môn bóng rổ', category: 'sport' },
  volleyball: { word: 'volleyball', ipa: '/ˈvɒl.i.bɔːl/', meaning: 'môn bóng chuyền', category: 'sport' },
  tennis: { word: 'tennis', ipa: '/ˈten.ɪs/', meaning: 'môn quần vợt', category: 'sport' },
  tabletennis: { word: 'table tennis', ipa: '/ˈteɪ.bəl ˌten.ɪs/', meaning: 'môn bóng bàn', category: 'sport' },
  swimming: { word: 'swimming', ipa: '/ˈswɪm.ɪŋ/', meaning: 'môn bơi lội', category: 'sport' },
  running: { word: 'running', ipa: '/ˈrʌn.ɪŋ/', meaning: 'chạy bộ', category: 'sport' },
  cycling: { word: 'cycling', ipa: '/ˈsaɪ.klɪŋ/', meaning: 'đạp xe', category: 'sport' },
  skating: { word: 'skating', ipa: '/ˈskeɪ.tɪŋ/', meaning: 'trượt patin', category: 'sport' },
  karate: { word: 'karate', ipa: '/kəˈrɑː.ti/', meaning: 'môn karate', category: 'sport' },
  judo: { word: 'judo', ipa: '/ˈdʒuː.dəʊ/', meaning: 'môn võ judo', category: 'sport' },
  aerobics: { word: 'aerobics', ipa: '/eəˈrəʊ.bɪks/', meaning: 'thể dục nhịp điệu', category: 'sport' },
  yoga: { word: 'yoga', ipa: '/ˈjəʊ.ɡə/', meaning: 'môn yoga', category: 'sport' },
  chess: { word: 'chess', ipa: '/tʃes/', meaning: 'môn cờ vua', category: 'sport' },

  // Actions / Verbs
  read: { word: 'read', ipa: '/riːd/', meaning: 'đọc sách', category: 'action' },
  write: { word: 'write', ipa: '/raɪt/', meaning: 'viết chữ', category: 'action' },
  draw: { word: 'draw', ipa: '/drɔː/', meaning: 'vẽ tranh', category: 'action' },
  paint: { word: 'paint', ipa: '/peɪnt/', meaning: 'tô màu / vẽ', category: 'action' },
  sing: { word: 'sing', ipa: '/sɪŋ/', meaning: 'hát', category: 'action' },
  dance: { word: 'dance', ipa: '/dɑːns/', meaning: 'nhảy múa', category: 'action' },
  listen: { word: 'listen', ipa: '/ˈlɪs.ən/', meaning: 'lắng nghe', category: 'action' },
  speak: { word: 'speak', ipa: '/spiːk/', meaning: 'nói', category: 'action' },
  talk: { word: 'talk', ipa: '/tɔːk/', meaning: 'trò chuyện', category: 'action' },
  play: { word: 'play', ipa: '/pleɪ/', meaning: 'chơi', category: 'action' },
  cook: { word: 'cook', ipa: '/kʊk/', meaning: 'nấu ăn', category: 'action' },
  eat: { word: 'eat', ipa: '/iːt/', meaning: 'ăn', category: 'action' },
  drink: { word: 'drink', ipa: '/drɪŋk/', meaning: 'uống', category: 'action' },
  sleep: { word: 'sleep', ipa: '/sliːp/', meaning: 'ngủ', category: 'action' },
  swim: { word: 'swim', ipa: '/swɪm/', meaning: 'bơi', category: 'action' },
  run: { word: 'run', ipa: '/rʌn/', meaning: 'chạy', category: 'action' },
  walk: { word: 'walk', ipa: '/wɔːk/', meaning: 'đi bộ', category: 'action' },
  jump: { word: 'jump', ipa: '/dʒʌmp/', meaning: 'nhảy', category: 'action' },
  skip: { word: 'skip', ipa: '/skɪp/', meaning: 'nhảy dây', category: 'action' },
  climb: { word: 'climb', ipa: '/klaɪm/', meaning: 'leo trèo', category: 'action' },
  fly: { word: 'fly', ipa: '/flaɪ/', meaning: 'bay', category: 'action' },
  ride: { word: 'ride', ipa: '/raɪd/', meaning: 'cưỡi / lái xe', category: 'action' },
  drive: { word: 'drive', ipa: '/draɪv/', meaning: 'lái xe ô tô', category: 'action' },
  wash: { word: 'wash', ipa: '/wɒʃ/', meaning: 'rửa / giặt', category: 'action' },
  clean: { word: 'clean', ipa: '/kliːn/', meaning: 'lau dọn', category: 'action' },
  study: { word: 'study', ipa: '/ˈstʌd.i/', meaning: 'học bài', category: 'action' },
  watch: { word: 'watch', ipa: '/wɒtʃ/', meaning: 'xem tivi', category: 'action' },
  help: { word: 'help', ipa: '/help/', meaning: 'giúp đỡ', category: 'action' },

  // School items / Nouns
  schoolbag: { word: 'school bag', ipa: '/ˈskuːl bæɡ/', meaning: 'cặp sách học sinh', category: 'noun' },
  book: { word: 'book', ipa: '/bʊk/', meaning: 'quyển sách', category: 'noun' },
  notebook: { word: 'notebook', ipa: '/ˈnəʊt.bʊk/', meaning: 'quyển vở', category: 'noun' },
  pen: { word: 'pen', ipa: '/pen/', meaning: 'cây bút mực', category: 'noun' },
  pencil: { word: 'pencil', ipa: '/ˈpen.səl/', meaning: 'cây bút chì', category: 'noun' },
  pencilcase: { word: 'pencil case', ipa: '/ˈpen.səl keɪs/', meaning: 'hộp bút', category: 'noun' },
  ruler: { word: 'ruler', ipa: '/ˈruː.lər/', meaning: 'cây thước kẻ', category: 'noun' },
  eraser: { word: 'eraser', ipa: '/ɪˈreɪ.zər/', meaning: 'cục tẩy', category: 'noun' },
  rubber: { word: 'rubber', ipa: '/ˈrʌb.ər/', meaning: 'cục tẩy', category: 'noun' },
  sharpener: { word: 'pencil sharpener', ipa: '/ˈpen.səl ˌʃɑː.pən.ər/', meaning: 'gọt bút chì', category: 'noun' },
  desk: { word: 'desk', ipa: '/desk/', meaning: 'bàn học', category: 'noun' },
  chair: { word: 'chair', ipa: '/tʃeər/', meaning: 'cái ghế', category: 'noun' },
  board: { word: 'board', ipa: '/bɔːd/', meaning: 'bảng lớp', category: 'noun' },
  computer: { word: 'computer', ipa: '/kəmˈpjuː.tər/', meaning: 'máy vi tính', category: 'noun' },
  clock: { word: 'clock', ipa: '/klɒk/', meaning: 'đồng hồ treo tường', category: 'noun' },
  map: { word: 'map', ipa: '/mæp/', meaning: 'bản đồ', category: 'noun' },

  // Food & Drinks / Nouns
  apple: { word: 'apple', ipa: '/ˈæp.əl/', meaning: 'quả táo', category: 'noun' },
  banana: { word: 'banana', ipa: '/bəˈnɑː.nə/', meaning: 'quả chuối', category: 'noun' },
  orange: { word: 'orange', ipa: '/ˈɒr.ɪndʒ/', meaning: 'quả cam', category: 'noun' },
  bread: { word: 'bread', ipa: '/bred/', meaning: 'bánh mì', category: 'noun' },
  rice: { word: 'rice', ipa: '/raɪs/', meaning: 'cơm / gạo', category: 'noun' },
  milk: { word: 'milk', ipa: '/mɪlk/', meaning: 'sữa tươi', category: 'noun' },
  water: { word: 'water', ipa: '/ˈwɔː.tər/', meaning: 'nước uống', category: 'noun' },
  juice: { word: 'juice', ipa: '/dʒuːs/', meaning: 'nước ép trái cây', category: 'noun' },
  pizza: { word: 'pizza', ipa: '/ˈpiːt.sə/', meaning: 'bánh pizza', category: 'noun' },
  chicken: { word: 'chicken', ipa: '/ˈtʃɪk.ɪn/', meaning: 'thịt gà', category: 'noun' },
  fish: { word: 'fish', ipa: '/fɪʃ/', meaning: 'con cá / món cá', category: 'noun' },
  beef: { word: 'beef', ipa: '/biːf/', meaning: 'thịt bò', category: 'noun' },
  noodles: { word: 'noodles', ipa: '/ˈnuː.dəlz/', meaning: 'mì / bún', category: 'noun' },
  egg: { word: 'egg', ipa: '/eɡ/', meaning: 'quả trứng', category: 'noun' },
  cake: { word: 'cake', ipa: '/keɪk/', meaning: 'bánh ngọt', category: 'noun' },
  icecream: { word: 'ice cream', ipa: '/ˌaɪs ˈkriːm/', meaning: 'kem', category: 'noun' },

  // Animals / Nouns
  cat: { word: 'cat', ipa: '/kæt/', meaning: 'con mèo', category: 'noun' },
  dog: { word: 'dog', ipa: '/dɒɡ/', meaning: 'con chó', category: 'noun' },
  bird: { word: 'bird', ipa: '/bɜːd/', meaning: 'con chim', category: 'noun' },
  rabbit: { word: 'rabbit', ipa: '/ˈræb.ɪt/', meaning: 'con thỏ', category: 'noun' },
  duck: { word: 'duck', ipa: '/dʌk/', meaning: 'con vịt', category: 'noun' },
  elephant: { word: 'elephant', ipa: '/ˈel.ɪ.fənt/', meaning: 'con voi', category: 'noun' },
  tiger: { word: 'tiger', ipa: '/ˈtaɪ.ɡər/', meaning: 'con hổ', category: 'noun' },
  lion: { word: 'lion', ipa: '/ˈlaɪ.ən/', meaning: 'con sư tử', category: 'noun' },
  monkey: { word: 'monkey', ipa: '/ˈmʌŋ.ki/', meaning: 'con khỉ', category: 'noun' },
  bear: { word: 'bear', ipa: '/beər/', meaning: 'con gấu', category: 'noun' },
  horse: { word: 'horse', ipa: '/hɔːs/', meaning: 'con ngựa', category: 'noun' },
  hamster: { word: 'hamster', ipa: '/ˈhæm.stər/', meaning: 'chuột hamster', category: 'noun' },

  // Transport & Vehicles / Nouns
  bike: { word: 'bike', ipa: '/baɪk/', meaning: 'xe đạp', category: 'noun' },
  bicycle: { word: 'bicycle', ipa: '/ˈbaɪ.sɪ.kəl/', meaning: 'xe đạp', category: 'noun' },
  car: { word: 'car', ipa: '/kɑːr/', meaning: 'xe ô tô', category: 'noun' },
  bus: { word: 'bus', ipa: '/bʌs/', meaning: 'xe buýt', category: 'noun' },
  train: { word: 'train', ipa: '/treɪn/', meaning: 'tàu hoả', category: 'noun' },
  plane: { word: 'plane', ipa: '/pleɪn/', meaning: 'máy bay', category: 'noun' },
  boat: { word: 'boat', ipa: '/bəʊt/', meaning: 'thuyền', category: 'noun' },
  motorbike: { word: 'motorbike', ipa: '/ˈməʊ.tə.baɪk/', meaning: 'xe máy', category: 'noun' },

  // Family & People
  family: { word: 'family', ipa: '/ˈfæm.əl.i/', meaning: 'gia đình', category: 'noun' },
  father: { word: 'father', ipa: '/ˈfɑː.ðər/', meaning: 'bố / cha', category: 'noun' },
  mother: { word: 'mother', ipa: '/ˈmʌð.ər/', meaning: 'mẹ', category: 'noun' },
  brother: { word: 'brother', ipa: '/ˈbrʌð.ər/', meaning: 'anh / em trai', category: 'noun' },
  sister: { word: 'sister', ipa: '/ˈsɪs.tər/', meaning: 'chị / em gái', category: 'noun' },
  baby: { word: 'baby', ipa: '/ˈbeɪ.bi/', meaning: 'em bé', category: 'noun' },
  pupil: { word: 'pupil', ipa: '/ˈpjuː.pəl/', meaning: 'học sinh', category: 'noun' },
  student: { word: 'student', ipa: '/ˈstjuː.dənt/', meaning: 'học sinh', category: 'noun' },
  teacher: { word: 'teacher', ipa: '/ˈtiː.tʃər/', meaning: 'giáo viên', category: 'noun' },
  doctor: { word: 'doctor', ipa: '/ˈdɒk.tər/', meaning: 'bác sĩ', category: 'noun' },
  nurse: { word: 'nurse', ipa: '/nɜːs/', meaning: 'y tá', category: 'noun' },
  farmer: { word: 'farmer', ipa: '/ˈfɑː.mər/', meaning: 'nông dân', category: 'noun' },
  driver: { word: 'driver', ipa: '/ˈdraɪ.vər/', meaning: 'tài xế', category: 'noun' },
  cooker: { word: 'cook', ipa: '/kʊk/', meaning: 'đầu bếp', category: 'noun' },
};

export function lookupWord(rawWord: string): DictEntry {
  const clean = rawWord.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '');
  const key = clean.replace(/\s+/g, '');

  if (VOCABULARY_DICTIONARY[key]) {
    return VOCABULARY_DICTIONARY[key];
  }

  // Check if it starts or matches any dictionary word
  for (const entry of Object.values(VOCABULARY_DICTIONARY)) {
    if (entry.word.toLowerCase() === clean) {
      return entry;
    }
  }

  // Heuristic classification
  let category: 'noun' | 'action' | 'sport' = 'noun';
  if (
    clean.includes('ball') ||
    clean.includes('play') ||
    clean.includes('skat') ||
    clean.includes('swim') ||
    clean.includes('sport')
  ) {
    category = 'sport';
  } else if (
    clean.endsWith('ing') ||
    clean.startsWith('do ') ||
    clean.startsWith('make ') ||
    ['run', 'jump', 'walk', 'sing', 'dance', 'read', 'write', 'draw', 'eat', 'drink'].includes(clean)
  ) {
    category = 'action';
  }

  return {
    word: rawWord.trim(),
    ipa: `/${rawWord.trim().toLowerCase()}/`,
    meaning: rawWord.trim(),
    category,
  };
}
