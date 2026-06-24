import './style.css'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js'
import { getDatabase, ref, set, get, onValue, update } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js'


const STANDS = [
  { name: 'Aiphone',        slug: 'aiphone',        logo: 'aiphone.png',        url: 'https://www.aiphone.fr' },
  { name: 'Airwell',        slug: 'airwell',        logo: 'airwell.png',        url: 'https://www.airwell.com' },
  { name: 'Airzone France', slug: 'airzone-france', logo: 'airzone-france.svg', url: 'https://www.airzonecontrol.com/ff/fr/' },
  { name: 'Asled',          slug: 'asled',          logo: 'asled.png',          url: 'https://www.asled.fr' },
  { name: 'Bailey Lights',  slug: 'bailey-lights',  logo: 'bailey-lights.svg',  url: 'https://www.bailey.nl/fr' },
  { name: 'Came France',    slug: 'came-france',    logo: 'came-france.png',    url: 'https://www.came.com/fr' },
  { name: 'Courant',        slug: 'courant',        logo: 'courant.png',        url: 'https://www.courant.fr' },
  { name: 'Deltadore',      slug: 'deltadore',      logo: 'deltadore.svg',      url: 'https://www.deltadore.fr' },
  { name: "EUR'OHM",        slug: 'eurohm',         logo: 'EurOhm.png',         url: 'https://eur-ohm.com/' },
  { name: 'Europole',       slug: 'europole',       logo: 'europole.png',       url: 'https://www.europole.com' },
  { name: 'Feilo Sylvania', slug: 'feilo-sylvania', logo: 'Sylvania.png',       url: 'https://www.sylvania-group.com/fr-fr/' },
  { name: 'Finder France',  slug: 'finder-france',  logo: 'finder-france.png',  url: 'https://www.findernet.com/fr' },
  { name: 'Gewiss France',  slug: 'gewiss-france',  logo: 'gewiss-france.jpg',  url: 'https://www.gewiss.com/fr/fr/' },
  { name: 'Hager',          slug: 'hager',          logo: 'hager.png',          url: 'https://www.hager.fr' },
  { name: 'Indigo Lighting',slug: 'indigo-lighting',logo: 'indigo-lighting.png',url: 'https://www.indigo-lighting.com' },
  { name: 'Intuis',         slug: 'intuis',         logo: 'intuis.png',         url: 'https://www.intuis.fr' },
  { name: 'Ledvance',       slug: 'ledvance',       logo: 'ledvance.svg',       url: 'https://www.ledvance.fr' },
  { name: 'Sermes',         slug: 'sermes',         logo: 'sermes.png',         url: 'https://www.sermes.fr' },
  { name: 'Soler-Palau',    slug: 'soler-palau',    logo: 'soler-palau.svg',    url: 'https://www.solerpalau.com/' },
  { name: 'Somfy-BFT',      slug: 'somfy-bft',      logo: 'somfy.png',          url: 'https://www.somfy.fr' },
  { name: 'Teddington',     slug: 'teddington',     logo: 'teddington.png',     url: 'https://www.teddington.com/' },
  { name: 'Theben',         slug: 'theben',         logo: 'theben.svg',         url: 'https://www.theben.fr' },
  { name: 'Thermor',        slug: 'thermor',        logo: 'thermor.svg',        url: 'https://www.thermor.com' },
  { name: 'Legrand',           slug: 'legrand',           logo: 'legrand.png',   url: 'https://www.legrand.fr/' },
  { name: 'Schneider Electric',slug: 'schneider-electric', logo: 'schneider.png', url: 'https://www.se.com/fr/fr/' },
  { name: 'Urmet',             slug: 'urmet',             logo: 'urmet.svg',     url: 'https://www.urmet.fr/' },
]

// Tiers : tier:'common'=bleu (80% total), tier:'rare'=rose (16%), tier:'legendary'=or (4%)
const PRIZES_DEFAULT = [
  { name: 'Casquette Milwaukee', img: '/casquette.png',          stock: 10, prob: 20, tier: 'common' },
  { name: 'Mug Feilo Sylvania',  img: '/mug.png',                stock: 10, prob: 20, tier: 'common' },
  { name: 'Gourde Hager',        img: '/gourde.png',             stock: 10, prob: 20, tier: 'common' },
  { name: 'Casquette Sylvania',  img: '/casquette-sylvania.png', stock: 10, prob: 20, tier: 'common' },
  { name: 'T-shirt ROYELEC',     img: '/tshirt.png',             stock: 10, prob: 20, tier: 'common' },
  { name: 'Camera Xiaomi C200',  img: '/xiaomic200.png',         stock: 3,  prob: 16, tier: 'rare' },
  { name: 'Diffuseur Thermor',   img: '/diffuseurthermor.png',   stock: 2,  prob: 4,  tier: 'legendary' },
    { name: 'Magnum de rosé Château St Roseline',   img: '/magnum-lampe-de-meduse.png',   stock: 1,  prob: 4,  tier: 'legendary' },
]

const TIER_COLORS = {
  common:    { bg: '#0A1A3A', border: '#1A4080', glow: 'rgba(50,100,255,0.3)',  label: '#4A90FF', name: 'Standard'    },
  rare:      { bg: '#2A0A2A', border: '#8A1A8A', glow: 'rgba(200,50,200,0.3)', label: '#FF69B4', name: 'Sélection'      },
  legendary: { bg: '#2A1A00', border: '#8A6000', glow: 'rgba(255,200,0,0.3)',  label: '#FFD700', name: 'Prestige'},
}

function computeProbsSync(allPrizes, bonus, rank, tierPcts){
    const available = allPrizes.filter(p => (p.stock||0) > 0)
    if(available.length === 0) return []

    const commons     = available.filter(p => (p.tier||'common') === 'common')
    const rares       = available.filter(p => p.tier === 'rare')
    const legendaries = available.filter(p => p.tier === 'legendary')

    // % globaux par tier depuis la config ou valeurs par défaut
    let pCommon    = (tierPcts?.common    ?? 80) / 100
    let pRare      = (tierPcts?.rare      ?? 16) / 100
    let pLegendary = (tierPcts?.legendary ?? 4)  / 100
    // Normaliser au cas où la somme != 1
    const total = pCommon + pRare + pLegendary
    if(total > 0){ pCommon /= total; pRare /= total; pLegendary /= total }
    // Redistribuer si tier épuisé
    if(rares.length === 0)      { pCommon += pRare; pRare = 0 }
    if(legendaries.length === 0){ pCommon += pLegendary; pLegendary = 0 }
    if(commons.length === 0)    { pRare += pCommon; pCommon = 0 }

    // Au sein de chaque tier : proportionnel au stock
    const result = []
    const addTier = (tierPrizes, tierProb) => {
      const totalStock = tierPrizes.reduce((s,p) => s + (p.stock||0), 0)
      tierPrizes.forEach(p => {
        const probInTier = totalStock > 0 ? (p.stock||0) / totalStock : 1/tierPrizes.length
        const probGlobal = probInTier * tierProb
        result.push({...p, prob: probGlobal, probInTier, probGlobal})
      })
    }
    if(commons.length > 0)     addTier(commons, pCommon)
    if(rares.length > 0)       addTier(rares, pRare)
    if(legendaries.length > 0) addTier(legendaries, pLegendary)

    // Bonus podium — augmente les légendaires en priorité, puis les rares
    if(rank && rank <= 3 && bonus){
      const bonusPct = (bonus[rank] || 0) / 100
      if(bonusPct > 0 && result.length > 0){
        const legendaryTargets = result.filter(p => p.tier === 'legendary')
        const rareTargets = result.filter(p => p.tier === 'rare')
        const targets = legendaryTargets.length > 0 ? legendaryTargets : rareTargets.length > 0 ? rareTargets : result
        const share = bonusPct / targets.length
        targets.forEach(p => p.prob = Math.min(1, p.prob + share))
        const totalProb = result.reduce((s,p) => s + p.prob, 0)
        result.forEach(p => p.prob = p.prob / totalProb)
      }
    }
    return result
  }

