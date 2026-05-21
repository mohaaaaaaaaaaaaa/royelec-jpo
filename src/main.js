import './style.css'

const STANDS = [
  { name: 'Airwell',        slug: 'airwell',        logo: 'airwell.svg',        url: 'https://www.airwell.com' },
  { name: 'Roger Pradier',  slug: 'roger-pradier',  logo: 'roger-pradier.svg',  url: 'https://www.roger-pradier.com' },
  { name: 'Soler-Palau',    slug: 'soler-palau',    logo: 'soler-palau.svg',    url: 'https://www.solerpalau.com/fr' },
  { name: 'Came France',    slug: 'came-france',    logo: 'came-france.png',    url: 'https://www.came.com/fr' },
  { name: 'Ledvance',       slug: 'ledvance',       logo: 'ledvance.svg',       url: 'https://www.ledvance.fr' },
  { name: 'Asled',          slug: 'asled',          logo: 'asled.png',          url: 'https://www.asled.fr' },
  { name: 'Intuis',         slug: 'intuis',         logo: 'intuis.png',         url: 'https://www.intuis.fr' },
  { name: 'Europole',       slug: 'europole',       logo: 'europole.svg',       url: 'https://www.europole.com' },
  { name: 'Bailey Lights',  slug: 'bailey-lights',  logo: 'bailey-lights.svg',  url: 'https://www.bailey.eu' },
  { name: 'Hager',          slug: 'hager',          logo: 'hager.webp',         url: 'https://www.hager.fr' },
  { name: 'Finder France',  slug: 'finder-france',  logo: 'finder-france.png',  url: 'https://www.findernet.com/fr' },
  { name: 'Axelair',        slug: 'axelair',        logo: 'axelair.svg',        url: 'https://www.axelair.com' },
  { name: 'Sermes',         slug: 'sermes',         logo: 'sermes.png',         url: 'https://www.sermes.fr' },
  { name: 'Courant',        slug: 'courant',        logo: 'courant.png',        url: 'https://www.courant.fr' },
  { name: 'Indigo Lighting',slug: 'indigo-lighting',logo: 'indigo-lighting.png',url: 'https://www.indigo-lighting.com' },
  { name: 'Gewiss France',  slug: 'gewiss-france',  logo: 'gewiss-france.jpg',  url: 'https://www.gewiss.com/fr' },
  { name: 'Feilo Sylvania', slug: 'feilo-sylvania', logo: 'feilo-sylvania.webp',url: 'https://www.feilo-sylvania.com/fr' },
  { name: 'Engitechs',      slug: 'engitechs',      logo: 'engitechs.svg',      url: 'https://www.engitechs.com' },
  { name: 'Theben',         slug: 'theben',         logo: 'theben.svg',         url: 'https://www.theben.fr' },
  { name: 'Airzone France', slug: 'airzone-france', logo: 'airzone-france.svg', url: 'https://www.airzone.eu/fr' },
  { name: 'Aiphone',        slug: 'aiphone',        logo: 'aiphone.svg',        url: 'https://www.aiphone.fr' },
  { name: 'Somfy-BFT',      slug: 'somfy-bft',      logo: 'somfy-bft.svg',      url: 'https://www.somfy.fr' },
  { name: 'Deltadore',      slug: 'deltadore',      logo: 'deltadore.svg',      url: 'https://www.deltadore.fr' },
  { name: 'Urmet',          slug: 'urmet',          logo: 'urmet.svg',          url: 'https://www.urmet.com/fr' },
  { name: 'Teddington',     slug: 'teddington',     logo: 'teddington.png',     url: 'https://www.teddington.eu' },
  { name: 'Thermor',        slug: 'thermor',        logo: 'thermor.svg',        url: 'https://www.thermor.com' },
]

const PRIZES = [
  { name: 'Casquette Milwaukee', img: '/casquette.png', color: '#C8180A', prob: 0.5 },
  { name: 'Mug Feilo Sylvania',  img: '/mug.png',       color: '#1A8A6E', prob: 0.5 },
]

