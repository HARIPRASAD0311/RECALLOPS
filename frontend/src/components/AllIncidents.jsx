import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AllIncidents({ onSelectIncident, onLogIncident }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterService, setFilterService] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const data = await api.getIncidents();
      setIncidents(data);
    } catch (err) {
      console.warn('Could not load incidents list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const services = Array.from(new Set(incidents.map((i) => i.service).filter(Boolean)));

  const filtered = incidents.filter((inc) => {
    const matchesSvc = filterService === 'all' || inc.service === filterService;
    const matchesSearch =
      !searchTerm ||
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.rootCause.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.fix.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSvc && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">database</span>
            <h1 className="font-headline-lg text-headline-lg text-text-primary font-bold">
              All Post-Mortem Records
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono-label text-xs uppercase border border-primary/20">
              {incidents.length} Indexed
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-text-secondary">
            Browse and inspect all historical post-mortems indexed in the vector memory graph.
          </p>
        </div>

        <button
          onClick={onLogIncident}
          className="px-4 py-2 rounded-xl bg-primary hover:bg-blue-600 text-white font-medium text-sm flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          + Log New Incident
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, keyword, root cause..."
            className="w-full bg-surface-card border border-border-subtle rounded-lg pl-9 pr-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary font-mono-code"
          />
        </div>

        <select
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
          className="bg-surface-card border border-border-subtle rounded-lg px-3 py-2 text-xs font-mono-label text-text-primary focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="all">All Services ({services.length})</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="p-12 text-center text-text-muted">Loading incidents from database...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-xl bg-surface-card border border-border-subtle text-center text-text-muted">
          No incidents matched your search criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((inc) => (
            <div
              key={inc.id}
              className="p-5 rounded-xl bg-surface-card border border-border-subtle hover:border-primary/50 transition-all shadow-md space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-metric text-primary font-bold">{inc.id}</span>
                    <span className="px-2 py-0.5 rounded bg-surface-elevated font-mono-label text-xs uppercase text-text-secondary border border-border-subtle">
                      {inc.service}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono-label uppercase font-bold ${
                    inc.severity === 'critical'
                      ? 'bg-status-danger/20 text-status-danger'
                      : 'bg-status-warning/20 text-status-warning'
                  }`}>
                    {inc.severity || 'high'}
                  </span>
                </div>

                <h3 className="font-headline-sm text-text-primary font-semibold leading-snug">
                  {inc.title}
                </h3>

                <p className="font-body-sm text-xs text-text-secondary line-clamp-2">
                  <strong className="text-text-muted">Root Cause:</strong> {inc.rootCause}
                </p>

                <p className="font-body-sm text-xs text-text-secondary line-clamp-2">
                  <strong className="text-status-success">Fix:</strong> {inc.fix}
                </p>
              </div>

              <div className="pt-2 border-t border-border-subtle flex items-center justify-between font-mono-label text-xs">
                <span className="text-text-muted">MTTR: <strong className="text-status-success">{inc.mttr}</strong></span>
                <button
                  onClick={() => onSelectIncident(inc)}
                  className="text-primary hover:underline font-semibold"
                >
                  Analyze in Intelligence →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
