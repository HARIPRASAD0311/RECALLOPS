import React, { useState } from 'react';

export default function MTTRAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [service, setService] = useState('All Services (87)');

  const metrics = [
    {
      title: 'Overall MTTR',
      change: '-42%',
      changeType: 'positive',
      value: '18.4',
      unit: 'm',
      subtext: 'vs. 31.8m before RecallOps',
      accentColor: 'text-status-success',
      icon: 'trending_down',
    },
    {
      title: 'Fix Re-use Rate',
      change: '+68%',
      changeType: 'positive',
      value: '89.2',
      unit: '%',
      subtext: 'Verified runbooks executed',
      accentColor: 'text-status-info',
      icon: 'sync',
    },
    {
      title: 'Engineering Hours Saved',
      change: '+310h',
      changeType: 'positive',
      value: '412',
      unit: 'hrs',
      subtext: 'Triaged via Neural Vector Search',
      accentColor: 'text-secondary',
      icon: 'schedule',
    },
    {
      title: 'Avoided Downtime Cost',
      change: 'Est.',
      changeType: 'neutral',
      value: '$328',
      unit: 'k',
      subtext: 'Calculated at standard SLA rate',
      accentColor: 'text-tertiary',
      icon: 'savings',
    },
  ];

  const recentIncidentsAnalytics = [
    {
      id: 'INC-204',
      service: 'payments-service',
      type: 'Socket Leak / Pool Starvation',
      mttr: '12m',
      baseline: '54m',
      savings: '-78%',
      status: 'Resolved (v2.3.1)',
      reusedRunbook: 'PR #1420',
    },
    {
      id: 'INC-187',
      service: 'billing-worker',
      type: 'DB Tx Lock Timeout',
      mttr: '15m',
      baseline: '48m',
      savings: '-69%',
      status: 'Resolved (Timeouts)',
      reusedRunbook: 'Runbook #187',
    },
    {
      id: 'INC-142',
      service: 'api-gateway',
      type: 'Envoy Buffer Exhaustion',
      mttr: '22m',
      baseline: '39m',
      savings: '-44%',
      status: 'Resolved (Circuit Breaker)',
      reusedRunbook: 'Runbook #142',
    },
  ];

  return (
    <div className="flex flex-col w-full gap-6">
      {/* Top Command & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-border-subtle">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">query_stats</span>
            <h1 className="font-headline-lg text-headline-lg text-text-primary tracking-tight">
              MTTR &amp; Resolution Analytics
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-status-success/10 text-status-success font-mono-label text-mono-label uppercase tracking-wider border border-status-success/20">
              Telemetry Live
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-text-secondary">
            Real-time impact of AI incident recall and proven fix re-use across 87 microservices.
          </p>
        </div>

        {/* Controls & Range Selectors */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          {/* Time Presets */}
          <div className="flex items-center p-1 rounded bg-surface-card border border-border-subtle">
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded font-mono-label text-mono-label font-medium transition-colors shadow-sm ${
                timeRange === '30d'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-text-muted hover:text-text-primary'
              }`}
              type="button"
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 rounded font-mono-label text-mono-label font-medium transition-colors ${
                timeRange === '90d'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-text-muted hover:text-text-primary'
              }`}
              type="button"
            >
              Last 90 Days
            </button>
            <button
              onClick={() => setTimeRange('ytd')}
              className={`px-3 py-1 rounded font-mono-label text-mono-label font-medium transition-colors ${
                timeRange === 'ytd'
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-text-muted hover:text-text-primary'
              }`}
              type="button"
            >
              Year to Date
            </button>
          </div>

          {/* Service Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-card border border-border-subtle text-text-primary hover:border-status-info font-mono-label text-mono-label transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-text-muted">memory</span>
              <span>
                Service: <strong className="text-text-primary font-medium">{service}</strong>
              </span>
              <span className="material-symbols-outlined text-[16px] text-text-muted">
                arrow_drop_down
              </span>
            </button>
          </div>

          {/* Export Action */}
          <button
            onClick={() => alert('Exporting Analytics CSV Report...')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-elevated hover:bg-surface-overlay text-text-primary border border-border-subtle hover:border-outline-variant font-mono-label text-mono-label transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[15px] text-status-info">download</span>
            <span>Export CSV / Report</span>
          </button>
        </div>
      </div>

      {/* 4 High-Density Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-surface-card border border-border-subtle relative overflow-hidden flex flex-col justify-between group hover:border-status-info transition-all shadow-sm"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-status-success/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-start justify-between">
              <span className="font-mono-label text-mono-label text-text-secondary uppercase tracking-wider">
                {m.title}
              </span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-status-success/10 text-status-success font-mono-label text-mono-label border border-status-success/20">
                <span className="material-symbols-outlined text-[12px]">{m.icon}</span>
                {m.change}
              </span>
            </div>
            <div className="my-3 flex items-baseline gap-1.5">
              <span className="font-mono-metric text-headline-xl text-text-primary">
                {m.value}
                <span className="text-headline-sm text-text-secondary ml-0.5">{m.unit}</span>
              </span>
            </div>
            <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-mono-label font-mono-label text-text-muted">
              <span>{m.subtext}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Resolution Velocity & Runbook Effectiveness Table */}
      <div className="p-5 rounded-xl bg-surface-card border border-border-subtle shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">
              checklist_rtl
            </span>
            <h2 className="font-headline-sm text-headline-sm text-text-primary">
              Recent Triaged Incidents &amp; MTTR Reduction
            </h2>
          </div>
          <span className="font-mono-label text-mono-label text-text-muted">
            Live Post-Mortem Feed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead>
              <tr className="border-b border-border-subtle font-mono-label text-mono-label text-text-muted uppercase">
                <th className="py-2.5 px-3">Incident ID</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Failure Category</th>
                <th className="py-2.5 px-3">Actual MTTR</th>
                <th className="py-2.5 px-3">Baseline</th>
                <th className="py-2.5 px-3">Reduction</th>
                <th className="py-2.5 px-3">Re-used Runbook</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {recentIncidentsAnalytics.map((inc) => (
                <tr key={inc.id} className="hover:bg-surface-elevated/50 transition-colors">
                  <td className="py-3 px-3 font-mono-metric text-status-info font-bold">
                    {inc.id}
                  </td>
                  <td className="py-3 px-3 font-mono-code text-text-secondary">{inc.service}</td>
                  <td className="py-3 px-3 text-text-primary">{inc.type}</td>
                  <td className="py-3 px-3 font-mono-code text-status-success font-semibold">
                    {inc.mttr}
                  </td>
                  <td className="py-3 px-3 font-mono-code text-text-muted line-through">
                    {inc.baseline}
                  </td>
                  <td className="py-3 px-3 font-mono-code text-secondary font-bold">
                    {inc.savings}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-surface-base border border-border-subtle font-mono-label text-mono-label text-primary">
                      {inc.reusedRunbook}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