// Calcule les % de tiers ajustés selon le nombre de stands visités
function applyProgBonus(tierPcts, standsVisited, bonusRarePerStand, bonusLegPerStand){
  const addRare = standsVisited * (bonusRarePerStand || 0)
  const addLeg  = standsVisited * (bonusLegPerStand  || 0)
  let c = (tierPcts.common    ?? 80)
  let r = (tierPcts.rare      ?? 16) + addRare
  let l = (tierPcts.legendary ?? 4)  + addLeg
  // Prendre sur les common
  const taken = addRare + addLeg
  c = Math.max(0, c - taken)
  // Normaliser
  const total = c + r + l
  return { common: c/total*100, rare: r/total*100, legendary: l/total*100 }
}

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
    <div id="admin-panel" style="display:none;padding:24px;max-width:640px;margin:0 auto;padding-bottom:60px">
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:800;margin-bottom:24px;text-align:center">Panneau Admin</div>

      <!-- STATISTIQUES -->
      <div style="background:#1A0028;border:1px solid #3A1060;border-radius:16px;padding:20px;margin-bottom:16px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:#9B4DBB;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px">Bilan de la journée</div>
        <div id="admin-stats" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
          <div style="background:#0D0015;border-radius:10px;padding:14px;text-align:center">
            <div id="stat-total" style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:800;color:white">—</div>
            <div style="font-size:12px;color:#9B4DBB;margin-top:2px">Participants</div>
          </div>
          <div style="background:#0D0015;border-radius:10px;padding:14px;text-align:center">
            <div id="stat-finished" style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:800;color:#FFD700">—</div>
            <div style="font-size:12px;color:#9B4DBB;margin-top:2px">Parcours terminés</div>
          </div>
          <div style="background:#0D0015;border-radius:10px;padding:14px;text-align:center">
            <div id="stat-avgtime" style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:800;color:white">—</div>
            <div style="font-size:12px;color:#9B4DBB;margin-top:2px">Temps moyen</div>
          </div>
          <div style="background:#0D0015;border-radius:10px;padding:14px;text-align:center">
            <div id="stat-prizes" style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:800;color:#C490DD">—</div>
            <div style="font-size:12px;color:#9B4DBB;margin-top:2px">Prix distribués</div>
          </div>
        </div>
        <div id="admin-participants" style="font-size:14px;color:rgba(255,255,255,0.7)">Chargement...</div>
        <div id="admin-give-prize-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;align-items:center;justify-content:center;padding:24px">
          <div style="background:#1A0028;border:1px solid #3A1060;border-radius:16px;padding:24px;max-width:380px;width:100%">
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:white;margin-bottom:4px">Attribuer un prix</div>
            <div id="modal-company-name" style="font-size:13px;color:#9B4DBB;margin-bottom:16px"></div>
            <div id="modal-prizes-list"></div>
            <button onclick="document.getElementById('admin-give-prize-modal').style.display='none'" style="margin-top:12px;width:100%;padding:10px;background:rgba(255,255,255,0.1);color:white;border:none;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;cursor:pointer">Annuler</button>
          </div>
        </div>
      </div>

      <!-- HEURE -->
      <div style="background:#1A0028;border:1px solid #3A1060;border-radius:16px;padding:20px;margin-bottom:16px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:#9B4DBB;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px">Heure de remise des prix</div>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
          <input id="admin-date" type="date" value="2026-06-12" style="padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:15px;flex:1">
          <input id="admin-time" type="time" value="15:30" style="padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:15px;flex:1">
          <button id="admin-save-time" style="padding:10px 20px;background:#5A1F78;color:white;border:none;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;cursor:pointer">Sauvegarder</button>
        </div>
        <div id="admin-time-status" style="font-size:13px;color:#9B4DBB;margin-top:8px"></div>
      </div>

      <!-- PRIX -->
      <div style="background:#1A0028;border:1px solid #3A1060;border-radius:16px;padding:20px;margin-bottom:16px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:#9B4DBB;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">Gestion des prix</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:16px">Les chances sont calculées automatiquement selon le stock de chaque tier. Modifiez le stock pour ajuster les probabilités.</div>
        <div id="admin-prizes"></div>
        <button id="admin-save-prizes" style="margin-top:12px;padding:12px 24px;background:#5A1F78;color:white;border:none;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;cursor:pointer;width:100%">Sauvegarder les prix</button>
        <div id="admin-prizes-status" style="font-size:13px;color:#9B4DBB;margin-top:8px;text-align:center"></div>

        <!-- Ajouter un prix -->
        <div style="margin-top:20px;padding-top:16px;border-top:1px solid #2A0040">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;color:rgba(255,255,255,0.6);letter-spacing:1px;text-transform:uppercase;margin-bottom:12px">Ajouter un prix</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <input id="new-prize-name" placeholder="Nom du prix" style="padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:14px;outline:none">
            <input id="new-prize-img" placeholder="Nom du fichier image (ex: gourde.png)" style="padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:14px;outline:none">
            <div>
              <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px">Stock initial</div>
              <input id="new-prize-stock" type="number" min="0" value="10" style="width:100%;padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:14px;text-align:center;outline:none">
            </div>
            <div>
              <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px">Tier de rareté</div>
              <select id="new-prize-tier" style="width:100%;padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:14px;outline:none">
                <option value="common">Standard (bleu)</option>
                <option value="rare">Séléction (rose)</option>
                <option value="legendary">Prestige (or)</option>
              </select>
            </div>
            <button id="admin-add-prize" style="padding:12px;background:linear-gradient(135deg,#3A1050,#5A1F78);color:white;border:1px solid #7B2D9B;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;cursor:pointer">Ajouter ce prix</button>
          </div>
          <div id="admin-add-status" style="font-size:13px;color:#9B4DBB;margin-top:8px;text-align:center"></div>
        </div>
      </div>

      <!-- TIERS -->
      <div style="background:#1A0028;border:1px solid #3A1060;border-radius:16px;padding:20px;margin-bottom:16px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:#9B4DBB;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">Répartition des tiers</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:16px">La somme doit faire 100%. Se met à jour automatiquement.</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px">
          <div style="text-align:center">
            <div style="font-size:11px;color:#4A90FF;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Commun</div>
            <input id="tier-pct-common" type="number" min="0" max="100" value="80" style="width:100%;padding:10px;border-radius:8px;border:1px solid #1A4080;background:#0A1A3A;color:#4A90FF;font-size:20px;font-weight:800;text-align:center;outline:none">
            <div style="font-size:10px;color:rgba(255,255,255,0.3);margin-top:4px">%</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:11px;color:#FF69B4;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Rare</div>
            <input id="tier-pct-rare" type="number" min="0" max="100" value="16" style="width:100%;padding:10px;border-radius:8px;border:1px solid #8A1A8A;background:#2A0A2A;color:#FF69B4;font-size:20px;font-weight:800;text-align:center;outline:none">
            <div style="font-size:10px;color:rgba(255,255,255,0.3);margin-top:4px">%</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:11px;color:#FFD700;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Légendaire</div>
            <input id="tier-pct-legendary" type="number" min="0" max="100" value="4" style="width:100%;padding:10px;border-radius:8px;border:1px solid #8A6000;background:#2A1A00;color:#FFD700;font-size:20px;font-weight:800;text-align:center;outline:none">
            <div style="font-size:10px;color:rgba(255,255,255,0.3);margin-top:4px">%</div>
          </div>
        </div>
        <div id="tier-total-indicator" style="text-align:center;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;color:#9B4DBB;margin-bottom:10px">Total : 100%</div>
        <button id="admin-save-tiers" style="padding:12px 24px;background:#5A1F78;color:white;border:none;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;cursor:pointer;width:100%">Sauvegarder les tiers</button>
        <div id="admin-tiers-status" style="font-size:13px;color:#9B4DBB;margin-top:8px;text-align:center"></div>
      </div>

      <!-- PROGRESSION DES CHANCES -->
      <div style="background:#1A0028;border:1px solid #3A1060;border-radius:16px;padding:20px;margin-bottom:16px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:#9B4DBB;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">Progression des chances</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:16px">Plus un visiteur scanne de stands, plus ses chances d'avoir un Sélection ou Prestige augmentent. Définissez le bonus par stand scanné.</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
          <div style="text-align:center">
            <div style="font-size:11px;color:#FF69B4;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Bonus Sélection</div>
            <div style="display:flex;align-items:center;gap:6px">
              <input id="prog-bonus-rare" type="number" min="0" max="5" step="0.1" value="0.5" style="width:100%;padding:10px;border-radius:8px;border:1px solid #8A1A8A;background:#2A0A2A;color:#FF69B4;font-size:18px;font-weight:800;text-align:center;outline:none">
              <span style="color:rgba(255,255,255,0.4);font-size:13px">%/stand</span>
            </div>
          </div>
          <div style="text-align:center">
            <div style="font-size:11px;color:#FFD700;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Bonus Prestige</div>
            <div style="display:flex;align-items:center;gap:6px">
              <input id="prog-bonus-legendary" type="number" min="0" max="5" step="0.1" value="0.2" style="width:100%;padding:10px;border-radius:8px;border:1px solid #8A6000;background:#2A1A00;color:#FFD700;font-size:18px;font-weight:800;text-align:center;outline:none">
              <span style="color:rgba(255,255,255,0.4);font-size:13px">%/stand</span>
            </div>
          </div>
        </div>
        <div style="background:#0D0015;border-radius:10px;padding:12px;margin-bottom:12px">
          <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:8px">Simulation pour X stands visités :</div>
          <input id="prog-sim-stands" type="range" min="0" max="27" value="10" style="width:100%;margin-bottom:6px">
          <div id="prog-sim-result" style="font-family:'Barlow Condensed',sans-serif;font-size:13px;color:white;text-align:center"></div>
        </div>
        <button id="admin-save-prog" style="padding:12px 24px;background:#5A1F78;color:white;border:none;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;cursor:pointer;width:100%">Sauvegarder</button>
        <div id="admin-prog-status" style="font-size:13px;color:#9B4DBB;margin-top:8px;text-align:center"></div>
      </div>

      <!-- FOURNISSEURS -->
      <div style="background:#1A0028;border:1px solid #3A1060;border-radius:16px;padding:20px;margin-bottom:16px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:#9B4DBB;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">Gestion des fournisseurs</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:16px">Ajouter ou supprimer des fournisseurs affichés dans l'app</div>
        <div id="admin-fournisseurs"></div>
        <button id="admin-save-fourn" style="margin-top:12px;padding:12px 24px;background:#5A1F78;color:white;border:none;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;cursor:pointer;width:100%">Sauvegarder les fournisseurs</button>
        <div id="admin-fourn-status" style="font-size:13px;color:#9B4DBB;margin-top:8px;text-align:center"></div>
        <div style="margin-top:16px;padding-top:14px;border-top:1px solid #2A0040">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:1px;text-transform:uppercase;margin-bottom:10px">Ajouter un fournisseur</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <input id="new-fourn-name" placeholder="Nom du fournisseur" style="padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:14px;outline:none">
            <input id="new-fourn-url" placeholder="URL (ex: https://www.hager.fr)" style="padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:14px;outline:none">
            <input id="new-fourn-logo" placeholder="Chemin logo (ex: /logos/hager.png)" style="padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:14px;outline:none">
            <button id="admin-add-fourn" style="padding:12px;background:linear-gradient(135deg,#3A1050,#5A1F78);color:white;border:1px solid #7B2D9B;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;cursor:pointer">Ajouter</button>
          </div>
          <div id="admin-add-fourn-status" style="font-size:13px;color:#9B4DBB;margin-top:8px;text-align:center"></div>
        </div>
      </div>

      <!-- RESET -->
      <div style="background:#1A0028;border:1px solid #3A1060;border-radius:16px;padding:20px;margin-bottom:16px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:#9B4DBB;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Outils de test</div>
        <button id="admin-test-roulette" style="padding:12px 24px;background:linear-gradient(135deg,#3A1050,#5A1F78);color:white;border:1px solid #7B2D9B;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;cursor:pointer;width:100%;margin-bottom:10px">Simuler un tirage</button>
        <div id="admin-test-result" style="background:#0D0015;border-radius:10px;padding:14px;margin-bottom:12px;display:none;text-align:center">
          <div id="admin-test-img" style="margin-bottom:8px"></div>
          <div id="admin-test-name" style="font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:white;margin-bottom:4px"></div>
          <div id="admin-test-tier" style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px"></div>
          <div id="admin-test-pct" style="font-size:13px;color:rgba(255,255,255,0.5)"></div>
        </div>
        <button id="admin-reset-all" style="padding:12px 24px;background:rgba(255,50,50,0.1);color:#ff6b6b;border:1px solid rgba(255,50,50,0.3);border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;cursor:pointer;width:100%">Réinitialiser toutes les données participants</button>
        <div id="admin-reset-status" style="font-size:13px;color:#ff6b6b;margin-top:8px;text-align:center"></div>
      </div>

      <!-- BONUS PODIUM -->
      <div style="background:#1A0028;border:1px solid #3A1060;border-radius:16px;padding:20px;margin-bottom:16px">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;color:#9B4DBB;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">Bonus podium</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.4);margin-bottom:16px">% de chances supplémentaires sur le meilleur prix disponible</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
          <div style="text-align:center">
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:6px">1er</div>
            <input id="bonus-1" type="number" min="0" max="100" value="30" style="width:100%;padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:16px;text-align:center;outline:none">
          </div>
          <div style="text-align:center">
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:6px">2e</div>
            <input id="bonus-2" type="number" min="0" max="100" value="20" style="width:100%;padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:16px;text-align:center;outline:none">
          </div>
          <div style="text-align:center">
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:13px;color:rgba(255,255,255,0.6);margin-bottom:6px">3e</div>
            <input id="bonus-3" type="number" min="0" max="100" value="10" style="width:100%;padding:10px;border-radius:8px;border:1px solid #4A1A6A;background:#0D0015;color:white;font-size:16px;text-align:center;outline:none">
          </div>
        </div>
        <button id="admin-save-bonus" style="margin-top:12px;padding:12px 24px;background:#5A1F78;color:white;border:none;border-radius:8px;font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;cursor:pointer;width:100%">Sauvegarder les bonus</button>
        <div id="admin-bonus-status" style="font-size:13px;color:#9B4DBB;margin-top:8px;text-align:center"></div>
      </div>
    </div>
  </div>
  `

  function showToast(msg){
    let t = document.getElementById('admin-toast')
    if(!t){ t = document.createElement('div'); t.id='admin-toast'; t.style.cssText='position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:#3A1050;color:white;padding:11px 22px;border-radius:30px;font-family:Barlow Condensed,sans-serif;font-size:14px;font-weight:700;opacity:0;transition:opacity .3s;pointer-events:none;z-index:99999'; document.body.appendChild(t) }
    t.textContent = msg; t.style.opacity='1'
    setTimeout(() => t.style.opacity='0', 2600)
  }

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

function renderPrizesAdmin(prizes){
  // Calculer les % réels pour affichage
  const tierPcts = window._adminTierPcts || null
  const computed = computeProbsSync(prizes, {}, null, tierPcts)

  document.getElementById('admin-prizes').innerHTML = prizes.map((p,i) => {
    const tc = TIER_COLORS[p.tier||'common']
    const cp = computed.find(c => c.name === p.name)
    const pctGlobal = cp ? (cp.probGlobal*100).toFixed(1) : '—'
    const pctInTier = cp ? (cp.probInTier*100).toFixed(1) : '—'
    const outOfStock = (p.stock||0) === 0
    return `<div style="background:#0D0015;border-radius:10px;padding:12px;margin-bottom:10px;border:1px solid ${outOfStock?'rgba(255,50,50,0.3)':tc.border};${outOfStock?'opacity:0.6':''}">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <img src="${p.img}" style="width:48px;height:42px;object-fit:contain;border-radius:6px;background:#1A0028">
        <div style="flex:1">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:white">${p.name}</div>
          <div style="display:flex;gap:6px;align-items:center;margin-top:3px;flex-wrap:wrap">
            <div style="font-size:10px;color:${tc.label};font-weight:700;text-transform:uppercase;letter-spacing:1px">${tc.name}</div>
            ${outOfStock ? '<div style="font-size:10px;color:#ff6b6b;font-weight:700">ÉPUISÉ</div>' : ''}
          </div>
        </div>
        <button onclick="deletePrize(${i})" style="background:rgba(255,50,50,0.15);border:1px solid rgba(255,50,50,0.3);color:#ff6b6b;border-radius:6px;padding:4px 10px;font-size:12px;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-weight:700">Supprimer</button>
      </div>
      <!-- Chances calculées -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
        <div style="background:#1A0028;border-radius:8px;padding:8px;text-align:center;border:1px solid ${tc.border}">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:${tc.label}">${pctGlobal}%</div>
          <div style="font-size:10px;color:rgba(255,255,255,0.4);margin-top:1px">chance globale</div>
        </div>
        <div style="background:#1A0028;border-radius:8px;padding:8px;text-align:center;border:1px solid rgba(255,255,255,0.1)">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:rgba(255,255,255,0.7)">${pctInTier}%</div>
          <div style="font-size:10px;color:rgba(255,255,255,0.4);margin-top:1px">dans son tier</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div>
          <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px">Stock restant</div>
          <input id="stock-${i}" type="number" min="0" value="${p.stock||0}" style="width:100%;padding:8px;border-radius:8px;border:1px solid #4A1A6A;background:#1A0028;color:white;font-size:16px;font-weight:700;text-align:center;outline:none" onchange="refreshPrizesDisplay()">
        </div>
        <div>
          <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:4px">Tier</div>
          <select id="tier-${i}" style="width:100%;padding:8px;border-radius:8px;border:1px solid #4A1A6A;background:#1A0028;color:white;font-size:13px;outline:none" onchange="refreshPrizesDisplay()">
            <option value="common" ${(p.tier||'common')==='common'?'selected':''}>Commun (80%)</option>
            <option value="rare" ${p.tier==='rare'?'selected':''}>Rare (16%)</option>
            <option value="legendary" ${p.tier==='legendary'?'selected':''}>Légendaire (4%)</option>
          </select>
        </div>
      </div>
    </div>`
  }).join('')
}

window.refreshPrizesDisplay = function(){
  const updated = adminPrizes.map((p,i) => ({
    ...p,
    stock: parseInt(document.getElementById('stock-'+i)?.value||0),
    tier: document.getElementById('tier-'+i)?.value || p.tier || 'common',
  }))
  adminPrizes = updated
  renderPrizesAdmin(adminPrizes)
}

let adminPrizes = []

window.deletePrize = async function(idx){
  if(!confirm('Supprimer ce prix ?')) return
  adminPrizes.splice(idx, 1)
  renderPrizesAdmin(adminPrizes)
  await update(ref(db,'config'), { prizes: adminPrizes })
  document.getElementById('admin-prizes-status').textContent = 'Prix supprimé !'
  setTimeout(() => document.getElementById('admin-prizes-status').textContent = '', 2000)
}

async function loadAdminData(){
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

  // Prix
  adminPrizes = config.prizes ? config.prizes.map(p => ({...p, prob: p.prob||25})) : PRIZES_DEFAULT.map(p => ({...p}))
  renderPrizesAdmin(adminPrizes)

  // Sauvegarder heure
  document.getElementById('admin-save-time').addEventListener('click', async () => {
    const date = document.getElementById('admin-date').value
    const time = document.getElementById('admin-time').value
    const eventTime = new Date(`${date}T${time}:00`).getTime()
    await update(ref(db,'config'), { eventTime })
    document.getElementById('admin-time-status').textContent = 'Heure sauvegardée !'
    setTimeout(() => document.getElementById('admin-time-status').textContent = '', 2000)
  })

  // Sauvegarder prix
  document.getElementById('admin-save-prizes').addEventListener('click', async () => {
    const updated = adminPrizes.map((p,i) => ({
      ...p,
      stock: parseInt(document.getElementById('stock-'+i)?.value) || 0,
      tier: document.getElementById('tier-'+i)?.value || p.tier || 'common',
    }))
    adminPrizes = updated
    await update(ref(db,'config'), { prizes: updated })
    document.getElementById('admin-prizes-status').textContent = 'Prix sauvegardés !'
    setTimeout(() => document.getElementById('admin-prizes-status').textContent = '', 2000)
  })

  // Ajouter un prix
  document.getElementById('admin-add-prize').addEventListener('click', async () => {
    const name = document.getElementById('new-prize-name').value.trim()
    const img = document.getElementById('new-prize-img').value.trim()
    const stock = parseInt(document.getElementById('new-prize-stock').value) || 10
    const tier = document.getElementById('new-prize-tier').value || 'common'
    if(!name || !img){ document.getElementById('admin-add-status').textContent = 'Nom et image requis'; return }
    adminPrizes.push({ name, img: '/' + img.replace(/^\//,''), stock, tier })
    renderPrizesAdmin(adminPrizes)
    await update(ref(db,'config'), { prizes: adminPrizes })
    document.getElementById('new-prize-name').value = ''
    document.getElementById('new-prize-img').value = ''
    document.getElementById('new-prize-stock').value = '10'
    document.getElementById('admin-add-status').textContent = 'Prix ajouté !'
    setTimeout(() => document.getElementById('admin-add-status').textContent = '', 2000)
  })

  // Fournisseurs
  let adminFourn = config.fournisseurs || STANDS.map(s => ({ name: s.name, url: s.url, logo: '/logos/' + s.logo.split('/').pop() }))
  
  function renderFournAdmin(list){
    document.getElementById('admin-fournisseurs').innerHTML = list.map((f,i) => `
      <div style="display:flex;align-items:center;gap:10px;padding:10px;background:#0D0015;border-radius:8px;margin-bottom:8px;border:1px solid #2A0040">
        <img src="${f.logo}" style="width:40px;height:32px;object-fit:contain;background:#1A0028;border-radius:4px">
        <div style="flex:1">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;color:white">${f.name}</div>
          <div style="font-size:11px;color:#9B4DBB">${f.url.replace('https://','')}</div>
        </div>
        <button onclick="deleteFourn(${i})" style="background:rgba(255,50,50,0.15);border:1px solid rgba(255,50,50,0.3);color:#ff6b6b;border-radius:6px;padding:4px 10px;font-size:12px;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-weight:700">X</button>
      </div>
    `).join('')
  }
  renderFournAdmin(adminFourn)

  window.deleteFourn = async function(idx){
    adminFourn.splice(idx, 1)
    renderFournAdmin(adminFourn)
  }

  document.getElementById('admin-save-fourn').addEventListener('click', async () => {
    await update(ref(db,'config'), { fournisseurs: adminFourn })
    document.getElementById('admin-fourn-status').textContent = 'Fournisseurs sauvegardés !'
    setTimeout(() => document.getElementById('admin-fourn-status').textContent = '', 2000)
  })

  document.getElementById('admin-add-fourn').addEventListener('click', async () => {
    const name = document.getElementById('new-fourn-name').value.trim()
    const url = document.getElementById('new-fourn-url').value.trim()
    const logo = document.getElementById('new-fourn-logo').value.trim()
    if(!name || !url){ document.getElementById('admin-add-fourn-status').textContent = 'Nom et URL requis'; return }
    adminFourn.push({ name, url, logo: logo || '/logos/default.png' })
    renderFournAdmin(adminFourn)
    document.getElementById('new-fourn-name').value = ''
    document.getElementById('new-fourn-url').value = ''
    document.getElementById('new-fourn-logo').value = ''
    document.getElementById('admin-add-fourn-status').textContent = 'Fournisseur ajouté !'
    setTimeout(() => document.getElementById('admin-add-fourn-status').textContent = '', 2000)
  })

  // Simuler un tirage
  document.getElementById('admin-test-roulette').addEventListener('click', async () => {
    const prizes = computeProbsSync(adminPrizes, {}, null, window._adminTierPcts || null)
    if(prizes.length === 0){ alert('Aucun prix disponible'); return }
    const rand = Math.random()
    let cumul = 0, chosen = prizes[0]
    for(let i=0; i<prizes.length; i++){
      cumul += prizes[i].prob
      if(rand < cumul){ chosen = prizes[i]; break }
    }
    const tc = TIER_COLORS[chosen.tier||'common']
    const result = document.getElementById('admin-test-result')
    result.style.display = 'block'
    result.style.border = '1px solid ' + tc.border
    document.getElementById('admin-test-img').innerHTML = `<img src="${chosen.img}" style="width:80px;height:70px;object-fit:contain;border-radius:8px">`
    document.getElementById('admin-test-name').textContent = chosen.name
    document.getElementById('admin-test-tier').style.color = tc.label
    document.getElementById('admin-test-tier').textContent = tc.name
    document.getElementById('admin-test-pct').textContent = 'Chance globale : ' + (chosen.probGlobal*100).toFixed(1) + '%'
  })

  // Supprimer un participant
  window.adminDeleteParticipant = async function(key, name){
    if(!confirm('Supprimer ' + name + ' ?')) return
    await set(ref(db, 'companies/' + key), null)
  }

  // Attribuer un prix manuellement
  window.adminGivePrize = async function(key, name, rank){
    const configSnap = await get(ref(db,'config'))
    const config = configSnap.exists() ? configSnap.val() : {}
    const prizes = config.prizes || PRIZES_DEFAULT
    const modal = document.getElementById('admin-give-prize-modal')
    document.getElementById('modal-company-name').textContent = name
    document.getElementById('modal-prizes-list').innerHTML = prizes.map(p => {
      const tc = TIER_COLORS[p.tier||'common']
      const outOfStock = (p.stock||0) === 0
      return `<div style="display:flex;align-items:center;gap:10px;padding:10px;background:#0D0015;border-radius:8px;margin-bottom:8px;border:1px solid ${tc.border};${outOfStock?'opacity:0.4':''}">
        <img src="${p.img}" style="width:40px;height:36px;object-fit:contain">
        <div style="flex:1">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;color:white">${p.name}</div>
          <div style="font-size:11px;color:${tc.label}">${tc.name} · Stock : ${p.stock||0}</div>
        </div>
        <button onclick="adminAssignPrize('${key}','${p.name}')" ${outOfStock?'disabled':''} style="background:${outOfStock?'rgba(255,255,255,0.05)':'linear-gradient(135deg,#3A1050,#5A1F78)'};border:1px solid ${tc.border};color:${outOfStock?'rgba(255,255,255,0.3)':'white'};border-radius:6px;padding:6px 12px;font-size:12px;cursor:${outOfStock?'not-allowed':'pointer'};font-family:'Barlow Condensed',sans-serif;font-weight:700">Attribuer</button>
      </div>`
    }).join('')
    modal.style.display = 'flex'
  }

  window.adminAssignPrize = async function(key, prizeName){
    await update(ref(db, 'companies/' + key), { prize: prizeName })
    // Décrémenter le stock
    const configSnap = await get(ref(db,'config'))
    const config = configSnap.exists() ? configSnap.val() : {}
    const prizes = config.prizes || PRIZES_DEFAULT
    const idx = prizes.findIndex(p => p.name === prizeName)
    if(idx >= 0 && prizes[idx].stock > 0){
      prizes[idx].stock--
      await update(ref(db,'config'), { prizes })
    }
    document.getElementById('admin-give-prize-modal').style.display = 'none'
    showToast('Prix attribué !')
  }

  // Reset toutes les données
  document.getElementById('admin-reset-all').addEventListener('click', async () => {
    if(!confirm('Supprimer TOUTES les données participants ? Cette action est irréversible.')) return
    await set(ref(db,'companies'), null)
    document.getElementById('admin-reset-status').textContent = 'Données supprimées !'
    setTimeout(() => document.getElementById('admin-reset-status').textContent = '', 3000)
  })

  // Tiers
  const tierPcts = config.tierPcts || { common: 80, rare: 16, legendary: 4 }
  window._adminTierPcts = tierPcts
  document.getElementById('tier-pct-common').value = tierPcts.common ?? 80
  document.getElementById('tier-pct-rare').value = tierPcts.rare ?? 16
  document.getElementById('tier-pct-legendary').value = tierPcts.legendary ?? 4

  const updateTierTotal = () => {
    const c = parseInt(document.getElementById('tier-pct-common').value)||0
    const r = parseInt(document.getElementById('tier-pct-rare').value)||0
    const l = parseInt(document.getElementById('tier-pct-legendary').value)||0
    const tot = c + r + l
    const ind = document.getElementById('tier-total-indicator')
    ind.textContent = 'Total : ' + tot + '%'
    ind.style.color = tot === 100 ? '#4AFF90' : '#FF6B6B'
    window._adminTierPcts = { common: c, rare: r, legendary: l }
    renderPrizesAdmin(adminPrizes)
  }
  document.getElementById('tier-pct-common').addEventListener('input', updateTierTotal)
  document.getElementById('tier-pct-rare').addEventListener('input', updateTierTotal)
  document.getElementById('tier-pct-legendary').addEventListener('input', updateTierTotal)

  document.getElementById('admin-save-tiers').addEventListener('click', async () => {
    const c = parseInt(document.getElementById('tier-pct-common').value)||0
    const r = parseInt(document.getElementById('tier-pct-rare').value)||0
    const l = parseInt(document.getElementById('tier-pct-legendary').value)||0
    if(c + r + l !== 100){ document.getElementById('admin-tiers-status').textContent = 'La somme doit faire 100% !'; return }
    await update(ref(db,'config'), { tierPcts: { common: c, rare: r, legendary: l } })
    document.getElementById('admin-tiers-status').textContent = 'Tiers sauvegardés !'
    setTimeout(() => document.getElementById('admin-tiers-status').textContent = '', 2000)
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

  // Progression des chances
  const progConfig = config.progBonus || { rare: 0.5, legendary: 0.2 }
  document.getElementById('prog-bonus-rare').value = progConfig.rare ?? 0.5
  document.getElementById('prog-bonus-legendary').value = progConfig.legendary ?? 0.2

  const updateProgSim = () => {
    const stands = parseInt(document.getElementById('prog-sim-stands').value)
    const bonusRare = parseFloat(document.getElementById('prog-bonus-rare').value) || 0
    const bonusLeg = parseFloat(document.getElementById('prog-bonus-legendary').value) || 0
    const tierPctsNow = window._adminTierPcts || { common: 80, rare: 16, legendary: 4 }
    const simPcts = applyProgBonus(tierPctsNow, stands, bonusRare, bonusLeg)
    document.getElementById('prog-sim-result').innerHTML = 
      `<span style="color:#4A90FF">Standard : ${simPcts.common.toFixed(1)}%</span> &nbsp;
       <span style="color:#FF69B4">Sélection : ${simPcts.rare.toFixed(1)}%</span> &nbsp;
       <span style="color:#FFD700">Prestige : ${simPcts.legendary.toFixed(1)}%</span>
       <div style="color:rgba(255,255,255,0.4);font-size:11px;margin-top:4px">pour ${stands} stands visités</div>`
  }
  document.getElementById('prog-sim-stands').addEventListener('input', updateProgSim)
  document.getElementById('prog-bonus-rare').addEventListener('input', updateProgSim)
  document.getElementById('prog-bonus-legendary').addEventListener('input', updateProgSim)
  updateProgSim()

  document.getElementById('admin-save-prog').addEventListener('click', async () => {
    const progBonus = {
      rare: parseFloat(document.getElementById('prog-bonus-rare').value) || 0,
      legendary: parseFloat(document.getElementById('prog-bonus-legendary').value) || 0,
    }
    await update(ref(db,'config'), { progBonus })
    document.getElementById('admin-prog-status').textContent = 'Progression sauvegardée !'
    setTimeout(() => document.getElementById('admin-prog-status').textContent = '', 2000)
  })

  // Stats + participants en temps réel
  onValue(ref(db,'companies'), snap => {
    if(!snap.exists()){
      document.getElementById('stat-total').textContent = '0'
      document.getElementById('stat-finished').textContent = '0'
      document.getElementById('stat-avgtime').textContent = '—'
      document.getElementById('stat-prizes').textContent = '0'
      document.getElementById('admin-participants').textContent = 'Aucun participant'
      return
    }
    const all = Object.values(snap.val()).sort((a,b) => {
      if((b.score||0) !== (a.score||0)) return (b.score||0) - (a.score||0)
      return (a.finishTime||Infinity) - (b.finishTime||Infinity)
    })
    const finished = all.filter(c => c.finishTime)
    const withPrize = all.filter(c => c.prize)

    // Temps moyen des gens qui ont fini
    let avgTime = '—'
    if(finished.length > 0){
      const avgMs = finished.reduce((s,c) => s + ((c.finishTime||0) - (c.startTime||0)), 0) / finished.length
      const m = Math.floor(avgMs/60000)
      const s = Math.floor((avgMs%60000)/1000)
      avgTime = m + 'min ' + s + 's'
    }

    document.getElementById('stat-total').textContent = all.length
    document.getElementById('stat-finished').textContent = finished.length
    document.getElementById('stat-avgtime').textContent = avgTime
    document.getElementById('stat-prizes').textContent = withPrize.length

    document.getElementById('admin-participants').innerHTML = `
      <div style="margin-bottom:10px;font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:1px;text-transform:uppercase;font-family:'Barlow Condensed',sans-serif">Liste des participants</div>
      ${all.map((c,i) => {
        const duration = c.finishTime && c.startTime ? (() => {
          const ms = c.finishTime - c.startTime
          return Math.floor(ms/60000) + 'min ' + Math.floor((ms%60000)/1000) + 's'
        })() : null
        const key = Object.keys(snap.val()).find(k => snap.val()[k].name === c.name) || ''
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #2A0040">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:800;color:rgba(255,255,255,0.3);width:24px;text-align:center">${i+1}</div>
          <div style="flex:1">
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:white">${c.name}</div>
            ${duration ? `<div style="font-size:11px;color:rgba(255,255,255,0.4)">${duration}</div>` : ''}
          </div>
          <div style="text-align:right;margin-right:8px">
            <div style="font-size:13px;color:#9B4DBB;font-weight:700">${c.score||0}/${STANDS.length}</div>
            ${c.finishTime ? '<div style="font-size:10px;color:#FFD700">Terminé</div>' : ''}
          </div>
                    <div style="flex-shrink:0;text-align:right;margin-right:6px">
            ${c.prize
              ? `<div style="background:rgba(255,215,0,0.15);border:1px solid rgba(255,215,0,0.4);border-radius:6px;padding:3px 8px;font-size:10px;color:#FFD700;font-weight:700;max-width:90px;line-height:1.3">${c.prize}</div>`
              : `<button onclick="adminGivePrize('${key}','${c.name.replace(/'/g,"\'")}','${i}')" style="background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.3);color:#FFD700;border-radius:6px;padding:4px 8px;font-size:10px;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-weight:700">Donner prix</button>`
            }
          </div>
          <button onclick="deleteParticipant('${key}','${c.name.replace(/'/g,"\'")}',this)" style="background:rgba(255,50,50,0.15);border:1px solid rgba(255,50,50,0.3);color:#ff6b6b;border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-weight:700;flex-shrink:0">X</button>
        </div>`
      }).join('')}
    `
  })
}

