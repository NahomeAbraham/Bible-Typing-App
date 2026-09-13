import TypingEngine from './components/TypingEngine';

function App() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-screen bg-slate-950 text-white">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
          Bible <span className="text-blue-500">Typing</span>
        </h1>
        <p className="text-slate-400 text-lg">Memorize Scripture. Improve Your Speed.</p>
      </header>

      <main>
        <TypingEngine />
      </main>
    </div>
  );
}

export default App;