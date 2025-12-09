'use client';

import { useApp } from '@/contexts/AppContext';
import { ROLE_LABELS } from '@/lib/data';
import { Role } from '@/lib/utils';

export default function RolePrompt() {
  const { state, dispatch } = useApp();
  const isOwner = state.currentRole === 'owner';
  const nextRoleMap: Record<Role, Role | null> = { owner: 'client1', client1: 'client2', client2: 'client3', client3: null };
  const nextRole = state.currentRole ? nextRoleMap[state.currentRole] : null;

  let title: string;
  let body: React.ReactNode;

  if (isOwner) {
    title = "Invite a client?";
    body = (
      <>
        <p className="q-title">Would you like a client, guest or visitor to rate the same pillars now?</p>
        <p className="q-hint">
          This gives you a side-by-side view of how you see your business and how others experience it quietly.
        </p>
        <div className="btn-row">
          <button className="ghost-btn" onClick={() => dispatch({ type: 'ENTER_SUMMARY' })}>
            No, go to my results
          </button>
          <button className="primary-btn" onClick={() => dispatch({ type: 'ADD_CLIENT' })}>
            Yes · Add Client 1 ⟶
          </button>
        </div>
      </>
    );
  } else if (nextRole) {
    const label = ROLE_LABELS[nextRole];
    title = "Add another client?";
    body = (
      <>
        <p className="q-title">Would you like to add another person?</p>
        <p className="q-hint">
          You can add up to three clients / guests. You've just completed {(ROLE_LABELS as Record<string, string>)[state.currentRole!]}.
        </p>
        <div className="btn-row">
          <button className="ghost-btn" onClick={() => dispatch({ type: 'ENTER_SUMMARY' })}>
            No, show comparison
          </button>
          <button className="primary-btn" onClick={() => dispatch({ type: 'ADD_CLIENT' })}>
            Yes · Add {label} ⟶
          </button>
        </div>
      </>
    );
  } else {
    title = "All client scans complete";
    body = (
      <>
        <p className="q-title">You've reached the limit of three clients.</p>
        <p className="q-hint">
          We'll now compare all completed views and link them to Global Brand Health Indicators.
        </p>
        <div className="btn-row">
          <button className="primary-btn" onClick={() => dispatch({ type: 'ENTER_SUMMARY' })}>
            Show comparison ⟶
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="card">
      <div className="card-header-row">
        <div className="card-title">{title}</div>
        <div className="card-step-pill">{isOwner ? "Owner" : ((ROLE_LABELS as Record<string, string>)[state.currentRole!] || "")}</div>
      </div>
      <div className="card-body">
        {body}
      </div>
    </div>
  );
}

