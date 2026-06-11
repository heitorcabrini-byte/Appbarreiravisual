import { useState, useRef, useEffect, FormEvent } from 'react';
import { Eye, EyeOff, GraduationCap, Mail, Lock, AlertCircle, LogIn, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './ui/utils';
import {
  attemptLogin,
  saveSession,
  getAllUsers,
  LOGIN_ERROR_MESSAGES,
  type Session,
  type LoginError,
} from '../data/users';
import { RegisterForm } from './RegisterForm';

interface LoginScreenProps {
  highContrast: boolean;
  fontSize: number;
  onFontIncrease: () => void;
  onFontDecrease: () => void;
  onToggleContrast: () => void;
  onLoginSuccess: (session: Session) => void;
}

type Tab = 'login' | 'register';

// ─── Login form ───────────────────────────────────────────────────────────────

interface LoginFormProps {
  highContrast: boolean;
  onSuccess: (session: Session) => void;
  onGoToRegister: () => void;
}

function LoginForm({ highContrast, onSuccess, onGoToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const emailRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => { emailRef.current?.focus(); }, []);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = attemptLogin(email, password);
    setLoading(false);
    if ('error' in result) {
      setError(result.error);
      setAttempts(a => a + 1);
      return;
    }
    saveSession(result.session);
    onSuccess(result.session);
  };

  const field = cn(
    'w-full rounded-xl border bg-secondary px-4 py-3.5 text-foreground',
    'placeholder:text-muted-foreground/60 transition-colors',
    'focus:outline-none focus:ring-3 focus:border-primary focus:ring-ring/70',
    'border-border',
  );

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mb-6">
        <h2 className="text-foreground" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          Entrar no sistema
        </h2>
        <p className="mt-1 text-muted-foreground" style={{ fontSize: '0.88rem' }}>
          Use seu e-mail e senha para acessar o mural
        </p>
      </div>

      {/* Error */}
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
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Erro ao entrar</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.2rem', lineHeight: 1.5 }}>
                  {LOGIN_ERROR_MESSAGES[error]}
                </p>
                {error === 'email-not-found' && (
                  <button
                    type="button"
                    onClick={onGoToRegister}
                    className="mt-2 underline underline-offset-2 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring rounded"
                    style={{ fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    Criar conta agora →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} noValidate aria-label="Formulário de login">
        {/* Email */}
        <div className="mb-4">
          <label htmlFor="login-email" className="mb-2 flex items-center gap-2 text-foreground"
            style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            <Mail size={15} aria-hidden="true" />
            E-mail
          </label>
          <input
            ref={emailRef}
            id="login-email"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(null); }}
            autoComplete="email"
            placeholder="seu@email.com"
            aria-describedby="email-hint"
            aria-invalid={error === 'email-not-found' ? 'true' : 'false'}
            required
            className={cn(field, error === 'email-not-found' && 'border-destructive')}
            style={{ fontSize: '1rem' }}
          />
          <p id="email-hint" className="mt-1.5 text-muted-foreground" style={{ fontSize: '0.8rem' }}>
            Use o e-mail com o qual você se cadastrou
          </p>
        </div>

        {/* Password */}
        <div className="mb-5">
          <label htmlFor="login-password" className="mb-2 flex items-center gap-2 text-foreground"
            style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            <Lock size={15} aria-hidden="true" />
            Senha
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(null); }}
              autoComplete="current-password"
              placeholder="Digite sua senha"
              aria-invalid={error === 'wrong-password' ? 'true' : 'false'}
              required
              className={cn(field, 'pr-12', error === 'wrong-password' && 'border-destructive')}
              style={{ fontSize: '1rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              aria-pressed={showPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Too many attempts warning */}
        {attempts >= 3 && (
          <p role="status" aria-live="polite"
            className="mb-4 rounded-lg border border-amber-500/40 bg-amber-950/30 p-3 text-amber-300"
            style={{ fontSize: '0.85rem' }}>
            Muitas tentativas. Ligue para a secretaria: (11) 3344-5566
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          aria-label={loading ? 'Entrando, aguarde...' : 'Entrar no mural de avisos'}
          className={cn(
            'flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 transition-all',
            'focus:outline-none focus-visible:ring-3 focus-visible:ring-ring',
            'disabled:opacity-60 disabled:cursor-not-allowed',
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
              <span>Entrando...</span>
            </>
          ) : (
            <>
              <LogIn size={20} aria-hidden="true" />
              <span>Entrar</span>
            </>
          )}
        </button>
      </form>

      {/* Create account link */}
      <p className="mt-5 text-center text-muted-foreground" style={{ fontSize: '0.88rem' }}>
        Ainda não tem conta?{' '}
        <button
          type="button"
          onClick={onGoToRegister}
          className={cn(
            'font-bold underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-ring rounded',
            highContrast ? 'text-yellow-400' : 'text-primary hover:text-primary/80',
          )}
        >
          Criar conta
        </button>
      </p>

    </motion.div>
  );
}

// ─── Users count badge ────────────────────────────────────────────────────────

function UsersCountBadge({ highContrast }: { highContrast: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => { setCount(getAllUsers().length); }, []);

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border px-3 py-1.5',
        highContrast
          ? 'border-white/20 bg-white/5 text-white/70'
          : 'border-border bg-secondary/50 text-muted-foreground',
      )}
      aria-label={`${count} usuário${count !== 1 ? 's' : ''} cadastrado${count !== 1 ? 's' : ''} no banco de dados`}
      style={{ fontSize: '0.78rem' }}
    >
      <Database size={13} aria-hidden="true" />
      <span>{count} usuário{count !== 1 ? 's' : ''} no banco</span>
    </div>
  );
}

