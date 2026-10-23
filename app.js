// VIA: route data and roadmap rendering.
const CA = 'https://www.canada.ca/en/immigration-refugees-citizenship/services/';
const ESV = 'https://www.exteriores.gob.es/Consulados/mexico/es/ServiciosConsulares/Paginas/';
const ES_VISA = ESV + 'index.aspx?scca=Visados&scco=M%C3%A9xico&scd=195&scs=Visados+Nacionales+-+';
const AU = 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/';
const AU_APPLY = 'https://online.immi.gov.au/lusc/login';
const DE_APPLY = 'https://digital.diplo.de/visa';
const MX = {
  study: 'https://www.miconsulado.sre.gob.mx/visasmexicanas/visa/visa-de-residente-temporal-de-estudiante/',
  work: 'https://www.gob.mx/inm/documentos/preguntas-frecuentes-para-solicitar-visa-por-oferta-de-empleo',
  inm: 'https://www.gob.mx/inm',
};
// url = official page for the visa or permit, apply = official application or appointment page.
const outbound = {
  canada: {name:'Canada',
    study:{authority:'IRCC',url:CA+'study-canada/study-permit.html',apply:CA+'application/application-forms-guides/guide-5269-applying-study-permit-outside-canada.html',particular:'Confirm whether the study program and duration require a study permit, whether the school is a DLI, and whether a PAL/TAL or Quebec authorization applies.'},
    work:{authority:'IRCC',url:CA+'work-canada.html',apply:CA+'application/application-forms-guides/guide-5487-applying-work-permit-outside-canada.html',particular:'Check the appropriate work permit category, employer requirements, and whether an LMIA or exemption applies. Do not assume a job offer guarantees authorization.'}},
  spain: {name:'Spain',
    study:{authority:'the Spanish consulate',url:ES_VISA+'Visado+de+estudios',apply:ESV+'CitasVisados.aspx',particular:'Studies of more than 90 days need a national student visa; shorter programs follow Schengen rules. Confirm your program type, duration, and the consular documentation.'},
    work:{authority:'the Spanish consulate',url:ES_VISA+'Visado+de+trabajo+por+cuenta+ajena',apply:ESV+'CitasVisados.aspx',particular:'The employer normally obtains the residence and work authorization first, then you apply for the visa at the consulate. Confirm each step and the consular requirements.'}},
  usa: {name:'United States',
    study:{authority:'the U.S. Department of State',url:'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html',apply:'https://ceac.state.gov/genniv/',particular:'Identify whether the program requires F, M, or J status and confirm the school sponsorship and official visa procedure.'},
    work:{authority:'the U.S. Department of State',url:'https://travel.state.gov/content/travel/en/us-visas/employment/temporary-worker-visas.html',apply:'https://www.uscis.gov/working-in-the-united-states',particular:'Identify an applicable work visa category and any required employer petition. Employment eligibility cannot be determined here.'}},
  germany: {name:'Germany',
    study:{authority:'the German embassy or consulate',url:'https://www.make-it-in-germany.com/en/study-training/study/planning/arrival',apply:DE_APPLY,particular:'Check whether you need a national visa or a residence permit for study, confirm your admission or university entrance qualification, and the proof of funds required, such as a blocked account.'},
    work:{authority:'the German embassy or consulate',url:'https://www.make-it-in-germany.com/en/visa-residence/types/work-qualified-professionals',apply:DE_APPLY,particular:'Check whether your qualification is recognised in Germany and which residence permit applies, such as the EU Blue Card. A concrete job offer is normally required.'}},
  uk: {name:'United Kingdom',
    study:{authority:'UK Visas and Immigration',url:'https://www.gov.uk/student-visa',apply:'https://www.gov.uk/apply-to-come-to-the-uk',particular:'Confirm that your course and school qualify for a Student visa and that a licensed sponsor will issue your Confirmation of Acceptance for Studies (CAS).'},
    work:{authority:'UK Visas and Immigration',url:'https://www.gov.uk/skilled-worker-visa',apply:'https://www.gov.uk/skilled-worker-visa/apply-from-outside-the-uk',particular:'Check that your job and employer qualify for the Skilled Worker route. You generally need a Certificate of Sponsorship from a licensed sponsor and must meet skill, salary, and English requirements.'}},
  australia: {name:'Australia',
    study:{authority:'the Australian Department of Home Affairs',url:AU+'student-500',apply:AU_APPLY,particular:'Confirm that your course is CRICOS-registered, that you will hold a Confirmation of Enrolment, and that you meet the Genuine Student requirement.'},
    work:{authority:'the Australian Department of Home Affairs',url:AU+'skills-in-demand-visa-subclass-482',apply:AU_APPLY,particular:'Check the Skills in Demand (subclass 482) visa: an approved employer must nominate you for an eligible occupation, and you must meet skills and English requirements.'}},
};
const origins = {
  colombia: {name:'Colombia',embassy:'https://embamex.sre.gob.mx/colombia/'},
  argentina: {name:'Argentina',embassy:'https://embamex.sre.gob.mx/argentina/'},
  usa: {name:'United States',embassy:'https://embamex.sre.gob.mx/eua/'},
  canada: {name:'Canada',embassy:'https://embamex.sre.gob.mx/canada/'},
  france: {name:'France',embassy:'https://embamex.sre.gob.mx/francia/'},
};
const KEY = 'via-plan-v1';
const el = id => document.getElementById(id);
const country = el('country');
const state = {direction:'out',purpose:'study',completed:new Set()};
const the = n => /^United /.test(n) ? 'the ' + n : n;
const places = () => state.direction === 'out' ? outbound : origins;
const setNav = view => {el('navIntake').classList.toggle('active',view==='intake');el('navRoadmap').classList.toggle('active',view==='roadmap')};
const save = () => {try{localStorage.setItem(KEY,JSON.stringify({dir:state.direction,country:country.value,purpose:state.purpose,duration:el('duration').value,done:[...state.completed]}))}catch{}};
const clearSaved = () => {try{localStorage.removeItem(KEY)}catch{}};

