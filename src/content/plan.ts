/** Interview date and the study plan shown on the dashboard. Edit freely. */
export const interview = {
  date: '2026-11-29T09:00:00+05:30',
  title: 'Junior Executive (IT) – Grade IV',
  org: 'National Savings Bank (NSB)',
};

export const studyPlan: { day: string; focus: string; modules: string[] }[] = [
  { day: 'Wed night', focus: 'Networking basics + IP addressing. Do 10 subnet practice questions.', modules: ['networking', 'ip-subnetting'] },
  { day: 'Thursday', focus: 'Switching/routing, WAN, network security, troubleshooting. Subnet practice again.', modules: ['switching-routing', 'wan', 'network-security', 'troubleshooting'] },
  { day: 'Friday', focus: 'Systems admin, information security, operations/DR, databases, banking IT.', modules: ['sysadmin', 'infosec', 'operations-dr', 'database', 'banking-it'] },
  { day: 'Saturday', focus: 'Java review, HR answers (edit them!), 2 mock interviews, weak areas.', modules: ['java', 'hr'] },
  { day: 'Sunday AM', focus: 'Flashcards (ports, acronyms) + read your HR answers out loud once. Stay calm.', modules: [] },
];
