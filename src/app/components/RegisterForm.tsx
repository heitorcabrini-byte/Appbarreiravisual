import { useState, useRef, useEffect, FormEvent } from 'react';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, UserPlus, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './ui/utils';
import {
  attemptRegister,
  saveSession,
  REGISTER_ERROR_MESSAGES,
  ROLE_OPTIONS,
  type UserRole,
  type RegisterError,
  type Session,
} from '../data/users';

interface RegisterFormProps {
  highContrast: boolean;
  onSuccess: (session: Session) => void;
  onGoToLogin: () => void;
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'Mínimo 6 caracteres', ok: password.length >= 6 },
    { label: 'Letra maiúscula', ok: /[A-Z]/.test(password) },
    { label: 'Número', ok: /\d/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const labels = ['', 'Fraca', 'Razoável', 'Forte'];
  const colors = ['', 'text-red-400', 'text-amber-400', 'text-emerald-400'];
  const barColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'];

  if (!password) return null;

  return (
    <div className="mt-2" aria-live="polite" aria-label={`Força da senha: ${labels[score]}`}>
      <div className="mb-1.5 flex gap-1" aria-hidden="true">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              score >= i ? barColors[score] : 'bg-border',
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className={cn('text-xs', colors[score])} style={{ fontWeight: 700 }}>
          {labels[score]}
        </span>
        <div className="flex gap-3">
          {checks.map(c => (
            <span
              key={c.label}
              className={cn('flex items-center gap-1', c.ok ? 'text-emerald-400' : 'text-muted-foreground')}
              style={{ fontSize: '0.7rem' }}
            >
              <CheckCircle2 size={11} aria-hidden="true" />
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RegisterForm({ highContrast, onSuccess, onGoToLogin }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('aluno');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<RegisterError | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => { nameRef.current?.focus(); }, []);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    await new Promise(r => setTimeout(r, 700));

    const result = attemptRegister({ name, email, role, password, confirmPassword });
    setLoading(false);

    if ('error' in result) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    await new Promise(r => setTimeout(r, 1200));
    saveSession(result.session);
    onSuccess(result.session);
  };

  const field = cn(
    'w-full rounded-xl border bg-secondary px-4 py-3.5 text-foreground',
    'placeholder:text-muted-foreground/60 transition-colors',
    'focus:outline-none focus:ring-3 focus:border-primary focus:ring-ring/70',
    'border-border',
  );

  const fieldError = (which: RegisterError) =>
    error === which ? 'border-destructive focus:ring-destructive/50' : '';

  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mb-6">
        <h2 className="text-foreground" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          Criar nova conta
        </h2>
        <p className="mt-1 text-muted-foreground" style={{ fontSize: '0.88rem' }}>
          Preencha seus dados para acessar o mural de avisos
        </p>
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-emerald-300"
            role="status"
            aria-live="assertive"
          >
            <CheckCircle2 size={22} className="shrink-0" aria-hidden="true" />
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Conta criada com sucesso!</p>
              <p style={{ fontSize: '0.82rem', marginTop: '0.15rem' }}>Entrando no sistema...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              ref={errorRef}
              role="alert"
              aria-live="assertive"
              tabIndex={-1}
              className={cn(
                'mb-5 flex items-start gap-3 rounded-xl border p-4',
                highContrast
                  ? 'border-red-400 bg-red-950/60 text-red-300'
                  : 'border-destructive/40 bg-destructive/10 text-red-300',
              )}
            >
              <AlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Erro no cadastro</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.2rem', lineHeight: 1.5 }}>
                  {REGISTER_ERROR_MESSAGES[error]}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} noValidate aria-label="Formulário de cadastro">
        {/* Name */}
        <div className="mb-4">
          <label
            htmlFor="reg-name"
            className="mb-2 flex items-center gap-2 text-foreground"
            style={{ fontSize: '0.9rem', fontWeight: 600 }}
          >
            <User size={15} aria-hidden="true" />
            Nome completo <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <input
            ref={nameRef}
            id="reg-name"
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError(null); }}
            placeholder="Seu nome completo"
            autoComplete="name"
            aria-required="true"
            aria-invalid={error === 'name-too-short' ? 'true' : 'false'}
            className={cn(field, fieldError('name-too-short'))}
            style={{ fontSize: '1rem' }}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="reg-email"
            className="mb-2 flex items-center gap-2 text-foreground"
            style={{ fontSize: '0.9rem', fontWeight: 600 }}
          >
            <Mail size={15} aria-hidden="true" />
            E-mail <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(null); }}
            placeholder="seu@email.com"
            autoComplete="email"
            aria-required="true"
            aria-invalid={error === 'email-taken' || error === 'invalid-email' ? 'true' : 'false'}
            className={cn(field, fieldError('email-taken'), fieldError('invalid-email'))}
            style={{ fontSize: '1rem' }}
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <fieldset>
            <legend
              className="mb-2 flex items-center gap-2 text-foreground"
              style={{ fontSize: '0.9rem', fontWeight: 600 }}
            >
              Tipo de usuário <span className="text-destructive" aria-hidden="true">*</span>
            </legend>
            <div className="grid grid-cols-2 gap-2" role="radiogroup">
              {ROLE_OPTIONS.map(opt => {
                const isSelected = role === opt.value;
                return (
                  <label
                    key={opt.value}
                    htmlFor={`role-${opt.value}`}
                    className={cn(
                      'flex cursor-pointer flex-col rounded-xl border p-3 transition-all',
                      'focus-within:ring-3 focus-within:ring-ring',
                      isSelected
                        ? highContrast
                          ? 'border-yellow-400 bg-yellow-400/10'
                          : 'border-primary bg-primary/10'
                        : highContrast
                        ? 'border-white/20 hover:border-white/40'
                        : 'border-border hover:border-primary/40 hover:bg-secondary/80',
                    )}
                  >
                    <input
                      type="radio"
                      id={`role-${opt.value}`}
                      name="role"
                      value={opt.value}
                      checked={isSelected}
                      onChange={() => setRole(opt.value)}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        isSelected
                          ? highContrast ? 'text-yellow-400' : 'text-primary'
                          : 'text-foreground',
                      )}
                      style={{ fontSize: '0.85rem', fontWeight: 700 }}
                    >
                      {opt.label}
                    </span>
                    <span className="text-muted-foreground" style={{ fontSize: '0.72rem' }}>
                      {opt.description}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="reg-password"
            className="mb-2 flex items-center gap-2 text-foreground"
            style={{ fontSize: '0.9rem', fontWeight: 600 }}
          >
            <Lock size={15} aria-hidden="true" />
            Senha <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(null); }}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              aria-required="true"
              aria-describedby="password-strength"
              aria-invalid={error === 'password-too-short' ? 'true' : 'false'}
              className={cn(field, 'pr-12', fieldError('password-too-short'))}
              style={{ fontSize: '1rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
            </button>
          </div>
          <div id="password-strength">
            <PasswordStrength password={password} />
          </div>
        </div>

        {/* Confirm password */}
        <div className="mb-6">
          <label
            htmlFor="reg-confirm"
            className="mb-2 flex items-center gap-2 text-foreground"
            style={{ fontSize: '0.9rem', fontWeight: 600 }}
          >
            <Lock size={15} aria-hidden="true" />
            Confirmar senha <span className="text-destructive" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              id="reg-confirm"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => { setConfirmPassword(e.target.value); setError(null); }}
              placeholder="Repita a senha"
              autoComplete="new-password"
              aria-required="true"
              aria-invalid={error === 'passwords-dont-match' ? 'true' : 'false'}
              className={cn(
                field,
                'pr-12',
                fieldError('passwords-dont-match'),
                confirmPassword && password === confirmPassword && !error
                  ? 'border-emerald-500/60 focus:ring-emerald-500/50'
                  : '',
              )}
              style={{ fontSize: '1rem' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(v => !v)}
              aria-label={showConfirm ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'}
              aria-pressed={showConfirm}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              {showConfirm ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
            </button>
          </div>
          {confirmPassword && password === confirmPassword && (
            <p className="mt-1.5 flex items-center gap-1 text-emerald-400" style={{ fontSize: '0.8rem' }}>
              <CheckCircle2 size={13} aria-hidden="true" /> Senhas coincidem
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || success}
          aria-label={loading ? 'Criando conta, aguarde...' : 'Criar minha conta'}
          className={cn(
            'flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 transition-all',
            'focus:outline-none focus-visible:ring-3 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-60',
            highContrast
              ? 'bg-yellow-400 text-black hover:bg-yellow-300'
              : 'bg-primary text-primary-foreground hover:bg-primary/90',
          )}
          style={{ fontSize: '1rem', fontWeight: 700, minHeight: '56px' }}
        >
          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Criando conta...</span>
            </>
          ) : success ? (
            <>
              <CheckCircle2 size={20} aria-hidden="true" />
              <span>Conta criada!</span>
            </>
          ) : (
            <>
              <UserPlus size={20} aria-hidden="true" />
              <span>Criar conta</span>
            </>
          )}
        </button>
      </form>

      {/* Back to login */}
      <p className="mt-5 text-center text-muted-foreground" style={{ fontSize: '0.88rem' }}>
        Já tem uma conta?{' '}
        <button
          type="button"
          onClick={onGoToLogin}
          className={cn(
            'font-bold underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-ring rounded',
            highContrast ? 'text-yellow-400' : 'text-primary hover:text-primary/80',
          )}
        >
          Entrar
        </button>
      </p>
    </motion.div>
  );
}
