# Hong Kong Industrial Building Adaptive Reuse Decision Dashboard

A standalone decision-support dashboard prototype for assessing vacant or under-used industrial buildings in Hong Kong for adaptive reuse into residential use.

The scoring model now follows the refined 11-factor framework from the literature review and refinement principles: housing demand, planning and zoning, land lease and premium, ownership and governance, regulation and fire safety, building adaptability, location and transport, district capacity, neighbourhood compatibility, economic feasibility, and policy implementation certainty.

## How to run

Open `index.html` directly in a browser, or serve this folder with any static server.

## Supabase survey storage

The survey and stakeholder suggested-factor forms can store responses in Supabase.

1. Create a Supabase project.
2. Open the Supabase SQL editor and run `supabase-schema.sql`.
3. In `supabase-config.js`, replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_ANON_KEY` with the project's API settings.
4. Serve or deploy the dashboard. The app will load `survey_submissions` and `stakeholder_suggested_factors` on startup, and new survey submissions will update the Survey Result Summary and Final Weights analysis.

The included Row Level Security policies allow anonymous public inserts and reads for this research dashboard. Tighten the `select` policies if results should only be visible to authenticated users or administrators.

## Features

- GIS-style map using sample coordinates
- Building and district suitability ranking
- Filters for district, zoning, ownership, risk, compatibility, score, age and MTR distance, with reset and active-filter summary
- Weighted scoring model across the refined 11-factor Hong Kong adaptive reuse framework
- Scenario presets for housing, policy feasibility, market logic and community impact
- Sortable building comparison table and CSV export
- Sample CSV in `data/sample_buildings.csv`

## Scoring

Overall suitability is a weighted sum of the 11 refined factors. The current dummy dataset derives these factor scores from available building, zoning, ownership, accessibility, housing-potential, environmental-risk and feasibility fields. Scores are normalised to 0-100.

Categories:

- High: 70-100
- Medium: 40-69
- Low: 0-39
