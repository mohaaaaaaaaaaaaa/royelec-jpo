import './style.css'

const STANDS = [
  { name: 'Airwell',        slug: 'airwell',        logo: 'airwell.png',        url: 'https://www.airwell.com' },
  { name: 'Soler-Palau',    slug: 'soler-palau',    logo: 'soler-palau.svg',    url: 'https://www.solerpalau.com/' },
  { name: 'Came France',    slug: 'came-france',    logo: 'came-france.png',    url: 'https://www.came.com/fr' },
  { name: 'Ledvance',       slug: 'ledvance',       logo: 'ledvance.svg',       url: 'https://www.ledvance.fr' },
  { name: 'Asled',          slug: 'asled',          logo: 'asled.png',          url: 'https://www.asled.fr' },
  { name: 'Intuis',         slug: 'intuis',         logo: 'intuis.png',         url: 'https://www.intuis.fr' },
  { name: 'Europole',       slug: 'europole',       logo: 'europole.png',       url: 'https://www.europole.com' },
  { name: 'Bailey Lights',  slug: 'bailey-lights',  logo: 'bailey-lights.svg',  url: 'https://www.bailey.nl/fr' },
  { name: 'Hager',          slug: 'hager',          logo: 'hager.png',         url: 'https://www.hager.fr' },
  { name: 'Finder France',  slug: 'finder-france',  logo: 'finder-france.png',  url: 'https://www.findernet.com/fr' },
  { name: 'Axelair',        slug: 'axelair',        logo: 'axelair.svg',        url: 'https://www.axelair-ventilation.com/fr/' },
  { name: 'Sermes',         slug: 'sermes',         logo: 'sermes.png',         url: 'https://www.sermes.fr' },
  { name: 'Courant',        slug: 'courant',        logo: 'courant.png',        url: 'https://www.courant.fr' },
  { name: 'Indigo Lighting',slug: 'indigo-lighting',logo: 'indigo-lighting.png',url: 'https://www.indigo-lighting.com' },
  { name: 'Gewiss France',  slug: 'gewiss-france',  logo: 'gewiss-france.jpg',  url: 'https://www.gewiss.com/fr/fr/' },
  { name: 'Feilo Sylvania', slug: 'feilo-sylvania', logo: 'feilo-sylvania.png',url: 'https://www.sylvania-group.com/fr-fr/' },
  { name: 'Engitechs',      slug: 'engitechs',      logo: 'engitechs.svg',      url: 'https://www.engitechs.com' },
  { name: 'Theben',         slug: 'theben',         logo: 'theben.svg',         url: 'https://www.theben.fr' },
  { name: 'Airzone France', slug: 'airzone-france', logo: 'airzone-france.svg', url: 'https://www.airzonecontrol.com/ff/fr/' },
  { name: 'Aiphone',        slug: 'aiphone',        logo: 'aiphone.png',        url: 'https://www.aiphone.fr' },
  { name: 'Somfy-BFT',      slug: 'somfy-bft',      logo: 'somfy-bft.svg',      url: 'https://www.somfy.fr' },
  { name: 'Deltadore',      slug: 'deltadore',      logo: 'deltadore.svg',      url: 'https://www.deltadore.fr' },
  { name: 'Urmet',          slug: 'urmet',          logo: 'urmet.svg',          url: 'https://www.urmet.fr/' },
  { name: 'Teddington',     slug: 'teddington',     logo: 'teddington.png',     url: 'https://www.teddington.com/' },
  { name: 'Thermor',        slug: 'thermor',        logo: 'thermor.svg',        url: 'https://www.thermor.com' },
]

const PRIZES_DEFAULT = [
  { name: 'Casquette Milwaukee', img: '/casquette.png',          stock: 10 },
  { name: 'Mug Feilo Sylvania',  img: '/mug.png',                stock: 10 },
  { name: 'Gourde Hager',        img: '/gourde.png',             stock: 10 },
  { name: 'Casquette Sylvania',  img: '/casquette-sylvania.png', stock: 10 },
]


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

