// VIA: static route data and roadmap rendering.
const SOURCES = {
  canada: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html',
  spain: 'https://www.exteriores.gob.es/Consulados/mexico/es/ServiciosConsulares/Paginas/index.aspx',
  usa: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html',
  mxStudy: 'https://www.miconsulado.sre.gob.mx/visasmexicanas/visa/visa-de-residente-temporal-de-estudiante/',
  mxVisa: 'https://www.miconsulado.sre.gob.mx/visasmexicanas/',
  mxInm: 'https://www.gob.mx/inm',
  usaWork: 'https://travel.state.gov/content/travel/en/us-visas/employment/temporary-worker-visas.html',
  caWork: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit.html',
  esWork: 'https://www.inclusion.gob.es/web/migraciones/vivir-en-espana',
};
const routes = {
  out: {
    canada: {name:'Canada',flag:'🇨🇦',study:{authority:'IRCC',url:SOURCES.canada,particular:'Confirm whether the study program and duration require a study permit, whether the school is a DLI, and whether a PAL/TAL or Quebec authorization applies.'},work:{authority:'IRCC',url:SOURCES.caWork,particular:'Check the appropriate work permit category, employer requirements, and whether an LMIA or exemption applies. Do not assume a job offer guarantees authorization.'}},
    spain: {name:'Spain',flag:'🇪🇸',study:{authority:'Spanish consulate',url:SOURCES.spain,particular:'Check the applicable study-stay authorization or visa category, program duration, and consular documentation.'},work:{authority:'Spanish immigration authorities',url:SOURCES.esWork,particular:'Check the employment residence and work authorization pathway, employer conditions, and corresponding consular requirements.'}},
    usa: {name:'United States',flag:'🇺🇸',study:{authority:'U.S. Department of State',url:SOURCES.usa,particular:'Identify whether the program requires F, M, or J status and confirm the school sponsorship and official visa procedure.'},work:{authority:'U.S. Department of State',url:SOURCES.usaWork,particular:'Identify an applicable work visa category and any required employer petition. Employment eligibility cannot be determined here.'}}
  },
  in: {
    colombia:{name:'Colombia',flag:'🇨🇴'},france:{name:'France',flag:'🇫🇷'},usa:{name:'United States',flag:'🇺🇸'}
  }
};
const country = document.getElementById('country');
const state = {direction:'out',purpose:'study',duration:'long',completed:new Set()};
const el=id=>document.getElementById(id);
const the=n=>n==='United States'?'the '+n:n;
const setNav=view=>{el('navIntake').classList.toggle('active',view==='intake');el('navRoadmap').classList.toggle('active',view==='roadmap')};
function updateDirection(dir){state.direction=dir;document.querySelectorAll('[data-dir]').forEach(b=>b.classList.toggle('chosen',b.dataset.dir===dir));country.innerHTML=dir==='out'?'<option value="canada">🇨🇦 Canada</option><option value="spain">🇪🇸 Spain</option><option value="usa">🇺🇸 United States</option>':'<option value="colombia">🇨🇴 Colombia</option><option value="france">🇫🇷 France</option><option value="usa">🇺🇸 United States</option>';el('originLabel').textContent=dir==='out'?'Current country':'Destination';el('destinationLabel').textContent=dir==='out'?'Destination':'Nationality / origin';el('originDisplay').textContent='🇲🇽 Mexico';}
document.querySelectorAll('[data-dir]').forEach(b=>b.addEventListener('click',()=>updateDirection(b.dataset.dir)));
document.querySelectorAll('[data-purpose]').forEach(b=>b.addEventListener('click',()=>{state.purpose=b.dataset.purpose;document.querySelectorAll('[data-purpose]').forEach(c=>c.classList.toggle('chosen',b===c));}));
function buildSteps(){const outbound=state.direction==='out',p=state.purpose,info=outbound?routes.out[country.value][p]:null;const url=outbound?info.url:(p==='study'?SOURCES.mxStudy:SOURCES.mxVisa);const authority=outbound?info.authority:'Mexico SRE / INM';const destination=outbound?routes.out[country.value].name:'Mexico';let list=[
 {title:'Confirm the correct immigration category',desc:outbound?info.particular:(p==='study'?'Confirm whether your length of stay and school program require a temporary resident student visa.':'Confirm whether the intended job requires prior authorization or an employer-led process.'),url},
 {title:'Check the official government instructions',desc:`Review requirements directly with ${authority}. Verify rules for your nationality, duration, and application location.`,url},
 {title:p==='study'?'Confirm admission and program details':'Confirm employer and offer details',desc:p==='study'?'Verify the educational institution, acceptance documentation, and program dates.':'Confirm the employer, job role, sponsoring entity, and any required immigration permissions before applying.',url},
 {title:'Prepare supporting documents',desc:'Check passport validity, relevant acceptance or offer documents, financial evidence, and any other case-specific records.',url},
 {title:'Check appointment and application process',desc:'Use official application portals or consular booking instructions only. Fees, eligibility, and requirements vary.',url},
 {title:'Prepare for arrival and follow-up',desc:outbound?'Verify the entry document, border requirements, and any permit-related conditions before departure.':'Check any required post-arrival registration or residence-card exchange process with INM.',url:outbound?url:SOURCES.mxInm}
 ];
 if(state.duration==='short') list[0].desc+=' Short stays may follow different rules; do not assume a permit or visa exemption.';
 if(state.duration==='unknown') list[0].desc+=' Confirm the duration of the intended stay first.';
 return list;
}
let activeSteps=[];
function showRoadmap(){state.duration=el('duration').value;state.completed=new Set();const outbound=state.direction==='out';const data=outbound?routes.out[country.value]:routes.in[country.value];el('routeTitle').textContent=outbound?`🇲🇽 Mexico → ${data.flag} ${data.name}`:`${data.flag} ${data.name} → 🇲🇽 Mexico`;el('purposeTitle').textContent=state.purpose==='study'?'🎓 Study':'💼 Work';el('durationTitle').textContent=el('duration').selectedOptions[0].textContent;el('routeSubtitle').textContent=`A starting checklist for ${outbound?'a Mexican citizen moving to '+the(data.name):'a citizen of '+the(data.name)+' moving to Mexico'} for ${state.purpose}. Verify applicability before making decisions.`;el('routeCaution').textContent='Your eligibility cannot be determined here. Immigration rules depend on individual circumstances, program or employment details, duration, and the authority reviewing your application.';activeSteps=buildSteps();renderSteps();el('intake').classList.add('hidden');el('roadmap').classList.remove('hidden');setNav('roadmap');window.scrollTo(0,0)}
function renderSteps(){el('steps').innerHTML='';activeSteps.forEach((s,i)=>{const row=document.createElement('div');row.className='step'+(state.completed.has(i)?' done':'');const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=state.completed.has(i);checkbox.setAttribute('aria-label',`Mark step ${i+1} complete`);checkbox.addEventListener('change',()=>{checkbox.checked?state.completed.add(i):state.completed.delete(i);renderSteps()});const body=document.createElement('div');const title=document.createElement('h3');title.textContent=`${String(i+1).padStart(2,'0')}  ${s.title}`;const desc=document.createElement('p');desc.textContent=s.desc;const link=document.createElement('a');link.href=s.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Verify with official source ↗';body.append(title,desc,link);row.append(checkbox,body);el('steps').appendChild(row)});el('progressLabel').textContent=`${state.completed.size} of ${activeSteps.length} complete`;el('progressBar').style.width=`${(state.completed.size/activeSteps.length)*100}%`}
function goHome(){el('roadmap').classList.add('hidden');el('intake').classList.remove('hidden');setNav('intake');window.scrollTo(0,0)}
el('generate').addEventListener('click',showRoadmap);el('back').addEventListener('click',goHome);el('reset').addEventListener('click',()=>{updateDirection('out');state.purpose='study';document.querySelectorAll('[data-purpose]').forEach(b=>b.classList.toggle('chosen',b.dataset.purpose==='study'));el('duration').value='long';goHome()});el('homeLink').addEventListener('click',e=>{e.preventDefault();goHome()});el('copy').addEventListener('click',async()=>{const summary=[el('routeTitle').textContent,'VIA checklist. Verify all requirements with the official authorities.',...activeSteps.map((s,i)=>`${state.completed.has(i)?'✓':'□'} ${i+1}. ${s.title}\n${s.desc}\n${s.url}`)].join('\n\n');try{await navigator.clipboard.writeText(summary);el('copy').textContent='Copied ✓';setTimeout(()=>el('copy').textContent='Copy checklist ↗',1800)}catch{window.prompt('Copy this checklist:',summary)}});
