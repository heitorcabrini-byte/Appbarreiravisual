import { useState, useRef, useEffect, FormEvent } from 'react';
import { Eye, EyeOff, GraduationCap, Mail, Lock, AlertCircle, LogIn, Database, Keyboard, X, HelpCircle } from 'lucide-react';
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
  onToggleContrast: () => void; // Mantido por compatibilidade de assinatura externa
  onLoginSuccess: (session: Session) => void;
}

type Tab = 'login' | 'register';
type ContrastMode = 'normal' | 'high-contrast' | 'inverted';

// ─── Componente Interno do Formulário de Login ───────────────────────────────
interface LoginFormProps {
  highContrastMode: ContrastMode;
  onSuccess: (session: Session) => void;
  onGoToRegister: () => void;
}

function LoginForm({ highContrastMode, onSuccess, onGoToRegister }: LoginFormProps) {
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
    highContrastMode !== 'normal' ? 'border-white text-white bg-black' : 'border-border',
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
                highContrastMode !== 'normal'
                  ? 'border-yellow-400 bg-black text-yellow-400 font-bold'
                  : 'border-destructive/40 bg-destructive/10 text-red-300',
              )}
            >
              <AlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Erro ao entrar</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.2rem', lineHeight: 1.5 }}>
                  {LOGIN_ERROR_MESSAGES[error]}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} noValidate aria-label="Formulário de login">
        <div className="mb-4">
          <label htmlFor="login-email" className="mb-2 flex items-center gap-2 text-foreground" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
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
            required
            className={field}
            style={{ fontSize: '1rem' }}
          />
        </div>

        <div className="mb-5">
          <label htmlFor="login-password" className="mb-2 flex items-center gap-2 text-foreground" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
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
              required
              className={cn(field, 'pr-12')}
              style={{ fontSize: '1rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {attempts >= 3 && (
          <p role="status" className="mb-4 rounded-lg border border-amber-500 bg-black p-3 text-amber-300 text-xs font-bold">
            Muitas tentativas. Ligue para a secretaria: (11) 3344-5566
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={cn(
            'flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 font-bold transition-all',
            highContrastMode === 'high-contrast'
              ? 'bg-yellow-400 text-black border-2 border-black hover:bg-yellow-300'
              : highContrastMode === 'inverted'
              ? 'bg-white text-black hover:bg-neutral-200'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
          style={{ fontSize: '1rem', minHeight: '56px' }}
        >
          {loading ? <span>Entrando...</span> : <span>Entrar</span>}
        </button>
      </form>
    </motion.div>
  );
}

// ─── Main Screen Component ───────────────────────────────────────────────────
export function LoginScreen({
  fontSize,
  onFontIncrease,
  onFontDecrease,
  onLoginSuccess,
}: LoginScreenProps) {
  const [tab, setTab] = useState<Tab>('login');
  const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Manipulação de classes globais baseadas nos estados selecionados
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('high-contrast', 'inverted-contrast');
    if (contrastMode === 'high-contrast') root.classList.add('high-contrast');
    if (contrastMode === 'inverted') root.classList.add('inverted-contrast');
  }, [contrastMode]);

  const cycleContrast = () => {
    setContrastMode(prev => {
      if (prev === 'normal') return 'high-contrast';
      if (prev === 'high-contrast') return 'inverted';
      return 'normal';
    });
  };

  const getContrastLabel = () => {
    if (contrastMode === 'normal') return 'Contraste: Padrão';
    if (contrastMode === 'high-contrast') return 'Contraste: Alto (Amarelo)';
    return 'Contraste: Invertido (Branco)';
  };

  return (
    <div className={cn(
      "flex min-h-screen w-full flex-col transition-colors",
      contrastMode !== 'normal' ? 'bg-black text-white' : 'bg-background'
    )} style={{ fontSize: `${fontSize}px` }}>
      
      {/* Barra superior de acessibilidade */}
      <div className="flex flex-wrap items-center justify-between border-b p-4 gap-3 bg-secondary/20 border-border">
        <div className="flex flex-wrap items-center gap-3">
          {/* Controles de tamanho da fonte */}
          <div role="group" aria-label="Tamanho da fonte" className="flex items-center rounded-lg border border-border overflow-hidden bg-background">
            <button type="button" onClick={onFontDecrease} className="px-3 py-1.5 hover:bg-secondary font-bold">A−</button>
            <span className="px-2 text-xs border-x border-border font-mono">{fontSize}px</span>
            <button type="button" onClick={onFontIncrease} className="px-3 py-1.5 hover:bg-secondary font-bold">A+</button>
          </div>

          {/* Bug #01 Resolvido: Alternador cíclico com 3 modos de contraste */}
          <button
            type="button"
            onClick={cycleContrast}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
              contrastMode === 'high-contrast' ? 'bg-yellow-400 text-black border-yellow-400' :
              contrastMode === 'inverted' ? 'bg-white text-black border-white' : 'bg-background hover:bg-secondary border-border'
            )}
          >
            <Eye size={14} />
            <span>{getContrastLabel()}</span>
          </button>

          {/* Bug #02 Resolvido: O ícone de teclado agora abre o painel de ajuda técnica */}
          <button
            type="button"
            onClick={() => setShowKeyboardHelp(true)}
            aria-label="Ver atalhos de teclado para acessibilidade"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-secondary",
              showKeyboardHelp && "bg-primary text-primary-foreground"
            )}
          >
            <Keyboard size={16} />
          </button>
        </div>
        <span className="text-xs text-muted-foreground font-semibold">Acessibilidade WCAG 2.1</span>
      </div>

      {/* Janela Modal / Painel de Ajuda do Teclado */}
      <AnimatePresence>
        {showKeyboardHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl border-border text-foreground"
            >
              <div className="flex items-center justify-between mb-4 border-b pb-2 border-border">
                <div className="flex items-center gap-2 font-bold text-lg text-primary">
                  <Keyboard size={20} />
                  <h3>Atalhos e Navegação</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowKeyboardHelp(false)}
                  className="rounded-lg p-1 hover:bg-secondary text-muted-foreground"
                  aria-label="Fechar janela"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-sm leading-relaxed">
                <p>Este sistema é totalmente otimizado para navegação por teclado. Utilize os comandos abaixo:</p>
                <ul className="space-y-2.5 pt-1">
                  <li className="flex gap-2"><kbd className="bg-muted px-1.5 py-0.5 rounded border font-mono font-bold text-xs">Tab</kbd> Avança para o próximo elemento ou botão interativo.</li>
                  <li className="flex gap-2"><kbd className="bg-muted px-1.5 py-0.5 rounded border font-mono font-bold text-xs">Shift + Tab</kbd> Retorna ao elemento interativo anterior.</li>
                  <li className="flex gap-2"><kbd className="bg-muted px-1.5 py-0.5 rounded border font-mono font-bold text-xs">Enter</kbd> Ativa botões, links e abre os avisos do mural.</li>
                  <li className="flex gap-2"><kbd className="bg-muted px-1.5 py-0.5 rounded border font-mono font-bold text-xs">Setas</kbd> Navegam entre filtros de categorias no painel principal.</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setShowKeyboardHelp(false)}
                className="mt-6 w-full rounded-xl bg-secondary py-2.5 font-bold hover:bg-secondary/80 transition-colors"
              >
                Entendi, Fechar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Conteúdo Principal da Autenticação */}
      <main id="auth-content" className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <GraduationCap size={36} />
            </div>
            <div>
              <h1 className="text-xl font-bold">E.E. Dom Pedro II</h1>
              <p className="text-sm text-muted-foreground">Mural de Avisos Escolar</p>
            </div>
          </div>

          <div className={cn("rounded-2xl border shadow-xl bg-card border-border")}>
            <div className="p-6">
              <LoginForm
                highContrastMode={contrastMode}
                onSuccess={onLoginSuccess}
                onGoToRegister={() => setTab('register')}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
