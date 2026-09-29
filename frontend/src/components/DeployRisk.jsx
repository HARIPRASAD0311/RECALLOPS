import React, { useState } from 'react';
import { api } from '../services/api';

export default function DeployRisk({ onNavigateIntelligence }) {
  const [service, setService] = useState('payments-api');
  const [changeDescription, setChangeDescription] = useState(
    'Upgrading PostgreSQL database connection pool configuration, increasing max idle connections and changing timeout parameters.'
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [riskReport, setRiskReport] = useState(null);

  const presets = [
    {
      service: 'payments-api',
      desc: 'Upgrading PostgreSQL database connection pool configuration, increasing max idle connections and changing timeout parameters.',
    },
    {
      service: 'auth-service',
      desc: 'Refactoring session token caching layer with in-memory redis cache.',
    },
    {
      service: 'gateway',
      desc: 'Updating TLS certificates and ingress route rules for production domain.',
    },
    {
      service: 'search-svc',
      desc: 'Deploying high-throughput Kafka batch consumer with async message parsing.',
    },
  ];

  const handleEvaluate = async () => {
    if (!service || !changeDescription.trim()) return;
    setIsEvaluating(true);
    try {
      const resp = await api.assessDeployRisk(service, changeDescription);
      setRiskReport(resp);
    } catch (err) {
      console.warn('Deploy risk API error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-2 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">verified_user</span>
          <h1 className="font-headline-lg text-headline-lg text-text-primary font-bold">
            Pre-Deploy Risk Assessment
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono-label text-xs uppercase border border-primary/20">
            Vector Guardrail
          </span>
        </div>
        <p className="font-body-sm text-body-sm text-text-secondary">
          Analyze planned deployments against historical post-mortems to detect regressions and recurring outage patterns before shipping.
        </p>
      </div>

      {/* Input Form */}
      <div className="p-6 rounded-xl bg-surface-card border border-border-subtle shadow-xl space-y-4">
        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono-label text-xs text-text-muted mr-1">Deploy Scenarios:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setService(p.service);
                setChangeDescription(p.desc);
              }}
              className="px-2.5 py-1 rounded bg-surface-elevated hover:bg-surface-overlay text-text-secondary hover:text-text-primary font-mono-label text-xs border border-border-subtle transition-colors"
            >
              {p.service}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="font-mono-label text-xs uppercase text-text-secondary">Target Service</label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-surface-base border border-border-subtle rounded-lg p-2.5 font-mono-code text-sm text-text-primary focus:outline-none focus:border-primary"
              placeholder="e.g. payments-api"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-mono-label text-xs uppercase text-text-secondary">Change Summary / Manifest Diff</label>
            <input
              type="text"
              value={changeDescription}
              onChange={(e) => setChangeDescription(e.target.value)}
              className="w-full bg-surface-base border border-border-subtle rounded-lg p-2.5 font-body-sm text-sm text-text-primary focus:outline-none focus:border-primary"
              placeholder="e.g. Updating connection pool timeout and retries"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleEvaluate}
            disabled={isEvaluating}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-blue-600 text-white font-medium text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Evaluating Historical Risks...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">security</span>
                Assess Deployment Risk
              </>
            )}
          </button>
        </div>
      </div>

      {/* Risk Report Output */}
      {riskReport && (
        <div className={`p-6 rounded-xl border shadow-xl space-y-4 ${
          riskReport.riskLevel === 'high'
            ? 'bg-status-danger/10 border-status-danger/40'
            : riskReport.riskLevel === 'medium'
            ? 'bg-status-warning/10 border-status-warning/40'
            : 'bg-status-success/10 border-status-success/40'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className={`material-symbols-outlined text-2xl ${
                riskReport.riskLevel === 'high'
                  ? 'text-status-danger'
                  : riskReport.riskLevel === 'medium'
                  ? 'text-status-warning'
                  : 'text-status-success'
              }`}>
                {riskReport.riskLevel === 'high' ? 'gpp_bad' : riskReport.riskLevel === 'medium' ? 'gpp_maybe' : 'gpp_good'}
              </span>
              <div>
                <h3 className="font-headline-sm text-text-primary font-bold">
                  Deploy Risk Level: <span className="uppercase font-mono-metric">{riskReport.riskLevel}</span>
                </h3>
                <span className="text-xs font-mono-label text-text-muted">
                  Correlated with {riskReport.matchCount} similar past incidents
                </span>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-mono-label font-bold uppercase border ${
              riskReport.riskLevel === 'high'
                ? 'bg-status-danger/20 text-status-danger border-status-danger/40'
                : riskReport.riskLevel === 'medium'
                ? 'bg-status-warning/20 text-status-warning border-status-warning/40'
                : 'bg-status-success/20 text-status-success border-status-success/40'
            }`}>
              {riskReport.riskLevel} Risk
            </span>
          </div>

          {/* Reasoning */}
          <div className="p-3.5 rounded-lg bg-surface-base border border-border-subtle space-y-1">
            <span className="font-mono-label text-xs uppercase text-text-muted block">Risk Reasoning</span>
            <p className="font-body-sm text-sm text-text-primary">{riskReport.reasoning}</p>
          </div>

          {/* Recommendation */}
          <div className="p-3.5 rounded-lg bg-surface-base border border-border-subtle space-y-1">
            <span className="font-mono-label text-xs uppercase text-status-success block font-semibold">Recommended Safeguards</span>
            <p className="font-body-sm text-sm text-text-primary">{riskReport.recommendation}</p>
          </div>

          {/* Related Incident IDs */}
          {riskReport.relatedIncidentIds && riskReport.relatedIncidentIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono-label text-xs">
              <span className="text-text-muted">Related Incidents to review:</span>
              {riskReport.relatedIncidentIds.map((id) => (
                <button
                  key={id}
                  onClick={() => onNavigateIntelligence(`${service} ${id}`)}
                  className="px-2.5 py-1 rounded bg-surface-elevated hover:bg-surface-overlay text-primary border border-primary/30 font-bold transition-colors"
                >
                  {id} →
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
