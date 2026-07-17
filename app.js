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
  housing: { label: 'Housing-outcome scenario', summary: 'Prioritises location support, design adaptability, safety and environmental residential quality.', weights: [18,9,8,10,16,10,16,13] },
  policy: { label: 'Policy-feasibility scenario', summary: 'Prioritises feasibility, regulatory constraints, building services and health and safety.', weights: [8,22,6,18,8,15,18,5] },
  market: { label: 'Market-driven scenario', summary: 'Prioritises economic viability, feasibility, location and implementation practicality.', weights: [16,10,22,18,10,10,8,6] },
  community: { label: 'Community-impact scenario', summary: 'Prioritises location, health and safety, environmental performance and design quality.', weights: [22,8,6,8,14,8,18,16] }
};
const researchDimensions = [
  ['location','Location','Access to public transport, community facilities and neighbourhood compatibility within a 500 m residential catchment.'],
  ['regulatory','Regulatory Constraints','Planning and zoning compliance plus building approval risk.'],
  ['economic','Economic Viability','Conversion cost viability, market demand and policy or incentive support.'],
  ['feasibility','Feasibility','Ownership and vacancy conditions affecting implementation practicality.'],
  ['design','Design Adaptability','Building condition, spatial adaptability, daylight, ventilation and structural robustness.'],
  ['services','Building Services','MEP and vertical circulation upgrade cost implications.'],
  ['safety','Health and Safety','Fire safety upgrade cost and industrial hazard adjacency.'],
  ['environmental','Environmental Performance','Embodied carbon reduction and operational performance upgrade potential.']
];
const criticalFactors = [
  ['location','Access to public transport (within 500m radius)','Access to public transport within 500m with safer pedestrian routes.','Revised survey questions RT','Distance to public transport and pedestrian route quality','Higher score for shorter, safer access to public transport',true],
  ['location','Proximity to community facilities & amenities (within 500m radius)','Community facilities & amenities refer markets, clinics, schools, parks, community services, and other facilities needed to support residential living.','Revised survey questions RT','Facilities and amenities within 500 m catchment','Higher score for more complete daily-living facility catchment',true],
  ['location','Neighbourhood compatibility (within 500m radius)','Neighbourhood compatibility refers to whether the surrounding area is suitable for people to live in. This includes land-use mix, potential for future residential developments, safe communities and no impact from nearby industrial activities, noise, traffic, and pollution etc.','Revised survey questions RT','Surrounding land use, residential interface and environmental risk','Higher score for compatible residential surroundings and lower interface risk',true],
  ['regulatory','Planning and zoning compliance','Planning and zoning acceptability refers to whether the existing statutory planning context can support residential or mixed residential use.','Revised survey questions RT','OZP zoning, planning context and residential acceptability','Higher score where current zoning and planning context support residential or mixed use',true],
  ['regulatory','Building approval risk','Approval risk refers to delays and complexities involved in the building approval process.','Revised survey questions RT','Indicative approval complexity and statutory coordination risk','Lower score where approval delay and coordination complexity are higher',true],
  ['economic','Conversion cost viability','This factor refers to whether the expected retrofit and other associated costs are reasonable compared with the potential residential value, social benefit and rate of investment.','Revised survey questions RT','Retrofit cost, residential value, social benefit and ROI proxy','Higher score where retrofit cost is proportionate to expected benefit and value',true],
  ['economic','Market demand and potential','This factor refers to demand for various types of residential units in that area, such as affordability, user demographics, type of units, future developments, etc.','Revised survey questions RT','District housing demand, affordability and future residential market signals','Higher score where district demand and market acceptance are stronger',true],
  ['economic','Policies and incentives','This factor refers to policies and incentives schemes to support adaptive reuse, i.e. tax exemptions, pilot schemes, financial support, additional GFA, expedited approval processes etc.','Revised survey questions RT','Policy support, incentives and administrative facilitation','Higher score where policy or incentive support can reduce implementation barriers',true],
  ['feasibility','Ownership','This factor considers whether the building ownership status allows decisions to be made and implemented effectively. A single owner or coordinated management body may make adaptive reuse easier, while fragmented ownership can create delays, disputes, or difficulty reaching consensus.','Revised survey questions RT','Ownership type and implementation coordination capacity','Higher score for single ownership or coordinated management structures',true],
  ['feasibility','Vacancy ratio','This factor refers to how vacant the building is or is it possible to vacate existing tenants with adequate advance notice.','Revised survey questions RT','Current vacancy and ability to decant existing tenants','Higher score for higher vacancy or easier decanting potential',true],
  ['design','Building condition','This factor refers to building condition such as structural stability, level of upgrades required for building services, health and safety of users, design and layout, possibility for conversion with minimum modifications.','Revised survey questions RT','Observed building condition and extent of required upgrades','Higher score for better condition and fewer required conversion modifications',true],
  ['design','Spatial adaptability','This factor refers to whether the building layout can be reasonably subdivided into residential units. Important considerations include floor depth, column grid spacing, core location, corridor arrangement, window access, and whether the current layout plan can support liveable unit layouts.','Revised survey questions RT','Floor plate, column grid, core location and window access','Higher score where layout can support liveable residential units',true],
  ['design','Day light and natural ventilation access','This factor considers whether future residential units can receive adequate daylight and natural ventilation. This is a challenge in industrial buildings because of deep floor plates and limited openings.','Revised survey questions RT','Daylight, facade exposure, ventilation and openings','Higher score where future units can achieve adequate daylight and ventilation',true],
  ['design','Structural robustness','This factor refers to whether the existing building structure is strong, stable, and flexible enough to support residential conversion. This includes the condition of the frame, loading capacity, age, structural system, and ability to accommodate safety requirements.','Revised survey questions RT','Structural frame condition, loading capacity, age and system flexibility','Higher score where structure can support residential conversion and safety upgrades',true],
  ['services','MEP upgrade cost','This factor refers to upgrading mechanical, electrical, plumbing, drainage, and building services systems. Residential use usually requires different service standards. These upgrades incurs substantial investments.','Revised survey questions RT','MEP, plumbing, drainage and building-services upgrade cost','Higher score where MEP upgrades are less costly and more feasible',true],
  ['services','Vertical circulation upgrade cost','This factor refers to whether the building has suitable lifts, staircases, cores, and accessible routes for residential occupation. Residential conversion requires adequate daily circulation for different user groups, emergency escape, and barrier-free access.','Revised survey questions RT','Lift, stair, core and barrier-free access upgrade cost','Higher score where vertical circulation upgrades are manageable',true],
  ['safety','Fire safety upgrade cost','This factor refers to fire safety upgrades to meet the code requirements. It may include means of escape, fire service installations, compartmentation, refuge provisions, emergency access.','Revised survey questions RT','Fire service installation, means of escape and compartmentation upgrade burden','Higher score where fire safety upgrades are less costly and less complex',true],
  ['safety','Industrial hazard adjacency','Industrial hazard adjacency refers to risks created by nearby industrial, logistics, storage, or hazardous activities. Residential conversion may be less suitable where future residents would be exposed to noise, fire risk, chemical storage, heavy vehicles, or other industrial hazards.','Revised survey questions RT','Nearby industrial, logistics, storage and hazardous-use interface','Higher score where exposure to industrial hazards is lower',true],
  ['environmental','Embodied carbon reduction','Embodied carbon retention refers to the environmental benefit of reusing the existing building structure instead of demolition and new construction. A project may have higher sustainability value if it can retain substantial structural fabric while still meeting residential standards. These upgraded buildings may also increase the value of the surrounding.','Revised survey questions RT','Potential embodied carbon saving from adaptive reuse versus demolition','Higher score where structural reuse creates stronger embodied-carbon benefit',true],
  ['environmental','Operational performance upgrade','Operational performance upgrade refers to whether the building can be improved to achieve acceptable energy, ventilation, thermal comfort, and environmental performance after conversion. This is important because residential use requires long-term comfort, efficiency, and sustainable operation.','Revised survey questions RT','Energy, ventilation, thermal comfort and long-term operating performance','Higher score where retrofit can improve operational environmental performance',true]
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
const surveyFactorQuestions = {
  'Access to public transport (within 500m radius)': 'How important is access to public transport when converting industrial buildings to residential use?',
  'Proximity to community facilities & amenities (within 500m radius)': 'How important is proximity to community facilities when converting industrial buildings to residential use?',
  'Neighbourhood compatibility (within 500m radius)': 'How important is neighbourhood compatibility when converting industrial buildings for residential use?',
  'Planning and zoning compliance': 'How important is current "planning and zoning compliance"?',
  'Building approval risk': 'How important is "building approval risk" when converting industrial buildings for residential use?',
  'Conversion cost viability': 'How important is "conversion cost viability" when converting industrial buildings for residential use?',
  'Market demand and potential': 'How important is "market demand and potential" when converting industrial buildings for residential use?',
  'Policies and incentives': 'How important is "policies and incentives" when converting industrial buildings for residential use?',
  'Ownership': 'How important is "ownership" status when converting industrial buildings for residential use?',
  'Vacancy ratio': 'How important is "vacancy ratio" when converting industrial buildings for residential use?',
  'Building condition': 'How important is the current "building condition" when converting industrial buildings for residential use?',
  'Spatial adaptability': 'How important is "spatial adaptability" when converting industrial buildings for residential use?',
  'Day light and natural ventilation access': 'How important is to have adequate levels of daylight and natural ventilation when converting industrial buildings for residential use?',
  'Structural robustness': 'How important is "Structural robustness" when converting industrial buildings for residential use?',
  'MEP upgrade cost': 'How important is MEP upgrade cost when converting industrial buildings for residential use?',
  'Vertical circulation upgrade cost': 'How important is "Vertical circulation upgrade cost" when converting industrial buildings for residential use?',
  'Fire safety upgrade cost': 'How important is "Fire safety upgrade cost" when converting industrial buildings for residential use?',
  'Industrial hazard adjacency': 'How important is "Industrial hazard adjacency" when converting industrial buildings for residential use?',
  'Embodied carbon reduction': 'How important is "embodied carbon reduction" achieved in adaptive reuse compared to demolition and reconstruction?',
  'Operational performance upgrade': 'How important is "Operational performance upgrade" when converting industrial buildings for residential use?'
};
const surveyFactorExplanations = Object.fromEntries(criticalFactors.map(factor => [factor.factor_name, factor.description]));
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
  { key: 'government', label: 'Government' },
  { key: 'statutoryBody', label: 'Statutory body' },
  { key: 'propertyManagement', label: 'Property management' },
  { key: 'financial', label: 'Financial sector' },
  { key: 'academics', label: 'Academic / researcher' },
  { key: 'professional', label: 'Professional / consultant' },
  { key: 'ngoCommunity', label: 'NGO / community organisation' },
  { key: 'developerInvestor', label: 'Developer / investor' },
  { key: 'buildingOwner', label: 'Building owner / landlord' },
  { key: 'tenantOccupier', label: 'Industrial tenant / occupier' },
  { key: 'generalPublic', label: 'General public' },
  { key: 'other', label: 'Other' }
];
const stakeholderGroupAliases = {
  industry: 'buildingOwner',
  community: 'ngoCommunity',
  architectPlanner: 'professional',
  developer: 'developerInvestor',
  property: 'propertyManagement',
  [ ['Industrial', 'Unit', 'Owner'].join(' ') ]: 'buildingOwner',
  [ ['Community', 'NGO'].join(' / ') ]: 'ngoCommunity',
  [ ['architect', 'Planner', 'related', 'expertise'].join('/ ') ]: 'professional',
  Developer: 'developerInvestor',
  [ ['Professional', 'consultant'].join(' ') ]: 'professional',
  [ ['Property', 'sector'].join(' ') ]: 'propertyManagement',
  [ ['Tenant', 'occupier'].join(' / ') ]: 'tenantOccupier',
  [ ['Government', 'statutory', 'body'].join(' / ') ]: 'government'
};
const surveyStakeholderGroups = [
  ...stakeholderWeightGroups.map(group => group.label)
];
const stakeholderGroups = surveyStakeholderGroups.slice();
const statutoryBodyTypeOptions = [
  'Public-sector related',
  'Private-sector related',
  'Mixed / not sure',
  'Prefer not to say'
];
const stakeholderKnowledgeOptions = [
  'No prior knowledge',
  'Basic awareness',
  'Some professional or academic knowledge',
  'Strong professional or project-based knowledge'
];
const projectInvolvementOptions = [
  'No',
  'Yes, indirectly',
  'Yes, directly',
  'Prefer not to say'
];
const projectLocationOptions = [
  'Hong Kong',
  'Other Asian countries',
  'Oceania',
  'Europe',
  'North America',
  'South America',
  'Africa'
];
const outcomeLikelihoodScale = [
  { value: 1, label: 'Not likely' },
  { value: 2, label: 'Slightly likely' },
  { value: 3, label: 'Likely' },
  { value: 4, label: 'Very likely' }
];
const reuseOutcomeOptions = [
  { id: 'residentialAdaptiveReuse', label: 'Residential adaptive reuse' },
  { id: 'privateRentalHousing', label: 'Private rental housing' },
  { id: 'smallResidentialUnits', label: 'Small residential units' },
  { id: 'coLiving', label: 'Co-living' },
  { id: 'studentHousing', label: 'Student housing' },
  { id: 'transitionalHousing', label: 'Transitional housing' },
  { id: 'mixedUseResidentialCommercial', label: 'Mixed-use residential-commercial' },
  { id: 'mixedUseRedevelopment', label: 'Mixed-use redevelopment' },
  { id: 'communityFacilities', label: 'Community facilities' },
  { id: 'creativeCulturalUses', label: 'Creative / cultural uses' },
  { id: 'lightIndustrialMakerSpace', label: 'Light industrial or maker space' },
  { id: 'commercialOfficeReuse', label: 'Commercial / office reuse' },
  { id: 'servicedApartmentHotelUse', label: 'Serviced apartment / hotel-like use' },
  { id: 'wholesaleConversion', label: 'Wholesale conversion' },
  { id: 'demolished', label: 'Demolition / redevelopment' },
  { id: 'sellLand', label: 'Sell land / dispose of site' },
  { id: 'preferNotConvertResidential', label: 'Prefer not to convert to residential use' }
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
const minSurveyFactors = 5;
const maxSurveyFactors = 10;
const TEAM_ACCESS_CODE = 'CHANGE_THIS_CODE';
const TEAM_ACCESS_STORAGE_KEY = 'adaptiveReuseTeamAccess';
function storedTeamAccessUnlocked() {
  try { return window.localStorage.getItem(TEAM_ACCESS_STORAGE_KEY) === 'true'; }
  catch (error) { return false; }
}
function writeStoredTeamAccess(unlocked) {
  try {
    if (unlocked) window.localStorage.setItem(TEAM_ACCESS_STORAGE_KEY, 'true');
    else window.localStorage.removeItem(TEAM_ACCESS_STORAGE_KEY);
  } catch (error) {}
}
let state = { scenario: 'balanced', modelMode: 'survey', weights: researchDimensions.map(() => 1), researchWeights: researchDimensions.map(() => 1), selected: buildings[0].id, compare: [buildings[6].id, buildings[11].id], sort: { key: 'score', dir: 'desc' }, filters: {...defaultFilters}, mapLayers: {...defaultMapLayers}, stakeholderFactors: [
  { factor_name: 'Workshop validation confidence', suggested_by: 'Pilot workshop', stakeholder_group: 'Professional / consultant', related_dimension: 'feasibility', comment: 'Record whether workshop participants agree with model output for each site.', include_in_final_model: true },
  { factor_name: 'Tenant displacement management', suggested_by: 'Community panel', stakeholder_group: 'NGO / community organisation', related_dimension: 'safety', comment: 'Flag social and health risks from relocating existing small businesses.', include_in_final_model: false }
], surveyRatings: {}, surveySelectedFactorIds: [], surveyFactorRanking: [], expandedSurveyFactorIds: [], surveyTopFactors: ['', '', ''], preferredReuseOutcomes: [], preferredReuseOutcomeRatings: {}, surveyReviewOpen: false, surveySubmitted: false, surveyResultsUnlocked: false, participantGroup: '', statutoryBodyType: '', industrialOwnershipType: '', adaptiveReuseKnowledge: '', projectInvolvement: '', projectLocation: '', surveyResultGroup: 'All', baselineFilters: {...defaultBaselineFilters}, stakeholderGroupWeights: { government: 9, statutoryBody: 9, propertyManagement: 8, financial: 8, academics: 9, professional: 9, ngoCommunity: 8, developerInvestor: 8, buildingOwner: 8, tenantOccupier: 8, generalPublic: 8, other: 8 }, surveySubmissions: [], surveySubmissionsLoaded: false, databaseStatus: 'Using local pilot data until Supabase is configured.', viewMode: 'research', teamAccessUnlocked: storedTeamAccessUnlocked() };
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
function slugKey(value) {
  return String(value || '')
    .replace(/&/g, ' and ')
    .replace(/\/|-/g, ' ')
    .replace(/[^a-zA-Z0-9 ]+/g, '')
    .trim()
    .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toLowerCase());
}
function outcomeOptionId(value) {
  const clean = String(value || '').trim();
  if (/^demolished$/i.test(clean) || /^demolition\s*\/\s*redevelopment$/i.test(clean)) return 'demolished';
  if (/^sell\s*land$/i.test(clean) || /^sell\s*land\s*\/\s*dispose\s*of\s*site$/i.test(clean)) return 'sellLand';
  const match = reuseOutcomeOptions.find(option => option.id === clean || option.label === clean);
  return match ? match.id : slugKey(clean);
}
function outcomeOptionLabel(value) {
  const clean = String(value || '').trim();
  const match = reuseOutcomeOptions.find(option => option.id === clean || option.label === clean);
  return match ? match.label : clean;
}
function outcomeLikelihoodLabel(value) {
  const match = outcomeLikelihoodScale.find(item => item.value === Number(value));
  return match ? match.label : 'Not rated';
}
function effectiveOutcomeRatings(ratings = state.preferredReuseOutcomeRatings) {
  return Object.fromEntries(reuseOutcomeOptions.map(option => {
    const value = Number(ratings[option.id]);
    return [option.id, Number.isFinite(value) && value >= 2 ? Math.max(2, Math.min(4, Math.round(value))) : 1];
  }));
}
function normalizedOutcomeRatings(submission = {}) {
  const source = submission.preferred_reuse_redevelopment_outcomes || submission.preferredReuseRedevelopmentOutcomes || submission.preferredReuseOutcomeRatings || {};
  const ratings = {};
  Object.entries(source || {}).forEach(([key, value]) => {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) ratings[outcomeOptionId(key)] = Math.max(1, Math.min(4, Math.round(numeric)));
  });
  const legacy = submission.preferred_reuse_outcomes || submission.preferredReuseOutcomes || [];
  if (Array.isArray(legacy)) legacy.forEach(label => {
    const id = outcomeOptionId(label);
    if (!ratings[id]) ratings[id] = 3;
  });
  return effectiveOutcomeRatings(ratings);
}
function outcomeRatingsComplete() {
  return reuseOutcomeOptions.every(option => {
    const value = state.preferredReuseOutcomeRatings[option.id];
    return value === undefined || (Number(value) >= 2 && Number(value) <= 4);
  });
}
function outcomeRatingsForSubmission() {
  return effectiveOutcomeRatings();
}
function outcomeRatingsAsLabels(ratings = state.preferredReuseOutcomeRatings) {
  const completeRatings = effectiveOutcomeRatings(ratings);
  return reuseOutcomeOptions.map(option => [option.label, outcomeLikelihoodLabel(completeRatings[option.id])]);
}
function bindHeaderDescriptionToggle() {
  const button = document.getElementById('headerDescriptionToggle');
  const panel = document.getElementById('headerDescription');
  if (!button || !panel) return;
  const sync = open => {
    panel.classList.toggle('is-open', open);
    panel.setAttribute('aria-hidden', String(!open));
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'See less' : 'See more';
  };
  sync(false);
  button.onclick = () => sync(!panel.classList.contains('is-open'));
}
const supabaseConfig = window.ADAPTIVE_REUSE_SUPABASE || {};
function supabaseReady() {
  return !!(supabaseConfig.url && supabaseConfig.anonKey && !String(supabaseConfig.url).includes('YOUR_') && !String(supabaseConfig.anonKey).includes('YOUR_'));
}
class SupabaseRequestError extends Error {
  constructor(message, details = {}, status = null) {
    super(message);
    this.name = 'SupabaseRequestError';
    this.details = details;
    this.status = status;
    this.code = details && details.code ? details.code : null;
  }
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
    let parsed = null;
    try { parsed = body ? JSON.parse(body) : null; } catch (error) { parsed = null; }
    throw new SupabaseRequestError((parsed && parsed.message) || body || 'Supabase request failed with status ' + response.status, parsed || { body }, response.status);
  }
  return response.status === 204 ? [] : response.json();
}
function stakeholderGroupKey(value) {
  const clean = String(value || '').trim();
  const compact = clean.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const aliasMatch = Object.entries(stakeholderGroupAliases).find(([alias]) => alias.toLowerCase().replace(/[^a-z0-9]+/g, '') === compact);
  if (aliasMatch) return aliasMatch[1];
  const match = stakeholderWeightGroups.find(group => group.key === clean || group.label === clean || group.label.toLowerCase().replace(/[^a-z0-9]+/g, '') === compact);
  return match ? match.key : clean;
}
function stakeholderGroupDisplay(value) { return stakeholderGroupLabel(stakeholderGroupKey(value)); }
function emptySurveyResponseSet() {
  return Object.fromEntries(researchDimensions.map(([key]) => [
    key,
    Object.fromEntries(stakeholderWeightGroups.map(group => [group.key, []]))
  ]));
}
function shouldUseSubmissionData() { return state.surveySubmissionsLoaded || state.surveySubmissions.length > 0; }
function normalizedSurveyResponses(source) {
  const responseSet = emptySurveyResponseSet();
  researchDimensions.forEach(([dimensionKey]) => {
    Object.entries(source[dimensionKey] || {}).forEach(([groupKey, values]) => {
      const canonicalKey = stakeholderGroupKey(groupKey);
      if (!responseSet[dimensionKey][canonicalKey] || !Array.isArray(values)) return;
      responseSet[dimensionKey][canonicalKey].push(...values);
    });
  });
  return responseSet;
}
function currentSurveyResponses() {
  if (!shouldUseSubmissionData()) return normalizedSurveyResponses(surveyResponses);
  const responseSet = emptySurveyResponseSet();
  state.surveySubmissions.forEach(submission => {
    const groupKey = stakeholderGroupKey(submission.stakeholder_group_key || submission.stakeholder_group);
    if (!responseSet.feasibility[groupKey]) return;
    const weights = normalizedDerivedFactorWeights(submission);
    if (Object.keys(weights).length) {
      researchDimensions.forEach(([dimensionKey]) => {
        const dimensionWeight = criticalFactors
          .filter(factor => factor.dimension === dimensionKey)
          .reduce((sum, factor) => sum + (Number(weights[factor.id]) || 0), 0);
        responseSet[dimensionKey][groupKey].push(dimensionWeight * 5);
      });
      return;
    }
    const ratings = submission.ratings || submission.factor_ratings || submission.factorRatings || {};
    researchDimensions.forEach(([dimensionKey]) => {
      const values = criticalFactors
        .filter(factor => factor.dimension === dimensionKey && Number.isFinite(Number(ratings[factor.id])))
        .map(factor => Number(ratings[factor.id]));
      if (values.length) responseSet[dimensionKey][groupKey].push(mean(values) / 20);
    });
  });
  return responseSet;
}
function normalizedDerivedFactorWeights(submission = {}) {
  const source = submission.derived_factor_weights || submission.derivedFactorWeights || {};
  const weights = {};
  Object.entries(source || {}).forEach(([id, value]) => {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) weights[id] = numeric > 1 ? numeric / 100 : numeric;
  });
  return weights;
}
function normalizedFactorRanking(submission = {}) {
  return submission.factor_ranking || submission.factorRanking || submission.top_factor_ids || [];
}
function responseDataFromRow(row = {}) {
  if (!row.response_data) return null;
  if (typeof row.response_data === 'string') {
    try { return JSON.parse(row.response_data); } catch (error) { return null; }
  }
  return typeof row.response_data === 'object' ? row.response_data : null;
}
function normaliseSurveySubmission(row = {}) {
  const responseData = responseDataFromRow(row);
  const base = responseData ? {...responseData} : {
    stakeholderGroup: row.stakeholder_group || row.stakeholderGroup || null,
    stakeholderGroupKey: row.stakeholder_group_key || row.stakeholderGroupKey || null,
    statutoryBodyType: row.statutory_body_type || row.statutoryBodyType || null,
    industrialOwnershipType: row.industrial_ownership_type || row.industrialOwnershipType || null,
    adaptiveReuseKnowledge: row.adaptive_reuse_knowledge || row.adaptiveReuseKnowledge || null,
    projectInvolvement: row.project_involvement || row.projectInvolvement || null,
    projectLocation: row.project_location || row.projectLocation || null,
    selectedFactors: row.selected_factors || row.selectedFactors || [],
    factorRanking: row.factor_ranking || row.factorRanking || row.top_factor_ids || [],
    derivedFactorWeights: row.derived_factor_weights || row.derivedFactorWeights || {},
    derivedFactorRawScores: row.derived_factor_raw_scores || row.derivedFactorRawScores || {},
    factorRatings: row.factor_ratings || row.factorRatings || row.ratings || {},
    preferredReuseRedevelopmentOutcomes: row.preferred_reuse_redevelopment_outcomes || row.preferredReuseRedevelopmentOutcomes || {},
    selectedReuseRedevelopmentOutcomes: row.selected_reuse_redevelopment_outcomes || row.selectedReuseRedevelopmentOutcomes || [],
    respondentProfile: row.respondent_profile || row.respondentProfile || {},
    submittedAt: row.submitted_at || row.submittedAt || null,
    ratings: row.ratings || row.factor_ratings || row.factorRatings || {},
    top_factor_ids: row.top_factor_ids || [],
    top_factor_names: row.top_factor_names || [],
    preferred_reuse_outcomes: row.preferred_reuse_outcomes || []
  };
  const stakeholderGroup = base.stakeholderGroup || base.stakeholder_group || row.stakeholder_group || row.stakeholderGroup || null;
  const stakeholderKey = base.stakeholderGroupKey || base.stakeholder_group_key || row.stakeholder_group_key || (stakeholderGroup ? stakeholderGroupKey(stakeholderGroup) : null);
  const statutoryBodyType = base.statutoryBodyType || base.statutory_body_type || row.statutory_body_type || row.statutoryBodyType || null;
  const submittedAt = base.submittedAt || base.submitted_at || row.submitted_at || row.submittedAt || row.created_at || null;
  return {
    ...base,
    id: base.id || row.id || null,
    created_at: base.created_at || row.created_at || null,
    stakeholderGroup,
    stakeholder_group: stakeholderGroup,
    stakeholderGroupKey: stakeholderKey,
    stakeholder_group_key: stakeholderKey,
    statutoryBodyType,
    statutory_body_type: statutoryBodyType,
    submittedAt,
    submitted_at: submittedAt,
    selected_factors: base.selected_factors || base.selectedFactors || [],
    factor_ranking: base.factor_ranking || base.factorRanking || base.top_factor_ids || [],
    derived_factor_weights: base.derived_factor_weights || base.derivedFactorWeights || {},
    preferred_reuse_redevelopment_outcomes: base.preferred_reuse_redevelopment_outcomes || base.preferredReuseRedevelopmentOutcomes || {},
    ratings: base.ratings || base.factorRatings || base.factor_ratings || {}
  };
}
function surveySubmissionsForGroup(groupKey = state.surveyResultGroup) {
  return state.surveySubmissions.filter(submission => groupKey === 'All' || stakeholderGroupKey(submission.stakeholder_group_key || submission.stakeholder_group) === groupKey);
}
function surveyValuesForFactor(factorId, groupKey = state.surveyResultGroup) {
  if (!shouldUseSubmissionData()) return [];
  return surveySubmissionsForGroup(groupKey).map(submission => {
    const weights = normalizedDerivedFactorWeights(submission);
    if (Object.keys(weights).length) return (Number(weights[factorId]) || 0) * 100;
    return Number((submission.ratings || submission.factor_ratings || submission.factorRatings || {})[factorId]);
  }).filter(Number.isFinite);
}
function surveyFactorSelectionCount(factorId, groupKey = state.surveyResultGroup) {
  if (!shouldUseSubmissionData()) return surveyValuesForFactor(factorId, groupKey).length;
  return surveySubmissionsForGroup(groupKey).filter(submission => {
    const weights = normalizedDerivedFactorWeights(submission);
    if (Object.keys(weights).length) return Number(weights[factorId]) > 0;
    const ranking = normalizedFactorRanking(submission);
    return Array.isArray(ranking) && ranking.includes(factorId);
  }).length;
}
function surveyAverageRankForFactor(factorId, groupKey = state.surveyResultGroup) {
  if (!shouldUseSubmissionData()) return null;
  const ranks = surveySubmissionsForGroup(groupKey).map(submission => {
    const ranking = normalizedFactorRanking(submission);
    const index = Array.isArray(ranking) ? ranking.indexOf(factorId) : -1;
    return index >= 0 ? index + 1 : null;
  }).filter(Number.isFinite);
  return ranks.length ? mean(ranks) : null;
}
function surveySubmissionPayload() {
  cleanQuestionnaireSelection();
  const selectedFactors = state.surveySelectedFactorIds.slice();
  const factorRanking = state.surveyFactorRanking.slice();
  const selected = selectedQuestionnaireFactors();
  const derivedWeights = derivedFactorWeights(selected);
  const derivedRawScores = derivedFactorRawScores(selected);
  const ratings = sliderDerivedRawScores(selected);
  const outcomeRatings = outcomeRatingsForSubmission();
  const selectedOutcomeIds = reuseOutcomeOptions.filter(option => Number(state.preferredReuseOutcomeRatings[option.id]) >= 2).map(option => option.id);
  const topThree = factorRanking.slice(0, 3);
  const topFactorNames = topThree.map(id => (criticalFactors.find(factor => factor.id === id) || {}).factor_name).filter(Boolean);
  const submittedAt = new Date().toISOString();
  const respondentProfile = {
    stakeholderGroup: state.participantGroup,
    stakeholderGroupKey: stakeholderGroupKey(state.participantGroup),
    statutoryBodyType: state.participantGroup === 'Statutory body' ? state.statutoryBodyType || null : null,
    industrialOwnershipType: state.industrialOwnershipType || null,
    adaptiveReuseKnowledge: state.adaptiveReuseKnowledge || null,
    projectInvolvement: state.projectInvolvement || null,
    projectLocation: shouldAskProjectLocation() ? state.projectLocation || null : null
  };
  return {
    stakeholder_group: state.participantGroup,
    stakeholder_group_key: stakeholderGroupKey(state.participantGroup),
    statutory_body_type: state.participantGroup === 'Statutory body' ? state.statutoryBodyType || null : null,
    industrial_ownership_type: state.industrialOwnershipType || null,
    adaptive_reuse_knowledge: state.adaptiveReuseKnowledge || null,
    project_involvement: state.projectInvolvement || null,
    project_location: shouldAskProjectLocation() ? state.projectLocation || null : null,
    selected_factors: selectedFactors,
    factor_ranking: factorRanking,
    derived_factor_weights: derivedWeights,
    derived_factor_raw_scores: derivedRawScores,
    factor_ratings: ratings,
    preferred_reuse_redevelopment_outcomes: outcomeRatings,
    selected_reuse_redevelopment_outcomes: selectedOutcomeIds,
    respondent_profile: respondentProfile,
    submitted_at: submittedAt,
    selectedFactors,
    factorRanking,
    derivedFactorWeights: derivedWeights,
    derivedFactorRawScores: derivedRawScores,
    factorRatings: ratings,
    preferredReuseRedevelopmentOutcomes: outcomeRatings,
    selectedReuseRedevelopmentOutcomes: selectedOutcomeIds,
    stakeholderGroup: state.participantGroup,
    statutoryBodyType: state.participantGroup === 'Statutory body' ? state.statutoryBodyType || null : null,
    adaptiveReuseKnowledge: state.adaptiveReuseKnowledge || null,
    projectInvolvement: state.projectInvolvement || null,
    projectLocation: shouldAskProjectLocation() ? state.projectLocation || null : null,
    respondentProfile,
    submittedAt,
    ratings,
    top_factor_ids: topThree,
    top_factor_names: topFactorNames,
    preferred_reuse_outcomes: reuseOutcomeOptions.filter(option => Number(outcomeRatings[option.id]) >= 2).map(option => option.label)
  };
}
function buildSupabaseSubmissionPayload(response) {
  const stakeholderGroup = response.stakeholderGroup || response.stakeholder_group || null;
  return {
    stakeholder_group: stakeholderGroup,
    stakeholder_group_key: response.stakeholderGroupKey || response.stakeholder_group_key || (stakeholderGroup ? stakeholderGroupKey(stakeholderGroup) : null),
    statutory_body_type: response.statutoryBodyType || response.statutory_body_type || null,
    submitted_at: response.submittedAt || response.submitted_at || new Date().toISOString(),
    response_data: response
  };
}
function supabaseSubmissionPayloadAttempts(response) {
  const summaryPayload = buildSupabaseSubmissionPayload(response);
  return [
    summaryPayload,
    {
      stakeholder_group: summaryPayload.stakeholder_group,
      stakeholder_group_key: summaryPayload.stakeholder_group_key,
      submitted_at: summaryPayload.submitted_at,
      response_data: response
    },
    {
      stakeholder_group: summaryPayload.stakeholder_group,
      response_data: response
    },
    { response_data: response }
  ];
}
function isUnknownSupabaseColumnError(error) {
  return error && error.code === 'PGRST204';
}
async function saveSurveySubmission(payload) {
  const surveyResponse = normaliseSurveySubmission(payload);
  if (!supabaseReady()) {
    state.surveySubmissions.push({...surveyResponse, id: 'local-' + Date.now(), created_at: new Date().toISOString()});
    state.surveySubmissionsLoaded = true;
    state.databaseStatus = 'Supabase is not configured. This submission is stored locally in this browser session only.';
    return { remote: false };
  }
  const attempts = supabaseSubmissionPayloadAttempts(surveyResponse);
  let lastError = null;
  let rows = null;
  let insertedPayload = attempts[0];
  for (const attempt of attempts) {
    try {
      rows = await supabaseRequest('survey_submissions', { method: 'POST', body: attempt });
      insertedPayload = attempt;
      lastError = null;
      break;
    } catch (error) {
      lastError = error;
      if (!isUnknownSupabaseColumnError(error)) throw error;
      console.warn('Supabase survey insert skipped a payload shape because the schema cache did not recognise a column.', error.details || error);
    }
  }
  if (lastError) throw lastError;
  state.surveySubmissions.unshift(normaliseSurveySubmission(rows && rows[0] ? rows[0] : {...insertedPayload, created_at: new Date().toISOString()}));
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
    state.databaseStatus = 'Using local pilot data until the Supabase project URL and anon key are added in `supabase-config.js`.';
    render();
    return;
  }
  try {
    const [submissions, suggestedFactors] = await Promise.all([
      supabaseRequest('survey_submissions', { query: '?select=*&order=created_at.desc' }),
      supabaseRequest('stakeholder_suggested_factors', { query: '?select=*&order=created_at.desc' })
    ]);
    state.surveySubmissions = (submissions || []).map(normaliseSurveySubmission);
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
  return surveyFactorQuestions[factor.factor_name] || 'How important is "' + factor.factor_name + '" when assessing whether an industrial building should be adaptively reused for residential use?';
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
function selectedTopFactorIds() { return state.surveyFactorRanking.slice(0, 3); }
function selectedReuseOutcomes() { return reuseOutcomeOptions.filter(option => Object.prototype.hasOwnProperty.call(state.preferredReuseOutcomeRatings, option.id)).map(option => option.label); }
function shouldAskProjectLocation(value = state.projectInvolvement) { return value === 'Yes, indirectly' || value === 'Yes, directly'; }
function stakeholderGroupLabel(key) {
  const clean = String(key || '').trim();
  const match = stakeholderWeightGroups.find(group => group.key === clean || group.label === clean);
  if (match) return match.label;
  const canonicalKey = stakeholderGroupKey(clean);
  return (stakeholderWeightGroups.find(group => group.key === canonicalKey) || { label: clean }).label;
}
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
function factorRankingInSync(selected = selectedQuestionnaireFactors()) {
  const selectedIds = selected.map(factor => factor.id);
  if (state.surveyFactorRanking.length !== selectedIds.length) return false;
  const rankedIds = new Set(state.surveyFactorRanking);
  return selectedIds.every(id => rankedIds.has(id));
}
function derivedFactorWeightRows(selected = selectedQuestionnaireFactors()) {
  cleanQuestionnaireSelection();
  const selectedById = Object.fromEntries(selected.map(factor => [factor.id, factor]));
  const ranking = state.surveyFactorRanking.filter(id => selectedById[id]);
  const n = ranking.length;
  const rawTotal = n * (n + 1) / 2 || 1;
  return ranking.map((id, index) => {
    const factor = selectedById[id];
    const rawScore = n - index;
    const weight = rawScore / rawTotal;
    return { factor, id, rank: index + 1, rawScore, weight, percent: weight * 100 };
  }).filter(row => row.factor);
}
function factorRatingRows(selected = selectedQuestionnaireFactors()) {
  return selected.map(factor => ({ factor, id: factor.id, rating: Number(surveyRating(factor.id)) })).filter(row => Number.isFinite(row.rating));
}
function sliderDerivedFactorWeights(selected = selectedQuestionnaireFactors()) {
  const rows = factorRatingRows(selected);
  const total = rows.reduce((sum, row) => sum + Math.max(0, row.rating), 0) || rows.length || 1;
  return Object.fromEntries(rows.map(row => [row.id, Number((Math.max(0, row.rating) / total).toFixed(6))]));
}
function sliderDerivedRawScores(selected = selectedQuestionnaireFactors()) {
  return Object.fromEntries(factorRatingRows(selected).map(row => [row.id, row.rating]));
}
function derivedFactorWeights(selected = selectedQuestionnaireFactors()) {
  return sliderDerivedFactorWeights(selected);
}
function derivedFactorRawScores(selected = selectedQuestionnaireFactors()) {
  return sliderDerivedRawScores(selected);
}
function cleanQuestionnaireSelection() {
  const validIds = new Set(questionnaireFactorPool().map(factor => factor.id));
  state.surveySelectedFactorIds = state.surveySelectedFactorIds.filter(id => validIds.has(id)).slice(0, maxSurveyFactors);
  const selectedIds = new Set(state.surveySelectedFactorIds);
  Object.keys(state.surveyRatings).forEach(id => { if (!selectedIds.has(id)) delete state.surveyRatings[id]; });
  state.surveyFactorRanking = state.surveyFactorRanking.filter(id => selectedIds.has(id));
  state.surveySelectedFactorIds.forEach(id => { if (!state.surveyFactorRanking.includes(id)) state.surveyFactorRanking.push(id); });
  state.surveyTopFactors = state.surveyFactorRanking.slice(0, 3);
  state.expandedSurveyFactorIds = state.expandedSurveyFactorIds.filter(id => validIds.has(id));
}
function toggleQuestionnaireFactor(factorId) {
  const selected = state.surveySelectedFactorIds.includes(factorId);
  if (selected) state.surveySelectedFactorIds = state.surveySelectedFactorIds.filter(id => id !== factorId);
  else if (state.surveySelectedFactorIds.length < maxSurveyFactors) state.surveySelectedFactorIds.push(factorId);
  cleanQuestionnaireSelection();
  setSurveyInProgress();
}
function surveySummaryText(factor) {
  const text = surveyExplanation(factor).replace(/\s+/g, ' ').trim();
  const sentence = text.match(/.*?[.!?](\s|$)/);
  return (sentence ? sentence[0] : text).trim();
}
function toggleSurveyFactorDetails(factorId) {
  state.expandedSurveyFactorIds = state.expandedSurveyFactorIds.includes(factorId)
    ? state.expandedSurveyFactorIds.filter(id => id !== factorId)
    : [...state.expandedSurveyFactorIds, factorId];
  renderSurveyCriteria();
}
function moveRankingFactor(factorId, direction) {
  cleanQuestionnaireSelection();
  const index = state.surveyFactorRanking.indexOf(factorId);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= state.surveyFactorRanking.length) return;
  const ranking = state.surveyFactorRanking.slice();
  [ranking[index], ranking[nextIndex]] = [ranking[nextIndex], ranking[index]];
  state.surveyFactorRanking = ranking;
  state.surveyTopFactors = ranking.slice(0, 3);
  setSurveyInProgress();
  renderSurveyCriteria();
}
function moveRankingFactorBefore(dragId, targetId) {
  if (!dragId || !targetId || dragId === targetId) return;
  const ranking = state.surveyFactorRanking.filter(id => id !== dragId);
  const targetIndex = ranking.indexOf(targetId);
  ranking.splice(targetIndex < 0 ? ranking.length : targetIndex, 0, dragId);
  state.surveyFactorRanking = ranking;
  state.surveyTopFactors = ranking.slice(0, 3);
  setSurveyInProgress();
  renderSurveyCriteria();
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
      responseCount: shouldUseSubmissionData() ? surveyFactorSelectionCount(factor.id, groupKey) : surveyValuesForDimension(factor.dimension, groupKey).length,
      totalResponses: shouldUseSubmissionData() ? surveySubmissionsForGroup(groupKey).length : surveyValuesForDimension(factor.dimension, groupKey).length,
      averageRank: surveyAverageRankForFactor(factor.id, groupKey)
    };
  }).sort((a,b) => (b.score ?? -1) - (a.score ?? -1) || a.factor_name.localeCompare(b.factor_name));
}
function surveyOutcomeSummaryRows(groupKey = state.surveyResultGroup) {
  const submissions = shouldUseSubmissionData()
    ? state.surveySubmissions.filter(submission => groupKey === 'All' || stakeholderGroupKey(submission.stakeholder_group_key || submission.stakeholder_group) === groupKey)
    : [];
  return reuseOutcomeOptions.map(option => {
    const values = submissions
      .map(submission => normalizedOutcomeRatings(submission)[option.id])
      .filter(value => Number.isFinite(Number(value)));
    const counts = outcomeLikelihoodScale.map(scale => values.filter(value => Number(value) === scale.value).length);
    const maxCount = Math.max(0, ...counts);
    const mostCommonIndex = counts.findIndex(count => count === maxCount);
    const average = values.length ? mean(values.map(Number)) : null;
    const distribution = counts.map(count => values.length ? Math.round(count / values.length * 100) + '%' : '0%');
    const selectedCount = values.filter(value => Number(value) >= 2).length;
    return {
      ...option,
      average,
      responseCount: values.length,
      selectedCount,
      selectedPercent: values.length ? Math.round(selectedCount / values.length * 100) : 0,
      mostCommon: values.length ? outcomeLikelihoodScale[mostCommonIndex].label : 'Awaiting response',
      distribution
    };
  });
}
function mergedFactors() {
  const literature = selectedSurveyFactors().map(factor => ({ type: 'Literature', name: factor.factor_name, dimension: factor.dimension, source: factor.literature_source, include: true }));
  const stakeholder = state.stakeholderFactors.map(factor => ({ type: 'Stakeholder', name: factor.factor_name, dimension: factor.related_dimension, source: stakeholderGroupDisplay(factor.stakeholder_group) + ' - ' + factor.suggested_by, include: factor.include_in_final_model }));
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
  if (!rows.length) return 'No buildings match the selected filters. Try broadening the district, vacancy or score range.';
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
    {
      group: 'Planning route',
      items: [
        {
          item: 'OZP / zoning check',
          status: isResidential ? 'Complete' : isBusiness ? 'Partial' : 'Pending',
          implication: 'Verify whether residential use is permitted, requires S.16 permission, or may require S.12A rezoning.',
          evidence: 'Current zoning: ' + building.zoning
        },
        {
          item: 'Town Planning Board route: S.16 or S.12A may be required',
          status: isResidential ? 'Partial' : 'Pending',
          implication: 'Confirm the statutory route before treating the site as a residential conversion candidate.',
          evidence: isResidential ? 'Residential zoning is indicated, but application requirements still need confirmation.' : 'Planning permission or rezoning route may be required.'
        }
      ]
    },
    {
      group: 'Land and lease',
      items: [
        {
          item: 'Land lease review',
          status: 'Unknown',
          implication: 'Lease restrictions, waiver conditions or land premium may affect conversion feasibility.',
          evidence: 'Lease conditions are not verified in the sample dataset.'
        },
        {
          item: 'Lease modification / waiver / premium uncertainty',
          status: 'Unknown',
          implication: 'Check whether lease modification, waiver approval or premium payment would be required.',
          evidence: building.constraints || 'Lease and premium assumptions require verification.'
        }
      ]
    },
    {
      group: 'Building compliance',
      items: [
        {
          item: 'Building Ordinance compliance',
          status: building.age > 55 ? 'High risk' : 'Pending',
          implication: 'Older buildings may require more substantial code, structure and accessibility review before residential use.',
          evidence: building.age + ' years old'
        },
        {
          item: 'Fire safety and means of escape',
          status: building.safety >= 70 ? 'Partial' : 'Pending',
          implication: 'Residential conversion may require major fire services, compartmentation and escape route upgrades.',
          evidence: 'Indicative safety score ' + building.safety
        },
        {
          item: 'Natural lighting and ventilation',
          status: building.design >= 70 ? 'Partial' : 'Pending',
          implication: 'Confirm that future residential units can meet daylight, ventilation and health expectations.',
          evidence: 'Indicative design adaptability score ' + building.design
        },
        {
          item: 'Barrier-free access',
          status: building.services >= 70 ? 'Partial' : 'Pending',
          implication: 'Audit lifts, stairs, cores and accessible routes for residential occupation and emergency movement.',
          evidence: 'Indicative services score ' + building.services
        }
      ]
    },
    {
      group: 'Environmental and feasibility',
      items: [
        {
          item: 'Environmental compatibility',
          status: building.risk === 'Low' ? 'Partial' : building.risk === 'High' ? 'High risk' : 'Pending',
          implication: 'Check noise, air quality and industrial interface risks before assuming residential suitability.',
          evidence: building.risk + ' environmental risk'
        },
        {
          item: 'Noise / air quality / industrial interface screening',
          status: building.compatibility === 'High' ? 'Partial' : building.compatibility === 'Low' ? 'High risk' : 'Pending',
          implication: 'Assess remaining industrial, logistics, traffic and pollution interfaces within the surrounding area.',
          evidence: building.compatibility + ' residential compatibility'
        },
        {
          item: 'Cost feasibility study',
          status: building.economic >= 70 ? 'Partial' : 'Pending',
          implication: 'Test whether retrofit, compliance and lease costs remain proportionate to housing and social benefit.',
          evidence: 'Indicative economic viability score ' + building.economic
        }
      ]
    }
  ];
}
function renderRegulatoryPathwayChecklist(building) {
  return '<section class="pathway-checklist"><div class="pathway-heading"><div><h3>Regulatory Pathway Checklist</h3><p>Indicative checklist for identifying statutory, lease, building-control and environmental issues before residential conversion.</p></div><span class="status-badge verification">Subject to verification</span></div>' +
    '<p class="pathway-disclaimer">This checklist supports early-stage screening only and does not replace formal planning, lands, building-control or environmental review.</p>' +
    '<div class="pathway-groups">' + regulatoryChecklist(building).map(group =>
      '<section class="pathway-group"><h4>'+h(group.group)+'</h4><div class="pathway-items">' + group.items.map(entry =>
        '<article class="pathway-item"><header><strong>'+h(entry.item)+'</strong>'+statusBadge(entry.status)+'</header><p>'+h(entry.implication)+'</p><small>'+h(entry.evidence)+'</small></article>'
      ).join('') + '</div></section>'
    ).join('') + '</div></section>';
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
  state.surveyReviewOpen = false;
  updateSurveyResultAccess();
}
function teamAccessUnlocked() { return !!state.teamAccessUnlocked; }
function tabAllowedByAccess(tabName) {
  if (!teamAccessUnlocked()) return tabName === 'survey';
  return true;
}
function setAccessStateMessage(message, type = '') {
  const el = document.getElementById('accessStateMessage');
  if (!el) return;
  el.textContent = message || '';
  el.className = 'access-state-message' + (type ? ' ' + type : '');
  if (message) window.setTimeout(() => {
    if (el.textContent === message) el.textContent = '';
  }, 4500);
}
function renderAccessState() {
  const unlocked = teamAccessUnlocked();
  document.body.classList.toggle('participant-view', !unlocked);
  document.body.classList.toggle('team-access-unlocked', unlocked);
  const title = document.getElementById('appTitle');
  const subtitle = document.getElementById('appSubtitle');
  const credit = document.getElementById('appCredit');
  if (title) title.textContent = unlocked ? 'Hong Kong Industrial Building Reuse Suitability Dashboard' : 'Adaptive Reuse Stakeholder Questionnaire';
  if (subtitle) subtitle.textContent = unlocked
    ? 'An indicative decision-support tool for screening industrial-to-residential adaptive reuse opportunities.'
    : 'Please complete this questionnaire to share your views on industrial-building reuse and redevelopment outcomes.';
  if (credit) credit.textContent = unlocked
    ? 'Academic research prototype. Outputs are indicative and subject to verification.'
    : 'This questionnaire is for academic research purposes. Responses will be treated with confidentiality.';
  const descriptionToggle = document.getElementById('headerDescriptionToggle');
  const description = document.getElementById('headerDescription');
  if (descriptionToggle) descriptionToggle.hidden = !unlocked;
  if (!unlocked && description) {
    description.classList.remove('is-open');
    description.setAttribute('aria-hidden', 'true');
    if (descriptionToggle) descriptionToggle.setAttribute('aria-expanded', 'false');
  }
  const accessButton = document.getElementById('projectTeamAccess');
  const lockButton = document.getElementById('lockTeamAccess');
  if (accessButton) accessButton.hidden = unlocked;
  if (lockButton) lockButton.hidden = !unlocked;
}
function closeTeamAccessModal() {
  const modal = document.getElementById('teamAccessModal');
  const message = document.getElementById('teamAccessMessage');
  const input = document.getElementById('teamAccessCode');
  if (!modal) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  if (message) message.textContent = '';
  if (input) input.value = '';
}
function openTeamAccessModal() {
  const modal = document.getElementById('teamAccessModal');
  const input = document.getElementById('teamAccessCode');
  if (!modal) return;
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  if (input) window.setTimeout(() => input.focus(), 0);
}
function unlockTeamAccess() {
  state.teamAccessUnlocked = true;
  writeStoredTeamAccess(true);
  renderAccessState();
  updateViewModeTabs();
  openInitialTab();
  setAccessStateMessage('Full dashboard access unlocked.', 'success');
}
function lockTeamAccess() {
  state.teamAccessUnlocked = false;
  state.viewMode = 'research';
  writeStoredTeamAccess(false);
  if (window.location.hash && window.location.hash !== '#survey') window.history.replaceState(null, '', '#survey');
  renderAccessState();
  updateViewModeTabs();
  activateTab('survey');
  setAccessStateMessage('Returned to participant view.', 'success');
}
function activateTab(tabName) {
  if (!tabAllowedByAccess(tabName)) tabName = 'survey';
  if (tabName === 'survey-results' && !teamAccessUnlocked() && !state.surveyResultsUnlocked) return;
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
  const hiddenByAccess = !teamAccessUnlocked();
  const hiddenBySurveyFlow = !teamAccessUnlocked() && !state.surveyResultsUnlocked;
  resultTab.hidden = hiddenByAccess || modeHidden || hiddenBySurveyFlow;
  resultTab.disabled = hiddenByAccess || hiddenBySurveyFlow;
  resultTab.setAttribute('aria-hidden', String(resultTab.hidden));
  if ((hiddenByAccess || hiddenBySurveyFlow) && document.getElementById('survey-results')?.classList.contains('active')) activateTab('survey');
}
function updateViewModeTabs() {
  if (!teamAccessUnlocked()) state.viewMode = 'research';
  renderAccessState();
  document.body.classList.toggle('research-mode', state.viewMode === 'research' || !teamAccessUnlocked());
  document.querySelectorAll('[data-view-mode]').forEach(button => {
    button.classList.toggle('active', button.dataset.viewMode === state.viewMode);
  });
  document.querySelectorAll('.tab[data-mode]').forEach(tab => {
    tab.hidden = !teamAccessUnlocked() ? tab.dataset.tab !== 'survey' : tab.dataset.mode !== state.viewMode;
  });
  updateSurveyResultAccess();
  const activeTab = document.querySelector('.tab.active');
  if (!teamAccessUnlocked()) {
    activateTab('survey');
    return;
  }
  if (!activeTab || activeTab.hidden) activateTab(state.viewMode === 'decision' ? 'overview' : 'survey');
}
function validTabNameFromHash() {
  const tabName = decodeURIComponent((window.location.hash || '').replace(/^#/, '')).trim();
  if (!tabName) return '';
  if (!tabAllowedByAccess(tabName)) return '';
  const tab = document.querySelector('.tab[data-tab="'+tabName+'"]');
  const panel = document.getElementById(tabName);
  if (!tab || !panel) return '';
  if (tabName === 'survey-results' && !teamAccessUnlocked() && !state.surveyResultsUnlocked) return '';
  return tabName;
}
function openInitialTab() {
  const tabName = validTabNameFromHash() || 'survey';
  const tab = document.querySelector('.tab[data-tab="'+tabName+'"]');
  if (tab?.dataset.mode) state.viewMode = tab.dataset.mode;
  updateViewModeTabs();
  activateTab(tabName);
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
    ? ['Location','Regulatory','Economic','Feasibility','Design','Services','Safety','Environmental']
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
  const tags = '<div class="card-tags"><span class="status-badge prototype">Prototype</span><span class="status-badge indicative">Indicative score</span><span class="status-badge verification">Subject to verification</span></div>';
  el.innerHTML = top
    ? tags + '<h2>Key planning insight</h2><p>The current model identifies <strong>'+h(high.length)+'</strong> high-potential industrial building'+(high.length === 1 ? '' : 's')+' for residential adaptive reuse among the visible records. The strongest candidates combine good transport accessibility, compatible planning context, manageable ownership structure and strong housing demand.</p><div class="insight-metrics"><span><em>Average indicative score</em><strong>'+h(avg)+'</strong></span><span><em>Top-ranked building</em><strong>'+h(top.name)+'</strong></span></div><p><strong>Main planning implication:</strong> '+h(mainPlanningImplication(rows))+'</p><small>Scores are indicative and intended for early-stage screening only.</small>'
    : tags + '<h2>Key planning insight</h2><p>No buildings match the selected filters. Try broadening the district, vacancy or score range before drawing planning conclusions.</p><small>Scores are indicative and intended for early-stage screening only.</small>';
}
function render() {
  const rows = filtered();
  const all = scored();
  const selected = all.find(b => b.id === state.selected) || all[0];
  renderExecutiveInsight(rows);
  renderFilterSummary(rows.length, all.length);
  const overviewKpis = [
    { label: 'Buildings assessed', value: fmt.format(all.length), helper: 'Indicative records in the dataset', tag: 'Prototype' },
    { label: 'Visible after filters', value: rows.length ? fmt.format(rows.length) : '0', helper: 'Current selection', tag: 'Indicative score' },
    { label: 'Average age', value: rows.length ? Math.round(mean(rows.map(b => b.age))) + ' yrs' : 'No matches', helper: 'Approximate stock age', tag: 'Early-stage screening' },
    { label: 'Total GFA', value: rows.length ? fmt.format(rows.reduce((s,b)=>s+b.floorArea,0))+' sqm' : 'No matches', helper: 'Approximate reusable floor area', tag: 'Subject to verification' },
    { label: 'High-potential candidates', value: fmt.format(highPotentialBuildings(rows).length), helper: 'Indicative only', tag: 'High indicative suitability' }
  ];
  document.getElementById('kpis').innerHTML = overviewKpis.map(item => '<div class="kpi kpi-card"><span>'+h(item.tag)+'</span><strong>'+h(item.value)+'</strong><em>'+h(item.label)+'</em><small>'+h(item.helper)+'</small></div>').join('');
  const cat = document.getElementById('categoryChart'); cat.innerHTML = '';
  ['High','Medium','Lower conversion priority'].forEach(c => bar(cat, categoryLabel(c), rows.filter(b=>b.category===c).length, rows.length || 1, categoryColor[c]));
  const district = document.getElementById('districtChart'); district.innerHTML = '';
  [...new Set(rows.map(b=>b.district))].map(d => {
    const ds = rows.filter(b=>b.district===d);
    return [d, Math.round(ds.reduce((s,b)=>s+b.score,0)/ds.length)];
  }).sort((a,b)=>b[1]-a[1]).forEach(([d,v]) => bar(district, d, v, 100, '#2563eb'));
  if (!rows.length) empty(district, 'No district results match the selected filters. Try broadening the district, vacancy or score range.');
  const top = document.getElementById('topChart'); top.innerHTML = '';
  if (rows.length) rows.slice(0,8).forEach(b => bar(top, b.id + ' ' + b.name, b.score, 100, categoryColor[b.category]));
  else empty(top, 'No buildings match the selected filters. Try broadening the district, vacancy or score range.');
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
  const cards = byDimension.map(group => {
    if (!group.factors.length) return '';
    return '<section class="factor-choice-group"><h4>'+h(group.label)+'</h4><div class="factor-choice-grid">' + group.factors.map(factor => {
      const isSelected = state.surveySelectedFactorIds.includes(factor.id);
      const isDisabled = !isSelected && state.surveySelectedFactorIds.length >= maxSurveyFactors;
      const isExpanded = state.expandedSurveyFactorIds.includes(factor.id);
      return '<article class="factor-choice-card '+(isSelected ? 'selected' : '')+' '+(isDisabled ? 'disabled' : '')+'" data-questionnaire-factor-card="'+h(factor.id)+'" role="button" tabindex="'+(isDisabled ? '-1' : '0')+'" aria-pressed="'+(isSelected ? 'true' : 'false')+'" aria-disabled="'+(isDisabled ? 'true' : 'false')+'"><div class="factor-choice-head"><strong>'+explainTerms(factor.factor_name)+'</strong>'+(isSelected ? '<span class="factor-selected-badge">Selected</span>' : '')+'</div><p>'+explainTerms(surveySummaryText(factor))+'</p><button data-factor-details="'+h(factor.id)+'" class="text-link-button factor-detail-toggle" type="button" aria-expanded="'+(isExpanded ? 'true' : 'false')+'">'+(isExpanded ? 'Hide details' : 'Show details')+'</button><div class="factor-detail '+(isExpanded ? 'is-open' : '')+'">'+explainTerms(surveyExplanation(factor))+'</div></article>';
    }).join('') + '</div></section>';
  }).join('');
  const limitMessage = state.surveySelectedFactorIds.length >= maxSurveyFactors ? '<p class="selection-warning">Maximum 10 factors selected. Deselect one factor before adding another.</p>' : '';
  return '<div class="factor-selection-panel"><div class="selection-heading"><strong>Select 5 to 10 key factors</strong><span>Selected '+h(state.surveySelectedFactorIds.length)+' / '+h(maxSurveyFactors)+' factors</span></div><p class="map-note">Select 5 to 10 factors that you consider important for assessing industrial-to-residential adaptive reuse suitability. Then rank all selected factors and use slider bars to rate their importance.</p>'+limitMessage+'<div class="factor-choice-layout">'+cards+'</div></div>';
}
function renderRankingList(selected) {
  const selectedById = Object.fromEntries(selected.map(factor => [factor.id, factor]));
  const items = state.surveyFactorRanking.filter(id => selectedById[id]).map((id, index) => {
    const factor = selectedById[id];
    return '<article class="ranking-item" draggable="true" data-ranking-id="'+h(id)+'"><span class="rank-number">'+h(index + 1)+'</span><div><strong>'+explainTerms(factor.factor_name)+'</strong><em>'+h(dimensionLabel(factor.dimension))+'</em></div><div class="rank-actions"><button data-rank-move="up" data-ranking-id="'+h(id)+'" type="button" '+(index === 0 ? 'disabled' : '')+'>Up</button><button data-rank-move="down" data-ranking-id="'+h(id)+'" type="button" '+(index === state.surveyFactorRanking.length - 1 ? 'disabled' : '')+'>Down</button></div></article>';
  }).join('');
  const emptyMessage = selected.length
    ? '<p class="map-note">Ranking will be complete when all selected factors appear here.</p>'
    : '<div class="empty-state">Select between 5 and 10 factors to create the ranking list.</div>';
  return '<div class="ranking-panel"><div class="selection-heading"><strong>Ranking</strong><span>'+h(selected.length)+' selected</span></div><p class="map-note">Drag to reorder the selected factors. Rank 1 means the most important factor.</p>'+(items ? '<div class="ranking-list">'+items+'</div>' : emptyMessage)+'</div>';
}
function renderImportanceSliders(selected) {
  if (!selected.length) return '<div class="importance-slider-panel"><div class="selection-heading"><strong>Importance weighting</strong><span>0-100 slider</span></div><p class="map-note">Select between 5 and 10 factors first. Slider bars will appear here for the factors you selected.</p><div class="empty-state">Select factors to rate their importance.</div></div>';
  return '<div class="importance-slider-panel"><div class="selection-heading"><strong>Importance weighting</strong><span>'+h(selected.length)+' sliders</span></div><p class="map-note">Use the slider bars to rate the importance of each selected factor from 0 to 100.</p><div class="importance-slider-list">' + selected.map(factor => {
    const value = surveyRating(factor.id);
    return '<label class="importance-slider-row"><span><strong>'+explainTerms(factor.factor_name)+'</strong><em>'+h(dimensionLabel(factor.dimension))+'</em><b>'+h(value)+'/100</b></span><input data-survey-rating="'+h(factor.id)+'" type="range" min="0" max="100" value="'+h(value)+'" /><div class="slider-scale"><small>0 Not important</small><small>50 Moderate</small><small>100 Very important</small></div></label>';
  }).join('') + '</div></div>';
}
function renderStakeholderBackgroundQuestions() {
  if (!state.participantGroup) return '';
  const statutoryQuestion = state.participantGroup === 'Statutory body'
    ? '<label>Is your statutory body primarily public-sector or private-sector related?<select id="statutoryBodyType"><option value="">Select answer</option>'+statutoryBodyTypeOptions.map(option => '<option>'+h(option)+'</option>').join('')+'</select></label>'
    : '';
  const projectLocationQuestion = shouldAskProjectLocation()
    ? '<label>Where was the adaptive reuse or redevelopment project located?<span class="field-helper">Optional. Select the main project location if applicable.</span><select id="projectLocation"><option value="">Select project location</option>'+projectLocationOptions.map(option => '<option>'+h(option)+'</option>').join('')+'</select></label>'
    : '';
  return statutoryQuestion + '<label>Do you have knowledge or experience related to adaptive reuse or redevelopment?<select id="adaptiveReuseKnowledge"><option value="">Select answer</option>'+stakeholderKnowledgeOptions.map(option => '<option>'+h(option)+'</option>').join('')+'</select></label>' +
    '<label>Have you been involved in any adaptive reuse or redevelopment project?<select id="projectInvolvement"><option value="">Select answer</option>'+projectInvolvementOptions.map(option => '<option>'+h(option)+'</option>').join('')+'</select></label>' + projectLocationQuestion;
}
function renderOutcomeLikelihoodScale() {
  const rows = reuseOutcomeOptions.map(option => {
    const selectedValue = Number(state.preferredReuseOutcomeRatings[option.id]);
    const isChecked = Object.prototype.hasOwnProperty.call(state.preferredReuseOutcomeRatings, option.id);
    const cells = outcomeLikelihoodScale.filter(scale => scale.value > 1).map(scale => {
      const checked = selectedValue === scale.value;
      return '<label class="likelihood-option '+(checked ? 'selected' : '')+'"><input data-reuse-likelihood="'+h(option.id)+'" name="reuse-likelihood-'+h(option.id)+'" type="radio" value="'+h(scale.value)+'" '+(checked ? 'checked' : '')+' /><span>'+h(scale.label)+'</span></label>';
    }).join('');
    return '<div class="outcome-likelihood-row '+(isChecked ? 'selected' : '')+'"><label class="outcome-check"><input data-reuse-outcome-toggle="'+h(option.id)+'" type="checkbox" '+(isChecked ? 'checked' : '')+' /><span>'+h(option.label)+'</span></label>'+(isChecked ? '<div class="likelihood-followup"><strong>How likely?</strong><div class="likelihood-options">'+cells+'</div>'+(selectedValue >= 2 ? '' : '<em>Please select a likelihood level.</em>')+'</div>' : '')+'</div>';
  }).join('');
  return '<div class="reuse-outcome-box"><h3>Preferred reuse / redevelopment outcome</h3><p class="map-note">Tick the outcomes you may support, then indicate how likely you would support each selected outcome. Unticked outcomes will be treated as \'Not likely\'.</p><div class="outcome-likelihood-table">'+rows+'</div></div>';
}
function renderSurveyReviewPanel(selected) {
  if (!state.surveyReviewOpen) return '';
  const ranked = state.surveyFactorRanking.map((id, index) => {
    const factor = selected.find(item => item.id === id);
    return factor ? '<li><strong>'+h(index + 1)+'.</strong> '+h(factor.factor_name)+'</li>' : '';
  }).filter(Boolean).join('');
  const sliderRatings = factorRatingRows(selected).map(row => '<li><strong>'+h(row.factor.factor_name)+'</strong><span>'+h(row.rating)+'/100</span></li>').join('');
  const outcomes = outcomeRatingsAsLabels().map(([label, value]) => '<li><strong>'+h(label)+'</strong><span>'+h(value)+'</span></li>').join('');
  const statutoryReview = state.participantGroup === 'Statutory body' ? '<div><dt>Statutory body type</dt><dd>'+h(state.statutoryBodyType || 'Not provided')+'</dd></div>' : '';
  const ownershipReview = state.participantGroup === 'Building owner / landlord' ? '<div><dt>Ownership type</dt><dd>'+h(state.industrialOwnershipType || 'Not provided')+'</dd></div>' : '';
  const projectLocationReview = shouldAskProjectLocation() ? '<div><dt>Project location</dt><dd>'+h(state.projectLocation || 'Not specified')+'</dd></div>' : '';
  return '<div id="surveyReviewPanel" class="survey-review-panel"><h3>Response summary before confirmation</h3><p class="review-intro">Please check your answers below before final submission.</p><dl><div><dt>Stakeholder group</dt><dd>'+h(state.participantGroup || 'Not provided')+'</dd></div>'+statutoryReview+ownershipReview+'<div><dt>Knowledge or experience related to adaptive reuse or redevelopment</dt><dd>'+h(state.adaptiveReuseKnowledge || 'Not provided')+'</dd></div><div><dt>Project involvement</dt><dd>'+h(state.projectInvolvement || 'Not provided')+'</dd></div>'+projectLocationReview+'</dl><h4>Selected factors and ranking</h4><ol class="review-ranking">'+ranked+'</ol><h4>Importance weighting scores</h4><p class="map-note">These scores come from the 0-100 slider bars for your selected factors.</p><ul class="review-ratings">'+sliderRatings+'</ul><h4>Preferred reuse / redevelopment outcome</h4><ul class="review-ratings">'+outcomes+'</ul><div class="review-actions"><button id="editSurveyResponse" class="ghost-button" type="button">Edit response</button><button id="confirmSurveySubmission" class="primary-button" type="button">Confirm submission</button></div></div>';
}
function renderSurveyCriteria() {
  cleanQuestionnaireSelection();
  const pool = questionnaireFactorPool();
  const selected = selectedQuestionnaireFactors();
  const ownershipQuestion = state.participantGroup === 'Building owner / landlord'
    ? '<label>Ownership type<select id="industrialOwnershipType"><option value="">Select ownership type</option><option>Sole ownership of entire building</option><option>Multi-ownership building</option></select></label>'
    : '';
  document.getElementById('surveyCriteriaList').innerHTML =
    '<div class="criteria-card participant-card"><header><strong>Participant profile</strong><span>Required</span></header><label>Stakeholder group<select id="surveyParticipantGroup"><option value="">Select stakeholder group</option>'+surveyStakeholderGroups.map(group => '<option>'+h(group)+'</option>').join('')+'</select></label>'+ownershipQuestion+renderStakeholderBackgroundQuestions()+'</div>' +
    renderQuestionnaireFactorTable(pool);
  const participantGroup = document.getElementById('surveyParticipantGroup');
  participantGroup.value = state.participantGroup;
  participantGroup.onchange = e => {
    state.participantGroup = e.target.value;
    if (state.participantGroup !== 'Building owner / landlord') state.industrialOwnershipType = '';
    if (state.participantGroup !== 'Statutory body') state.statutoryBodyType = '';
    state.adaptiveReuseKnowledge = '';
    state.projectInvolvement = '';
    state.projectLocation = '';
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
  const statutoryBodyType = document.getElementById('statutoryBodyType');
  if (statutoryBodyType) {
    statutoryBodyType.value = state.statutoryBodyType;
    statutoryBodyType.onchange = e => {
      state.statutoryBodyType = e.target.value;
      setSurveyInProgress();
      updateSurveySummary();
    };
  }
  const adaptiveReuseKnowledge = document.getElementById('adaptiveReuseKnowledge');
  if (adaptiveReuseKnowledge) {
    adaptiveReuseKnowledge.value = state.adaptiveReuseKnowledge;
    adaptiveReuseKnowledge.onchange = e => {
      state.adaptiveReuseKnowledge = e.target.value;
      setSurveyInProgress();
      updateSurveySummary();
    };
  }
  const projectInvolvement = document.getElementById('projectInvolvement');
  if (projectInvolvement) {
    projectInvolvement.value = state.projectInvolvement;
    projectInvolvement.onchange = e => {
      state.projectInvolvement = e.target.value;
      if (!shouldAskProjectLocation()) state.projectLocation = '';
      setSurveyInProgress();
      renderSurveyCriteria();
    };
  }
  const projectLocation = document.getElementById('projectLocation');
  if (projectLocation) {
    projectLocation.value = state.projectLocation;
    projectLocation.onchange = e => {
      state.projectLocation = e.target.value;
      setSurveyInProgress();
      updateSurveySummary();
    };
  }
  document.querySelectorAll('[data-questionnaire-factor-card]').forEach(card => {
    const selectCard = e => {
      if (e.target.closest('[data-factor-details]')) return;
      toggleQuestionnaireFactor(e.currentTarget.dataset.questionnaireFactorCard);
      renderSurveyCriteria();
    };
    card.onclick = selectCard;
    card.onkeydown = e => {
      if (e.target.closest('[data-factor-details]')) return;
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      toggleQuestionnaireFactor(e.currentTarget.dataset.questionnaireFactorCard);
      renderSurveyCriteria();
    };
  });
  const submitButtonHtml = state.surveyReviewOpen ? '' : '<button id="submitSurvey" class="primary-button" type="button">Submit survey</button>';
  document.getElementById('surveyPreview').innerHTML =
    '<div class="survey-banner"><strong>'+h(selected.length)+'</strong><span>participant-selected factors</span></div>' +
    renderRankingList(selected) +
    renderImportanceSliders(selected) +
    renderOutcomeLikelihoodScale() +
    submitButtonHtml +
    renderSurveyReviewPanel(selected) +
    '<div id="surveySubmitStatus" class="survey-submit-status" aria-live="polite"></div>';
  document.querySelectorAll('[data-factor-details]').forEach(button => button.onclick = e => {
    e.stopPropagation();
    toggleSurveyFactorDetails(e.currentTarget.dataset.factorDetails);
  });
  document.querySelectorAll('[data-rank-move]').forEach(button => button.onclick = e => {
    moveRankingFactor(e.currentTarget.dataset.rankingId, e.currentTarget.dataset.rankMove === 'up' ? -1 : 1);
  });
  document.querySelectorAll('[data-survey-rating]').forEach(input => input.oninput = e => {
    state.surveyRatings[e.target.dataset.surveyRating] = Number(e.target.value);
    setSurveyInProgress();
    renderSurveyCriteria();
  });
  document.querySelectorAll('[data-ranking-id][draggable="true"]').forEach(item => {
    item.ondragstart = e => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', e.currentTarget.dataset.rankingId);
      e.currentTarget.classList.add('dragging');
    };
    item.ondragend = e => e.currentTarget.classList.remove('dragging');
    item.ondragover = e => e.preventDefault();
    item.ondrop = e => {
      e.preventDefault();
      moveRankingFactorBefore(e.dataTransfer.getData('text/plain'), e.currentTarget.dataset.rankingId);
    };
  });
  document.querySelectorAll('[data-reuse-likelihood]').forEach(input => input.onchange = e => {
    state.preferredReuseOutcomeRatings[e.target.dataset.reuseLikelihood] = Number(e.target.value);
    setSurveyInProgress();
    renderSurveyCriteria();
  });
  document.querySelectorAll('[data-reuse-outcome-toggle]').forEach(input => input.onchange = e => {
    const id = e.target.dataset.reuseOutcomeToggle;
    if (e.target.checked) state.preferredReuseOutcomeRatings[id] = null;
    else delete state.preferredReuseOutcomeRatings[id];
    setSurveyInProgress();
    renderSurveyCriteria();
  });
  const submitSurveyButton = document.getElementById('submitSurvey');
  if (submitSurveyButton) submitSurveyButton.onclick = submitSurvey;
  const editSurveyResponse = document.getElementById('editSurveyResponse');
  if (editSurveyResponse) editSurveyResponse.onclick = () => { state.surveyReviewOpen = false; updateSurveySummary(); renderSurveyCriteria(); };
  const confirmSurveySubmission = document.getElementById('confirmSurveySubmission');
  if (confirmSurveySubmission) confirmSurveySubmission.onclick = confirmSurveySubmissionHandler;
  updateSurveySummary();
}
function updateSurveySummary() {
  const status = document.getElementById('surveySubmitStatus');
  if (!status) return;
  cleanQuestionnaireSelection();
  const selected = selectedQuestionnaireFactors();
  const missingParticipant = !state.participantGroup || (state.participantGroup === 'Building owner / landlord' && !state.industrialOwnershipType) || (state.participantGroup === 'Statutory body' && !state.statutoryBodyType);
  const missingBackground = !!state.participantGroup && (!state.adaptiveReuseKnowledge || !state.projectInvolvement);
  const tooFewFactors = selected.length < minSurveyFactors;
  const tooManyFactors = selected.length > maxSurveyFactors;
  const rankingMismatch = selected.length >= minSurveyFactors && selected.length <= maxSurveyFactors && !factorRankingInSync(selected);
  const missingOutcomeLikelihoods = !outcomeRatingsComplete();
  const participantMessage = !state.participantGroup
    ? 'Please select your stakeholder group.'
    : state.participantGroup === 'Statutory body' && !state.statutoryBodyType
      ? 'Please answer the statutory body follow-up question.'
      : state.participantGroup === 'Building owner / landlord' && !state.industrialOwnershipType
      ? 'Please select the ownership type.'
      : '';
  let message = '';
  let type = '';
  if (state.surveySubmitted) {
    message = 'Thank you. Your survey response has been submitted.';
    type = 'submitted';
  } else if (missingParticipant) {
    message = participantMessage;
    type = 'has-error';
  } else if (missingBackground) {
    message = 'Please complete the stakeholder background questions before submitting.';
    type = 'has-error';
  } else if (tooFewFactors) {
    message = 'Please select 5 to 10 key factors before ranking.';
    type = 'has-error';
  } else if (tooManyFactors) {
    message = 'You can select up to 10 key factors only.';
    type = 'has-error';
  } else if (rankingMismatch) {
    message = 'Please rank all selected factors before submitting.';
    type = 'has-error';
  } else if (missingOutcomeLikelihoods) {
    message = 'Please choose a likelihood level for each selected reuse / redevelopment outcome.';
    type = 'has-error';
  } else if (state.surveyReviewOpen) {
    message = 'Please review your response before final submission.';
  } else {
    message = 'You can now review your response before submission.';
  }
  status.className = 'survey-submit-status' + (type ? ' ' + type : '');
  status.innerHTML = '<strong>'+h(message)+'</strong>' + (state.surveySubmitted && teamAccessUnlocked() ? '<button id="seeSurveyResults" class="primary-button" type="button">See results</button>' : '');
  const seeResultsButton = document.getElementById('seeSurveyResults');
  if (seeResultsButton) seeResultsButton.onclick = () => activateTab('survey-results');
}
function submitSurvey() {
  cleanQuestionnaireSelection();
  const missingParticipant = !state.participantGroup || (state.participantGroup === 'Building owner / landlord' && !state.industrialOwnershipType) || (state.participantGroup === 'Statutory body' && !state.statutoryBodyType);
  const missingBackground = !!state.participantGroup && (!state.adaptiveReuseKnowledge || !state.projectInvolvement);
  const missingOutcomeLikelihoods = !outcomeRatingsComplete();
  const selected = selectedQuestionnaireFactors();
  const rankingMismatch = selected.length >= minSurveyFactors && selected.length <= maxSurveyFactors && !factorRankingInSync(selected);
  if (missingParticipant || missingBackground || missingOutcomeLikelihoods || rankingMismatch || selected.length < minSurveyFactors || selected.length > maxSurveyFactors) {
    setSurveyInProgress();
    updateSurveySummary();
    return;
  }
  state.surveyReviewOpen = true;
  renderSurveyCriteria();
  window.setTimeout(() => document.getElementById('surveyReviewPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
}
async function confirmSurveySubmissionHandler() {
  const status = document.getElementById('surveySubmitStatus');
  const selected = selectedQuestionnaireFactors();
  const submitButton = document.getElementById('submitSurvey');
  const confirmButton = document.getElementById('confirmSurveySubmission');
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
  }
  if (confirmButton) {
    confirmButton.disabled = true;
    confirmButton.textContent = 'Saving...';
  }
  try {
    await saveSurveySubmission(surveySubmissionPayload());
    state.surveySubmitted = true;
    state.surveyResultsUnlocked = true;
    state.surveyReviewOpen = false;
    state.weights = finalResearchWeights();
    state.researchWeights = state.weights.slice();
    updateSurveyResultAccess();
    renderSurveyResults();
    renderSurveyCriteria();
  } catch (error) {
    console.error('Survey submission failed', error.details || error);
    state.surveySubmitted = false;
    state.databaseStatus = 'Survey could not be saved to Supabase. Check the browser console, database policies and row-level security settings.';
    updateSurveySummary();
    if (status) status.insertAdjacentHTML('beforeend', '<span>Submission could not be saved. Please try again or contact the project team.</span>');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit survey';
    }
    if (confirmButton) {
      confirmButton.disabled = false;
      confirmButton.textContent = 'Confirm submission';
    }
  }
}
function renderStakeholderFactors() {
  const factors = state.stakeholderFactors;
  const merged = mergedFactors();
  document.getElementById('mergedFactorMeta').textContent = merged.filter(factor => factor.include).length + ' included of ' + merged.length + ' merged factors';
  document.getElementById('stakeholderFactorList').innerHTML =
    factors.map((factor, index) => '<div class="criteria-card"><header><strong>'+h(factor.factor_name)+'</strong><span>'+h(dimensionLabel(factor.related_dimension))+'</span></header><p>'+h(factor.comment)+'</p><dl><div><dt>Suggested by</dt><dd>'+h(factor.suggested_by)+'</dd></div><div><dt>Group</dt><dd>'+h(stakeholderGroupDisplay(factor.stakeholder_group))+'</dd></div></dl><label class="inline-check"><input data-stakeholder-include="'+index+'" type="checkbox" '+(factor.include_in_final_model ? 'checked' : '')+' /> Include in final model</label></div>').join('') +
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
    ['Average derived weight', scoredRows.length ? averageScore + '%' : 'Awaiting responses'],
    ['Data source', shouldUseSubmissionData() ? 'Supabase submissions' : 'Local pilot data']
  ].map(([label,value]) => '<div class="kpi"><span>'+h(label)+'</span><strong>'+h(value)+'</strong></div>').join('');
  document.getElementById('surveyResultKpis').insertAdjacentHTML('beforeend', renderStakeholderDistributionCard(filter, true));
  const factorChart = document.getElementById('surveyFactorChart');
  factorChart.innerHTML = '';
  if (scoredRows.length) scoredRows.forEach(row => bar(factorChart, row.factor_name, row.score, 100, '#0f766e'));
  else empty(factorChart, 'No survey responses recorded for this stakeholder group yet.');
  const outcomeRows = surveyOutcomeSummaryRows(filter);
  const outcomeSummary = document.getElementById('surveyOutcomeSummary');
  if (outcomeSummary) {
    const hasOutcomeData = outcomeRows.some(row => row.responseCount > 0);
    outcomeSummary.innerHTML = hasOutcomeData
      ? '<thead><tr><th>Outcome</th><th>Average likelihood</th><th>Ticked support</th><th>Most common response</th><th>Response distribution</th><th>Responses</th></tr></thead><tbody>' + outcomeRows.map(row => '<tr><td><strong>'+h(row.label)+'</strong></td><td>'+h(row.average === null ? 'Awaiting response' : row.average.toFixed(1) + '/4')+'</td><td>'+h(row.selectedCount)+' ('+h(row.selectedPercent)+'%)</td><td>'+h(row.mostCommon)+'</td><td>'+h(row.distribution.join(' / '))+'</td><td>'+h(row.responseCount)+'</td></tr>').join('') + '</tbody>'
      : '<tbody><tr><td colspan="6"><div class="empty-state">No preferred reuse / redevelopment outcome likelihood ratings recorded for this stakeholder group yet.</div></td></tr></tbody>';
  }
  bindSurveyResultGroupButtons();
  document.getElementById('surveyResultMeta').textContent = (topFactor ? 'Top factor: ' + topFactor.factor_name + ' (' + topFactor.score + '% average derived weight)' : 'No scored factors') + ' | Filter: ' + (filter === 'All' ? 'All stakeholder groups' : stakeholderGroupLabel(filter));
  document.getElementById('surveyResultTable').innerHTML =
    '<thead><tr><th>Rank</th><th>Dimension</th><th>Factor</th><th>Average derived weight</th><th>Selected by</th><th>Average rank</th><th>Interpretation</th></tr></thead><tbody>' +
    rows.map((row, index) => {
      const scoreText = row.score === null ? 'Awaiting response' : row.score + '%';
      const selectedText = shouldUseSubmissionData() ? row.responseCount + ' of ' + row.totalResponses : row.responseCount;
      const rankText = row.averageRank === null ? '-' : row.averageRank.toFixed(1);
      const interpretation = row.score === null ? 'Awaiting stakeholder responses' : row.score >= 15 ? 'Very high ranking-derived priority' : row.score >= 10 ? 'High ranking-derived priority' : row.score >= 5 ? 'Moderate ranking-derived priority' : 'Lower relative priority';
      return '<tr><td>'+h(row.score === null ? '-' : index + 1)+'</td><td>'+h(dimensionLabel(row.dimension))+'</td><td><strong>'+h(row.factor_name)+'</strong></td><td>'+h(scoreText)+'</td><td>'+h(selectedText)+'</td><td>'+h(rankText)+'</td><td>'+h(interpretation)+'</td></tr>';
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
    if (!rows.length) el.insertAdjacentHTML('beforeend', '<div class="empty-state">No mapped buildings match the selected filters. Try broadening the district, vacancy or score range.</div>');
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
  if (!rows.length) el.insertAdjacentHTML('beforeend', '<div class="empty-state">No mapped buildings match the selected filters. Try broadening the district, vacancy or score range.</div>');
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
  const catchmentList = catchment.length
    ? '<ul class="catchment-list">'+catchment.map(item => '<li><span class="catchment-dot" style="background:'+facilityColor[item.type]+'"></span><strong>'+h(item.name)+'</strong><em>'+h(item.type)+' · '+h(item.distance)+' m</em></li>').join('')+'</ul>'
    : '<p class="muted-note">No listed community facilities or MTR stations fall inside the 500 m catchment.</p>';
  const profileHtml =
    '<h2>'+h(b.name)+'</h2><p>'+h(b.address)+'</p><span class="badge" style="background:'+categoryColor[b.category]+'">'+h(categoryLabel(b.category))+'</span><strong style="float:right;font-size:34px">'+h(b.score)+'</strong>' +
    '<dl><div><dt>District</dt><dd>'+h(b.district)+'</dd></div><div><dt>Age</dt><dd>'+h(b.age)+' yrs</dd></div><div><dt>Zoning</dt><dd>'+h(b.zoning)+'</dd></div><div><dt>Ownership</dt><dd>'+h(b.ownership)+'</dd></div><div><dt>Vacancy</dt><dd>'+h(b.vacancy)+'%</dd></div><div><dt>Storeys</dt><dd>'+h(b.storeys)+'</dd></div><div><dt>Building height</dt><dd>'+h(b.height)+' m</dd></div><div><dt>MTR distance</dt><dd>'+h(b.mtr)+' m</dd></div></dl>' +
    '<section class="score-explain"><h3>Why this score?</h3><p>This building has an <strong>Indicative Suitability Score of '+h(b.score)+'/100</strong>. It scores strongly because of '+h(mainStrength.label.toLowerCase())+', while its main constraint is '+h(mainConstraint.label.toLowerCase())+'. This is a screening result only and does not represent statutory approval.</p><h4>Top 3 strongest factors</h4>'+factorTable(strongest)+'<h4>Bottom 3 weakest factors</h4>'+factorTable(weakest)+'<dl><div><dt>Main strength</dt><dd>'+h(mainStrength.label)+' ('+h(mainStrength.score)+')</dd></div><div><dt>Main constraint</dt><dd>'+h(mainConstraint.label)+' ('+h(mainConstraint.score)+')</dd></div></dl><p><strong>Recommended next step:</strong> '+h(nextStepFor(b))+'</p></section>' +
    renderRegulatoryPathwayChecklist(b) +
    '<h3>500 m community catchment</h3><p class="muted-note">Amenities shown on the GIS map inside the selected building radius.</p><dl>'+summary.map(([label,value]) => '<div><dt>'+h(label)+'</dt><dd>'+h(value)+'</dd></div>').join('')+'<div><dt>Nearest MTR</dt><dd>'+h(nearestStation ? nearestStation.name + ' (' + nearestStation.distance + ' m)' : 'None within 500 m')+'</dd></div></dl>'+catchmentList +
    '<h3>Main constraints</h3><p>'+h(b.constraints)+'</p><h3>Main opportunities</h3><p>'+h(b.opportunities)+'</p>';
  ['buildingProfile','scoreBuildingProfile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = profileHtml;
  });
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
    el.innerHTML = '<strong>Recommendation</strong><p>No buildings match the selected comparison set. Broaden the filters before selecting a near-term pilot candidate.</p>';
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
function bindTeamAccessControls() {
  const accessButton = document.getElementById('projectTeamAccess');
  const lockButton = document.getElementById('lockTeamAccess');
  const cancelButton = document.getElementById('cancelTeamAccess');
  const form = document.getElementById('teamAccessForm');
  const message = document.getElementById('teamAccessMessage');
  if (accessButton) accessButton.onclick = openTeamAccessModal;
  if (lockButton) lockButton.onclick = lockTeamAccess;
  if (cancelButton) cancelButton.onclick = closeTeamAccessModal;
  document.querySelectorAll('[data-close-access-modal]').forEach(button => button.onclick = closeTeamAccessModal);
  if (form) form.onsubmit = event => {
    event.preventDefault();
    const input = document.getElementById('teamAccessCode');
    if (input && input.value === TEAM_ACCESS_CODE) {
      closeTeamAccessModal();
      unlockTeamAccess();
      return;
    }
    if (message) message.textContent = 'Incorrect access code.';
    if (input) {
      input.value = '';
      input.focus();
    }
    activateTab('survey');
  };
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeTeamAccessModal();
  });
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
  bindHeaderDescriptionToggle();
  bindTeamAccessControls();
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
  openInitialTab();
  render();
  window.addEventListener('hashchange', () => {
    const tabName = validTabNameFromHash();
    if (!tabName) {
      if (!teamAccessUnlocked()) activateTab('survey');
      return;
    }
    const tab = document.querySelector('.tab[data-tab="'+tabName+'"]');
    if (tab?.dataset.mode) state.viewMode = tab.dataset.mode;
    updateViewModeTabs();
    activateTab(tabName);
  });
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
    console.error('Suggested factor submission failed', error.details || error);
    state.databaseStatus = 'Suggested factor could not be saved to Supabase. Check config and row-level security policies.';
    renderResearchWorkflow();
    window.alert('Suggested factor could not be saved. Please try again or contact the project team.');
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
