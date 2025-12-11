'use client';

import { useApp } from '@/contexts/AppContext';
import { getActivePillarsInOrder, computeScoresForAnswers, averageClientScores, fmtScore, Role } from '@/lib/utils';
import { qpsQuestions, ROLE_LABELS, GI_MAP, ANSWER_SCORES } from '@/lib/data';
import { PillarKey } from '@/lib/utils';
import { useMemo } from 'react';
import { generatePillarPDF, generatePillarGHIPDF, generateOverallPDF, generateOverallGHIPDF, generateFinalReportPDF } from '@/lib/pdfGenerator';

export default function SummaryCard() {
  const { state, dispatch } = useApp();

  const active = getActivePillarsInOrder(state.pillars);
  const ownerDone = !!state.answers.owner && Object.keys(state.answers.owner).length > 0;
  const clientBundles = (['client1', 'client2', 'client3'] as const).filter(r => {
    const b = state.answers[r];
    return b && Object.keys(b).length > 0;
  }) as Array<'client1' | 'client2' | 'client3'>;

  const ownerScores = useMemo(() => {
    return ownerDone
      ? computeScoresForAnswers(state.answers.owner, active, { role: 'owner' })
      : null;
  }, [ownerDone, state.answers.owner, active]);

  const clientsAvgScores = useMemo(() => {
    return clientBundles.length ? averageClientScores(state.answers, active) : null;
  }, [clientBundles.length, state.answers, active]);

  const clientDetails = useMemo(() => {
    return clientBundles.map(r => ({
      role: r,
      label: ROLE_LABELS[r],
      data: computeScoresForAnswers(state.answers[r], active, { role: r })
    }));
  }, [clientBundles, state.answers, active]);

  if (!active.length) {
    return (
      <div className="card">
        <div className="card-header-row">
          <div className="card-title">Completed</div>
          <div className="card-step-pill">Summary</div>
        </div>
        <div className="card-body">
          <p className="q-title">No pillars selected.</p>
          <p className="q-hint">Please run the scan again with at least one pillar.</p>
          <div className="btn-row">
            <button className="ghost-btn" onClick={() => dispatch({ type: 'RESTART' })}>Start over</button>
          </div>
        </div>
      </div>
    );
  }

  if (state.summary.stage === 'pillar') {
    const idx = state.summary.pillarIndex;
    if (idx >= active.length) {
      dispatch({ type: 'SET_SUMMARY_STAGE', payload: 'overall' });
      return null;
    }
    const pillarKey = active[idx];
    const pillar = qpsQuestions[pillarKey];

    const ownerScore = ownerScores ? ownerScores.pillars[pillarKey].score : null;
    const clientScores = clientDetails.map(d => d.data.pillars[pillarKey].score);
    const avgScore = clientsAvgScores ? clientsAvgScores.pillars[pillarKey].score : null;
    const gap = (ownerScore != null && avgScore != null)
      ? Math.abs(ownerScore - avgScore)
      : null;

    let tone: string;
    if (gap == null) tone = "Not enough answers yet to see the gap clearly in this pillar.";
    else if (gap >= 1.0) tone = "Strong perception gap – everyday experience here feels different for you and your clients.";
    else if (gap >= 0.4) tone = "Moderate difference – worth observing and refining, but not critical yet.";
    else tone = "Views are largely aligned – you and your clients feel similar here.";

    const rows = (
      <>
        <tr>
          <td>Owner</td>
          <td className="num">{fmtScore(ownerScore)}</td>
        </tr>
        {(['client1', 'client2', 'client3'] as const).map((r, i) => {
          const d = clientDetails.find(x => x.role === r);
          return (
            <tr key={r}>
              <td>{ROLE_LABELS[r]}</td>
              <td className="num">{fmtScore(d ? d.data.pillars[pillarKey].score : null)}</td>
            </tr>
          );
        })}
        <tr>
          <td><strong>Average of clients</strong></td>
          <td className="num">{fmtScore(avgScore)}</td>
        </tr>
        <tr>
          <td><strong>Gap (Owner vs. client avg.)</strong></td>
          <td className="num">{gap == null ? "—" : gap.toFixed(2) + " / 4"}</td>
        </tr>
      </>
    );

    return (
      <div className="card">
        <div className="card-header-row">
          <div className="card-title">{pillar.name} · comparison</div>
          <div className="card-step-pill">Pillar {idx + 1} of {active.length}</div>
        </div>
        <div className="card-body">
          <div className="role-badge">Pillar comparison</div>
          <p className="q-title">{pillar.name}</p>
          <p className="q-hint">{pillar.tagline}</p>

          <table className="summary-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>

          <p className="completion-note">
            <strong>Reading this card:</strong> {tone}
          </p>

          <div className="btn-row">
            <button
              className="ghost-btn"
              disabled={idx === 0}
              onClick={() => dispatch({ type: 'PREV_PILLAR_SUMMARY' })}
            >
              ◀ Previous pillar
            </button>
            <button
              className="ghost-btn"
              onClick={() => dispatch({ type: 'SET_SUMMARY_STAGE', payload: 'pillar-ghi' })}
            >
              What this means in GHI
            </button>
            <button
              className="ghost-btn"
              onClick={async () => {
                await generatePillarPDF(pillarKey, ownerScores, clientsAvgScores, clientDetails);
              }}
            >
              Generate PDF for this pillar
            </button>
            <button className="primary-btn" onClick={() => dispatch({ type: 'NEXT_PILLAR_SUMMARY' })}>
              {idx === active.length - 1 ? "Go to overall view ⟶" : "Next pillar ⟶"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.summary.stage === 'pillar-ghi') {
    const idx = state.summary.pillarIndex;
    const pillarKey = active[idx];
    const pillar = qpsQuestions[pillarKey];

    let cardsHtml: React.ReactNode[] = [];
    if (ownerScores && clientsAvgScores) {
      GI_MAP.forEach(ind => {
        const qIdsHere = ind.map.filter(id => pillar.questions.some(q => q.id === id));
        if (!qIdsHere.length) return;

        const ownerVals: number[] = [];
        const clientVals: number[] = [];

        qIdsHere.forEach(qid => {
          const oA = (state.answers.owner[pillarKey] || {})[qid];
          if (oA && ANSWER_SCORES[oA] != null) ownerVals.push(ANSWER_SCORES[oA]);

          const avgA = (() => {
            const vals: number[] = [];
            (['client1', 'client2', 'client3'] as const).forEach(r => {
              const ans = (state.answers[r][pillarKey] || {})[qid];
              if (ans && ANSWER_SCORES[ans] != null) vals.push(ANSWER_SCORES[ans]);
            });
            if (!vals.length) return null;
            return vals.reduce((a, b) => a + b, 0) / vals.length;
          })();

          if (avgA != null) clientVals.push(avgA);
        });

        const oScore = ownerVals.length ? ownerVals.reduce((a, b) => a + b, 0) / ownerVals.length : null;
        const cScore = clientVals.length ? clientVals.reduce((a, b) => a + b, 0) / clientVals.length : null;
        const gap = (oScore != null && cScore != null) ? Math.abs(oScore - cScore) : null;

        let tone: string;
        if (gap == null) tone = "Not enough answers in this pillar to size this indicator.";
        else if (gap >= 1.0) tone = "Strong gap – the way this pillar shows up may be shifting this indicator in opposite directions for you vs. clients.";
        else if (gap >= 0.4) tone = "Moderate difference – this pillar gently tilts this indicator for clients vs. how you perceive it.";
        else tone = "Aligned – this pillar supports a similar impression for this indicator on both sides.";

        cardsHtml.push(
          <div
            key={ind.name}
            className="completion-note"
            style={{
              borderRadius: '12px',
              border: '1px dashed rgba(245,245,243,0.18)',
              padding: '7px 9px',
              background: 'rgba(0,0,0,0.5)',
              marginTop: '6px'
            }}
          >
            <strong>{ind.name}</strong><br />
            Owner: {fmtScore(oScore)} · Client avg.: {fmtScore(cScore)}<br />
            Gap: {gap == null ? "—" : gap.toFixed(2) + " / 4"}<br />
            <span>{tone}</span>
          </div>
        );
      });
    } else {
      cardsHtml = [
        <div key="no-data" className="completion-note">
          Add at least one owner scan and one client scan to see GHI impact for this pillar.
        </div>
      ];
    }

    return (
      <div className="card">
        <div className="card-header-row">
          <div className="card-title">{pillar.name} · GHI lens</div>
          <div className="card-step-pill">Pillar {idx + 1} · GHI</div>
        </div>
        <div className="card-body">
          <div className="role-badge">Pillar → Global Brand Health</div>
          <p className="q-title">{pillar.name}</p>
          <p className="q-hint">
            Here you can see how this pillar alone contributes to key business indicators for retention,
            pricing power and day-to-day stability.
          </p>
          {cardsHtml}
          <div className="btn-row">
            <button
              className="ghost-btn"
              onClick={() => dispatch({ type: 'SET_SUMMARY_STAGE', payload: 'pillar' })}
            >
              Back to pillar
            </button>
            <button
              className="ghost-btn"
              onClick={async () => {
                await generatePillarGHIPDF(pillarKey, ownerScores, clientsAvgScores, state.answers);
              }}
            >
              PDF: GHI for this pillar
            </button>
            <button className="primary-btn" onClick={() => dispatch({ type: 'NEXT_PILLAR_SUMMARY' })}>
              {idx === active.length - 1 ? "Go to overall view ⟶" : "Next pillar ⟶"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.summary.stage === 'overall') {
    const rows = active.map(key => {
      const pillar = qpsQuestions[key];
      const oScore = ownerScores ? ownerScores.pillars[key].score : null;
      const avgScore = clientsAvgScores ? clientsAvgScores.pillars[key].score : null;
      const gap = (oScore != null && avgScore != null) ? Math.abs(oScore - avgScore) : null;

      return (
        <tr key={key}>
          <td>{pillar.name}</td>
          <td className="num">{fmtScore(oScore)}</td>
          <td className="num">{fmtScore(avgScore)}</td>
          <td className="num">{gap == null ? "—" : gap.toFixed(2) + " / 4"}</td>
        </tr>
      );
    });

    const globalOwner = ownerScores ? ownerScores.global.score : null;
    const globalClients = clientsAvgScores ? clientsAvgScores.global.score : null;
    const globalGap = (globalOwner != null && globalClients != null)
      ? Math.abs(globalOwner - globalClients)
      : null;

    let overallTone: string;
    if (globalGap == null) overallTone = "You have at least one incomplete side, so the overall gap cannot be sized yet.";
    else if (globalGap >= 1.0) overallTone = "The overall quiet presence you think you offer is very different from what clients experience.";
    else if (globalGap >= 0.4) overallTone = "There is a visible difference in overall presence – refining key weak pillars will bring you closer.";
    else overallTone = "Your overall presence is largely aligned – focus on subtle refinement rather than reinvention.";

    return (
      <div className="card">
        <div className="card-header-row">
          <div className="card-title">Overall comparison</div>
          <div className="card-step-pill">All selected pillars</div>
        </div>
        <div className="card-body">
          <p className="q-title">All pillars · Owner vs. average of clients</p>
          <p className="q-hint">
            This card shows the overall pattern of where you are aligned with clients and where the gaps are wider.
          </p>

          <table className="summary-table">
            <thead>
              <tr>
                <th>Pillar</th>
                <th>Owner</th>
                <th>Clients avg.</th>
                <th>Gap</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>

          <div className="completion-note">
            <strong>Global Quiet Presence Score · Owner:</strong> {fmtScore(globalOwner)}<br />
            <strong>Global Quiet Presence Score · Clients avg.:</strong> {fmtScore(globalClients)}<br />
            <strong>Global gap (Owner vs. clients avg.):</strong> {globalGap == null ? "—" : globalGap.toFixed(2) + " / 4"}
          </div>
          <div className="completion-note">
            <strong>Reading this card:</strong> {overallTone}
          </div>

          <div className="btn-row">
            <button
              className="ghost-btn"
              onClick={async () => {
                await generateOverallPDF(active, ownerScores, clientsAvgScores);
              }}
            >
              PDF: overall pillar comparison
            </button>
            <button
              className="ghost-btn"
              onClick={() => dispatch({ type: 'SET_SUMMARY_STAGE', payload: 'overall-ghi' })}
            >
              What this overall picture means in GHI
            </button>
            <button
              className="primary-btn"
              onClick={() => dispatch({ type: 'SET_SUMMARY_STAGE', payload: 'final' })}
            >
              Finish & show developer JSON ⟶
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.summary.stage === 'overall-ghi') {
    let cardsHtml: React.ReactNode[] = [];
    if (ownerScores && clientsAvgScores) {
      clientsAvgScores.indicators.forEach((ind, idx) => {
        const ownerInd = ownerScores.indicators[idx];
        const oScore = ownerInd.score;
        const cScore = ind.score;
        const gap = (oScore != null && cScore != null) ? Math.abs(oScore - cScore) : null;

        let tone: string;
        if (gap == null) tone = "Not enough answers yet to size this indicator.";
        else if (gap >= 1.0) tone = "Strong perception gap – business risk if left unattended.";
        else if (gap >= 0.4) tone = "Moderate difference – refine key touchpoints linked to this indicator.";
        else tone = "Aligned – maintain consistency and watch for early drift.";

        cardsHtml.push(
          <div
            key={ind.name}
            className="completion-note"
            style={{
              borderRadius: '12px',
              border: '1px dashed rgba(245,245,243,0.18)',
              padding: '7px 9px',
              background: 'rgba(0,0,0,0.5)',
              marginTop: '6px'
            }}
          >
            <strong>{ind.name}</strong><br />
            Owner: {fmtScore(oScore)} · Clients avg.: {fmtScore(cScore)}<br />
            Gap: {gap == null ? "—" : gap.toFixed(2) + " / 4"}<br />
            <span>{tone}</span>
          </div>
        );
      });
    } else {
      cardsHtml = [
        <div key="no-data" className="completion-note">
          Add at least one owner scan and one client scan to see the overall GHI picture.
        </div>
      ];
    }

    return (
      <div className="card">
        <div className="card-header-row">
          <div className="card-title">Overall · Global Brand Health</div>
          <div className="card-step-pill">GHI summary</div>
        </div>
        <div className="card-body">
          <p className="q-title">How your quiet presence shows up in business language</p>
          <p className="q-hint">
            Each indicator connects your quiet presence to retention, pricing power, referrals and experience quality.
          </p>
          {cardsHtml}
          <div className="btn-row">
            <button
              className="ghost-btn"
              onClick={() => dispatch({ type: 'SET_SUMMARY_STAGE', payload: 'overall' })}
            >
              Back to overall comparison
            </button>
            <button
              className="ghost-btn"
              onClick={async () => {
                await generateOverallGHIPDF(ownerScores, clientsAvgScores);
              }}
            >
              PDF: overall GHI view
            </button>
            <button
              className="primary-btn"
              onClick={() => dispatch({ type: 'SET_SUMMARY_STAGE', payload: 'final' })}
            >
              Finish & show developer JSON ⟶
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.summary.stage === 'final') {
    const payload = {
      meta: {
        initialWho: state.initialWho,
        scope: state.scope,
        pillars: active,
        rolesSequence: state.rolesSequence,
        timestamp: new Date().toISOString()
      },
      roles: {
        ...(ownerScores ? { owner: ownerScores } : {}),
        ...Object.fromEntries(
          clientDetails.map(d => [d.role, d.data])
        ),
        ...(clientsAvgScores ? { clientsAverage: clientsAvgScores } : {})
      }
    };

    const jsonHtml = JSON.stringify(payload, null, 2);

    return (
      <div className="card">
        <div className="card-header-row">
          <div className="card-title">Completed</div>
          <div className="card-step-pill">Developer payload</div>
        </div>
        <div className="card-body">
          <p className="q-title">Quiet Presence Score · data package</p>
          <p className="q-hint">
            This JSON object can be passed to your QPS / Quiet Signals reporting engine and PDF / email layer.
          </p>
          <div className="json-block">
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{jsonHtml}</pre>
          </div>
          <div className="btn-row">
            <button className="ghost-btn" onClick={() => dispatch({ type: 'RESTART' })}>Start over</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