// ===================== PAGE ADMIN =====================
if(window.location.search === '?admin'){
  renderAdmin()
}
// ===================== PAGE TV =====================
else if(window.location.search === '?tv'){
  renderTV()
}
// ===================== SITE PRINCIPAL =====================
else {
  renderApp()
}

// ==========================================
// ADMIN
// ==========================================
function renderAdmin(){
  document.querySelector('#app').innerHTML = `
  <div style="min-height:100vh;background:#0D0015;color:white;font-family:'Barlow',sans-serif">
    <div id="admin-login" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:24px">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:800;margin-bottom:24px">Administration</div>
      <input id="admin-pwd" type="password" placeholder="Mot de passe" style="padding:14px;border-radius:10px;border:1px solid #4A1A6A;background:#1A0028;color:white;font-size:16px;width:100%;max-width:300px;margin-bottom:12px;outline:none">
      <button id="admin-login-btn" style="padding:14px;background:linear-gradient(135deg,#5A1F78,#9B4DBB);color:white;border:none;border-radius:10px;font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;cursor:pointer;width:100%;max-width:300px">Connexion</button>
      <div id="admin-error" style="color:#ff6b6b;margin-top:10px;font-size:14px;display:none">Mot de passe incorrect</div>
    </div>
    <div id="admin-panel" style="display:none;padding:24px;max-width:600px;margin:0 auto">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:800;margin-bottom:24px;text-align:center">Panneau Admin</div>

      <div style="background:#1A0028;border:1px solid #3A1060;border-radius:16px;padding:20px;margin-bottom:16px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:#9B4DBB;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px">Heure de remise des prix</div>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
          <input id="admin-date" type="date" value="2026-06-12" style="padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:15px;flex:1">
          <input id="admin-time" type="time" value="15:30" style="padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:15px;flex:1">
          <button id="admin-save-time" style="padding:10px 20px;background:#5A1F78;color:white;border:none;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;cursor:pointer">Sauvegarder</button>
        </div>
        <div id="admin-time-status" style="font-size:13px;color:#9B4DBB;margin-top:8px"></div>
      </div>

      <div style="background:#1A0028;border:1px solid #3A1060;border-radius:16px;padding:20px;margin-bottom:16px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:#9B4DBB;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px">Stock des prix</div>
        <div id="admin-prizes"></div>
        <button id="admin-save-prizes" style="margin-top:12px;padding:12px 24px;background:#5A1F78;color:white;border:none;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;cursor:pointer;width:100%">Sauvegarder le stock</button>
        <div id="admin-prizes-status" style="font-size:13px;color:#9B4DBB;margin-top:8px"></div>
      </div>

      <div style="background:#1A0028;border:1px solid #3A1060;border-radius:16px;padding:20px;margin-bottom:16px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:#9B4DBB;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px">Bonus podium (chances en %)</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
          <div style="text-align:center">
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:6px">1er</div>
            <input id="bonus-1" type="number" min="0" max="100" value="30" style="width:100%;padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:16px;text-align:center">
          </div>
          <div style="text-align:center">
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:6px">2e</div>
            <input id="bonus-2" type="number" min="0" max="100" value="20" style="width:100%;padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:16px;text-align:center">
          </div>
          <div style="text-align:center">
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:6px">3e</div>
            <input id="bonus-3" type="number" min="0" max="100" value="10" style="width:100%;padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:16px;text-align:center">
          </div>
        </div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-top:8px">% de chances bonus pour le meilleur prix du podium</div>
        <button id="admin-save-bonus" style="margin-top:12px;padding:12px 24px;background:#5A1F78;color:white;border:none;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;cursor:pointer;width:100%">Sauvegarder les bonus</button>
        <div id="admin-bonus-status" style="font-size:13px;color:#9B4DBB;margin-top:8px"></div>
      </div>

      <div style="background:#1A0028;border:1px solid #3A1060;border-radius:16px;padding:20px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:#9B4DBB;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px">Participants</div>
        <div id="admin-participants" style="font-size:14px;color:rgba(255,255,255,0.7)">Chargement...</div>
      </div>
    </div>
  </div>
  `

  document.getElementById('admin-login-btn').addEventListener('click', () => {
    const pwd = document.getElementById('admin-pwd').value
    if(pwd === 'stagiaire'){
      document.getElementById('admin-login').style.display = 'none'
      document.getElementById('admin-panel').style.display = 'block'
      loadAdminData()
    } else {
      document.getElementById('admin-error').style.display = 'block'
    }
  })
  document.getElementById('admin-pwd').addEventListener('keydown', e => {
    if(e.key === 'Enter') document.getElementById('admin-login-btn').click()
  })
}