document.querySelector('#app').innerHTML = `
<div id="s-accueil" class="screen active">
  <div class="hdr">
    <img src="/logo.png" alt="ROYELEC" class="logo-img">
    <div class="hdr-right">
      <p>Blois · 2026</p>
      <h2>Portes Ouvertes</h2>
    </div>
  </div>
  <div class="hero">
    <p class="hero-eye">Journée Portes Ouvertes</p>
    <h1 class="hero-title">Découvrez<br>nos marques<br>partenaires</h1>
    <p class="hero-sub">Scannez les QR codes de chaque stand et suivez votre progression en temps réel.</p>
  </div>
  <div class="form-wrap">
    <div class="card">
      <label class="lbl">Nom de votre entreprise</label>
      <input type="text" id="company-input" class="inp" placeholder="ex : Électricité Martin" autocomplete="off">
      <button class="btn btn-main" id="btn-start">Commencer la visite</button>
      <div class="row-info">
        <span class="pill">${STANDS.length} stands à découvrir</span>
        <button class="link" id="btn-lb-accueil">Classement en direct</button>
      </div>
    </div>
  </div>
</div>

<div id="s-progression" class="screen">
  <div class="prog-hdr">
    <div class="visitor-row">
      <div class="avatar" id="p-avatar">?</div>
      <div>
        <div class="vname" id="p-name">—</div>
        <div class="vsub" id="p-sub">0 stand visité</div>
      </div>
      <div class="rank-pill" id="p-rank">#—</div>
    </div>
    <div class="circ-row">
      <div class="circ-wrap">
        <svg class="circ-svg" width="96" height="96" viewBox="0 0 96 96">
          <circle class="circ-bg" cx="48" cy="48" r="42"/>
          <circle class="circ-p" id="circ" cx="48" cy="48" r="42"/>
        </svg>
        <div class="circ-inner">
          <span class="circ-pct" id="circ-pct">0%</span>
          <span class="circ-lbl">visité</span>
        </div>
      </div>
      <div class="stats">
        <div class="stat"><div class="sdot s-white"></div><strong id="s-visited">0</strong>&nbsp;visités</div>
        <div class="stat"><div class="sdot s-dim"></div><strong id="s-remaining">0</strong>&nbsp;restants</div>
        <div class="stat"><div class="sdot" style="background:rgba(255,255,255,0.5)"></div><span id="s-timer" style="color:rgba(255,255,255,0.65);font-size:13px">0:00</span></div>
      </div>
    </div>
  </div>
  <div class="body">
    <div class="prog-actions">
      <button class="prog-action-btn" id="btn-fournisseurs">
        <span class="prog-action-icon"></span>
        <span>Fournisseurs</span>
      </button>
      <button class="prog-action-btn" id="btn-prizes-preview">
        <span class="prog-action-icon"></span>
        <span>Prix à gagner</span>
      </button>
    </div>
    <div class="sec-lbl">Stands</div>
    <div class="stands-grid" id="stands-grid"></div>
    <button class="btn btn-main" id="btn-scanner">Scanner un QR code</button>
    <button class="btn btn-ghost" id="btn-lb-prog">Classement en direct</button>
  </div>
</div>

<div id="s-scanner" class="screen">
  <div class="scan-hdr">
    <h2>Scanner un stand</h2>
    <p>Pointez la caméra vers le QR code du stand</p>
  </div>
  <div class="scan-body">
    <div id="qr-reader"></div>
    <div class="scan-status" id="scan-status"><p>En attente du QR code...</p></div>
    <div class="scan-ok" id="scan-ok">
      <h3 id="scan-brand">—</h3>
      <p>Stand validé avec succès</p>
    </div>
    <button class="btn btn-ghost" id="btn-back-scan">Retour à ma progression</button>
  </div>
</div>

<div id="s-leaderboard" class="screen">
  <div class="lb-hdr">
    <h2>Classement Live</h2>
    <p id="lb-sub">Chargement...</p>
  </div>
  <div class="lb-body">
    <div class="loading" id="lb-loading"><div class="spin"></div>Connexion...</div>
    <div class="podium" id="podium"></div>
    <div id="lb-list"></div>
    <button class="btn btn-ghost" id="btn-back-lb">Retour</button>
  </div>
</div>

<div id="s-fournisseurs" class="screen">
  <div class="lb-hdr">
    <h2>Nos fournisseurs</h2>
    <p>Découvrez leurs sites officiels</p>
  </div>
  <div class="body" style="gap:10px">
    <div id="fournisseurs-list"></div>
    <button class="btn btn-ghost" id="btn-back-fourn">Retour</button>
  </div>
</div>

<div class="toast" id="toast"></div>
`

