import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getStoredToken, setStoredToken } from '../services/apiClient';
import {
  createPreviewSessionRequest,
  fetchAuthStatus,
  fetchCurrentUser,
  loginRequest,
  logoutRequest,
  registerRequest,
} from '../services/authService';
import type {
  AuthStatusInfo,
  AuthUser,
  LoginCredentials,
  RegisterPayload,
} from '../types/auth.types';

interface AuthContextValue {
  user: AuthUser | null;
  authStatus: AuthStatusInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  enterPreviewSession: (input?: { name?: string; email?: string }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatusInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuthStatus = useCallback(async () => {
    try {
      const status = await fetchAuthStatus();
      setAuthStatus(status);
    } catch {
      // Non-fatal if health check temporarily unavailable
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function initializeAuth() {
      try {
        const statusPromise = fetchAuthStatus().catch(() => null);
        const token = getStoredToken();

        if (token) {
          try {
            const currentUser = await fetchCurrentUser();
            if (active) {
              setUser(currentUser);
            }
          } catch {
            setStoredToken(null);
            if (active) {
              setUser(null);
            }
          }
        }

        const status = await statusPromise;
        if (active && status) {
          setAuthStatus(status);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void initializeAuth();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const session = await loginRequest(credentials);
    setStoredToken(session.token);
    setUser(session.user);
    return session.user;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const session = await registerRequest(payload);
    setStoredToken(session.token);
    setUser(session.user);
    return session.user;
  }, []);

  const enterPreviewSession = useCallback(
    async (input?: { name?: string; email?: string }) => {
      const session = await createPreviewSessionRequest(input);
      setStoredToken(session.token);
      setUser(session.user);
      return session.user;
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Clear local session regardless of network outcome
    } finally {
      setStoredToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      authStatus,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      enterPreviewSession,
      logout,
      refreshAuthStatus,
    }),
    [
      user,
      authStatus,
      isLoading,
      login,
      register,
      enterPreviewSession,
      logout,
      refreshAuthStatus,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
