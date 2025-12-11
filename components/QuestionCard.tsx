'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { qpsQuestions, ROLE_LABELS } from '@/lib/data';
import { mapRoleToPerspective } from '@/lib/utils';
import { PillarKey, Answer } from '@/lib/utils';

interface QuestionCardProps {
  pillarKey: PillarKey;
  question: { id: string; you: string; client: string };
  totalQuestions: number;
  autoAdvanceTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
}

export default function QuestionCard({ pillarKey, question, totalQuestions, autoAdvanceTimerRef }: QuestionCardProps) {
  const { state, dispatch } = useApp();
  const pillar = qpsQuestions[pillarKey];
  const perspective = mapRoleToPerspective(state.currentRole!);
  const text = perspective === 'client' ? question.client : question.you;
  const qIndex = state.currentQuestionIndex;
  const qNumber = qIndex + 1;

  const answersForRole = state.answers[state.currentRole!] || {};
  const existing = (answersForRole[pillarKey] || {})[question.id] || null;

  const active = state.pillars;
  const activePillars = Array.from(active) as PillarKey[];
  const totalPillars = activePillars.length;

  const handleAnswer = (answer: Answer) => {
    dispatch({
      type: 'SET_ANSWER',
      payload: { pillarKey, questionId: question.id, answer }
    });

    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }

    autoAdvanceTimerRef.current = setTimeout(() => {
      dispatch({ type: 'NEXT_QUESTION' });
    }, 600);
  };

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="card">
      <div className="card-header-row">
        <div className="card-title">{pillar.name} · question</div>
        <div className="card-step-pill">{(ROLE_LABELS as Record<string, string>)[state.currentRole!] || ""}</div>
      </div>
      <div className="card-body">
        <div className="pill-tag">
          <span>{pillar.name}</span>
          <span>· Pillar {state.currentPillarIndex + 1} of {totalPillars}</span>
        </div>

        <div className="progress-text">
          {(ROLE_LABELS as Record<string, string>)[state.currentRole!] || ""} · Question {qNumber} of {totalQuestions}
        </div>

        <p className="q-title">{text}</p>

        <div className="answer-row">
          <button
            className="answer-btn"
            data-selected={existing === 'yes' ? 'true' : 'false'}
            onClick={() => handleAnswer('yes')}
          >
            Yes
          </button>
          <button
            className="answer-btn"
            data-selected={existing === 'maybe' ? 'true' : 'false'}
            onClick={() => handleAnswer('maybe')}
          >
            Not sure
          </button>
          <button
            className="answer-btn"
            data-selected={existing === 'no' ? 'true' : 'false'}
            onClick={() => handleAnswer('no')}
          >
            Not really
          </button>
        </div>

        <div className="nav-row">
          <button
            className="nav-btn"
            id="nav-back"
            disabled={qIndex === 0 && state.currentPillarIndex === 0}
            onClick={() => dispatch({ type: 'PREV_QUESTION' })}
          >
            ◀ Back
          </button>
          <button className="nav-btn" id="nav-next" onClick={() => dispatch({ type: 'NEXT_QUESTION' })}>
            Next ▶
          </button>
          <button className="nav-btn" id="nav-reset" onClick={() => dispatch({ type: 'RESET_PILLAR' })}>
            Reset pillar
          </button>
        </div>
      </div>
    </div>
  );
}

