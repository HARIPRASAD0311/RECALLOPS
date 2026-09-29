import React, { useState } from 'react';
import { api } from '../services/api';

export default function SearchAndRecall({ onSearchSuccess }) {
  const [query, setQuery] = useState(
    'Checkout API latency spike, PostgreSQL connection pool exhausted, payments returning 504 timeouts'
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleQueries = [
    {
      label: 'DB Pool Exhaustion',
      query: 'Checkout API latency spike, PostgreSQL connection pool exhausted, payments returning 504 timeouts',
    },
    {
      label: 'Auth Service OOM',
      query: 'Auth service OOM kills memory leak session cache missing TTL',
    },
    {
      label: 'Kafka Queue Backlog',
      query: 'Search indexing stalled consumer crashed poison message queue backlog',
    },
    {
      label: 'TLS Expiry',
      query: 'TLS cert expired gateway 502 bad gateway auto renewal failure',
    },
    {
      label: 'Deploy Config Drift',
      query: 'Deploy caused config drift env var missing in new manifest',
    },
  ];

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setErrorMsg('');
    try {
      const resp = await api.searchIncidents(searchQuery, 6);
      setSearchResults(resp.results || []);
    } catch (err) {
      console.warn('Search API fallback:', err);
      // Fallback local results
      setErrorMsg('Could not reach live search API, using local memory.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLaunchIntelligence = (targetQuery) => {
    onSearchSuccess(targetQuery || query);
  };

  return (
    <div className="relative w-full overflow-hidden pb-12">
      {/* Subtle Background Lighting Effects */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-primary/10 rounded-full blur-[110px] pointer-events-none -z-10"></div>
      <div className="absolute top-48 right-12 w-[380px] h-[220px] bg-secondary/5 rounded-full blur-[90px] pointer-events-none -z-10"></div>

      {/* 1. Hero Header */}
      <section className="flex flex-col items-center text-center max-w-4xl mx-auto pt-4 pb-6 px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/90 text-primary mb-5 shadow-sm border border-border-subtle">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="font-mono-label text-mono-label tracking-wide uppercase text-primary text-[11px] font-semibold">
            RecallOps Vector Engine v2.0
          </span>
        </div>

        <h1 className="font-headline-xl text-headline-xl text-text-primary tracking-tight max-w-3xl mb-3 font-bold">
          Instant SRE Incident Recall
        </h1>

        <p className="font-body-md text-text-muted max-w-xl text-center text-body-md">
          Search past production post-mortems using vector embeddings for proven fixes, verified workarounds, and dangerous anti-patterns.
        </p>
      </section>

      {/* 2. Incident Input Card */}
      <section className="relative w-full max-w-4xl mx-auto mb-8">
        <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 via-transparent to-transparent rounded-xl blur-md opacity-40 pointer-events-none"></div>
        <div className="relative bg-surface-card rounded-xl p-6 sm:p-7 shadow-xl border border-border-subtle">
          {/* Card Header Meta Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">terminal</span>
              <label
                className="font-mono-label text-mono-label uppercase text-text-secondary tracking-widest font-semibold"
                htmlFor="incident-input"
              >
                Incident Symptoms &amp; Telemetry
              </label>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-surface-base text-text-muted border border-border-subtle">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-status-info animate-pulse"></span>
              <span className="font-mono-label text-mono-label text-text-secondary tracking-tight">
                Vector Similarity: Hybrid Full-Text + Semantic Graph
              </span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="font-mono-label text-xs text-text-muted mr-1">Quick Scenarios:</span>
            {sampleQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(item.query);
                  handleSearch(item.query);
                }}
                className="px-2.5 py-1 rounded-md bg-surface-elevated hover:bg-surface-container-high text-text-secondary hover:text-text-primary text-xs font-mono-label border border-border-subtle transition-colors"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Textarea Shell */}
          <div className="relative mt-1">
            <textarea
              id="incident-input"
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Incident symptoms and telemetry description"
              className="w-full min-h-[140px] bg-surface-base rounded-xl p-4 sm:p-5 font-mono-code text-[14px] leading-relaxed text-text-primary placeholder:text-text-muted/60 border border-border-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all resize-y"
              placeholder="e.g., API latency spiking to 4.2s, PostgreSQL connection pool exhausted (max_connections reached), checkout service throwing HTTP 504 gateway timeouts since deployment"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute top-3 right-3 text-text-muted hover:text-text-primary p-1 rounded hover:bg-surface-elevated transition-colors text-xs flex items-center gap-1 opacity-70 hover:opacity-100"
                title="Clear prompt"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">backspace</span>
              </button>
            )}
          </div>

          {/* Button & Action Bar */}
          <div className="flex flex-col items-center justify-center gap-4 mt-5 pt-2 w-full">
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                onClick={() => handleSearch()}
                disabled={isSearching || !query.trim()}
                className="px-8 py-3 bg-primary hover:bg-blue-600 active:scale-[0.98] text-white font-headline-sm text-[15px] font-semibold rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-[0_4px_24px_rgba(59,130,246,0.4)] cursor-pointer disabled:opacity-50"
                id="search-trigger-btn"
                type="button"
              >
                {isSearching ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] animate-spin">
                      progress_activity
                    </span>
                    <span>Querying Semantic Space...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">search_spark</span>
                    <span>Find Similar Incidents</span>
                  </>
                )}
              </button>
              <button
                onClick={() => handleLaunchIntelligence(query)}
                className="px-6 py-3 bg-secondary hover:bg-teal-500 text-black font-headline-sm text-[15px] font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
                id="launch-intelligence-btn"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">psychology</span>
                <span>Synthesize Resolution Brief</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-text-muted font-mono-label text-mono-label">
              <span>Press</span>
              <kbd className="px-2 py-0.5 rounded bg-surface-container font-mono-code text-[11px] text-text-secondary border border-border-subtle">
                Ctrl
              </kbd>
              <span>+</span>
              <kbd className="px-2 py-0.5 rounded bg-surface-container font-mono-code text-[11px] text-text-secondary border border-border-subtle">
                Enter
              </kbd>
              <span>to search vector index</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Search Results Section */}
      {searchResults && (
        <section className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-text-primary flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-primary">manage_search</span>
              Matching Memory Records ({searchResults.length})
            </h2>
            <button
              onClick={() => handleLaunchIntelligence(query)}
              className="text-secondary hover:underline font-mono-label text-xs font-semibold"
            >
              Open Live AI Brief for this query →
            </button>
          </div>

          {searchResults.length === 0 && (
            <div className="p-8 rounded-xl bg-surface-card border border-border-subtle text-center text-text-muted">
              No historical incidents found with high similarity. Try adjusting your query terms.
            </div>
          )}

          {searchResults.map((inc) => (
            <div
              key={inc.id}
              className="p-5 rounded-xl bg-surface-card border border-border-subtle hover:border-primary/50 transition-all shadow-md space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono-metric text-primary font-bold">{inc.id}</span>
                  <span className="px-2 py-0.5 rounded bg-surface-elevated font-mono-label text-xs uppercase text-text-secondary border border-border-subtle">
                    {inc.service}
                  </span>
                  <h3 className="font-headline-sm text-text-primary font-semibold">{inc.title}</h3>
                </div>
                {inc.match && (
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/30 font-mono-label text-xs font-bold">
                    {inc.match} similarity
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-body-sm">
                <div className="p-2.5 rounded-lg bg-surface-base border border-border-subtle">
                  <span className="font-mono-label text-xs text-text-muted uppercase block">Root Cause:</span>
                  <span className="text-text-primary">{inc.rootCause}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-base border border-border-subtle">
                  <span className="font-mono-label text-xs text-status-success uppercase block font-semibold">Verified Fix:</span>
                  <span className="text-text-primary">{inc.fix}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border-subtle font-mono-label text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <span>MTTR: <strong className="text-status-success">{inc.mttr}</strong></span>
                  <span>•</span>
                  <span>Resolved by @{inc.resolvedBy || 'SRE'}</span>
                </div>
                <button
                  onClick={() => handleLaunchIntelligence(`${inc.service} ${inc.title} ${inc.rootCause}`)}
                  className="text-primary hover:text-white font-medium transition-colors"
                >
                  Generate Incident Brief →
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
