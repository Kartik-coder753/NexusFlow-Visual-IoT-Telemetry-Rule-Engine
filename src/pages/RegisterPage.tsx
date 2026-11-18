import { useState, type FormEvent } from 'react';
import { Database, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { FormField } from '../components/common/FormField';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { AuthLayout } from '../layouts/AuthLayout';
import { ApiClientError } from '../services/apiClient';
import { validateEmail, validateName, validatePassword } from '../utils/validators';

export function RegisterPage() {
  const { register, authStatus } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const mongoReady = authStatus?.persistentAuthReady ?? false;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setServerError(null);

    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password, 8);
    const confirmErr =
      password !== confirmPassword ? 'Passwords do not match.' : null;

    if (nameErr || emailErr || passwordErr || confirmErr) {
      setFieldErrors({
        name: nameErr || undefined,
        email: emailErr || undefined,
        password: passwordErr || undefined,
        confirmPassword: confirmErr || undefined,
      });
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const user = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        organization: organization.trim() || undefined,
      });
      showToast({
        variant: 'success',
        title: 'Account created',
        description: `Welcome to NexusFlow, ${user.name}.`,
      });
      navigate('/', { replace: true });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setServerError(err.message);
      } else {
        setServerError('Unable to reach registration endpoint.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create operator account"
      subtitle="Register an account with bcrypt password hashing and JWT session authentication."
    >
      {!mongoReady && (
        <div className="rounded-md bg-[#111C2E] border border-[#F59E0B]/40 p-3.5 flex items-start gap-2.5">
          <Database className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <p className="font-semibold text-slate-100">
              Database configuration required for account persistence
            </p>
            <p className="mt-1 text-slate-400">
              Account records are stored in MongoDB via the <code className="font-mono text-slate-200">User</code> model. Configure <code className="font-mono text-slate-200">MONGODB_URI</code> to persist new registrations.
            </p>
          </div>
        </div>
      )}

      {serverError && <ErrorMessage title="Registration Error" message={serverError} />}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField
          id="register-name"
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Elena Vance"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fieldErrors.name}
        />

        <FormField
          id="register-email"
          label="Work email"
          type="email"
          autoComplete="email"
          placeholder="elena@plant-ops.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />

        <FormField
          id="register-organization"
          label="Facility / Organization (optional)"
          type="text"
          placeholder="Turbine Plant Sector 4"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />

        <FormField
          id="register-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />

        <FormField
          id="register-confirm-password"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-10 px-4 rounded-md bg-[#3B82F6] hover:bg-[#2563EB] text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
        >
          <UserPlus className="w-4 h-4" aria-hidden="true" />
          <span>{submitting ? 'Creating account...' : 'Create Account'}</span>
        </button>
      </form>

      <div className="pt-3 border-t border-[#22324D] flex items-center justify-between text-xs text-slate-400">
        <span>Already registered?</span>
        <Link to="/login" className="text-[#3B82F6] font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