window.deleteParticipant = async function(key, name, btn){
  if(!confirm('Supprimer ' + name + ' ?')) return
  btn.disabled = true
  btn.textContent = '...'
  await set(ref(db, 'companies/' + key), null)
  btn.closest('div[style*="border-bottom"]').style.opacity = '0.3'
  btn.textContent = 'Supprimé'
}


// ==========================================
// TV
// ==========================================
function renderTV(){
  document.querySelector('#app').innerHTML = `<div id="tv"></div>`
  document.querySelector('#app').style.cssText = 'background:linear-gradient(160deg,#3A1050 0%,#5A1F78 40%,#C490DD 80%,white 100%);min-height:100vh;padding:32px;font-family:Barlow,sans-serif;color:white'

  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideDown { from { transform:translateY(-20px); opacity:0 } to { transform:translateY(0); opacity:1 } }
    @keyframes goldFlash { 0%,100% { box-shadow:none } 50% { box-shadow:0 0 24px rgba(255,215,0,0.6) } }
    .tv-row-new { animation: slideDown 0.5s ease; }
    .tv-row-promoted { animation: goldFlash 1s ease 2; }
  `
  document.head.appendChild(style)

  let prevOrder = []

  onValue(ref(db,'companies'), snap => {
    if(!snap.exists()){
      document.getElementById('tv').innerHTML = '<p style="text-align:center;opacity:0.5;font-size:20px;margin-top:40px">En attente des participants...</p>'
      return
    }
    const all = Object.values(snap.val()).sort((a,b) => {
      if((b.score||0) !== (a.score||0)) return (b.score||0) - (a.score||0)
      return (a.finishTime||Infinity) - (b.finishTime||Infinity)
    })

    const podiumColors = [
      { color:'#FFD700', bg:'rgba(255,215,0,0.15)',   border:'rgba(255,215,0,0.5)',   shadow:'0 0 30px rgba(255,215,0,0.25)',   scale:'scale(1.04)' },
      { color:'#C0C0C0', bg:'rgba(192,192,192,0.1)',  border:'rgba(192,192,192,0.35)', shadow:'0 0 20px rgba(192,192,192,0.1)', scale:'scale(1)' },
      { color:'#CD7F32', bg:'rgba(205,127,50,0.1)',   border:'rgba(205,127,50,0.35)', shadow:'0 0 20px rgba(205,127,50,0.1)',  scale:'scale(1)' },
    ]
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
        ${all.slice(0,3).map((c,i) => {
          const pc = podiumColors[i]
          return `<div style="background:${pc.bg};border:2px solid ${pc.border};border-radius:20px;padding:24px 16px;text-align:center;transform:${pc.scale};box-shadow:${pc.shadow};transition:all 0.5s ease">
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:800;color:${pc.color};letter-spacing:3px;margin-bottom:10px">${medals[i]}</div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;color:white;margin-bottom:6px">${c.name}</div>
            <div style="font-size:17px;color:rgba(255,255,255,0.7)">${c.score||0} / ${STANDS.length} stands</div>
            ${c.finishTime ? `<div style="font-size:12px;color:${pc.color};margin-top:4px;font-weight:700">Terminé</div>` : ''}
            <div style="height:4px;background:rgba(255,255,255,0.15);border-radius:2px;margin-top:14px">
              <div style="height:100%;background:${pc.color};border-radius:2px;width:${((c.score||0)/STANDS.length*100)}%;transition:width 0.8s ease"></div>
            </div>
          </div>`
        }).join('')}
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${all.slice(3).map((c,i) => {
          const prevIdx = prevOrder.indexOf(c.name)
          const newIdx = i + 3
          const promoted = prevIdx > newIdx && prevIdx >= 0
          return `<div class="${promoted ? 'tv-row-promoted' : ''}" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,${promoted?'0.4':'0.1'});border-radius:12px;padding:14px 20px;display:flex;align-items:center;gap:16px;transition:all 0.6s ease">
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:rgba(255,255,255,0.4);width:32px;text-align:center">${newIdx+1}</div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:700;flex:1;color:white">${c.name}${c.finishTime ? ' ✓' : ''}</div>
            <div style="width:180px;height:6px;background:rgba(255,255,255,0.12);border-radius:3px">
              <div style="height:100%;background:rgba(255,255,255,0.6);border-radius:3px;width:${((c.score||0)/STANDS.length*100)}%;transition:width 0.8s ease"></div>
            </div>
            <div style="text-align:right">
              <div style="font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;color:white">${c.score||0}</div>
              <div style="font-size:13px;color:rgba(255,255,255,0.5)">/${STANDS.length}</div>
            </div>
          </div>`
        }).join('')}
      </div>
      <div style="margin-top:32px;text-align:center;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:600;opacity:0.3;letter-spacing:2px;text-transform:uppercase">${all.length} entreprise${all.length>1?'s':''} en compétition</div>
    `
    prevOrder = all.map(c => c.name)
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
    <p class="hero-sub">Visitez un maximum de stands pour maximiser vos chances de remporter un cadeau !</p>
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
    <div id="chances-bar" style="margin-top:10px;text-align:center;padding:0 4px"></div>
  </div>
  <div class="body">
    <button class="btn btn-main" id="btn-scanner" style="font-size:20px;padding:18px;letter-spacing:1px">Scanner un QR code</button>
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
    <button class="btn btn-ghost" id="btn-lb-prog">Classement en direct</button>
  </div>
