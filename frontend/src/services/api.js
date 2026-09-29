const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Generic fetch helper with error handling and fallback support.
 */
async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message = errorBody.detail || errorBody.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}

export const api = {
  /** Check health of backend memory engine */
  getHealth: () => fetchJson('/health'),

  /** Get MTTR statistics & summary analytics */
  getStats: () => fetchJson('/stats'),

  /** Fetch list of historical incidents with optional service filter */
  getIncidents: (service = '') => {
    const query = service ? `?service=${encodeURIComponent(service)}` : '';
    return fetchJson(`/incidents${query}`);
  },

  /** Get specific incident by its code (e.g. INC-2041) */
  getIncident: (code) => fetchJson(`/incidents/${encodeURIComponent(code)}`),

  /** Create/Ingest new post-mortem incident */
  createIncident: (incidentData) =>
    fetchJson('/incidents', {
      method: 'POST',
      body: JSON.stringify(incidentData),
    }),

  /** Perform semantic vector search over historical incident memory */
  searchIncidents: (query, topK = 5) =>
    fetchJson('/search', {
      method: 'POST',
      body: JSON.stringify({ query, top_k: topK }),
    }),

  /** Generate or retrieve AI resolution brief for an incident symptom query */
  getBrief: (query) =>
    fetchJson(`/brief?query=${encodeURIComponent(query)}`),

  /** Evaluate deployment risk based on historical incidents */
  assessDeployRisk: (service, changeDescription) =>
    fetchJson('/deploy-risk', {
      method: 'POST',
      body: JSON.stringify({
        service,
        change_description: changeDescription,
      }),
    }),
};

export default api;
