/* ─────────────────────────────────────────────────────────────────────────
   API service layer — UI-ONLY BOILERPLATE (mock mode).

   Every method currently resolves MOCK data from lib/mockData.js so the whole
   app runs without a backend. The real axios calls are kept commented right
   above each mock so that, once your backend is live, you:

     1. Enable the axios client in lib/api.js (uncomment it there).
     2. Uncomment the `import api` line below.
     3. In each method, swap the mock line for the commented real line.

   The shapes returned here match the real API exactly, so no page/component
   needs to change.
   ───────────────────────────────────────────────────────────────────────── */

import api from "./api";

/* ── Auth ───────────────────────────────────────────────────────────── */
export const authApi = {
	login: (data) => api.post("/auth/login", data),

	register: (data) => api.post("/auth/register", data),

	me: () => api.get("/auth/me"),

	updateProfile: (data) => api.patch("/auth/profile", data),
};

/* ── Leads ──────────────────────────────────────────────────────────── */
export const leadsApi = {
	list: (params) => api.get("/leads", { params }),

	get: (id) => api.get(`/leads/${id}`),

	create: (data) => api.post("/leads", data),

	update: (id, data) => api.patch(`/leads/${id}`, data),

	remove: (id) => api.delete(`/leads/${id}`),

	reorder: (updates) => api.patch("/leads/reorder", { updates }),
};

/* ── Contacts ───────────────────────────────────────────────────────── */
export const contactsApi = {
	list: (params) => api.get("/contacts", { params }),

	get: (id) => api.get(`/contacts/${id}`),

	create: (data) => api.post("/contacts", data),

	update: (id, data) => api.patch(`/contacts/${id}`, data),

	remove: (id) => api.delete(`/contacts/${id}`),
};

/* ── Notes ──────────────────────────────────────────────────────────── */
export const notesApi = {
	list: (params) => api.get("/notes", { params }),

	create: (data) => api.post("/notes", data),

	update: (id, data) => api.patch(`/notes/${id}`, data),

	remove: (id) => api.delete(`/notes/${id}`),
};

/* ── Tasks ──────────────────────────────────────────────────────────── */
export const tasksApi = {
	list: (params) => api.get("/tasks", { params }),

	create: (data) => api.post("/tasks", data),

	update: (id, data) => api.patch(`/tasks/${id}`, data),

	remove: (id) => api.delete(`/tasks/${id}`),
};

/* ── AI ─────────────────────────────────────────────────────────────── */
export const aiApi = {
	status: () => api.get("/ai/status"),

	leadSummary: (data) => api.post("/ai/lead-summary", data),

	generateEmail: (data) => api.post("/ai/generate-email", data),

	salesInsights: (data) => api.post("/ai/sales-insights", data),
};

/* ── Analytics ──────────────────────────────────────────────────────── */
export const analyticsApi = {
	overview: () => api.get("/analytics/overview"),
};
