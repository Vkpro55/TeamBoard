import { useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Restore the user's session when the app starts.
    // If the component unmounts before the API request finishes,
    // isCancelled prevents updating state on an unmounted component.
    useEffect(() => {
        let isCancelled = false;

        const restoreSession = async () => {
            try {
                const storedToken = localStorage.getItem('accessToken');
                if (!storedToken) {
                    if (!isCancelled) {
                        setUser(null);
                        setLoading(false);
                    }
                    return;
                }

                const { user: currentUser } = await authApi.me();
                if (!isCancelled) {
                    setUser(currentUser);
                    setError('');
                }
            } catch {
                if (!isCancelled) {
                    setUser(null);
                    setError('');
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        restoreSession();

        return () => {
            isCancelled = true;
        };
    }, []);

    // Centralized login logic.
    // Handles loading state, clears previous errors,
    // authenticates the user, updates the global auth state,
    // and exposes the result to any component using AuthContext.
    const login = useCallback(async (payload) => {
        setLoading(true);
        setError('');

        try {
            const data = await authApi.login(payload);
            setUser(data.user);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const signup = useCallback(async (payload) => {
        setLoading(true);
        setError('');

        try {
            const data = await authApi.signup(payload);
            setUser(data.user);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            await authApi.logout();
            setUser(null);
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const value = useMemo(() => ({
        user,
        loading,
        error,
        login,
        signup,
        logout,
        isAuthenticated: Boolean(user),
    }), [user, loading, error, login, signup, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
