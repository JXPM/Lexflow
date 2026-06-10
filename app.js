/* =============================================================
   LexFlow — App logic (vanilla JS, zéro dépendance)
   Router de vues · audio Web Speech · onboarding · quiz · états
   ============================================================= */

/* ---------- ICON HELPER ---------- */
function icon(name, size = 24, stroke = 1.8) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true"><use href="#${name}"/></svg>`;
}

/* ---------- ÉTAT GLOBAL (mock) ---------- */
const STATE = {
  user: { name: 'Johan', initials: 'J', level: 7, lang: 'Français', goal: 10 },
  streak: 12,
  xp: 2480,
  todayLearned: 6,
  saved: new Set(['serendipite', 'eloquence']),
  settings: { audioAuto: true, darkMode: true, notif: true, daily: '20:00' },
};

const WORDS = [
  { id:'serendipite', term:'Sérendipité', pos:'n.f.', phon:'/se.ʁɛ̃.di.pi.te/',
    def:'Le fait de faire une découverte heureuse et inattendue par hasard.',
    ex:'Une simple sérendipité l’a conduite vers sa véritable vocation.', tag:'Rare',
    img:'sunrise discovery golden path' },
  { id:'eloquence', term:'Éloquence', pos:'n.f.', phon:'/e.lɔ.kɑ̃s/',
    def:'L’art de s’exprimer avec aisance et de convaincre par la parole.',
    ex:'Son éloquence a captivé toute la salle en quelques minutes.', tag:'Soutenu',
    img:'microphone stage spotlight speaker' },
  { id:'resilience', term:'Résilience', pos:'n.f.', phon:'/ʁe.zi.ljɑ̃s/',
    def:'Capacité à surmonter une épreuve et à se reconstruire.',
    ex:'La résilience de l’équipe a impressionné tout le monde.', tag:'Courant',
    img:'mountain climber summit sunrise' },
  { id:'ephemere', term:'Éphémère', pos:'adj.', phon:'/e.fe.mɛʁ/',
    def:'Qui ne dure qu’un temps très court.',
    ex:'Le bonheur éphémère d’un matin d’été.', tag:'Poétique',
    img:'cherry blossom petals falling' },
  { id:'perspicace', term:'Perspicace', pos:'adj.', phon:'/pɛʁ.spi.kas/',
    def:'Qui comprend les choses avec finesse et rapidité.',
    ex:'Une remarque perspicace qui change tout le débat.', tag:'Soutenu',
    img:'macro eye sharp focus clarity' },
  { id:'quietude', term:'Quiétude', pos:'n.f.', phon:'/kje.tyd/',
    def:'État de calme paisible et de tranquillité d’esprit.',
    ex:'Il retrouve la quiétude dès qu’il marche en forêt.', tag:'Rare',
    img:'calm misty forest lake fog' },
];

/* ---------- PEXELS (photos du feed) ----------
   Clé gratuite : https://www.pexels.com/api/  — puis, au choix :
     • console : localStorage.setItem('pexels_key', 'TA_CLE')  (recommandé, hors git)
     • ou définir window.PEXELS_API_KEY avant app.js
   Sans clé : on garde le mesh gradient (le feed ne casse jamais). */
const PEXELS_API_KEY =
  (typeof window !== 'undefined' && window.PEXELS_API_KEY) ||
  (typeof localStorage !== 'undefined' && localStorage.getItem('pexels_key')) || '';
const isPexelsConfigured = Boolean(PEXELS_API_KEY);
const _pexelsCache = new Map();
async function fetchPexelsImage(query) {
  if (!PEXELS_API_KEY) return null;
  if (_pexelsCache.has(query)) return _pexelsCache.get(query);
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
    const res = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } });
    if (!res.ok) throw new Error(`Pexels ${res.status}`);
    const data = await res.json();
    const photo = data.photos?.[0];
    const src = photo ? (photo.src.large2x || photo.src.landscape) : null;
    _pexelsCache.set(query, src);
    return src;
  } catch (e) {
    console.warn('[pexels] échec', query, e);
    _pexelsCache.set(query, null);
    return null;
  }
}

const BADGES = [
  { name:'Première semaine', earned:true, icon:'i-flame' },
  { name:'100 mots', earned:true, icon:'i-book' },
  { name:'Série x10', earned:true, icon:'i-zap' },
  { name:'Orateur', earned:false, icon:'i-mic' },
  { name:'Niveau 10', earned:false, icon:'i-trophy' },
  { name:'Polyglotte', earned:false, icon:'i-globe' },
];

const NAV = [
  { id:'dashboard', icon:'i-home',    label:'Accueil' },
  { id:'discover',  icon:'i-compass', label:'Découverte' },
  { id:'learn',     icon:'i-grad',    label:'Apprendre' },
  { id:'notebook',  icon:'i-book',    label:'Carnet' },
  { id:'review',    icon:'i-cards',   label:'Révisions' },
  { id:'stats',     icon:'i-chart',   label:'Stats' },
  { id:'profile',   icon:'i-user',    label:'Profil' },
];
const MOBILE_NAV = ['dashboard','discover','learn','notebook','profile'];

