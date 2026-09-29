import React, { useState } from 'react';
import { api } from '../services/api';

export default function LogIncidentModal({ isOpen, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [service, setService] = useState('payments-api');
  const [type, setType] = useState('Latency');
  const [severity, setSeverity] = useState('high');
  const [rootCause, setRootCause] = useState('');
  const [fix, setFix] = useState('');
  const [resolvedBy, setResolvedBy] = useState('Alex K.');
  const [mttrMinutes, setMttrMinutes] = useState(15);
  const [baselineMinutes, setBaselineMinutes] = useState(50);
  const [tagsInput, setTagsInput] = useState('latency, db-pool');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !rootCause.trim() || !fix.trim()) {
      setErrorMsg('Please fill in title, root cause, and fix details.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const newInc = await api.createIncident({
        title,
        service,
        type,
        severity,
        description: title,
        root_cause: rootCause,
        fix,
        resolved_by: resolvedBy,
        mttr_minutes: Number(mttrMinutes),
        baseline_minutes: Number(baselineMinutes),
        tags,
        runbooks: [{ title: fix, outcome: 'success' }],
      });

      if (onCreated) onCreated(newInc);
      onClose();
    } catch (err) {
      console.error('Error creating incident:', err);
      setErrorMsg(err.message || 'Failed to ingest incident.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-surface-card border border-border-subtle rounded-xl p-6 max-w-xl w-full shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">post_add</span>
            <h2 className="font-headline-sm text-text-primary font-bold">Log New Post-Mortem Incident</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-elevated"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-status-danger/15 border border-status-danger/30 text-status-danger text-xs font-mono-label">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-body-sm">
          <div className="space-y-1">
            <label className="font-mono-label text-xs uppercase text-text-secondary">Incident Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Postgres Connection Pool Saturation on Checkout"
              className="w-full bg-surface-base border border-border-subtle rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-primary font-mono-code text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-mono-label text-xs uppercase text-text-secondary">Service</label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-surface-base border border-border-subtle rounded-lg p-2 text-text-primary focus:outline-none focus:border-primary font-mono-code text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono-label text-xs uppercase text-text-secondary">Type</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-surface-base border border-border-subtle rounded-lg p-2 text-text-primary focus:outline-none focus:border-primary font-mono-code text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono-label text-xs uppercase text-text-secondary">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-surface-base border border-border-subtle rounded-lg p-2 text-text-primary focus:outline-none focus:border-primary font-mono-code text-xs cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono-label text-xs uppercase text-text-secondary">Root Cause Description *</label>
            <textarea
              rows={2}
              required
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              placeholder="What specifically failed or led to the outage?"
              className="w-full bg-surface-base border border-border-subtle rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-primary font-body-sm text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono-label text-xs uppercase text-status-success font-semibold">Verified Fix &amp; Mitigation *</label>
            <textarea
              rows={2}
              required
              value={fix}
              onChange={(e) => setFix(e.target.value)}
              placeholder="What specific actions, config changes, or runbooks resolved it?"
              className="w-full bg-surface-base border border-border-subtle rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-primary font-body-sm text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-mono-label text-xs uppercase text-text-secondary">MTTR (min)</label>
              <input
                type="number"
                value={mttrMinutes}
                onChange={(e) => setMttrMinutes(e.target.value)}
                className="w-full bg-surface-base border border-border-subtle rounded-lg p-2 text-text-primary focus:outline-none focus:border-primary font-mono-code text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono-label text-xs uppercase text-text-secondary">Baseline (min)</label>
              <input
                type="number"
                value={baselineMinutes}
                onChange={(e) => setBaselineMinutes(e.target.value)}
                className="w-full bg-surface-base border border-border-subtle rounded-lg p-2 text-text-primary focus:outline-none focus:border-primary font-mono-code text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono-label text-xs uppercase text-text-secondary">Resolved By</label>
              <input
                type="text"
                value={resolvedBy}
                onChange={(e) => setResolvedBy(e.target.value)}
                className="w-full bg-surface-base border border-border-subtle rounded-lg p-2 text-text-primary focus:outline-none focus:border-primary font-mono-code text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-mono-label text-xs uppercase text-text-secondary">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="latency, database, redis, timeouts"
              className="w-full bg-surface-base border border-border-subtle rounded-lg p-2 text-text-primary focus:outline-none focus:border-primary font-mono-code text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-elevated text-text-secondary hover:text-text-primary text-xs font-mono-label"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-primary hover:bg-blue-600 text-white font-medium text-xs font-mono-label flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  Generating Vector Embedding...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  Ingest into Memory Graph
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
