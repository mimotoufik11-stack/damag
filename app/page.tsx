'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function Home() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [appVersion, setAppVersion] = useState<string>('');

  useEffect(() => {
    fetchSurahs();
    // Check if running in Electron
    if (typeof window !== 'undefined' && (window as Window & { electron?: { getAppVersion: () => Promise<string> } }).electron) {
      (window as Window & { electron: { getAppVersion: () => Promise<string> } }).electron.getAppVersion().then((version: string) => {
        setAppVersion(version);
      });
    }
  }, []);

  const fetchSurahs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/surahs`);
      setSurahs(response.data);
    } catch (error) {
      console.error('Error fetching surahs:', error);
      // Use fallback data if API is not available
      setSurahs([
        {
          number: 1,
          name: "الفاتحة",
          englishName: "Al-Fatiha",
          englishNameTranslation: "The Opening",
          numberOfAyahs: 7,
          revelationType: "Meccan"
        },
        {
          number: 2,
          name: "البقرة",
          englishName: "Al-Baqara",
          englishNameTranslation: "The Cow",
          numberOfAyahs: 286,
          revelationType: "Medinan"
        },
        {
          number: 3,
          name: "آل عمران",
          englishName: "Ali 'Imran",
          englishNameTranslation: "Family of Imran",
          numberOfAyahs: 200,
          revelationType: "Medinan"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAyahs = async (surahNumber: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/surah/${surahNumber}/ayahs`);
      setAyahs(response.data);
    } catch (error) {
      console.error('Error fetching ayahs:', error);
      setAyahs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSurahClick = (surah: Surah) => {
    setSelectedSurah(surah);
    fetchAyahs(surah.number);
  };

  const handleBackToList = () => {
    setSelectedSurah(null);
    setAyahs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b-4 border-teal-500">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">د</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                  دماج للقرآن الكريم
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Dammaj Al-Quran - Complete Quran Application
                </p>
              </div>
            </div>
            {appVersion && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                v{appVersion}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!selectedSurah ? (
          <div>
            {/* Search Bar */}
            <div className="mb-8">
              <div className="max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="ابحث في القرآن الكريم..."
                  className="w-full px-6 py-4 rounded-full border-2 border-teal-200 focus:border-teal-500 focus:outline-none text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  dir="rtl"
                />
              </div>
            </div>

            {/* Surahs List */}
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                السور
              </h2>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">جاري التحميل...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {surahs.map((surah) => (
                    <button
                      key={surah.number}
                      onClick={() => handleSurahClick(surah)}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all p-6 text-right border-l-4 border-teal-500 hover:border-emerald-500 transform hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                          {surah.number}
                        </div>
                        <div className="flex-1 mr-4">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                            {surah.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {surah.englishName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                            {surah.englishNameTranslation}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-xs bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-3 py-1 rounded-full">
                          {surah.revelationType}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {surah.numberOfAyahs} آية
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* Surah View */}
            <div className="max-w-4xl mx-auto">
              <button
                onClick={handleBackToList}
                className="mb-6 flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                العودة إلى قائمة السور
              </button>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
                <div className="text-center mb-8 pb-6 border-b-2 border-teal-200 dark:border-teal-700">
                  <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                    سورة {selectedSurah.name}
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-1">
                    {selectedSurah.englishName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                    {selectedSurah.englishNameTranslation}
                  </p>
                  <div className="flex justify-center gap-4 mt-4">
                    <span className="text-sm bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 px-4 py-2 rounded-full">
                      {selectedSurah.revelationType}
                    </span>
                    <span className="text-sm bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-4 py-2 rounded-full">
                      {selectedSurah.numberOfAyahs} آية
                    </span>
                  </div>
                </div>

                {/* Bismillah */}
                {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
                  <div className="text-center mb-8">
                    <p className="text-3xl text-gray-800 dark:text-white font-arabic">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                  </div>
                )}

                {/* Ayahs */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">جاري تحميل الآيات...</p>
                  </div>
                ) : ayahs.length > 0 ? (
                  <div className="space-y-6">
                    {ayahs.map((ayah) => (
                      <div
                        key={ayah.number}
                        className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-teal-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <p className="text-2xl text-gray-800 dark:text-white leading-loose text-right mb-3 font-arabic">
                          {ayah.text}
                          <span className="inline-block mr-2 text-lg bg-teal-500 text-white w-8 h-8 rounded-full text-center leading-8">
                            {ayah.numberInSurah}
                          </span>
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                          <span>الآية {ayah.numberInSurah}</span>
                          <span>الجزء {ayah.juz} - الصفحة {ayah.page}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                      لا توجد آيات متاحة لهذه السورة حاليًا
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            دماج للقرآن الكريم - {new Date().getFullYear()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            تطبيق القرآن الكريم الشامل
          </p>
        </div>
      </footer>
    </div>
  );
}
