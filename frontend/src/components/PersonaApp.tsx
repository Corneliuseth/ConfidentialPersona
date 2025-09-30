import { useState } from 'react';
import { Header } from './Header';
import { Quiz } from './Quiz';
import { Results } from './Results';
import '../styles/Persona.css';

export function PersonaApp() {
  const [view, setView] = useState<'quiz' | 'results'>('quiz');
  const [lastDecrypted, setLastDecrypted] = useState<number[] | null>(null);

  return (
    <div className="persona-app">
      <Header />
      <main className="main-content">
        <div className="tabs">
          <button className={`tab ${view === 'quiz' ? 'active' : ''}`} onClick={() => setView('quiz')}>Quiz</button>
          <button className={`tab ${view === 'results' ? 'active' : ''}`} onClick={() => setView('results')}>My Results</button>
        </div>
        {view === 'quiz' && (
          <Quiz onSubmitted={() => setView('results')} />
        )}
        {view === 'results' && (
          <Results onDecrypted={(a) => setLastDecrypted(a)} lastDecrypted={lastDecrypted} />
        )}
      </main>
    </div>
  );
}