// --- Firebase ---
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'
import { getDatabase, ref, set, get, onValue, update } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js'

const firebaseConfig = {
  apiKey: "AIzaSyDJ_naM3flZO5cHjUPA-6owhUL_vfAd0BU",
  authDomain: "royelecjpo.firebaseapp.com",
  databaseURL: "https://royelecjpo-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "royelecjpo",
  storageBucket: "royelecjpo.firebasestorage.app",
  messagingSenderId: "851684025105",
  appId: "1:851684025105:web:d2bf3347c5d6bd1e9d62b0"
}

const fbApp = initializeApp(firebaseConfig)
const db = getDatabase(fbApp)

let state = { company: '', visited: [], companyKey: '', startTime: null }
let html5QrCode = null
let lbUnsub = null
let timerInterval = null

function toKey(name){ return name.toLowerCase().replace(/[^a-z0-9]/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'') }

function show(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  document.getElementById(id).classList.add('active')
  window.scrollTo(0,0)
}

function formatTime(ms){
  const s = Math.floor(ms/1000)
  const m = Math.floor(s/60)
  const sec = s % 60
  return m + ':' + (sec < 10 ? '0' : '') + sec
}

function startTimer(){
  if(timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if(!state.startTime) return
    const el = document.getElementById('s-timer')
    if(el) el.textContent = formatTime(Date.now() - state.startTime)
  }, 1000)
}

// --- Accueil ---
document.getElementById('btn-start').addEventListener('click', async () => {
  const val = document.getElementById('company-input').value.trim()
  if(!val){ showToast('Veuillez saisir le nom de votre entreprise'); return }
  state.company = val
  state.companyKey = toKey(val)
  localStorage.setItem('royelec-company', val)
  const snap = await get(ref(db, 'companies/' + state.companyKey))
  if(snap.exists()){
    const data = snap.val()
    state.visited = data.stands || []
    state.startTime = data.startTime || Date.now()
  } else {
    state.visited = []
    state.startTime = Date.now()
    await set(ref(db, 'companies/' + state.companyKey), {
      name: val, stands: [], score: 0,
      startTime: state.startTime,
      finishTime: null, prize: null
    })
  }
  localStorage.setItem('royelec-start', state.startTime)
  startTimer()
  updateProg()
  show('s-progression')
})

document.getElementById('btn-lb-accueil').addEventListener('click', showLeaderboard)

// --- Progression ---
function updateProg(){
  const v = state.visited.length, t = STANDS.length
  const pct = Math.round(v/t*100)
  document.getElementById('p-avatar').textContent = state.company.charAt(0).toUpperCase()
  document.getElementById('p-name').textContent = state.company
  document.getElementById('p-sub').textContent = v + ' stand' + (v>1?'s':'') + ' visité' + (v>1?'s':'')
  document.getElementById('circ-pct').textContent = pct + '%'
  document.getElementById('s-visited').textContent = v
  document.getElementById('s-remaining').textContent = t - v
  document.getElementById('circ').style.strokeDashoffset = 264 - (264 * pct / 100)

  document.getElementById('stands-grid').innerHTML = STANDS.map(s => {
    const visited = state.visited.includes(s.name)
    return `<div class="chip ${visited ? 'done' : 'un'}">
      <div class="chip-logo-wrap">
        <img class="chip-logo" src="/logos/${s.logo}" alt="${s.name}"
          onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <span class="chip-name-fallback" style="display:none">${s.name}</span>
      </div>
      <span class="chip-name">${s.name}</span>
      ${visited ? '<span class="chip-check">✓</span>' : ''}
    </div>`
  }).join('')

  get(ref(db,'companies')).then(snap => {
    if(!snap.exists()) return
    const all = Object.values(snap.val())
      .sort((a,b) => {
        if((b.score||0) !== (a.score||0)) return (b.score||0) - (a.score||0)
        return (a.finishTime||Infinity) - (b.finishTime||Infinity)
      })
    const idx = all.findIndex(c => toKey(c.name) === state.companyKey)
    document.getElementById('p-rank').textContent = '#' + (idx >= 0 ? idx+1 : '—')
  })
}

