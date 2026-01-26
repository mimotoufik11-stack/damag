import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import HomePage from '../pages/HomePage';
import EditorPage from '../pages/EditorPage';
import NewProjectPage from '../pages/NewProjectPage';
import SettingsPage from '../pages/SettingsPage';
import FontsPage from '../pages/FontsPage';
import Modal from '../components/Modal';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

function App() {
  const { theme, modal } = useUIStore();
  useKeyboardShortcuts();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 ${theme}`}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor/:projectId" element={<EditorPage />} />
        <Route path="/new-project" element={<NewProjectPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/fonts" element={<FontsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {modal.isOpen && (
        <Modal
          isOpen={modal.isOpen}
          title={modal.title}
          onClose={modal.onClose || (() => {})}
        >
          {modal.content}
        </Modal>
      )}
    </div>
  );
}

export default App;
