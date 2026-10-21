import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { BaziChartDisplay } from './components/BaziChartDisplay';
import { LiuZhuDisplay } from './components/LiuZhuDisplay';
import { TuViDisplay } from './components/TuViDisplay';
import { PalmistryCanvas } from './components/PalmistryCanvas';
import { FaceAndFingerprintDisplay } from './components/FaceAndFingerprintDisplay';
import { CompatibilityDisplay } from './components/CompatibilityDisplay';
import { DateSelectionDisplay } from './components/DateSelectionDisplay';
import { KnowledgeBaseDisplay } from './components/KnowledgeBaseDisplay';
import { AdminPanel } from './components/AdminPanel';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-ink-950 text-slate-100 flex flex-col justify-between selection:bg-gold-500/30 selection:text-gold-200">
      <div>
        <Navbar />
        <main className="animate-fade-in">
          {activeTab === 'home' && <HomePage />}
          {activeTab === 'bazi' && <BaziChartDisplay />}
          {activeTab === 'liuzhu' && <LiuZhuDisplay />}
          {activeTab === 'tuvi' && <TuViDisplay />}
          {activeTab === 'palmistry' && <PalmistryCanvas />}
          {activeTab === 'face_fingerprint' && <FaceAndFingerprintDisplay />}
          {activeTab === 'compatibility' && <CompatibilityDisplay />}
          {activeTab === 'date_selection' && <DateSelectionDisplay />}
          {activeTab === 'knowledge' && <KnowledgeBaseDisplay />}
          {activeTab === 'admin' && <AdminPanel />}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
