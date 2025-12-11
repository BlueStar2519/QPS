'use client';

export default function HeroCard() {
  return (
    <section className="hero-card">
      <div className="hero-inner">
        <p className="hero-kicker">Fast, calm brand scan</p>
        <h1 className="hero-title">
          Quiet Presence Score <span>(QPS)</span>
        </h1>
        <p className="hero-subtitle">
          A guided, card-by-card scan of how <strong>you</strong> see your brand or space – and how up to
          <strong> three clients, guests or visitors</strong> quietly experience it. The gap between these views
          reveals where your presence needs refinement.
        </p>
        <div className="hero-row">
          <div className="hero-pill">Approx. 2–6 minutes per person</div>
          <div className="hero-pill">5 Quiet Presence pillars</div>
          <div className="hero-pill">Instinctive, not theoretical</div>
        </div>
        <p className="hero-meta">
          Answer from your <strong>first honest feeling</strong>, not from how you wish things were.
          QPS is a quiet internal mirror – not a public score.
        </p>
      </div>
    </section>
  );
}

