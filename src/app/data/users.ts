export type UserRole = 'admin' | 'professor' | 'aluno' | 'responsavel';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  avatarInitials: string;
  active: boolean;
  createdAt: string;
  isDemo?: boolean; // demo seed users
}

export interface Session {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  professor: 'Professor(a)',
  aluno: 'Aluno(a)',
  responsavel: 'Responsável',
};

export const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] = [
  { value: 'aluno', label: 'Aluno(a)', description: 'Estudante matriculado(a)' },
  { value: 'responsavel', label: 'Responsável', description: 'Pai, mãe ou responsável legal' },
  { value: 'professor', label: 'Professor(a)', description: 'Docente da escola' },
  { value: 'admin', label: 'Administrador', description: 'Direção e coordenação' },
];

// ─── Simple hash (demo only — use Supabase Auth in production) ───────────────
function simpleHash(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) + h + str.charCodeAt(i);
    h |= 0;
  }
  return String(h >>> 0);
}

export function hashPassword(plain: string): string {
  return simpleHash(plain + 'escola_salt_2026');
}

export function checkPassword(plain: string, hash: string): boolean {
  return hashPassword(plain) === hash;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// ─── localStorage database ───────────────────────────────────────────────────
const DB_KEY = 'escola_users_db';
const SESSION_KEY = 'escola_session';

function seedUsers(): RegisteredUser[] {
  return [
    {
      id: 'seed-1',
      name: 'Maria Helena Souza',
      email: 'diretora@eedompedro.edu.br',
      role: 'admin',
      passwordHash: hashPassword('Diretor@2026'),
      avatarInitials: 'MH',
      active: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      isDemo: true,
    },
    {
      id: 'seed-2',
      name: 'Carlos Menezes',
      email: 'carlos.menezes@eedompedro.edu.br',
      role: 'professor',
      passwordHash: hashPassword('Prof@2026'),
      avatarInitials: 'CM',
      active: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      isDemo: true,
    },
    {
      id: 'seed-3',
      name: 'Ana Beatriz Santos',
      email: 'ana.beatriz@alunos.eedompedro.edu.br',
      role: 'aluno',
      passwordHash: hashPassword('Aluno@2026'),
      avatarInitials: 'AB',
      active: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      isDemo: true,
    },
    {
      id: 'seed-4',
      name: 'Roberto Santos',
      email: 'roberto.santos@responsaveis.eedompedro.edu.br',
      role: 'responsavel',
      passwordHash: hashPassword('Resp@2026'),
      avatarInitials: 'RS',
      active: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      isDemo: true,
    },
  ];
}

export function getAllUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as RegisteredUser[];
  } catch {}
  // First run: seed demo users
  const seed = seedUsers();
  localStorage.setItem(DB_KEY, JSON.stringify(seed));
  return seed;
}

function saveAllUsers(users: RegisteredUser[]): void {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string): RegisteredUser | undefined {
  return getAllUsers().find(u => u.email.toLowerCase() === email.trim().toLowerCase());
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

export type LoginError =
  | 'email-not-found'
  | 'wrong-password'
  | 'account-disabled'
  | 'empty-fields';

export type RegisterError =
  | 'empty-fields'
  | 'email-taken'
  | 'password-too-short'
  | 'passwords-dont-match'
  | 'invalid-email'
  | 'name-too-short';

export const LOGIN_ERROR_MESSAGES: Record<LoginError, string> = {
  'empty-fields': 'Preencha o e-mail e a senha para continuar.',
  'email-not-found': 'Este e-mail não está cadastrado. Crie uma conta ou entre em contato com a secretaria.',
  'wrong-password': 'Senha incorreta. Verifique e tente novamente.',
  'account-disabled': 'Esta conta está desativada. Entre em contato com a secretaria escolar.',
};

export const REGISTER_ERROR_MESSAGES: Record<RegisterError, string> = {
  'empty-fields': 'Preencha todos os campos obrigatórios.',
  'email-taken': 'Este e-mail já está cadastrado. Faça login ou use outro e-mail.',
  'password-too-short': 'A senha precisa ter pelo menos 6 caracteres.',
  'passwords-dont-match': 'As senhas não coincidem. Verifique e tente novamente.',
  'invalid-email': 'Digite um endereço de e-mail válido.',
  'name-too-short': 'Digite seu nome completo (mínimo 3 caracteres).',
};

export function attemptLogin(
  email: string,
  password: string,
): { session: Session } | { error: LoginError } {
  if (!email.trim() || !password.trim()) return { error: 'empty-fields' };
  const user = findUserByEmail(email);
  if (!user) return { error: 'email-not-found' };
  if (!user.active) return { error: 'account-disabled' };
  if (!checkPassword(password, user.passwordHash)) return { error: 'wrong-password' };
  return {
    session: {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarInitials: user.avatarInitials,
    },
  };
}

export function attemptRegister(fields: {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
}): { session: Session } | { error: RegisterError } {
  const { name, email, role, password, confirmPassword } = fields;

  if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
    return { error: 'empty-fields' };
  }
  if (name.trim().length < 3) return { error: 'name-too-short' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return { error: 'invalid-email' };
  if (findUserByEmail(email)) return { error: 'email-taken' };
  if (password.length < 6) return { error: 'password-too-short' };
  if (password !== confirmPassword) return { error: 'passwords-dont-match' };

  const newUser: RegisteredUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    passwordHash: hashPassword(password),
    avatarInitials: initials(name),
    active: true,
    createdAt: new Date().toISOString(),
  };

  const all = getAllUsers();
  all.push(newUser);
  saveAllUsers(all);

  return {
    session: {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatarInitials: newUser.avatarInitials,
    },
  };
}

// ─── Session helpers ──────────────────────────────────────────────────────────

export function saveSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
