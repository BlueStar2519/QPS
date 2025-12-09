'use client';

import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { AppState, Role, PillarKey, Scope, Who, Mode, SummaryStage, Answer } from '@/lib/utils';
import { orderedPillars, qpsQuestions } from '@/lib/data';

const initialState: AppState = {
  initialWho: null,
  scope: null,
  pillars: new Set(),
  mode: 'intro',
  currentRole: null,
  rolesSequence: [],
  currentRoleIndex: 0,
  currentPillarIndex: 0,
  currentQuestionIndex: -1,
  answers: {
    owner: {} as any,
    client1: {} as any,
    client2: {} as any,
    client3: {} as any,
  },
  summary: {
    stage: null,
    pillarIndex: 0
  }
};

type AppAction =
  | { type: 'SET_WHO'; payload: Who }
  | { type: 'SET_SCOPE'; payload: Scope }
  | { type: 'TOGGLE_PILLAR'; payload: PillarKey }
  | { type: 'SET_MODE'; payload: Mode }
  | { type: 'START_FLOW'; payload: { who: Who; scope: Scope; pillars: Set<PillarKey> } }
  | { type: 'SET_ANSWER'; payload: { pillarKey: PillarKey; questionId: string; answer: Answer } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'RESET_PILLAR' }
  | { type: 'ADD_CLIENT' }
  | { type: 'ENTER_SUMMARY' }
  | { type: 'SET_SUMMARY_STAGE'; payload: SummaryStage }
  | { type: 'NEXT_PILLAR_SUMMARY' }
  | { type: 'PREV_PILLAR_SUMMARY' }
  | { type: 'RESTART' };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_WHO':
      return { ...state, initialWho: action.payload };
    case 'SET_SCOPE':
      return { ...state, scope: action.payload };
    case 'TOGGLE_PILLAR': {
      const newPillars = new Set(state.pillars);
      if (newPillars.has(action.payload)) {
        newPillars.delete(action.payload);
      } else {
        newPillars.add(action.payload);
      }
      return { ...state, pillars: newPillars };
    }
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'START_FLOW': {
      const { who, scope, pillars } = action.payload;
      const rolesSequence: Role[] = who === 'my-brand' ? ['owner'] : ['client1'];
      return {
        ...state,
        initialWho: who,
        scope,
        pillars,
        mode: 'flow',
        currentRole: rolesSequence[0],
        rolesSequence,
        currentRoleIndex: 0,
        currentPillarIndex: 0,
        currentQuestionIndex: -1
      };
    }
    case 'SET_ANSWER': {
      const { pillarKey, questionId, answer } = action.payload;
      const role = state.currentRole!;
      const newAnswers = { ...state.answers };
      if (!newAnswers[role][pillarKey]) {
        newAnswers[role] = { ...newAnswers[role], [pillarKey]: {} };
      }
      newAnswers[role] = {
        ...newAnswers[role],
        [pillarKey]: {
          ...newAnswers[role][pillarKey],
          [questionId]: answer
        }
      };
      return { ...state, answers: newAnswers };
    }
    case 'NEXT_QUESTION': {
      const activePillars = orderedPillars.filter((k): k is PillarKey => 
        state.pillars.has(k as PillarKey)
      );
      const pillarKey = activePillars[state.currentPillarIndex];
      const pillar = qpsQuestions[pillarKey];
      
      if (state.currentQuestionIndex < pillar.questions.length - 1) {
        return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1 };
      } else {
        if (state.currentPillarIndex < activePillars.length - 1) {
          return {
            ...state,
            currentPillarIndex: state.currentPillarIndex + 1,
            currentQuestionIndex: -1
          };
        } else {
          return { ...state, currentPillarIndex: activePillars.length };
        }
      }
    }
    case 'PREV_QUESTION': {
      const activePillars = orderedPillars.filter((k): k is PillarKey => 
        state.pillars.has(k as PillarKey)
      );
      const pillarKey = activePillars[state.currentPillarIndex];
      
      if (state.currentQuestionIndex > 0) {
        return { ...state, currentQuestionIndex: state.currentQuestionIndex - 1 };
      } else {
        if (state.currentPillarIndex > 0) {
          const prevKey = activePillars[state.currentPillarIndex - 1];
          const prevPillar = qpsQuestions[prevKey];
          return {
            ...state,
            currentPillarIndex: state.currentPillarIndex - 1,
            currentQuestionIndex: prevPillar.questions.length - 1
          };
        }
      }
      return state;
    }
    case 'RESET_PILLAR': {
      const activePillars = orderedPillars.filter((k): k is PillarKey => 
        state.pillars.has(k as PillarKey)
      );
      const pillarKey = activePillars[state.currentPillarIndex];
      const role = state.currentRole!;
      const newAnswers = { ...state.answers };
      if (newAnswers[role][pillarKey]) {
        const { [pillarKey]: removed, ...rest } = newAnswers[role];
        newAnswers[role] = rest as any;
      }
      return {
        ...state,
        answers: newAnswers,
        currentQuestionIndex: -1
      };
    }
    case 'ADD_CLIENT': {
      const nextRoleMap: Record<Role, Role | null> = { owner: 'client1', client1: 'client2', client2: 'client3', client3: null };
      const nextRole = nextRoleMap[state.currentRole!];
      if (!nextRole) return state;
      
      const newSequence = [...state.rolesSequence];
      if (!newSequence.includes(nextRole)) {
        newSequence.push(nextRole);
      }
      return {
        ...state,
        currentRole: nextRole,
        currentRoleIndex: newSequence.indexOf(nextRole),
        currentPillarIndex: 0,
        currentQuestionIndex: -1
      };
    }
    case 'ENTER_SUMMARY':
      return {
        ...state,
        mode: 'summary',
        summary: { stage: 'pillar', pillarIndex: 0 }
      };
    case 'SET_SUMMARY_STAGE':
      return {
        ...state,
        summary: { ...state.summary, stage: action.payload }
      };
    case 'NEXT_PILLAR_SUMMARY': {
      const activePillars = orderedPillars.filter((k): k is PillarKey => 
        state.pillars.has(k as PillarKey)
      );
      if (state.summary.pillarIndex >= activePillars.length - 1) {
        return {
          ...state,
          summary: { stage: 'overall', pillarIndex: 0 }
        };
      } else {
        return {
          ...state,
          summary: { ...state.summary, pillarIndex: state.summary.pillarIndex + 1, stage: 'pillar' }
        };
      }
    }
    case 'PREV_PILLAR_SUMMARY': {
      if (state.summary.pillarIndex === 0) return state;
      return {
        ...state,
        summary: { ...state.summary, pillarIndex: state.summary.pillarIndex - 1, stage: 'pillar' }
      };
    }
    case 'RESTART':
      return initialState;
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const cancelAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      cancelAutoAdvance();
    };
  }, [cancelAutoAdvance]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

