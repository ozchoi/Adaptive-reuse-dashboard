const buildings = [
  ['IB-001','Kwun Tong Harbour Industrial Centre','Hoi Yuen Road, Kwun Tong','Kwun Tong',22.3108,114.2247,1978,48,'Warehouse / light industrial','Other Specified Uses (Business)','Single owner',41,21800,430,'Medium','High',78,86,72,61,68,64,73,70,82,76,'Traffic loading; Fire services upgrade','Close to MTR; Large contiguous floor area'],
  ['IB-002','San Po Kong Textile Factory Block','Tai Yau Street, San Po Kong','Wong Tai Sin',22.3355,114.1975,1969,57,'Workshops / storage','Industrial','Multiple owners',34,12600,690,'Medium','Medium',55,77,58,46,43,51,56,62,68,71,'Fragmented title; Industrial zoning','Established community; Urban renewal adjacency'],
  ['IB-003','Fo Tan Logistics House','Au Pui Wan Street, Fo Tan','Sha Tin',22.3975,114.1949,1986,40,'Logistics','Industrial','Single owner',29,18400,760,'Low','Medium',72,72,68,65,50,67,70,76,70,63,'Planning rezoning risk; Goods vehicle interface','Single ownership; Lower contamination risk'],
  ['IB-004','Tsuen Wan West Workshop Tower','Texaco Road, Tsuen Wan','Tsuen Wan',22.3681,114.1135,1975,51,'Workshops / offices','Other Specified Uses (Business)','Multiple owners',37,15300,520,'High','Medium',57,80,62,48,60,44,58,47,66,69,'Noise exposure; Fragmented ownership','Transit access; Business zoning flexibility'],
  ['IB-005','Chai Wan Industrial Loft','Lee Chung Street, Chai Wan','Eastern',22.2644,114.2371,1982,44,'Flatted factory','Industrial','Corporate owner',46,20500,610,'Medium','High',74,78,75,60,52,59,67,71,79,73,'Lease modification; Services replacement','High vacancy; Good residential interface'],
  ['IB-006','Kwai Chung Container Fringe Building','Kwai Fuk Road, Kwai Chung','Kwai Tsing',22.3632,114.1326,1992,34,'Cold storage / logistics','Industrial','Single owner',18,9800,910,'High','Low',48,49,54,52,38,35,46,33,41,38,'Port-related hazards; Low residential compatibility','Single owner; Modern structure'],
  ['IB-007','Cheung Sha Wan Garment Centre','Castle Peak Road, Cheung Sha Wan','Sham Shui Po',22.3378,114.1497,1973,53,'Garment workshops','Other Specified Uses (Business)','Multiple owners',44,17600,360,'Medium','High',63,90,64,50,66,57,74,68,84,86,'Old services; Title assembly','Very strong accessibility; High housing need'],
  ['IB-008','Tuen Mun Riverside Factory','San On Street, Tuen Mun','Tuen Mun',22.3944,113.9734,1988,38,'Storage / workshops','Industrial','Corporate owner',27,11200,1050,'Low','Medium',66,55,69,58,45,62,52,73,59,57,'Lower rail accessibility; Rezoning uncertainty','Lower environmental risk; Potential public realm gain'],
  ['IB-009','Yuen Long Light Industrial Court','Wang Yip Street East, Yuen Long','Yuen Long',22.4445,114.0322,1995,31,'Light industrial','Industrial','Multiple owners',22,8700,1180,'Medium','Medium',50,52,61,57,40,52,48,56,55,52,'Transport distance; Ownership fragmentation','Newer structure; District housing growth'],
  ['IB-010','Ap Lei Chau Marine Works Building','Lee Nam Road, Ap Lei Chau','Southern',22.2413,114.1549,1980,46,'Marine workshops','Industrial','Single owner',33,10100,840,'High','Low',52,63,57,49,42,39,51,36,49,55,'Marine industrial adjacency; Contamination risk','Waterfront regeneration; Single ownership'],
  ['IB-011','Mong Kok East Services Block','Larch Street, Mong Kok','Yau Tsim Mong',22.3216,114.1688,1966,60,'Storage / small workshops','Residential (Group E)','Multiple owners',39,6400,290,'Medium','High',51,93,49,39,74,45,63,64,76,88,'Very old building fabric; Small floor plates','Residential zoning; Exceptional accessibility'],
  ['IB-012','Aberdeen Creative Industrial Warehouse','Wong Chuk Hang Road, Wong Chuk Hang','Southern',22.2485,114.1684,1984,42,'Industrial-office / storage','Other Specified Uses (Business)','Corporate owner',31,13200,410,'Low','High',76,84,78,67,70,70,72,79,81,78,'Premium conversion cost; Lease review needed','Strong MTR access; Compatible mixed-use setting']
].map(row => {
  const b = { id: row[0], name: row[1], address: row[2], district: row[3], lat: row[4], lng: row[5], year: row[6], age: row[7], use: row[8], zoning: row[9], ownership: row[10], vacancy: row[11], floorArea: row[12], mtr: row[13], risk: row[14], compatibility: row[15], feasibility: row[16], location: row[17], design: row[18], services: row[19], regulatory: row[20], safety: row[21], economic: row[22], environmental: row[23], housing: row[24], social: row[25], constraints: row[26], opportunities: row[27] };
  return {
    ...b,
    storeys: Math.max(10, Math.round(b.floorArea / 520)),
    height: Math.max(40, Math.round(Math.max(10, b.floorArea / 520) * 3.8)),
    housingDemand: b.housing,
    planningZoning: zoningScore(b),
    landLease: landLeaseScore(b),
    ownershipGovernance: ownershipScore(b),
    regulationSafety: weightedAverage([[b.safety, 0.45], [b.regulatory, 0.3], [b.services, 0.25]]),
    buildingAdaptability: weightedAverage([[b.design, 0.4], [b.services, 0.3], [b.feasibility, 0.3]]),
    locationTransport: b.location,
    districtCapacity: weightedAverage([[b.social, 0.45], [b.location, 0.25], [b.housing, 0.2], [compatibilityScore(b.compatibility), 0.1]]),
    neighbourhoodCompatibility: weightedAverage([[compatibilityScore(b.compatibility), 0.35], [riskScore(b.risk), 0.25], [b.environmental, 0.25], [b.safety, 0.15]]),
    economicFinancial: b.economic,
    policyCertainty: weightedAverage([[b.regulatory, 0.4], [b.economic, 0.25], [zoningScore(b), 0.25], [ownershipScore(b), 0.1]])
  };
});

