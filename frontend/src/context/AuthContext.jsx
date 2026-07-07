import {
	createContext,
	useContext,
	useCallback,
	useEffect,
	useState,
} from "react";
import { authApi } from "../lib/services";
import { TOKEN_KEY } from "../lib/api";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(!!localStorage.getItem(TOKEN_KEY));

	useEffect(() => {
		const token = localStorage.getItem(TOKEN_KEY);
		if (!token) {
			return;
		}

		authApi
			.me()
			.then((res) => setUser(res.user))
			.catch(() => localStorage.removeItem(TOKEN_KEY))
			.finally(() => setLoading(false));
	}, []);

	const persist = useCallback((res) => {
		localStorage.setItem(TOKEN_KEY, res.token);
		setUser(res.user);
		return res.user;
	});

	const login = useCallback(
		async (credentials) => {
			const res = await authApi.login(credentials);
			return persist(res);
		},
		[persist],
	);

	const register = useCallback(
		async (data) => {
			const res = await authApi.register(data);
			return persist(res);
		},
		[persist],
	);

	const logout = useCallback(() => {
		localStorage.removeItem(TOKEN_KEY);
		setUser(null);
	}, []);

	const updateUser = useCallback((patch) => {
		setUser((prev) => ({ ...prev, ...patch }));
	}, []);

	return (
		<AuthContext.Provider
			value={{ user, loading, login, register, logout, updateUser }}
		>
			{children}
		</AuthContext.Provider>
	);
}

/* eslint-disable react-refresh/only-export-components */
export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}
