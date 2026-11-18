import { useState, type FormEvent } from 'react';
import { Database, Lock, ArrowRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { FormField } from '../components/common/FormField';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { AuthLayout } from '../layouts/AuthLayout';
import { ApiClientError } from '../services/apiClient';
import { validateEmail } from '../utils/validators';

export function LoginPage() {
  const { login, enterPreviewSession, authStatus } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const mongoReady = authStatus?.persistentAuthReady ?? false;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setServerError(null);

    const emailErr = validateEmail(email);
    const passwordErr = password ? null : 'Password is required.';

    if (emailErr || passwordErr) {
      setFieldErrors({
        email: emailErr || undefined,
        password: passwordErr || undefined,
      });
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const user = await login({ email: email.trim(), password });
      showToast({
        variant: 'success',
        title: 'Signed in',
        description: `Authenticated as ${user.email}`,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setServerError(err.message);
      } else {
        setServerError('Unable to reach authentication service.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreviewSession = async () => {
    setServerError(null);
    setPreviewLoading(true);
    try {
      await enterPreviewSession();
      showToast({
        variant: 'warning',
        title: 'Preview session active',
        description: 'Non-persistent workspace session started. MongoDB is not configured.',
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Unable to start preview session.'
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to NexusFlow"
      subtitle="Access industrial telemetry streams, device fleets, and rule workflows."
    >
      {!mongoReady && (
        <div className="rounded-md bg-[#111C2E] border border-[#F59E0B]/40 p-3.5 space-y-2">
          <div className="flex items-start gap-2.5">
            <Database className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-slate-100">
                MongoDB is not configured
              </p>
              <p className="mt-1 text-slate-400">
                Persistent login and registration require <code className="font-mono text-slate-200">MONGODB_URI</code>. You can test form validation below or launch a non-persistent Phase 1 preview session.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handlePreviewSession}
            disabled={previewLoading}
            className="w-full h-9 px-3 rounded-md bg-[#172338] border border-[#22324D] hover:border-[#3B82F6] text-xs font-medium text-slate-100 flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            <span>
              {previewLoading ? 'Starting preview session...' : 'Continue in Non-Persistent Preview Mode'}
            </span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {serverError && <ErrorMessage title="Authentication Notice" message={serverError} />}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField
          id="login-email"
          label="Work email"
          type="email"
          autoComplete="email"
          placeholder="operator@plant-ops.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />

        <FormField
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-10 px-4 rounded-md bg-[#3B82F6] hover:bg-[#2563EB] text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
        >
          <Lock className="w-4 h-4" aria-hidden="true" />
          <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
        </button>
      </form>

      <div className="pt-3 border-t border-[#22324D] flex items-center justify-between text-xs text-slate-400">
        <span>Need an operator account?</span>
        <Link to="/register" className="text-[#3B82F6] font-medium hover:underline">
          Create account
        </Link>
      </div>
    </AuthLayout>
  );
}
