import React, { useState } from 'react';
import { AppShell } from './components/AppShell';
import { HomePage } from './components/HomePage';
import { ChatPage } from './components/ChatPage';
import { SavedDestinations } from './components/SavedDestinations';
import { AdminConsole } from './components/AdminConsole';
import { DocumentViewer } from './components/DocumentViewer';
import { EvidencePanel } from './components/EvidencePanel';

interface EvidenceItem {
  id: string;
  title: string;
  section: string;
  page?: number;
  confidence: number;
  type: 'official' | 'unofficial' | 'restricted';
  preview: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [showEvidencePanel, setShowEvidencePanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFiles, setSearchFiles] = useState<File[]>([]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSearch = (query: string, files?: File[]) => {
    setSearchQuery(query);
    setSearchFiles(files || []);
    setCurrentView('chat');
    console.log('Search:', query, files);
  };

  const handleQuestionClick = (question: string) => {
    setSearchQuery(question);
    setSearchFiles([]);
    setCurrentView('chat');
    console.log('Question clicked:', question);
  };

  const handlePresetClick = (preset: any) => {
    setSearchQuery(preset.title || preset.name || '');
    setSearchFiles([]);
    setCurrentView('chat');
    console.log('Preset clicked:', preset);
  };

  const handleEvidenceClick = (evidence: EvidenceItem) => {
    setSelectedEvidence(evidence);
    setShowEvidencePanel(true);
    console.log('Evidence clicked:', evidence);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage
            onSearch={handleSearch}
            onQuestionClick={handleQuestionClick}
            onPresetClick={handlePresetClick}
          />
        );
      case 'chat':
        return (
          <ChatPage
            onEvidenceClick={handleEvidenceClick}
            initialQuery={searchQuery}
            initialFiles={searchFiles}
            onQueryProcessed={() => {
              setSearchQuery('');
              setSearchFiles([]);
            }}
          />
        );
      case 'saved':
        return (
          <SavedDestinations
            onDestinationClick={(dest) => console.log('Destination clicked:', dest)}
            onRerunJourney={(dest) => {
              setCurrentView('chat');
              console.log('Rerun journey:', dest);
            }}
          />
        );
      case 'documents':
        return (
          <DocumentViewer />
        );
      case 'admin':
        return (
          <AdminConsole />
        );
      default:
        return null;
    }
  };

  const renderRightPanelContent = () => {
    if (!showEvidencePanel || !selectedEvidence) return null;
    
    return (
      <EvidencePanel
        evidence={selectedEvidence}
        onClose={() => setShowEvidencePanel(false)}
      />
    );
  };

  return (
    <div className="min-h-screen text-foreground" style={{ background: 'var(--background)' }}>
      <AppShell
        currentView={currentView}
        onViewChange={setCurrentView}
        isDark={isDarkMode}
        onThemeToggle={toggleTheme}
        showRightPanel={showEvidencePanel}
        rightPanelContent={renderRightPanelContent()}
      >
        {renderCurrentView()}
      </AppShell>
    </div>
  );
}