document.getElementById('btn-scanner').addEventListener('click', () => {
  show('s-scanner')
  document.getElementById('scan-ok').style.display = 'none'
  document.getElementById('scan-status').style.display = 'block'
  loadQrScanner()
})

document.getElementById('btn-lb-prog').addEventListener('click', showLeaderboard)

// --- Fournisseurs ---
document.getElementById('btn-fournisseurs').addEventListener('click', () => {
  document.getElementById('fournisseurs-list').innerHTML = STANDS.map(s => `
    <a href="${s.url}" target="_blank" rel="noopener" class="fourn-row">
      <div class="fourn-logo-wrap">
        <img class="fourn-logo" src="/logos/${s.logo}" alt="${s.name}"
          onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
        <span class="fourn-fallback" style="display:none">${s.name}</span>
      </div>
      <div class="fourn-info">
        <div class="fourn-name">${s.name}</div>
        <div class="fourn-url">${s.url.replace('https://','')}</div>
      </div>
      <div class="fourn-arrow">→</div>
    </a>
  `).join('')
  show('s-fournisseurs')
})

document.getElementById('btn-back-fourn').addEventListener('click', () => show('s-progression'))

// --- Prix à gagner ---
document.getElementById('btn-prizes-preview').addEventListener('click', () => {
  showPrizesPreview()
})

function showPrizesPreview(){
  let current = 0
  const overlay = document.createElement('div')
  overlay.style.cssText = `position:fixed;inset:0;background:rgba(30,0,50,0.88);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity .3s;padding:24px`
  
  const render = () => {
    const p = PRIZES[current]
    overlay.innerHTML = `
      <div style="background:white;border-radius:20px;padding:28px;max-width:340px;width:100%;text-align:center">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#9B4DBB;margin-bottom:6px">Complétez les 26 stands</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:800;color:#3A1050;margin-bottom:20px">Prix à gagner</div>
        
        <div style="position:relative;background:#F5EDFB;border-radius:16px;padding:20px;margin-bottom:16px">
          <img src="${p.img}" style="width:160px;height:140px;object-fit:contain;border-radius:10px;margin-bottom:12px">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:#3A1050">${p.name}</div>
          <div style="font-size:12px;color:#9B4DBB;margin-top:4px">Tirage au sort</div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
          <button id="prev-prize" style="padding:8px 16px;background:${current===0?'#EDE0F8':'#7B2D9B'};color:${current===0?'#9B4DBB':'white'};border:none;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;cursor:pointer;${current===0?'opacity:0.4':''}">←</button>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:#9B4DBB">${current+1} / ${PRIZES.length}</div>
          <button id="next-prize" style="padding:8px 16px;background:${current===PRIZES.length-1?'#EDE0F8':'#7B2D9B'};color:${current===PRIZES.length-1?'#9B4DBB':'white'};border:none;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;cursor:pointer;${current===PRIZES.length-1?'opacity:0.4':''}">→</button>
        </div>

        <div style="font-size:12px;color:#9B4DBB;margin-bottom:14px">Visitez tous les stands pour déclencher la roulette !</div>
        <button id="close-prizes" style="width:100%;padding:12px;background:linear-gradient(135deg,#3A1050,#7B2D9B);color:white;border:none;border-radius:10px;font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;cursor:pointer">Fermer</button>
      </div>
    `
    overlay.querySelector('#close-prizes').addEventListener('click', () => overlay.remove())
    const prev = overlay.querySelector('#prev-prize')
    const next = overlay.querySelector('#next-prize')
    if(current > 0) prev.addEventListener('click', () => { current--; render() })
    if(current < PRIZES.length-1) next.addEventListener('click', () => { current++; render() })
  }

  render()
  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.style.opacity = '1')
}

// --- Scanner ---
function loadQrScanner(){
  if(window.Html5Qrcode){ startCamera(); return }
  const script = document.createElement('script')
  script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js'
  script.onload = startCamera
  document.head.appendChild(script)
}

