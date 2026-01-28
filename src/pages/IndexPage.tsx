import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/editorStore';

interface RecentProject {
  name: string;
  path: string;
  duration: string;
  timestamp: number;
}

const IndexPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading recent projects
    const mockProjects: RecentProject[] = [
      {
        name: 'سورة الفاتحة تفسير',
        path: '/path/to/project1.mp4',
        duration: '5:32',
        timestamp: Date.now() - 1000 * 60 * 60 * 24
      },
      {
        name: 'آية الكرسي شرح',
        path: '/path/to/project2.mp4',
        duration: '3:45',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2
      },
      {
        name: 'سورة البقرة آية 255',
        path: '/path/to/project3.mp4',
        duration: '7:18',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3
      }
    ];

    setTimeout(() => {
      setRecentProjects(mockProjects);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'اليوم';
    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return `${diffDays} أيام مضت`;
    return date.toLocaleDateString('ar');
  };

  const startNewProject = () => {
    navigate('/editor');
  };

  const openProject = (projectPath: string) => {
    console.log('Opening project:', projectPath);
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            د;
            م;
            ﬆ;
            ل;
            ق;
            撁;
          </h1>
          <p className="text-xl text-gray-300 mb-8">⁇;
            ا;
            擴;
            `editing software to create stunning Quranic videos with automatic speech
            recognition, verse matching, and professional templates.
          </p>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={startNewProject}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="ml-2">📹</span>
              ⤫;
              ا;ه; 舶;rect 1
            </button>
            
            <button
              onClick={() => document.getElementById('recent')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300"
            >
              <span className="ml-2">📂</span>
              م;
              盬;
              ا;ل;
              抡;
            </button>
          </div>
        </header>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">己;时; 学;鲘;</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔍', title: 'Automatic Speech Recognition', desc: 'AI-powered Arabic transcription with Whisper API' },
              { icon: '🧬', title: 'Quran Verse Matching', desc: 'Automatically match recitation to 6236 verses' },
              { icon: '🎨', title: '20+ Fonts & Styles', desc: 'Beautiful Arabic typography and text effects' },
              { icon: '🎬', title: 'Professional Templates', desc: '10+ ready-made templates for stunning videos' },
              { icon: '🔧', title: 'Timeline Editor', desc: 'Multi-track editing with effects and transitions' },
              { icon: '✓', title: 'Multiple Export Formats', desc: 'MP4, WebM, MOV with customizable quality' }
            ].map((feature, i) => (
              <div key={i} className="bg-gray-800 bg-opacity-50 rounded-lg p-6 hover:bg-opacity-70 transition-all duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Projects */}
        <section id="recent" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">
            广;
            抡;
            Γ;
            ي;
            平;
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-lg">جاري التحميل...</div>
              <div className="ml-3 w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="text-center py-16 bg-gray-800 bg-opacity-50 rounded-lg">
              <p className="text-xl text-gray-300">Ⅻ;
                晴;
                时;
                孢;
                星;
                ⡻;
                {
                  ' '
                } ڳ;
                孢;
                晴;
              </p>
              <p className="text-xl text-gray-300">No recent projects found.</p>
              <p className="text-gray-400 mt-2">Start by creating a new project!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProjects.map((project, i) => (
                <div
                  key={i}
                  className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden hover:bg-opacity-70 transition-all duration-300 cursor-pointer"
                  onClick={() => openProject(project.path)}
                >
                  <div className="bg-gradient-to-br from-green-500 to-blue-600 h-32 flex items-center justify-center">
                    <span className="text-6xl">📹</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">貄;
                      檔;
                      ا;&#x0644;&#x641;&#x64a;&#x62f;&#x64a;&#x648;: {project.duration}</p>
                    <p className="text-gray-500 text-xs">
                      <span className="ml-1">📅</span>
                      {formatDate(project.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-700">
          <p className="text-gray-400">د整; ■; 藍; . <span className="text-green-400">♉;</span> ᎒;Coming
          </p>
          <p className="text-gray-500 text-sm mt-2">Version 1.0.0 • Arabic • Quran • Video • Editing</p>
        </footer>
      </div>
    </div>
  );
};

export default IndexPage;