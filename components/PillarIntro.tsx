'use client';

import { useApp } from '@/contexts/AppContext';
import { qpsQuestions, ROLE_LABELS } from '@/lib/data';
import { mapRoleToPerspective } from '@/lib/utils';
import { PillarKey } from '@/lib/utils';

interface PillarIntroProps {
  pillarKey: PillarKey;
  totalPillars: number;
}

export default function PillarIntro({ pillarKey, totalPillars }: PillarIntroProps) {
  const { state, dispatch } = useApp();
  const pillar = qpsQuestions[pillarKey];
  const perspective = mapRoleToPerspective(state.currentRole!);
  const introText = perspective === 'client' ? pillar.introClient : pillar.introOwner;

  return (
    <div className="card">
      <div className="card-header-row">
        <div className="card-title">{pillar.name} · intro</div>
        <div className="card-step-pill">Pillar {state.currentPillarIndex + 1}</div>
      </div>
      <div className="card-body">
        <div className="pill-tag">
          <span>{pillar.name}</span>
          <span>· Pillar {state.currentPillarIndex + 1} of {totalPillars}</span>
        </div>
        <p className="q-title">{pillar.tagline}</p>
        <p className="q-hint">{introText}</p>
        <p className="q-hint"><strong>Answer from your first impression – no overthinking.</strong></p>

        <div className="role-badge">
          {(ROLE_LABELS as Record<string, string>)[state.currentRole!] || ""}
        </div>

        <div className="btn-row">
          <button className="ghost-btn" onClick={() => dispatch({ type: 'SET_MODE', payload: 'setup' })}>
            Back to setup
          </button>
          <button className="primary-btn" onClick={() => dispatch({ type: 'NEXT_QUESTION' })}>
            Begin questions ⟶
          </button>
        </div>
      </div>
    </div>
  );
}

