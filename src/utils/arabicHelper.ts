/**
 * Check if text contains Arabic characters
 */
export function isArabicText(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
}

/**
 * Get Arabic text direction
 */
export function getArabicDirection(text: string): 'rtl' | 'ltr' {
  return isArabicText(text) ? 'rtl' : 'ltr';
}

/**
 * Arabic number conversion (Western to Eastern)
 */
export function toArabicNumerals(num: number | string): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (digit) => arabicNumerals[parseInt(digit)]);
}

/**
 * Convert Eastern Arabic numerals to Western
 */
export function fromArabicNumerals(text: string): string {
  const westernNumerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  let result = text;
  for (let i = 0; i < arabicNumerals.length; i++) {
    result = result.replace(new RegExp(arabicNumerals[i], 'g'), westernNumerals[i]);
  }
  
  return result;
}

/**
 * Get Arabic month name
 */
export function getArabicMonth(monthIndex: number): string {
  const months = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];
  return months[monthIndex] || '';
}

/**
 * Format date in Arabic
 */
export function formatArabicDate(date: Date): string {
  const day = toArabicNumerals(date.getDate());
  const month = getArabicMonth(date.getMonth());
  const year = toArabicNumerals(date.getFullYear());
  return `${day} ${month} ${year}`;
}

/**
 * Format time in Arabic
 */
export function formatArabicTime(date: Date): string {
  const hours = toArabicNumerals(date.getHours().toString().padStart(2, '0'));
  const minutes = toArabicNumerals(date.getMinutes().toString().padStart(2, '0'));
  return `${hours}:${minutes}`;
}

/**
 * Format duration in Arabic
 */
export function formatArabicDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${toArabicNumerals(hours)} ساعة ${toArabicNumerals(minutes)} دقيقة`;
  } else if (minutes > 0) {
    return `${toArabicNumerals(minutes)} دقيقة ${toArabicNumerals(secs)} ثانية`;
  } else {
    return `${toArabicNumerals(secs)} ثانية`;
  }
}

/**
 * Get Arabic greeting based on time of day
 */
export function getArabicGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'صباح الخير';
  } else if (hour >= 12 && hour < 17) {
    return 'مساء الخير';
  } else if (hour >= 17 && hour < 21) {
    return 'مساء الخير';
  } else {
    return 'طاب مساؤك';
  }
}

/**
 * Check if character is an Arabic letter
 */
export function isArabicLetter(char: string): boolean {
  const code = char.charCodeAt(0);
  return (code >= 0x0600 && code <= 0x06FF) ||
         (code >= 0x0750 && code <= 0x077F) ||
         (code >= 0x08A0 && code <= 0x08FF) ||
         (code >= 0xFB50 && code <= 0xFDFF) ||
         (code >= 0xFE70 && code <= 0xFEFF);
}

/**
 * Remove Arabic diacritics (Tashkeel)
 */
export function removeArabicDiacritics(text: string): string {
  const diacritics = /[\u064B-\u065F\u0670]/g;
  return text.replace(diacritics, '');
}

/**
 * Get Arabic ligature characters
 */
export function getArabicLigatures(): Record<string, string> {
  return {
    'لل': 'ﻟ',
    'لأ': 'ﻷ',
    'لا': 'ﻸ',
    'لآ': 'ﻵ',
    'بإ': 'ﺒ',
    'فإ': 'ﻔ',
    'كإ': 'ﻜ',
    'لإ': 'ﻠ',
    'مإ': 'ﻤ',
  };
}

/**
 * Apply Arabic ligatures
 */
export function applyArabicLigatures(text: string): string {
  const ligatures = getArabicLigatures();
  let result = text;
  
  for (const [original, ligature] of Object.entries(ligatures)) {
    result = result.replace(new RegExp(original, 'g'), ligature);
  }
  
  return result;
}

/**
 * Common Quranic phrases
 */
export const QURANIC_PHRASES = {
  bismillah: 'بسم الله الرحمن الرحيم',
  alhamdulillah: 'الحمد لله',
  subhanAllah: 'سبحان الله',
  allahuAkbar: 'الله أكبر',
  laIlahaIllaAllah: 'لا إله إلا الله',
  jazakAllahKhair: 'جزاك الله خيراً',
  inshaAllah: 'إن شاء الله',
  mashallah: 'ما شاء الله',
  astaghfirullah: 'أستغفر الله',
  salam: 'السلام عليكم',
  salamResponse: 'وعليكم السلام',
};

/**
 * Quran surah names
 */
export const SURAH_NAMES = [
  'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة',
  'الأنعام', 'الأعراف', 'الأنفال', 'التوبة', 'يونس',
  'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر',
  'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه',
  'الأنبياء', 'الحج', 'المؤمنون', 'النور', 'الفرقان',
  'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم',
  'لقمان', 'السجدة', 'الأحزاب', 'سبأ', 'فاطر',
  'يس', 'الصافات', 'ص', 'الزمر', 'غافر',
  'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية',
  'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق',
  'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن',
  'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة',
  'الصف', 'الجمعة', 'المنافقون', 'التغابن', 'الطلاق',
  'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج',
  'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة',
  'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس',
  'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج',
  'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد',
  'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين',
  'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات',
  'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل',
  'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر',
  'المسد', 'الإخلاص', 'الفلق', 'الناس',
];

/**
 * Get surah name by number
 */
export function getSurahName(number: number): string {
  if (number < 1 || number > 114) return '';
  return SURAH_NAMES[number - 1];
}

/**
 * Common Islamic design colors
 */
export const ISLAMIC_COLORS = {
  emerald: '#10b981',
  emeraldLight: '#34d399',
  emeraldDark: '#047857',
  gold: '#f59e0b',
  goldLight: '#fbbf24',
  goldDark: '#d97706',
  teal: '#14b8a6',
  tealLight: '#2dd4bf',
  tealDark: '#0f766e',
  navy: '#1e3a5f',
  navyLight: '#334e68',
  navyDark: '#102a43',
  cream: '#fef3c7',
  sand: '#fde68a',
  olive: '#84cc16',
};

/**
 * Arabic font families
 */
export const ARABIC_FONTS = [
  'Amiri',
  'Cairo',
  'Noto Naskh Arabic',
  'Scheherazade New',
  'Lateef',
  'Aref Ruqaa',
  'Reem Kufi',
  'Tajawal',
] as const;
