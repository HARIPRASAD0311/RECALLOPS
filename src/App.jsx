import React, { useState } from 'react';
import Header from './components/Header';
import IncidentIntelligence from './components/IncidentIntelligence';
import SearchAndRecall from './components/SearchAndRecall';
import MTTRAnalytics from './components/MTTRAnalytics';
import Footer from './components/Footer';

export default function App() {
  const [currentTab, setCurrentTab] = useState('incident-intelligence');

  const handleSearchSuccess = (query) => {
    setCurrentTab('incident-intelligence');
  };

  return (
    <div className="min-h-screen bg-surface-base flex flex-col font-sans text-on-surface">
      <Header currentTab={currentTab} onSelectTab={setCurrentTab} />

      <main className="w-full pt-20 pb-12 flex-1 bg-surface-base">
        <div className="max-w-[1100px] mx-auto px-4">
          {currentTab === 'incident-intelligence' && (
            <IncidentIntelligence onNavigateSearch={() => setCurrentTab('search-and-recall')} />
          )}

          {currentTab === 'search-and-recall' && (
            <SearchAndRecall onSearchSuccess={handleSearchSuccess} />
          )}

          {currentTab === 'mttr-analytics' && <MTTRAnalytics />}

          {(currentTab === 'deploy-risk' ||
            currentTab === 'all-incidents' ||
            currentTab === 'log-incident') && (
            <div className="bg-surface-card border border-border-subtle rounded-xl p-8 text-center space-y-3">
              <span className="material-symbols-outlined text-4xl text-primary">engineering</span>
              <h2 className="text-headline-md font-semibold text-text-primary capitalize">
                {currentTab.replace('-', ' ')}
              </h2>
              <p className="text-body-sm text-text-secondary max-w-md mx-auto">
                Connected to RecallOps SRE Memory Cluster. Switch to{' '}
                <button
                  onClick={() => setCurrentTab('incident-intelligence')}
                  className="text-primary underline font-medium"
                >
                  Incident Intelligence
                </button>{' '}
                to view live post-mortem correlation and runbooks.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