function startCamera(){
  if(html5QrCode) return
  html5QrCode = new Html5Qrcode('qr-reader')
  html5QrCode.start(
    { facingMode: 'environment' },
    { fps: 10, qrbox: { width: 220, height: 220 } },
    onScanSuccess,
    () => {}
  ).catch(() => {
    document.getElementById('scan-status').innerHTML = '<p>Autorisez l\'accès à la caméra dans votre navigateur</p>'
  })
}

function onScanSuccess(text){
  const stand = extractStand(text)
  if(!stand){ showToast('QR code non reconnu'); return }
  if(stand.name === '__test__'){ stopScanner(); return }
  if(state.visited.includes(stand.name)){ showToast(stand.name + ' déjà visité'); return }
  state.visited.push(stand.name)
  const isComplete = state.visited.length === STANDS.length
  const now = Date.now()
  const updateData = { stands: state.visited, score: state.visited.length, name: state.company }
  if(isComplete) updateData.finishTime = now
  update(ref(db, 'companies/' + state.companyKey), updateData)
  stopScanner()
  showScanAnimation(stand.name, state.visited.length, STANDS.length, isComplete)
}

function showScanAnimation(brandName, visited, total, isComplete){
  const pct = Math.round(visited/total*100)
  const prevPct = Math.round((visited-1)/total*100)
  const overlay = document.createElement('div')
  overlay.style.cssText = `position:fixed;inset:0;background:linear-gradient(135deg,#3A1050,#7B2D9B);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity .3s`
  overlay.innerHTML = `
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:rgba(255,255,255,0.6);letter-spacing:3px;text-transform:uppercase;margin-bottom:32px">Stand validé</div>
    <div style="position:relative;width:220px;height:220px;margin-bottom:32px">
      <svg width="220" height="220" viewBox="0 0 220 220" style="transform:rotate(-90deg)">
        <circle cx="110" cy="110" r="96" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="12"/>
        <circle id="anim-circle" cx="110" cy="110" r="96" fill="none" stroke="white" stroke-width="12"
          stroke-linecap="round" stroke-dasharray="603"
          stroke-dashoffset="${603 - (603*prevPct/100)}"
          style="transition:stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"/>
      </svg>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <span id="anim-pct" style="font-family:'Barlow Condensed',sans-serif;font-size:64px;font-weight:800;color:white;line-height:1">${prevPct}%</span>
        <span style="font-size:12px;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:2px">visité</span>
      </div>
    </div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:800;color:white;margin-bottom:8px">${brandName}</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.6)">${visited} / ${total} stands</div>
  `
  document.body.appendChild(overlay)
  requestAnimationFrame(() => {
    overlay.style.opacity = '1'
    setTimeout(() => {
      const circle = overlay.querySelector('#anim-circle')
      const pctEl = overlay.querySelector('#anim-pct')
      circle.style.strokeDashoffset = 603 - (603*pct/100)
      let current = prevPct
      const step = () => {
        if(current < pct){
          current++
          pctEl.textContent = current + '%'
          setTimeout(step, 1200/Math.max(1,(pct-prevPct)))
        }
      }
      step()
    }, 100)
    const delay = isComplete ? 1500 : 2800
    setTimeout(() => {
      overlay.style.opacity = '0'
      setTimeout(() => {
        overlay.remove()
        updateProg()
        show('s-progression')
        if(isComplete) checkAndShowRoulette()
      }, 300)
    }, delay)
  })
}

// --- Roulette ---
async function checkAndShowRoulette(){
  const snap = await get(ref(db, 'companies/' + state.companyKey))
  if(!snap.exists()) return
  const data = snap.val()
  if(data.prize) {
    showPrizeResult(data.prize)
    return
  }
  showRoulette()
}

