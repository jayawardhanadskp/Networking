/** Interview date and the study plan shown on the dashboard. Edit freely. */
export const interview = {
  date: '2026-11-29T10:20:00+05:30',
  when: 'Sun 29 Nov, 10:20 a.m.',
  title: 'Junior Executive (Administrator – System Integration) – Grade IV',
  org: 'National Savings Bank (NSB)',
};

/** Id of the role module (mock interviews take 60% of questions from it). */
export const roleModuleId = 'system-integration';

export const studyPlan: { day: string; focus: string; modules: string[] }[] = [
  { day: 'Thursday', focus: 'ROLE module lessons 1–4: integration landscape, styles (REST/SOAP, files, ETL), middleware & queues, ISO 8583/20022.', modules: ['system-integration'] },
  { day: 'Friday', focus: 'ROLE lessons 5–8: reliability, security (mTLS, OAuth2/JWT), testing & change, troubleshooting. Then the role quiz. Quick review: network security + troubleshooting.', modules: ['system-integration', 'network-security', 'troubleshooting'] },
  { day: 'Saturday', focus: 'Role flashcards + say all role scenario answers OUT LOUD. Edit HR answers ("Why are you suited…"). 2 mock interviews (60% role). Weak areas. Skim sysadmin, infosec, operations, banking IT.', modules: ['system-integration', 'hr', 'sysadmin', 'infosec', 'operations-dr', 'banking-it'] },
  { day: 'Sunday AM', focus: 'Role flashcards (MTIs, troubleshooting order) + read your HR answers once. Leave early — interview at 10:20 a.m. Stay calm.', modules: [] },
];
