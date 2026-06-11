import { useState, useRef, useEffect, FormEvent } from 'react';
import { Eye, EyeOff, GraduationCap, Mail, Lock, AlertCircle, LogIn, Keyboard, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './ui/utils';
import { RegisterForm } from './RegisterForm';
import {
  attemptLogin,
  saveSession,
  LOGIN_ERROR_MESSAGES,
  type Session,
  type LoginError,
} from '../../data/users';

type ContrastMode = 'normal' | 'high-contrast' | 'inverted';

interface LoginScreenProps {
  fontSize: number;
  contrastMode: ContrastMode;
  showKeyboardHelp: boolean;
  setShowKeyboardHelp: (show: boolean) => void;
  onFontIncrease: () => void;
  onFontDecrease: () => void;
  onCycleContrast: () => void;
  onLoginSuccess: (session: Session) => void;
  currentScreen: 'login' | 'register';
  setCurrentScreen: (screen: 'login' | 'register') => void;
}

interface LoginFormProps {
  highContrastMode: ContrastMode;
  onSuccess: (session: Session) => void;
}

function LoginForm({ highContrastMode, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);
  const [loading, setLoading] = useState(false);

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
      return;
    }
    saveSession(result.session);
    onSuccess(result.session);
  };

  const field = cn(
    'w-full rounded-xl border bg-slate-900 px-4 py-3.5 text-white transition-colors border-slate-700',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
  );

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Formulário de login">
      <div className="mb-4">
        <label htmlFor="login-email" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Mail size={15} /> E-mail
        </label>
        <input ref={emailRef} id="login-email" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(null); }} placeholder="seu@email.com" required className={field} />
      </div>

      <div className="mb-5">
        <label htmlFor="login-password" className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Lock size={15} /> Senha
        </label>
        <div className="relative">
          <input id="login-password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(null); }} placeholder="Digite sua senha" required className={cn(field, 'pr-12')} />
          <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4">
            <div ref={errorRef} role="alert" tabIndex={-1} className="flex items-start gap-3 rounded-xl border p-4 border-red-900/50 bg-red-950/20 text-red-400">
              <AlertCircle size={20