function showRoulette(){
  const rand = Math.random()
  let cumul = 0, chosenIdx = 0
  for(let i=0; i<PRIZES.length; i++){
    cumul += PRIZES[i].prob
    if(rand < cumul){ chosenIdx = i; break }
  }
  const prize = PRIZES[chosenIdx]

  // Construire une longue liste qui se termine sur le bon prix
  const totalItems = 30
  const items = []
  for(let i=0; i<totalItems; i++){
    if(i === totalItems - 4) items.push(PRIZES[chosenIdx])
    else items.push(PRIZES[i % PRIZES.length])
  }

  const overlay = document.createElement('div')
  overlay.style.cssText = `position:fixed;inset:0;background:linear-gradient(135deg,#3A1050,#5A1F78);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;padding:24px;opacity:0;transition:opacity .3s`

  const itemW = 150
  const visibleW = Math.min(window.innerWidth - 48, 360)
  const centerOffset = Math.floor(visibleW / 2) - Math.floor(itemW / 2)

  overlay.innerHTML = `
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:rgba(255,255,255,0.6);letter-spacing:3px;text-transform:uppercase;margin-bottom:8px">Félicitations !</div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:800;color:white;margin-bottom:4px;text-align:center">Vous avez tout visité !</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.6);margin-bottom:24px;text-align:center">Tentez votre chance</div>

    <div style="width:${visibleW}px;position:relative;margin-bottom:28px">
      <div style="position:absolute;top:-14px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-top:16px solid white;z-index:4"></div>
      <div style="position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;border-bottom:16px solid white;z-index:4"></div>
      <div style="position:absolute;top:0;bottom:0;left:50%;transform:translateX(-50%);width:${itemW}px;border:3px solid white;border-radius:4px;z-index:3;pointer-events:none"></div>
      <div style="overflow:hidden;border-radius:16px;border:2px solid rgba(255,255,255,0.25)">
        <div id="roulette-strip" style="display:flex;transform:translateX(${centerOffset}px)">
          ${items.map(p => `
            <div style="min-width:${itemW}px;height:130px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(255,255,255,0.08);border-right:1px solid rgba(255,255,255,0.1);gap:6px;padding:8px;flex-shrink:0">
              <img src="${p.img}" style="width:76px;height:68px;object-fit:contain;border-radius:6px">
              <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;color:white;text-align:center;letter-spacing:.5px;text-transform:uppercase;line-height:1.2;padding:0 4px">${p.name}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div style="position:absolute;top:0;left:0;width:50px;height:100%;background:linear-gradient(to right,rgba(58,16,80,0.9),transparent);pointer-events:none;z-index:2"></div>
      <div style="position:absolute;top:0;right:0;width:50px;height:100%;background:linear-gradient(to left,rgba(58,16,80,0.9),transparent);pointer-events:none;z-index:2"></div>
    </div>

    <button id="btn-spin" style="padding:16px 48px;background:white;color:#3A1050;border:none;border-radius:12px;font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;cursor:pointer;letter-spacing:1px;box-shadow:0 4px 20px rgba(0,0,0,0.3)">Lancer !</button>
  `

  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.style.opacity = '1')

  overlay.querySelector('#btn-spin').addEventListener('click', () => {
    const btn = overlay.querySelector('#btn-spin')
    btn.disabled = true
    btn.style.opacity = '0.4'

    const strip = overlay.querySelector('#roulette-strip')
    const targetIdx = totalItems - 4
    const finalOffset = centerOffset - (targetIdx * itemW)

    // Animation en 3 phases
    strip.style.transition = 'transform 0.5s cubic-bezier(.4,0,1,1)'
    strip.style.transform = `translateX(${centerOffset - itemW * 4}px)`

    setTimeout(() => {
      strip.style.transition = `transform 2s linear`
      strip.style.transform = `translateX(${centerOffset - itemW * (totalItems - 8)}px)`
    }, 500)

    setTimeout(() => {
      strip.style.transition = `transform 2s cubic-bezier(0,.5,.3,1)`
      strip.style.transform = `translateX(${finalOffset}px)`
    }, 2500)

    setTimeout(() => {
      overlay.style.opacity = '0'
      setTimeout(() => {
        overlay.remove()
        update(ref(db, 'companies/' + state.companyKey), { prize: prize.name })
        showPrizeResult(prize.name)
      }, 400)
    }, 5000)
  })
}

function showPrizeResult(prizeName){
  const prize = PRIZES.find(p => p.name === prizeName) || { name: prizeName, img: '', color: '#7B2D9B' }
  const overlay = document.createElement('div')
  overlay.style.cssText = `position:fixed;inset:0;background:linear-gradient(135deg,${prize.color},#3A1050);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;padding:24px;opacity:0;transition:opacity .3s`
  overlay.innerHTML = `
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:rgba(255,255,255,0.6);letter-spacing:3px;text-transform:uppercase;margin-bottom:16px">Votre prix</div>
    <img src="${prize.img}" style="width:180px;height:160px;object-fit:contain;border-radius:16px;margin-bottom:24px;box-shadow:0 8px 32px rgba(0,0,0,0.4);animation:popIn .5s cubic-bezier(.34,1.56,.64,1)">
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:34px;font-weight:800;color:white;text-align:center;margin-bottom:10px">${prize.name}</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.65);text-align:center;max-width:280px;margin-bottom:32px;line-height:1.6">Présentez cet écran à l'accueil pour récupérer votre cadeau !</div>
    <button onclick="this.closest('[style*=fixed]').remove()" style="padding:14px 36px;background:white;color:#3A1050;border:none;border-radius:12px;font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;cursor:pointer">Continuer</button>
  `
  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.style.opacity = '1')
}

