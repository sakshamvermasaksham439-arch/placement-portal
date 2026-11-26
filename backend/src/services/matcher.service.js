/**
 * Auto-Resume Matcher
 * v1: keyword dictionary extraction + weighted overlap score
 *     score = sum(weight of matched required skills) / sum(weight of required skills) * 100
 * v2: TF-IDF cosine similarity (resume text vs job description) blended in
 */
const SKILL_ALIASES = {
  javascript: ['javascript', 'js', 'es6'], typescript: ['typescript', 'ts'],
  python: ['python'], java: ['java'], 'c++': ['c\\+\\+', 'cpp'], sql: ['sql', 'mysql', 'postgresql', 'postgres'],
  mongodb: ['mongodb', 'mongo'], react: ['react', 'reactjs', 'react\\.js'], node: ['node', 'nodejs', 'node\\.js'],
  express: ['express', 'expressjs'], html: ['html', 'html5'], css: ['css', 'css3'], git: ['git', 'github'],
  docker: ['docker'], aws: ['aws', 'amazon web services'], 'machine learning': ['machine learning', 'ml'],
  'deep learning': ['deep learning', 'dl'], nlp: ['nlp', 'natural language processing'],
  pandas: ['pandas'], numpy: ['numpy'], tensorflow: ['tensorflow'], pytorch: ['pytorch'],
  'data structures': ['data structures', 'dsa', 'algorithms'], rest: ['rest', 'restful', 'rest api'],
};
// weights: core skills count more (tweak freely)
const WEIGHTS = { 'data structures': 2, python: 2, javascript: 2, java: 2, 'machine learning': 2, react: 1.5, node: 1.5 };
const weightOf = (s) => WEIGHTS[s] || 1;

const PATTERNS = Object.entries(SKILL_ALIASES).map(([skill, aliases]) =>
  [skill, new RegExp(`(?<![a-z0-9+#])(${aliases.join('|')})(?![a-z0-9+#])`, 'i')]);

exports.normalizeSkill = (s) => {
  const t = String(s).trim().toLowerCase();
  for (const [skill, re] of PATTERNS) if (re.test(t) && t.length <= skill.length + 8) return skill;
  return t;
};

exports.extractSkills = (text = '') =>
  PATTERNS.filter(([, re]) => re.test(text)).map(([skill]) => skill);

// ---- TF-IDF cosine (2 documents) ----
const tokenize = (t) => (t.toLowerCase().match(/[a-z0-9+#.]{2,}/g) || []);
function cosineTfidf(a, b) {
  const ta = tokenize(a), tb = tokenize(b);
  if (!ta.length || !tb.length) return 0;
  const vocab = [...new Set([...ta, ...tb])];
  const tf = (tokens) => { const m = {}; tokens.forEach(w => (m[w] = (m[w] || 0) + 1)); return m; };
  const fa = tf(ta), fb = tf(tb);
  let dot = 0, na = 0, nb = 0;
  for (const w of vocab) {
    const df = (fa[w] ? 1 : 0) + (fb[w] ? 1 : 0);
    const idf = Math.log((2 + 1) / (df + 1)) + 1;
    const va = ((fa[w] || 0) / ta.length) * idf, vb = ((fb[w] || 0) / tb.length) * idf;
    dot += va * vb; na += va * va; nb += vb * vb;
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

exports.checkEligibility = (profile, job) => {
  if (profile.cgpa < (job.minCGPA || 0)) return { ok: false, reason: `Minimum CGPA ${job.minCGPA} required` };
  if (job.allowedBranches?.length && !job.allowedBranches.map(b => b.toLowerCase()).includes((profile.branch || '').toLowerCase()))
    return { ok: false, reason: 'Branch not eligible' };
  return { ok: true };
};

exports.matchResume = ({ skills = [], parsedText = '' }, job) => {
  const required = [...new Set((job.requiredSkills || []).map(exports.normalizeSkill))];
  const have = new Set(skills);
  const matched = required.filter(s => have.has(s));
  const missing = required.filter(s => !have.has(s));
  const total = required.reduce((n, s) => n + weightOf(s), 0);
  const skillScore = total ? (matched.reduce((n, s) => n + weightOf(s), 0) / total) * 100 : 0;
  let score = skillScore;
  if (parsedText && job.description) {                       // v2 blend: 80% skills + 20% text similarity
    score = 0.8 * skillScore + 0.2 * cosineTfidf(parsedText, `${job.description} ${required.join(' ')}`) * 100;
  }
  return { matchScore: Math.round(score * 10) / 10, matchedSkills: matched, missingSkills: missing };
};
