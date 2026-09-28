import React from 'react';

export default function Header({ currentTab, onSelectTab }) {
  const navItems = [
    { id: 'search-and-recall', label: 'Search & Recall' },
    { id: 'incident-intelligence', label: 'Incident Intelligence' },
    { id: 'mttr-analytics', label: 'MTTR Analytics' },
    { id: 'deploy-risk', label: 'Deploy Risk' },
    { id: 'all-incidents', label: 'All Incidents' },
    { id: 'log-incident', label: '+ Log Incident', isAction: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-card/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-b border-border-subtle">
      <div className="h-16 w-full px-4 flex items-center justify-between gap-4 max-w-[1440px] mx-auto">
        {/* Brand / Logo */}
        <div className="flex items-center gap-space-md shrink-0">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectTab('incident-intelligence')}>
            <img
              alt="RecallOps Monogram Logo"
              className="h-8 w-8 object-contain rounded-lg shadow-[0_0_12px_rgba(59,130,246,0.3)]"
              src="/logo.svg"
            />
            <span className="font-mono-metric text-headline-sm tracking-tight text-text-primary">
              RecallOps
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-space-xs px-2.5 py-0.5 rounded-full bg-surface-elevated border border-border-subtle">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
            </span>
            <span className="font-mono-label text-mono-label uppercase text-text-secondary">
              Incident Memory Agent
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-2.5 py-1.5 transition-colors font-body-md text-body-md rounded ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-medium'
                    : item.isAction
                    ? 'text-primary hover:text-white hover:bg-surface-container-high'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section Actions & User */}
        <div className="flex items-center gap-space-sm shrink-0">
          <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-elevated border border-border-subtle">
            <span className="material-symbols-outlined text-[14px] text-status-success">dns</span>
            <span className="font-mono-label text-mono-label text-text-secondary">
              Memory Engine: Synced (1,048 past incidents)
            </span>
          </div>

          <button
            aria-label="Toggle color mode"
            className="p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">dark_mode</span>
          </button>

          <div className="flex items-center gap-2 pl-1 border-l border-border-subtle">
            <div className="hidden md:flex flex-col items-end leading-tight">
              <span className="font-mono-label text-[10px] uppercase text-text-muted">On-Call</span>
              <span className="font-body-sm text-body-sm text-text-primary font-medium">Alex K. (SRE)</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-on-primary font-medium shadow-sm">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