function extractStand(url){
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/')
    const idx = parts.findIndex(p => p === 'scan')
    if(idx >= 0 && parts[idx+1]){
      const slug = decodeURIComponent(parts[idx+1]).toLowerCase()
      return STANDS.find(s => s.slug === slug) || null
    }
  } catch(e) {
    const slug = url.trim().toLowerCase()
    return STANDS.find(s => s.slug === slug) || null
  }
  if(url.includes('test-roulette')){ 
  setTimeout(() => showRoulette(), 100)
  return { name: '__test__', slug: 'test' }
}
  return null
}

function stopScanner(){
  if(html5QrCode){
    html5QrCode.stop().then(() => { html5QrCode.clear(); html5QrCode = null }).catch(() => { html5QrCode = null })
  }
  show('s-progression')
}

document.getElementById('btn-back-scan').addEventListener('click', stopScanner)

// --- Leaderboard ---
function showLeaderboard(){
  show('s-leaderboard')
  document.getElementById('lb-loading').style.display = 'flex'
  document.getElementById('podium').innerHTML = ''
  document.getElementById('lb-list').innerHTML = ''
  if(lbUnsub) lbUnsub()
  lbUnsub = onValue(ref(db,'companies'), snap => {
    document.getElementById('lb-loading').style.display = 'none'
    if(!snap.exists()){ document.getElementById('lb-sub').textContent = '0 participant'; return }
    const all = Object.values(snap.val()).sort((a,b) => {
      if((b.score||0) !== (a.score||0)) return (b.score||0) - (a.score||0)
      return (a.finishTime||Infinity) - (b.finishTime||Infinity)
    })
    document.getElementById('lb-sub').textContent = all.length + ' participant' + (all.length>1?'s':'')
    const medals = ['1er','2e','3e']
    document.getElementById('podium').innerHTML = all.slice(0,3).map((c,i) =>
      `<div class="pod ${i===0?'first':''}">
        <div class="pod-medal">${medals[i]||''}</div>
        <div class="pod-name">${c.name}</div>
        <div class="pod-score">${c.score||0}/${STANDS.length}</div>
        ${c.finishTime ? `<div class="pod-finish">Terminé</div>` : ''}
        <div class="pod-bar"></div>
      </div>`
    ).join('')
    document.getElementById('lb-list').innerHTML = all.slice(3).map((c,i) => {
      const isMe = toKey(c.name) === state.companyKey
      return `<div class="lb-row ${isMe?'me':''}">
        <div class="lb-n">${i+4}</div>
        <div style="flex:1">
          <div class="lb-cn">${c.name}</div>
          ${isMe?'<div class="lb-you">Vous</div>':''}
          ${c.finishTime?'<div style="font-size:10px;color:#9B4DBB;font-weight:700">Terminé</div>':''}
        </div>
        <div style="text-align:right"><div class="lb-sc">${c.score||0}</div><div class="lb-tot">/${STANDS.length}</div></div>
      </div>`
    }).join('')
  })
}

document.getElementById('btn-back-lb').addEventListener('click', () => {
  if(lbUnsub){ lbUnsub(); lbUnsub = null }
  if(state.company) show('s-progression'); else show('s-accueil')
})

