import jsPDF from 'jspdf';
import { qpsQuestions, ROLE_LABELS, GI_MAP } from './data';
import { PillarKey, ScoresResult, fmtScore } from './utils';

// Helper function to add NC logo to all pages (top-right)
async function addNCLogoToAllPages(doc: jsPDF): Promise<void> {
  try {
    // Load the image from public folder
    const logoUrl = '/nc_logo.png';
    
    // Create an image element to load the logo
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve) => {
      img.onload = () => {
        try {
          const totalPages = doc.getNumberOfPages();
          const pageWidth = doc.internal.pageSize.getWidth();
          
          // Logo dimensions (adjust as needed - 15mm width for top-right)
          const logoWidth = 15;
          const logoHeight = (img.height / img.width) * logoWidth;
          
          // Position at top-right (10mm from top, 10mm from right)
          const logoX = pageWidth - logoWidth - 10;
          const logoY = 10;
          
          // Add logo to all pages
          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            // Use the image element directly - jsPDF can handle Image objects
            doc.addImage(img, 'PNG', logoX, logoY, logoWidth, logoHeight);
          }
          
          // Return to last page
          doc.setPage(totalPages);
          resolve();
        } catch (error) {
          console.warn('Could not add logo to PDF:', error);
          resolve(); // Continue even if logo fails
        }
      };
      
      img.onerror = () => {
        console.warn('Could not load logo image from:', logoUrl);
        console.warn('Make sure nc_logo.png is in the public folder');
        resolve(); // Continue even if logo fails to load
      };
      
      // Set timeout to prevent hanging
      setTimeout(() => {
        if (!img.complete) {
          console.warn('Logo image load timeout');
          resolve();
        }
      }, 5000);
      
      img.src = logoUrl;
    });
  } catch (error) {
    console.warn('Error adding logo:', error);
    // Continue without logo if there's an error
  }
}

