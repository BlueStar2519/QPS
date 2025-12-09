'use client';

import { useApp } from '@/contexts/AppContext';
import { orderedPillars, qpsQuestions } from '@/lib/data';
import { PillarKey } from '@/lib/utils';
import { getActivePillarsInOrder } from '@/lib/utils';

export default function SetupCard() {
  const { state, dispatch } = useApp();

  const handleWhoClick = (value: 'my-brand' | 'client') => {
    dispatch({ type: 'SET_WHO', payload: value });
  };

  const handleScopeClick = (value: 'full' | 'custom') => {
    dispatch({ type: 'SET_SCOPE', payload: value });
    if (value === 'full') {
      orderedPillars.forEach(p => {
        if (!state.pillars.has(p as PillarKey)) {
          dispatch({ type: 'TOGGLE_PILLAR', payload: p as PillarKey });
        }
      });
    } else if (value === 'custom' && state.pillars.size === 5) {
      orderedPillars.forEach(p => {
        if (state.pillars.has(p as PillarKey)) {
          dispatch({ type: 'TOGGLE_PILLAR', payload: p as PillarKey });
        }
      });
    }
  };

  const handlePillarClick = (key: PillarKey) => {
    dispatch({ type: 'TOGGLE_PILLAR', payload: key });
  };

  const handleStart = () => {
    if (state.pillars.size === 0) {
      alert("Please choose Full scan or select at least one pillar.");
      return;
    }

    const scope = state.scope || (state.pillars.size === 5 ? 'full' : 'custom');
    const who = state.initialWho || 'my-brand';

    dispatch({
      type: 'START_FLOW',
      payload: {
        who,
        scope,
        pillars: state.pillars
      }
    });
  };

  const active = getActivePillarsInOrder(state.pillars);
  let summaryText = "No pillars selected yet. Choose full scan or select at least one pillar.";
  if (active.length === 5) {
    summaryText = "You are scanning: Full Quiet Presence Score (all five pillars).";
  } else if (active.length > 0) {
    summaryText = "You are scanning: " + active.map(x => qpsQuestions[x].name).join(", ");
  }

  return (
    <div className="card">
      <div className="card-header-row">
        <div className="card-title">Set up your scan</div>
        <div className="card-step-pill">Step 3 of 4</div>
      </div>

      <div className="card-body">
        <div className="option-group-label">1 · Who is answering now?</div>
        <div className="chip-row">
          <label
            className="chip"
            data-selected={state.initialWho === 'my-brand' ? 'true' : 'false'}
            onClick={() => handleWhoClick('my-brand')}
          >
            <span className="chip-indicator"></span>
            <span className="chip-main">
              <span className="chip-label">You – business / brand owner</span>
              <span className="chip-sub">You will answer first, then you can invite clients.</span>
            </span>
          </label>

          <label
            className="chip"
            data-selected={state.initialWho === 'client' ? 'true' : 'false'}
            onClick={() => handleWhoClick('client')}
          >
            <span className="chip-indicator"></span>
            <span className="chip-main">
              <span className="chip-label">Client / guest / visitor only</span>
              <span className="chip-sub">Just one person shares their view. No comparison.</span>
            </span>
          </label>
        </div>

        <div className="option-group-label" style={{ marginTop: '12px' }}>2 · Full or custom?</div>
        <div className="chip-row">
          <label
            className="chip"
            data-selected={state.scope === 'full' ? 'true' : 'false'}
            onClick={() => handleScopeClick('full')}
          >
            <span className="chip-indicator"></span>
            <span className="chip-main">
              <span className="chip-label">Full scan</span>
              <span className="chip-sub">All five pillars.</span>
            </span>
          </label>

          <label
            className="chip"
            data-selected={state.scope === 'custom' ? 'true' : 'false'}
            onClick={() => handleScopeClick('custom')}
          >
            <span className="chip-indicator"></span>
            <span className="chip-main">
              <span className="chip-label">Custom</span>
              <span className="chip-sub">Choose one or several pillars manually.</span>
            </span>
          </label>
        </div>

        <div className="option-group-label" style={{ marginTop: '12px' }}>Pillars included</div>
        <div className="chip-row">
          {orderedPillars.map(key => {
            const pillar = qpsQuestions[key as PillarKey];
            return (
              <label
                key={key}
                className="chip"
                data-selected={state.pillars.has(key as PillarKey) ? 'true' : 'false'}
                onClick={() => handlePillarClick(key as PillarKey)}
              >
                <span className="chip-indicator"></span>
                <span className="chip-main">
                  <span className="chip-label">{pillar.name}</span>
                  <span className="chip-sub">{pillar.tagline}</span>
                </span>
              </label>
            );
          })}
        </div>

        <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-soft)' }}>
          {summaryText}
        </div>

        <div className="btn-row">
          <button className="ghost-btn" onClick={() => dispatch({ type: 'SET_MODE', payload: 'rules' })}>Back</button>
          <button className="primary-btn" onClick={handleStart}>Begin QPS scan ⟶</button>
        </div>
      </div>
    </div>
  );
}