function updateDirection(dir){
  state.direction = dir;
  document.querySelectorAll('[data-dir]').forEach(b => b.classList.toggle('chosen', b.dataset.dir === dir));
  country.innerHTML = Object.entries(places()).map(([k,v]) => `<option value="${k}">${v.name}</option>`).join('');
  el('originLabel').textContent = dir === 'out' ? 'Current country' : 'Destination';
  el('destinationLabel').textContent = dir === 'out' ? 'Destination' : 'Nationality / origin';
}
function setPurpose(p){
  state.purpose = p;
  document.querySelectorAll('[data-purpose]').forEach(b => b.classList.toggle('chosen', b.dataset.purpose === p));
}
document.querySelectorAll('[data-dir]').forEach(b => b.addEventListener('click', () => updateDirection(b.dataset.dir)));
document.querySelectorAll('[data-purpose]').forEach(b => b.addEventListener('click', () => setPurpose(b.dataset.purpose)));

function buildSteps(){
  const out = state.direction === 'out', study = state.purpose === 'study', duration = el('duration').value;
  const origin = out ? null : origins[country.value];
  const route = out ? outbound[country.value][state.purpose] : {authority:'Mexico SRE / INM',url:study?MX.study:MX.work,apply:origin.embassy};
  const list = [
    {title:'Confirm the correct immigration category',desc:out?route.particular:(study?'Study programs longer than 180 days generally need a temporary resident student visa. Confirm whether your program and length of stay require one.':'A job offer from a Mexican employer is usually processed through the INM first. Confirm whether your intended job requires prior authorization or an employer-led process.')},
    {title:'Check the official government instructions',desc:out?`Review requirements directly with ${route.authority}. Verify rules for your nationality, duration, and application location.`:`Review the requirements with ${route.authority} and confirm whether citizens of ${the(origin.name)} need a visa for your stay.`,url:route.url,label:'Official requirements ↗'},
    {title:study?'Confirm admission and program details':'Confirm employer and offer details',desc:study?'Verify the educational institution, acceptance documentation, and program dates.':'Confirm the employer, job role, sponsoring entity, and any required immigration permissions before applying.'},
    {title:'Prepare supporting documents',desc:'Check passport validity, relevant acceptance or offer documents, financial evidence, and any other case-specific records.'},
    {title:'Check appointment and application process',desc:out?'Use official application portals or consular booking instructions only. Fees, eligibility, and requirements vary.':`Book through the Mexican embassy or consulate that serves your location in ${the(origin.name)}. Fees and requirements vary by consulate.`,url:route.apply,label:out?'How to apply ↗':`Mexican embassy in ${the(origin.name)} ↗`},
    {title:'Prepare for arrival and follow-up',desc:out?'Verify the entry document, border requirements, and any permit-related conditions before departure.':'Check any required post-arrival registration or residence-card exchange process with INM.',url:out?'':MX.inm,label:'INM website ↗'},
  ];
  if (duration === 'short') list[0].desc += ' Short stays may follow different rules; do not assume a permit or visa exemption.';
  if (duration === 'unknown') list[0].desc += ' Confirm the duration of the intended stay first.';
  return list;
}
let activeSteps = [];
function showRoadmap(done = []){
  const out = state.direction === 'out', d = places()[country.value];
  el('routeTitle').textContent = out ? `Mexico → ${d.name}` : `${d.name} → Mexico`;
  el('purposeTitle').textContent = state.purpose === 'study' ? '🎓 Study' : '💼 Work';
  el('durationTitle').textContent = el('duration').selectedOptions[0].textContent;
  el('routeSubtitle').textContent = `A starting checklist for ${out?'a Mexican citizen moving to '+the(d.name):'a citizen of '+the(d.name)+' moving to Mexico'} for ${state.purpose}. Verify applicability before making decisions.`;
  el('routeCaution').textContent = 'Your eligibility cannot be determined here. Immigration rules depend on individual circumstances, program or employment details, duration, and the authority reviewing your application.';
  activeSteps = buildSteps();
  state.completed = new Set(done.filter(i => i >= 0 && i < activeSteps.length));
  renderSteps();
  el('intake').classList.add('hidden');
  el('roadmap').classList.remove('hidden');
  setNav('roadmap');
  window.scrollTo(0,0);
  save();
}
function renderSteps(){
  el('steps').innerHTML = '';
  activeSteps.forEach((s,i) => {
    const row = document.createElement('div');
    row.className = 'step' + (state.completed.has(i) ? ' done' : '');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = state.completed.has(i);
    checkbox.setAttribute('aria-label', `Mark step ${i+1} complete`);
    checkbox.addEventListener('change', () => {checkbox.checked ? state.completed.add(i) : state.completed.delete(i); save(); renderSteps()});
    const body = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = `${String(i+1).padStart(2,'0')}  ${s.title}`;
    const desc = document.createElement('p');
    desc.textContent = s.desc;
    body.append(title, desc);
    if (s.url) {
      const link = document.createElement('a');
      link.href = s.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = s.label;
      body.append(link);
    }
    row.append(checkbox, body);
    el('steps').appendChild(row);
  });
  el('progressLabel').textContent = `${state.completed.size} of ${activeSteps.length} complete`;
  el('progressBar').style.width = `${(state.completed.size/activeSteps.length)*100}%`;
}
function goHome(){el('roadmap').classList.add('hidden');el('intake').classList.remove('hidden');setNav('intake');window.scrollTo(0,0)}
function restore(){
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    const list = s && (s.dir === 'out' ? outbound : s.dir === 'in' ? origins : null);
    if (!list || !list.hasOwnProperty(s.country) || !['study','work'].includes(s.purpose)) return;
    if (![...el('duration').options].some(o => o.value === s.duration)) return;
    updateDirection(s.dir);
    country.value = s.country;
    setPurpose(s.purpose);
    el('duration').value = s.duration;
    showRoadmap(Array.isArray(s.done) ? s.done.filter(Number.isInteger) : []);
  } catch {}
}
el('generate').addEventListener('click', () => showRoadmap());
el('back').addEventListener('click', goHome);
el('reset').addEventListener('click', () => {clearSaved(); updateDirection('out'); setPurpose('study'); el('duration').value = 'long'; goHome()});
el('homeLink').addEventListener('click', e => {e.preventDefault(); goHome()});
el('copy').addEventListener('click', async () => {
  const summary = [el('routeTitle').textContent, 'VIA checklist. Verify all requirements with the official authorities.', ...activeSteps.map((s,i) => `${state.completed.has(i)?'✓':'□'} ${i+1}. ${s.title}\n${s.desc}${s.url?'\n'+s.url:''}`)].join('\n\n');
  try {
    await navigator.clipboard.writeText(summary);
    el('copy').textContent = 'Copied ✓';
    setTimeout(() => el('copy').textContent = 'Copy checklist ↗', 1800);
  } catch {
    window.prompt('Copy this checklist:', summary);
  }
});
updateDirection('out');
restore();