async function loadAdminData(){
  // Charger config
  const configSnap = await get(ref(db, 'config'))
  const config = configSnap.exists() ? configSnap.val() : {}

  // Heure
  if(config.eventTime){
    const d = new Date(config.eventTime)
    document.getElementById('admin-date').value = d.toISOString().split('T')[0]
    document.getElementById('admin-time').value = d.toTimeString().slice(0,5)
  }

  // Bonus
  if(config.bonus){
    document.getElementById('bonus-1').value = config.bonus[1] || 30
    document.getElementById('bonus-2').value = config.bonus[2] || 20
    document.getElementById('bonus-3').value = config.bonus[3] || 10
  }

  // Prizes
  const prizes = config.prizes || PRIZES_DEFAULT
  document.getElementById('admin-prizes').innerHTML = prizes.map((p,i) => `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;background:#0D0015;border-radius:10px;padding:12px">
      <img src="${p.img}" style="width:50px;height:44px;object-fit:contain">
      <div style="flex:1">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:white">${p.name}</div>
        <div style="font-size:12px;color:#9B4DBB">Stock restant</div>
      </div>
      <input id="stock-${i}" type="number" min="0" value="${p.stock}" style="width:70px;padding:8px;border-radius:8px;border:1px solid #4A1A6A;background:#1A0028;color:white;font-size:18px;font-weight:700;text-align:center">
    </div>
  `).join('')

  // Sauvegarder heure
  document.getElementById('admin-save-time').addEventListener('click', async () => {
    const date = document.getElementById('admin-date').value
    const time = document.getElementById('admin-time').value
    const eventTime = new Date(`${date}T${time}:00`).getTime()
    await update(ref(db,'config'), { eventTime })
    document.getElementById('admin-time-status').textContent = 'Heure sauvegardée !'
    setTimeout(() => document.getElementById('admin-time-status').textContent = '', 2000)
  })

  // Sauvegarder stock
  document.getElementById('admin-save-prizes').addEventListener('click', async () => {
    const updatedPrizes = prizes.map((p,i) => ({
      ...p,
      stock: parseInt(document.getElementById(`stock-${i}`).value) || 0
    }))
    await update(ref(db,'config'), { prizes: updatedPrizes })
    document.getElementById('admin-prizes-status').textContent = 'Stock sauvegardé !'
    setTimeout(() => document.getElementById('admin-prizes-status').textContent = '', 2000)
  })

  // Sauvegarder bonus
  document.getElementById('admin-save-bonus').addEventListener('click', async () => {
    const bonus = {
      1: parseInt(document.getElementById('bonus-1').value) || 0,
      2: parseInt(document.getElementById('bonus-2').value) || 0,
      3: parseInt(document.getElementById('bonus-3').value) || 0,
    }
    await update(ref(db,'config'), { bonus })
    document.getElementById('admin-bonus-status').textContent = 'Bonus sauvegardés !'
    setTimeout(() => document.getElementById('admin-bonus-status').textContent = '', 2000)
  })

  // Participants en temps réel
  onValue(ref(db,'companies'), snap => {
    if(!snap.exists()){ document.getElementById('admin-participants').textContent = 'Aucun participant'; return }
    const all = Object.values(snap.val()).sort((a,b) => (b.score||0)-(a.score||0))
    document.getElementById('admin-participants').innerHTML = `
      <div style="margin-bottom:8px;font-size:13px;color:rgba(255,255,255,0.5)">${all.length} entreprise(s) inscrite(s)</div>
      ${all.map((c,i) => `
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #2A0040">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;color:rgba(255,255,255,0.4);width:24px">${i+1}</div>
          <div style="flex:1;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:white">${c.name}</div>
          <div style="font-size:13px;color:#9B4DBB">${c.score||0}/${STANDS.length}</div>
          ${c.prize ? `<div style="font-size:11px;color:#FFD700;font-weight:700">${c.prize}</div>` : ''}
        </div>
      `).join('')}
    `
  })
}

