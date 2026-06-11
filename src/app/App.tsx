import { useState } from 'react';
import LoginScreen from './components/LoginScreen'; 

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');
  const [fontSize, setFontSize] = useState(18);

  return (
    <div style={{ fontSize: `${fontSize}px` }} className="min-h-screen bg-[#0b121f] text-white">
      {!session ? (
        <LoginScreen
          fontSize={fontSize}
          contrastMode="normal"
          showKeyboardHelp={false}
          setShowKeyboardHelp={() => {}}
          onFontIncrease={() => setFontSize(f => f + 2)}
          onFontDecrease={() => setFontSize(f => f - 2)}
          onCycleContrast={() => {}}
          onLoginSuccess={(userSession) => setSession(userSession)}
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
        />
      ) : (
        // SE ESTIVER LOGADO: HTML Puro e isolado para testar se a tela destrava
        <div className="p-8 max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold text-blue-400">🎉 SISTEMA DESTRAVADO!</h1>
          <p className="text-slate-300 mt-4">
            Olá, {session?.email}. Se você está vendo esta tela, o fluxo de login e o Tailwind v4 estão 105% operacionais.
          </p>
          <div className="mt-6 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-left">
            <span className="text-xs font-bold text-emerald-400 uppercase">Aviso de Teste</span>
            <h2 className="text-xl font-bold mt-2">O motor do React está funcionando</h2>
            <p className="text-slate-400 text-sm mt-1">O problema anterior era apenas um conflito de importação nos subcomponentes.</p>
          </div>
          <button 
            onClick={() => setSession(null)}
            className="mt-8 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
