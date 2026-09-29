import React, { useState } from 'react';
import Header from './components/Header';
import IncidentIntelligence from './components/IncidentIntelligence';
import SearchAndRecall from './components/SearchAndRecall';
import MTTRAnalytics from './components/MTTRAnalytics';
import DeployRisk from './components/DeployRisk';
import AllIncidents from './components/AllIncidents';
import LogIncidentModal from './components/LogIncidentModal';
import Footer from './components/Footer';

export default function App() {
  const [currentTab, setCurrentTab] = useState('incident-intelligence');
  const [activeQuery, setActiveQuery] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const handleSearchSuccess = (query) => {
    setActiveQuery(query);
    setCurrentTab('incident-intelligence');
  };

  const handleSelectIncidentForIntelligence = (incident) => {
    const query = `${incident.service} ${incident.title} ${incident.rootCause}`;
    setActiveQuery(query);
    setCurrentTab('incident-intelligence');
  };

  const handleTabSelect = (tabId) => {
    if (tabId === 'log-incident') {
      setIsLogModalOpen(true);
    } else {
      setCurrentTab(tabId);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col font-sans text-on-surface">
      <Header currentTab={currentTab} onSelectTab={handleTabSelect} />

      <main className="w-full pt-20 pb-12 flex-1 bg-surface-base">
        <div className="max-w-[1200px] mx-auto px-4">
          {currentTab === 'incident-intelligence' && (
            <IncidentIntelligence
              initialQuery={activeQuery}
              onNavigateSearch={() => setCurrentTab('search-and-recall')}
            />
          )}

          {currentTab === 'search-and-recall' && (
            <SearchAndRecall onSearchSuccess={handleSearchSuccess} />
          )}

          {currentTab === 'mttr-analytics' && <MTTRAnalytics />}

          {currentTab === 'deploy-risk' && (
            <DeployRisk
              onNavigateIntelligence={(q) => {
                setActiveQuery(q);
                setCurrentTab('incident-intelligence');
              }}
            />
          )}

          {currentTab === 'all-incidents' && (
            <AllIncidents
              onSelectIncident={handleSelectIncidentForIntelligence}
              onLogIncident={() => setIsLogModalOpen(true)}
            />
          )}
        </div>
      </main>

      <Footer />

      <LogIncidentModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onCreated={(newInc) => {
          setActiveQuery(`${newInc.service} ${newInc.title}`);
          setCurrentTab('incident-intelligence');
        }}
      />
    </div>
  );
}
