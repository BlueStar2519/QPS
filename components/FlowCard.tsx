'use client';

import React, { useEffect, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { getActivePillarsInOrder, mapRoleToPerspective } from '@/lib/utils';
import { qpsQuestions, ROLE_LABELS } from '@/lib/data';
import { PillarKey, Answer } from '@/lib/utils';
import PillarIntro from './PillarIntro';
import QuestionCard from './QuestionCard';
import RolePrompt from './RolePrompt';
import SummaryCard from './SummaryCard';

export default function FlowCard() {
  const { state, dispatch } = useApp();
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  if (state.mode === 'summary') {
    return <SummaryCard />;
  }

  const active = getActivePillarsInOrder(state.pillars);

  if (state.currentPillarIndex >= active.length) {
    if (state.initialWho === 'my-brand') {
      return <RolePrompt />;
    } else {
      dispatch({ type: 'ENTER_SUMMARY' });
      return <SummaryCard />;
    }
  }

  const pillarKey = active[state.currentPillarIndex];
  const pillar = qpsQuestions[pillarKey];

  if (state.currentQuestionIndex === -1) {
    return <PillarIntro pillarKey={pillarKey} totalPillars={active.length} />;
  }

  if (state.currentQuestionIndex >= pillar.questions.length) {
    dispatch({ type: 'NEXT_QUESTION' });
    return null;
  }

  const question = pillar.questions[state.currentQuestionIndex];

  return (
    <QuestionCard
      pillarKey={pillarKey}
      question={question}
      totalQuestions={pillar.questions.length}
      autoAdvanceTimerRef={autoAdvanceTimerRef}
    />
  );
}

