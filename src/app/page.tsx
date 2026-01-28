'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 2 * 1024 * 1024 * 1024) {
        alert('File too large (max 2GB)');
        return;
      }
      // Navigate to editor with file
      router.push('/editor');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            ضمّاج القرآن
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            محرر فيديوهات قرآنية كامل مع ميزات ذكية
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/editor')}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="ml-2">📹</span>
              إنشاء مشروع جديد
            </button>
          </div>
        </header>

        <div className="max-w-2xl mx-auto">
          <div
            {...getRootProps()}
            className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-16 text-center cursor-pointer hover:border-green-500 transition-colors"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-2xl text-green-400">أفلت الملف هنا...</p>
            ) : (
              <>
                <p className="text-2xl text-gray-300 mb-4">📹 ارفع فيديو قرآني للتحرير</p>
                <p className="text-lg text-gray-400">
                  انقر لاختيار ملف أو اسحب وأفلت هنا
                  <br />
                  MP4, MOV, AVI, WebM • الحد الأقصى: 2GB
                </p>
              </>
            )}
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">الميزات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔍', title: 'تعرف تلقائي على الكلام', desc: 'تسجيل صوتي عربي باستخدام Whisper API' },
              { icon: '📖', title: 'مطابقة الآيات القرآنية', desc: 'مطابقة تلقائية مع 6236 آية' },
              { icon: '🎨', title: '20+ خطاً وتأثيرات', desc: 'خطوط وتأثيرات نصية عربية جميلة' },
              { icon: '🎬', title: '10+ قوالب احترافية', desc: 'قوالب جاهزة لإنتاج فيديوهات مذهلة' },
              { icon: '⚙️', title: 'محرر الخط الزمني', desc: 'تحرير متعدد المسارات بالتأثيرات والانتقالات' },
              { icon: '✓', title: 'تنسيقات تصدير متعددة', desc: 'MP4, WebM, MOV مع جودة قابلة للتخصيص' }
            ].map((feature, i) => (
              <div key={i} className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}