// ─── Main LoginScreen ─────────────────────────────────────────────────────────

export function LoginScreen({
  highContrast,
  fontSize,
  onFontIncrease,
  onFontDecrease,
  onToggleContrast,
  onLoginSuccess,
}: LoginScreenProps) {
  const [tab, setTab] = useState<Tab>('login');
  const minFont = 16;
  const maxFont = 28;

  return (
    <div className="flex min-h-screen flex-col bg-background" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <a href="#auth-content" className="skip-to-content" tabIndex={0}>
        Pular para o formulário de acesso
      </a>

      {/* Accessibility top bar */}
      <div
        className={cn(
          'flex items-center justify-between border-b border-border px-4 py-2 sm:px-6',
          highContrast ? 'bg-black' : 'bg-secondary/30',
        )}
        aria-label="Controles de acessibilidade"
      >
        <div className="flex items-center gap-2">
          <span className="hidden text-muted-foreground sm:block" style={{ fontSize: '0.8rem' }}>
            Acessibilidade:
          </span>
          <div role="group" aria-label="Tamanho da fonte" className="flex items-center rounded-lg border border-border overflow-hidden">
            <button type="button" onClick={onFontDecrease} disabled={fontSize <= minFont}
              aria-label={`Diminuir fonte. Atual: ${fontSize}px`}
              className="flex h-9 w-9 items-center justify-center hover:bg-secondary disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring"
              style={{ fontSize: '0.7rem', fontWeight: 700 }}>A−</button>
            <span aria-live="polite" className="block border-x border-border px-2 text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {fontSize}px
            </span>
            <button type="button" onClick={onFontIncrease} disabled={fontSize >= maxFont}
              aria-label={`Aumentar fonte. Atual: ${fontSize}px`}
              className="flex h-9 w-9 items-center justify-center hover:bg-secondary disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring"
              style={{ fontSize: '0.85rem', fontWeight: 700 }}>A+</button>
          </div>
          <button type="button" onClick={onToggleContrast} aria-pressed={highContrast}
            aria-label={highContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
            className={cn(
              'flex h-9 items-center gap-1.5 rounded-lg border px-3 transition-colors focus-visible:ring-2 focus-visible:ring-ring',
              highContrast
                ? 'border-yellow-400 bg-yellow-400 text-black'
                : 'border-border hover:bg-secondary text-muted-foreground',
            )}
            style={{ fontSize: '0.78rem', fontWeight: 600 }}>
            <Eye size={14} aria-hidden="true" />
            <span className="hidden sm:inline">{highContrast ? 'Alto contraste ✓' : 'Alto contraste'}</span>
          </button>
        </div>
        <span className="text-muted-foreground" style={{ fontSize: '0.78rem' }}>WCAG 2.1 AA</span>
      </div>

      {/* Main */}
      <main id="auth-content" role="main" className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* School logo + name */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 flex flex-col items-center gap-4 text-center"
          >
            <div
              aria-hidden="true"
              className={cn(
                'flex h-20 w-20 items-center justify-center rounded-2xl',
                highContrast ? 'bg-yellow-400 text-black' : 'bg-primary/20 text-primary',
              )}
            >
              <GraduationCap size={40} strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-foreground">E.E. Dom Pedro II</h1>
              <p className="mt-1 text-muted-foreground" style={{ fontSize: '0.95rem' }}>
                Mural de Avisos Escolar
              </p>
            </div>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={cn(
              'rounded-2xl border shadow-xl',
              highContrast ? 'border-white/50 bg-black' : 'border-border bg-card',
            )}
          >
            {/* Tab switcher */}
            <div
              role="tablist"
              aria-label="Selecionar entre login e cadastro"
              className={cn(
                'grid grid-cols-2 gap-1 rounded-t-2xl border-b p-2',
                highContrast ? 'border-white/20 bg-white/5' : 'border-border bg-secondary/40',
              )}
            >
              {([
                { value: 'login', label: 'Entrar', icon: '🔑' },
                { value: 'register', label: 'Criar conta', icon: '✨' },
              ] as const).map(t => (
                <button
                  key={t.value}
                  type="button"
                  role="tab"
                  id={`tab-${t.value}`}
                  aria-selected={tab === t.value}
                  aria-controls={`panel-${t.value}`}
                  onClick={() => setTab(t.value)}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all',
                    'focus:outline-none focus-visible:ring-3 focus-visible:ring-ring',
                    tab === t.value
                      ? highContrast
                        ? 'bg-yellow-400 text-black'
                        : 'bg-primary text-primary-foreground shadow-sm'
                      : highContrast
                      ? 'text-white/60 hover:bg-white/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
                  )}
                  style={{ minHeight: '44px', fontSize: '0.9rem', fontWeight: tab === t.value ? 700 : 500 }}
                >
                  <span aria-hidden="true">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Panel */}
            <div
              id={`panel-${tab}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab}`}
              className="p-6 sm:p-8"
            >
              <AnimatePresence mode="wait">
                {tab === 'login' ? (
                  <LoginForm
                    key="login"
                    highContrast={highContrast}
                    onSuccess={onLoginSuccess}
                    onGoToRegister={() => setTab('register')}
                  />
                ) : (
                  <RegisterForm
                    key="register"
                    highContrast={highContrast}
                    onSuccess={onLoginSuccess}
                    onGoToLogin={() => setTab('login')}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* DB badge + WCAG notice */}
          <div className="mt-4 flex items-center justify-between">
            <UsersCountBadge highContrast={highContrast} />
            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              WCAG 2.1 AA · NVDA · VoiceOver
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
