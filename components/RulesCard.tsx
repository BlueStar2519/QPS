'use client';

import { useApp } from '@/contexts/AppContext';

export default function RulesCard() {
  const { dispatch } = useApp();

  return (
    <div className="card">
      <div className="card-header-row">
        <div className="card-title">How to answer</div>
        <div className="card-step-pill">Step 2 of 4</div>
      </div>
      <div className="card-body">
        <p>QPS works best when you:</p>
        <ul style={{ marginLeft: '18px', fontSize: '12px' }}>
          <li>Go with your first impression – no overthinking.</li>
          <li>Answer from what actually happens, not from wishes or plans.</li>
          <li>Use "Not sure" when your feeling is mixed or inconsistent.</li>
        </ul>

        <div className="btn-row">
          <button className="ghost-btn" onClick={() => dispatch({ type: 'SET_MODE', payload: 'intro' })}>Back</button>
          <button className="primary-btn" onClick={() => dispatch({ type: 'SET_MODE', payload: 'setup' })}>Next · Setup ⟶</button>
        </div>
      </div>
    </div>
  );
}

