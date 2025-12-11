'use client';

import { useApp } from '@/contexts/AppContext';

export default function IntroCard() {
  const { dispatch } = useApp();

  return (
    <div className="card">
      <div className="card-header-row">
        <div className="card-title">Quiet Presence Scan</div>
        <div className="card-step-pill">Step 1 of 4</div>
      </div>
      <div className="card-body">
        <p>We'll guide you through simple cards, one question at a time.</p>
        <p>You can start as the business / brand owner, and then invite up to three clients or guests
           to rate the same pillars. At the end, we compare all views and show how this links to
           key Global Brand Health Indicators.</p>
        <div className="btn-row">
          <button className="primary-btn" onClick={() => dispatch({ type: 'SET_MODE', payload: 'rules' })}>
            Next · How to answer ⟶
          </button>
        </div>
      </div>
    </div>
  );
}

