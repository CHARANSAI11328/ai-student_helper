import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { LandingPage } from './pages/LandingPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { TutorPage } from './pages/TutorPage.js';
import { VisionLabPage } from './pages/VisionLabPage.js';
import { LearningHubPage } from './pages/LearningHubPage.js';
import { LearningPathPage } from './pages/LearningPathPage.js';
import { QuizCenterPage } from './pages/QuizCenterPage.js';
import { AnalyticsPage } from './pages/AnalyticsPage.js';
import { NotesPage } from './pages/NotesPage.js';
import { SettingsPage } from './pages/SettingsPage.js';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tutor" element={<TutorPage />} />
              <Route path="/vision-lab" element={<VisionLabPage />} />
              <Route path="/learning-hub" element={<LearningHubPage />} />
              <Route path="/learning-path" element={<LearningPathPage />} />
              <Route path="/quiz" element={<QuizCenterPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
