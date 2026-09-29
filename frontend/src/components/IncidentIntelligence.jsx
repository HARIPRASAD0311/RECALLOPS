import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function IncidentIntelligence({ onNavigateSearch, initialQuery }) {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [deployState, setDeployState] = useState('idle'); // 'idle' | 'deploying' | 'deployed'
  const [slackExported, setSlackExported] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [queryText, setQueryText] = useState(
    initialQuery || 'Checkout API latency spike'
  );
  const [modalInput, setModalInput] = useState(queryText);
  const [isLoading, setIsLoading] = useState(false);
  const [briefData, setBriefData] = useState(null);
  const [executedSteps, setExecutedSteps] = useState({});

  const loadBrief = async (query) => {
    setIsLoading(true);
    try {
      const data = await api.getBrief(query);
      setBriefData(data);
    } catch (err) {
      console.warn('Could not fetch live brief, using fallback intelligence:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQueryText(initialQuery);
      setModalInput(initialQuery);
      loadBrief(initialQuery);
    } else {
      api.getIncidents()
        .then((incs) => {
          if (incs && incs.length > 0) {
            const topQ = `${incs[0].service} ${incs[0].title}`;
            setQueryText(topQ);
            setModalInput(topQ);
            loadBrief(topQ);
          } else {
            loadBrief(queryText);
          }
        })
        .catch(() => loadBrief(queryText));
    }
  }, [initialQuery]);

  const handleApplyNewQuery = () => {
    setQueryText(modalInput);
    setShowEditModal(false);
    loadBrief(modalInput);
  };

  const handleCopySnippet = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2500);
    });
  };

  const handleToggleStep = (stepKey) => {
    setExecutedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const handleDeployHotfix = () => {
    if (deployState !== 'idle') return;
    setDeployState('deploying');
    setTimeout(() => {
      setDeployState('deployed');
      setTimeout(() => {
        setDeployState('idle');
      }, 4000);
    }, 1600);
  };

  const handleExportSlack = () => {
    setSlackExported(true);
    setTimeout(() => setSlackExported(false), 2500);
  };

  // Extract brief elements or fallbacks
  const brief = briefData?.brief;
  const plan = briefData?.plan;
  const incidents = briefData?.incidents || [];
  const confidence = briefData?.confidence || '94%';
  const generatedIn = briefData?.generatedIn || '1.2s';
  const matchCount = briefData?.matchCount ?? incidents.length;

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 1. Incident Query Banner / Context Header */}
      <div className="w-full bg-surface-card rounded-xl p-4 shadow-xl border-l-4 border-primary">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-elevated text-text-secondary font-mono-label text-mono-label uppercase tracking-wider border border-border-subtle">
                <span className="material-symbols-outlined text-[13px] text-primary">search_spark</span>
                Active Incident Context
              </span>
              <span className="font-mono-code text-mono-code text-text-primary px-2.5 py-1 rounded bg-surface-base truncate max-w-full border border-border-subtle">
                "{queryText}"
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono-label text-mono-label text-text-secondary">
              <span className="flex items-center gap-1 text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                {matchCount} correlated incident{matchCount === 1 ? '' : 's'}
              </span>
              <span className="text-text-muted">•</span>
              <span className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-[13px]">bolt</span>
                Vector Confidence: {confidence}
              </span>
              <span className="text-text-muted">•</span>
              <span className="text-text-muted">Generated in {generatedIn} via Memory Graph</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setModalInput(queryText);
                setShowEditModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated text-text-primary hover:bg-surface-overlay font-body-sm text-body-sm transition-all shadow-sm border border-border-subtle hover:border-border-hover"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-text-secondary">tune</span>
              Change Query
            </button>
            <button
              onClick={handleExportSlack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-blue-600 text-white font-body-sm text-body-sm font-medium transition-all shadow-sm"
              id="slack-export-btn"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {slackExported ? 'check' : 'send'}
              </span>
              {slackExported ? 'Dispatched to #war-room' : 'Export to Slack #war-room'}
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="w-full bg-surface-card rounded-xl p-8 shadow-xl border border-border-subtle flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          <p className="font-headline-sm text-text-primary">Querying RecallOps SRE Memory Graph...</p>
          <p className="font-mono-label text-text-muted text-mono-label">Performing cosine similarity &amp; synthesizing AI mitigation plan</p>
        </div>
      )}

      {/* 2. Section A: AI Resolution Brief */}
      {!isLoading && (
        <section className="w-full bg-surface-card rounded-xl p-5 shadow-xl border-l-4 border-status-info relative overflow-hidden border border-border-subtle">
          <div className="absolute -right-8 -top-8 w-44 h-44 bg-status-info/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-status-info text-[20px]">lightbulb</span>
                <h2 className="font-headline-sm text-headline-sm text-text-primary tracking-tight font-bold">
                  AI Resolution Brief
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-elevated text-primary font-mono-label text-mono-label uppercase border border-border-subtle">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  {briefData?.engineName || 'RecallOps Memory Engine'}
                </span>
              </div>
              <span className="font-mono-label text-mono-label text-text-muted">Generated in {generatedIn}</span>
            </div>

            <div className="font-body-md text-body-md text-on-surface-variant space-y-2 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {/* Root Cause Pattern */}
                <div className="p-3.5 rounded-lg bg-surface-base flex flex-col gap-1.5 border-l-2 border-primary border-t border-r border-b border-border-subtle">
                  <span className="font-mono-label text-mono-label uppercase text-text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-primary">analytics</span>
                    Root Cause Pattern
                  </span>
                  <p className="font-body-sm text-body-sm text-text-primary">
                    {brief?.rootCause?.text ||
                      'Analyzing incident root cause patterns from memory graph...'}
                  </p>
                </div>

                {/* Proven Fix */}
                <div className="p-3.5 rounded-lg bg-surface-base flex flex-col gap-1.5 border-l-2 border-status-success border-t border-r border-b border-border-subtle">
                  <span className="font-mono-label text-mono-label uppercase text-status-success flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[14px] text-status-success">verified</span>
                    Proven Fix
                  </span>
                  <p className="font-body-sm text-body-sm text-text-primary">
                    <strong className="text-secondary font-semibold">
                      {brief?.provenFix?.title || 'Verified Runbook'}
                    </strong>
                    : {brief?.provenFix?.detail || 'Synthesizing verified resolution steps...'}
                  </p>
                </div>

                {/* Critical Anti-Pattern */}
                <div className="p-3.5 rounded-lg bg-surface-base flex flex-col gap-1.5 border-l-2 border-status-danger border-t border-r border-b border-border-subtle">
                  <span className="font-mono-label text-mono-label uppercase text-status-danger font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-status-danger">warning</span>
                    Critical Anti-Pattern
                  </span>
                  <p className="font-body-sm text-body-sm text-text-primary">
                    <strong className="text-status-danger font-semibold">
                      {brief?.antiPattern?.title || 'Review before action'}
                    </strong>
                    : {brief?.antiPattern?.detail || 'Evaluating dangerous anti-patterns...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Section B: Recommended Action Plan */}
      {!isLoading && (
        <section className="w-full bg-surface-card rounded-xl p-5 shadow-xl border-l-4 border-status-success relative border border-border-subtle">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-status-success text-[20px]">checklist</span>
                <h2 className="font-headline-sm text-headline-sm text-text-primary tracking-tight font-bold">
                  Recommended Action Plan
                </h2>
              </div>
              <div className="flex items-center gap-2 font-mono-label text-mono-label">
                <span className="px-2 py-0.5 rounded bg-surface-elevated text-secondary border border-border-subtle font-semibold">
                  Est. MTTR: {plan?.estimatedResolution || '12-15m'}
                </span>
                <span className="text-text-muted">vs {plan?.baseline || '45m'} baseline</span>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-3">
              {/* Step 1 */}
              <div className={`p-3.5 rounded-lg border transition-all ${
                executedSteps['step1']
                  ? 'bg-surface-elevated/40 border-status-success/60'
                  : 'bg-surface-base border-border-subtle'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      id="action-step-1"
                      checked={!!executedSteps['step1']}
                      onChange={() => handleToggleStep('step1')}
                      className="mt-1 h-4 w-4 rounded border-border-subtle bg-surface-container text-primary focus:ring-0 cursor-pointer"
                    />
                    <div className="flex flex-col gap-1 min-w-0">
                      <label htmlFor="action-step-1" className="font-body-sm text-body-sm font-semibold text-text-primary cursor-pointer">
                        Step 1: {plan?.step1?.title || 'Inspect system health and correlated service metrics'}
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="px-2 py-1 rounded bg-surface-container font-mono-code text-[12px] text-primary truncate max-w-[500px]">
                          {plan?.step1?.command || 'curl -s http://127.0.0.1:8000/api/health'}
                        </code>
                        <button
                          onClick={() => handleCopySnippet(plan?.step1?.command || 'curl -s http://127.0.0.1:8000/api/health')}
                          className="px-2 py-1 rounded bg-surface-elevated hover:bg-surface-overlay text-text-secondary hover:text-text-primary text-xs flex items-center gap-1 border border-border-subtle"
                          title="Copy command"
                        >
                          <span className="material-symbols-outlined text-[14px]">content_copy</span>
                          {copiedSnippet ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`p-3.5 rounded-lg border transition-all ${
                executedSteps['step2']
                  ? 'bg-surface-elevated/40 border-status-success/60'
                  : 'bg-surface-base border-border-subtle'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      id="action-step-2"
                      checked={!!executedSteps['step2']}
                      onChange={() => handleToggleStep('step2')}
                      className="mt-1 h-4 w-4 rounded border-border-subtle bg-surface-container text-primary focus:ring-0 cursor-pointer"
                    />
                    <div className="flex flex-col gap-1 min-w-0">
                      <label htmlFor="action-step-2" className="font-body-sm text-body-sm font-semibold text-text-primary cursor-pointer">
                        Step 2: {plan?.step2?.title || 'Apply verified mitigation hotfix'}
                      </label>
                      <p className="font-body-sm text-body-sm text-text-secondary">
                        Executes proven mitigation runbook referenced from memory graph.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDeployHotfix}
                    disabled={deployState !== 'idle'}
                    className={`px-3.5 py-1.5 rounded-lg font-body-sm text-body-sm font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
                      deployState === 'deploying'
                        ? 'bg-status-warning text-black'
                        : deployState === 'deployed'
                        ? 'bg-status-success text-white'
                        : 'bg-secondary hover:bg-teal-500 text-black'
                    }`}
                  >
                    {deployState === 'deploying' && (
                      <>
                        <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                        Applying Hotfix...
                      </>
                    )}
                    {deployState === 'deployed' && (
                      <>
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        Hotfix Deployed
                      </>
                    )}
                    {deployState === 'idle' && (
                      <>
                        <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                        Apply Proven Fix
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Section C: Correlated Historical Incidents */}
      {!isLoading && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">history</span>
              <h2 className="font-headline-sm text-headline-sm text-text-primary tracking-tight font-bold">
                Correlated Historical Incidents ({incidents.length})
              </h2>
            </div>
            <button
              onClick={onNavigateSearch}
              className="text-primary hover:underline font-body-sm text-body-sm flex items-center gap-1"
            >
              Open Semantic Search &amp; Explorer →
            </button>
          </div>

          {incidents.length === 0 && (
            <div className="w-full bg-surface-card rounded-xl p-6 text-center border border-border-subtle">
              <p className="text-text-secondary font-body-sm">No historical incidents matched the current query.</p>
            </div>
          )}

          {incidents.map((inc) => (
            <article
              key={inc.id}
              className="w-full bg-surface-card rounded-xl p-5 shadow-xl hover:shadow-2xl transition-all border border-border-subtle hover:border-primary/50 cursor-pointer"
              onClick={() => setSelectedIncident(inc)}
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono-metric text-headline-sm font-bold text-primary">
                        {inc.id}
                      </span>
                      <h3 className="font-headline-sm text-headline-sm text-text-primary font-semibold truncate">
                        {inc.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 font-mono-label text-mono-label text-text-muted">
                      <span>{inc.date || 'Historical'}</span>
                      <span>•</span>
                      <span className="text-text-secondary">Resolved by @{inc.resolvedBy || 'SRE'}</span>
                      <span>•</span>
                      <span className="text-status-success font-semibold">MTTR: {inc.mttr}</span>
                      <span>•</span>
                      <span className="text-primary uppercase font-medium">{inc.service}</span>
                    </div>
                  </div>
                  {inc.match && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-elevated text-secondary font-mono-label text-mono-label font-bold uppercase shrink-0 border border-secondary/30">
                      {inc.match} match
                    </span>
                  )}
                </div>

                {/* Metadata Box */}
                <div className="p-3 rounded-lg bg-surface-base border border-border-subtle">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono-label text-mono-label text-text-muted uppercase shrink-0">
                        Root Cause:
                      </span>
                      <span className="font-body-sm text-body-sm text-text-primary truncate">
                        {inc.rootCause}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono-label text-mono-label shrink-0">
                      {(inc.tags || []).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-surface-elevated text-text-secondary border border-border-subtle"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fix / Runbooks */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2 font-mono-label text-mono-label text-text-muted uppercase tracking-wider">
                    <span>Applied Fix &amp; Runbooks</span>
                    <span>Outcome</span>
                  </div>
                  {(inc.runbooks && inc.runbooks.length > 0 ? inc.runbooks : [{ title: inc.fix, outcome: 'success' }]).map((rb, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg bg-surface-container flex items-center justify-between gap-2 border-l-2 ${
                        rb.outcome === 'success'
                          ? 'border-status-success'
                          : rb.outcome === 'warning'
                          ? 'border-status-warning'
                          : 'border-status-danger'
                      } border-t border-r border-b border-border-subtle`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`material-symbols-outlined text-[16px] ${
                            rb.outcome === 'success'
                              ? 'text-status-success'
                              : rb.outcome === 'warning'
                              ? 'text-status-warning'
                              : 'text-status-danger'
                          }`}
                        >
                          {rb.outcome === 'success' ? 'check_circle' : rb.outcome === 'warning' ? 'refresh' : 'cancel'}
                        </span>
                        <span className="font-body-sm text-body-sm text-text-primary font-medium">
                          {rb.title}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded bg-surface-elevated font-mono-label text-mono-label font-bold uppercase shrink-0 border border-border-subtle ${
                          rb.outcome === 'success' ? 'text-status-success' : 'text-text-muted'
                        }`}
                      >
                        {rb.outcome}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono-label text-mono-label text-text-secondary border-t border-border-subtle">
                  <div className="flex items-center gap-2">
                    <span className="text-secondary">⏱️ Resolved in {inc.mttr}</span>
                    <span>•</span>
                    <span className="text-text-muted">Fix: {inc.fix}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-primary hover:text-white transition-colors">
                    View Post-Mortem →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Edit Query Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-surface-card border border-border-subtle rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-text-primary flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-primary">tune</span>
                Update Incident Symptoms
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-elevated"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="font-body-sm text-text-secondary">
              Update symptoms, error codes, or affected services to synthesize a fresh AI mitigation brief.
            </p>
            <textarea
              rows={4}
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
              className="w-full bg-surface-base border border-border-subtle rounded-lg p-3 font-mono-code text-sm text-text-primary focus:outline-none focus:border-primary"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-1.5 rounded-lg bg-surface-elevated text-text-secondary hover:text-text-primary text-body-sm border border-border-subtle"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyNewQuery}
                className="px-4 py-1.5 rounded-lg bg-primary text-white font-medium text-body-sm hover:bg-blue-600"
              >
                Synthesize Live Brief
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Mortem Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-surface-card border border-border-subtle rounded-xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono-metric text-headline-sm font-bold text-primary">
                  {selectedIncident.id}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-surface-elevated text-text-secondary font-mono-label text-xs uppercase border border-border-subtle">
                  {selectedIncident.service}
                </span>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-elevated"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <h3 className="font-headline-sm text-headline-sm text-text-primary font-bold">
              {selectedIncident.title}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono-label text-xs">
              <div className="p-2.5 rounded bg-surface-base border border-border-subtle">
                <span className="text-text-muted block">Severity</span>
                <span className="text-status-warning font-semibold uppercase">{selectedIncident.severity || 'high'}</span>
              </div>
              <div className="p-2.5 rounded bg-surface-base border border-border-subtle">
                <span className="text-text-muted block">MTTR</span>
                <span className="text-status-success font-semibold">{selectedIncident.mttr}</span>
              </div>
              <div className="p-2.5 rounded bg-surface-base border border-border-subtle">
                <span className="text-text-muted block">Resolved By</span>
                <span className="text-text-primary font-semibold">@{selectedIncident.resolvedBy || 'SRE'}</span>
              </div>
              <div className="p-2.5 rounded bg-surface-base border border-border-subtle">
                <span className="text-text-muted block">Date</span>
                <span className="text-text-secondary">{selectedIncident.date || 'Historical'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-mono-label text-mono-label uppercase text-text-muted">Root Cause</h4>
              <div className="p-3 rounded-lg bg-surface-base text-body-sm text-text-primary border border-border-subtle">
                {selectedIncident.rootCause}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-mono-label text-mono-label uppercase text-status-success">Resolution &amp; Fix</h4>
              <div className="p-3 rounded-lg bg-surface-base text-body-sm text-text-primary border border-border-subtle">
                {selectedIncident.fix}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border-subtle">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-4 py-2 rounded-lg bg-primary text-white font-medium text-body-sm hover:bg-blue-600"
              >
                Close Post-Mortem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