export async function generatePillarPDF(
  pillarKey: PillarKey,
  ownerScores: ScoresResult | null,
  clientsAvgScores: ScoresResult | null,
  clientDetails: Array<{ role: string; label: string; data: ScoresResult }>
): Promise<void> {
  const pillar = qpsQuestions[pillarKey];
  const doc = new jsPDF();
  let yPos = 20;

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(191, 138, 101); // Brown/bronze color
  doc.text('Quiet Presence Score', 20, yPos);
  yPos += 12;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text(pillar.name, 20, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(pillar.tagline, 20, yPos);
  yPos += 15;

  // Scores table
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Pillar Comparison', 20, yPos);
  yPos += 12;

  const ownerScore = ownerScores ? ownerScores.pillars[pillarKey].score : null;
  const avgScore = clientsAvgScores ? clientsAvgScores.pillars[pillarKey].score : null;
  const gap = (ownerScore != null && avgScore != null) ? Math.abs(ownerScore - avgScore) : null;

  // Table headers
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Role', 20, yPos);
  doc.text('Score', 150, yPos);
  yPos += 10;

  // Owner row
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text('Owner', 20, yPos);
  doc.text(fmtScore(ownerScore), 150, yPos);
  yPos += 9;

  // Client rows
  clientDetails.forEach(detail => {
    const score = detail.data.pillars[pillarKey].score;
    doc.text(detail.label, 20, yPos);
    doc.text(fmtScore(score), 150, yPos);
    yPos += 9;
  });

  // Average row
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('Average of clients', 20, yPos);
  doc.text(fmtScore(avgScore), 150, yPos);
  yPos += 9;

  // Gap row
  doc.text('Gap (Owner vs. client avg.)', 20, yPos);
  doc.text(gap == null ? "—" : gap.toFixed(2) + " / 4", 150, yPos);
  yPos += 15;

  // Interpretation
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  let tone: string;
  if (gap == null) tone = "Not enough answers yet to see the gap clearly in this pillar.";
  else if (gap >= 1.0) tone = "Strong perception gap – everyday experience here feels different for you and your clients.";
  else if (gap >= 0.4) tone = "Moderate difference – worth observing and refining, but not critical yet.";
  else tone = "Views are largely aligned – you and your clients feel similar here.";

  doc.text('Reading this card:', 20, yPos);
  yPos += 6;
  const splitTone = doc.splitTextToSize(tone, 170);
  doc.text(splitTone, 20, yPos);

  // Footer
  yPos = 280;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, yPos);
  doc.text('Quiet Presence Score · Nuance & Clarity', 150, yPos);

  // Add logo to all pages
  await addNCLogoToAllPages(doc);

  doc.save(`QPS-${pillar.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
}

export async function generatePillarGHIPDF(
  pillarKey: PillarKey,
  ownerScores: ScoresResult | null,
  clientsAvgScores: ScoresResult | null,
  answers: any
): Promise<void> {
  const pillar = qpsQuestions[pillarKey];
  const doc = new jsPDF();
  let yPos = 20;

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(191, 138, 101); // Brown/bronze color
  doc.text('Quiet Presence Score', 20, yPos);
  yPos += 12;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text(`${pillar.name} · GHI Lens`, 20, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('Pillar → Global Brand Health', 20, yPos);
  yPos += 15;

  if (ownerScores && clientsAvgScores) {
    GI_MAP.forEach((ind, idx) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      const qIdsHere = ind.map.filter(id => pillar.questions.some(q => q.id === id));
      if (!qIdsHere.length) return;

      // Calculate scores
      const ownerVals: number[] = [];
      const clientVals: number[] = [];

      qIdsHere.forEach(qid => {
        const oA = (answers.owner[pillarKey] || {})[qid];
        if (oA === 'yes' || oA === 'maybe' || oA === 'no') {
          const score = oA === 'yes' ? 4 : oA === 'maybe' ? 2 : 0;
          ownerVals.push(score);
        }

        const avgA = (() => {
          const vals: number[] = [];
          ['client1', 'client2', 'client3'].forEach(r => {
            const ans = (answers[r]?.[pillarKey] || {})[qid];
            if (ans === 'yes' || ans === 'maybe' || ans === 'no') {
              const score = ans === 'yes' ? 4 : ans === 'maybe' ? 2 : 0;
              vals.push(score);
            }
          });
          if (!vals.length) return null;
          return vals.reduce((a, b) => a + b, 0) / vals.length;
        })();

        if (avgA != null) clientVals.push(avgA);
      });

      const oScore = ownerVals.length ? ownerVals.reduce((a, b) => a + b, 0) / ownerVals.length : null;
      const cScore = clientVals.length ? clientVals.reduce((a, b) => a + b, 0) / clientVals.length : null;
      const gap = (oScore != null && cScore != null) ? Math.abs(oScore - cScore) : null;

      // Indicator card
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(ind.name, 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(20, 20, 20);
      doc.text(`Owner: ${fmtScore(oScore)} · Client avg.: ${fmtScore(cScore)}`, 20, yPos);
      yPos += 8;
      doc.text(`Gap: ${gap == null ? "—" : gap.toFixed(2) + " / 4"}`, 20, yPos);
      yPos += 8;

      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      let tone: string;
      if (gap == null) tone = "Not enough answers in this pillar to size this indicator.";
      else if (gap >= 1.0) tone = "Strong gap – the way this pillar shows up may be shifting this indicator in opposite directions for you vs. clients.";
      else if (gap >= 0.4) tone = "Moderate difference – this pillar gently tilts this indicator for clients vs. how you perceive it.";
      else tone = "Aligned – this pillar supports a similar impression for this indicator on both sides.";

      const splitTone = doc.splitTextToSize(tone, 170);
      doc.text(splitTone, 20, yPos);
      yPos += splitTone.length * 5 + 10;
    });
  } else {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Add at least one owner scan and one client scan to see GHI impact for this pillar.', 20, yPos);
  }

  // Footer
  yPos = 280;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, yPos);
  doc.text('Quiet Presence Score · Nuance & Clarity', 150, yPos);

  // Add logo to all pages
  await addNCLogoToAllPages(doc);

  doc.save(`QPS-${pillar.name.replace(/\s+/g, '-')}-GHI-${new Date().toISOString().split('T')[0]}.pdf`);
}

export async function generateOverallPDF(
  activePillars: PillarKey[],
  ownerScores: ScoresResult | null,
  clientsAvgScores: ScoresResult | null
): Promise<void> {
  const doc = new jsPDF();
  let yPos = 20;

  // Header with brown/bronze title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(191, 138, 101); // Brown/bronze color
  doc.text('Quiet Presence Score', 20, yPos);
  
  yPos += 18;

  // Overall Comparison subtitle
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Overall Comparison', 20, yPos);
  yPos += 12;

  // Introductory paragraph
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  const introText = 'This card shows the overall pattern of where you are aligned with clients and where the gaps are wider.';
  const splitIntro = doc.splitTextToSize(introText, 170);
  doc.text(splitIntro, 20, yPos);
  yPos += splitIntro.length * 6 + 15;

  // Table with light grey header
  const tableStartY = yPos;
  
  // Header row background (light grey)
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPos - 8, 170, 10, 'F');
  
  // Header text
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Pillar', 22, yPos);
  doc.text('Owner', 102, yPos);
  doc.text('Clients avg.', 142, yPos);
  doc.text('Gap', 182, yPos);
  yPos += 12;

  // Table rows
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 20, 20);

  activePillars.forEach(key => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    const pillar = qpsQuestions[key];
    const oScore = ownerScores ? ownerScores.pillars[key].score : null;
    const avgScore = clientsAvgScores ? clientsAvgScores.pillars[key].score : null;
    const gap = (oScore != null && avgScore != null) ? Math.abs(oScore - avgScore) : null;

    doc.text(pillar.name, 22, yPos);
    doc.text(fmtScore(oScore), 102, yPos);
    doc.text(fmtScore(avgScore), 142, yPos);
    doc.text(gap == null ? "—" : gap.toFixed(2) + " / 4", 182, yPos);
    yPos += 10;
  });

  yPos += 8;

  // Global scores section
  const globalOwner = ownerScores ? ownerScores.global.score : null;
  const globalClients = clientsAvgScores ? clientsAvgScores.global.score : null;
  const globalGap = (globalOwner != null && globalClients != null)
    ? Math.abs(globalOwner - globalClients)
    : null;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text(`Global Quiet Presence Score · Owner: ${fmtScore(globalOwner)}`, 20, yPos);
  yPos += 10;
  doc.text(`Global Quiet Presence Score · Clients avg.: ${fmtScore(globalClients)}`, 20, yPos);
  yPos += 10;
  doc.text(`Global gap (Owner vs. clients avg.): ${globalGap == null ? "—" : globalGap.toFixed(2) + " / 4"}`, 20, yPos);
  yPos += 15;

  // Interpretation section
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  let overallTone: string;
  if (globalGap == null) overallTone = "You have at least one incomplete side, so the overall gap cannot be sized yet.";
  else if (globalGap >= 1.0) overallTone = "The overall quiet presence you think you offer is very different from what clients experience.";
  else if (globalGap >= 0.4) overallTone = "There is a visible difference in overall presence – refining key weak pillars will bring you closer.";
  else overallTone = "Your overall presence is largely aligned – focus on subtle refinement rather than reinvention.";

  doc.setFont('helvetica', 'bold');
  doc.text('Reading this card:', 20, yPos);
  yPos += 8;
  doc.setFont('helvetica', 'normal');
  const splitTone = doc.splitTextToSize(overallTone, 170);
  doc.text(splitTone, 20, yPos);

  // Footer
  yPos = 280;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, yPos);
  doc.text('Quiet Presence Score · Nuance & Clarity', 150, yPos);

  // Add logo to all pages
  await addNCLogoToAllPages(doc);

  doc.save(`QPS-Overall-${new Date().toISOString().split('T')[0]}.pdf`);
}

export async function generateOverallGHIPDF(
  ownerScores: ScoresResult | null,
  clientsAvgScores: ScoresResult | null
): Promise<void> {
  const doc = new jsPDF();
  let yPos = 20;

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(191, 138, 101); // Brown/bronze color
  doc.text('Quiet Presence Score', 20, yPos);
  yPos += 12;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('Overall · Global Brand Health', 20, yPos);
  yPos += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text('How your quiet presence shows up in business language', 20, yPos);
  yPos += 15;

  if (ownerScores && clientsAvgScores) {
    clientsAvgScores.indicators.forEach((ind, idx) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      const ownerInd = ownerScores.indicators[idx];
      const oScore = ownerInd.score;
      const cScore = ind.score;
      const gap = (oScore != null && cScore != null) ? Math.abs(oScore - cScore) : null;

      // Indicator card
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(ind.name, 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(20, 20, 20);
      doc.text(`Owner: ${fmtScore(oScore)} · Clients avg.: ${fmtScore(cScore)}`, 20, yPos);
      yPos += 8;
      doc.text(`Gap: ${gap == null ? "—" : gap.toFixed(2) + " / 4"}`, 20, yPos);
      yPos += 8;

      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      let tone: string;
      if (gap == null) tone = "Not enough answers yet to size this indicator.";
      else if (gap >= 1.0) tone = "Strong perception gap – business risk if left unattended.";
      else if (gap >= 0.4) tone = "Moderate difference – refine key touchpoints linked to this indicator.";
      else tone = "Aligned – maintain consistency and watch for early drift.";

      const splitTone = doc.splitTextToSize(tone, 170);
      doc.text(splitTone, 20, yPos);
      yPos += splitTone.length * 5 + 10;
    });
  } else {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Add at least one owner scan and one client scan to see the overall GHI picture.', 20, yPos);
  }

  // Footer
  yPos = 280;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, yPos);
  doc.text('Quiet Presence Score · Nuance & Clarity', 150, yPos);

  // Add logo to all pages
  await addNCLogoToAllPages(doc);

  doc.save(`QPS-Overall-GHI-${new Date().toISOString().split('T')[0]}.pdf`);
}

export async function generateFinalReportPDF(
  activePillars: PillarKey[],
  ownerScores: ScoresResult | null,
  clientsAvgScores: ScoresResult | null,
  clientDetails: Array<{ role: string; label: string; data: ScoresResult }>
): Promise<void> {
  const doc = new jsPDF();
  let yPos = 20;
  let pageNumber = 1;

  // Title Page
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(191, 138, 101); // Brown/bronze color
  doc.text('Quiet Presence Score', 105, 80, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('Complete Report', 105, 100, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 120, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text('Nuance & Clarity', 105, 140, { align: 'center' });
  
  yPos = 280;
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`Page ${pageNumber}`, 105, yPos, { align: 'center' });
  pageNumber++;

  // Page 2: Executive Summary
  doc.addPage();
  yPos = 20;

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Executive Summary', 20, yPos);
  yPos += 18;

  const globalOwner = ownerScores ? ownerScores.global.score : null;
  const globalClients = clientsAvgScores ? clientsAvgScores.global.score : null;
  const globalGap = (globalOwner != null && globalClients != null)
    ? Math.abs(globalOwner - globalClients)
    : null;

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('Global Quiet Presence Score', 20, yPos);
  yPos += 12;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 20, 20);
  doc.text(`Owner: ${fmtScore(globalOwner)}`, 20, yPos);
  yPos += 10;
  doc.text(`Clients avg.: ${fmtScore(globalClients)}`, 20, yPos);
  yPos += 10;
  doc.text(`Global gap: ${globalGap == null ? "—" : globalGap.toFixed(2) + " / 4"}`, 20, yPos);
  yPos += 15;

  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  let overallTone: string;
  if (globalGap == null) overallTone = "You have at least one incomplete side, so the overall gap cannot be sized yet.";
  else if (globalGap >= 1.0) overallTone = "The overall quiet presence you think you offer is very different from what clients experience.";
  else if (globalGap >= 0.4) overallTone = "There is a visible difference in overall presence – refining key weak pillars will bring you closer.";
  else overallTone = "Your overall presence is largely aligned – focus on subtle refinement rather than reinvention.";

  const splitTone = doc.splitTextToSize(overallTone, 170);
  doc.text(splitTone, 20, yPos);
  yPos += splitTone.length * 5 + 15;

  // Pillars Summary Table
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('Pillar Summary', 20, yPos);
  yPos += 12;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Pillar', 20, yPos);
  doc.text('Owner', 100, yPos);
  doc.text('Clients avg.', 140, yPos);
  doc.text('Gap', 180, yPos);
  yPos += 10;

  doc.setDrawColor(0, 0, 0, 0.3);
  doc.line(20, yPos - 2, 190, yPos - 2);
  yPos += 5;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 20, 20);

  activePillars.forEach(key => {
    if (yPos > 250) {
      doc.addPage();
      pageNumber++;
      yPos = 20;
    }

    const pillar = qpsQuestions[key];
    const oScore = ownerScores ? ownerScores.pillars[key].score : null;
    const avgScore = clientsAvgScores ? clientsAvgScores.pillars[key].score : null;
    const gap = (oScore != null && avgScore != null) ? Math.abs(oScore - avgScore) : null;

    doc.text(pillar.name, 20, yPos);
    doc.text(fmtScore(oScore), 100, yPos);
    doc.text(fmtScore(avgScore), 140, yPos);
    doc.text(gap == null ? "—" : gap.toFixed(2) + " / 4", 180, yPos);
    yPos += 8;
  });

  // Page 3+: Detailed Pillar Comparisons
  activePillars.forEach((pillarKey, idx) => {
    if (idx > 0 || yPos > 200) {
      doc.addPage();
      pageNumber++;
      yPos = 20;
    }

    const pillar = qpsQuestions[pillarKey];
    const ownerScore = ownerScores ? ownerScores.pillars[pillarKey].score : null;
    const avgScore = clientsAvgScores ? clientsAvgScores.pillars[pillarKey].score : null;
    const gap = (ownerScore != null && avgScore != null) ? Math.abs(ownerScore - avgScore) : null;

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(pillar.name, 20, yPos);
    yPos += 12;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(pillar.tagline, 20, yPos);
    yPos += 12;

    // Scores table
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Role', 20, yPos);
    doc.text('Score', 150, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 20, 20);
    doc.text('Owner', 20, yPos);
    doc.text(fmtScore(ownerScore), 150, yPos);
    yPos += 9;

    clientDetails.forEach(detail => {
      const score = detail.data.pillars[pillarKey].score;
      doc.text(detail.label, 20, yPos);
      doc.text(fmtScore(score), 150, yPos);
      yPos += 9;
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Average of clients', 20, yPos);
    doc.text(fmtScore(avgScore), 150, yPos);
    yPos += 9;

    doc.setFont('helvetica', 'normal');
    doc.text('Gap (Owner vs. client avg.)', 20, yPos);
    doc.text(gap == null ? "—" : gap.toFixed(2) + " / 4", 150, yPos);
    yPos += 15;

    // Interpretation
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    let tone: string;
    if (gap == null) tone = "Not enough answers yet to see the gap clearly in this pillar.";
    else if (gap >= 1.0) tone = "Strong perception gap – everyday experience here feels different for you and your clients.";
    else if (gap >= 0.4) tone = "Moderate difference – worth observing and refining, but not critical yet.";
    else tone = "Views are largely aligned – you and your clients feel similar here.";

    doc.text('Reading this card:', 20, yPos);
    yPos += 6;
    const splitTone = doc.splitTextToSize(tone, 170);
    doc.text(splitTone, 20, yPos);
    yPos += splitTone.length * 5 + 15;
  });

  // Global Brand Health Indicators
  if (ownerScores && clientsAvgScores) {
    if (yPos > 200) {
      doc.addPage();
      pageNumber++;
      yPos = 20;
    }

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Global Brand Health Indicators', 20, yPos);
    yPos += 14;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('How your quiet presence shows up in business language', 20, yPos);
    yPos += 15;

    clientsAvgScores.indicators.forEach((ind, idx) => {
      if (yPos > 250) {
        doc.addPage();
        pageNumber++;
        yPos = 20;
      }

      const ownerInd = ownerScores.indicators[idx];
      const oScore = ownerInd.score;
      const cScore = ind.score;
      const gap = (oScore != null && cScore != null) ? Math.abs(oScore - cScore) : null;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(ind.name, 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(20, 20, 20);
      doc.text(`Owner: ${fmtScore(oScore)} · Clients avg.: ${fmtScore(cScore)}`, 20, yPos);
      yPos += 8;
      doc.text(`Gap: ${gap == null ? "—" : gap.toFixed(2) + " / 4"}`, 20, yPos);
      yPos += 8;

      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
      let tone: string;
      if (gap == null) tone = "Not enough answers yet to size this indicator.";
      else if (gap >= 1.0) tone = "Strong perception gap – business risk if left unattended.";
      else if (gap >= 0.4) tone = "Moderate difference – refine key touchpoints linked to this indicator.";
      else tone = "Aligned – maintain consistency and watch for early drift.";

      const splitTone = doc.splitTextToSize(tone, 170);
      doc.text(splitTone, 20, yPos);
      yPos += splitTone.length * 5 + 10;
    });
  }

  // Footer on last page
  yPos = 280;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, yPos);
  doc.text('Quiet Presence Score · Nuance & Clarity', 150, yPos);
  doc.text(`Page ${pageNumber}`, 105, yPos, { align: 'center' });

  // Add logo to all pages
  await addNCLogoToAllPages(doc);

  doc.save(`QPS-Complete-Report-${new Date().toISOString().split('T')[0]}.pdf`);
}

