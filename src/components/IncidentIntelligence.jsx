import React, { useState } from 'react';

export default function IncidentIntelligence({ onNavigateSearch }) {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [deployState, setDeployState] = useState('idle'); // 'idle' | 'deploying' | 'deployed'
  const [slackExported, setSlackExported] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [queryText, setQueryText] = useState(
    'API latency spike · DB pool exhausted · payments 504s'
  );

  const handleCopySnippet = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2500);
    });
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

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* 1. Incident Query Banner / Context Header */}
      <div className="w-full bg-surface-card rounded-xl p-4 shadow-xl border-l-2 border-primary">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-elevated text-text-secondary font-mono-label text-mono-label uppercase tracking-wider">
                <span className="material-symbols-outlined text-[13px] text-primary">search_spark</span>
                Live Query Token
              </span>
              <span className="font-mono-code text-mono-code text-text-primary px-2.5 py-1 rounded bg-surface-base truncate max-w-full">
                "{queryText}"
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono-label text-mono-label text-text-secondary">
              <span className="flex items-center gap-1 text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                3 past matches found
              </span>
              <span className="text-text-muted">•</span>
              <span className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-[13px]">bolt</span>
                Confidence score: 94%
              </span>
              <span className="text-text-muted">•</span>
              <span className="text-text-muted">Generated in 1.2s via Vector Space Graph</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-elevated text-text-primary hover:bg-surface-overlay font-body-sm text-body-sm transition-all shadow-sm border border-border-subtle hover:border-border-hover"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-text-secondary">tune</span>
              Edit Query
            </button>
            <button
              onClick={handleExportSlack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-status-info text-white hover:bg-blue-600 font-body-sm text-body-sm font-medium transition-all shadow-sm"
              id="slack-export-btn"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {slackExported ? 'check' : 'send'}
              </span>
              {slackExported ? 'Exported to #war-room' : 'Export to Slack #war-room'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Section A: AI Resolution Brief */}
      <section className="w-full bg-surface-card rounded-xl p-5 shadow-xl border-l-4 border-status-info relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-status-info/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-status-info text-[20px]">lightbulb</span>
              <h2 className="font-headline-sm text-headline-sm text-text-primary tracking-tight">
                AI Resolution Brief
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-elevated text-primary font-mono-label text-mono-label uppercase border border-border-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Gemini 1.5 Pro SRE Memory Engine
              </span>
            </div>
            <span className="font-mono-label text-mono-label text-text-muted">Generated in 1.2s</span>
          </div>

          <div className="font-body-md text-body-md text-on-surface-variant space-y-2 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* Root Cause Pattern */}
              <div className="p-3 rounded-lg bg-surface-base flex flex-col gap-1 border-l-2 border-primary border-t border-r border-b border-border-subtle">
                <span className="font-mono-label text-mono-label uppercase text-text-muted">
                  Root Cause Pattern
                </span>
                <p className="font-body-sm text-body-sm text-text-primary">
                  <span className="text-primary font-semibold">INC-204</span> &amp;{' '}
                  <span className="text-primary font-semibold">INC-187</span> match (
                  <span className="text-status-success font-mono-code font-semibold">94%</span>):
                  Unclosed socket leak in billing worker threadpool.
                </p>
              </div>

              {/* Proven Fix */}
              <div className="p-3 rounded-lg bg-surface-base flex flex-col gap-1 border-l-2 border-status-success border-t border-r border-b border-border-subtle">
                <span className="font-mono-label text-mono-label uppercase text-text-muted">
                  Proven Fix
                </span>
                <p className="font-body-sm text-body-sm text-text-primary">
                  <strong className="text-secondary font-semibold">Deploy patch v2.3.1</strong> +
                  recycle pool. Reduced MTTR to{' '}
                  <span className="font-mono-code text-secondary font-semibold">12–15m</span>.
                </p>
              </div>

              {/* Critical Anti-Pattern */}
              <div className="p-3 rounded-lg bg-surface-base flex flex-col gap-1 border-l-2 border-status-danger border-t border-r border-b border-border-subtle">
                <span className="font-mono-label text-mono-label uppercase text-status-danger font-semibold">
                  Critical Anti-Pattern
                </span>
                <p className="font-body-sm text-body-sm text-text-primary">
                  <strong className="text-status-danger font-semibold">Do NOT scale HPA.</strong>{' '}
                  Amplifies DB pool contention instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section B: Recommended Action Plan */}
      <section className="w-full bg-surface-card rounded-xl p-5 shadow-xl border-l-4 border-status-success relative border border-border-subtle">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-status-success text-[20px]">task_alt</span>
              <h2 className="font-headline-sm text-headline-sm text-text-primary font-semibold">
                Recommended Action Plan
              </h2>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-elevated font-mono-label text-mono-label text-secondary border border-border-subtle">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              Estimated Resolution: 12 min (vs. 47 min baseline average)
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Action Step 1 */}
            <div className="p-3 rounded-lg bg-surface-base flex flex-col gap-2 border border-border-subtle">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-surface-elevated text-secondary font-mono-label text-mono-label font-bold uppercase border border-border-subtle">
                    P1 • Instant Relief
                  </span>
                  <span className="font-body-sm text-body-sm text-text-primary font-semibold">
                    Drain idle sockets &amp; restart PgBouncer (~2m ETA)
                  </span>
                </div>
                <span className="font-mono-label text-mono-label text-text-muted">Step 1/2</span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-surface-card p-2 rounded border border-border-subtle">
                <code className="font-mono-code text-mono-code text-text-primary px-2 py-1 select-all break-all overflow-x-auto">
                  pgbouncer restart &amp;&amp; redis-cli flushdb test_pool
                </code>
                <button
                  onClick={() =>
                    handleCopySnippet('pgbouncer restart && redis-cli flushdb test_pool')
                  }
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded bg-surface-elevated hover:bg-surface-overlay text-text-primary font-mono-label text-mono-label transition-colors shrink-0 border border-border-subtle"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedSnippet ? 'done' : 'content_copy'}
                  </span>
                  <span className={copiedSnippet ? 'text-status-success font-medium' : ''}>
                    {copiedSnippet ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Action Step 2 */}
            <div className="p-3 rounded-lg bg-surface-base flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border-subtle">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-surface-elevated text-status-info font-mono-label text-mono-label font-bold uppercase border border-border-subtle">
                    P2 • Permanent Fix
                  </span>
                  <span className="font-body-sm text-body-sm text-text-primary font-semibold">
                    Deploy patch v2.3.1 (Prisma leak fix)
                  </span>
                </div>
                <span className="font-mono-label text-mono-label text-text-secondary">
                  Verified in 2/2 past incidents
                </span>
              </div>

              <button
                onClick={handleDeployHotfix}
                disabled={deployState === 'deploying'}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-status-info hover:bg-blue-600 text-white font-body-sm text-body-sm font-semibold transition-all shrink-0 shadow-md disabled:opacity-75"
                type="button"
              >
                {deployState === 'deploying' ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">
                      progress_activity
                    </span>
                    Deploying v2.3.1...
                  </>
                ) : deployState === 'deployed' ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] text-white">
                      check_circle
                    </span>
                    Dispatched to GHA (#8492)
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                    Deploy Hotfix v2.3.1
                  </>
                )}
              </button>
            </div>

            {/* Anti-Pattern Alert Box */}
            <div className="p-2.5 rounded-lg bg-surface-container flex items-center gap-2.5 border-l-2 border-status-danger border-t border-r border-b border-border-subtle">
              <span className="material-symbols-outlined text-status-danger text-[18px] shrink-0">
                cancel
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                <strong className="text-status-danger font-semibold uppercase font-mono-label text-mono-label">
                  Anti-Pattern:
                </strong>{' '}
                Do not bump pod replicas (4→12 pods cascaded primary RDS failure in INC-204).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section C: Similar Past Incidents */}
      <section className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">manage_search</span>
            <h2 className="font-headline-sm text-headline-sm text-text-primary">
              Similar Past Incidents
            </h2>
            <span className="font-mono-label text-mono-label text-text-muted">
              (3 historical post-mortems retrieved)
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono-label text-mono-label text-text-secondary">
            <span className="w-2 h-2 rounded-full bg-status-success"></span>
            Sorted by Vector Cosine Distance
          </div>
        </div>

        {/* INCIDENT CARD 1 (Top Match - INC-204) */}
        <article className="w-full bg-surface-card rounded-xl p-5 shadow-xl hover:shadow-2xl transition-all border border-border-subtle hover:border-border-hover/60">
          <div className="flex flex-col gap-4">
            {/* Incident Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono-metric text-headline-sm font-bold text-status-info">
                    INC-204
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-text-primary truncate">
                    Payment Gateway Connection Pool Starvation under Black Friday Spike
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 font-mono-label text-mono-label text-text-muted">
                  <span>Nov 24, 2023</span>
                  <span>•</span>
                  <span className="text-text-secondary">Resolved by @dchen (Staff SRE)</span>
                  <span>•</span>
                  <span className="text-status-success font-semibold">MTTR: 12m</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-info/10 text-status-info font-mono-label text-mono-label font-bold uppercase shrink-0 border border-status-info/30">
                <span className="w-2 h-2 rounded-full bg-status-info animate-ping"></span>
                94% match
              </span>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-lg bg-surface-base border border-border-subtle">
              <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono-label text-mono-label text-text-muted uppercase">
                    Root Cause:
                  </span>
                  <span className="font-body-sm text-body-sm text-text-primary font-medium">
                    Webhook retry threadpool socket leak during traffic burst
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono-label text-mono-label">
                  <span className="px-2 py-0.5 rounded bg-surface-elevated text-status-danger border border-border-subtle">
                    latency &gt;4s
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-elevated text-status-warning border border-border-subtle">
                    pool empty
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-elevated text-text-secondary border border-border-subtle">
                    payments-service
                  </span>
                </div>
              </div>
            </div>

            {/* Fixes Tried Stack */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2 font-mono-label text-mono-label text-text-muted uppercase tracking-wider">
                <span>Evaluated Runbooks</span>
                <span>Outcome Rating</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between gap-2 border-l-2 border-status-success border-t border-r border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-status-success text-[16px]">
                    check_circle
                  </span>
                  <span className="font-body-sm text-body-sm text-text-primary font-medium">
                    Patch v2.3.1 + PgBouncer recycle (PR #1420)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-elevated text-status-success font-mono-label text-mono-label font-bold uppercase shrink-0 border border-border-subtle">
                  Resolved (5/5)
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between gap-2 border-l-2 border-status-warning border-t border-r border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-status-warning text-[16px]">
                    error
                  </span>
                  <span className="font-body-sm text-body-sm text-text-primary">
                    Restart pods only
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-elevated text-status-warning font-mono-label text-mono-label shrink-0 border border-border-subtle">
                  Temporary (Recurred in 18m)
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between gap-2 border-l-2 border-status-danger border-t border-r border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-status-danger text-[16px]">
                    cancel
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant line-through">
                    Scale HPA replicas (4 → 12)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-elevated text-status-danger font-mono-label text-mono-label font-bold uppercase shrink-0 border border-border-subtle">
                  Failed — Exhausted DB
                </span>
              </div>
            </div>

            {/* Incident Footer */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono-label text-mono-label text-text-secondary border-t border-border-subtle">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">timer</span>
                  Resolved in 12 min
                </span>
                <span>•</span>
                <span className="text-text-muted">
                  Source: Slack #incident-204 • Notion Post-Mortem #PM-89
                </span>
              </div>
              <button
                onClick={() => alert('Viewing INC-204 Full Post-Mortem & Runbook Graph')}
                className="inline-flex items-center gap-1 text-primary hover:text-white transition-colors"
                type="button"
              >
                View full incident post-mortem &amp; runbook
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </article>

        {/* INCIDENT CARD 2 (INC-187 - 88% Match) */}
        <article className="w-full bg-surface-card rounded-xl p-5 shadow-xl hover:shadow-2xl transition-all border border-border-subtle hover:border-border-hover/60">
          <div className="flex flex-col gap-4">
            {/* Incident Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono-metric text-headline-sm font-bold text-status-info">
                    INC-187
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-text-primary truncate">
                    Billing Webhook Worker Deadlock and DB Thread Pool Exhaustion
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 font-mono-label text-mono-label text-text-muted">
                  <span>Oct 12, 2023</span>
                  <span>•</span>
                  <span className="text-text-secondary">Resolved by @sara_m</span>
                  <span>•</span>
                  <span className="text-status-success font-semibold">MTTR: 15m</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-elevated text-primary font-mono-label text-mono-label font-bold uppercase shrink-0 border border-border-subtle">
                88% match
              </span>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-lg bg-surface-base border border-border-subtle">
              <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono-label text-mono-label text-text-muted uppercase">
                    Root Cause:
                  </span>
                  <span className="font-body-sm text-body-sm text-text-primary font-medium">
                    DB transaction row-lock held during external Stripe HTTP timeout
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono-label text-mono-label">
                  <span className="px-2 py-0.5 rounded bg-surface-elevated text-status-warning border border-border-subtle">
                    504 timeouts
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-elevated text-text-secondary border border-border-subtle">
                    billing-worker
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-elevated text-text-secondary border border-border-subtle">
                    postgres-core
                  </span>
                </div>
              </div>
            </div>

            {/* Fixes Tried Stack */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2 font-mono-label text-mono-label text-text-muted uppercase tracking-wider">
                <span>Evaluated Runbooks</span>
                <span>Outcome Rating</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between gap-2 border-l-2 border-status-success border-t border-r border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-status-success text-[16px]">
                    check_circle
                  </span>
                  <span className="font-body-sm text-body-sm text-text-primary font-medium">
                    HTTP timeout: 3s + Tx timeout: 5s
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-elevated text-status-success font-mono-label text-mono-label font-bold uppercase shrink-0 border border-border-subtle">
                  Resolved (5/5)
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between gap-2 border-l-2 border-status-danger border-t border-r border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-status-danger text-[16px]">
                    cancel
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant line-through">
                    Bump Postgres max_connections to 500
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-elevated text-status-danger font-mono-label text-mono-label font-bold uppercase shrink-0 border border-border-subtle">
                  Failed — Caused OOM
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono-label text-mono-label text-text-secondary border-t border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="text-secondary">⏱️ Resolved in 15 min</span>
                <span>•</span>
                <span className="text-text-muted">Source: PagerDuty #PD-4412 • Jira INC-187</span>
              </div>
              <button
                onClick={() => alert('Viewing INC-187 Runbook #187')}
                className="inline-flex items-center gap-1 text-primary hover:text-white transition-colors"
                type="button"
              >
                Post-Mortem Runbook #187 →
              </button>
            </div>
          </div>
        </article>

        {/* INCIDENT CARD 3 (INC-142 - 76% Match) */}
        <article className="w-full bg-surface-card rounded-xl p-5 shadow-xl hover:shadow-2xl transition-all border border-border-subtle hover:border-border-hover/60">
          <div className="flex flex-col gap-4">
            {/* Incident Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono-metric text-headline-sm font-bold text-status-info">
                    INC-142
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-text-primary truncate">
                    API Gateway Latency Cascade due to downstream connection starvation
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 font-mono-label text-mono-label text-text-muted">
                  <span>Aug 04, 2023</span>
                  <span>•</span>
                  <span className="text-text-secondary">Resolved by @k_patel</span>
                  <span>•</span>
                  <span className="text-status-success font-semibold">MTTR: 22m</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-elevated text-text-secondary font-mono-label text-mono-label font-bold uppercase shrink-0 border border-border-subtle">
                76% match
              </span>
            </div>

            {/* Metadata Box */}
            <div className="p-3 rounded-lg bg-surface-base border border-border-subtle">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono-label text-mono-label text-text-muted uppercase">
                    Root Cause:
                  </span>
                  <span className="font-body-sm text-body-sm text-text-primary font-medium">
                    Slow analytics queries blocking pool slots during cross-region latency
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono-label text-mono-label">
                  <span className="px-2 py-0.5 rounded bg-surface-elevated text-text-secondary border border-border-subtle">
                    api-gateway
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-elevated text-text-secondary border border-border-subtle">
                    read-pool
                  </span>
                </div>
              </div>
            </div>

            {/* Fixes Tried */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2 font-mono-label text-mono-label text-text-muted uppercase tracking-wider">
                <span>Evaluated Runbooks</span>
                <span>Outcome Rating</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between gap-2 border-l-2 border-status-success border-t border-r border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-status-success text-[16px]">
                    check_circle
                  </span>
                  <span className="font-body-sm text-body-sm text-text-primary font-medium">
                    Enabled circuit breaker on payment client
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-elevated text-status-success font-mono-label text-mono-label font-bold uppercase shrink-0 border border-border-subtle">
                  Resolved (5/5)
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between gap-2 border-l-2 border-status-warning border-t border-r border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-status-warning text-[16px]">
                    refresh
                  </span>
                  <span className="font-body-sm text-body-sm text-text-primary">
                    Flushed Envoy DNS cache
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-elevated text-status-warning font-mono-label text-mono-label shrink-0 border border-border-subtle">
                  Temporary
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono-label text-mono-label text-text-secondary border-t border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="text-secondary">⏱️ Resolved in 22 min</span>
                <span>•</span>
                <span className="text-text-muted">Source: Slack #war-room-142</span>
              </div>
              <button
                onClick={() => alert('Viewing INC-142 Runbook #142')}
                className="inline-flex items-center gap-1 text-primary hover:text-white transition-colors"
                type="button"
              >
                Post-Mortem Runbook #142 →
              </button>
            </div>
          </div>
        </article>
      </section>

      {/* Edit Query Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-surface-card border border-border-subtle rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">tune</span>
                Edit Query Symptoms
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-elevated"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="font-body-sm text-text-secondary">
              Update symptoms or error messages to re-query the vector embedding space.
            </p>
            <textarea
              rows={4}
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              className="w-full bg-surface-base border border-border-subtle rounded-lg p-3 font-mono-code text-sm text-text-primary focus:outline-none focus:border-status-info"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-1.5 rounded bg-surface-elevated text-text-secondary hover:text-text-primary text-body-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-1.5 rounded bg-status-info text-white font-medium text-body-sm hover:bg-blue-600"
              >
                Re-scan Incidents
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
