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
  balanced: { label: 'Survey-derived balanced scenario', summary: 'Uses final survey-derived weights across the eight critical-factor dimensions.', weights: null },
  housing: { label: 'Housing-outcome scenario', summary: 'Prioritises location support, design adaptability, safety and environmental residential quality.', weights: [10,18,16,10,9,16,8,13] },
  policy: { label: 'Policy-feasibility scenario', summary: 'Prioritises feasibility, regulatory constraints, building services and health and safety.', weights: [18,8,8,15,22,18,6,5] },
  market: { label: 'Market-driven scenario', summary: 'Prioritises economic viability, feasibility, location and implementation practicality.', weights: [18,16,10,10,10,8,22,6] },
  community: { label: 'Community-impact scenario', summary: 'Prioritises location, health and safety, environmental performance and design quality.', weights: [8,22,14,8,8,18,6,16] }
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
  ['services','Building height and services constraint','Influence of height, storeys and plant capacity on retrofit feasibility.','Douglas; Langston et al.','Building height and storeys','Penalty for height/storey combinations that raise retrofit complexity',true],
  ['regulatory','Planning and zoning acceptability','Whether existing zoning can support residential or mixed residential conversion.','Town Planning Board OZP; Yung & Chan','OZP zoning group and planning permission route','Higher score for residential or business zones with clearer pathway',true],
  ['regulatory','Land lease and premium uncertainty','Risk created by lease modification, waiver and premium requirements.','Lands Department practice; HK adaptive reuse studies','Lease modification need and premium risk','Expert risk score from lease and premium pathway',true],
  ['regulatory','Approval coordination risk','Complexity of coordinating planning, building, fire and lands approvals.','Conejos et al.; Wilkinson et al.','Number of approval authorities and uncertainty','Score lower where multi-agency uncertainty is high',true],
  ['safety','Fire safety upgrade burden','Extent of required fire services, compartmentation and means-of-escape upgrades.','Buildings Ordinance; Fire Services Department requirements','Fire safety audit rating','Expert score from upgrade burden',true],
  ['safety','Industrial hazard adjacency','Exposure to remaining industrial, storage or logistics hazards nearby.','Planning and environmental health literature','Environmental risk and adjacent uses','Risk-adjusted score from surrounding uses',true],
  ['safety','Residential health protection','Ability to meet hygiene, acoustic and occupant health expectations.','Hong Kong Planning Standards and Guidelines','Noise, air quality and hygiene constraints','Score from environmental and health risk indicators',true],
  ['economic','Conversion cost viability','Likelihood that conversion cost remains proportionate to residential value.','Bullen & Love; Wilkinson et al.','Retrofit cost and GFA proxy','Score from feasibility, building size and expected upgrade burden',true],
  ['economic','Market absorption potential','Strength of housing demand and residential market support in the district.','Remoy & van der Voordt; HK housing studies','Housing demand and accessibility','Score from housing demand and location indicators',true],
  ['economic','Policy and incentive leverage','Potential benefit from policy support, fee waiver or pilot implementation.','Hong Kong adaptive reuse policy studies','Policy certainty and incentive eligibility','Score from policy certainty and zoning pathway',true],
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
const surveyFactorExplanations = {
  'Conversion readiness': 'Conversion readiness refers to how easily an industrial building can be converted into residential use in its existing condition. This includes whether the building has suitable structure, vacancy, ownership conditions, access, services, and approval pathway to support conversion without excessive delay, cost, or technical difficulty.',
  'Ownership and implementation capacity': 'This factor considers whether the building ownership structure allows decisions to be made and implemented effectively. A single owner or coordinated management body may make adaptive reuse easier, while fragmented ownership can create delays, disputes, or difficulty reaching consensus.',
  'Vacancy and decanting potential': 'This factor refers to whether enough space in the building is vacant or can be temporarily relocated to allow conversion works. A higher level of vacancy may reduce displacement pressure and make phased redevelopment or retrofit more practical.',
  'Transit accessibility': 'Transit accessibility refers to how well the building is connected to MTR, buses, walking routes, and other transport networks. Good accessibility is important because residential reuse depends on daily travel convenience for future residents.',
  'Community facility catchment': 'This factor considers whether essential daily facilities are available within walking distance of the building. These may include markets, clinics, schools, parks, shops, community services, and other facilities needed to support residential living.',
  'Residential neighbourhood compatibility': 'Residential neighbourhood compatibility refers to whether the surrounding area is suitable for people to live in. This includes land-use mix, nearby industrial activities, noise, traffic, pollution, safety, and whether residential use would fit with the existing neighbourhood context.',
  'Floor-plate adaptability': 'Floor-plate adaptability refers to whether the building layout can be reasonably subdivided into residential units. Important considerations include floor depth, column spacing, core location, corridor arrangement, window access, and whether the plan can support liveable unit layouts.',
  'Natural light and ventilation potential': 'This factor considers whether future residential units can receive adequate daylight and natural ventilation. It is especially important in industrial buildings because deep floor plates, limited windows, or poor facade exposure may make residential conversion difficult.',
  'Structural robustness': 'Structural robustness refers to whether the existing building structure is strong, stable, and flexible enough to support residential conversion. This includes the condition of the frame, loading capacity, age, structural system, and ability to accommodate new code or safety requirements.',
  'MEP retrofit difficulty': 'MEP retrofit difficulty refers to the complexity of upgrading mechanical, electrical, plumbing, drainage, and building services systems. Residential use usually requires different service standards from industrial use, so difficult service routing or insufficient capacity may increase cost and technical risk.',
  'Vertical circulation adequacy': 'This factor considers whether the building has suitable lifts, staircases, cores, and accessible routes for residential occupation. Residential conversion may require adequate daily circulation, emergency escape, barrier-free access, and separation between different users.',
  'Building height and services constraint': 'This factor considers whether the building height and number of storeys create additional retrofit challenges. Taller buildings may require more complex lift upgrades, fire safety provisions, drainage design, pressure control, and building services coordination.',
  'Planning and zoning acceptability': 'Planning and zoning acceptability refers to whether the existing statutory planning context can support residential or mixed residential use. If the site zoning does not clearly permit residential conversion, the project may face planning application risk, uncertainty, or rejection.',
  'Land lease and premium uncertainty': 'This factor considers whether lease conditions, waiver requirements, lease modification, or land premium could affect conversion feasibility. Even if the building is physically suitable, uncertain land administration costs or procedures may make the project less attractive or harder to implement.',
  'Approval coordination risk': 'Approval coordination risk refers to the difficulty of obtaining and coordinating permissions from different government departments and authorities. Adaptive reuse may involve planning, building, fire safety, lands, environmental, and other approvals, so fragmented approval processes can create delay and uncertainty.',
  'Fire safety upgrade burden': 'This factor considers the extent of fire safety works required before residential use can be accepted. It may include means of escape, fire service installations, compartmentation, refuge provisions, emergency access, and compliance with current safety standards.',
  'Industrial hazard adjacency': 'Industrial hazard adjacency refers to risks created by nearby industrial, logistics, storage, workshop, or hazardous activities. Residential conversion may be less suitable where future residents would be exposed to noise, fire risk, chemical storage, heavy vehicles, or other industrial hazards.',
  'Residential health protection': 'This factor considers whether the converted building can provide a healthy living environment for residents. It includes air quality, noise, hygiene, waste handling, natural ventilation, daylight, contamination risk, and protection from surrounding environmental impacts.',
  'Conversion cost viability': 'Conversion cost viability refers to whether the expected retrofit and compliance costs are reasonable compared with the potential residential value or social benefit. A building may be technically convertible, but still unsuitable if the required works are too expensive or financially unrealistic.',
  'Market absorption potential': 'Market absorption potential refers to whether there is sufficient housing demand for the type of residential reuse proposed. This includes district-level demand, affordability, rental or sales market support, accessibility, and whether future residents are likely to accept the location.',
  'Policy and incentive leverage': 'This factor considers whether government policy, pilot schemes, fee waivers, incentives, or administrative support could improve project feasibility. Strong policy support may reduce uncertainty and make otherwise difficult conversion projects more achievable.',
  'Embodied carbon retention': 'Embodied carbon retention refers to the environmental benefit of reusing the existing building structure instead of demolition and new construction. A project may have higher sustainability value if it can retain substantial structural fabric while still meeting residential standards.',
  'Contamination and remediation risk': 'This factor considers whether past or surrounding industrial activities may have caused contamination that requires investigation or remediation. Soil, building materials, air quality, or operational residues may create health, cost, and approval risks for residential conversion.',
  'Operational performance upgrade': 'Operational performance upgrade refers to whether the building can be improved to achieve acceptable energy, ventilation, thermal comfort, and environmental performance after conversion. This is important because residential use requires long-term comfort, efficiency, and sustainable operation.'
};
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
  { key: 'community', label: 'Community / NGO' },
  { key: 'architectPlanner', label: 'architect/ Planner/ related expertise' },
  { key: 'developer', label: 'Developer' }
];
const surveyStakeholderGroups = [
  ...stakeholderWeightGroups.map(group => group.label)
];
const stakeholderGroups = [...surveyStakeholderGroups, 'Professional consultant'];
const reuseOutcomeOptions = [
  'Commercial',
  'Private rental housing',
  'Small residential units',
  'Co-living',
  'Student housing',
  'Transitional housing',
  'Mixed-use residential-commercial',
  'Serviced apartment / hotel-like use',
  'Prefer not to convert to residential use'
];
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
const defaultMapLayers = { buildings: true, catchment: true, facilities: true, mtr: true, ozp: true };
const defaultBaselineFilters = { district: 'All', zoning: 'All', ownership: 'All', risk: 'All', minStoreys: 0, minScore: 0 };
let state = { scenario: 'balanced', modelMode: 'survey', weights: researchDimensions.map(() => 1), researchWeights: researchDimensions.map(() => 1), selected: buildings[0].id, compare: [buildings[6].id, buildings[11].id], sort: { key: 'score', dir: 'desc' }, filters: {...defaultFilters}, mapLayers: {...defaultMapLayers}, stakeholderFactors: [
  { factor_name: 'Workshop validation confidence', suggested_by: 'Pilot workshop', stakeholder_group: 'Professional consultant', related_dimension: 'feasibility', comment: 'Record whether workshop participants agree with model output for each site.', include_in_final_model: true },
  { factor_name: 'Tenant displacement management', suggested_by: 'Community panel', stakeholder_group: 'Community / NGO', related_dimension: 'safety', comment: 'Flag social and health risks from relocating existing small businesses.', include_in_final_model: false }
], surveyRatings: {}, surveySelectedFactorIds: [], surveyTopFactors: ['', '', ''], preferredReuseOutcomes: [], surveySubmitted: false, surveyResultsUnlocked: false, participantGroup: '', industrialOwnershipType: '', surveyResultGroup: 'All', baselineFilters: {...defaultBaselineFilters}, stakeholderGroupWeights: { academics: 17, government: 17, industry: 17, community: 17, architectPlanner: 16, developer: 16 }, surveySubmissions: [], surveySubmissionsLoaded: false, databaseStatus: 'Using local pilot data until Supabase is configured.', viewMode: 'decision' };
let suitabilityMap = null;
let mapLayerGroups = null;
let mainOzpOverlay = null;
const categoryColor = { High: '#0f766e', Medium: '#d97706', Low: '#dc2626', 'Lower conversion priority': '#dc2626' };
const facilityColor = { Hospital: '#dc2626', 'Shopping mall': '#7c3aed', 'Wet market': '#d97706', MTR: '#2563eb' };
const radarPalette = ['#0f766e', '#2563eb', '#d97706', '#64748b'];
const fmt = new Intl.NumberFormat('en-HK');
function h(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
const termExplanations = {
  OZP: 'Outline Zoning Plan: a statutory town plan in Hong Kong that shows land-use zones, planning intentions and development restrictions.',
  MEP: 'Mechanical, electrical and plumbing systems, including lifts, power, water supply, drainage, ventilation and other building services.',
  initial: 'Initial means the first-stage or starting-point assessment before later survey weighting, filtering or validation is applied.'
};
function explainTerms(value) {
  return h(value).replace(/\b(OZP|MEP|initial)\b/gi, match => {
    const key = match.toLowerCase() === 'initial' ? 'initial' : match.toUpperCase();
    return '<span class="term-tip" tabindex="0" title="'+h(termExplanations[key])+'">'+h(match)+'</span>';
  });
}
const supabaseConfig = window.ADAPTIVE_REUSE_SUPABASE || {};
function supabaseReady() {
  return !!(supabaseConfig.url && supabaseConfig.anonKey && !String(supabaseConfig.url).includes('YOUR_') && !String(supabaseConfig.anonKey).includes('YOUR_'));
}
async function supabaseRequest(table, options = {}) {
  if (!supabaseReady()) throw new Error('Supabase is not configured.');
  const url = String(supabaseConfig.url).replace(/\/$/, '') + '/rest/v1/' + table + (options.query || '');
  const headers = {
    apikey: supabaseConfig.anonKey,
    Authorization: 'Bearer ' + supabaseConfig.anonKey,
    'Content-Type': 'application/json',
    Prefer: options.prefer || 'return=representation'
  };
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || 'Supabase request failed with status ' + response.status);
  }
  return response.status === 204 ? [] : response.json();
}
function stakeholderGroupKey(value) {
  const clean = String(value || '').trim();
  const match = stakeholderWeightGroups.find(group => group.key === clean || group.label === clean);
  return match ? match.key : clean;
}
function emptySurveyResponseSet() {
  return Object.fromEntries(researchDimensions.map(([key]) => [
    key,
    Object.fromEntries(stakeholderWeightGroups.map(group => [group.key, []]))
  ]));
}
function shouldUseSubmissionData() { return state.surveySubmissionsLoaded || state.surveySubmissions.length > 0; }
function currentSurveyResponses() {
  if (!shouldUseSubmissionData()) return surveyResponses;
  const responseSet = emptySurveyResponseSet();
  state.surveySubmissions.forEach(submission => {
    const groupKey = stakeholderGroupKey(submission.stakeholder_group_key || submission.stakeholder_group);
    if (!responseSet.feasibility[groupKey]) return;
    const ratings = submission.ratings || {};
    researchDimensions.forEach(([dimensionKey]) => {
      const values = criticalFactors
        .filter(factor => factor.dimension === dimensionKey && Number.isFinite(Number(ratings[factor.id])))
        .map(factor => Number(ratings[factor.id]));
      if (values.length) responseSet[dimensionKey][groupKey].push(mean(values) / 20);
    });
  });
  return responseSet;
}
function surveyValuesForFactor(factorId, groupKey = state.surveyResultGroup) {
  if (!shouldUseSubmissionData()) return [];
  return state.surveySubmissions
    .filter(submission => groupKey === 'All' || stakeholderGroupKey(submission.stakeholder_group_key || submission.stakeholder_group) === groupKey)
    .map(submission => Number((submission.ratings || {})[factorId]))
    .filter(Number.isFinite);
}
function surveySubmissionPayload() {
  const ratings = Object.fromEntries(selectedQuestionnaireFactors().map(factor => [factor.id, surveyRating(factor.id)]));
  const topFactorNames = state.surveyTopFactors.map(id => (criticalFactors.find(factor => factor.id === id) || {}).factor_name).filter(Boolean);
  return {
    stakeholder_group: state.participantGroup,
    stakeholder_group_key: stakeholderGroupKey(state.participantGroup),
    industrial_ownership_type: state.industrialOwnershipType || null,
    ratings,
    top_factor_ids: state.surveyTopFactors.slice(),
    top_factor_names: topFactorNames,
    preferred_reuse_outcomes: state.preferredReuseOutcomes.slice()
  };
}
async function saveSurveySubmission(payload) {
  if (!supabaseReady()) {
    state.surveySubmissions.push({...payload, id: 'local-' + Date.now(), created_at: new Date().toISOString()});
    state.surveySubmissionsLoaded = true;
    state.databaseStatus = 'Supabase is not configured. This submission is stored locally in this browser session only.';
    return { remote: false };
  }
  const rows = await supabaseRequest('survey_submissions', { method: 'POST', body: payload });
  state.surveySubmissions.unshift(rows[0] || payload);
  state.surveySubmissionsLoaded = true;
  state.databaseStatus = 'Connected to Supabase. Survey data is stored in the database.';
  return { remote: true };
}
async function saveStakeholderSuggestedFactor(payload) {
  if (!supabaseReady()) {
    state.stakeholderFactors.unshift(payload);
    state.databaseStatus = 'Supabase is not configured. Suggested factors are stored locally in this browser session only.';
    return { remote: false };
  }
  const rows = await supabaseRequest('stakeholder_suggested_factors', { method: 'POST', body: payload });
  state.stakeholderFactors.unshift(rows[0] || payload);
  state.databaseStatus = 'Connected to Supabase. Suggested factor stored in the database.';
  return { remote: true };
}
async function loadSupabaseData() {
  if (!supabaseReady()) {
    state.databaseStatus = 'Using local pilot data until Supabase Project URL and anon key are added in supabase-config.js.';
    render();
    return;
  }
  try {
    const [submissions, suggestedFactors] = await Promise.all([
      supabaseRequest('survey_submissions', { query: '?select=*&order=created_at.desc' }),
      supabaseRequest('stakeholder_suggested_factors', { query: '?select=*&order=created_at.desc' })
    ]);
    state.surveySubmissions = submissions || [];
    state.surveySubmissionsLoaded = true;
    if (Array.isArray(suggestedFactors) && suggestedFactors.length) state.stakeholderFactors = suggestedFactors;
    state.databaseStatus = 'Connected to Supabase. Loaded ' + state.surveySubmissions.length + ' survey submission' + (state.surveySubmissions.length === 1 ? '' : 's') + '.';
    state.weights = finalResearchWeights();
    state.researchWeights = state.weights.slice();
  } catch (error) {
    console.error(error);
    state.databaseStatus = 'Supabase connection failed. Check config, table names and RLS policies.';
  }
  render();
}
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
function surveyExplanation(factor) { return surveyFactorExplanations[factor.factor_name] || factor.description; }
function groupedFactorOptions(factors) {
  const groups = researchDimensions.map(([key,label]) => {
    const options = factors
      .filter(factor => factor.dimension === key)
      .map(factor => '<option value="'+h(factor.id)+'">'+h(factor.factor_name)+'</option>')
      .join('');
    return options ? '<optgroup label="'+h(label)+'">'+options+'</optgroup>' : '';
  }).join('');
  return '<option value="">Select a factor</option>' + groups;
}
function surveyRating(factorId) { return state.surveyRatings[factorId] ?? 50; }
function selectedTopFactorIds() { return state.surveyTopFactors.filter(Boolean); }
function selectedReuseOutcomes() { return state.preferredReuseOutcomes; }
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
  const responseData = currentSurveyResponses();
  const rows = researchDimensions.map(([key,label]) => {
    const groups = responseData[key];
    const values = flattenResponses(groups);
    const fallbackMean = mean(values);
    const groupMeans = Object.fromEntries(stakeholderWeightGroups.map(group => [group.key, groups[group.key]?.length ? mean(groups[group.key]) : fallbackMean]));
    const weightedMean = stakeholderWeightGroups.reduce((sum, group) => sum + groupMeans[group.key] * state.stakeholderGroupWeights[group.key] / 100, 0);
    return { key, label, mean: weightedMean, median: values.length ? median(values) : 0, std: values.length ? stdDev(values) : 0, groupMeans };
  });
  const total = rows.reduce((sum, row) => sum + row.mean, 0) || 1;
  return rows.map(row => ({...row, finalWeight: row.mean / total * 100}));
}
function hasSurveyResponseData() {
  return researchDimensions.some(([key]) => surveyValuesForDimension(key, 'All').length > 0);
}
function finalResearchWeights() {
  if (!hasSurveyResponseData()) return researchDimensions.map(() => 1);
  return weightStats().map(row => Math.max(1, Math.round(row.finalWeight)));
}
function scenarioWeights(key) { return key === 'balanced' ? finalResearchWeights() : (scenarios[key] || scenarios.balanced).weights.slice(); }
function selectedSurveyFactors() { return criticalFactors.filter(factor => factor.include_in_survey); }
function questionnaireFactorPool() { return selectedSurveyFactors(); }
function selectedQuestionnaireFactors() {
  const selectedIds = new Set(state.surveySelectedFactorIds);
  return questionnaireFactorPool().filter(factor => selectedIds.has(factor.id));
}
function cleanQuestionnaireSelection() {
  const validIds = new Set(questionnaireFactorPool().map(factor => factor.id));
  state.surveySelectedFactorIds = state.surveySelectedFactorIds.filter(id => validIds.has(id)).slice(0, 10);
  const selectedIds = new Set(state.surveySelectedFactorIds);
  Object.keys(state.surveyRatings).forEach(id => { if (!selectedIds.has(id)) delete state.surveyRatings[id]; });
  state.surveyTopFactors = state.surveyTopFactors.map(id => selectedIds.has(id) ? id : '');
}
function toggleQuestionnaireFactor(factorId) {
  const selected = state.surveySelectedFactorIds.includes(factorId);
  if (selected) state.surveySelectedFactorIds = state.surveySelectedFactorIds.filter(id => id !== factorId);
  else if (state.surveySelectedFactorIds.length < 10) state.surveySelectedFactorIds.push(factorId);
  cleanQuestionnaireSelection();
  setSurveyInProgress();
}
function surveyGroupResponseCount(groupKey) {
  if (shouldUseSubmissionData()) {
    return state.surveySubmissions.filter(submission => stakeholderGroupKey(submission.stakeholder_group_key || submission.stakeholder_group) === groupKey).length;
  }
  const firstDimension = researchDimensions[0][0];
  return currentSurveyResponses()[firstDimension][groupKey]?.length || 0;
}
function surveyRespondentTotal(groupKey = state.surveyResultGroup) {
  return stakeholderWeightGroups.reduce((sum, group) => sum + (groupKey === 'All' || group.key === groupKey ? surveyGroupResponseCount(group.key) : 0), 0);
}
function surveyValuesForDimension(dimensionKey, groupKey = state.surveyResultGroup) {
  const groups = currentSurveyResponses()[dimensionKey] || {};
  return stakeholderWeightGroups.flatMap(group => groupKey === 'All' || group.key === groupKey ? (groups[group.key] || []) : []);
}
function factorSurveyScore(factor, groupKey = state.surveyResultGroup) {
  const factorValues = surveyValuesForFactor(factor.id, groupKey);
  if (factorValues.length) return Math.round(mean(factorValues));
  const values = surveyValuesForDimension(factor.dimension, groupKey);
  if (!values.length) return null;
  const base = mean(values) / 5 * 100;
  const dimensionFactors = criticalFactors.filter(item => item.dimension === factor.dimension);
  const index = dimensionFactors.findIndex(item => item.id === factor.id);
  const offset = (index - (dimensionFactors.length - 1) / 2) * 2;
  return Math.max(0, Math.min(100, Math.round(base + offset)));
}
function surveyResultRows(groupKey = state.surveyResultGroup) {
  return criticalFactors.map(factor => {
    const scoreValue = factorSurveyScore(factor, groupKey);
    return {
      ...factor,
      score: scoreValue,
      responseCount: shouldUseSubmissionData() ? surveyValuesForFactor(factor.id, groupKey).length : surveyValuesForDimension(factor.dimension, groupKey).length
    };
  }).sort((a,b) => (b.score ?? -1) - (a.score ?? -1) || a.factor_name.localeCompare(b.factor_name));
}
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
function normalisedWeights(weights) {
  const total = weights.reduce((a,b)=>a+b,0);
  if (!total) return weights.map(() => 100 / (weights.length || 1));
  return weights.map(w => w / total * 100);
}
function score(building, weights = state.weights, modelMode = state.modelMode) {
  const modelDimensions = modelMode === 'survey' ? researchDimensions : dimensions;
  const nw = normalisedWeights(weights);
  return Math.round(modelDimensions.reduce((sum, [key], i) => sum + building[key] * nw[i] / 100, 0));
}
function category(s) { return s >= 70 ? 'High' : s >= 40 ? 'Medium' : 'Lower conversion priority'; }
function scored(weights = state.weights, modelMode = state.modelMode) { return buildings.map(b => ({...b, score: score(b, weights, modelMode), category: category(score(b, weights, modelMode))})).sort((a,b)=>b.score-a.score); }
function filtered() { const q = state.filters.search.toLowerCase(); return scored().filter(b => (!q || [b.id,b.name,b.address,b.district].join(' ').toLowerCase().includes(q)) && (state.filters.district === 'All' || b.district === state.filters.district) && (state.filters.zoning === 'All' || b.zoning === state.filters.zoning) && (state.filters.ownership === 'All' || b.ownership === state.filters.ownership) && (state.filters.risk === 'All' || b.risk === state.filters.risk) && (state.filters.compatibility === 'All' || b.compatibility === state.filters.compatibility) && b.score >= state.filters.minScore && b.vacancy >= state.filters.minVacancy && b.age <= state.filters.maxAge && b.height <= state.filters.maxHeight && b.storeys <= state.filters.maxStoreys && b.mtr <= state.filters.maxMtr); }
function categoryLabel(value) {
  return value === 'High' ? 'High indicative suitability' : value === 'Medium' ? 'Medium indicative suitability' : 'Lower conversion priority';
}
function visibleBuildings() { return filtered(); }
function highPotentialBuildings(rows = visibleBuildings()) { return rows.filter(b => b.score >= 70); }
function averageScore(rows = visibleBuildings()) { return rows.length ? Math.round(mean(rows.map(b => b.score))) : 0; }
function topRankedBuilding(rows = visibleBuildings()) { return rows.slice().sort((a,b)=>b.score-a.score)[0] || null; }
function factorContributionRows(building, weights = state.weights, modelMode = state.modelMode) {
  const modelDimensions = modelMode === 'survey' ? researchDimensions : dimensions;
  const nw = normalisedWeights(weights);
  return modelDimensions.map(([key,label,desc], i) => ({
    key,
    label,
    desc,
    score: Number(building[key] ?? 0),
    weight: nw[i] || 0,
    contribution: Number(building[key] ?? 0) * (nw[i] || 0) / 100
  })).sort((a,b)=>b.contribution-a.contribution);
}
function factorInterpretation(scoreValue) {
  if (scoreValue >= 80) return 'Strong support';
  if (scoreValue >= 65) return 'Moderate support';
  if (scoreValue >= 50) return 'Needs verification';
  return 'Potential constraint';
}
function mainPlanningImplication(rows) {
  if (!rows.length) return 'No buildings match the current filters, so the screening assumptions should be broadened or checked.';
  const top = topRankedBuilding(rows);
  if (highPotentialBuildings(rows).length) return 'Prioritise detailed feasibility review for high-scoring candidates, especially ' + top.name + ', before any statutory or lease conclusions are drawn.';
  return 'The current filter set does not identify a high-potential pilot candidate; consider revisiting assumptions, data quality or policy support requirements.';
}
function ownershipRisk(building) {
  return building.ownership === 'Multiple owners' ? 'High risk' : building.ownership === 'Single owner' || building.ownership === 'Corporate owner' ? 'Partial' : 'Unknown';
}
function statusBadge(status) {
  const cls = status.toLowerCase().replaceAll(' ', '-');
  return '<span class="status-badge '+h(cls)+'">'+h(status)+'</span>';
}
function regulatoryChecklist(building) {
  const isResidential = building.zoning.includes('Residential');
  const isBusiness = building.zoning.includes('Other Specified Uses');
  return [
    ['OZP / zoning check', isResidential ? 'Complete' : isBusiness ? 'Partial' : 'High risk', building.zoning],
    ['Town Planning Board route: S.16 or S.12A may be required', isResidential ? 'Partial' : 'Pending', isResidential ? 'Residential zoning indicated, but route still requires confirmation.' : 'Planning application or rezoning route may be required.'],
    ['Land lease review', 'Pending', 'Lease conditions are not verified in the sample dataset.'],
    ['Lease modification / waiver / premium uncertainty', isResidential ? 'Partial' : 'Unknown', building.constraints],
    ['Building Ordinance compliance', building.age > 55 ? 'High risk' : 'Pending', building.age + ' years old'],
    ['Fire safety and means of escape', building.safety >= 70 ? 'Partial' : 'High risk', 'Indicative safety score ' + building.safety],
    ['Natural lighting and ventilation', building.design >= 70 ? 'Partial' : 'Pending', 'Indicative design adaptability score ' + building.design],
    ['Barrier-free access', building.services >= 70 ? 'Partial' : 'Pending', 'Services and vertical circulation require audit.'],
    ['Environmental compatibility', building.risk === 'Low' ? 'Partial' : building.risk === 'High' ? 'High risk' : 'Pending', building.risk + ' environmental risk'],
    ['Noise / air quality / industrial interface screening', building.compatibility === 'High' ? 'Partial' : building.compatibility === 'Low' ? 'High risk' : 'Pending', building.compatibility + ' residential compatibility'],
    ['Cost feasibility study', building.economic >= 70 ? 'Partial' : 'Pending', 'Indicative economic viability score ' + building.economic]
  ];
}
function nextStepFor(building) {
  if (building.score >= 70) return 'Conduct a detailed feasibility and regulatory pathway review, including OZP, lease, fire safety, environmental and cost checks.';
  if (building.score >= 55) return 'Clarify the main weak factors through site inspection and ownership, lease and building-services verification.';
  return 'Treat as a lower-priority candidate unless policy support, ownership assembly or technical constraints materially change.';
}
function baselineRows() {
  const f = state.baselineFilters;
  return scored().filter(b =>
    (f.district === 'All' || b.district === f.district) &&
    (f.zoning === 'All' || b.zoning === f.zoning) &&
    (f.ownership === 'All' || b.ownership === f.ownership) &&
    (f.risk === 'All' || b.risk === f.risk) &&
    b.storeys >= f.minStoreys &&
    b.score >= f.minScore
  );
}
function averageBaselineBuilding(rows, modelDimensions = activeDimensions()) {
  if (!rows.length) return null;
  const average = {
    id: 'AVG',
    name: 'Baseline average',
    category: 'Average',
    score: Math.round(mean(rows.map(b => b.score)))
  };
  modelDimensions.forEach(([key]) => {
    average[key] = Math.round(mean(rows.map(b => b[key])));
  });
  return average;
}
function baselineDescription(rows) {
  const f = state.baselineFilters;
  const parts = [];
  if (f.district !== 'All') parts.push(f.district);
  if (f.zoning !== 'All') parts.push(f.zoning);
  if (f.ownership !== 'All') parts.push(f.ownership);
  if (f.risk !== 'All') parts.push(f.risk + ' environmental risk');
  if (f.minStoreys > 0) parts.push(f.minStoreys + '+ storeys');
  if (f.minScore > 0) parts.push(f.minScore + '+ score');
  return (parts.length ? parts.join(', ') : 'All buildings') + ' | ' + rows.length + ' building' + (rows.length === 1 ? '' : 's');
}
function sortedRows(rows) { const {key, dir} = state.sort; const sign = dir === 'asc' ? 1 : -1; return rows.slice().sort((a,b) => { const av = a[key]; const bv = b[key]; if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sign; return String(av).localeCompare(String(bv)) * sign; }); }
function options(id, values) { const el = document.getElementById(id); el.innerHTML = ['All', ...new Set(values)].sort((a,b)=> a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)).map(v => '<option>'+h(v)+'</option>').join(''); }
function bar(parent, label, value, max = 100, color = '#0f766e') { parent.insertAdjacentHTML('beforeend', '<div class="bar-row"><span>'+h(label)+'</span><div class="bar-track"><div class="bar-fill" style="width:'+Math.max(2,value/max*100)+'%;background:'+color+'"></div></div><strong>'+h(value)+'</strong></div>'); }
function empty(parent, message) { parent.innerHTML = '<div class="empty-state">'+h(message)+'</div>'; }
function setSurveyInProgress() {
  state.surveySubmitted = false;
  state.surveyResultsUnlocked = false;
  updateSurveyResultAccess();
}
function activateTab(tabName) {
  if (tabName === 'survey-results' && !state.surveyResultsUnlocked) return;
  document.querySelectorAll('.tab,.tab-panel').forEach(x => x.classList.remove('active'));
  const tab = document.querySelector('.tab[data-tab="'+tabName+'"]');
  const panel = document.getElementById(tabName);
  if (!tab || !panel) return;
  tab.classList.add('active');
  panel.classList.add('active');
  if (tabName === 'map' && suitabilityMap) setTimeout(() => {
    suitabilityMap.invalidateSize();
    updateMainOzpOverlay();
  }, 0);
}
function updateSurveyResultAccess() {
  const resultTab = document.querySelector('.tab[data-tab="survey-results"]');
  if (!resultTab) return;
  const modeHidden = resultTab.dataset.mode !== state.viewMode;
  resultTab.hidden = modeHidden || !state.surveyResultsUnlocked;
  resultTab.disabled = !state.surveyResultsUnlocked;
  resultTab.setAttribute('aria-hidden', String(!state.surveyResultsUnlocked));
  if (!state.surveyResultsUnlocked && document.getElementById('survey-results')?.classList.contains('active')) activateTab('survey');
}
function updateViewModeTabs() {
  document.querySelectorAll('[data-view-mode]').forEach(button => {
    button.classList.toggle('active', button.dataset.viewMode === state.viewMode);
  });
  document.querySelectorAll('.tab[data-mode]').forEach(tab => {
    tab.hidden = tab.dataset.mode !== state.viewMode;
  });
  updateSurveyResultAccess();
  const activeTab = document.querySelector('.tab.active');
  if (!activeTab || activeTab.hidden) activateTab(state.viewMode === 'decision' ? 'overview' : 'factors');
}
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
  const baselineSet = baselineRows();
  const baselineAverage = averageBaselineBuilding(baselineSet, modelDimensions);
  const series = [selected, ...compareBuildings].slice(0, 3).concat(baselineAverage ? [baselineAverage] : []);
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
    return '<polygon class="radar-area '+(building.id === 'AVG' ? 'radar-baseline' : 'radar-series-'+seriesIndex)+'" style="--series-color:'+color+'" points="'+points+'" />' + dots;
  }).join('');
  const legend = series.map((building, i) => '<span><i style="background:'+radarPalette[i]+'"></i>'+h(building.id === 'AVG' ? 'Average baseline' : building.id + ' ' + building.name)+' <strong>'+h(building.score)+'</strong></span>').join('');
  document.getElementById('radarChart').innerHTML =
    '<div class="radar-summary"><span>Selected building</span><strong>'+h(selected.score)+'</strong><em>'+h(selected.name)+' - '+h(categoryLabel(selected.category))+'</em></div>' +
    '<div class="radar-summary baseline-summary"><span>Baseline average</span><strong>'+h(baselineAverage ? baselineAverage.score : '- ')+'</strong><em>'+h(baselineDescription(baselineSet))+'</em></div>' +
    '<div class="radar-legend">'+legend+'</div>' +
    '<svg class="radar-svg" viewBox="-220 -205 440 430" role="img" aria-label="Radar chart for '+h(selected.name)+' residential conversion suitability">' +
    rings + axes + shapes + labels +
    '</svg>' +
    '<div class="radar-note">The grey polygon is the average profile for buildings matching the baseline conditions. Use the filters above to compare against a more specific peer group.</div>';
}
function renderExecutiveInsight(rows) {
  const el = document.getElementById('executiveInsight');
  if (!el) return;
  const high = highPotentialBuildings(rows);
  const avg = averageScore(rows);
  const top = topRankedBuilding(rows);
  el.innerHTML = top
    ? '<h2>Key Planning Insight</h2><p>The current model identifies <strong>'+h(high.length)+'</strong> high-potential industrial building'+(high.length === 1 ? '' : 's')+' for residential adaptive reuse among the visible records. The strongest candidates combine good transport accessibility, compatible planning context, manageable ownership structure and strong housing demand.</p><div class="insight-metrics"><span><em>Average indicative score</em><strong>'+h(avg)+'</strong></span><span><em>Top-ranked building</em><strong>'+h(top.name)+'</strong></span></div><p><strong>Main planning implication:</strong> '+h(mainPlanningImplication(rows))+'</p><small>Scores are indicative and intended for early-stage screening only.</small>'
    : '<h2>Key Planning Insight</h2><p>No buildings match the current filters. Broaden the filters or check the input assumptions before drawing planning conclusions.</p><small>Scores are indicative and intended for early-stage screening only.</small>';
}
function render() {
  const rows = filtered();
  const all = scored();
  const selected = all.find(b => b.id === state.selected) || all[0];
  renderExecutiveInsight(rows);
  renderFilterSummary(rows.length, all.length);
  document.getElementById('kpis').innerHTML = [
    ['Buildings', all.length],
    ['Visible now', rows.length],
    ['Average indicative score', rows.length ? averageScore(rows) : 'No data'],
    ['GFA Gross Floor Area', fmt.format(rows.reduce((s,b)=>s+b.floorArea,0))+' sqm'],
    ['High potential', highPotentialBuildings(rows).length]
  ].map(([label,value]) => '<div class="kpi"><span>'+h(label)+'</span><strong>'+h(value)+'</strong></div>').join('');
  const cat = document.getElementById('categoryChart'); cat.innerHTML = '';
  ['High','Medium','Lower conversion priority'].forEach(c => bar(cat, categoryLabel(c), rows.filter(b=>b.category===c).length, rows.length || 1, categoryColor[c]));
  const district = document.getElementById('districtChart'); district.innerHTML = '';
  [...new Set(rows.map(b=>b.district))].map(d => {
    const ds = rows.filter(b=>b.district===d);
    return [d, Math.round(ds.reduce((s,b)=>s+b.score,0)/ds.length)];
  }).sort((a,b)=>b[1]-a[1]).forEach(([d,v]) => bar(district, d, v, 100, '#2563eb'));
  if (!rows.length) empty(district, 'No district results match the current filters.');
  const top = document.getElementById('topChart'); top.innerHTML = '';
  if (rows.length) rows.slice(0,8).forEach(b => bar(top, b.id + ' ' + b.name, b.score, 100, categoryColor[b.category]));
  else empty(top, 'No buildings match the current filters.');
  renderMap(rows, selected);
  renderProfile(selected);
  renderTable(rows);
  renderWeights(selected);
  renderScenarios();
  renderResearchWorkflow();
  updateViewModeTabs();
}
function renderResearchWorkflow() {
  renderFactorsLibrary();
  renderSurveyCriteria();
  renderStakeholderFactors();
  renderSurveyResults();
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
    criticalFactors.map(factor => '<tr><td><input class="row-check" data-factor-include="'+h(factor.id)+'" type="checkbox" '+(factor.include_in_survey ? 'checked' : '')+' /></td><td>'+h(dimensionLabel(factor.dimension))+'</td><td><strong>'+explainTerms(factor.factor_name)+'</strong></td><td>'+explainTerms(factor.description)+'</td><td>'+explainTerms(factor.literature_source)+'</td><td>'+explainTerms(factor.data_indicator)+'</td><td>'+explainTerms(factor.scoring_method)+'</td></tr>').join('') +
    '</tbody>';
  document.querySelectorAll('[data-factor-include]').forEach(input => input.onchange = e => {
    const factor = criticalFactors.find(item => item.id === e.target.dataset.factorInclude);
    if (factor) factor.include_in_survey = e.target.checked;
    renderResearchWorkflow();
  });
}
function renderQuestionnaireFactorTable(pool) {
  const byDimension = researchDimensions.map(([key,label]) => ({
    key,
    label,
    factors: pool.filter(factor => factor.dimension === key)
  }));
  const maxRows = Math.max(...byDimension.map(group => group.factors.length), 0);
  const rows = Array.from({ length: maxRows }).map((_, rowIndex) =>
    '<tr>'+byDimension.map(group => {
      const factor = group.factors[rowIndex];
      if (!factor) return '<td class="empty-factor-cell"></td>';
      const isSelected = state.surveySelectedFactorIds.includes(factor.id);
      const isDisabled = !isSelected && state.surveySelectedFactorIds.length >= 10;
      return '<td><button data-questionnaire-factor="'+h(factor.id)+'" type="button" class="'+(isSelected ? 'selected' : '')+'" '+(isDisabled ? 'disabled' : '')+'><strong>'+explainTerms(factor.factor_name)+'</strong><span>'+h(surveyExplanation(factor))+'</span></button></td>';
    }).join('')+'</tr>'
  ).join('');
  return '<div class="factor-selection-panel"><div class="selection-heading"><strong>Select up to 10 key factors</strong><span>'+h(state.surveySelectedFactorIds.length)+'/10 selected</span></div><p class="map-note">Choose only the factors you think are important. Sliders will appear below for selected factors only.</p><div class="factor-matrix-wrap"><table class="factor-matrix"><thead><tr>'+byDimension.map(group => '<th>'+h(group.label)+'</th>').join('')+'</tr></thead><tbody>'+rows+'</tbody></table></div></div>';
}
function renderSurveyCriteria() {
  cleanQuestionnaireSelection();
  const pool = questionnaireFactorPool();
  const selected = selectedQuestionnaireFactors();
  const ownershipQuestion = state.participantGroup === 'Industrial Unit Owner'
    ? '<label>Ownership type of industrial unit<select id="industrialOwnershipType"><option value="">Select ownership type</option><option>Sole Ownership of Entire Building</option><option>Multi-ownership Buildings</option></select></label>'
    : '';
  document.getElementById('surveyCriteriaList').innerHTML =
    '<div class="criteria-card participant-card"><header><strong>Participant profile</strong><span>Required</span></header><label>Stakeholder group<select id="surveyParticipantGroup"><option value="">Select stakeholder group</option>'+surveyStakeholderGroups.map(group => '<option>'+h(group)+'</option>').join('')+'</select></label>'+ownershipQuestion+'</div>' +
    renderQuestionnaireFactorTable(pool) +
    (selected.length ? selected.map(factor =>
    '<div class="criteria-card survey-slider-card"><header><strong>'+explainTerms(factor.factor_name)+'</strong><span>'+h(dimensionLabel(factor.dimension))+'</span></header><p class="factor-explanation">'+explainTerms(surveyExplanation(factor))+'</p><p class="survey-prompt"><strong>What participants rate:</strong> '+explainTerms(surveyQuestion(factor))+'</p><label class="slider-question"><span>Importance score <strong id="surveyValue-'+h(factor.id)+'">'+h(surveyRating(factor.id))+'</strong></span><input data-survey-rating="'+h(factor.id)+'" type="range" min="0" max="100" value="'+h(surveyRating(factor.id))+'" /></label><div class="slider-scale"><span>Not important</span><span>Moderately important</span><span>Very important</span></div></div>'
  ).join('') : '<div class="empty-state">Select factors from the table above to create importance sliders.</div>');
  const participantGroup = document.getElementById('surveyParticipantGroup');
  participantGroup.value = state.participantGroup;
  participantGroup.onchange = e => {
    state.participantGroup = e.target.value;
    if (state.participantGroup !== 'Industrial Unit Owner') state.industrialOwnershipType = '';
    setSurveyInProgress();
    renderSurveyCriteria();
  };
  const industrialOwnershipType = document.getElementById('industrialOwnershipType');
  if (industrialOwnershipType) {
    industrialOwnershipType.value = state.industrialOwnershipType;
    industrialOwnershipType.onchange = e => {
      state.industrialOwnershipType = e.target.value;
      setSurveyInProgress();
      updateSurveySummary();
    };
  }
  document.querySelectorAll('[data-survey-rating]').forEach(input => input.oninput = e => {
    const id = e.target.dataset.surveyRating;
    state.surveyRatings[id] = Number(e.target.value);
    setSurveyInProgress();
    const value = document.getElementById('surveyValue-' + id);
    if (value) value.textContent = e.target.value;
    updateSurveySummary();
  });
  document.querySelectorAll('[data-questionnaire-factor]').forEach(button => button.onclick = e => {
    toggleQuestionnaireFactor(e.currentTarget.dataset.questionnaireFactor);
    renderSurveyCriteria();
  });
  const optionsHtml = groupedFactorOptions(selected);
  const ranked = state.surveyTopFactors.map((factorId, index) =>
    '<label>Rank '+(index + 1)+'<select data-top-factor="'+index+'">'+optionsHtml+'</select></label>'
  ).join('');
  const reuseOutcomes = reuseOutcomeOptions.map(option =>
    '<label><input data-reuse-outcome="'+h(option)+'" type="checkbox" '+(state.preferredReuseOutcomes.includes(option) ? 'checked' : '')+' /> '+h(option)+'</label>'
  ).join('');
  document.getElementById('surveyPreview').innerHTML =
    '<div class="survey-banner"><strong>'+h(selected.length)+'</strong><span>participant-selected factors</span></div>' +
    '<div class="ranked-selects">'+ranked+'</div>' +
    '<div class="reuse-outcome-box"><h3>Preferred Reuse Outcome</h3><div class="reuse-options">'+reuseOutcomes+'</div></div>' +
    '<button id="submitSurvey" class="primary-button" type="button">Submit survey</button>' +
    '<div id="surveySubmitStatus" class="survey-submit-status" aria-live="polite"></div>';
  document.querySelectorAll('[data-top-factor]').forEach(select => {
    select.value = state.surveyTopFactors[Number(select.dataset.topFactor)] || '';
    select.onchange = e => {
      state.surveyTopFactors[Number(e.target.dataset.topFactor)] = e.target.value;
      setSurveyInProgress();
      updateSurveySummary();
    };
  });
  document.querySelectorAll('[data-reuse-outcome]').forEach(input => input.onchange = e => {
    const option = e.target.dataset.reuseOutcome;
    state.preferredReuseOutcomes = e.target.checked
      ? [...new Set([...state.preferredReuseOutcomes, option])]
      : state.preferredReuseOutcomes.filter(item => item !== option);
    setSurveyInProgress();
    updateSurveySummary();
  });
  document.getElementById('submitSurvey').onclick = submitSurvey;
  updateSurveySummary();
}
function updateSurveySummary() {
  const status = document.getElementById('surveySubmitStatus');
  if (!status) return;
  const selected = selectedQuestionnaireFactors();
  const rated = selected.filter(factor => state.surveyRatings[factor.id] !== undefined).length;
  const topIds = selectedTopFactorIds();
  const duplicateCount = topIds.length - new Set(topIds).size;
  const missingParticipant = !state.participantGroup || (state.participantGroup === 'Industrial Unit Owner' && !state.industrialOwnershipType);
  const missingFactors = selected.length < 3;
  const reuseOutcomes = selectedReuseOutcomes();
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
    ? '<strong>Survey submitted</strong><span>'+rated+' slider responses saved. Top 3 ranking recorded.</span><span>'+h(state.databaseStatus)+'</span><span>Stakeholder group: '+h(state.participantGroup)+(state.industrialOwnershipType ? ' - '+h(state.industrialOwnershipType) : '')+'</span><span>Preferred reuse outcome: '+h(reuseOutcomes.length ? reuseOutcomes.join(', ') : 'None selected')+'</span><button id="seeSurveyResults" class="primary-button" type="button">See results</button>'
    : '<strong>Survey in progress</strong><span>'+rated+' of '+selected.length+' selected-factor sliders adjusted. Select 3 to 10 key factors, complete participant profile, then rank three selected factors before submitting.</span><span>'+h(reuseOutcomes.length)+' preferred reuse outcome'+(reuseOutcomes.length === 1 ? '' : 's')+' selected.</span><span>'+h(state.databaseStatus)+'</span>';
  status.className = 'survey-submit-status' + (state.surveySubmitted ? ' submitted' : '') + (duplicateCount || missingParticipant || missingFactors ? ' has-error' : '');
  status.innerHTML = message + (missingParticipant ? '<span>'+h(participantMessage)+'</span>' : '') + (missingFactors ? '<span>Please select at least three key factors from the table.</span>' : '') + (duplicateCount ? '<span>Each top-3 rank must use a different selected factor.</span>' : '') + (rankedNames ? '<ol>'+rankedNames+'</ol>' : '');
  const seeResultsButton = document.getElementById('seeSurveyResults');
  if (seeResultsButton) seeResultsButton.onclick = () => activateTab('survey-results');
}
async function submitSurvey() {
  const topIds = selectedTopFactorIds();
  const status = document.getElementById('surveySubmitStatus');
  const missingParticipant = !state.participantGroup || (state.participantGroup === 'Industrial Unit Owner' && !state.industrialOwnershipType);
  const selected = selectedQuestionnaireFactors();
  if (missingParticipant || selected.length < 3 || topIds.length !== 3 || new Set(topIds).size !== 3) {
    setSurveyInProgress();
    updateSurveySummary();
    if (status) status.insertAdjacentHTML('beforeend', '<span>Please select at least three factors, complete the participant profile and choose three different selected factors for Rank 1, Rank 2 and Rank 3.</span>');
    return;
  }
  selected.forEach(factor => {
    if (state.surveyRatings[factor.id] === undefined) state.surveyRatings[factor.id] = surveyRating(factor.id);
  });
  const submitButton = document.getElementById('submitSurvey');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
  }
  try {
    await saveSurveySubmission(surveySubmissionPayload());
    state.surveySubmitted = true;
    state.surveyResultsUnlocked = true;
    state.weights = finalResearchWeights();
    state.researchWeights = state.weights.slice();
    updateSurveyResultAccess();
    renderSurveyResults();
    updateSurveySummary();
  } catch (error) {
    console.error(error);
    state.surveySubmitted = false;
    state.databaseStatus = 'Survey could not be saved to Supabase. Check the browser console and database policies.';
    updateSurveySummary();
    if (status) status.insertAdjacentHTML('beforeend', '<span>Save failed: '+h(error.message || error)+'</span>');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit survey';
    }
  }
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
function renderSurveyResults() {
  const filter = state.surveyResultGroup;
  const rows = surveyResultRows(filter);
  const scoredRows = rows.filter(row => row.score !== null);
  const respondentTotal = surveyRespondentTotal(filter);
  const averageScore = scoredRows.length ? Math.round(mean(scoredRows.map(row => row.score))) : 0;
  const topFactor = scoredRows[0];
  const kpiEl = document.getElementById('surveyResultKpis');
  if (!kpiEl) return;
  document.getElementById('surveyResultKpis').innerHTML = [
    ['Survey responses', respondentTotal],
    ['Factors scored', scoredRows.length + ' of ' + rows.length],
    ['Average factor score', scoredRows.length ? averageScore + '/100' : 'No data'],
    ['Data source', shouldUseSubmissionData() ? 'Supabase submissions' : 'Local pilot data']
  ].map(([label,value]) => '<div class="kpi"><span>'+h(label)+'</span><strong>'+h(value)+'</strong></div>').join('');
  document.getElementById('surveyResultKpis').insertAdjacentHTML('beforeend', renderStakeholderDistributionCard(filter, true));
  const factorChart = document.getElementById('surveyFactorChart');
  factorChart.innerHTML = '';
  if (scoredRows.length) scoredRows.forEach(row => bar(factorChart, row.factor_name, row.score, 100, '#0f766e'));
  else empty(factorChart, 'No survey responses recorded for this stakeholder group yet.');
  bindSurveyResultGroupButtons();
  document.getElementById('surveyResultMeta').textContent = (topFactor ? 'Top factor: ' + topFactor.factor_name + ' (' + topFactor.score + '/100)' : 'No scored factors') + ' | Filter: ' + (filter === 'All' ? 'All stakeholder groups' : stakeholderGroupLabel(filter));
  document.getElementById('surveyResultTable').innerHTML =
    '<thead><tr><th>Rank</th><th>Dimension</th><th>Factor</th><th>Importance score</th><th>Responses</th><th>Interpretation</th></tr></thead><tbody>' +
    rows.map((row, index) => {
      const scoreText = row.score === null ? 'No data' : row.score + '/100';
      const interpretation = row.score === null ? 'Awaiting stakeholder responses' : row.score >= 85 ? 'Very high priority' : row.score >= 75 ? 'High priority' : row.score >= 65 ? 'Moderate priority' : 'Lower relative priority';
      return '<tr><td>'+h(row.score === null ? '-' : index + 1)+'</td><td>'+h(dimensionLabel(row.dimension))+'</td><td><strong>'+h(row.factor_name)+'</strong></td><td>'+h(scoreText)+'</td><td>'+h(row.responseCount)+'</td><td>'+h(interpretation)+'</td></tr>';
    }).join('') + '</tbody>';
}
function renderStakeholderDistributionCard(filter, compact = false) {
  const maxCount = Math.max(1, ...stakeholderWeightGroups.map(group => surveyGroupResponseCount(group.key)));
  const activeLabel = filter === 'All' ? 'All stakeholder groups' : stakeholderGroupLabel(filter);
  return '<div class="'+(compact ? 'kpi stakeholder-distribution-kpi' : 'stakeholder-distribution-card')+'"><div class="distribution-heading"><span>Stakeholder groups</span><button data-survey-result-group="All" type="button" class="'+(filter === 'All' ? 'active' : '')+'">All</button></div><strong>'+h(activeLabel)+'</strong><div class="mini-distribution-bars">' +
    stakeholderWeightGroups.map(group => {
      const count = surveyGroupResponseCount(group.key);
      const isActive = filter === 'All' || filter === group.key;
      return '<button data-survey-result-group="'+h(group.key)+'" type="button" class="'+(isActive ? 'active' : '')+'"><span>'+h(group.label)+'</span><div><i style="width:'+Math.max(2, count / maxCount * 100)+'%"></i></div><em>'+h(count)+'</em></button>';
    }).join('') + '</div></div>';
}
function bindSurveyResultGroupButtons() {
  document.querySelectorAll('[data-survey-result-group]').forEach(button => button.onclick = e => {
    state.surveyResultGroup = e.currentTarget.dataset.surveyResultGroup;
    renderSurveyResults();
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
      suitabilityMap.createPane('ozpPane');
      suitabilityMap.getPane('ozpPane').style.zIndex = 350;
      suitabilityMap.getPane('ozpPane').style.pointerEvents = 'none';
      mapLayerGroups = {
        catchment: L.layerGroup().addTo(suitabilityMap),
        buildings: L.layerGroup().addTo(suitabilityMap),
        facilities: L.layerGroup().addTo(suitabilityMap),
        mtr: L.layerGroup().addTo(suitabilityMap)
      };
      suitabilityMap.on('moveend zoomend resize', updateMainOzpOverlay);
    }
    renderMapLayerControls(el);
    Object.values(mapLayerGroups).forEach(group => group.clearLayers());
    if (state.mapLayers.catchment) {
      L.circle([selected.lat, selected.lng], {
        radius: 500,
        color: '#2563eb',
        weight: 2,
        fillColor: '#2563eb',
        fillOpacity: 0.08
      }).bindPopup('<strong>500 m community catchment</strong>'+h(selected.name)+'<br>'+h(catchment.length)+' amenities and stations identified').addTo(mapLayerGroups.catchment);
    }
    if (state.mapLayers.buildings) {
      rows.forEach(b => {
        const marker = L.circleMarker([b.lat, b.lng], {
          radius: b.id === selected.id ? 11 : Math.max(7, Math.min(14, b.floorArea / 1800)),
          color: '#ffffff',
          weight: b.id === selected.id ? 3 : 2,
          fillColor: categoryColor[b.category],
          fillOpacity: 0.88
        }).bindPopup('<strong>'+h(b.name)+'</strong>'+h(b.district)+'<br>Indicative score: '+h(b.score)+'<br>'+h(categoryLabel(b.category)));
        marker.on('click', () => { state.selected = b.id; render(); });
        marker.addTo(mapLayerGroups.buildings);
        if (b.id === selected.id) marker.openPopup();
      });
    }
    if (state.mapLayers.facilities) {
      catchment.filter(item => item.type !== 'MTR').forEach(f => {
        L.circleMarker([f.lat, f.lng], {
          radius: 6,
          color: '#ffffff',
          weight: 2,
          fillColor: facilityColor[f.type],
          fillOpacity: 0.95
        }).bindPopup('<strong>'+h(f.name)+'</strong>'+h(f.type)+'<br>'+h(f.distance)+' m from selected building').addTo(mapLayerGroups.facilities);
      });
    }
    if (state.mapLayers.mtr) {
      catchment.filter(item => item.type === 'MTR').forEach(station => {
        L.circleMarker([station.lat, station.lng], {
          radius: 7,
          color: '#ffffff',
          weight: 2,
          fillColor: facilityColor.MTR,
          fillOpacity: 0.95
        }).bindPopup('<strong>'+h(station.name)+'</strong>MTR station<br>'+h(station.distance)+' m from selected building').addTo(mapLayerGroups.mtr);
      });
    }
    suitabilityMap.setView([selected.lat, selected.lng], 15);
    setTimeout(() => {
      suitabilityMap.invalidateSize();
      updateMainOzpOverlay();
    }, 0);
    if (!document.querySelector('#mapPanel .map-legend')) {
      el.insertAdjacentHTML('beforeend', '<div class="map-legend">'+['High','Medium','Lower conversion priority'].map(c => '<span><i style="background:'+categoryColor[c]+'"></i>'+h(categoryLabel(c))+'</span>').join('')+'<span><i style="background:'+facilityColor.Hospital+'"></i>Hospital</span><span><i style="background:'+facilityColor['Shopping mall']+'"></i>Shopping mall</span><span><i style="background:'+facilityColor['Wet market']+'"></i>Wet market</span><span><i style="background:'+facilityColor.MTR+'"></i>MTR</span><span><i class="radius-key"></i>500 m</span><span><i class="ozp-key"></i>'+explainTerms('OZP')+' residential</span></div>');
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
    m.title = b.name + ': indicative score ' + b.score;
    m.setAttribute('aria-label', b.name + ', indicative suitability score ' + b.score);
    m.onclick = () => { state.selected = b.id; render(); };
    el.appendChild(m);
  });
  if (!rows.length) el.insertAdjacentHTML('beforeend', '<div class="empty-state">No mapped buildings match the current filters.</div>');
  el.insertAdjacentHTML('beforeend', '<div class="map-legend">'+['High','Medium','Lower conversion priority'].map(c => '<span><i style="background:'+categoryColor[c]+'"></i>'+h(categoryLabel(c))+'</span>').join('')+'</div>');
}
function renderMapLayerControls(el) {
  if (!document.querySelector('#mapPanel .layer-control')) {
    const controls = [
      ['buildings', 'Buildings'],
      ['catchment', '500 m catchment'],
      ['facilities', 'Community facilities'],
      ['mtr', 'MTR stations'],
      ['ozp', explainTerms('OZP')+' residential zones']
    ];
    el.insertAdjacentHTML('beforeend', '<div class="layer-control"><strong>Map layers</strong>'+controls.map(([key,label]) => {
      const labelHtml = key === 'ozp' ? label : h(label);
      return '<label><input data-map-layer="'+h(key)+'" type="checkbox" '+(state.mapLayers[key] ? 'checked' : '')+' />'+labelHtml+'</label>';
    }).join('')+'</div>');
  }
  document.querySelectorAll('[data-map-layer]').forEach(input => {
    input.checked = !!state.mapLayers[input.dataset.mapLayer];
    input.onchange = e => {
      state.mapLayers[e.target.dataset.mapLayer] = e.target.checked;
      render();
    };
  });
}
function ozpExportUrl(map) {
  const bounds = map.getBounds();
  const size = map.getSize();
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
function updateMainOzpOverlay() {
  if (!suitabilityMap || !window.L) return;
  if (!state.mapLayers.ozp) {
    if (mainOzpOverlay) {
      suitabilityMap.removeLayer(mainOzpOverlay);
      mainOzpOverlay = null;
    }
    return;
  }
  const bounds = suitabilityMap.getBounds();
  const image = L.imageOverlay(ozpExportUrl(suitabilityMap), bounds, {
    pane: 'ozpPane',
    opacity: 0.58,
    attribution: 'Planning Data from Town Planning Board'
  });
  image.on('load', () => {
    if (mainOzpOverlay) suitabilityMap.removeLayer(mainOzpOverlay);
    mainOzpOverlay = image;
  });
  image.on('error', () => {
    if (!document.querySelector('#mapPanel .ozp-warning')) {
      document.getElementById('mapPanel').insertAdjacentHTML('beforeend', '<div class="empty-state ozp-warning">Official OZP residential zoning layer is temporarily unavailable.</div>');
    }
  });
  image.addTo(suitabilityMap);
}
function renderProfile(b) {
  const catchment = catchmentFor(b);
  const summary = catchmentSummary(catchment);
  const nearestStation = catchment.find(item => item.type === 'MTR');
  const factors = factorContributionRows(b);
  const strongest = factors.slice(0, 3);
  const weakest = factors.slice().sort((a,b)=>a.contribution-b.contribution).slice(0, 3);
  const mainStrength = strongest[0];
  const mainConstraint = weakest[0];
  const factorTable = items => '<div class="score-factor-list">'+items.map(item => '<div><span>'+h(item.label)+'</span><strong>'+h(item.score)+'</strong><em>'+h(Math.round(item.weight))+'% weight · '+h(factorInterpretation(item.score))+'</em></div>').join('')+'</div>';
  const checklistRows = regulatoryChecklist(b).map(([item,status,note]) => '<tr><td>'+h(item)+'</td><td>'+statusBadge(status)+'</td><td>'+h(note)+'</td></tr>').join('');
  const catchmentList = catchment.length
    ? '<ul class="catchment-list">'+catchment.map(item => '<li><span class="catchment-dot" style="background:'+facilityColor[item.type]+'"></span><strong>'+h(item.name)+'</strong><em>'+h(item.type)+' · '+h(item.distance)+' m</em></li>').join('')+'</ul>'
    : '<p class="muted-note">No listed community facilities or MTR stations fall inside the 500 m catchment.</p>';
  document.getElementById('buildingProfile').innerHTML =
    '<h2>'+h(b.name)+'</h2><p>'+h(b.address)+'</p><span class="badge" style="background:'+categoryColor[b.category]+'">'+h(categoryLabel(b.category))+'</span><strong style="float:right;font-size:34px">'+h(b.score)+'</strong>' +
    '<dl><div><dt>District</dt><dd>'+h(b.district)+'</dd></div><div><dt>Age</dt><dd>'+h(b.age)+' yrs</dd></div><div><dt>Zoning</dt><dd>'+h(b.zoning)+'</dd></div><div><dt>Ownership</dt><dd>'+h(b.ownership)+'</dd></div><div><dt>Vacancy</dt><dd>'+h(b.vacancy)+'%</dd></div><div><dt>Storeys</dt><dd>'+h(b.storeys)+'</dd></div><div><dt>Building height</dt><dd>'+h(b.height)+' m</dd></div><div><dt>MTR distance</dt><dd>'+h(b.mtr)+' m</dd></div></dl>' +
    '<section class="score-explain"><h3>Why this score?</h3><p>This building has an <strong>Indicative Suitability Score of '+h(b.score)+'/100</strong>. It scores strongly because of '+h(mainStrength.label.toLowerCase())+', while its main constraint is '+h(mainConstraint.label.toLowerCase())+'. This is a screening result only and does not represent statutory approval.</p><h4>Top 3 strongest factors</h4>'+factorTable(strongest)+'<h4>Bottom 3 weakest factors</h4>'+factorTable(weakest)+'<dl><div><dt>Main strength</dt><dd>'+h(mainStrength.label)+' ('+h(mainStrength.score)+')</dd></div><div><dt>Main constraint</dt><dd>'+h(mainConstraint.label)+' ('+h(mainConstraint.score)+')</dd></div></dl><p><strong>Recommended next step:</strong> '+h(nextStepFor(b))+'</p></section>' +
    '<section class="pathway-checklist"><h3>Regulatory Pathway Checklist</h3><p class="muted-note">This checklist is indicative and does not replace statutory planning, lands, building control or environmental review.</p><div class="table-wrap compact-table"><table><thead><tr><th>Item</th><th>Status</th><th>Basis</th></tr></thead><tbody>'+checklistRows+'</tbody></table></div></section>' +
    '<h3>500 m community catchment</h3><p class="muted-note">Amenities shown on the GIS map inside the selected building radius.</p><dl>'+summary.map(([label,value]) => '<div><dt>'+h(label)+'</dt><dd>'+h(value)+'</dd></div>').join('')+'<div><dt>Nearest MTR</dt><dd>'+h(nearestStation ? nearestStation.name + ' (' + nearestStation.distance + ' m)' : 'None within 500 m')+'</dd></div></dl>'+catchmentList +
    '<h3>Main constraints</h3><p>'+h(b.constraints)+'</p><h3>Main opportunities</h3><p>'+h(b.opportunities)+'</p>';
}
function renderTable(rows) {
  const factorColumns = activeDimensions().map(([key,label]) => [key, label]);
  const columns = [
    ['id','ID'], ['name','Building'], ['district','District'], ['year','Year'], ['age','Age'], ['zoning','Zoning'], ['ownership','Ownership'], ['vacancy','Vacancy'], ['mtr','MTR'], ...factorColumns, ['score','Indicative Suitability Score'], ['category','Category']
  ];
  const ordered = sortedRows(rows);
  document.getElementById('tableMeta').textContent = ordered.length + ' ranked records | ' + activeDimensions().length + '-dimension critical factors model';
  renderComparisonRecommendation(ordered);
  document.getElementById('comparisonTable').innerHTML =
    '<thead><tr>'+columns.map(([key,label]) => '<th><button data-sort="'+key+'">'+h(label)+(state.sort.key === key ? (state.sort.dir === 'asc' ? ' ^' : ' v') : '')+'</button></th>').join('')+'</tr></thead><tbody>'+
    ordered.map(b => {
      const cells = columns.slice(0, -1).map(([key]) => {
        const value = key === 'vacancy' ? b.vacancy + '%' : key === 'mtr' ? b.mtr + ' m' : b[key];
        return '<td>'+h(value)+'</td>';
      });
      cells.push('<td><span class="badge" style="background:'+categoryColor[b.category]+'">'+h(categoryLabel(b.category))+'</span></td>');
      return '<tr data-id="'+h(b.id)+'" class="'+(b.id === state.selected ? 'selected-row' : '')+'">'+cells.join('')+'</tr>';
    }).join('')+'</tbody>';
  document.querySelectorAll('[data-sort]').forEach(btn => btn.onclick = () => {
    const key = btn.dataset.sort;
    state.sort = { key, dir: state.sort.key === key && state.sort.dir === 'desc' ? 'asc' : 'desc' };
    render();
  });
  document.querySelectorAll('#comparisonTable tbody tr').forEach(row => row.onclick = () => { state.selected = row.dataset.id; render(); });
}
function renderComparisonRecommendation(rows) {
  const el = document.getElementById('comparisonRecommendation');
  if (!el) return;
  const selectedIds = [state.selected, ...state.compare].filter(Boolean);
  const pool = rows.filter(b => selectedIds.includes(b.id));
  const candidates = pool.length > 1 ? pool : rows.slice(0, 3);
  const best = topRankedBuilding(candidates);
  if (!best) {
    el.innerHTML = '<strong>Recommendation</strong><p>No buildings match the current filters. Broaden the filters before selecting a near-term pilot candidate.</p>';
    return;
  }
  const factors = factorContributionRows(best);
  const reason = factors.slice(0, 2).map(f => f.label.toLowerCase()).join(' and ');
  const caveat = factors.slice().sort((a,b)=>a.contribution-b.contribution)[0];
  el.innerHTML = '<strong>Recommendation</strong><p>'+h(best.name)+' is the strongest near-term pilot candidate among the current comparison set because it combines an indicative suitability score of '+h(best.score)+'/100 with '+h(reason)+'. The main caveat is '+h(caveat.label.toLowerCase())+', which should be verified before any implementation decision.</p><p><strong>Suggested next action:</strong> '+h(nextStepFor(best))+'</p>';
}
function renderWeights(selected) {
  const nw = normalisedWeights(state.weights);
  const modelDimensions = activeDimensions();
  document.getElementById('weightSliders').innerHTML =
    '<div class="model-mode"><strong>'+h(state.modelMode === 'survey' ? 'Survey-derived eight-dimension model' : 'Baseline 11-factor model')+'</strong><span>'+h(state.modelMode === 'survey' ? 'Pilot-derived weights from the research workflow are currently applied.' : 'Use Model Weights to apply survey-derived research weights.')+'</span></div>' +
    modelDimensions.map(([key,label,desc], i) => '<div class="weight-row"><header><span>'+h(label)+'</span><span>'+Math.round(nw[i])+'%</span></header><p>'+explainTerms(desc)+'</p><input data-weight="'+i+'" type="range" min="0" max="35" value="'+state.weights[i]+'" /></div>').join('');
  document.querySelectorAll('[data-weight]').forEach(input => input.oninput = e => {
    state.weights[Number(e.target.dataset.weight)] = Number(e.target.value);
    state.scenario = 'custom';
    render();
  });
  renderCompareControls();
  renderBaselineControls();
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
function renderBaselineControls() {
  const el = document.getElementById('baselineControls');
  if (!el) return;
  const selectOptions = (values, current) => ['All', ...new Set(values)].sort((a,b)=> a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)).map(value => '<option '+(value === current ? 'selected' : '')+'>'+h(value)+'</option>').join('');
  el.innerHTML =
    '<div class="baseline-heading"><strong>Average baseline conditions</strong><button id="resetBaselineFilters" type="button">Reset</button></div>' +
    '<div class="baseline-filter-grid">' +
    '<label>District<select data-baseline-filter="district">'+selectOptions(buildings.map(b => b.district), state.baselineFilters.district)+'</select></label>' +
    '<label>Zoning<select data-baseline-filter="zoning">'+selectOptions(buildings.map(b => b.zoning), state.baselineFilters.zoning)+'</select></label>' +
    '<label>Ownership<select data-baseline-filter="ownership">'+selectOptions(buildings.map(b => b.ownership), state.baselineFilters.ownership)+'</select></label>' +
    '<label>Environmental risk<select data-baseline-filter="risk">'+selectOptions(['Low','Medium','High'], state.baselineFilters.risk)+'</select></label>' +
    '<label>Minimum storeys <span>'+h(state.baselineFilters.minStoreys)+'</span><input data-baseline-filter="minStoreys" type="range" min="0" max="60" value="'+h(state.baselineFilters.minStoreys)+'" /></label>' +
    '<label>Minimum score <span>'+h(state.baselineFilters.minScore)+'</span><input data-baseline-filter="minScore" type="range" min="0" max="100" value="'+h(state.baselineFilters.minScore)+'" /></label>' +
    '</div>';
  document.querySelectorAll('[data-baseline-filter]').forEach(input => input.oninput = e => {
    const key = e.target.dataset.baselineFilter;
    state.baselineFilters[key] = ['minStoreys','minScore'].includes(key) ? Number(e.target.value) : e.target.value;
    renderWeights(scored().find(b => b.id === state.selected) || scored()[0]);
  });
  document.getElementById('resetBaselineFilters').onclick = () => {
    state.baselineFilters = {...defaultBaselineFilters};
    renderWeights(scored().find(b => b.id === state.selected) || scored()[0]);
  };
}
function renderScenarios() {
  const el = document.getElementById('scenarioComparison');
  el.innerHTML = Object.entries(scenarios).map(([k,s]) => {
    const weights = scenarioWeights(k);
    const r = scored(weights, 'survey').slice(0,4);
    const nw = normalisedWeights(weights);
    const emphasis = researchDimensions.map(([key,label], i) => ({ label, weight: Math.round(nw[i]) })).sort((a,b)=>b.weight-a.weight).slice(0,4);
    return '<div class="scenario-card '+(k === state.scenario ? 'active' : '')+'"><h3>'+h(s.label)+'</h3><p>'+h(s.summary)+'</p><div class="scenario-emphasis"><span>Survey-derived higher emphasis</span>'+emphasis.map(f => '<strong>'+h(f.label)+' '+h(f.weight)+'%</strong>').join('')+'</div><ol>'+r.map(b=>'<li>'+h(b.name)+' <strong>'+h(b.score)+'</strong></li>').join('')+'</ol></div>';
  }).join('');
  document.querySelectorAll('#scenarioButtons button').forEach(btn => btn.classList.toggle('active', btn.dataset.scenario === state.scenario));
  renderScenarioRankTable();
}
function scenarioRankMap(key) {
  return Object.fromEntries(scored(scenarioWeights(key), 'survey').map((building, index) => [building.id, index + 1]));
}
function scenarioInterpretation(row) {
  if (row.biggestChange <= 2 && Math.max(...row.ranks) <= 5) return 'Robust candidate across scenarios';
  if (row.housing < row.baseline) return 'Strong under housing-priority assumptions';
  if (row.policy < row.baseline || row.biggestChange >= 5) return 'Sensitive to policy-feasibility weighting';
  if (Math.min(...row.ranks) > 6) return 'Lower priority across most scenarios';
  return 'Moderately sensitive to assumptions';
}
function renderScenarioRankTable() {
  const table = document.getElementById('scenarioRankTable');
  if (!table) return;
  const keys = ['balanced','housing','policy','market','community'];
  const maps = Object.fromEntries(keys.map(key => [key, scenarioRankMap(key)]));
  const rows = buildings.map(building => {
    const ranks = keys.map(key => maps[key][building.id]);
    return {
      building,
      baseline: ranks[0],
      housing: ranks[1],
      policy: ranks[2],
      market: ranks[3],
      community: ranks[4],
      ranks,
      biggestChange: Math.max(...ranks) - Math.min(...ranks)
    };
  }).sort((a,b)=>a.baseline-b.baseline);
  table.innerHTML =
    '<thead><tr><th>Building</th><th>Baseline rank</th><th>Housing priority</th><th>Policy feasibility</th><th>Market driven</th><th>Community impact</th><th>Biggest rank change</th><th>Interpretation</th></tr></thead><tbody>' +
    rows.map(row => '<tr><td><strong>'+h(row.building.name)+'</strong></td><td>'+h(row.baseline)+'</td><td>'+h(row.housing)+'</td><td>'+h(row.policy)+'</td><td>'+h(row.market)+'</td><td>'+h(row.community)+'</td><td>'+h(row.biggestChange)+'</td><td>'+h(scenarioInterpretation(row))+'</td></tr>').join('') +
    '</tbody>';
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
  state.weights = finalResearchWeights();
  state.researchWeights = state.weights.slice();
  options('district', buildings.map(b=>b.district));
  options('zoning', buildings.map(b=>b.zoning));
  options('ownership', buildings.map(b=>b.ownership));
  options('risk', ['Low','Medium','High']);
  options('compatibility', ['Low','Medium','High']);
  document.getElementById('stakeholderGroup').innerHTML = stakeholderGroups.map(group => '<option>'+h(group)+'</option>').join('');
  document.getElementById('stakeholderDimension').innerHTML = researchDimensions.map(([key,label]) => '<option value="'+h(key)+'">'+h(label)+'</option>').join('');
  renderCompareControls();
  document.getElementById('scenarioButtons').innerHTML = Object.entries(scenarios).map(([k,s]) => '<button data-scenario="'+k+'">'+h(s.label)+'<small>'+h(s.summary)+'</small></button>').join('');
  document.querySelectorAll('[data-scenario]').forEach(btn => btn.onclick = () => {
    state.scenario = btn.dataset.scenario;
    state.modelMode = 'survey';
    state.weights = scenarioWeights(state.scenario);
    state.researchWeights = state.weights.slice();
    render();
  });
  document.querySelectorAll('.tab').forEach(tab => tab.onclick = () => activateTab(tab.dataset.tab));
  document.querySelectorAll('[data-view-mode]').forEach(button => button.onclick = () => {
    state.viewMode = button.dataset.viewMode;
    updateViewModeTabs();
  });
  ['search','district','zoning','ownership','risk','compatibility'].forEach(id => document.getElementById(id).oninput = e => { state.filters[id] = e.target.value; render(); });
  [['minScore','minScoreValue'],['minVacancy','minVacancyValue'],['maxAge','maxAgeValue'],['maxHeight','maxHeightValue'],['maxStoreys','maxStoreysValue'],['maxMtr','maxMtrValue']].forEach(([id,out]) => document.getElementById(id).oninput = e => { state.filters[id] = Number(e.target.value); document.getElementById(out).textContent = e.target.value; render(); });
  document.getElementById('resetFilters').onclick = () => { state.filters = {...defaultFilters}; syncFilterControls(); render(); };
  document.getElementById('exportCsv').onclick = exportCsv;
  const exportSurveyCriteriaButton = document.getElementById('exportSurveyCriteria');
  if (exportSurveyCriteriaButton) exportSurveyCriteriaButton.onclick = exportSurveyCriteria;
  document.getElementById('addStakeholderFactor').onclick = addStakeholderFactor;
  document.getElementById('applyFinalWeights').onclick = () => {
    state.modelMode = 'survey';
    state.scenario = 'custom';
    state.weights = finalResearchWeights();
    state.researchWeights = state.weights.slice();
    render();
  };
  syncFilterControls();
  updateSurveyResultAccess();
  render();
  loadSupabaseData();
}
function exportSurveyCriteria() {
  const headers = ['factor_id','dimension','factor_name','factor_explanation','survey_question','importance_slider','literature_source','data_indicator','scoring_method'];
  const rows = selectedSurveyFactors().map(factor => [factor.id, dimensionLabel(factor.dimension), factor.factor_name, surveyExplanation(factor), surveyQuestion(factor), '0=Not important; 50=Moderately important; 100=Very important', factor.literature_source, factor.data_indicator, factor.scoring_method]);
  downloadCsv('adaptive-reuse-survey-criteria.csv', headers, rows);
}
async function addStakeholderFactor() {
  const name = document.getElementById('stakeholderFactorName').value.trim();
  if (!name) return;
  const payload = {
    factor_name: name,
    suggested_by: document.getElementById('stakeholderSuggestedBy').value.trim() || 'Unspecified',
    stakeholder_group: document.getElementById('stakeholderGroup').value,
    related_dimension: document.getElementById('stakeholderDimension').value,
    comment: document.getElementById('stakeholderComment').value.trim() || 'No comment provided.',
    include_in_final_model: true
  };
  const button = document.getElementById('addStakeholderFactor');
  if (button) {
    button.disabled = true;
    button.textContent = 'Saving...';
  }
  try {
    await saveStakeholderSuggestedFactor(payload);
    ['stakeholderFactorName','stakeholderSuggestedBy','stakeholderComment'].forEach(id => document.getElementById(id).value = '');
    renderResearchWorkflow();
  } catch (error) {
    console.error(error);
    state.databaseStatus = 'Suggested factor could not be saved to Supabase. Check config and RLS policies.';
    renderResearchWorkflow();
    window.alert('Save failed: ' + (error.message || error));
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = 'Add suggested factor';
    }
  }
}
function exportCsv() {
  const modelDimensions = activeDimensions();
  const factorHeaders = modelDimensions.map(([key]) => key);
  const headers = ['building_id','building_name','district','address','existing_zoning','ownership_type','distance_to_mtr_m',...factorHeaders,'indicative_suitability_score','indicative_category','main_constraints','main_opportunities'];
  const rows = filtered().map(b => [b.id,b.name,b.district,b.address,b.zoning,b.ownership,b.mtr,...modelDimensions.map(([key]) => b[key]),b.score,b.category,b.constraints,b.opportunities]);
  downloadCsv('adaptive-reuse-ranked-buildings.csv', headers, rows);
}
init();
