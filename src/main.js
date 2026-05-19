import './style.css'

const STANDS = [
  'Airwell','Roger Pradier','Soler-Palau','Came France','Ledvance',
  'Asled','Intuis','Europole','Bailey Lights','Hager',
  'Finder France','Axelair','Sermes','Courant','Indigo Lighting',
  'Gewiss France','Feilo Sylvania','Engitechs','Theben','Airzone France',
  'Aiphone','Somfy-BFT','Deltadore','Urmet','Teddington'
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
      </div>
    </div>
  </div>
  <div class="body">
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

// --- State ---
let state = { company: '', visited: [], companyKey: '' }
let html5QrCode = null
let lbUnsub = null

function toKey(name){ return name.toLowerCase().replace(/[^a-z0-9]/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'') }

// --- Navigation ---
function show(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  document.getElementById(id).classList.add('active')
  window.scrollTo(0,0)
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
    state.visited = snap.val().stands || []
  } else {
    state.visited = []
    await set(ref(db, 'companies/' + state.companyKey), { name: val, stands: [], score: 0 })
  }
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
  document.getElementById('stands-grid').innerHTML = STANDS.map(s =>
    `<div class="chip ${state.visited.includes(s)?'done':'un'}">${s}</div>`
  ).join('')
  get(ref(db,'companies')).then(snap => {
    if(!snap.exists()) return
    const all = Object.values(snap.val()).sort((a,b)=>(b.score||0)-(a.score||0))
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
  const brand = extractBrand(text)
  if(!brand){ showToast('QR code non reconnu'); return }
  if(state.visited.includes(brand)){ showToast(brand + ' déjà visité'); return }
  state.visited.push(brand)
  update(ref(db, 'companies/' + state.companyKey), { stands: state.visited, score: state.visited.length, name: state.company })
  document.getElementById('scan-brand').textContent = brand
  document.getElementById('scan-status').style.display = 'none'
  document.getElementById('scan-ok').style.display = 'block'
  setTimeout(() => { stopScanner(); updateProg(); show('s-progression') }, 1800)
}

function extractBrand(url){
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/')
    const idx = parts.findIndex(p => p === 'scan')
    if(idx >= 0 && parts[idx+1]){
      const slug = decodeURIComponent(parts[idx+1]).toLowerCase()
      return STANDS.find(s => s.toLowerCase() === slug || s.toLowerCase().replace(/\s+/g,'-') === slug) || null
    }
  } catch(e) {
    return STANDS.find(s => s.toLowerCase() === url.trim().toLowerCase()) || null
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
    const all = Object.values(snap.val()).sort((a,b) => (b.score||0) - (a.score||0))
    document.getElementById('lb-sub').textContent = all.length + ' participant' + (all.length>1?'s':'')
    const medals = ['1er','2e','3e']
    document.getElementById('podium').innerHTML = all.slice(0,3).map((c,i) =>
      `<div class="pod ${i===0?'first':''}">
        <div class="pod-medal">${medals[i]||''}</div>
        <div class="pod-name">${c.name}</div>
        <div class="pod-score">${c.score||0}/${STANDS.length}</div>
        <div class="pod-bar"></div>
      </div>`
    ).join('')
    document.getElementById('lb-list').innerHTML = all.slice(3).map((c,i) => {
      const isMe = toKey(c.name) === state.companyKey
      return `<div class="lb-row ${isMe?'me':''}">
        <div class="lb-n">${i+4}</div>
        <div style="flex:1"><div class="lb-cn">${c.name}</div>${isMe?'<div class="lb-you">Vous</div>':''}</div>
        <div style="text-align:right"><div class="lb-sc">${c.score||0}</div><div class="lb-tot">/${STANDS.length}</div></div>
      </div>`
    }).join('')
  })
}

document.getElementById('btn-back-lb').addEventListener('click', () => {
  if(lbUnsub){ lbUnsub(); lbUnsub = null }
  if(state.company) show('s-progression'); else show('s-accueil')
})
// Restauration automatique au chargement

const saved = localStorage.getItem('royelec-company')
if(saved){
  state.company = saved
  state.companyKey = toKey(saved)
  get(ref(db, 'companies/' + state.companyKey)).then(snap => {
    if(snap.exists()) state.visited = snap.val().stands || []
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