/** biome-ignore-all lint/correctness/noUnusedVariables: <explanation> */
import axios from "axios";

export const TOKEN_KEY = "ttp_crm_token";

// eslint-disable-next-line no-unused-vars
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
	baseURL: baseUrl,
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem(TOKEN_KEY);
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

api.interceptors.response.use(
	(res) => res.data,
	(error) => {
		const status = error.response?.status;
		const message =
			error.response?.data?.message || error.message || "Something went wrong";

		if (status === 401 && !window.location.pathname.startsWith("/login")) {
			localStorage.removeItem(TOKEN_KEY);
		}

		return Promise.reject({ status, message });
	},
);

export default api;
