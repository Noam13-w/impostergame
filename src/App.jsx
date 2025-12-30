import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/index'; // ודא שזה הנתיב הנכון לקובץ index.jsx שלך
import Game from './pages/Game';   // ודא שזה הנתיב הנכון לקובץ Game.jsx שלך

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Routes>
        {/* עמוד הבית */}
        <Route path="/" element={<Index />} />
        
        {/* עמוד המשחק - הנקודתיים לפני id אומרות שזה משתנה דינמי */}
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;