</div>

<div id="s-scanner" class="screen">
  <div class="scan-hdr">
    <button class="btn-top-back" id="btn-back-scan">← Retour</button>
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
  </div>
</div>

<div id="s-leaderboard" class="screen">
  <div class="lb-hdr">
    <button class="btn-top-back" id="btn-back-lb">← Retour</button>
    <h2>Classement Live</h2>
    <p id="lb-sub">Chargement...</p>
  </div>
  <div class="lb-body">
    <div class="loading" id="lb-loading"><div class="spin"></div>Connexion...</div>
    <div class="podium" id="podium"></div>
    <div id="lb-list"></div>
  </div>
</div>

<div id="s-fournisseurs" class="screen">
  <div class="lb-hdr">
    <button class="btn-top-back" id="btn-back-fourn">← Retour</button>
    <h2>Nos fournisseurs</h2>
    <p>Découvrez leurs sites officiels</p>
  </div>
  <div class="body" style="gap:10px">
    <div id="fournisseurs-list"></div>
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
    let rouletteTriggered = false
    const updateCd = () => {
      const eventTime = configCache.eventTime
      if(!eventTime){ bar.style.display = 'none'; return }
      const remaining = eventTime - Date.now()
      if(remaining <= 0){
        bar.style.display = 'block'
        val.textContent = 'Remise des prix !'
        val.style.fontSize = '16px'
        val.style.color = '#FFD700'
        clearInterval(countdownInterval)
        // Déclencher la roulette automatiquement si pas encore fait
        if(!rouletteTriggered && !document.querySelector('.casino-overlay')){
          rouletteTriggered = true
          get(ref(db, 'companies/' + state.companyKey)).then(snap => {
            if(!snap.exists()) return
            const data = snap.val()
            if(data.prize){ showPrizeResult(data.prize); return }
            if((data.score||0) > 0) showRoulette()
          })
        }
      } else {
        bar.style.display = 'block'
        val.textContent = formatCountdown(remaining)
        val.style.color = 'white'
        val.style.fontSize = '24px'
      }
    }
    updateCd()
    countdownInterval = setInterval(updateCd, 1000)
  }

  // Charger config Firebase
  onValue(ref(db,'config'), snap => {
    configCache = snap.exists() ? snap.val() : {}
    if(state.visited.length < STANDS.length) startCountdown()
  })

  // Probabilités : stock proportionnel au sein du tier, % tier fixe
  // Retourne aussi probGlobal et probInTier pour affichage

  async function computeProbabilities(){
    const configSnap = await get(ref(db,'config'))
    const config = configSnap.exists() ? configSnap.val() : {}
    const allPrizes = config.prizes || PRIZES_DEFAULT
    const bonus = config.bonus || {}
    const baseTierPcts = config.tierPcts || { common: 80, rare: 16, legendary: 4 }
    const progBonus = config.progBonus || { rare: 0.5, legendary: 0.2 }
    // Ajuster les tiers selon le nombre de stands visités
    const adjustedTierPcts = applyProgBonus(baseTierPcts, state.visited.length, progBonus.rare, progBonus.legendary)
    return computeProbsSync(allPrizes, bonus, state.rank, adjustedTierPcts)
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

    // Afficher les chances en direct
    if(configCache.tierPcts || configCache.progBonus){
      const baseTierPcts = configCache.tierPcts || { common: 80, rare: 16, legendary: 4 }
      const progBonus = configCache.progBonus || { rare: 0.5, legendary: 0.2 }
      const adj = applyProgBonus(baseTierPcts, state.visited.length, progBonus.rare, progBonus.legendary)
      const chancesEl = document.getElementById('chances-bar')
      if(chancesEl){
        chancesEl.innerHTML = `
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:2px;text-transform:uppercase;margin-bottom:6px">Vos chances actuelles</div>
          <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap">
            <div style="background:rgba(74,144,255,0.2);border:1px solid #4A90FF;border-radius:20px;padding:3px 10px;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;color:#4A90FF">Standard ${adj.common.toFixed(0)}%</div>
            <div style="background:rgba(255,105,180,0.2);border:1px solid #FF69B4;border-radius:20px;padding:3px 10px;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;color:#FF69B4">Sélection ${adj.rare.toFixed(0)}%</div>
            <div style="background:rgba(255,215,0,0.2);border:1px solid #FFD700;border-radius:20px;padding:3px 10px;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;color:#FFD700">Prestige ${adj.legendary.toFixed(0)}%</div>
          </div>
        `
      }
    }
  }

  document.getElementById('btn-scanner').addEventListener('click', () => {
    show('s-scanner')
    document.getElementById('scan-ok').style.display = 'none'
    document.getElementById('scan-status').style.display = 'block'
    loadQrScanner()
  })

  document.getElementById('btn-lb-prog').addEventListener('click', showLeaderboard)

  // --- Fournisseurs ---
  document.getElementById('btn-fournisseurs').addEventListener('click', async () => {
    const configSnap = await get(ref(db,'config'))
    const config = configSnap.exists() ? configSnap.val() : {}
    // Toujours utiliser STANDS comme base, Firebase en override optionnel
    const baseFourn = STANDS.map(s => ({ name: s.name, url: s.url, logo: '/logos/' + s.logo }))
    const fournisseurs = (config.fournisseurs && config.fournisseurs.length > 0) ? config.fournisseurs : baseFourn
    document.getElementById('fournisseurs-list').innerHTML = fournisseurs.map(s => `
      <a href="${s.url}" target="_blank" rel="noopener" class="fourn-row">
        <div class="fourn-logo-wrap">
          <img class="fourn-logo" src="${s.logo}" alt="${s.name}"
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
    const configSnap = await get(ref(db,'config'))
    const config = configSnap.exists() ? configSnap.val() : {}
    const overlay = document.createElement('div')
    overlay.className = 'casino-overlay'
    overlay.style.cssText = `position:fixed;inset:0;background:#0D0015;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity .3s;padding:24px;overflow:auto`
    const allPrizesForPreview = config.prizes || PRIZES_DEFAULT
    overlay.innerHTML = `
      <div style="width:100%;max-width:380px">
        <div style="text-align:center;margin-bottom:20px">
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#9B4DBB;margin-bottom:6px">Complétez les ${STANDS.length} stands</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:800;color:white">Prix à gagner</div>
          <div style="width:60px;height:2px;background:linear-gradient(90deg,transparent,#7B2D9B,transparent);margin:10px auto 0"></div>
        </div>
        ${allPrizesForPreview.length === 0 ? '<div style="text-align:center;color:rgba(255,255,255,0.5);padding:20px">Aucun prix disponible</div>' :
          ['common','rare','legendary'].map(tier => {
            const tierPrizes = allPrizesForPreview.filter(p => (p.tier||'common') === tier)
            if(tierPrizes.length === 0) return ''
            const tc = TIER_COLORS[tier]
            return tierPrizes.map(p => {
              const outOfStock = (p.stock||0) === 0
              return `<div style="background:linear-gradient(135deg,${tc.bg},#0D0015);border:1px solid ${tc.border};border-radius:14px;padding:14px;margin-bottom:10px;display:flex;align-items:center;gap:14px;position:relative;overflow:hidden;${outOfStock?'opacity:0.4':''}">
                <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 20% 50%,${tc.glow},transparent 60%);pointer-events:none"></div>
                <div style="position:relative;width:72px;height:64px;flex-shrink:0;background:rgba(255,255,255,0.04);border-radius:8px;display:flex;align-items:center;justify-content:center;border:1px solid ${tc.border}">
                  <img src="${p.img}" style="max-width:64px;max-height:58px;object-fit:contain;border-radius:6px">
                </div>
                <div style="flex:1;position:relative">
                  <div style="font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:800;color:white;margin-bottom:5px">${p.name}</div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap">
                    <div style="background:${tc.border};border-radius:20px;padding:2px 10px;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;color:${tc.label};letter-spacing:1px;text-transform:uppercase">${tc.name}</div>
                    <div style="background:rgba(255,255,255,0.06);border-radius:20px;padding:2px 10px;font-size:11px;color:rgba(255,255,255,0.5)">${outOfStock ? 'Épuisé' : 'Stock : ' + p.stock}</div>
                  </div>
                </div>
              </div>`
            }).join('')
          }).join('')
        }
        <div style="text-align:center;margin:14px 0;font-size:13px;color:rgba(255,255,255,0.4)">Plus vous visitez de stands, meilleures sont vos chances !</div>
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
    showScanAnimation(stand.name, state.visited.length, STANDS.length)
  }

  function showScanAnimation(brandName, visited, total){
    const isComplete = false  // La roulette se déclenche à l'heure de fin, pas ici
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
            ${items.map((p,i) => {
              const tc2 = TIER_COLORS[p.tier||'common']
              return `<div style="min-width:${itemW}px;height:${itemW}px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:${i%2===0?tc2.bg:'#0D0015'};border-right:1px solid ${tc2.border};flex-shrink:0;position:relative">
                <div style="position:absolute;top:4px;right:6px;font-size:9px;font-weight:700;color:${tc2.label};font-family:'Barlow Condensed',sans-serif;letter-spacing:1px;text-transform:uppercase">${tc2.name}</div>
                <img src="${p.img}" style="max-width:${itemW-24}px;max-height:${itemW-28}px;object-fit:contain;border-radius:6px">
              </div>`
            }).join('')}
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
    const prize = configPrizes.find(p => p.name === prizeName) || { name: prizeName, img: '', tier: 'common' }
    const tc = TIER_COLORS[prize.tier || 'common']
    const overlay = document.createElement('div')
    overlay.className = 'casino-overlay'
    overlay.style.cssText = `position:fixed;inset:0;background:#0D0015;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;padding:24px;opacity:0;transition:opacity .3s`
    overlay.innerHTML = `
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;color:${tc.label};letter-spacing:4px;text-transform:uppercase;margin-bottom:8px">${tc.name}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;color:#9B4DBB;letter-spacing:4px;text-transform:uppercase;margin-bottom:16px">Votre prix</div>
      <div style="position:relative;margin-bottom:24px">
        <div style="position:absolute;inset:-20px;background:radial-gradient(ellipse,${tc.glow},transparent 70%);pointer-events:none"></div>
        <div style="width:200px;height:180px;background:linear-gradient(135deg,${tc.bg},#0D0015);border:2px solid ${tc.border};border-radius:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 40px ${tc.glow}">
          <img src="${prize.img}" style="max-width:170px;max-height:155px;object-fit:contain;border-radius:10px">
        </div>
      </div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:800;color:white;text-align:center;margin-bottom:8px">${prize.name}</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.5);text-align:center;max-width:260px;margin-bottom:32px;line-height:1.6">Présentez cet écran à l'accueil pour récupérer votre cadeau !</div>
      <button onclick="document.querySelectorAll('.casino-overlay').forEach(e=>e.remove())" style="padding:14px 40px;background:linear-gradient(135deg,${tc.bg},${tc.border});color:white;border:1px solid ${tc.label};border-radius:12px;font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:800;cursor:pointer;letter-spacing:1px">Continuer</button>
    `
    document.body.appendChild(overlay)
    requestAnimationFrame(() => overlay.style.opacity = '1')
  }

  function extractStand(url){

    // QR code roulette PODIUM — bonus pour top 3
    if(url.includes('admin-roulette-podium')){
      stopScanner()
      get(ref(db, 'companies/' + state.companyKey)).then(async snap => {
        if(!snap.exists()){ showToast('Inscrivez-vous d\'abord sur le site'); return }
        const data = snap.val()
        if(data.prize){ showPrizeResult(data.prize); return }
        if((data.score||0) === 0){ showToast('Vous devez visiter au moins un stand'); return }
        // Forcer le rang podium pour avoir le bonus
        const savedRank = state.rank
        state.rank = Math.min(state.rank || 1, 1)
        await showRoulette()
        state.rank = savedRank
      })
      return { name: '__test__', slug: 'test' }
    }

    // QR code roulette STANDARD — sans bonus podium
    if(url.includes('admin-roulette-standard')){
      stopScanner()
      get(ref(db, 'companies/' + state.companyKey)).then(async snap => {
        if(!snap.exists()){ showToast('Inscrivez-vous d\'abord sur le site'); return }
        const data = snap.val()
        if(data.prize){ showPrizeResult(data.prize); return }
        if((data.score||0) === 0){ showToast('Vous devez visiter au moins un stand'); return }
        // Tirage sans bonus podium
        const savedRank = state.rank
        state.rank = null
        await showRoulette()
        state.rank = savedRank
      })
      return { name: '__test__', slug: 'test' }
    }

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
      const podiumColors = ['#FFD700','#C0C0C0','#CD7F32']
      const podiumLabels = ['1er','2e','3e']
      document.getElementById('podium').innerHTML = all.slice(0,3).map((c,i) =>
        `<div class="pod ${i===0?'first':''}" style="border-color:${podiumColors[i]}20">
          <div class="pod-medal" style="color:${podiumColors[i]}">${podiumLabels[i]||''}</div>
          <div class="pod-name">${c.name}</div>
          <div class="pod-score">${c.score||0}/${STANDS.length}</div>
          ${c.finishTime?'<div class="pod-finish">Terminé</div>':''}
          <div class="pod-bar" style="background:${podiumColors[i]}"></div>
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

  // Exposer reset pour l'admin
  window.resetMyProgress = async function(){
    localStorage.removeItem('royelec-company')
    localStorage.removeItem('royelec-start')
    if(state.companyKey){
      await set(ref(db, 'companies/' + state.companyKey), null)
    }
    state = { company: '', visited: [], companyKey: '', startTime: null, rank: null }
    show('s-accueil')
    showToast('Progression réinitialisée')
  }

  function showToast(msg){
    const t = document.getElementById('toast')
    t.textContent = msg; t.classList.add('show')
    setTimeout(() => t.classList.remove('show'), 2600)
  }
}
