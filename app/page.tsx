'use client';

import { useApp } from '@/contexts/AppContext';
import HeroCard from '@/components/HeroCard';
import IntroCard from '@/components/IntroCard';
import RulesCard from '@/components/RulesCard';
import SetupCard from '@/components/SetupCard';
import FlowCard from '@/components/FlowCard';
import GHIGuide from '@/components/GHIGuide';

export default function Home() {
  const { state } = useApp();

  return (
    <div className="page-shell">
      <GHIGuide />
      <main>
        <div className="nc-container">
          <div className="nc-badge">
            <span className="nc-badge-dot"></span>
            <span>Quiet Presence Score · QPS</span>
          </div>

          {state.mode === 'intro' && <HeroCard />}

          <section className="card-stack-shell">
            {state.mode === 'intro' && <IntroCard />}
            {state.mode === 'rules' && <RulesCard />}
            {state.mode === 'setup' && <SetupCard />}
            {(state.mode === 'flow' || state.mode === 'summary') && <FlowCard />}
          </section>
        </div>
      </main>
      
      {/* NC Logo at bottom of every page */}
      <footer className="nc-logo-footer">
        <img src="/nc_logo.png" alt="Nuance & Clarity" className="nc-logo-img" />
      </footer>
    </div>
  );
}