// ==========================================
// TV
// ==========================================
function renderTV(){
  document.querySelector('#app').innerHTML = `<div id="tv"></div>`
  document.querySelector('#app').style.cssText = 'background:linear-gradient(160deg,#3A1050 0%,#5A1F78 40%,#C490DD 80%,white 100%);min-height:100vh;padding:32px;font-family:Barlow,sans-serif;color:white'

  onValue(ref(db,'companies'), snap => {
    if(!snap.exists()){ document.getElementById('tv').innerHTML = '<p style="text-align:center;opacity:0.5;font-size:20px;margin-top:40px">En attente des participants...</p>'; return }
    const all = Object.values(snap.val()).sort((a,b) => {
      if((b.score||0) !== (a.score||0)) return (b.score||0) - (a.score||0)
      return (a.finishTime||Infinity) - (b.finishTime||Infinity)
    })
    const medals = ['1ER','2E','3E']
    document.getElementById('tv').innerHTML = `
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

// ==========================================
// APP PRINCIPALE
// ==========================================
function renderApp(){
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
    <div id="countdown-bar" style="display:none;margin-top:12px;background:rgba(255,255,255,0.1);border-radius:10px;padding:8px 12px;text-align:center">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:2px;text-transform:uppercase;margin-bottom:2px">Remise des prix dans</div>
      <div id="countdown-val" style="font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:800;color:white">—</div>
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

  let state = { company: '', visited: [], companyKey: '', startTime: null, rank: null }
  let html5QrCode = null
  let lbUnsub = null
  let timerInterval = null
  let countdownInterval = null
  let configCache = {}

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

  function formatCountdown(ms){
    if(ms <= 0) return 'Maintenant !'
    const h = Math.floor(ms/3600000)
    const m = Math.floor((ms%3600000)/60000)
    const s = Math.floor((ms%60000)/1000)
    if(h > 0) return `${h}h ${m.toString().padStart(2,'0')}min`
    return `${m}min ${s.toString().padStart(2,'0')}s`
  }

  function startTimer(){
    if(timerInterval) clearInterval(timerInterval)
    timerInterval = setInterval(() => {
      if(!state.startTime) return
      const el = document.getElementById('s-timer')
      if(el) el.textContent = formatTime(Date.now() - state.startTime)
    }, 1000)
  }

  function startCountdown(){
    if(countdownInterval) clearInterval(countdownInterval)
    const bar = document.getElementById('countdown-bar')
    const val = document.getElementById('countdown-val')
    if(!bar || !val) return
    const update = () => {
      const eventTime = configCache.eventTime
      if(!eventTime){ bar.style.display = 'none'; return }
      const remaining = eventTime - Date.now()
      if(remaining <= 0){
        bar.style.display = 'block'
        val.textContent = 'Rendez-vous à l\'accueil !'
        val.style.fontSize = '16px'
        clearInterval(countdownInterval)
      } else {
        bar.style.display = 'block'
        val.textContent = formatCountdown(remaining)
      }
    }
    update()
    countdownInterval = setInterval(update, 1000)
  }

  // Charger config Firebase
  onValue(ref(db,'config'), snap => {
    configCache = snap.exists() ? snap.val() : {}
    if(state.visited.length < STANDS.length) startCountdown()
  })

  // Probabilités calculées depuis le stock + bonus podium
  async function computeProbabilities(){
    const configSnap = await get(ref(db,'config'))
    const config = configSnap.exists() ? configSnap.val() : {}
    const prizes = config.prizes || PRIZES_DEFAULT
    const bonus = config.bonus || {}

    // Stock total
    const totalStock = prizes.reduce((s,p) => s + (p.stock||0), 0)
    if(totalStock === 0) return []

    // Probabilités de base proportionnelles au stock
    let probs = prizes.map(p => ({ ...p, prob: (p.stock||0) / totalStock }))

    // Appliquer bonus podium si l'utilisateur est dans le top 3
    if(state.rank && state.rank <= 3){
      const bonusPct = (bonus[state.rank] || 0) / 100
      if(bonusPct > 0 && probs.length > 0){
        // Trouver le meilleur prix (premier de la liste)
        const maxStockIdx = probs.reduce((best,p,i) => p.stock > probs[best].stock ? i : best, 0)
        probs = probs.map((p,i) => {
          if(i === maxStockIdx) return { ...p, prob: Math.min(1, p.prob + bonusPct) }
          return p
        })
        // Renormaliser
        const total = probs.reduce((s,p) => s + p.prob, 0)
        probs = probs.map(p => ({ ...p, prob: p.prob / total }))
      }
    }

    return probs.filter(p => p.stock > 0)
  }

  // Sons
  function createAudioContext(){ return new (window.AudioContext || window.webkitAudioContext)() }
  function playTickSound(){
    try {
      const ctx = createAudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.value = 800
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.06)
    } catch(e){}
  }
  function playWinSound(){
    try {
      const ctx = createAudioContext()
      const notes = [523, 659, 784, 1047]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain); gain.connect(ctx.destination)
        osc.frequency.value = freq; osc.type = 'sine'
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12)
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.12 + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3)
        osc.start(ctx.currentTime + i * 0.12); osc.stop(ctx.currentTime + i * 0.12 + 0.3)
      })
    } catch(e){}
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
        startTime: state.startTime, finishTime: null, prize: null
      })
    }
    startTimer()
    updateProg()
    show('s-progression')
    if(state.visited.length < STANDS.length) startCountdown()
  })

  document.getElementById('btn-lb-accueil').addEventListener('click', showLeaderboard)

  // --- Progression ---
  function updateProg(){
    const v = state.visited.length, t = STANDS.length
    const pct = Math.min(100, Math.round(v/t*100))
    document.getElementById('p-avatar').textContent = state.company.charAt(0).toUpperCase()
    document.getElementById('p-name').textContent = state.company
    document.getElementById('p-sub').textContent = v + ' stand' + (v>1?'s':'') + ' visité' + (v>1?'s':'')
    document.getElementById('circ-pct').textContent = pct + '%'
    document.getElementById('s-visited').textContent = v
    document.getElementById('s-remaining').textContent = Math.max(0, t - v)
    document.getElementById('circ').style.strokeDashoffset = 264 - (264 * pct / 100)

    // Masquer le countdown si tout est visité
    const bar = document.getElementById('countdown-bar')
    if(bar) bar.style.display = v >= t ? 'none' : (configCache.eventTime ? 'block' : 'none')

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
      const all = Object.values(snap.val()).sort((a,b) => {
        if((b.score||0) !== (a.score||0)) return (b.score||0) - (a.score||0)
        return (a.finishTime||Infinity) - (b.finishTime||Infinity)
      })
      const idx = all.findIndex(c => toKey(c.name) === state.companyKey)
      state.rank = idx >= 0 ? idx + 1 : null
      document.getElementById('p-rank').textContent = '#' + (state.rank || '—')
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
  document.getElementById('btn-prizes-preview').addEventListener('click', showPrizesPreview)

  async function showPrizesPreview(){
    const prizes = await computeProbabilities()
    const overlay = document.createElement('div')
    overlay.className = 'casino-overlay'
    overlay.style.cssText = `position:fixed;inset:0;background:#0D0015;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity .3s;padding:24px;overflow:auto`
    overlay.innerHTML = `
      <div style="width:100%;max-width:380px">
        <div style="text-align:center;margin-bottom:24px">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#9B4DBB;margin-bottom:6px">Complétez les ${STANDS.length} stands</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:800;color:white">Prix à gagner</div>
          <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,#7B2D9B,transparent);margin:10px auto 0"></div>
        </div>
        ${prizes.length === 0 ? '<div style="text-align:center;color:rgba(255,255,255,0.5);padding:20px">Aucun prix disponible pour le moment</div>' :
          prizes.map(p => `
            <div style="background:linear-gradient(135deg,#1A0028,#2A0040);border:1px solid #4A1A6A;border-radius:16px;padding:20px;margin-bottom:14px;display:flex;align-items:center;gap:16px;position:relative;overflow:hidden">
              <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,rgba(123,45,155,0.15),transparent 70%);pointer-events:none"></div>
              <div style="position:relative;width:90px;height:80px;flex-shrink:0;background:rgba(255,255,255,0.04);border-radius:10px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,0.08)">
                <img src="${p.img}" style="max-width:80px;max-height:72px;object-fit:contain;border-radius:6px">
              </div>
              <div style="flex:1;position:relative">
                <div style="font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:white;margin-bottom:4px">${p.name}</div>
                <div style="display:inline-block;background:rgba(123,45,155,0.3);border:1px solid rgba(123,45,155,0.5);padding:3px 10px;border-radius:20px;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;color:#C490DD;letter-spacing:1px;text-transform:uppercase">Stock : ${p.stock}</div>
              </div>
            </div>
          `).join('')
        }
        <div style="text-align:center;margin:16px 0;font-size:13px;color:rgba(255,255,255,0.4)">Visitez tous les stands pour déclencher la roulette</div>
        <button onclick="document.querySelectorAll('.casino-overlay').forEach(e=>e.remove())" style="width:100%;padding:14px;background:linear-gradient(135deg,#5A1F78,#7B2D9B);color:white;border:none;border-radius:12px;font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;cursor:pointer;letter-spacing:1px">Fermer</button>
      </div>
    `
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
            stroke-dashoffset="${603-(603*prevPct/100)}"
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
        const step = () => { if(current < pct){ current++; pctEl.textContent = current+'%'; setTimeout(step, 1200/Math.max(1,pct-prevPct)) } }
        step()
      }, 100)
      setTimeout(() => {
        overlay.style.opacity = '0'
        setTimeout(() => { overlay.remove(); updateProg(); show('s-progression'); if(isComplete) checkAndShowRoulette() }, 300)
      }, isComplete ? 1500 : 2800)
    })
  }

  // --- Roulette ---
  async function checkAndShowRoulette(){
    document.querySelectorAll('.casino-overlay').forEach(el => el.remove())
    const snap = await get(ref(db, 'companies/' + state.companyKey))
    if(!snap.exists()) return
    const data = snap.val()
    if(data.prize){ showPrizeResult(data.prize); return }
    showRoulette()
  }

  async function showRoulette(){
    document.querySelectorAll('.casino-overlay').forEach(el => el.remove())
    const prizes = await computeProbabilities()
    if(prizes.length === 0){ showToast('Aucun prix disponible'); return }

    const rand = Math.random()
    let cumul = 0, chosenIdx = 0
    for(let i=0; i<prizes.length; i++){
      cumul += prizes[i].prob
      if(rand < cumul){ chosenIdx = i; break }
    }
    const prize = prizes[chosenIdx]

    const TOTAL = 40, WIN_IDX = 32, itemW = 160
    const items = []
    for(let i=0; i<TOTAL; i++){
      if(i === WIN_IDX) items.push({...prize, isWinner: true})
      else items.push({...prizes[i % prizes.length], isWinner: false})
    }

    const visibleW = Math.min(window.innerWidth - 32, 380)
    const startOffset = visibleW/2 - itemW/2
    const finalOffset = startOffset - (WIN_IDX * itemW)

    const overlay = document.createElement('div')
    overlay.className = 'casino-overlay'
    overlay.style.cssText = `position:fixed;inset:0;background:#0D0015;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;padding:20px;opacity:0;transition:opacity .3s`
    overlay.innerHTML = `
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;color:#9B4DBB;letter-spacing:4px;text-transform:uppercase;margin-bottom:6px">Félicitations !</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:800;color:white">Vous avez tout visité !</div>
      </div>
      <div style="width:${visibleW}px;position:relative;margin-bottom:28px">
        <div style="position:absolute;top:-16px;left:50%;transform:translateX(-50%);z-index:5">
          <div style="width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-top:14px solid #FFD700"></div>
        </div>
        <div style="position:absolute;bottom:-16px;left:50%;transform:translateX(-50%);z-index:5">
          <div style="width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:14px solid #FFD700"></div>
        </div>
        <div style="position:absolute;top:0;bottom:0;left:calc(50% - ${itemW/2}px);width:${itemW}px;border:2px solid #FFD700;border-radius:4px;z-index:4;pointer-events:none;box-shadow:0 0 20px rgba(255,215,0,0.3)"></div>
        <div style="overflow:hidden;border-radius:12px;border:1px solid #3A1060">
          <div id="roulette-strip" style="display:flex;transform:translateX(${startOffset}px);will-change:transform;transition:none">
            ${items.map((p,i) => `
              <div style="min-width:${itemW}px;height:${itemW}px;display:flex;align-items:center;justify-content:center;background:${i%2===0?'#150020':'#1A0028'};border-right:1px solid #2A0040;flex-shrink:0">
                <img src="${p.img}" style="max-width:${itemW-20}px;max-height:${itemW-20}px;object-fit:contain;border-radius:6px">
              </div>
            `).join('')}
          </div>
        </div>
        <div style="position:absolute;top:0;left:0;width:80px;height:100%;background:linear-gradient(to right,#0D0015,transparent);pointer-events:none;z-index:3"></div>
        <div style="position:absolute;top:0;right:0;width:80px;height:100%;background:linear-gradient(to left,#0D0015,transparent);pointer-events:none;z-index:3"></div>
      </div>
      <button id="btn-spin" style="padding:16px 52px;background:linear-gradient(135deg,#5A1F78,#9B4DBB);color:white;border:none;border-radius:12px;font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;cursor:pointer;letter-spacing:1px;box-shadow:0 4px 24px rgba(123,45,155,0.5)">Lancer !</button>
    `
    document.body.appendChild(overlay)
    requestAnimationFrame(() => overlay.style.opacity = '1')

    overlay.querySelector('#btn-spin').addEventListener('click', () => {
      const btn = overlay.querySelector('#btn-spin')
      btn.disabled = true; btn.style.opacity = '0.5'
      const strip = overlay.querySelector('#roulette-strip')
      let tickInterval = 60, tickTimer = null
      const startTicks = () => { playTickSound(); tickTimer = setTimeout(startTicks, tickInterval) }
      startTicks()
      strip.style.transition = 'transform 0.3s cubic-bezier(.4,0,1,1)'
      strip.style.transform = `translateX(${startOffset - itemW * 5}px)`
      setTimeout(() => { strip.style.transition = 'transform 2.2s linear'; strip.style.transform = `translateX(${startOffset - itemW * (WIN_IDX - 8)}px)`; tickInterval = 80 }, 300)
      setTimeout(() => { strip.style.transition = 'transform 2.5s cubic-bezier(0,.95,.1,1)'; strip.style.transform = `translateX(${finalOffset}px)`; tickInterval = 200 }, 2500)
      setTimeout(() => {
        clearTimeout(tickTimer)
        if(navigator.vibrate) navigator.vibrate([100,50,100,50,300])
        playWinSound()
        const winnerEl = strip.children[WIN_IDX]
        if(winnerEl){ winnerEl.style.background = 'linear-gradient(135deg,#2A1A00,#3A2800)'; winnerEl.style.boxShadow = '0 0 30px rgba(255,215,0,0.4)'; winnerEl.style.transition = 'all .3s' }
        setTimeout(() => {
          overlay.style.opacity = '0'
          setTimeout(() => {
            overlay.remove()
            // Décrémenter le stock
            get(ref(db,'config')).then(snap => {
              const config = snap.exists() ? snap.val() : {}
              const prizes = config.prizes || PRIZES_DEFAULT
              const idx = prizes.findIndex(p => p.name === prize.name)
              if(idx >= 0 && prizes[idx].stock > 0){
                prizes[idx].stock--
                update(ref(db,'config'), { prizes })
              }
            })
            update(ref(db, 'companies/' + state.companyKey), { prize: prize.name })
            showPrizeResult(prize.name)
          }, 400)
        }, 1500)
      }, 5200)
    })
  }

  function showPrizeResult(prizeName){
    const configPrizes = configCache.prizes || PRIZES_DEFAULT
    const prize = configPrizes.find(p => p.name === prizeName) || { name: prizeName, img: '' }
    const overlay = document.createElement('div')
    overlay.className = 'casino-overlay'
    overlay.style.cssText = `position:fixed;inset:0;background:#0D0015;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;padding:24px;opacity:0;transition:opacity .3s`
    overlay.innerHTML = `
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;color:#9B4DBB;letter-spacing:4px;text-transform:uppercase;margin-bottom:16px">Votre prix</div>
      <div style="position:relative;margin-bottom:24px">
        <div style="position:absolute;inset:-20px;background:radial-gradient(ellipse,rgba(255,215,0,0.15),transparent 70%);pointer-events:none"></div>
        <div style="width:200px;height:180px;background:linear-gradient(135deg,#1A0028,#2A0040);border:2px solid #FFD700;border-radius:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 40px rgba(255,215,0,0.3)">
          <img src="${prize.img}" style="max-width:170px;max-height:155px;object-fit:contain;border-radius:10px">
        </div>
      </div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:800;color:white;text-align:center;margin-bottom:8px">${prize.name}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.5);text-align:center;max-width:260px;margin-bottom:32px;line-height:1.6">Présentez cet écran à l'accueil pour récupérer votre cadeau !</div>
      <button onclick="document.querySelectorAll('.casino-overlay').forEach(e=>e.remove())" style="padding:14px 40px;background:linear-gradient(135deg,#5A1F78,#9B4DBB);color:white;border:none;border-radius:12px;font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;cursor:pointer;letter-spacing:1px">Continuer</button>
    `
    document.body.appendChild(overlay)
    requestAnimationFrame(() => overlay.style.opacity = '1')
  }

  function extractStand(url){
    if(url.includes('test-roulette')){ setTimeout(() => showRoulette(), 100); return { name: '__test__', slug: 'test' } }
   if(url.includes('test-all-stands')){ 
     state.visited = STANDS.map(s => s.name)
      update(ref(db, 'companies/' + state.companyKey), { stands: state.visited, score: STANDS.length, name: state.company })
     stopScanner()
     updateProg()
     show('s-progression')
      setTimeout(() => checkAndShowRoulette(), 500)
     return { name: '__test__', slug: 'test' }
    } 
    try {
      const u = new URL(url)
      const parts = u.pathname.split('/')
      const idx = parts.findIndex(p => p === 'scan')
      if(idx >= 0 && parts[idx+1]){
        const slug = decodeURIComponent(parts[idx+1]).toLowerCase()
        return STANDS.find(s => s.slug === slug) || null
      }
    } catch(e) {
      return STANDS.find(s => s.slug === url.trim().toLowerCase()) || null
    }
    return null
  }

  function stopScanner(){
    if(html5QrCode){ html5QrCode.stop().then(() => { html5QrCode.clear(); html5QrCode = null }).catch(() => { html5QrCode = null }) }
    show('s-progression')
  }

  document.getElementById('btn-back-scan').addEventListener('click', stopScanner)

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
          ${c.finishTime?'<div class="pod-finish">Terminé</div>':''}
          <div class="pod-bar"></div>
        </div>`
      ).join('')
      document.getElementById('lb-list').innerHTML = all.slice(3).map((c,i) => {
        const isMe = toKey(c.name) === state.companyKey
        return `<div class="lb-row ${isMe?'me':''}">
          <div class="lb-n">${i+4}</div>
          <div style="flex:1"><div class="lb-cn">${c.name}</div>${isMe?'<div class="lb-you">Vous</div>':''}${c.finishTime?'<div style="font-size:10px;color:#9B4DBB;font-weight:700">Terminé</div>':''}</div>
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
      if(snap.exists()){ const data = snap.val(); state.visited = data.stands || []; state.startTime = data.startTime || Date.now() }
      startTimer()
      updateProg()
      show('s-progression')
      if(state.visited.length < STANDS.length) startCountdown()
    })
  }

  function showToast(msg){
    const t = document.getElementById('toast')
    t.textContent = msg; t.classList.add('show')
    setTimeout(() => t.classList.remove('show'), 2600)
  }
}
