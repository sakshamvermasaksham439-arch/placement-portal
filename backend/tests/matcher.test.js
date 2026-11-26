const { extractSkills, matchResume, checkEligibility } = require('../src/services/matcher.service');
test('extracts aliased skills', () => {
  const s = extractSkills('Built apps with JS, Node.js, MongoDB and C++. Used ML and Git.');
  expect(s).toEqual(expect.arrayContaining(['javascript', 'node', 'mongodb', 'c++', 'machine learning', 'git']));
});
test('scores weighted overlap and reports gaps', () => {
  const r = matchResume({ skills: ['python', 'sql'] }, { requiredSkills: ['python', 'sql', 'docker'] });
  expect(r.matchedSkills).toEqual(['python', 'sql']);
  expect(r.missingSkills).toEqual(['docker']);
  expect(r.matchScore).toBeCloseTo(75, 0);   // (2+1)/(2+1+1)
});
test('eligibility blocks low CGPA', () => {
  expect(checkEligibility({ cgpa: 6 }, { minCGPA: 7 }).ok).toBe(false);
});
