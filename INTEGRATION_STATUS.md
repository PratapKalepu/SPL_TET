# Integration status — AP TET practice site

## What's been added
The organized question-bank library has been copied under `data/banks/`, grouped by subject:
- `biology/`
- `cdp/`
- `english/`
- `maths/`
- `physical-science/`
- `telugu/`

The original UI and exam engine are preserved.

## Important current wiring status
`js/exam-engine.js` currently loads the fixed files `data/paper2a-maths.json` and `data/paper2a-telugu.json`. Those two files are not replaced automatically by the batch library. `js/practice.js` still has preview test-card metadata (including “To be configured”). Thus the new batch files are staged, but aren't selectable/run in the website yet.

## Next implementation steps
1. Build a registry that maps each practice card to one or more bank files and a defined question-selection rule.
2. Create track-specific mock assembly: Maths & Science track includes CDP, chosen Language-I, English Language-II, Mathematics, Physical Science, and Biological Science; Telugu track includes CDP, Telugu Language-I, English Language-II, and Telugu specialization.
3. Generate fixed test JSONs conforming to the exam engine's expected schema and ensure IDs remain unique within each test.
4. Replace placeholder test metadata in `js/practice.js` with registry metadata; update `DATA_FILES` in `js/exam-engine.js`.
5. Update service-worker precache paths or use a versioned runtime cache strategy for the assembled tests.
6. Test fresh attempt, resume, pause, question locking, section completion, final report, refresh persistence, and offline loading.

## Content caveat
This is a file-placement/integration-preparation milestone, not a content accuracy certification. Existing batch content is preserved as supplied; no full subject-matter, answer-key, duplicate, or syllabus audit was performed here.
