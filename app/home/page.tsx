import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-8 py-16 px-8 bg-white dark:bg-black">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="text-6xl mb-4">📖</div>
          <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
            Dammaj Al-Quran
          </h1>
          <h2 className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400">
            القرآن الكريم
          </h2>
          <p className="max-w-lg text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Professional Quran Video Editor - Create beautiful Quranic videos with automatic speech recognition and verse matching
          </p>
          <div className="flex gap-4 mt-6">
            <a href="/editor" className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
              Open Editor
            </a>
            <div className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
              Documentation
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-center">
            <div className="text-2xl mb-2">🎬</div>
            <h3 className="font-semibold text-black dark:text-zinc-100 mb-2">Video Editing</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Professional timeline editor with effects</p>
          </div>
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-center">
            <div className="text-2xl mb-2">🎙️</div>
            <h3 className="font-semibold text-black dark:text-zinc-100 mb-2">AI Recognition</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Automatic speech-to-text with Whisper</p>
          </div>
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-center">
            <div className="text-2xl mb-2">📜</div>
            <h3 className="font-semibold text-black dark:text-zinc-100 mb-2">Quran Database</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Complete 114 Surahs with verse matching</p>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-zinc-500 dark:text-zinc-500">
          Version 1.0.0 - Complete Quran Video Editor
        </div>
      </main>
    </div>
  );
}