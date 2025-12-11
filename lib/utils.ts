import { qpsQuestions, orderedPillars, ANSWER_SCORES, GI_MAP, GI_DESC, PILLAR_WEIGHTS } from './data';

export type Role = 'owner' | 'client1' | 'client2' | 'client3';
export type Answer = 'yes' | 'maybe' | 'no';
export type PillarKey = keyof typeof qpsQuestions;
export type Scope = 'full' | 'custom' | null;
export type Who = 'my-brand' | 'client' | null;
export type Mode = 'intro' | 'rules' | 'setup' | 'flow' | 'summary';
export type SummaryStage = 'pillar' | 'pillar-ghi' | 'overall' | 'overall-ghi' | 'final' | null;

export interface Answers {
  owner: Record<PillarKey, Record<string, Answer>>;
  client1: Record<PillarKey, Record<string, Answer>>;
  client2: Record<PillarKey, Record<string, Answer>>;
  client3: Record<PillarKey, Record<string, Answer>>;
}

export interface AppState {
  initialWho: Who;
  scope: Scope;
  pillars: Set<PillarKey>;
  mode: Mode;
  currentRole: Role | null;
  rolesSequence: Role[];
  currentRoleIndex: number;
  currentPillarIndex: number;
  currentQuestionIndex: number;
  answers: Answers;
  summary: {
    stage: SummaryStage;
    pillarIndex: number;
  };
}

export function mapRoleToPerspective(role: Role): 'you' | 'client' {
  if (role === "owner") return "you";
  return "client";
}

export function getActivePillarsInOrder(pillars: Set<PillarKey>): PillarKey[] {
  return orderedPillars.filter((k): k is PillarKey => pillars.has(k as PillarKey));
}

export function fmtScore(val: number | null): string {
  return val == null ? "—" : val.toFixed(2) + " / 4";
}

export interface PillarSummary {
  key: PillarKey;
  name: string;
  tag: string;
  score: number | null;
  label: string;
  note: string;
  answered: number;
  questionsTotal: number;
}

export interface IndicatorResult {
  name: string;
  description: string;
  score: number | null;
  level: string;
}

export interface ScoresResult {
  meta: {
    role: Role | 'clientsAverage';
    pillarsActive: PillarKey[];
  };
  pillars: Record<PillarKey, PillarSummary>;
  indicators: IndicatorResult[];
  global: {
    score: number | null;
  };
}

export function computeScoresForAnswers(
  answersBundle: Record<PillarKey, Record<string, Answer>>,
  activePillars: PillarKey[],
  meta: { role: Role | 'clientsAverage' }
): ScoresResult {
  const pillarsSummary: Record<PillarKey, PillarSummary> = {} as Record<PillarKey, PillarSummary>;
  
  activePillars.forEach(key => {
    const pillar = qpsQuestions[key];
    const answersForPillar = answersBundle[key] || {};
    let total = 0;
    let count = 0;

    pillar.questions.forEach(q => {
      const a = answersForPillar[q.id];
      if (a && ANSWER_SCORES[a] != null) {
        total += ANSWER_SCORES[a];
        count++;
      }
    });

    const score = count > 0 ? total / count : null;
    let label, note;
    if (score == null) {
      label = "Incomplete";
      note = "Not enough answers yet to size this pillar.";
    } else if (score >= 3.2) {
      label = "Strong";
      note = "Consistently strong quiet signal in this area.";
    } else if (score >= 2.2) {
      label = "Steady";
      note = "Signal is visible but could be refined.";
    } else {
      label = "Underpowered";
      note = "Signals here may be weakening your overall presence.";
    }

    pillarsSummary[key] = {
      key,
      name: pillar.name,
      tag: pillar.tag,
      score,
      label,
      note,
      answered: count,
      questionsTotal: pillar.questions.length
    };
  });

  let globalTotal = 0;
  let globalWeight = 0;
  activePillars.forEach(key => {
    const s = pillarsSummary[key].score;
    if (s != null) {
      const w = PILLAR_WEIGHTS[key] ?? 1;
      globalTotal += s * w;
      globalWeight += w;
    }
  });
  const globalScore = globalWeight > 0 ? globalTotal / globalWeight : null;

  const indicators = GI_MAP.map(ind => {
    const values: number[] = [];

    ind.map.forEach(qid => {
      for (const pKey of activePillars) {
        const pillar = qpsQuestions[pKey];
        const q = pillar.questions.find(qq => qq.id === qid);
        if (q) {
          const ans = (answersBundle[pKey] || {})[qid];
          if (ans && ANSWER_SCORES[ans] != null) {
            values.push(ANSWER_SCORES[ans]);
          }
          break;
        }
      }
    });

    const score = values.length ? values.reduce((a,b) => a+b, 0) / values.length : null;
    let level;
    if (score == null) level = "Unknown";
    else if (score >= 3.2) level = "Strong";
    else if (score >= 2.2) level = "Steady";
    else level = "Underpowered";

    return {
      name: ind.name,
      description: GI_DESC[ind.name as keyof typeof GI_DESC],
      score,
      level
    };
  });

  return {
    meta: {
      ...meta,
      pillarsActive: activePillars
    },
    pillars: pillarsSummary,
    indicators,
    global: {
      score: globalScore
    }
  };
}

export function averageClientScores(
  answers: Answers,
  activePillars: PillarKey[]
): ScoresResult | null {
  const roles: Role[] = ["client1","client2","client3"];

  const perClient = roles.map(r => {
    const bundle = answers[r] || {};
    const hasAnswer = activePillars.some(k => !!bundle[k]);
    return hasAnswer ? computeScoresForAnswers(bundle, activePillars, { role: r }) : null;
  });

  const valid = perClient.filter(x => x !== null) as ScoresResult[];
  if (!valid.length) return null;

  const avgPillars: Record<PillarKey, PillarSummary> = {} as Record<PillarKey, PillarSummary>;
  activePillars.forEach(key => {
    let sum = 0, count = 0;
    valid.forEach(ps => {
      const s = ps.pillars[key].score;
      if (s != null) { sum += s; count++; }
    });
    const score = count ? sum / count : null;
    avgPillars[key] = Object.assign({}, valid[0].pillars[key], { score });
  });

  const avgIndicators = GI_MAP.map((ind, idx) => {
    let sum = 0, count = 0;
    valid.forEach(ps => {
      const s = ps.indicators[idx].score;
      if (s != null) { sum += s; count++; }
    });
    const score = count ? sum / count : null;
    let level;
    if (score == null) level = "Unknown";
    else if (score >= 3.2) level = "Strong";
    else if (score >= 2.2) level = "Steady";
    else level = "Underpowered";

    return {
      name: ind.name,
      description: GI_DESC[ind.name as keyof typeof GI_DESC],
      score,
      level
    };
  });

  let gSum = 0, gCount = 0;
  valid.forEach(ps => {
    const s = ps.global.score;
    if (s != null) { gSum += s; gCount++; }
  });
  const globalScore = gCount ? gSum / gCount : null;

  return {
    meta: { role: "clientsAverage", pillarsActive: activePillars },
    pillars: avgPillars,
    indicators: avgIndicators,
    global: { score: globalScore }
  };
}

export function renderGhiLinkRow(list: Array<{ label: string; url: string }>): string {
  return list
    .map(x => `<a href="${x.url}" target="_blank" rel="noopener">${x.label}</a>`)
    .join(" · ");
}

