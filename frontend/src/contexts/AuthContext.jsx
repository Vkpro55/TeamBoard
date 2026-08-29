import { useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth';
import { getAccessToken } from '../api/client';
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
                const storedToken = getAccessToken();
                if (storedToken) {
                    try {
                        const { user: currentUser } = await authApi.me();
                        if (!isCancelled) {
                            setUser(currentUser);
                            setError('');
                        }
                        return;
                    } catch {
                        // Fall through and try to refresh the session from the refresh cookie.
                    }
                }

                const { user: refreshedUser } = await authApi.refresh();
                if (!isCancelled) {
                    setUser(refreshedUser);
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
            return await authApi.signup(payload);
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

    const updateCurrentUser = useCallback((updatedUser) => {
        setUser(updatedUser);
    }, []);

    const value = useMemo(() => ({
        user,
        loading,
        error,
        login,
        signup,
        logout,
        updateCurrentUser,
        isAuthenticated: Boolean(user),
    }), [user, loading, error, login, signup, logout, updateCurrentUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