/* ---------- AUDIO (Web Speech API) ---------- */
function speak(text, btn) {
  if (!('speechSynthesis' in window)) { toast('Audio non supporté par ce navigateur', 'error'); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'fr-FR'; u.rate = 0.92;
  if (btn) {
    btn.classList.add('is-playing');
    const wave = btn.parentElement?.querySelector('.wave');
    wave?.classList.remove('is-idle');
    u.onend = () => { btn.classList.remove('is-playing'); wave?.classList.add('is-idle'); };
  }
  speechSynthesis.speak(u);
}

/* ---------- TOAST ---------- */
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast toast--${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.innerHTML = `<span style="color:var(--${type})">${icon(type==='error'?'i-alert':'i-check',20)}</span><span>${msg}</span>`;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => { el.style.transition = 'opacity .3s, transform .3s'; el.style.opacity = 0; el.style.transform = 'translateY(8px)'; setTimeout(()=>el.remove(), 320); }, 2800);
}

/* ---------- MODAL ---------- */
function openModal(html) {
  document.getElementById('modalBox').innerHTML = html;
  const ov = document.getElementById('overlay');
  ov.classList.add('is-open');
  ov.onclick = e => { if (e.target === ov) closeModal(); };
}
function closeModal() { document.getElementById('overlay').classList.remove('is-open'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* =============================================================
   SPLASH → ONBOARDING → APP
   ============================================================= */
function startOnboarding() {
  document.getElementById('splash').classList.remove('is-open');
  document.getElementById('onboarding').classList.add('is-open');
  renderOnbStep();
}
function skipToApp() {
  document.getElementById('splash').classList.remove('is-open');
  document.getElementById('onboarding').classList.remove('is-open');
  bootApp();
}

const ONB = {
  step: 0,
  picks: [null, null, null],
  steps: [
    { q:'Quel est ton objectif ?', multi:false, opts:[
      { ic:'i-target', t:'Enrichir mon vocabulaire', s:'Le plus populaire' },
      { ic:'i-globe',  t:'Préparer un voyage', s:'Mots utiles du quotidien' },
      { ic:'i-grad',   t:'Réussir un examen', s:'Niveau soutenu' },
    ]},
    { q:'Combien de temps par jour ?', multi:false, opts:[
      { ic:'i-clock', t:'5 minutes', s:'Tranquille' },
      { ic:'i-clock', t:'10 minutes', s:'Recommandé' },
      { ic:'i-clock', t:'20 minutes', s:'Intensif' },
    ]},
    { q:'Comment préfères-tu apprendre ?', multi:true, opts:[
      { ic:'i-volume', t:'En écoutant', s:'Audio d’abord' },
      { ic:'i-mic',    t:'En parlant', s:'Prononciation' },
      { ic:'i-cards',  t:'En jouant', s:'Quiz & flashcards' },
    ]},
  ],
};
function renderOnbStep() {
  const s = ONB.steps[ONB.step];
  document.getElementById('onbStep').textContent = `Étape ${ONB.step + 1} / ${ONB.steps.length}`;
  document.getElementById('onbBar').style.width = `${((ONB.step + 1) / ONB.steps.length) * 100}%`;
  const pick = ONB.picks[ONB.step];
  document.getElementById('onbBody').innerHTML = `
    <h2 class="h2" style="margin-bottom:var(--s5)">${s.q}</h2>
    <div class="col gap-3">
      ${s.opts.map((o, i) => `
        <button class="select-card" aria-pressed="${Array.isArray(pick)?pick.includes(i):pick===i}" onclick="onbPick(${i}, ${s.multi})">
          <span class="ic">${icon(o.ic, 22)}</span>
          <span class="col" style="gap:2px">
            <strong>${o.t}</strong><span class="caption">${o.s}</span>
          </span>
        </button>`).join('')}
    </div>`;
  syncOnbNext();
}
function onbPick(i, multi) {
  if (multi) {
    const arr = Array.isArray(ONB.picks[ONB.step]) ? ONB.picks[ONB.step] : [];
    const idx = arr.indexOf(i);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(i);
    ONB.picks[ONB.step] = arr;
  } else {
    ONB.picks[ONB.step] = i;
  }
  renderOnbStep();
}
function syncOnbNext() {
  const pick = ONB.picks[ONB.step];
  const ok = Array.isArray(pick) ? pick.length > 0 : pick !== null;
  const btn = document.getElementById('onbNext');
  btn.disabled = !ok;
  btn.textContent = ONB.step === ONB.steps.length - 1 ? 'Lancer LexFlow' : 'Continuer';
}
function onbAdvance() {
  if (ONB.step < ONB.steps.length - 1) { ONB.step++; renderOnbStep(); }
  else {
    document.getElementById('onboarding').classList.remove('is-open');
    bootApp();
    toast('Profil personnalisé ✓ Bienvenue !');
  }
}

/* =============================================================
   APP SHELL + ROUTER
   ============================================================= */
function bootApp() {
  document.getElementById('app').classList.remove('hidden');
  // sidebar nav
  document.getElementById('sideNav').innerHTML = NAV.map(n =>
    `<button class="nav-item" data-view="${n.id}">${icon(n.icon, 22)}<span>${n.label}</span></button>`).join('');
  // bottom nav
  document.getElementById('bottomNav').innerHTML = MOBILE_NAV.map(id => {
    const n = NAV.find(x => x.id === id);
    return `<button class="bn-item" data-view="${n.id}">${icon(n.icon, 22)}<span>${n.label}</span></button>`;
  }).join('');
  document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => setView(b.dataset.view));
  setView('dashboard');
}

const VIEWS = {};
function setView(name) {
  const main = document.getElementById('main');
  main.innerHTML = `<div class="view">${(VIEWS[name] || VIEWS.dashboard)()}</div>`;
  document.querySelectorAll('[data-view]').forEach(b =>
    b.setAttribute('aria-current', b.dataset.view === name ? 'page' : 'false'));
  main.scrollTo?.(0, 0); window.scrollTo(0, 0);
  if (VIEWS[name + 'Init']) VIEWS[name + 'Init']();
}

/* ---------- helper: word card markup ---------- */
function wordCardHTML(w) {
  const saved = STATE.saved.has(w.id);
  return `
  <article class="card word-card view">
    <div class="row between" style="margin-bottom:var(--s4)">
      <span class="badge badge--muted">${w.tag}</span>
      <div class="row gap-2">
        <span class="wave is-idle"><i></i><i></i><i></i><i></i><i></i><i></i></span>
        <button class="audio-btn" aria-label="Écouter ${w.term}" onclick="speak('${w.term}', this)">${icon('i-volume',22)}</button>
      </div>
    </div>
    <div class="row gap-3 wrap" style="align-items:baseline;margin-bottom:6px">
      <span class="word-big">${w.term}</span>
      <span class="muted pos">${w.pos}</span>
    </div>
    <p class="phon caption" style="margin-bottom:var(--s4)">${w.phon}</p>
    <p style="margin-bottom:var(--s3)">${w.def}</p>
    <p class="muted" style="font-style:italic;margin-bottom:var(--s5)">« ${w.ex} »</p>
    <div class="word-actions">
      <button class="act-btn ${saved?'is-saved':''}" onclick="toggleSave('${w.id}', this)">
        ${icon('i-bookmark',18)} ${saved?'Enregistré':'Enregistrer'}
      </button>
      <button class="act-btn" onclick="setView('learn')">${icon('i-grad',18)} Apprendre</button>
      <button class="act-btn" onclick="toast('Lien copié ✓')">${icon('i-share',18)} Partager</button>
    </div>
  </article>`;
}
function toggleSave(id, btn) {
  const has = STATE.saved.has(id);
  if (has) STATE.saved.delete(id);
  else { STATE.saved.add(id); toast('Ajouté au carnet ✓'); }
  const saved = !has;
  if (!btn) return;
  btn.classList.toggle('is-saved', saved);
  const span = btn.querySelector('span');
  if (span) span.textContent = saved ? 'Enregistré' : 'Garder';      // rail immersif
  else btn.innerHTML = `${icon('i-bookmark', 18)} ${saved ? 'Enregistré' : 'Enregistrer'}`; // carte texte
}

/** Parallaxe douce de la landing au mouvement de la souris (respecte reduced-motion). */
function initLanding() {
  const sec = document.getElementById('splash');
  if (!sec || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layers = [...sec.querySelectorAll('[data-pf]'), ...sec.querySelectorAll('.aurora__blob')];
  sec.addEventListener('pointermove', (e) => {
    const cx = e.clientX / window.innerWidth - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;
    layers.forEach((el, i) => {
      const f = el.dataset.pf ? Number(el.dataset.pf) : (i + 1) * 14;
      el.style.transform = `translate3d(${cx * f}px, ${cy * f}px, 0)`;
    });
  });
}
initLanding();

/* =============================================================
   VIEW: DASHBOARD
   ============================================================= */
VIEWS.dashboard = () => {
  const w = WORDS[0];
  const pct = Math.round((STATE.todayLearned / STATE.user.goal) * 100);
  const off = 326 - (326 * pct) / 100;
  return `
  <header class="page-head row between wrap gap-4">
    <div>
      <p class="eyebrow">${greet()}</p>
      <h1 class="h1">Bonjour, ${STATE.user.name}</h1>
    </div>
    <span class="badge badge--streak">${icon('i-flame',16)} Série de ${STATE.streak} jours</span>
  </header>

  <div class="grid grid-3">
    <!-- Objectif du jour -->
    <section class="card card--glow span-2 row between wrap gap-5">
      <div class="col gap-3" style="min-width:200px">
        <p class="eyebrow">Objectif du jour</p>
        <h2 class="h2">${STATE.todayLearned} / ${STATE.user.goal} mots</h2>
        <p class="muted">Plus que ${Math.max(0, STATE.user.goal - STATE.todayLearned)} mots pour valider ta journée.</p>
        <button class="btn btn--primary" style="align-self:flex-start" onclick="setView('learn')">
          ${icon('i-play',18)} Continuer
        </button>
      </div>
      <div class="ring">
        <svg width="132" height="132" viewBox="0 0 132 132">
          <circle class="track" cx="66" cy="66" r="52"/>
          <circle class="bar" cx="66" cy="66" r="52" stroke-dasharray="326" stroke-dashoffset="${off}"/>
        </svg>
        <div class="ring__label"><strong class="h3">${pct}%</strong><span class="caption">complété</span></div>
      </div>
    </section>

    <!-- Mot du jour -->
    <section class="card col gap-3">
      <div class="row between"><p class="eyebrow">Mot du jour</p>${icon('i-sparkle',18)}</div>
      <div class="row gap-3" style="align-items:baseline">
        <span class="h3" style="font-weight:800">${w.term}</span>
        <button class="audio-btn" style="width:44px;height:44px" aria-label="Écouter ${w.term}" onclick="speak('${w.term}', this)">${icon('i-volume',18)}</button>
      </div>
      <p class="caption phon">${w.phon}</p>
      <p class="muted">${w.def}</p>
      <button class="btn btn--secondary btn--block" onclick="setView('discover')">Découvrir d’autres mots</button>
    </section>
  </div>

  <div class="grid grid-3" style="margin-top:var(--s4)">
    ${statTile('i-zap','XP total', STATE.xp.toLocaleString('fr-FR'),'+120 aujourd’hui')}
    ${statTile('i-book','Mots appris','342','sur 6 thèmes')}
    ${statTile('i-clock','Temps cette semaine','1h 24','+18% vs semaine passée')}
  </div>

  <section class="card" style="margin-top:var(--s4)">
    <div class="row between" style="margin-bottom:var(--s4)">
      <h3 class="h3">Cette semaine</h3>
      <button class="btn--ghost caption" onclick="setView('stats')" style="padding:6px 10px;border-radius:8px">Voir les stats ${icon('i-arrow-right',14)}</button>
    </div>
    ${barsHTML([4,7,3,8,6,9,6], ['L','M','M','J','V','S','D'])}
  </section>`;
};
function statTile(ic, label, kpi, sub) {
  return `<div class="tile stat col gap-2">
    <span class="row between muted">${label}<span style="color:var(--secondary)">${icon(ic,18)}</span></span>
    <span class="kpi">${kpi}</span>
    <span class="caption">${sub}</span>
  </div>`;
}
function greet() { const h = new Date().getHours(); return h < 12 ? 'Bonne matinée' : h < 18 ? 'Bel après-midi' : 'Bonne soirée'; }

/* =============================================================
   VIEW: DÉCOUVERTE (feed) — avec état chargement
   ============================================================= */
VIEWS.discover = () => `
  <div class="feed-immersive" id="feed">
    <div class="slide slide--skeleton"><div class="skeleton" style="position:absolute;inset:0"></div></div>
  </div>`;
VIEWS.discoverInit = () => {
  // simule un chargement réseau → état skeleton puis feed immersif
  setTimeout(() => {
    const feed = document.getElementById('feed');
    if (!feed) return;
    feed.innerHTML = WORDS.map(slideHTML).join('');
    initFeedParallax(feed);
    loadFeedPhotos(feed);
  }, 700);
};
/** Charge une vraie photo Pexels par slide et la fait apparaître en crossfade. */
function loadFeedPhotos(feed) {
  if (!isPexelsConfigured) return; // pas de clé → on garde le mesh gradient
  feed.querySelectorAll('.slide').forEach(async (slide) => {
    const layer = slide.querySelector('.slide__photo');
    if (!layer) return;
    const src = await fetchPexelsImage(slide.dataset.img);
    if (!src) return;
    const pre = new Image();
    pre.onload = () => { layer.style.backgroundImage = `url("${src}")`; layer.classList.add('is-loaded'); };
    pre.src = src; // précharge → pas de flash
  });
}
/** Hue déterministe par mot → visuel généré unique et stable. */
function wordHue(id) { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 360; return h; }
function slideHTML(w, i) {
  const saved = STATE.saved.has(w.id);
  return `
  <section class="slide" style="--hue:${wordHue(w.id)}" data-word="${w.term}" data-img="${w.img || w.term}">
    <div class="slide__bg" data-parallax aria-hidden="true"></div>
    <div class="slide__photo" data-parallax aria-hidden="true"></div>
    <div class="slide__scrim" aria-hidden="true"></div>
    <div class="slide__content">
      <span class="slide__tag">${w.tag}</span>
      <button class="audio-orb" aria-label="Écouter ${w.term}" onclick="speak('${w.term}', this)">${icon('i-volume', 30)}</button>
      <h2 class="slide__word">${w.term}</h2>
      <p class="slide__phon">${w.phon} · ${w.pos}</p>
      <p class="slide__def">${w.def}</p>
      <p class="slide__ex">« ${w.ex} »</p>
      ${i === 0 ? `<span class="slide__hint">${icon('i-arrow-right', 16)} Fais défiler</span>` : ''}
    </div>
    <div class="slide__rail">
      <button class="rail-btn ${saved ? 'is-saved' : ''}" aria-label="Enregistrer ${w.term}" onclick="toggleSave('${w.id}', this)">
        ${icon('i-bookmark', 22)}<span>${saved ? 'Enregistré' : 'Garder'}</span>
      </button>
      <button class="rail-btn" aria-label="Apprendre ${w.term}" onclick="setView('learn')">
        ${icon('i-grad', 22)}<span>Apprendre</span>
      </button>
      <button class="rail-btn" aria-label="Partager ${w.term}" onclick="toast('Lien copié ✓')">
        ${icon('i-share', 22)}<span>Partager</span>
      </button>
    </div>
  </section>`;
}
/** Parallaxe : le fond généré défile plus lentement que le contenu. */
function initFeedParallax(feed) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const slides = [...feed.querySelectorAll('.slide')];
  let ticking = false;
  const update = () => {
    const ch = feed.clientHeight || 1;
    for (const s of slides) {
      const rel = (s.offsetTop - feed.scrollTop) / ch; // 0 quand le slide est aligné
      const t = `translateY(${rel * -14}%) scale(1.2)`;
      s.querySelectorAll('[data-parallax]').forEach((el) => { el.style.transform = t; });
    }
    ticking = false;
  };
  feed.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* =============================================================
   VIEW: SESSION APPRENTISSAGE — mot géant, audio, micro, feedback IA
   ============================================================= */
VIEWS.learn = () => {
  const w = WORDS[2];
  return `
  <header class="page-head row between">
    <button class="btn--icon" aria-label="Retour" onclick="setView('dashboard')">${icon('i-arrow-left',20)}</button>
    <div class="progress" style="flex:1;margin:0 var(--s4)"><span style="width:60%"></span></div>
    <span class="badge badge--muted">3 / 5</span>
  </header>

  <div class="session" id="session" data-word="${w.term}">
    <span class="eyebrow">Répète après l’audio</span>
    <h1 class="word-giant">${w.term}</h1>
    <p class="phon">${w.phon} · <span class="muted">${w.pos}</span></p>

    <div class="row gap-3 center">
      <span class="wave is-idle"><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <button class="audio-btn audio-btn--lg" aria-label="Écouter le mot" onclick="speak('${w.term}', this)">${icon('i-volume',34)}</button>
    </div>

    <p class="muted" style="max-width:420px">${w.def}</p>

    <div class="col gap-4 center">
      <button class="mic-btn" id="micBtn" aria-label="Activer le micro" onclick="recordTry()">${icon('i-mic',40)}</button>
      <span class="caption" id="micHint">Appuie et prononce le mot</span>
    </div>

    <div id="iaBox"></div>

    <div class="row gap-3" style="width:min(420px,100%)">
      <button class="btn btn--secondary grow" onclick="speak('${w.term}', this.previousElementSibling)">Réécouter</button>
      <button class="btn btn--primary grow" onclick="validateWord()">${icon('i-check',18)} Je connais</button>
    </div>
  </div>`;
};
function recordTry() {
  const btn = document.getElementById('micBtn');
  const hint = document.getElementById('micHint');
  btn.classList.add('is-rec'); hint.textContent = 'Écoute en cours…';
  setTimeout(() => {
    btn.classList.remove('is-rec'); hint.textContent = 'Appuie et prononce le mot';
    const score = 78 + Math.floor(Math.random() * 20);
    document.getElementById('iaBox').innerHTML = `
      <div class="feedback-ia view">
        <div class="row between" style="margin-bottom:6px">
          <strong>${icon('i-sparkle',16)} Feedback IA</strong>
          <span class="badge badge--success">${score}% proche</span>
        </div>
        <p class="caption">Bonne prononciation ! Insiste un peu plus sur la syllabe finale. Réessaie pour viser 90%.</p>
      </div>`;
  }, 1500);
}
function validateWord() {
  STATE.todayLearned++; STATE.xp += 20;
  successScreen('Mot validé !', '+20 XP · 1 mot ajouté à ton carnet', 'Mot suivant', () => setView('learn'));
}

/* =============================================================
   VIEW: CARNET — recherche, filtres, cartes, état vide
   ============================================================= */
let NB_FILTER = 'all';
let NB_QUERY = '';
VIEWS.notebook = () => `
  <header class="page-head">
    <p class="eyebrow">Mon vocabulaire</p>
    <h1 class="h1">Carnet</h1>
  </header>
  <div class="search" style="margin-bottom:var(--s4)">
    ${icon('i-search',20)}
    <input type="search" id="nbSearch" placeholder="Rechercher un mot…" value="${NB_QUERY}" oninput="nbSearch(this.value)" aria-label="Rechercher" />
  </div>
  <div class="row gap-2 wrap" style="margin-bottom:var(--s5)">
    ${['all','Enregistrés','Appris','À revoir'].map(f =>
      `<button class="chip" aria-pressed="${NB_FILTER===f}" onclick="nbSetFilter('${f}')">${f==='all'?'Tous':f}</button>`).join('')}
  </div>
  <div class="grid grid-2" id="nbList"></div>`;
VIEWS.notebookInit = () => renderNotebook();
function nbSearch(v){ NB_QUERY = v; renderNotebook(); }
function nbSetFilter(f){ NB_FILTER = f; renderNotebook(); document.querySelectorAll('#main .chip').forEach(c=>c.setAttribute('aria-pressed', c.textContent.trim()===(f==='all'?'Tous':f))); }
function renderNotebook() {
  const list = document.getElementById('nbList'); if (!list) return;
  let items = WORDS.filter(w => w.term.toLowerCase().includes(NB_QUERY.toLowerCase()));
  if (NB_FILTER === 'Enregistrés') items = items.filter(w => STATE.saved.has(w.id));
  if (items.length === 0) {
    list.style.gridTemplateColumns = '1fr';
    list.innerHTML = emptyState('i-inbox', 'Aucun mot trouvé', 'Essaie un autre mot ou explore le feed Découverte.', 'Aller à Découverte', "setView('discover')");
    return;
  }
  list.style.gridTemplateColumns = '';
  list.innerHTML = items.map(w => `
    <article class="tile col gap-3">
      <div class="row between">
        <strong class="h3" style="font-weight:700">${w.term}</strong>
        <button class="audio-btn" style="width:44px;height:44px" aria-label="Écouter ${w.term}" onclick="speak('${w.term}', this)">${icon('i-volume',18)}</button>
      </div>
      <p class="caption phon">${w.phon}</p>
      <p class="muted caption">${w.def}</p>
      <div class="row gap-2"><span class="badge badge--muted">${w.tag}</span>${STATE.saved.has(w.id)?'<span class="badge badge--accent">Enregistré</span>':''}</div>
    </article>`).join('');
}

/* =============================================================
   VIEW: RÉVISIONS — flashcard + quiz audio + XP/score
   ============================================================= */
const QUIZ = { i: 0, score: 0, total: 4 };
VIEWS.review = () => {
  QUIZ.i = 0; QUIZ.score = 0;
  return `
  <header class="page-head row between wrap gap-4">
    <div><p class="eyebrow">Révisions</p><h1 class="h1">Quiz du jour</h1></div>
    <div class="row gap-2">
      <span class="badge badge--accent">${icon('i-zap',16)} ${QUIZ.score*20} XP</span>
      <span class="badge badge--muted" id="quizProg">1 / ${QUIZ.total}</span>
    </div>
  </header>
  <div id="quizArea"></div>`;
};
VIEWS.reviewInit = () => renderQuiz();
function renderQuiz() {
  const area = document.getElementById('quizArea'); if (!area) return;
  if (QUIZ.i >= QUIZ.total) { return quizDone(); }
  const correct = WORDS[QUIZ.i];
  const opts = shuffle([correct, ...shuffle(WORDS.filter(w => w.id !== correct.id)).slice(0,2)]);
  document.getElementById('quizProg').textContent = `${QUIZ.i + 1} / ${QUIZ.total}`;
  area.innerHTML = `
    <div class="card col gap-5 view">
      <div class="col center gap-3" style="text-align:center">
        <span class="caption muted">Quel mot correspond à cette définition ?</span>
        <button class="audio-btn audio-btn--lg" aria-label="Écouter l'indice" onclick="speak('${correct.term}', this)">${icon('i-volume',34)}</button>
        <p style="max-width:420px">${correct.def}</p>
      </div>
      <div class="col gap-3" id="quizOpts">
        ${opts.map(o => `<button class="quiz-opt" data-id="${o.id}" onclick="answer('${o.id}','${correct.id}',this)">
          <span class="grow">${o.term}</span><span class="muted caption">${o.pos}</span></button>`).join('')}
      </div>
    </div>`;
}
function answer(picked, correct, btn) {
  document.querySelectorAll('#quizOpts .quiz-opt').forEach(b => b.style.pointerEvents = 'none');
  if (picked === correct) { btn.classList.add('correct'); QUIZ.score++; STATE.xp += 20; toast('Bravo ! +20 XP'); }
  else {
    btn.classList.add('wrong');
    document.querySelector(`#quizOpts [data-id="${correct}"]`).classList.add('correct');
    toast('Presque ! On revoit ce mot bientôt.', 'error');
  }
  setTimeout(() => { QUIZ.i++; renderQuiz(); }, 1100);
}
function quizDone() {
  const area = document.getElementById('quizArea');
  const perfect = QUIZ.score === QUIZ.total;
  area.innerHTML = `
    <div class="card state view">
      <div class="success-burst">${icon(perfect?'i-trophy':'i-check',44)}</div>
      <h2 class="h2">${perfect ? 'Sans-faute !' : 'Quiz terminé'}</h2>
      <p class="muted">Score ${QUIZ.score}/${QUIZ.total} · +${QUIZ.score*20} XP</p>
      <div class="row gap-3">
        <button class="btn btn--secondary" onclick="setView('dashboard')">Accueil</button>
        <button class="btn btn--primary" onclick="setView('review')">Rejouer</button>
      </div>
    </div>`;
}

/* =============================================================
   VIEW: STATISTIQUES — courbe, série, niveau, temps
   ============================================================= */
VIEWS.stats = () => `
  <header class="page-head"><p class="eyebrow">Progression</p><h1 class="h1">Statistiques</h1></header>
  <div class="grid grid-4" style="margin-bottom:var(--s4)">
    ${statTile('i-flame','Série actuelle', STATE.streak,'record : 21 jours')}
    ${statTile('i-zap','Niveau', STATE.user.level,'68% vers niv. 8')}
    ${statTile('i-book','Mots maîtrisés','342','+24 cette semaine')}
    ${statTile('i-clock','Temps total','18h 40','depuis le début')}
  </div>
  <section class="card" style="margin-bottom:var(--s4)">
    <div class="row between" style="margin-bottom:var(--s5)">
      <h3 class="h3">Mots appris</h3>
      <div class="tabs"><button class="tab" aria-selected="false">Semaine</button><button class="tab" aria-selected="true">Mois</button></div>
    </div>
    ${lineChartHTML([6,9,7,12,10,15,13,18])}
  </section>
  <div class="grid grid-2">
    <section class="card col gap-4">
      <h3 class="h3">Progression du niveau</h3>
      <div class="row between caption"><span>Niveau ${STATE.user.level}</span><span>Niveau ${STATE.user.level+1}</span></div>
      <div class="progress"><span style="width:68%"></span></div>
      <p class="muted caption">Encore 520 XP pour atteindre le niveau ${STATE.user.level+1}.</p>
    </section>
    <section class="card col gap-4">
      <h3 class="h3">Régularité</h3>
      ${barsHTML([3,5,2,6,4,7,5], ['L','M','M','J','V','S','D'])}
    </section>
  </div>`;

/* =============================================================
   VIEW: PROFIL — avatar, niveau, badges, réglages rapides
   ============================================================= */
VIEWS.profile = () => `
  <header class="page-head"><p class="eyebrow">Mon compte</p><h1 class="h1">Profil</h1></header>
  <section class="card row gap-5 wrap" style="margin-bottom:var(--s4)">
    <div class="avatar">${STATE.user.initials}</div>
    <div class="col gap-2 grow" style="min-width:200px">
      <h2 class="h2">${STATE.user.name}</h2>
      <div class="row gap-2 wrap">
        <span class="badge badge--accent">${icon('i-trophy',14)} Niveau ${STATE.user.level}</span>
        <span class="badge badge--streak">${icon('i-flame',14)} ${STATE.streak} jours</span>
        <span class="badge badge--muted">${icon('i-globe',14)} ${STATE.user.lang}</span>
      </div>
      <div class="progress progress--thin" style="margin-top:8px"><span style="width:68%"></span></div>
      <span class="caption">${STATE.xp.toLocaleString('fr-FR')} XP · 68% vers niveau ${STATE.user.level+1}</span>
    </div>
    <button class="btn btn--secondary" onclick="setView('settings')">${icon('i-cog',18)} Réglages</button>
  </section>

  <section class="card" style="margin-bottom:var(--s4)">
    <h3 class="h3" style="margin-bottom:var(--s5)">Badges</h3>
    <div class="grid grid-3">
      ${BADGES.map(b => `
        <div class="row gap-3" style="align-items:center">
          <span class="medal ${b.earned?'medal--earned':'medal--locked'}">${icon(b.icon,24)}</span>
          <div class="col"><strong class="caption" style="color:var(--text)">${b.name}</strong>
          <span class="caption">${b.earned?'Débloqué':'À débloquer'}</span></div>
        </div>`).join('')}
    </div>
  </section>

  <div class="grid grid-3">
    ${statTile('i-zap','XP total', STATE.xp.toLocaleString('fr-FR'),'rang argent')}
    ${statTile('i-book','Mots','342','6 thèmes')}
    ${statTile('i-flame','Record série','21','jours')}
  </div>`;

/* =============================================================
   VIEW: PARAMÈTRES — toggles, réglages, action destructive
   ============================================================= */
VIEWS.settings = () => `
  <header class="page-head row between">
    <div><p class="eyebrow">Préférences</p><h1 class="h1">Paramètres</h1></div>
    <button class="btn--icon" aria-label="Retour" onclick="setView('profile')">${icon('i-x',20)}</button>
  </header>
  <section class="card" style="margin-bottom:var(--s4)">
    <h3 class="h3" style="margin-bottom:var(--s2)">Apprentissage</h3>
    ${settingRow('i-volume','Audio automatique','Lit le mot dès l’ouverture','audioAuto')}
    ${settingRow('i-bell','Rappel quotidien',`Chaque jour à ${STATE.settings.daily}`,'notif')}
    <div class="row-item">
      <span style="color:var(--secondary)">${icon('i-target',22)}</span>
      <div class="col grow"><strong>Objectif quotidien</strong><span class="caption">${STATE.user.goal} mots / jour</span></div>
      <div class="tabs">${[5,10,20].map(n=>`<button class="tab" aria-selected="${STATE.user.goal===n}" onclick="setGoal(${n})">${n}</button>`).join('')}</div>
    </div>
  </section>
  <section class="card" style="margin-bottom:var(--s4)">
    <h3 class="h3" style="margin-bottom:var(--s2)">Apparence & langue</h3>
    ${settingRow('i-moon','Thème sombre','Recommandé le soir','darkMode')}
    <div class="row-item">
      <span style="color:var(--secondary)">${icon('i-globe',22)}</span>
      <div class="col grow"><strong>Langue d’apprentissage</strong><span class="caption">${STATE.user.lang}</span></div>
      <button class="btn btn--secondary" onclick="toast('Sélecteur de langue')">Changer</button>
    </div>
  </section>
  <section class="card">
    <button class="btn btn--secondary btn--block" onclick="toast('Déconnecté')" style="margin-bottom:var(--s3)">Se déconnecter</button>
    <button class="btn--ghost btn--block" style="color:var(--error)" onclick="confirmDelete()">Supprimer mon compte</button>
  </section>`;
function settingRow(ic, title, sub, key) {
  return `<div class="row-item">
    <span style="color:var(--secondary)">${icon(ic,22)}</span>
    <div class="col grow"><strong>${title}</strong><span class="caption">${sub}</span></div>
    <button class="toggle" role="switch" aria-checked="${STATE.settings[key]}" aria-label="${title}"
      onclick="toggleSetting('${key}', this)"></button>
  </div>`;
}
function toggleSetting(key, el) { STATE.settings[key] = !STATE.settings[key]; el.setAttribute('aria-checked', STATE.settings[key]); }
function setGoal(n) { STATE.user.goal = n; setView('settings'); toast(`Objectif : ${n} mots / jour`); }
function confirmDelete() {
  openModal(`
    <div class="col gap-4">
      <span class="state__icon" style="color:var(--error);background:rgba(255,59,48,.12)">${icon('i-alert',32)}</span>
      <h3 class="h3" id="modalTitle">Supprimer ton compte ?</h3>
      <p class="muted">Cette action est définitive. Tes ${STATE.xp.toLocaleString('fr-FR')} XP et ton carnet seront perdus.</p>
      <div class="row gap-3" style="margin-top:var(--s2)">
        <button class="btn btn--secondary grow" onclick="closeModal()">Annuler</button>
        <button class="btn grow" style="background:var(--error);color:#fff" onclick="closeModal();toast('Compte supprimé','error')">Supprimer</button>
      </div>
    </div>`);
}

/* =============================================================
   ÉTATS RÉUTILISABLES
   ============================================================= */
function emptyState(ic, title, sub, cta, action) {
  return `<div class="state">
    <span class="state__icon">${icon(ic,32)}</span>
    <h3 class="h3">${title}</h3><p class="muted">${sub}</p>
    ${cta ? `<button class="btn btn--primary" onclick="${action}">${cta}</button>` : ''}
  </div>`;
}
function successScreen(title, sub, cta, action) {
  openModal(`<div class="col center gap-4" style="text-align:center">
    <div class="success-burst">${icon('i-check',44)}</div>
    <h3 class="h3" id="modalTitle">${title}</h3><p class="muted">${sub}</p>
    <div class="row gap-3"><button class="btn btn--secondary" onclick="closeModal()">Fermer</button>
    <button class="btn btn--primary" onclick="closeModal();${action.toString().includes('=>')?'':''}">${cta}</button></div>
  </div>`);
  // wire CTA properly
  document.querySelector('#modalBox .btn--primary').onclick = () => { closeModal(); action(); };
}

/* =============================================================
   GRAPHIQUES (SVG natif, responsive)
   ============================================================= */
function barsHTML(data, labels) {
  const max = Math.max(...data);
  const summary = labels.map((l, i) => `${l} : ${data[i]}`).join(', ');
  return `<div role="img" aria-label="Régularité hebdomadaire — ${summary}">
    <div class="bars">${data.map((v,i)=>`<div class="bar ${i===data.length-1?'':'dim'}" style="height:${(v/max)*100}%" title="${v}"><span class="bar-val">${v}</span></div>`).join('')}</div>
    <div class="row between caption" style="margin-top:var(--s2)" aria-hidden="true">${labels.map(l=>`<span style="flex:1;text-align:center">${l}</span>`).join('')}</div>
  </div>`;
}
function lineChartHTML(data) {
  const W = 640, H = 200, p = 24;
  const max = Math.max(...data), min = 0;
  const x = i => p + (i * (W - p*2)) / (data.length - 1);
  const y = v => H - p - ((v - min) / (max - min)) * (H - p*2);
  const pts = data.map((v,i)=>`${x(i)},${y(v)}`).join(' ');
  const area = `${p},${H-p} ${pts} ${W-p},${H-p}`;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Courbe des mots appris, tendance à la hausse">
    ${[0,1,2,3].map(i=>`<line class="grid-line" x1="${p}" y1="${p+i*(H-p*2)/3}" x2="${W-p}" y2="${p+i*(H-p*2)/3}"/>`).join('')}
    <polygon class="area" points="${area}"/>
    <polyline class="line" points="${pts}"/>
    ${data.map((v,i)=>`<circle class="dot" cx="${x(i)}" cy="${y(v)}" r="4"><title>${v} mots</title></circle>`).join('')}
  </svg>`;
}

/* ---------- utils ---------- */
function shuffle(a){ a=[...a]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

/* Démo : raccourci clavier "D" ouvre le Design System */
document.addEventListener('keydown', e => { if (e.key.toLowerCase()==='d' && e.altKey) location.href='design-system.html'; });
