export interface Verse {
  surahNumber: number;
  ayahNumber: number;
  text: string;
  englishTranslation?: string;
  transliteration?: string;
  juz?: number;
  location?: 'Meccan' | 'Medinan';
  sajda?: boolean;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishMeaning: string;
  numberOfAyahs: number;
  location: 'Meccan' | 'Medinan' | 'both';
  revelationOrder: number;
  firstVerse?: string;
}

export interface QuranDatabase {
  surahs: Surah[];
  verses: Verse[];
  totalSurahs: number;
  totalAyahs: number;
}

export interface VerseMatch {
  verse: Verse;
  similarity: number;
  startTime: number;
  endTime: number;
  confidence: number;
  alternativeMatches?: Verse[];
}

export interface SegmentWithVerse {
  start: number;
  end: number;
  text: string;
  verse?: Verse;
  verseMatch?: VerseMatch;
  confidence: number;
}

class QuranService {
  private apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  private cachedDatabase: QuranDatabase | null = null;

  async loadQuranDatabase(): Promise<QuranDatabase> {
    if (this.cachedDatabase) {
      return this.cachedDatabase;
    }

    const response = await fetch(`${this.apiBase}/quran/database`);
    
    if (!response.ok) {
      throw new Error('Failed to load Quran database');
    }

    const database = await response.json();
    this.cachedDatabase = database;
    return database;
  }

  async getAllSurahs(): Promise<Surah[]> {
    const database = await this.loadQuranDatabase();
    return database.surahs;
  }

  async getSurah(surahNumber: number): Promise<Surah | null> {
    const database = await this.loadQuranDatabase();
    return database.surahs.find(s => s.number === surahNumber) || null;
  }

  async getVerses(surahNumber: number): Promise<Verse[]> {
    const database = await this.loadQuranDatabase();
    return database.verses.filter(v => v.surahNumber === surahNumber);
  }

  async getVerse(surahNumber: number, ayahNumber: number): Promise<Verse | null> {
    const database = await this.loadQuranDatabase();
    return database.verses.find(
      v => v.surahNumber === surahNumber && v.ayahNumber === ayahNumber
    ) || null;
  }

  async matchSegmentToVerse(text: string): Promise<VerseMatch> {
    const response = await fetch(`${this.apiBase}/quran/match-verse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to match verse');
    }

    return response.json();
  }

  async matchTranscriptionToVerses(segments: any[]): Promise<SegmentWithVerse[]> {
    const response = await fetch(`${this.apiBase}/quran/match-transcription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ segments }),
    });

    if (!response.ok) {
      throw new Error('Failed to match transcription to verses');
    }

    return response.json();
  }

  async searchVerse(text: string, limit: number = 10): Promise<VerseMatch[]> {
    const response = await fetch(`${this.apiBase}/quran/search-verse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, limit }),
    });

    if (!response.ok) {
      throw new Error('Failed to search verses');
    }

    return response.json();
  }

  async getVerseAudio(surah: number, ayah: number, reciter: string = 'mishari'): Promise<string> {
    const response = await fetch(`${this.apiBase}/quran/verse-audio?surah=${surah}&ayah=${ayah}&reciter=${reciter}`);
    
    if (!response.ok) {
      throw new Error('Failed to get verse audio');
    }

    const data = await response.json();
    return data.audioUrl;
  }

  clearCache(): void {
    this.cachedDatabase = null;
  }
}

export const quranService = new QuranService();