<div className="rounded-2xl border shadow-xl bg-[#0f172a] border-slate-800 p-6">
  {/* Abas para alternar entre Login e Criar Conta */}
  <div className="flex border-b border-slate-800 mb-6 tabs">
    <button
      type="button"
      onClick={() => setCurrentScreen('login')}
      className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${currentScreen === 'login' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-white'}`}
    >
      Entrar no Sistema
    </button>
    <button
      type="button"
      onClick={() => setCurrentScreen('register')}
      className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${currentScreen === 'register' ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-400 hover:text-white'}`}
    >
      Criar uma Conta
    </button>
  </div>

  {/* Renderização Condicional Inteligente */}
  {currentScreen === 'login' ? (
    <LoginForm highContrastMode={contrastMode} onSuccess={onLoginSuccess} />
  ) : (
    <RegisterForm onSuccess={() => setCurrentScreen('login')} />
  )}
</div>
