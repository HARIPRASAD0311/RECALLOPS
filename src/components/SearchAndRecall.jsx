import React, { useState } from 'react';

export default function SearchAndRecall({ onSearchSuccess }) {
  const [query, setQuery] = useState(
    'API latency spiking to 4.2s, PostgreSQL connection pool exhausted (max_connections reached), checkout service throwing HTTP 504 gateway timeouts since deployment #842'
  );
  const [isSearching, setIsSearching] = useState(false);

  const handleQuickDemo = () => {
    setQuery(
      'API latency spiking to 4.2s, PostgreSQL connection pool exhausted (max_connections reached), checkout service throwing HTTP 504 gateway timeouts since deployment #842'
    );
  };

  const handleClear = () => {
    setQuery('');
  };

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onSearchSuccess(query);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full overflow-hidden pb-12">
      {/* Subtle Background Lighting Effects */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-primary/10 rounded-full blur-[110px] pointer-events-none -z-10"></div>
      <div className="absolute top-48 right-12 w-[380px] h-[220px] bg-secondary/5 rounded-full blur-[90px] pointer-events-none -z-10"></div>

      {/* 1. Hero Header */}
      <section className="flex flex-col items-center text-center max-w-4xl mx-auto pt-4 pb-8 px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/90 text-primary mb-6 shadow-sm border border-border-subtle">
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
          </span>
          <span className="font-mono-label text-mono-label tracking-wide uppercase text-primary text-[11px]">
            Recall Engine v2.4
          </span>
        </div>

        <h1 className="font-headline-xl text-headline-xl text-text-primary tracking-tight max-w-3xl mb-4">
          Instant Incident Recall
        </h1>

        <p className="font-body-md text-text-muted max-w-xl text-center text-body-md">
          Search past production post-mortems for proven fixes, verified workarounds, and dangerous
          anti-patterns.
        </p>
      </section>

      {/* 2. Incident Input Card */}
      <section className="relative w-full max-w-4xl mx-auto mb-10">
        <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 via-transparent to-transparent rounded-xl blur-md opacity-40 pointer-events-none"></div>
        <div className="relative bg-surface-card rounded-xl p-6 sm:p-7 shadow-xl border border-border-subtle">
          {/* Card Header Meta Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">terminal</span>
              <label
                className="font-mono-label text-mono-label uppercase text-text-secondary tracking-widest"
                htmlFor="incident-input"
              >
                Incident Query
              </label>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-surface-base text-text-muted border border-border-subtle">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-status-info animate-pulse"></span>
              <span className="font-mono-label text-mono-label text-text-secondary tracking-tight">
                Vector Similarity: Hybrid Full-Text + Semantic Graph
              </span>
            </div>
          </div>

          {/* Textarea Shell */}
          <div className="relative mt-1">
            <textarea
              id="incident-input"
              rows={6}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Incident symptoms and telemetry description"
              className="w-full min-h-[200px] bg-surface-base/90 rounded-xl p-5 sm:p-6 font-mono-code text-[14px] leading-relaxed text-text-primary placeholder:text-text-muted/60 border border-outline-variant/40 focus:outline-none focus:border-status-info focus:ring-2 focus:ring-status-info/60 focus:shadow-[0_0_28px_rgba(59,130,246,0.28)] transition-all resize-y shadow-inner"
              placeholder="e.g., API latency spiking to 4.2s, PostgreSQL connection pool exhausted (max_connections reached), checkout service throwing HTTP 504 gateway timeouts since deployment #842"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 text-text-muted hover:text-text-primary p-1 rounded hover:bg-surface-elevated transition-colors text-xs flex items-center gap-1 opacity-70 hover:opacity-100"
                title="Clear prompt"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">backspace</span>
              </button>
            )}
          </div>

          {/* Button & Action Bar */}
          <div className="flex flex-col items-center justify-center gap-4 mt-6 pt-2 w-full">
            <div className="flex flex-wrap items-center justify-center gap-3.5 w-full">
              <button
                onClick={handleSearch}
                disabled={isSearching || !query.trim()}
                className="px-8 py-3.5 bg-status-info hover:bg-blue-600 active:scale-[0.98] text-white font-headline-sm text-[15px] font-semibold rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_4px_24px_rgba(59,130,246,0.45)] hover:shadow-[0_6px_28px_rgba(59,130,246,0.6)] cursor-pointer disabled:opacity-50"
                id="search-trigger-btn"
                type="button"
              >
                {isSearching ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">
                      progress_activity
                    </span>
                    <span>Scanning Graph...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">search_spark</span>
                    <span>Find Similar Incidents</span>
                  </>
                )}
              </button>
              <button
                onClick={handleQuickDemo}
                className="px-5 py-3 bg-surface-elevated hover:bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:text-text-primary font-body-md text-body-md rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                id="quick-demo-btn"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-tertiary">bolt</span>
                <span>Quick Demo (Load Payment Incident)</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-text-muted font-mono-label text-mono-label">
              <span>Press</span>
              <kbd className="px-2 py-0.5 rounded bg-surface-container font-mono-code text-[11px] text-text-secondary border border-outline-variant/20">
                Ctrl
              </kbd>
              <span>+</span>
              <kbd className="px-2 py-0.5 rounded bg-surface-container font-mono-code text-[11px] text-text-secondary border border-outline-variant/20">
                Enter
              </kbd>
              <span>to recall</span>
            </div>
          </div>

          {/* Helper Tip Bar */}
          <div className="mt-4 pt-3 flex items-start gap-2 text-text-muted font-body-sm text-body-sm border-t border-border-subtle">
            <span className="material-symbols-outlined text-[15px] text-status-warning shrink-0 mt-0.5">
              lightbulb
            </span>
            <p className="font-mono-code text-body-sm text-text-muted">
              <strong className="text-text-secondary font-medium">Tip:</strong> Include error codes
              (<code className="px-1 py-0.5 bg-surface-base rounded text-status-danger">504</code>,{' '}
              <code className="px-1 py-0.5 bg-surface-base rounded text-status-danger">OOMKilled</code>
              ) or affected service names for highest cosine similarity accuracy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
