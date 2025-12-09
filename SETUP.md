# Setup Instructions

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js app directory (layout, page, global styles)
- `components/` - React components
  - `HeroCard.tsx` - Hero section
  - `IntroCard.tsx` - Introduction step
  - `RulesCard.tsx` - How to answer step
  - `SetupCard.tsx` - Setup/configuration step
  - `FlowCard.tsx` - Main flow controller
  - `PillarIntro.tsx` - Pillar introduction
  - `QuestionCard.tsx` - Question answering
  - `RolePrompt.tsx` - Role selection prompts
  - `SummaryCard.tsx` - Summary views (pillar, overall, GHI, final)
  - `GHIGuide.tsx` - Global Brand Health Indicators modal
- `contexts/` - React context for state management
  - `AppContext.tsx` - Main application state
- `lib/` - Data and utilities
  - `data.ts` - Questions, GHI indicators, constants
  - `utils.ts` - Helper functions and types
  - `pdfGenerator.ts` - PDF export functions

## Features Implemented

✅ Multi-step wizard interface
✅ Role-based answering (owner vs clients)
✅ Five Quiet Presence pillars
✅ Question flow with auto-advance
✅ Summary views:
  - Per-pillar comparison
  - Pillar GHI lens
  - Overall comparison
  - Overall GHI view
  - Developer JSON payload
✅ Global Brand Health Indicators guide modal
✅ All styling from original HTML preserved
✅ State management with React Context + useReducer
✅ PDF export functionality for all summary views

## PDF Export Features

The application includes full PDF export functionality:

- **Pillar PDF**: Exports individual pillar comparison with scores and gap analysis
- **Pillar GHI PDF**: Exports pillar-specific Global Brand Health Indicators analysis
- **Overall PDF**: Exports complete pillar comparison across all selected pillars
- **Overall GHI PDF**: Exports complete Global Brand Health Indicators overview

All PDFs are automatically downloaded with descriptive filenames including the date.

## Notes

- PDF generation uses jsPDF library (client-side generation)
- All functionality matches the original HTML file
- TypeScript errors should resolve after `npm install`