const dimensions = [
  ['housingDemand','Housing Demand','Housing pressure, affordability, rental demand, small-unit demand and market absorption.'],
  ['planningZoning','Planning and Zoning','OZP zoning, planning permission, change of use and residential acceptability in principle.'],
  ['landLease','Land Lease and Premium','Lease conditions, waiver need, land premium, lease modification and property-right constraints.'],
  ['ownershipGovernance','Ownership and Governance','Single or multiple ownership, owner consensus, management body and implementation capacity.'],
  ['regulationSafety','Regulation and Fire Safety','Building Ordinance, fire safety, means of escape, hygiene and accessibility requirements.'],
  ['buildingAdaptability','Building Adaptability','Structure, layout, daylight, ventilation, vertical core, MEP services and retrofit difficulty.'],
  ['locationTransport','Location and Transport','MTR/bus access, walkability, daily services and residential accessibility.'],
  ['districtCapacity','District Capacity','Schools, clinics, open space, public transport capacity and community-service support.'],
  ['neighbourhoodCompatibility','Neighbourhood Fit','Noise, pollution, safety, remaining industrial operations, community acceptance and equity risk.'],
  ['economicFinancial','Economic Feasibility','Conversion cost, financing, return, payback period and approval uncertainty.'],
  ['policyCertainty','Policy and Implementation','Fee waivers, pilot schemes, one-stop approval, administrative certainty and first-mover risk.']
];
const scenarios = {
  balanced: { label: 'Refined 11-factor baseline', summary: 'Uses the priority levels from the refinement document as the default weighting.', weights: [9,10,10,10,10,9,8,8,8,10,8] },
  housing: { label: 'Housing-priority scenario', summary: 'Prioritises housing demand, district capacity, accessibility and neighbourhood fit.', weights: [20,7,6,7,8,8,14,12,10,5,3] },
  policy: { label: 'Policy-feasibility scenario', summary: 'Prioritises zoning, lease, ownership, regulation and implementation certainty.', weights: [5,16,16,14,14,7,5,4,5,5,9] },
  market: { label: 'Market-driven scenario', summary: 'Prioritises owner investment logic, market absorption, governance and programme risk.', weights: [16,7,9,12,8,8,7,4,5,18,6] },
  community: { label: 'Community-impact scenario', summary: 'Prioritises district capacity, neighbourhood compatibility, transport and housing benefit.', weights: [14,6,4,5,9,6,13,16,16,5,6] }
};
const researchDimensions = [
  ['feasibility','Feasibility','Physical and procedural ease of conversion.'],
  ['location','Location','Accessibility, services and neighbourhood support.'],
  ['design','Design Adaptability','Floor plate, structure, daylight and layout flexibility.'],
  ['services','Building Services','MEP capacity, vertical circulation and retrofit complexity.'],
  ['regulatory','Regulatory Constraints','Planning, land lease and statutory approval barriers.'],
  ['safety','Health and Safety','Fire safety, means of escape, hygiene and occupant protection.'],
  ['economic','Economic Viability','Conversion cost, return, financing and market absorption.'],
  ['environmental','Environmental Performance','Contamination, carbon, noise and retrofit sustainability.']
];
const criticalFactors = [
  ['feasibility','Conversion readiness','How readily the building can be converted without excessive structural or procedural barriers.','Langston et al.; Bullen & Love','Composite feasibility audit score','Score 0-100 from structural condition, vacancy, ownership and approval complexity',true],
  ['feasibility','Ownership and implementation capacity','Ability of owners or managers to coordinate decision-making and implementation.','Shipley et al.; Conejos et al.','Ownership type and management capacity','Higher score for single/corporate ownership and clear management structure',true],
  ['feasibility','Vacancy and decanting potential','Extent to which existing vacancy allows retrofit work without major displacement.','Remoy & van der Voordt','Current vacancy percentage','Normalize vacancy percentage to 0-100',true],
  ['location','Transit accessibility','Walking access to rail, bus and district mobility networks.','Yung & Chan; Wilkinson et al.','Distance to MTR and public transport nodes','Higher score for shorter walking distance',true],
  ['location','Community facility catchment','Presence of daily services, healthcare, markets and retail within walking distance.','Hong Kong Planning Standards and Guidelines','Facilities within 500 m catchment','Count and weight nearby facilities by type',true],
  ['location','Residential neighbourhood compatibility','Fit between proposed residential use and surrounding land-use conditions.','Heath; Yung & Chan','Compatibility rating and surrounding sensitive uses','Score by compatibility level and environmental risk',true],
  ['design','Floor-plate adaptability','Suitability of floor depth, column grid and layout for residential subdivision.','Geraedts & van der Voordt; Conejos et al.','Floor area, depth and subdivision potential','Expert score from floor-plate audit',true],
  ['design','Natural light and ventilation potential','Ability to meet residential daylight and ventilation expectations.','Douglas; Remoy & van der Voordt','Facade exposure and light-well condition','Expert score based on facade and core arrangement',true],
  ['design','Structural robustness','Capacity of existing structure to support residential conversion and code upgrades.','Langston et al.; Wilkinson et al.','Structural age and condition proxy','Score from age, condition and structural system',true],
  ['services','MEP retrofit difficulty','Complexity of upgrading power, plumbing, drainage, lifts and vertical services.','Bullen & Love; Douglas','Services condition and riser capacity','Expert score for replacement need and routing difficulty',true],
  ['services','Vertical circulation adequacy','Adequacy of lifts, stairs, cores and accessible routes for residential occupation.','Hong Kong Buildings Department guidance','Core count and accessibility audit','Score from lift/core and barrier-free access review',true],
  ['services','Building height and services constraint','Influence of height, storeys and plant capacity on retrofit feasibility.','Douglas; Langston et al.','Building height and storeys','Penalty for height/storey combinations that raise retrofit complexity',false],
  ['regulatory','Planning and zoning acceptability','Whether existing zoning can support residential or mixed residential conversion.','Town Planning Board OZP; Yung & Chan','OZP zoning group and planning permission route','Higher score for residential or business zones with clearer pathway',true],
  ['regulatory','Land lease and premium uncertainty','Risk created by lease modification, waiver and premium requirements.','Lands Department practice; HK adaptive reuse studies','Lease modification need and premium risk','Expert risk score from lease and premium pathway',true],
  ['regulatory','Approval coordination risk','Complexity of coordinating planning, building, fire and lands approvals.','Conejos et al.; Wilkinson et al.','Number of approval authorities and uncertainty','Score lower where multi-agency uncertainty is high',true],
  ['safety','Fire safety upgrade burden','Extent of required fire services, compartmentation and means-of-escape upgrades.','Buildings Ordinance; Fire Services Department requirements','Fire safety audit rating','Expert score from upgrade burden',true],
  ['safety','Industrial hazard adjacency','Exposure to remaining industrial, storage or logistics hazards nearby.','Planning and environmental health literature','Environmental risk and adjacent uses','Risk-adjusted score from surrounding uses',true],
  ['safety','Residential health protection','Ability to meet hygiene, acoustic and occupant health expectations.','Hong Kong Planning Standards and Guidelines','Noise, air quality and hygiene constraints','Score from environmental and health risk indicators',true],
  ['economic','Conversion cost viability','Likelihood that conversion cost remains proportionate to residential value.','Bullen & Love; Wilkinson et al.','Retrofit cost and GFA proxy','Score from feasibility, building size and expected upgrade burden',true],
  ['economic','Market absorption potential','Strength of housing demand and residential market support in the district.','Remoy & van der Voordt; HK housing studies','Housing demand and accessibility','Score from housing demand and location indicators',true],
  ['economic','Policy and incentive leverage','Potential benefit from policy support, fee waiver or pilot implementation.','Hong Kong adaptive reuse policy studies','Policy certainty and incentive eligibility','Score from policy certainty and zoning pathway',false],
  ['environmental','Embodied carbon retention','Potential sustainability benefit from retaining the existing structure.','Bullen & Love; Langston et al.','Existing GFA and structural retention potential','Higher score for larger reusable structure with feasible retention',true],
  ['environmental','Contamination and remediation risk','Likelihood of soil, material or operational contamination affecting conversion.','Environmental adaptive reuse studies','Environmental risk rating','Invert environmental risk to score',true],
  ['environmental','Operational performance upgrade','Ability to improve energy, ventilation and environmental performance through retrofit.','Douglas; sustainability retrofit literature','Services and environmental performance score','Composite score from services and environmental indicators',true]
].map((row, index) => ({
  id: 'CF-' + String(index + 1).padStart(2, '0'),
  dimension: row[0],
  factor_name: row[1],
  description: row[2],
  literature_source: row[3],
  data_indicator: row[4],
  scoring_method: row[5],
  include_in_survey: row[6]
}));
const surveyResponses = {
  feasibility: { academics: [4,5,4,4], government: [4,4,5], industry: [5,4,4,5], community: [4,4,3] },
  location: { academics: [5,5,4,5], government: [5,4,5], industry: [4,5,4,4], community: [5,5,5] },
  design: { academics: [4,4,5,4], government: [3,4,4], industry: [5,5,4,4], community: [4,3,4] },
  services: { academics: [4,3,4,4], government: [4,4,3], industry: [5,4,5,4], community: [3,4,3] },
  regulatory: { academics: [5,4,5,4], government: [5,5,5], industry: [4,5,5,4], community: [4,4,4] },
  safety: { academics: [5,5,4,5], government: [5,5,5], industry: [5,4,5,5], community: [5,5,5] },
  economic: { academics: [4,4,4,3], government: [4,3,4], industry: [5,5,5,4], community: [3,4,3] },
  environmental: { academics: [4,5,4,4], government: [4,4,4], industry: [3,4,3,4], community: [5,4,5] }
};
const stakeholderWeightGroups = [
  { key: 'academics', label: 'Academic / researcher' },
  { key: 'government', label: 'Government / statutory body' },
  { key: 'industry', label: 'Industrial Unit Owner' },
  { key: 'community', label: 'Community / NGO' }
];
const stakeholderGroups = [...stakeholderWeightGroups.map(group => group.label), 'Professional consultant'];
const ozpResidentialGroups = [
  { code: 'R(A)', label: 'Residential (Group A)', color: 'rgb(150,18,8)' },
  { code: 'R(B)', label: 'Residential (Group B)', color: 'rgb(189,105,15)' },
  { code: 'R(C)', label: 'Residential (Group C)', color: 'rgb(230,181,25)' },
  { code: 'R(D)', label: 'Residential (Group D)', color: 'rgb(255,219,13)' },
  { code: 'R(E)', label: 'Residential (Group E)', color: 'rgb(168,18,36)' }
];
const ozpServiceUrl = 'https://www.ozp.tpb.gov.hk/arcgis2/rest/services/SPP3/OZP_PLAN/MapServer/export';
const ozpLayerDefs = { 1015: "ZONE_LABEL_GRP IN ('R(A)','R(B)','R(C)','R(D)','R(E)')" };
const communityFacilities = [
  { name: 'United Christian Hospital', type: 'Hospital', lat: 22.3177, lng: 114.2277 },
  { name: 'Kwun Tong Promenade Shopping Cluster', type: 'Shopping mall', lat: 22.3132, lng: 114.2231 },
  { name: 'Shui Wo Street Market', type: 'Wet market', lat: 22.3163, lng: 114.2250 },
  { name: 'Mikiki', type: 'Shopping mall', lat: 22.3339, lng: 114.1968 },
  { name: 'San Po Kong Market', type: 'Wet market', lat: 22.3359, lng: 114.1971 },
  { name: 'Prince of Wales Hospital', type: 'Hospital', lat: 22.3796, lng: 114.2017 },
  { name: 'Fo Tan Cooked Food Market', type: 'Wet market', lat: 22.3950, lng: 114.1942 },
  { name: 'Nina Mall', type: 'Shopping mall', lat: 22.3695, lng: 114.1148 },
  { name: 'Tsuen Wan Market', type: 'Wet market', lat: 22.3717, lng: 114.1161 },
  { name: 'Pamela Youde Nethersole Eastern Hospital', type: 'Hospital', lat: 22.2691, lng: 114.2362 },
  { name: 'New Jade Shopping Arcade', type: 'Shopping mall', lat: 22.2649, lng: 114.2368 },
  { name: 'Chai Wan Market', type: 'Wet market', lat: 22.2656, lng: 114.2376 },
  { name: 'Princess Margaret Hospital', type: 'Hospital', lat: 22.3403, lng: 114.1343 },
  { name: 'D2 Place', type: 'Shopping mall', lat: 22.3360, lng: 114.1488 },
  { name: 'Cheung Sha Wan Market', type: 'Wet market', lat: 22.3375, lng: 114.1511 },
  { name: 'Tuen Mun Hospital', type: 'Hospital', lat: 22.4071, lng: 113.9767 },
  { name: 'V City', type: 'Shopping mall', lat: 22.3951, lng: 113.9742 },
  { name: 'Tuen Mun San Hui Market', type: 'Wet market', lat: 22.3976, lng: 113.9748 },
  { name: 'YOHO Mall', type: 'Shopping mall', lat: 22.4444, lng: 114.0363 },
  { name: 'Yuen Long Market', type: 'Wet market', lat: 22.4453, lng: 114.0288 },
  { name: 'Queen Mary Hospital', type: 'Hospital', lat: 22.2705, lng: 114.1319 },
  { name: 'Marina Square', type: 'Shopping mall', lat: 22.2420, lng: 114.1547 },
  { name: 'Aberdeen Market', type: 'Wet market', lat: 22.2483, lng: 114.1559 },
  { name: 'Mong Kok Market', type: 'Wet market', lat: 22.3199, lng: 114.1692 },
  { name: 'MOKO', type: 'Shopping mall', lat: 22.3227, lng: 114.1727 },
  { name: 'The Southside', type: 'Shopping mall', lat: 22.2481, lng: 114.1685 },
  { name: 'Wong Chuk Hang Market', type: 'Wet market', lat: 22.2494, lng: 114.1687 }
];
const mtrStations = [
  { name: 'Kwun Tong Station', lat: 22.3124, lng: 114.2261 },
  { name: 'Diamond Hill Station', lat: 22.3401, lng: 114.2013 },
  { name: 'Fo Tan Station', lat: 22.3956, lng: 114.1989 },
  { name: 'Tsuen Wan West Station', lat: 22.3686, lng: 114.1096 },
  { name: 'Chai Wan Station', lat: 22.2646, lng: 114.2371 },
  { name: 'Kwai Hing Station', lat: 22.3632, lng: 114.1311 },
  { name: 'Lai Chi Kok Station', lat: 22.3372, lng: 114.1480 },
  { name: 'Tuen Mun Station', lat: 22.3952, lng: 113.9731 },
  { name: 'Yuen Long Station', lat: 22.4461, lng: 114.0346 },
  { name: 'Lei Tung Station', lat: 22.2427, lng: 114.1565 },
  { name: 'Mong Kok East Station', lat: 22.3222, lng: 114.1720 },
  { name: 'Wong Chuk Hang Station', lat: 22.2481, lng: 114.1680 }
];
const defaultFilters = { search: '', district: 'All', zoning: 'All', ownership: 'All', risk: 'All', compatibility: 'All', minScore: 0, minVacancy: 0, maxAge: 80, maxHeight: 220, maxStoreys: 60, maxMtr: 1200 };
let state = { scenario: 'balanced', modelMode: 'baseline', weights: scenarios.balanced.weights.slice(), researchWeights: researchDimensions.map(() => 1), selected: buildings[0].id, compare: [buildings[6].id, buildings[11].id], sort: { key: 'score', dir: 'desc' }, filters: {...defaultFilters}, stakeholderFactors: [
  { factor_name: 'Workshop validation confidence', suggested_by: 'Pilot workshop', stakeholder_group: 'Professional consultant', related_dimension: 'feasibility', comment: 'Record whether workshop participants agree with model output for each site.', include_in_final_model: true },
  { factor_name: 'Tenant displacement management', suggested_by: 'Community panel', stakeholder_group: 'Community / NGO', related_dimension: 'safety', comment: 'Flag social and health risks from relocating existing small businesses.', include_in_final_model: false }
], surveyRatings: {}, surveyTopFactors: ['', '', ''], surveySubmitted: false, participantGroup: '', industrialOwnershipType: '', stakeholderGroupWeights: { academics: 25, government: 25, industry: 25, community: 25 } };
let suitabilityMap = null;
let suitabilityLayer = null;
let zoneMap = null;
let zoneLayer = null;
let zoneOzpOverlay = null;
const categoryColor = { High: '#0f766e', Medium: '#d97706', Low: '#dc2626' };
const facilityColor = { Hospital: '#dc2626', 'Shopping mall': '#7c3aed', 'Wet market': '#d97706', MTR: '#2563eb' };
const radarPalette = ['#0f766e', '#2563eb', '#d97706'];
const fmt = new Intl.NumberFormat('en-HK');
function h(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function csvEscape(value) { return '"'+String(value).replaceAll('"','""')+'"'; }
function downloadCsv(filename, headers, rows) {
  const lines = [headers].concat(rows).map(row => row.map(csvEscape).join(','));
  const blob = new Blob([lines.join('\n')], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function activeDimensions() { return state.modelMode === 'survey' ? researchDimensions : dimensions; }
function dimensionLabel(key) { return (researchDimensions.find(([id]) => id === key) || dimensions.find(([id]) => id === key) || [key, key])[1]; }
function surveyQuestion(factor) {
  return 'How important is "' + factor.factor_name + '" when assessing whether an industrial building should be adaptively reused for residential use?';
}
function surveyRating(factorId) { return state.surveyRatings[factorId] ?? 50; }
function selectedTopFactorIds() { return state.surveyTopFactors.filter(Boolean); }
function stakeholderGroupLabel(key) { return (stakeholderWeightGroups.find(group => group.key === key) || { label: key }).label; }
function flattenResponses(groups) { return Object.values(groups).flat(); }
function mean(values) { return values.reduce((sum, value) => sum + value, 0) / (values.length || 1); }
function median(values) {
  const sorted = values.slice().sort((a,b)=>a-b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
function stdDev(values) {
  const avg = mean(values);
  return Math.sqrt(mean(values.map(value => (value - avg) ** 2)));
}
function weightStats() {
  const rows = researchDimensions.map(([key,label]) => {
    const groups = surveyResponses[key];
    const values = flattenResponses(groups);
    const groupMeans = Object.fromEntries(Object.entries(groups).map(([group, scores]) => [group, mean(scores)]));
    const weightedMean = stakeholderWeightGroups.reduce((sum, group) => sum + (groupMeans[group.key] || 0) * state.stakeholderGroupWeights[group.key] / 100, 0);
    return { key, label, mean: weightedMean, median: median(values), std: stdDev(values), groupMeans };
  });
  const total = rows.reduce((sum, row) => sum + row.mean, 0) || 1;
  return rows.map(row => ({...row, finalWeight: row.mean / total * 100}));
}
function finalResearchWeights() { return weightStats().map(row => Math.max(1, Math.round(row.finalWeight))); }
function selectedSurveyFactors() { return criticalFactors.filter(factor => factor.include_in_survey); }
function mergedFactors() {
  const literature = selectedSurveyFactors().map(factor => ({ type: 'Literature', name: factor.factor_name, dimension: factor.dimension, source: factor.literature_source, include: true }));
  const stakeholder = state.stakeholderFactors.map(factor => ({ type: 'Stakeholder', name: factor.factor_name, dimension: factor.related_dimension, source: factor.stakeholder_group + ' - ' + factor.suggested_by, include: factor.include_in_final_model }));
  return literature.concat(stakeholder);
}
function distanceMeters(a, b) {
  const toRad = value => value * Math.PI / 180;
  const earth = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const value = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return Math.round(earth * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value)));
}
function nearby(items, selected, radius = 500) {
  return items.map(item => ({...item, distance: distanceMeters(selected, item)})).filter(item => item.distance <= radius).sort((a,b)=>a.distance-b.distance);
}
function catchmentFor(building) {
  const facilities = nearby(communityFacilities, building, 500);
  const stations = nearby(mtrStations, building, 500).map(station => ({...station, type: 'MTR'}));
  return [...facilities, ...stations].sort((a,b)=>a.distance-b.distance);
}
function catchmentSummary(items) {
  return [
    ['Hospitals', items.filter(item => item.type === 'Hospital').length],
    ['Shopping malls', items.filter(item => item.type === 'Shopping mall').length],
    ['Wet markets', items.filter(item => item.type === 'Wet market').length],
    ['MTR stations', items.filter(item => item.type === 'MTR').length]
  ];
}
function clamp(value) { return Math.max(0, Math.min(100, Math.round(value))); }
function weightedAverage(items) { return clamp(items.reduce((sum, [value, weight]) => sum + value * weight, 0)); }
function compatibilityScore(level) { return ({ High: 86, Medium: 62, Low: 34 })[level] || 50; }
function riskScore(level) { return ({ Low: 84, Medium: 58, High: 28 })[level] || 50; }
function ownershipScore(building) {
  const ownershipBase = { 'Single owner': 88, 'Corporate owner': 74, 'Multiple owners': 43 }[building.ownership] || 55;
  return weightedAverage([[ownershipBase, 0.55], [building.feasibility, 0.25], [Math.min(100, building.vacancy + 45), 0.2]]);
}
function zoningScore(building) {
  const zoningBase = building.zoning.includes('Residential') ? 92 : building.zoning.includes('Other Specified Uses') ? 70 : 42;
  return weightedAverage([[zoningBase, 0.55], [building.regulatory, 0.35], [building.location, 0.1]]);
}
function landLeaseScore(building) {
  const leaseBase = building.zoning.includes('Residential') ? 86 : building.zoning.includes('Other Specified Uses') ? 64 : 46;
  return weightedAverage([[leaseBase, 0.4], [building.regulatory, 0.25], [building.economic, 0.2], [ownershipScore(building), 0.15]]);
}
function normalisedWeights(weights) { const total = weights.reduce((a,b)=>a+b,0) || 1; return weights.map(w => w / total * 100); }
function score(building, weights = state.weights, modelMode = state.modelMode) {
  const modelDimensions = modelMode === 'survey' ? researchDimensions : dimensions;
  const nw = normalisedWeights(weights);
  return Math.round(modelDimensions.reduce((sum, [key], i) => sum + building[key] * nw[i] / 100, 0));
}
function category(s) { return s >= 70 ? 'High' : s >= 40 ? 'Medium' : 'Low'; }
function scored(weights = state.weights, modelMode = state.modelMode) { return buildings.map(b => ({...b, score: score(b, weights, modelMode), category: category(score(b, weights, modelMode))})).sort((a,b)=>b.score-a.score); }
function filtered() { const q = state.filters.search.toLowerCase(); return scored().filter(b => (!q || [b.id,b.name,b.address,b.district].join(' ').toLowerCase().includes(q)) && (state.filters.district === 'All' || b.district === state.filters.district) && (state.filters.zoning === 'All' || b.zoning === state.filters.zoning) && (state.filters.ownership === 'All' || b.ownership === state.filters.ownership) && (state.filters.risk === 'All' || b.risk === state.filters.risk) && (state.filters.compatibility === 'All' || b.compatibility === state.filters.compatibility) && b.score >= state.filters.minScore && b.vacancy >= state.filters.minVacancy && b.age <= state.filters.maxAge && b.height <= state.filters.maxHeight && b.storeys <= state.filters.maxStoreys && b.mtr <= state.filters.maxMtr); }
function sortedRows(rows) { const {key, dir} = state.sort; const sign = dir === 'asc' ? 1 : -1; return rows.slice().sort((a,b) => { const av = a[key]; const bv = b[key]; if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sign; return String(av).localeCompare(String(bv)) * sign; }); }
function options(id, values) { const el = document.getElementById(id); el.innerHTML = ['All', ...new Set(values)].sort((a,b)=> a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)).map(v => '<option>'+h(v)+'</option>').join(''); }
function bar(parent, label, value, max = 100, color = '#0f766e') { parent.insertAdjacentHTML('beforeend', '<div class="bar-row"><span>'+h(label)+'</span><div class="bar-track"><div class="bar-fill" style="width:'+Math.max(2,value/max*100)+'%;background:'+color+'"></div></div><strong>'+h(value)+'</strong></div>'); }
function empty(parent, message) { parent.innerHTML = '<div class="empty-state">'+h(message)+'</div>'; }
function radarPoint(index, total, radius, value = 100) {
  const angle = -Math.PI / 2 + index * Math.PI * 2 / total;
  const scaled = radius * value / 100;
  return [Math.round(Math.cos(angle) * scaled), Math.round(Math.sin(angle) * scaled)];
}
function radarTextAnchor(x) { return x < -12 ? 'end' : x > 12 ? 'start' : 'middle'; }
function renderRadar(selected) {
  const modelDimensions = activeDimensions();
  const shortLabels = state.modelMode === 'survey'
    ? ['Feasibility','Location','Design','Services','Regulatory','Safety','Economic','Environmental']
    : ['Housing','Planning','Lease','Governance','Safety','Adaptability','Transport','Capacity','Neighbourhood','Economic','Policy'];
  const radius = 145;
  const all = scored();
  const compareBuildings = state.compare.map(id => all.find(b => b.id === id)).filter(Boolean).filter(b => b.id !== selected.id);
  const series = [selected, ...compareBuildings].slice(0, 3);
  const rings = [20,40,60,80,100].map(level => '<polygon class="radar-ring" points="'+modelDimensions.map((_, i) => radarPoint(i, modelDimensions.length, radius, level).join(',')).join(' ')+'" />').join('');
  const axes = modelDimensions.map((_, i) => {
    const [x,y] = radarPoint(i, modelDimensions.length, radius, 100);
    return '<line class="radar-axis" x1="0" y1="0" x2="'+x+'" y2="'+y+'" />';
  }).join('');
  const labels = modelDimensions.map((_, i) => {
    const [x,y] = radarPoint(i, modelDimensions.length, radius + 28, 100);
    return '<text class="radar-label" x="'+x+'" y="'+y+'" text-anchor="'+radarTextAnchor(x)+'">'+h(shortLabels[i])+'</text>';
  }).join('');
  const shapes = series.map((building, seriesIndex) => {
    const color = radarPalette[seriesIndex];
    const points = modelDimensions.map(([key], i) => radarPoint(i, modelDimensions.length, radius, building[key]).join(',')).join(' ');
    const dots = modelDimensions.map(([key], i) => {
      const [x,y] = radarPoint(i, modelDimensions.length, radius, building[key]);
      return '<circle class="radar-dot" cx="'+x+'" cy="'+y+'" r="3.6" style="fill:'+color+'"><title>'+h(building.name)+' - '+h(modelDimensions[i][1])+': '+h(building[key])+'</title></circle>';
    }).join('');
    return '<polygon class="radar-area radar-series-'+seriesIndex+'" style="--series-color:'+color+'" points="'+points+'" />' + dots;
  }).join('');
  const legend = series.map((building, i) => '<span><i style="background:'+radarPalette[i]+'"></i>'+h(building.id)+' '+h(building.name)+' <strong>'+h(building.score)+'</strong></span>').join('');
  document.getElementById('radarChart').innerHTML =
    '<div class="radar-summary"><span>Selected building</span><strong>'+h(selected.score)+'</strong><em>'+h(selected.name)+' - '+h(selected.category)+' suitability</em></div>' +
    '<div class="radar-legend">'+legend+'</div>' +
    '<svg class="radar-svg" viewBox="-220 -205 440 430" role="img" aria-label="Radar chart for '+h(selected.name)+' residential conversion suitability">' +
    rings + axes + shapes + labels +
    '</svg>' +
    '<div class="radar-note">Each polygon is one building. Wider shape means stronger suitability; gaps between polygons show which index factors drive the difference.</div>';
}
function render() {
  const rows = filtered();
  const all = scored();
  const selected = all.find(b => b.id === state.selected) || all[0];
  renderFilterSummary(rows.length, all.length);
  document.getElementById('kpis').innerHTML = [
    ['Buildings', all.length],
    ['Visible now', rows.length],
    ['Average age', Math.round(buildings.reduce((s,b)=>s+b.age,0)/buildings.length)+' yrs'],
    ['GFA Gross Floor Area', fmt.format(buildings.reduce((s,b)=>s+b.floorArea,0))+' sqm'],
    ['High potential', all.filter(b=>b.category==='High').length]
  ].map(([label,value]) => '<div class="kpi"><span>'+h(label)+'</span><strong>'+h(value)+'</strong></div>').join('');
  const cat = document.getElementById('categoryChart'); cat.innerHTML = '';
  ['High','Medium','Low'].forEach(c => bar(cat, c, all.filter(b=>b.category===c).length, all.length, categoryColor[c]));
  const district = document.getElementById('districtChart'); district.innerHTML = '';
  [...new Set(buildings.map(b=>b.district))].map(d => {
    const ds = all.filter(b=>b.district===d);
    return [d, Math.round(ds.reduce((s,b)=>s+b.score,0)/ds.length)];
  }).sort((a,b)=>b[1]-a[1]).forEach(([d,v]) => bar(district, d, v, 100, '#2563eb'));
  const top = document.getElementById('topChart'); top.innerHTML = '';
  if (rows.length) rows.slice(0,8).forEach(b => bar(top, b.id + ' ' + b.name, b.score, 100, categoryColor[b.category]));
  else empty(top, 'No buildings match the current filters.');
  renderMap(rows, selected);
  renderZoneMap(rows, selected);
  renderProfile(selected);
  renderTable(rows);
  renderWeights(selected);
  renderScenarios();
  renderResearchWorkflow();
}
function renderResearchWorkflow() {
  renderFactorsLibrary();
  renderSurveyCriteria();
  renderStakeholderFactors();
  renderFinalWeights();
}
function renderFactorsLibrary() {
  const byDimension = researchDimensions.map(([key,label]) => {
    const factors = criticalFactors.filter(factor => factor.dimension === key);
    return '<div><strong>'+h(factors.length)+'</strong><span>'+h(label)+'</span></div>';
  }).join('');
  document.getElementById('factorDimensionSummary').innerHTML = byDimension;
  document.getElementById('factorMeta').textContent = criticalFactors.length + ' literature-derived factors';
  document.getElementById('factorsTable').innerHTML =
    '<thead><tr><th>Include</th><th>Dimension</th><th>Factor</th><th>Description</th><th>Literature source</th><th>Data indicator</th><th>Scoring method</th></tr></thead><tbody>' +
    criticalFactors.map(factor => '<tr><td><input class="row-check" data-factor-include="'+h(factor.id)+'" type="checkbox" '+(factor.include_in_survey ? 'checked' : '')+' /></td><td>'+h(dimensionLabel(factor.dimension))+'</td><td><strong>'+h(factor.factor_name)+'</strong></td><td>'+h(factor.description)+'</td><td>'+h(factor.literature_source)+'</td><td>'+h(factor.data_indicator)+'</td><td>'+h(factor.scoring_method)+'</td></tr>').join('') +
    '</tbody>';
  document.querySelectorAll('[data-factor-include]').forEach(input => input.onchange = e => {
    const factor = criticalFactors.find(item => item.id === e.target.dataset.factorInclude);
    if (factor) factor.include_in_survey = e.target.checked;
    renderResearchWorkflow();
  });
}
function renderSurveyCriteria() {
  const selected = selectedSurveyFactors();
  const ownershipQuestion = state.participantGroup === 'Industrial Unit Owner'
    ? '<label>Ownership type of industrial unit<select id="industrialOwnershipType"><option value="">Select ownership type</option><option>Sole Ownership of Entire Building</option><option>Multi-ownership Buildings</option></select></label>'
    : '';
  document.getElementById('surveyCriteriaList').innerHTML =
    '<div class="criteria-card participant-card"><header><strong>Participant profile</strong><span>Required</span></header><label>Stakeholder group<select id="surveyParticipantGroup"><option value="">Select stakeholder group</option>'+stakeholderWeightGroups.map(group => '<option>'+h(group.label)+'</option>').join('')+'</select></label>'+ownershipQuestion+'</div>' +
    selected.map(factor =>
    '<div class="criteria-card survey-slider-card"><header><strong>'+h(factor.factor_name)+'</strong><span>'+h(dimensionLabel(factor.dimension))+'</span></header><p>'+h(surveyQuestion(factor))+'</p><label class="slider-question"><span>Importance score <strong id="surveyValue-'+h(factor.id)+'">'+h(surveyRating(factor.id))+'</strong></span><input data-survey-rating="'+h(factor.id)+'" type="range" min="0" max="100" value="'+h(surveyRating(factor.id))+'" /></label><div class="slider-scale"><span>Not important</span><span>Moderately important</span><span>Very important</span></div></div>'
  ).join('');
  const participantGroup = document.getElementById('surveyParticipantGroup');
  participantGroup.value = state.participantGroup;
  participantGroup.onchange = e => {
    state.participantGroup = e.target.value;
    if (state.participantGroup !== 'Industrial Unit Owner') state.industrialOwnershipType = '';
    state.surveySubmitted = false;
    renderSurveyCriteria();
  };
  const industrialOwnershipType = document.getElementById('industrialOwnershipType');
  if (industrialOwnershipType) {
    industrialOwnershipType.value = state.industrialOwnershipType;
    industrialOwnershipType.onchange = e => {
      state.industrialOwnershipType = e.target.value;
      state.surveySubmitted = false;
      updateSurveySummary();
    };
  }
  document.querySelectorAll('[data-survey-rating]').forEach(input => input.oninput = e => {
    const id = e.target.dataset.surveyRating;
    state.surveyRatings[id] = Number(e.target.value);
    state.surveySubmitted = false;
    const value = document.getElementById('surveyValue-' + id);
    if (value) value.textContent = e.target.value;
    updateSurveySummary();
  });
  const optionsHtml = '<option value="">Select a factor</option>' + selected.map(factor => '<option value="'+h(factor.id)+'">'+h(factor.factor_name)+'</option>').join('');
  const ranked = state.surveyTopFactors.map((factorId, index) =>
    '<label>Rank '+(index + 1)+'<select data-top-factor="'+index+'">'+optionsHtml+'</select></label>'
  ).join('');
  document.getElementById('surveyPreview').innerHTML =
    '<div class="survey-banner"><strong>'+h(selected.length)+'</strong><span>criteria selected for survey</span></div>' +
    '<div class="ranked-selects">'+ranked+'</div>' +
    '<button id="submitSurvey" class="primary-button" type="button">Submit survey</button>' +
    '<div id="surveySubmitStatus" class="survey-submit-status" aria-live="polite"></div>';
  document.querySelectorAll('[data-top-factor]').forEach(select => {
    select.value = state.surveyTopFactors[Number(select.dataset.topFactor)] || '';
    select.onchange = e => {
      state.surveyTopFactors[Number(e.target.dataset.topFactor)] = e.target.value;
      state.surveySubmitted = false;
      updateSurveySummary();
    };
  });
  document.getElementById('submitSurvey').onclick = submitSurvey;
  updateSurveySummary();
}
function updateSurveySummary() {
  const status = document.getElementById('surveySubmitStatus');
  if (!status) return;
  const selected = selectedSurveyFactors();
  const rated = selected.filter(factor => state.surveyRatings[factor.id] !== undefined).length;
  const topIds = selectedTopFactorIds();
  const duplicateCount = topIds.length - new Set(topIds).size;
  const missingParticipant = !state.participantGroup || (state.participantGroup === 'Industrial Unit Owner' && !state.industrialOwnershipType);
  const participantMessage = !state.participantGroup
    ? 'Stakeholder group is required.'
    : state.participantGroup === 'Industrial Unit Owner' && !state.industrialOwnershipType
      ? 'Industrial Unit Owner requires ownership type.'
      : '';
  const rankedNames = state.surveyTopFactors.map((id, index) => {
    const factor = selected.find(item => item.id === id);
    return factor ? '<li><strong>Rank '+(index + 1)+'</strong>'+h(factor.factor_name)+'</li>' : '';
  }).filter(Boolean).join('');
  const message = state.surveySubmitted
    ? '<strong>Survey submitted</strong><span>'+rated+' slider responses saved. Top 3 ranking recorded.</span><span>Stakeholder group: '+h(state.participantGroup)+(state.industrialOwnershipType ? ' - '+h(state.industrialOwnershipType) : '')+'</span>'
    : '<strong>Survey in progress</strong><span>'+rated+' of '+selected.length+' sliders adjusted. Complete participant profile and select three different top factors before submitting.</span>';
  status.className = 'survey-submit-status' + (state.surveySubmitted ? ' submitted' : '') + (duplicateCount || missingParticipant ? ' has-error' : '');
  status.innerHTML = message + (missingParticipant ? '<span>'+h(participantMessage)+'</span>' : '') + (duplicateCount ? '<span>Each top-3 rank must use a different factor.</span>' : '') + (rankedNames ? '<ol>'+rankedNames+'</ol>' : '');
}
function submitSurvey() {
  const topIds = selectedTopFactorIds();
  const status = document.getElementById('surveySubmitStatus');
  const missingParticipant = !state.participantGroup || (state.participantGroup === 'Industrial Unit Owner' && !state.industrialOwnershipType);
  if (missingParticipant || topIds.length !== 3 || new Set(topIds).size !== 3) {
    state.surveySubmitted = false;
    updateSurveySummary();
    if (status) status.insertAdjacentHTML('beforeend', '<span>Please complete the participant profile and choose three different factors for Rank 1, Rank 2 and Rank 3.</span>');
    return;
  }
  selectedSurveyFactors().forEach(factor => {
    if (state.surveyRatings[factor.id] === undefined) state.surveyRatings[factor.id] = surveyRating(factor.id);
  });
  state.surveySubmitted = true;
  updateSurveySummary();
}
function renderStakeholderFactors() {
  const factors = state.stakeholderFactors;
  const merged = mergedFactors();
  document.getElementById('mergedFactorMeta').textContent = merged.filter(factor => factor.include).length + ' included of ' + merged.length + ' merged factors';
  document.getElementById('stakeholderFactorList').innerHTML =
    factors.map((factor, index) => '<div class="criteria-card"><header><strong>'+h(factor.factor_name)+'</strong><span>'+h(dimensionLabel(factor.related_dimension))+'</span></header><p>'+h(factor.comment)+'</p><dl><div><dt>Suggested by</dt><dd>'+h(factor.suggested_by)+'</dd></div><div><dt>Group</dt><dd>'+h(factor.stakeholder_group)+'</dd></div></dl><label class="inline-check"><input data-stakeholder-include="'+index+'" type="checkbox" '+(factor.include_in_final_model ? 'checked' : '')+' /> Include in final model</label></div>').join('') +
    '<div class="merged-strip">'+merged.slice(0, 10).map(factor => '<span class="'+(factor.include ? 'included' : '')+'">'+h(factor.type)+': '+h(factor.name)+'</span>').join('')+'</div>';
  document.querySelectorAll('[data-stakeholder-include]').forEach(input => input.onchange = e => {
    state.stakeholderFactors[Number(e.target.dataset.stakeholderInclude)].include_in_final_model = e.target.checked;
    renderStakeholderFactors();
  });
}
function renderFinalWeights() {
  const stats = weightStats();
  const top = stats.slice().sort((a,b)=>b.finalWeight-a.finalWeight)[0];
  const spread = Math.max(...stats.map(row => row.finalWeight)) - Math.min(...stats.map(row => row.finalWeight));
  document.getElementById('weightingKpis').innerHTML = [
    ['Survey dimensions', stats.length],
    ['Highest weight', top.label],
    ['Weight spread', spread.toFixed(1)+' pts'],
    ['Applied model', state.modelMode === 'survey' ? 'Final survey weights' : 'Baseline model']
  ].map(([label,value]) => '<div class="kpi"><span>'+h(label)+'</span><strong>'+h(value)+'</strong></div>').join('');
  const chart = document.getElementById('finalWeightChart');
  chart.innerHTML = '';
  stats.forEach(row => bar(chart, row.label, Number(row.finalWeight.toFixed(1)), 16, '#2563eb'));
  renderStakeholderWeightDistribution();
  document.getElementById('stakeholderDifferences').innerHTML = stats.map(row => {
    const groups = Object.entries(row.groupMeans).map(([group,value]) => '<span><em>'+h(stakeholderGroupLabel(group))+'</em><strong>'+value.toFixed(1)+'</strong></span>').join('');
    return '<div class="diff-card"><header><strong>'+h(row.label)+'</strong><span>weighted mean '+row.mean.toFixed(2)+' | median '+row.median.toFixed(1)+' | SD '+row.std.toFixed(2)+' | final weight '+row.finalWeight.toFixed(1)+'%</span></header><div>'+groups+'</div></div>';
  }).join('');
  document.getElementById('workshopValidation').innerHTML = [
    ['Model calibration workshop','Compare weighted ranking with expert site-priority judgement.'],
    ['Stakeholder validation round','Record disagreement, missing factors and acceptable policy assumptions.'],
    ['Final model lock','Apply approved weights and document changes from baseline model.']
  ].map(([title,body]) => '<div><strong>'+h(title)+'</strong><span>'+h(body)+'</span></div>').join('');
}
function renderStakeholderWeightDistribution() {
  const total = stakeholderWeightGroups.reduce((sum, group) => sum + state.stakeholderGroupWeights[group.key], 0);
  document.getElementById('stakeholderWeightDistribution').innerHTML =
    '<div class="distribution-heading"><strong>Stakeholder weighting distribution</strong><span>Total '+h(total)+'%</span></div>' +
    stakeholderWeightGroups.map(group =>
      '<label><span>'+h(group.label)+' <strong>'+h(state.stakeholderGroupWeights[group.key])+'%</strong></span><input data-group-weight="'+h(group.key)+'" type="range" min="0" max="100" value="'+h(state.stakeholderGroupWeights[group.key])+'" /></label>'
    ).join('');
  document.querySelectorAll('[data-group-weight]').forEach(input => input.oninput = e => {
    setStakeholderGroupWeight(e.target.dataset.groupWeight, Number(e.target.value));
    renderFinalWeights();
  });
}
function setStakeholderGroupWeight(changedKey, value) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const otherGroups = stakeholderWeightGroups.filter(group => group.key !== changedKey);
  const remaining = 100 - clamped;
  const otherTotal = otherGroups.reduce((sum, group) => sum + state.stakeholderGroupWeights[group.key], 0);
  state.stakeholderGroupWeights[changedKey] = clamped;
  if (!otherGroups.length) return;
  let assigned = 0;
  otherGroups.forEach((group, index) => {
    const next = index === otherGroups.length - 1
      ? remaining - assigned
      : Math.round(remaining * (otherTotal ? state.stakeholderGroupWeights[group.key] / otherTotal : 1 / otherGroups.length));
    state.stakeholderGroupWeights[group.key] = next;
    assigned += next;
  });
  if (state.modelMode === 'survey') {
    state.weights = finalResearchWeights();
    state.researchWeights = state.weights.slice();
  }
}
function renderFilterSummary(visible, total) {
  const active = Object.entries(state.filters).filter(([key,value]) => value !== defaultFilters[key]).map(([key,value]) => key + ': ' + value);
  document.getElementById('filterSummary').innerHTML = '<strong>'+visible+' of '+total+' buildings visible</strong><span>'+(active.length ? h(active.join(' | ')) : 'No active filters')+'</span>';
}
function renderMap(rows, selected) {
  const el = document.getElementById('mapPanel');
  const catchment = catchmentFor(selected);
  if (window.L) {
    el.classList.remove('fallback');
    el.querySelectorAll('.empty-state').forEach(node => node.remove());
    if (!suitabilityMap) {
      suitabilityMap = L.map(el, { scrollWheelZoom: false }).setView([22.326, 114.17], 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(suitabilityMap);
      suitabilityLayer = L.layerGroup().addTo(suitabilityMap);
    }
    suitabilityLayer.clearLayers();
    L.circle([selected.lat, selected.lng], {
      radius: 500,
      color: '#2563eb',
      weight: 2,
      fillColor: '#2563eb',
      fillOpacity: 0.08
    }).bindPopup('<strong>500 m community catchment</strong>'+h(selected.name)+'<br>'+h(catchment.length)+' amenities and stations identified').addTo(suitabilityLayer);
    rows.forEach(b => {
      const marker = L.circleMarker([b.lat, b.lng], {
        radius: b.id === selected.id ? 11 : Math.max(7, Math.min(14, b.floorArea / 1800)),
        color: '#ffffff',
        weight: b.id === selected.id ? 3 : 2,
        fillColor: categoryColor[b.category],
        fillOpacity: 0.88
      }).bindPopup('<strong>'+h(b.name)+'</strong>'+h(b.district)+'<br>Score: '+h(b.score)+'<br>'+h(b.category)+' suitability');
      marker.on('click', () => { state.selected = b.id; render(); });
      marker.addTo(suitabilityLayer);
      if (b.id === selected.id) marker.openPopup();
    });
    catchment.filter(item => item.type !== 'MTR').forEach(f => {
      L.circleMarker([f.lat, f.lng], {
        radius: 6,
        color: '#ffffff',
        weight: 2,
        fillColor: facilityColor[f.type],
        fillOpacity: 0.95
      }).bindPopup('<strong>'+h(f.name)+'</strong>'+h(f.type)+'<br>'+h(f.distance)+' m from selected building').addTo(suitabilityLayer);
    });
    catchment.filter(item => item.type === 'MTR').forEach(station => {
      L.circleMarker([station.lat, station.lng], {
        radius: 7,
        color: '#ffffff',
        weight: 2,
        fillColor: facilityColor.MTR,
        fillOpacity: 0.95
      }).bindPopup('<strong>'+h(station.name)+'</strong>MTR station<br>'+h(station.distance)+' m from selected building').addTo(suitabilityLayer);
    });
    suitabilityMap.setView([selected.lat, selected.lng], 15);
    setTimeout(() => suitabilityMap.invalidateSize(), 0);
    if (!document.querySelector('#mapPanel .map-legend')) {
      el.insertAdjacentHTML('beforeend', '<div class="map-legend">'+['High','Medium','Low'].map(c => '<span><i style="background:'+categoryColor[c]+'"></i>'+c+'</span>').join('')+'<span><i style="background:'+facilityColor.Hospital+'"></i>Hospital</span><span><i style="background:'+facilityColor['Shopping mall']+'"></i>Shopping mall</span><span><i style="background:'+facilityColor['Wet market']+'"></i>Wet market</span><span><i style="background:'+facilityColor.MTR+'"></i>MTR</span><span><i class="radius-key"></i>500 m</span></div>');
    }
    if (!rows.length) el.insertAdjacentHTML('beforeend', '<div class="empty-state">No mapped buildings match the current filters.</div>');
    return;
  }
  el.classList.add('fallback');
  el.innerHTML = '';
  rows.forEach(b => {
    const left = (b.lng - 113.95) / (114.25 - 113.95) * 100;
    const top = (1 - (b.lat - 22.22) / (22.46 - 22.22)) * 100;
    const size = Math.max(14, Math.min(34, b.floorArea / 750));
    const m = document.createElement('button');
    m.className = 'marker' + (b.id === selected.id ? ' selected' : '');
    m.style.cssText = 'left:'+left+'%;top:'+top+'%;width:'+size+'px;height:'+size+'px;background:'+categoryColor[b.category];
    m.title = b.name + ': ' + b.score;
    m.setAttribute('aria-label', b.name + ', suitability score ' + b.score);
    m.onclick = () => { state.selected = b.id; render(); };
    el.appendChild(m);
  });
  if (!rows.length) el.insertAdjacentHTML('beforeend', '<div class="empty-state">No mapped buildings match the current filters.</div>');
  el.insertAdjacentHTML('beforeend', '<div class="map-legend">'+['High','Medium','Low'].map(c => '<span><i style="background:'+categoryColor[c]+'"></i>'+c+'</span>').join('')+'</div>');
}
function renderZoneMap(rows, selected) {
  const el = document.getElementById('zoneMapPanel');
  if (!el) return;
  if (window.L) {
    el.classList.remove('fallback');
    if (!zoneMap) {
      zoneMap = L.map(el, { scrollWheelZoom: false }).setView([22.326, 114.17], 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(zoneMap);
      zoneMap.createPane('ozpPane');
      zoneMap.getPane('ozpPane').style.zIndex = 350;
      zoneMap.getPane('ozpPane').style.pointerEvents = 'none';
      zoneLayer = L.layerGroup().addTo(zoneMap);
      zoneMap.on('moveend zoomend resize', updateOzpResidentialOverlay);
    }
    zoneLayer.clearLayers();
    rows.forEach(b => {
      L.circleMarker([b.lat, b.lng], {
        radius: b.id === selected.id ? 7 : 4,
        color: '#111827',
        weight: b.id === selected.id ? 2 : 1,
        fillColor: categoryColor[b.category],
        fillOpacity: 0.92
      }).bindPopup('<strong>'+h(b.name)+'</strong>'+h(b.district)+'<br>Current vacancy: '+h(b.vacancy)+'%').addTo(zoneLayer);
    });
    setTimeout(() => {
      zoneMap.invalidateSize();
      fitZoneMap();
      updateOzpResidentialOverlay();
    }, 0);
    if (!document.querySelector('#zoneMapPanel .zone-legend')) {
      el.insertAdjacentHTML('beforeend', '<div class="map-legend zone-legend">'+ozpResidentialGroups.map(z => '<span><i style="background:'+z.color+'"></i>'+h(z.code)+'</span>').join('')+'<span class="source-text">Town Planning Board OZP</span></div>');
    }
    return;
  }
  el.classList.add('fallback');
  el.innerHTML = '<div class="empty-state">Residential zone map requires the Leaflet map library.</div>';
}
function fitZoneMap() {
  if (zoneMap) zoneMap.fitBounds([[22.22,113.95],[22.46,114.25]], { padding: [24, 24] });
}
function ozpExportUrl() {
  const bounds = zoneMap.getBounds();
  const size = zoneMap.getSize();
  const params = new URLSearchParams({
    bbox: [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()].join(','),
    bboxSR: '4326',
    imageSR: '4326',
    size: Math.max(320, size.x) + ',' + Math.max(240, size.y),
    format: 'png32',
    transparent: 'true',
    layers: 'show:1015',
    layerDefs: JSON.stringify(ozpLayerDefs),
    f: 'image'
  });
  return ozpServiceUrl + '?' + params.toString();
}
function updateOzpResidentialOverlay() {
  if (!zoneMap) return;
  const bounds = zoneMap.getBounds();
  const image = L.imageOverlay(ozpExportUrl(), bounds, {
    pane: 'ozpPane',
    opacity: 0.72,
    attribution: 'Planning Data from Town Planning Board'
  });
  image.on('load', () => {
    if (zoneOzpOverlay) zoneMap.removeLayer(zoneOzpOverlay);
    zoneOzpOverlay = image;
  });
  image.on('error', () => {
    if (!document.querySelector('#zoneMapPanel .ozp-warning')) {
      document.getElementById('zoneMapPanel').insertAdjacentHTML('beforeend', '<div class="empty-state ozp-warning">Official OZP residential zoning layer is temporarily unavailable.</div>');
    }
  });
  image.addTo(zoneMap);
}
function renderProfile(b) {
  const catchment = catchmentFor(b);
  const summary = catchmentSummary(catchment);
  const nearestStation = catchment.find(item => item.type === 'MTR');
  const catchmentList = catchment.length
    ? '<ul class="catchment-list">'+catchment.map(item => '<li><span class="catchment-dot" style="background:'+facilityColor[item.type]+'"></span><strong>'+h(item.name)+'</strong><em>'+h(item.type)+' · '+h(item.distance)+' m</em></li>').join('')+'</ul>'
    : '<p class="muted-note">No listed community facilities or MTR stations fall inside the 500 m catchment.</p>';
  document.getElementById('buildingProfile').innerHTML =
    '<h2>'+h(b.name)+'</h2><p>'+h(b.address)+'</p><span class="badge" style="background:'+categoryColor[b.category]+'">'+h(b.category)+' suitability</span><strong style="float:right;font-size:34px">'+h(b.score)+'</strong>' +
    '<dl><div><dt>District</dt><dd>'+h(b.district)+'</dd></div><div><dt>Age</dt><dd>'+h(b.age)+' yrs</dd></div><div><dt>Zoning</dt><dd>'+h(b.zoning)+'</dd></div><div><dt>Ownership</dt><dd>'+h(b.ownership)+'</dd></div><div><dt>Vacancy</dt><dd>'+h(b.vacancy)+'%</dd></div><div><dt>Storeys</dt><dd>'+h(b.storeys)+'</dd></div><div><dt>Building height</dt><dd>'+h(b.height)+' m</dd></div><div><dt>MTR distance</dt><dd>'+h(b.mtr)+' m</dd></div></dl>' +
    '<h3>500 m community catchment</h3><p class="muted-note">Amenities shown on the GIS map inside the selected building radius.</p><dl>'+summary.map(([label,value]) => '<div><dt>'+h(label)+'</dt><dd>'+h(value)+'</dd></div>').join('')+'<div><dt>Nearest MTR</dt><dd>'+h(nearestStation ? nearestStation.name + ' (' + nearestStation.distance + ' m)' : 'None within 500 m')+'</dd></div></dl>'+catchmentList +
    '<h3>Main constraints</h3><p>'+h(b.constraints)+'</p><h3>Main opportunities</h3><p>'+h(b.opportunities)+'</p>';
}
function renderTable(rows) {
  const columns = [
    ['id','ID'], ['name','Building'], ['district','District'], ['year','Year'], ['age','Age'], ['zoning','Zoning'], ['ownership','Ownership'], ['vacancy','Vacancy'], ['mtr','MTR'], ['housingDemand','Housing'], ['planningZoning','Planning'], ['landLease','Lease'], ['ownershipGovernance','Governance'], ['regulationSafety','Safety'], ['buildingAdaptability','Adaptability'], ['locationTransport','Transport'], ['districtCapacity','Capacity'], ['neighbourhoodCompatibility','Neighbourhood'], ['economicFinancial','Economic'], ['policyCertainty','Policy'], ['score','Overall'], ['category','Category']
  ];
  const ordered = sortedRows(rows);
  document.getElementById('tableMeta').textContent = ordered.length + ' ranked records';
  document.getElementById('comparisonTable').innerHTML =
    '<thead><tr>'+columns.map(([key,label]) => '<th><button data-sort="'+key+'">'+h(label)+(state.sort.key === key ? (state.sort.dir === 'asc' ? ' ^' : ' v') : '')+'</button></th>').join('')+'</tr></thead><tbody>'+
    ordered.map(b => {
      const cells = [b.id,b.name,b.district,b.year,b.age,b.zoning,b.ownership,b.vacancy+'%',b.mtr+' m',b.housingDemand,b.planningZoning,b.landLease,b.ownershipGovernance,b.regulationSafety,b.buildingAdaptability,b.locationTransport,b.districtCapacity,b.neighbourhoodCompatibility,b.economicFinancial,b.policyCertainty,b.score].map(v => '<td>'+h(v)+'</td>');
      cells.push('<td><span class="badge" style="background:'+categoryColor[b.category]+'">'+h(b.category)+'</span></td>');
      return '<tr data-id="'+h(b.id)+'" class="'+(b.id === state.selected ? 'selected-row' : '')+'">'+cells.join('')+'</tr>';
    }).join('')+'</tbody>';
  document.querySelectorAll('[data-sort]').forEach(btn => btn.onclick = () => {
    const key = btn.dataset.sort;
    state.sort = { key, dir: state.sort.key === key && state.sort.dir === 'desc' ? 'asc' : 'desc' };
    render();
  });
  document.querySelectorAll('#comparisonTable tbody tr').forEach(row => row.onclick = () => { state.selected = row.dataset.id; render(); });
}
function renderWeights(selected) {
  const nw = normalisedWeights(state.weights);
  const modelDimensions = activeDimensions();
  document.getElementById('weightSliders').innerHTML =
    '<div class="model-mode"><strong>'+h(state.modelMode === 'survey' ? 'Survey-derived eight-dimension model' : 'Baseline 11-factor model')+'</strong><span>'+h(state.modelMode === 'survey' ? 'Final weights from the research workflow are currently applied.' : 'Use Final Weights to apply survey-derived research weights.')+'</span></div>' +
    modelDimensions.map(([key,label,desc], i) => '<div class="weight-row"><header><span>'+h(label)+'</span><span>'+Math.round(nw[i])+'%</span></header><p>'+h(desc)+'</p><input data-weight="'+i+'" type="range" min="0" max="35" value="'+state.weights[i]+'" /></div>').join('');
  document.querySelectorAll('[data-weight]').forEach(input => input.oninput = e => {
    state.weights[Number(e.target.dataset.weight)] = Number(e.target.value);
    state.scenario = 'custom';
    render();
  });
  renderCompareControls();
  renderRadar(selected);
}
function renderCompareControls() {
  const ranked = scored();
  ['compareOne','compareTwo'].forEach((id, index) => {
    const el = document.getElementById(id);
    const current = state.compare[index] || '';
    el.innerHTML = '<option value="">None</option>' + ranked.map(b => '<option value="'+h(b.id)+'">'+h(b.id)+' - '+h(b.name)+' ('+h(b.score)+')</option>').join('');
    el.value = current;
    el.oninput = e => {
      state.compare[index] = e.target.value;
      render();
    };
  });
}
function renderScenarios() {
  const el = document.getElementById('scenarioComparison');
  el.innerHTML = Object.entries(scenarios).filter(([k])=>k!=='balanced').map(([k,s]) => {
    const r = scored(s.weights, 'baseline').slice(0,4);
    const nw = normalisedWeights(s.weights);
    const emphasis = dimensions.map(([key,label], i) => ({ label, weight: Math.round(nw[i]) })).sort((a,b)=>b.weight-a.weight).slice(0,4);
    return '<div class="scenario-card"><h3>'+h(s.label)+'</h3><p>'+h(s.summary)+'</p><div class="scenario-emphasis"><span>Higher emphasis</span>'+emphasis.map(f => '<strong>'+h(f.label)+' '+h(f.weight)+'%</strong>').join('')+'</div><ol>'+r.map(b=>'<li>'+h(b.name)+' <strong>'+h(b.score)+'</strong></li>').join('')+'</ol></div>';
  }).join('');
  document.querySelectorAll('#scenarioButtons button').forEach(btn => btn.classList.toggle('active', btn.dataset.scenario === state.scenario));
}
function syncFilterControls() {
  Object.entries(state.filters).forEach(([key,value]) => {
    const el = document.getElementById(key);
    if (el) el.value = value;
  });
  document.getElementById('minScoreValue').textContent = state.filters.minScore;
  document.getElementById('minVacancyValue').textContent = state.filters.minVacancy;
  document.getElementById('maxAgeValue').textContent = state.filters.maxAge;
  document.getElementById('maxHeightValue').textContent = state.filters.maxHeight;
  document.getElementById('maxStoreysValue').textContent = state.filters.maxStoreys;
  document.getElementById('maxMtrValue').textContent = state.filters.maxMtr;
}
function init() {
  options('district', buildings.map(b=>b.district));
  options('zoning', buildings.map(b=>b.zoning));
  options('ownership', buildings.map(b=>b.ownership));
  options('risk', ['Low','Medium','High']);
  options('compatibility', ['Low','Medium','High']);
  document.getElementById('stakeholderGroup').innerHTML = stakeholderGroups.map(group => '<option>'+h(group)+'</option>').join('');
  document.getElementById('stakeholderDimension').innerHTML = researchDimensions.map(([key,label]) => '<option value="'+h(key)+'">'+h(label)+'</option>').join('');
  renderCompareControls();
  document.getElementById('scenarioButtons').innerHTML = Object.entries(scenarios).map(([k,s]) => '<button data-scenario="'+k+'">'+h(s.label)+'<small>'+h(s.summary)+'</small></button>').join('');
  document.querySelectorAll('[data-scenario]').forEach(btn => btn.onclick = () => { state.scenario = btn.dataset.scenario; state.modelMode = 'baseline'; state.weights = scenarios[state.scenario].weights.slice(); render(); });
  document.querySelectorAll('.tab').forEach(tab => tab.onclick = () => {
    document.querySelectorAll('.tab,.tab-panel').forEach(x => x.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
    if (tab.dataset.tab === 'map') {
      if (suitabilityMap) setTimeout(() => suitabilityMap.invalidateSize(), 0);
      if (zoneMap) setTimeout(() => {
        zoneMap.invalidateSize();
        fitZoneMap();
        updateOzpResidentialOverlay();
      }, 0);
    }
  });
  ['search','district','zoning','ownership','risk','compatibility'].forEach(id => document.getElementById(id).oninput = e => { state.filters[id] = e.target.value; render(); });
  [['minScore','minScoreValue'],['minVacancy','minVacancyValue'],['maxAge','maxAgeValue'],['maxHeight','maxHeightValue'],['maxStoreys','maxStoreysValue'],['maxMtr','maxMtrValue']].forEach(([id,out]) => document.getElementById(id).oninput = e => { state.filters[id] = Number(e.target.value); document.getElementById(out).textContent = e.target.value; render(); });
  document.getElementById('resetFilters').onclick = () => { state.filters = {...defaultFilters}; syncFilterControls(); render(); };
  document.getElementById('exportCsv').onclick = exportCsv;
  document.getElementById('exportSurveyCriteria').onclick = exportSurveyCriteria;
  document.getElementById('addStakeholderFactor').onclick = addStakeholderFactor;
  document.getElementById('applyFinalWeights').onclick = () => {
    state.modelMode = 'survey';
    state.scenario = 'custom';
    state.weights = finalResearchWeights();
    state.researchWeights = state.weights.slice();
    render();
  };
  syncFilterControls();
  render();
}
function exportSurveyCriteria() {
  const headers = ['factor_id','dimension','factor_name','survey_question','importance_slider','literature_source','data_indicator','scoring_method'];
  const rows = selectedSurveyFactors().map(factor => [factor.id, dimensionLabel(factor.dimension), factor.factor_name, surveyQuestion(factor), '0=Not important; 50=Moderately important; 100=Very important', factor.literature_source, factor.data_indicator, factor.scoring_method]);
  downloadCsv('adaptive-reuse-survey-criteria.csv', headers, rows);
}
function addStakeholderFactor() {
  const name = document.getElementById('stakeholderFactorName').value.trim();
  if (!name) return;
  state.stakeholderFactors.push({
    factor_name: name,
    suggested_by: document.getElementById('stakeholderSuggestedBy').value.trim() || 'Unspecified',
    stakeholder_group: document.getElementById('stakeholderGroup').value,
    related_dimension: document.getElementById('stakeholderDimension').value,
    comment: document.getElementById('stakeholderComment').value.trim() || 'No comment provided.',
    include_in_final_model: true
  });
  ['stakeholderFactorName','stakeholderSuggestedBy','stakeholderComment'].forEach(id => document.getElementById(id).value = '');
  renderResearchWorkflow();
}
function exportCsv() {
  const factorHeaders = dimensions.map(([key]) => key);
  const headers = ['building_id','building_name','district','address','existing_zoning','ownership_type','distance_to_mtr_m',...factorHeaders,'overall_suitability_score','suitability_category','main_constraints','main_opportunities'];
  const rows = filtered().map(b => [b.id,b.name,b.district,b.address,b.zoning,b.ownership,b.mtr,...dimensions.map(([key]) => b[key]),b.score,b.category,b.constraints,b.opportunities]);
  downloadCsv('adaptive-reuse-ranked-buildings.csv', headers, rows);
}
init();
