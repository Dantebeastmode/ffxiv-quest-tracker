import { useState, useEffect } from 'react';
import type { Quest } from './types';
import msqDataRaw from './msq-data.json'; // Import the JSON directly
import './App.css';

// Tell TypeScript that the imported JSON is an array of Quests
const msqData = msqDataRaw as Quest[];

const expansionOrder = [
  'A Realm Reborn',
  'Heavensward',
  'Stormblood',
  'Shadowbringers',
  'Endwalker',
  'Dawntrail'
];

function App() {
  const [completedQuests, setCompletedQuests] = useState<number[]>(() => {
    const saved = localStorage.getItem('ffxiv-tracker-progress');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('ffxiv-tracker-progress', JSON.stringify(completedQuests));
  }, [completedQuests]);

  const toggleQuest = (id: number) => {
    setCompletedQuests((prev) =>
      prev.includes(id)
        ? prev.filter((questId) => questId !== id)
        : [...prev, id]
    );
  };

  const completeUpTo = (targetId: number) => {
    const targetIndex = msqData.findIndex(q => q.id === targetId);
    if (targetIndex === -1) return;

    const idsToComplete = msqData.slice(0, targetIndex + 1).map(q => q.id);
    
    setCompletedQuests((prev) => {
      const combined = new Set([...prev, ...idsToComplete]);
      return Array.from(combined);
    });
  };

  const totalQuests = msqData.length;
  const completedCount = completedQuests.length;
  const progressPercentage = totalQuests === 0 ? 0 : Math.round((completedCount / totalQuests) * 100);

  return (
    <main className="tracker-container">
      <h1>FFXIV Main Scenario Quest Tracker</h1>
      
      <div className="progress-section">
        <h2>Overall Progress: {progressPercentage}%</h2>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p>{completedCount} of {totalQuests} Quests Completed</p>
      </div>

      <div className="expansion-list">
        {/* --- NEW: Loop through expansions first --- */}
        {expansionOrder.map(expansionName => {
          // Find all quests that belong to this specific expansion
          const questsInExpansion = msqData.filter(q => q.expansion === expansionName);
          
          // If we haven't added any data for this expansion yet, skip rendering it
          if (questsInExpansion.length === 0) return null;

          return (
            <details key={expansionName} className="expansion-group" open>
              <summary className="expansion-title">
                {expansionName} 
                <span className="expansion-count">({questsInExpansion.length} Quests)</span>
              </summary>
              
              <div className="quest-list">
                {questsInExpansion.map((quest: Quest) => (
                  <div key={quest.id} className="quest-card">
                    <div className="quest-card-left">
                      <input 
                        type="checkbox" 
                        id={`quest-${quest.id}`} 
                        checked={completedQuests.includes(quest.id)}
                        onChange={() => toggleQuest(quest.id)}
                      />
                      <label htmlFor={`quest-${quest.id}`}>
                        <strong>{quest.name}</strong> (Level {quest.level}) - <em>{quest.patch}</em>
                      </label>
                    </div>
                    <button 
                      className="quick-complete-btn"
                      onClick={() => completeUpTo(quest.id)}
                    >
                      Complete to Here
                    </button>
                  </div>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </main>
  );
}

export default App;