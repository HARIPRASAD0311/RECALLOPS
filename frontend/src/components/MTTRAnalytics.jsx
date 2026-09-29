import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function MTTRAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedService, setSelectedService] = useState('all');
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const data = await api.getStats();
        if (isMounted) {
          setStatsData(data);
        }
      } catch (err) {
        console.warn('Could not load live stats from backend:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const metrics = statsData?.metrics || [];
  const incidentRows = statsData?.recentIncidentsAnalytics || [];

  const filteredRows = selectedService === 'all'
    ? incidentRows
    : incidentRows.filter((r) => r.service === selectedService);

  const availableServices = Array.from(new Set(incidentRows.map((r) => r.service)));

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Command & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">query_stats</span>
            <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight font-bold">
              MTTR &amp; Resolution Analytics
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-status-success/10 text-status-success font-mono-label text-xs uppercase tracking-wider border border-status-success/20">
              Live SQLite Telemetry
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-text-secondary">
            Real-time impact of AI incident recall and proven fix re-use across your microservice fleet.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Service Selector */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-surface-elevated text-text-primary font-mono-label text-xs px-3 py-2 rounded-lg border border-border-subtle focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Services ({availableServices.length})</option>
            {availableServices.map((svc) => (
              <option key={svc} value={svc}>
                {svc}
              </option>
            ))}
          </select>

          {/* Time Range Selector */}
          <div className="inline-flex rounded-lg bg-surface-card p-1 border border-border-subtle">
            {['7d', '30d', '90d', 'All'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1 rounded text-xs font-mono-label transition-colors ${
                  timeRange === t
                    ? 'bg-primary text-white font-semibold'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      {isLoading ? (
        <div className="w-full bg-surface-card rounded-xl p-8 shadow-xl border border-border-subtle flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
          <p className="font-headline-sm text-text-primary text-sm">Calculating MTTR &amp; Resolution Telemetry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-surface-card border border-border-subtle shadow-md flex flex-col justify-between gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono-label text-xs uppercase text-text-muted">{m.title}</span>
              <span className="material-symbols-outlined text-[20px] text-text-muted">{m.icon}</span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="font-mono-metric text-3xl font-bold text-text-primary">{m.value}</span>
              {m.unit && <span className="font-mono-label text-sm text-text-muted">{m.unit}</span>}
              {m.change && (
                <span className={`ml-auto font-mono-label text-xs font-bold ${m.accentColor || 'text-status-success'}`}>
                  {m.change}
                </span>
              )}
            </div>

            <div className="text-xs font-mono-label text-text-muted border-t border-border-subtle pt-2">
              {m.subtext}
            </div>
          </div>
        ))}
      </div>
      )}

      {/* MTTR Reduction Chart / Visualizer */}
      <div className="p-6 rounded-xl bg-surface-card border border-border-subtle shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-headline-sm text-text-primary font-bold">MTTR Reduction vs Historical Baseline</h2>
            <p className="font-body-sm text-text-secondary text-xs">
              Comparing incident resolution time with RecallOps AI memory versus historical unassisted baseline.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono-label">
            <span className="flex items-center gap-1.5 text-text-muted">
              <span className="w-3 h-3 rounded bg-surface-elevated border border-border-subtle"></span> Baseline
            </span>
            <span className="flex items-center gap-1.5 text-status-success">
              <span className="w-3 h-3 rounded bg-status-success"></span> RecallOps MTTR
            </span>
          </div>
        </div>

        {/* Visual comparison bars for incidents */}
        <div className="space-y-3 pt-2">
          {filteredRows.slice(0, 5).map((row) => {
            const mttrNum = parseInt(row.mttr) || 15;
            const baseNum = parseInt(row.baseline) || 50;
            const mttrPct = Math.round((mttrNum / Math.max(baseNum, mttrNum)) * 100);
            return (
              <div key={row.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono-label">
                  <span className="font-semibold text-text-primary">
                    {row.id} <span className="text-text-muted font-normal">({row.service})</span>
                  </span>
                  <span className="text-status-success font-semibold">{row.savings}</span>
                </div>
                <div className="w-full h-4 rounded-full bg-surface-base border border-border-subtle overflow-hidden flex relative">
                  <div
                    className="h-full bg-status-success/80 rounded-l-full transition-all flex items-center justify-end pr-1.5 text-[10px] font-bold text-white"
                    style={{ width: `${mttrPct}%` }}
                  >
                    {row.mttr}
                  </div>
                  <div className="h-full flex-1 bg-surface-elevated/40 flex items-center justify-end pr-2 text-[10px] text-text-muted">
                    {row.baseline}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Incidents Analytics Table */}
      <div className="p-5 rounded-xl bg-surface-card border border-border-subtle shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-text-primary font-bold">Recent Incident Memory Log</h2>
          <span className="text-xs font-mono-label text-text-muted">
            Showing {filteredRows.length} incident{filteredRows.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="font-mono-label text-xs text-text-muted uppercase border-b border-border-subtle">
              <tr>
                <th className="py-2.5 px-3">Incident</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">MTTR</th>
                <th className="py-2.5 px-3">Baseline</th>
                <th className="py-2.5 px-3">Savings</th>
                <th className="py-2.5 px-3">Winning Runbook</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-mono-label text-xs">
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-surface-elevated/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-primary">{row.id}</td>
                  <td className="py-3 px-3 text-text-primary">{row.service}</td>
                  <td className="py-3 px-3 text-text-secondary">{row.type}</td>
                  <td className="py-3 px-3 text-status-success font-semibold">{row.mttr}</td>
                  <td className="py-3 px-3 text-text-muted">{row.baseline}</td>
                  <td className="py-3 px-3 text-secondary font-semibold">{row.savings}</td>
                  <td className="py-3 px-3 text-text-primary font-medium">{row.reusedRunbook}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
