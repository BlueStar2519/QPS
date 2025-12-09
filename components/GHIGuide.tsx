'use client';

import React, { useState, useEffect } from 'react';
import { GHI_TOP_SOURCES, GHI_CARD_CONTENT } from '@/lib/data';
import { renderGhiLinkRow } from '@/lib/utils';

export default function GHIGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="ghi-float-btn" onClick={() => setIsOpen(true)}>
        Global Brand Health
      </button>

      <div className={`ghi-backdrop ${isOpen ? 'open' : ''}`} onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}>
        <div className="ghi-dialog" role="dialog" aria-modal="true" aria-labelledby="ghi-title">
          <div className="ghi-header">
            <h3 id="ghi-title">Global Brand Health Indicators</h3>
            <button className="ghi-close" onClick={() => setIsOpen(false)}>Close</button>
          </div>
          <p style={{ fontSize: '12px', margin: '0 0 6px' }}>
            These ten indicators translate your QPS answers into business language. They are inspired by
            marketing science work around brand health, retention, pricing power and experience quality.
          </p>
          <p
            className="ghi-sources-overall"
            dangerouslySetInnerHTML={{
              __html: "Sources: " + renderGhiLinkRow(GHI_TOP_SOURCES)
            }}
          />

          <div className="ghi-grid">
            {GHI_CARD_CONTENT.map(item => {
              const linksHtml = item.sources && item.sources.length
                ? `<small class="ghi-sources-row">${renderGhiLinkRow(item.sources)}</small>`
                : "";
              return (
                <div key={item.base} className="ghi-card">
                  <strong>{item.title}</strong><br />
                  <span>{item.description}</span><br />
                  <small>{item.consequence}</small><br />
                  <div dangerouslySetInnerHTML={{ __html: linksHtml }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