// --- Restauration automatique ---
const saved = localStorage.getItem('royelec-company')
if(saved){
  state.company = saved
  state.companyKey = toKey(saved)
  get(ref(db, 'companies/' + state.companyKey)).then(snap => {
    if(snap.exists()){
      const data = snap.val()
      state.visited = data.stands || []
      state.startTime = data.startTime || Date.now()
    }
    startTimer()
    updateProg()
    show('s-progression')
  })
}

// --- Toast ---
function showToast(msg){
  const t = document.getElementById('toast')
  t.textContent = msg
  t.classList.add('show')
  setTimeout(() => t.classList.remove('show'), 2600)
}

// --- Page TV ---
if(window.location.search === '?tv'){
  document.body.innerHTML = `<div id="tv"></div>`
  document.body.style.cssText = 'background:linear-gradient(160deg,#3A1050 0%,#5A1F78 40%,#C490DD 80%,white 100%);min-height:100vh;padding:32px;font-family:Barlow,sans-serif;color:white'
  const tvDiv = document.getElementById('tv')
  onValue(ref(db,'companies'), snap => {
    if(!snap.exists()){ tvDiv.innerHTML = '<p style="text-align:center;opacity:0.5;font-size:20px;margin-top:40px">En attente des participants...</p>'; return }
    const all = Object.values(snap.val()).sort((a,b) => {
      if((b.score||0) !== (a.score||0)) return (b.score||0) - (a.score||0)
      return (a.finishTime||Infinity) - (b.finishTime||Infinity)
    })
    const medals = ['1ER','2E','3E']
    tvDiv.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px">
        <img src="/logo.png" style="height:64px">
        <div style="text-align:right">
          <div style="font-size:13px;opacity:0.5;letter-spacing:3px;text-transform:uppercase;font-family:'Barlow Condensed',sans-serif">Journée Portes Ouvertes · Blois 2026</div>
          <div style="font-size:42px;font-weight:800;font-family:'Barlow Condensed',sans-serif">Classement Live</div>
        </div>
      </div>
      <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);padding:6px 16px;border-radius:20px;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;margin-bottom:32px">
        <div style="width:8px;height:8px;border-radius:50%;background:#7BF;animation:pulse 1.5s infinite"></div>EN DIRECT
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px">
        ${all.slice(0,3).map((c,i)=>`
          <div style="background:rgba(255,255,255,${i===0?'0.18':'0.08'});border:1px solid rgba(255,255,255,${i===0?'0.4':'0.15'});border-radius:20px;padding:24px 16px;text-align:center;${i===0?'transform:scale(1.04)':''}">
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:800;opacity:0.6;letter-spacing:2px;margin-bottom:8px">${medals[i]}</div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:800;margin-bottom:6px">${c.name}</div>
            <div style="font-size:18px;opacity:0.65">${c.score||0} / ${STANDS.length} stands</div>
            ${c.finishTime?'<div style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:4px">Parcours terminé</div>':''}
            <div style="height:4px;background:rgba(255,255,255,0.15);border-radius:2px;margin-top:14px"><div style="height:100%;background:white;border-radius:2px;width:${((c.score||0)/STANDS.length*100)}%"></div></div>
          </div>`).join('')}
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${all.slice(3).map((c,i)=>`
          <div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px 20px;display:flex;align-items:center;gap:16px">
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;opacity:0.4;width:32px;text-align:center">${i+4}</div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:700;flex:1">${c.name}${c.finishTime?' ✓':''}</div>
            <div style="width:180px;height:6px;background:rgba(255,255,255,0.12);border-radius:3px"><div style="height:100%;background:rgba(255,255,255,0.6);border-radius:3px;width:${((c.score||0)/STANDS.length*100)}%"></div></div>
            <div style="text-align:right"><div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800">${c.score||0}</div><div style="font-size:13px;opacity:0.5">/${STANDS.length}</div></div>
          </div>`).join('')}
      </div>
      <div style="margin-top:32px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:600;opacity:0.3;letter-spacing:2px;text-transform:uppercase">${all.length} entreprise${all.length>1?'s':''} en compétition</div>
    `
  })
}
