import "./styles/compte.css"
import "./styles/historique.css"
import { useState, useEffect, useMemo } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { LocalNotifications } from "@capacitor/local-notifications"
import "./App.css"
import {
  FiBell,
  FiUser,
  FiCreditCard,
  FiBriefcase,
  FiShield,
  FiLock,
  FiSmartphone,
  FiMonitor,
  FiSettings,
  FiMoon,
  FiSun,
  FiInfo,
  FiFileText,
  FiChevronRight,
  FiChevronLeft,
  FiLogOut,
  FiEdit3,
  FiCheck,
  FiHome,
  FiCamera,
  FiClipboard,
  FiBarChart2,
  FiCheckCircle,
  FiZap,
  FiMessageCircle,
  FiTag,
  FiSearch,
  FiX,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
  FiTrendingUp,
  FiHash,
  FiUser as FiUserIcon
} from "react-icons/fi"
import { BsQrCodeScan, BsClockHistory } from "react-icons/bs"

/* ── Mock scan history (pre-populated so page looks real) ── */
const MOCK_SCANS = [
  { id:"SCN-010", ticketId:"TKT-8821-2026", event:"Gala Kivana 2026",        location:"Sofitel Abidjan",      scanTime:"2026-07-29T14:47:00", status:"valide",  gate:"Entrée VIP",       zone:"VIP",      holder:"Sophie Martin",    agentId:"KIV-0001" },
  { id:"SCN-009", ticketId:"TKT-6643-2026", event:"Gala Kivana 2026",        location:"Sofitel Abidjan",      scanTime:"2026-07-29T14:31:00", status:"valide",  gate:"Entrée A",         zone:"Standard", holder:"Karim Ouattara",   agentId:"KIV-0001" },
  { id:"SCN-008", ticketId:"TKT-3310-2026", event:"Gala Kivana 2026",        location:"Sofitel Abidjan",      scanTime:"2026-07-29T14:18:00", status:"refuse",  gate:"Entrée A",         zone:"Standard", holder:"Inconnu",          agentId:"KIV-0001" },
  { id:"SCN-007", ticketId:"TKT-9901-2026", event:"Gala Kivana 2026",        location:"Sofitel Abidjan",      scanTime:"2026-07-29T14:02:00", status:"doublon", gate:"Entrée B",         zone:"Standard", holder:"Moussa Diallo",    agentId:"KIV-0001" },
  { id:"SCN-006", ticketId:"TKT-5512-2026", event:"Concert Afro Summer",     location:"Palais de la Culture", scanTime:"2026-07-28T21:15:00", status:"valide",  gate:"Entrée principale",zone:"Carré OR", holder:"Aminata Traoré",  agentId:"KIV-0001" },
  { id:"SCN-005", ticketId:"TKT-4478-2026", event:"Concert Afro Summer",     location:"Palais de la Culture", scanTime:"2026-07-28T21:03:00", status:"valide",  gate:"Entrée principale",zone:"Standard", holder:"Jean-Pierre Kone", agentId:"KIV-0001" },
  { id:"SCN-004", ticketId:"TKT-2290-2026", event:"Concert Afro Summer",     location:"Palais de la Culture", scanTime:"2026-07-28T20:44:00", status:"refuse",  gate:"Entrée principale",zone:"Standard", holder:"Inconnu",          agentId:"KIV-0001" },
  { id:"SCN-003", ticketId:"TKT-7763-2026", event:"Forum Tech Abidjan",      location:"CCIAD, Abidjan",       scanTime:"2026-07-27T09:30:00", status:"valide",  gate:"Accès conférence", zone:"Premium",  holder:"Dr. Awa Konaté",   agentId:"KIV-0001" },
  { id:"SCN-002", ticketId:"TKT-1195-2026", event:"Forum Tech Abidjan",      location:"CCIAD, Abidjan",       scanTime:"2026-07-27T09:11:00", status:"doublon", gate:"Accès conférence", zone:"Standard", holder:"Ibrahim Coulibaly",agentId:"KIV-0001" },
  { id:"SCN-001", ticketId:"TKT-0042-2026", event:"Forum Tech Abidjan",      location:"CCIAD, Abidjan",       scanTime:"2026-07-27T08:58:00", status:"valide",  gate:"Accès conférence", zone:"Standard", holder:"Fatou Sylla",      agentId:"KIV-0001" },
]

function App() {
  const [page, setPage] = useState("accueil")
  const [result, setResult] = useState("")

  useEffect(() => {
    const initialiserNotifications = async () => {
      try {
        const permission = await LocalNotifications.checkPermissions()
        if (permission.display !== "granted") {
          const demande = await LocalNotifications.requestPermissions()
          if (demande.display === "granted") {
            console.log("Notifications autorisées ✅")
          } else {
            console.log("Permission de notification refusée ❌")
          }
        } else {
          console.log("Notifications déjà autorisées ✅")
        }
      } catch (error) {
        console.error("Erreur permissions notifications :", error)
      }
    }
    initialiserNotifications()
  }, [])

  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem("kivana_user")
      return s ? JSON.parse(s) : null
    } catch (e) {
      return null
    }
  })

  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  // Notification toggles state
  const [notifPush, setNotifPush] = useState(true)
  const [notifEmail, setNotifEmail] = useState(false)
  const [notifRappel, setNotifRappel] = useState(true)

  // Theme state
  const [theme, setTheme] = useState("clair")

  // Historique state
  const [scanHistory, setScanHistory] = useState(() => {
    try {
      const s = localStorage.getItem("kivana_scan_history")
      return s ? JSON.parse(s) : MOCK_SCANS
    } catch (e) { return MOCK_SCANS }
  })
  const [histFilter, setHistFilter] = useState("tous")
  const [histSearch, setHistSearch] = useState("")
  const [histDetail, setHistDetail] = useState(null)

  /* ── Helper: group scans by day ── */
  const groupScansByDay = (scans) => {
    const today = new Date()
    const yesterday = new Date(today - 86400000)
    const groups = {}
    scans.forEach(scan => {
      const d = new Date(scan.scanTime)
      const key = d.toDateString()
      if (!groups[key]) {
        const label = d.toDateString() === today.toDateString() ? "Aujourd'hui"
          : d.toDateString() === yesterday.toDateString() ? "Hier"
          : d.toLocaleDateString("fr-FR", { weekday:"long", day:"numeric", month:"long" })
        groups[key] = { label, timestamp: d.getTime(), items: [] }
      }
      groups[key].items.push(scan)
    })
    return Object.values(groups).sort((a, b) => b.timestamp - a.timestamp)
  }

  /* ── Filtered + searched scans ── */
  const filteredScans = useMemo(() => {
    return scanHistory
      .filter(s => histFilter === "tous" || s.status === histFilter)
      .filter(s => {
        if (!histSearch) return true
        const q = histSearch.toLowerCase()
        return s.ticketId.toLowerCase().includes(q)
          || s.event.toLowerCase().includes(q)
          || s.holder.toLowerCase().includes(q)
      })
      .sort((a, b) => new Date(b.scanTime) - new Date(a.scanTime))
  }, [scanHistory, histFilter, histSearch])

  const histGroups = useMemo(() => groupScansByDay(filteredScans), [filteredScans])
  const statValide  = scanHistory.filter(s => s.status === "valide").length
  const statRefuse  = scanHistory.filter(s => s.status === "refuse").length

  /* ── Format scan time ── */
  const formatTime = (iso) => new Date(iso).toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" })
  const formatDateTime = (iso) => new Date(iso).toLocaleString("fr-FR", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" })

  const banners = [
    "https://res.cloudinary.com/fa719lho/image/upload/v1784366939/Bloum-Cash-1-1_e0rlfv.jpg",
    "https://res.cloudinary.com/fa719lho/image/upload/f_auto,q_auto/Plan_de_travail_5-1_zqbvpl",
    "https://res.cloudinary.com/fa719lho/image/upload/v1784367054/Bloum-Cash-2-1_w7der7.jpg"
  ]

  const startScanner = () => {
    setPage("scanner")
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false)
      scanner.render(
        (decodedText) => {
          setResult(decodedText)
          scanner.clear()
        },
        () => {}
      )
    }, 100)
  }

  const envoyerNotification = async (title, body) => {
    try {
      await LocalNotifications.schedule({
        notifications: [{
          title,
          body,
          id: Date.now(),
          schedule: { at: new Date(Date.now() + 500) }
        }]
      })
    } catch (error) {
      console.error("Erreur notification :", error)
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    setLoginError("")
    let u = null

    // Compte Agent
    if (loginEmail === "agent@kivana.com" && loginPassword === "Kivana2026") {
      u = {
        name: "Agent Kivana",
        email: "agent@kivana.com",
        id: "KIV-0001",
        org: "Kivana",
        role: "Agent de contrôle des billets"
      }
    }

    // Compte Administrateur
    if (loginEmail === "pagetstudio@gmail.com" && loginPassword === "AAbb11##") {
      u = {
        name: "Paget Studio",
        email: "pagetstudio@gmail.com",
        id: "KIV-ADMIN-0001",
        org: "Kivana",
        role: "Administrateur"
      }
    }

    if (u) {
      setUser(u)
      localStorage.setItem("kivana_user", JSON.stringify(u))
      envoyerNotification("Bienvenue sur Kivana 👋", "Connexion réussie. Bonne utilisation de Kivana !")
      setPage("accueil")
      setLoginEmail("")
      setLoginPassword("")
      setLoginError("")
      return
    }

    setLoginError("Email ou mot de passe incorrect")
  }

  const handleLogout = () => {
    localStorage.removeItem("kivana_user")
    setUser(null)
    setPage("accueil")
    alert("Vous êtes déconnecté")
  }

  const isComptePage = page === "compte" || page.startsWith("compte-")

  return (
    <div className={`app${isComptePage ? " on-compte" : ""}`}>

      {/* Header fixe — masqué uniquement sur les pages compte */}
      {user && !isComptePage && (
        <header className="fixed-header">
          <div className="header-left">
            <h1><FiTag style={{verticalAlign:'middle', marginRight:6}} /> Kivana Scanner</h1>
            <p>Contrôle des billets</p>
          </div>
          <button className="notification-btn" onClick={() => setPage("notifications")}>
            <FiBell size={20} />
          </button>
        </header>
      )}

      <main className="content">

        {/* ===================== LOGIN ===================== */}
        {!user ? (
          <div className="card login-card" style={{maxWidth:420, margin:'40px auto', padding:20}}>
            <div style={{textAlign:'center', marginBottom:12}}>
              <div style={{fontSize:40, color:'#1565FF', display:'flex', justifyContent:'center'}}><FiTag size={42} /></div>
              <h2 style={{margin:'8px 0'}}>Connecter votre compte Kivana</h2>
              <p style={{color:'#666', margin:0}}>Entrez vos identifiants pour accéder à l'application</p>
            </div>
            <form onSubmit={handleLogin} style={{marginTop:16}}>
              <label style={{display:'block', marginBottom:8, fontSize:14}}>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="agent@kivana.com"
                required
                style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #e6e6e6', boxSizing:'border-box'}}
              />
              <label style={{display:'block', margin:'12px 0 8px', fontSize:14}}>Mot de passe</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #e6e6e6', boxSizing:'border-box'}}
              />
              {loginError && <div style={{color:'#b00020', marginTop:12}}>{loginError}</div>}
              <button type="submit" className="primary-btn" style={{width:'100%', marginTop:16, padding:12, borderRadius:8}}>
                Se connecter
              </button>
              <div style={{marginTop:12, color:'#666', fontSize:13}}>
                <div>Comptes de test :</div>
                <div>• agent@kivana.com / Kivana2026 (Agent)</div>
                <div>• pagetstudio@gmail.com / AAbb11## (Administrateur)</div>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* ===================== ACCUEIL ===================== */}
            {page === "accueil" && (
              <>
                <div className="card">
                  <h2>Prêt à scanner ?</h2>
                  <p>Vérifiez rapidement la validité d'un billet.</p>
                  <button className="scanButton" onClick={startScanner}>
                    <FiCamera size={20} style={{verticalAlign:'middle', marginRight:8}} />
                    Scanner un billet
                  </button>
                </div>
                <h2 className="section-title"><FiBarChart2 style={{verticalAlign:'middle', marginRight:7}} />Statistiques</h2>
                <div className="stats">
                  <div><b>{scanHistory.length}</b><span>Scans</span></div>
                  <div><b>{statValide}</b><span>Valides</span></div>
                  <div><b>{statRefuse}</b><span>Refusés</span></div>
                </div>
                <h2 className="section-title"><FiTag style={{verticalAlign:'middle', marginRight:7}} />Actualités Kivana</h2>
                <div className="banner">
                  {banners.map((img, index) => (
                    <img key={index} src={img} alt="Actualité Kivana" />
                  ))}
                </div>
              </>
            )}

            {/* ===================== NOTIFICATIONS ===================== */}
            {page === "notifications" && (
              <div className="card">
                <h2><FiBell size={20} style={{verticalAlign:'middle', marginRight:7}} />Notifications</h2>
                <div className="notification-item"><FiZap size={15} style={{verticalAlign:'middle', marginRight:6, color:'#1565FF'}} /> Bienvenue sur Kivana Scanner</div>
                <div className="notification-item"><FiCheckCircle size={15} style={{verticalAlign:'middle', marginRight:6, color:'#34c759'}} /> Votre système de contrôle est opérationnel</div>
                <div className="notification-item"><FiMessageCircle size={15} style={{verticalAlign:'middle', marginRight:6, color:'#8e8e93'}} /> Aucune nouvelle notification</div>
                <button className="scanButton" onClick={() => setPage("accueil")}>Retour</button>
              </div>
            )}

            {/* ===================== SCANNER ===================== */}
            {page === "scanner" && (
              <div className="card">
                <h2><FiCamera size={20} style={{verticalAlign:'middle', marginRight:7}} />Scanner QR</h2>
                <div id="reader"></div>
                {result && <p className="result">Résultat : {result}</p>}
              </div>
            )}

            {/* ===================== HISTORIQUE ===================== */}
            {page === "historique" && (
              <div className="hist-screen">

                {/* ── Sticky header ── */}
                <div className="hist-header">
                  <div className="hist-header-top">
                    <h1>Historique</h1>
                  </div>
                  <p className="hist-header-sub">{scanHistory.length} scan{scanHistory.length !== 1 ? "s" : ""} enregistré{scanHistory.length !== 1 ? "s" : ""}</p>

                  {/* Search */}
                  <div className="hist-search-wrap">
                    <span className="hist-search-icon"><FiSearch size={15} /></span>
                    <input
                      className="hist-search-input"
                      type="text"
                      placeholder="Rechercher un billet, événement…"
                      value={histSearch}
                      onChange={e => setHistSearch(e.target.value)}
                    />
                    {histSearch && (
                      <button className="hist-search-clear" onClick={() => setHistSearch("")}>
                        <FiX size={11} />
                      </button>
                    )}
                  </div>

                  {/* Filters */}
                  <div className="hist-filters">
                    {[
                      { key:"tous",    label:"Tous",     color:"#1565FF" },
                      { key:"valide",  label:"Valides",  color:"#34c759" },
                      { key:"refuse",  label:"Refusés",  color:"#ff3b30" },
                      { key:"doublon", label:"Doublons", color:"#ff9500" },
                    ].map(f => (
                      <button
                        key={f.key}
                        className={`hist-filter-chip${histFilter === f.key ? ` active-${f.key}` : ""}`}
                        onClick={() => setHistFilter(f.key)}
                      >
                        {histFilter !== f.key && (
                          <span className="hist-filter-dot" style={{ background: f.color }} />
                        )}
                        {f.label}
                        <span style={{ fontWeight:400, opacity:0.7, fontSize:12 }}>
                          {" "}({scanHistory.filter(s => f.key === "tous" || s.status === f.key).length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Stats row ── */}
                <div className="hist-stats">
                  <div className="hist-stat-card">
                    <span className="hist-stat-num blue">{scanHistory.length}</span>
                    <span className="hist-stat-label">Total</span>
                  </div>
                  <div className="hist-stat-card">
                    <span className="hist-stat-num green">{statValide}</span>
                    <span className="hist-stat-label">Valides</span>
                  </div>
                  <div className="hist-stat-card">
                    <span className="hist-stat-num red">{statRefuse}</span>
                    <span className="hist-stat-label">Refusés</span>
                  </div>
                </div>

                {/* ── Scan list ── */}
                <div className="hist-list">
                  {filteredScans.length === 0 ? (
                    <div className="hist-empty">
                      <div className="hist-empty-icon">
                        <BsClockHistory size={36} />
                      </div>
                      <h3>Aucun résultat</h3>
                      <p>{histSearch ? "Aucun scan ne correspond à votre recherche." : "Aucun scan dans cette catégorie."}</p>
                    </div>
                  ) : (
                    histGroups.map(group => (
                      <div key={group.label}>
                        <div className="hist-group-label">{group.label}</div>
                        {group.items.map(scan => {
                          const statusLabel = { valide:"Valide", refuse:"Refusé", doublon:"Doublon" }[scan.status]
                          const StatusIcon = { valide: FiCheckCircle, refuse: FiAlertCircle, doublon: FiRefreshCw }[scan.status]
                          return (
                            <div key={scan.id} className="hist-item" onClick={() => setHistDetail(scan)}>
                              <div className={`hist-item-bar ${scan.status}`} />
                              <div className="hist-item-body">
                                <div className="hist-item-row1">
                                  <span className="hist-item-event">{scan.event}</span>
                                  <span className={`hist-item-badge ${scan.status}`}>
                                    <StatusIcon size={11} />
                                    {statusLabel}
                                  </span>
                                </div>
                                <div className="hist-item-row2">
                                  <span className="hist-item-ticket">{scan.ticketId}</span>
                                  <span className="hist-item-time">
                                    <FiClock size={11} />
                                    {formatTime(scan.scanTime)}
                                  </span>
                                </div>
                              </div>
                              <span className="hist-item-chevron"><FiChevronRight size={16} /></span>
                            </div>
                          )
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* ── Detail sheet ── */}
                {histDetail && (
                  <div className="hist-detail-overlay" onClick={e => { if (e.target === e.currentTarget) setHistDetail(null) }}>
                    <div className="hist-detail-sheet">
                      <div className="hist-detail-handle" />
                      <div className="hist-detail-header">
                        <h2>Détail du scan</h2>
                        <button className="hist-detail-close" onClick={() => setHistDetail(null)}>
                          <FiX size={14} />
                        </button>
                      </div>

                      {/* Status banner */}
                      <div className={`hist-detail-status-banner ${histDetail.status}`}>
                        <div className="hist-detail-status-icon">
                          { histDetail.status === "valide"  && <FiCheckCircle size={24} /> }
                          { histDetail.status === "refuse"  && <FiAlertCircle size={24} /> }
                          { histDetail.status === "doublon" && <FiRefreshCw size={24} /> }
                        </div>
                        <div className="hist-detail-status-text">
                          <strong>
                            { histDetail.status === "valide"  && "Billet valide" }
                            { histDetail.status === "refuse"  && "Billet refusé" }
                            { histDetail.status === "doublon" && "Doublon détecté" }
                          </strong>
                          <span>Scanné le {formatDateTime(histDetail.scanTime)}</span>
                        </div>
                      </div>

                      {/* Ticket info */}
                      <div className="hist-detail-section">
                        <div className="hist-detail-section-title">Informations du billet</div>
                        <div className="hist-detail-row">
                          <div className="hist-detail-row-icon"><FiHash size={15} /></div>
                          <div className="hist-detail-row-content">
                            <span className="hist-detail-row-label">Identifiant ticket</span>
                            <span className="hist-detail-row-value mono">{histDetail.ticketId}</span>
                          </div>
                        </div>
                        <div className="hist-detail-row">
                          <div className="hist-detail-row-icon"><FiTag size={15} /></div>
                          <div className="hist-detail-row-content">
                            <span className="hist-detail-row-label">Événement</span>
                            <span className="hist-detail-row-value">{histDetail.event}</span>
                          </div>
                        </div>
                        <div className="hist-detail-row">
                          <div className="hist-detail-row-icon"><FiMapPin size={15} /></div>
                          <div className="hist-detail-row-content">
                            <span className="hist-detail-row-label">Lieu</span>
                            <span className="hist-detail-row-value">{histDetail.location}</span>
                          </div>
                        </div>
                        <div className="hist-detail-row">
                          <div className="hist-detail-row-icon"><FiUserIcon size={15} /></div>
                          <div className="hist-detail-row-content">
                            <span className="hist-detail-row-label">Porteur du billet</span>
                            <span className="hist-detail-row-value">{histDetail.holder}</span>
                          </div>
                        </div>
                        <div className="hist-detail-row">
                          <div className="hist-detail-row-icon"><FiTrendingUp size={15} /></div>
                          <div className="hist-detail-row-content">
                            <span className="hist-detail-row-label">Zone</span>
                            <span className="hist-detail-row-value">{histDetail.zone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Scan info */}
                      <div className="hist-detail-section">
                        <div className="hist-detail-section-title">Informations de scan</div>
                        <div className="hist-detail-row">
                          <div className="hist-detail-row-icon"><FiCalendar size={15} /></div>
                          <div className="hist-detail-row-content">
                            <span className="hist-detail-row-label">Date et heure</span>
                            <span className="hist-detail-row-value">{formatDateTime(histDetail.scanTime)}</span>
                          </div>
                        </div>
                        <div className="hist-detail-row">
                          <div className="hist-detail-row-icon"><FiMapPin size={15} /></div>
                          <div className="hist-detail-row-content">
                            <span className="hist-detail-row-label">Point d'entrée</span>
                            <span className="hist-detail-row-value">{histDetail.gate}</span>
                          </div>
                        </div>
                        <div className="hist-detail-row">
                          <div className="hist-detail-row-icon"><FiUserIcon size={15} /></div>
                          <div className="hist-detail-row-content">
                            <span className="hist-detail-row-label">Agent</span>
                            <span className="hist-detail-row-value">{histDetail.agentId}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ============================================================
                COMPTE PRINCIPAL
                ============================================================ */}
            {page === "compte" && (
              <div className="account-screen">

                {/* ── HEADER BLEU STICKY ── */}
                <div className="acc-header">
                  {/* Topbar */}
                  <div className="acc-header-topbar">
                    <span className="acc-header-title">Compte</span>
                    <button className="acc-bell-btn" onClick={() => setPage("notifications")}>
                      <FiBell size={19} />
                      <span className="acc-bell-badge">3</span>
                    </button>
                  </div>

                  {/* Profil */}
                  <div className="acc-profile-row">
                    <div className="acc-avatar">
                      <FiUser size={36} color="rgba(255,255,255,0.9)" />
                    </div>
                    <div className="acc-profile-info">
                      <div className="acc-profile-name">{user?.name || "Agent Kivana"}</div>
                      <div className="acc-profile-email">{user?.email || "agent@kivana.com"}</div>
                      <div className="acc-active-badge">
                        <span className="acc-active-dot" />
                        Agent actif
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── LISTE PRINCIPALE ── */}
                <div className="acc-body">

                  {/* Section : Mon compte */}
                  <div className="acc-card acc-list-card">
                    <div className="acc-list-row" onClick={() => setPage("compte-edit")}>
                      <span className="acc-list-ico acc-ico-blue"><FiUser size={17} /></span>
                      <span className="acc-list-label">Modifier le profil</span>
                      <FiChevronRight className="acc-row-chevron" />
                    </div>
                    <div className="acc-row-sep" />
                    <div className="acc-list-row" onClick={() => setPage("compte-password")}>
                      <span className="acc-list-ico acc-ico-blue"><FiLock size={17} /></span>
                      <span className="acc-list-label">Modifier le mot de passe</span>
                      <FiChevronRight className="acc-row-chevron" />
                    </div>
                  </div>

                  {/* Section : Application */}
                  <div className="acc-card acc-list-card" style={{marginTop: '12px'}}>
                    <div className="acc-list-row" onClick={() => setPage("compte-about")}>
                      <span className="acc-list-ico acc-ico-blue"><FiTag size={17} /></span>
                      <span className="acc-list-label">Application Kivana Scanner</span>
                      <span className="acc-list-val">Version 1.0.0</span>
                      <FiChevronRight className="acc-row-chevron" />
                    </div>
                    <div className="acc-row-sep" />
                    <div className="acc-list-row" onClick={() => setPage("compte-cgu")}>
                      <span className="acc-list-ico acc-ico-blue"><FiFileText size={17} /></span>
                      <span className="acc-list-label">Conditions d'utilisation</span>
                      <FiChevronRight className="acc-row-chevron" />
                    </div>
                    <div className="acc-row-sep" />
                    <div className="acc-list-row" onClick={() => setPage("compte-privacy")}>
                      <span className="acc-list-ico acc-ico-blue"><FiShield size={17} /></span>
                      <span className="acc-list-label">Politique de confidentialité</span>
                      <FiChevronRight className="acc-row-chevron" />
                    </div>
                  </div>

                  {/* Déconnexion */}
                  <div className="acc-card acc-list-card acc-logout-card" onClick={handleLogout}>
                    <div className="acc-list-row acc-list-row-danger">
                      <span className="acc-list-ico acc-ico-red"><FiLogOut size={17} /></span>
                      <span className="acc-list-label acc-label-danger">Déconnexion</span>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ============================================================
                SOUS-PAGES COMPTE
                ============================================================ */}

            {/* Modifier le profil */}
            {page === "compte-edit" && (
              <div className="acc-subpage">
                <div className="acc-sub-header">
                  <button className="acc-back-btn" onClick={() => setPage("compte")}>
                    <FiChevronLeft size={22} />
                  </button>
                  <span className="acc-sub-title">Modifier le profil</span>
                  <div style={{width:38}} />
                </div>

                <div className="acc-sub-avatar-block">
                  <div className="acc-sub-avatar">
                    <FiUser size={44} color="rgba(255,255,255,0.9)" />
                  </div>
                  <button className="acc-sub-avatar-edit">Modifier la photo</button>
                </div>

                <div className="acc-card" style={{margin:'0 16px'}}>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    alert('Profil mis à jour (simulation)')
                    setPage('compte')
                  }}>
                    <div className="acc-form-group">
                      <label className="acc-form-label">Nom complet</label>
                      <input type="text" className="acc-form-input" defaultValue={user?.name || ''} placeholder="Votre nom" />
                    </div>
                    <div className="acc-row-sep" />
                    <div className="acc-form-group">
                      <label className="acc-form-label">Adresse email</label>
                      <input type="email" className="acc-form-input" defaultValue={user?.email || ''} placeholder="votre@email.com" />
                    </div>
                    <div className="acc-row-sep" />
                    <div className="acc-form-group">
                      <label className="acc-form-label">Organisation</label>
                      <input type="text" className="acc-form-input" defaultValue={user?.org || ''} readOnly style={{color:'#94a3b8'}} />
                    </div>
                    <button type="submit" className="acc-save-btn">Enregistrer les modifications</button>
                  </form>
                </div>
              </div>
            )}

            {/* Mot de passe */}
            {page === "compte-password" && (
              <div className="acc-subpage">
                <div className="acc-sub-header">
                  <button className="acc-back-btn" onClick={() => setPage("compte")}>
                    <FiChevronLeft size={22} />
                  </button>
                  <span className="acc-sub-title">Mot de passe</span>
                  <div style={{width:38}} />
                </div>

                <div className="acc-sub-info-card">
                  <FiLock size={30} color="#1565FF" />
                  <p>Choisissez un mot de passe fort d'au moins 8 caractères avec des chiffres et des symboles.</p>
                </div>

                <div className="acc-card" style={{margin:'0 16px'}}>
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    alert('Mot de passe mis à jour (simulation)')
                    setPage('compte')
                  }}>
                    <div className="acc-form-group">
                      <label className="acc-form-label">Mot de passe actuel</label>
                      <input type="password" className="acc-form-input" placeholder="••••••••" />
                    </div>
                    <div className="acc-row-sep" />
                    <div className="acc-form-group">
                      <label className="acc-form-label">Nouveau mot de passe</label>
                      <input type="password" className="acc-form-input" placeholder="••••••••" />
                    </div>
                    <div className="acc-row-sep" />
                    <div className="acc-form-group">
                      <label className="acc-form-label">Confirmer le nouveau mot de passe</label>
                      <input type="password" className="acc-form-input" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="acc-save-btn">Mettre à jour</button>
                  </form>
                </div>
              </div>
            )}

            {/* Appareils connectés */}
            {page === "compte-devices" && (
              <div className="acc-subpage">
                <div className="acc-sub-header">
                  <button className="acc-back-btn" onClick={() => setPage("compte")}>
                    <FiChevronLeft size={22} />
                  </button>
                  <span className="acc-sub-title">Appareils connectés</span>
                  <div style={{width:38}} />
                </div>

                <p className="acc-sub-desc">2 appareils actifs sur votre compte</p>

                <div className="acc-card" style={{margin:'0 16px'}}>
                  <div className="acc-device-row">
                    <div className="acc-device-icon blue">
                      <FiSmartphone size={22} color="#1565FF" />
                    </div>
                    <div className="acc-device-info">
                      <strong>iPhone 15 Pro</strong>
                      <span>Appareil actuel · iOS 17.4</span>
                      <span className="acc-device-status active">● Actif maintenant</span>
                    </div>
                  </div>
                  <div className="acc-row-sep" />
                  <div className="acc-device-row">
                    <div className="acc-device-icon">
                      <FiMonitor size={22} color="#475569" />
                    </div>
                    <div className="acc-device-info">
                      <strong>MacBook Pro</strong>
                      <span>macOS Sonoma · Chrome</span>
                      <span className="acc-device-status">Il y a 2 jours</span>
                    </div>
                    <button className="acc-device-disconnect">Retirer</button>
                  </div>
                </div>
              </div>
            )}

            {/* Préférences de notifications */}
            {page === "compte-notif" && (
              <div className="acc-subpage">
                <div className="acc-sub-header">
                  <button className="acc-back-btn" onClick={() => setPage("compte")}>
                    <FiChevronLeft size={22} />
                  </button>
                  <span className="acc-sub-title">Notifications</span>
                  <div style={{width:38}} />
                </div>

                <p className="acc-sub-desc">Gérez vos préférences de notifications</p>

                <div className="acc-section" style={{padding:'0 16px'}}>
                  <div className="acc-card">
                    <div className="acc-toggle-row">
                      <span className="acc-row-ico"><FiBell size={16} /></span>
                      <div className="acc-toggle-info">
                        <strong>Notifications push</strong>
                        <span>Alertes en temps réel</span>
                      </div>
                      <button className={`acc-toggle${notifPush ? " on" : ""}`} onClick={() => setNotifPush(!notifPush)}>
                        <span className="acc-toggle-thumb" />
                      </button>
                    </div>
                    <div className="acc-row-sep" />
                    <div className="acc-toggle-row">
                      <span className="acc-row-ico"><FiFileText size={16} /></span>
                      <div className="acc-toggle-info">
                        <strong>Notifications email</strong>
                        <span>Résumés et rapports</span>
                      </div>
                      <button className={`acc-toggle${notifEmail ? " on" : ""}`} onClick={() => setNotifEmail(!notifEmail)}>
                        <span className="acc-toggle-thumb" />
                      </button>
                    </div>
                    <div className="acc-row-sep" />
                    <div className="acc-toggle-row">
                      <span className="acc-row-ico"><FiSettings size={16} /></span>
                      <div className="acc-toggle-info">
                        <strong>Rappels de scan</strong>
                        <span>Rappels d'activité quotidiens</span>
                      </div>
                      <button className={`acc-toggle${notifRappel ? " on" : ""}`} onClick={() => setNotifRappel(!notifRappel)}>
                        <span className="acc-toggle-thumb" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Apparence */}
            {page === "compte-appearance" && (
              <div className="acc-subpage">
                <div className="acc-sub-header">
                  <button className="acc-back-btn" onClick={() => setPage("compte")}>
                    <FiChevronLeft size={22} />
                  </button>
                  <span className="acc-sub-title">Apparence</span>
                  <div style={{width:38}} />
                </div>

                <p className="acc-sub-desc">Choisissez votre thème préféré</p>

                <div className="acc-section" style={{padding:'0 16px'}}>
                  <div className="acc-card">
                    {[
                      { id:"clair",   label:"Thème clair",  desc:"Interface lumineuse",           icon:<FiSun size={17} /> },
                      { id:"sombre",  label:"Thème sombre", desc:"Interface sombre",               icon:<FiMoon size={17} /> },
                      { id:"systeme", label:"Système",      desc:"Suit les préférences système",   icon:<FiSettings size={17} /> }
                    ].map((t, i) => (
                      <div key={t.id}>
                        {i > 0 && <div className="acc-row-sep" />}
                        <div className="acc-theme-row" onClick={() => setTheme(t.id)}>
                          <span className="acc-row-ico">{t.icon}</span>
                          <div className="acc-toggle-info">
                            <strong>{t.label}</strong>
                            <span>{t.desc}</span>
                          </div>
                          {theme === t.id && (
                            <span className="acc-theme-check">
                              <FiCheck size={17} color="#1565FF" strokeWidth={2.5} />
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* À propos — app */}
            {page === "compte-about" && (
              <div className="acc-subpage">
                <div className="acc-sub-header">
                  <button className="acc-back-btn" onClick={() => setPage("compte")}>
                    <FiChevronLeft size={22} />
                  </button>
                  <span className="acc-sub-title">À propos</span>
                  <div style={{width:38}} />
                </div>

                <div className="acc-about-hero">
                  <div className="acc-about-icon"><FiTag size={52} color="#1565FF" /></div>
                  <div className="acc-about-name">Kivana Scanner</div>
                  <div className="acc-about-version">Version 1.0.0</div>
                </div>

                <div className="acc-section" style={{padding:'0 16px'}}>
                  <div className="acc-card">
                    <div className="acc-row">
                      <span className="acc-row-ico"><FiSmartphone size={16} /></span>
                      <span className="acc-row-label">Version</span>
                      <span className="acc-row-val">1.0.0</span>
                    </div>
                    <div className="acc-row-sep" />
                    <div className="acc-row">
                      <span className="acc-row-ico"><FiInfo size={16} /></span>
                      <span className="acc-row-label">Développeur</span>
                      <span className="acc-row-val">Kivana</span>
                    </div>
                    <div className="acc-row-sep" />
                    <div className="acc-row">
                      <span className="acc-row-ico"><FiSettings size={16} /></span>
                      <span className="acc-row-label">Plateforme</span>
                      <span className="acc-row-val">iOS / Android / Web</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conditions d'utilisation */}
            {page === "compte-cgu" && (
              <div className="acc-subpage">
                <div className="acc-sub-header">
                  <button className="acc-back-btn" onClick={() => setPage("compte")}>
                    <FiChevronLeft size={22} />
                  </button>
                  <span className="acc-sub-title">Conditions d'utilisation</span>
                  <div style={{width:38}} />
                </div>
                <div className="acc-card acc-legal-card" style={{margin:'16px 16px 0'}}>
                  <h3>Conditions générales d'utilisation</h3>
                  <p><strong>Dernière mise à jour :</strong> Juillet 2025</p>
                  <p>En utilisant l'application Kivana Scanner, vous acceptez les présentes conditions. Cette application est réservée aux agents autorisés par Kivana pour le contrôle des billets lors d'événements.</p>
                  <h4>Utilisation autorisée</h4>
                  <p>L'application est destinée exclusivement au contrôle de billets lors d'événements Kivana. Toute utilisation à d'autres fins est strictement interdite.</p>
                  <h4>Responsabilités</h4>
                  <p>L'utilisateur est responsable de la confidentialité de ses identifiants. Toute activité depuis votre compte relève de votre responsabilité.</p>
                  <h4>Contact</h4>
                  <p>Pour toute question : support@kivana.com</p>
                </div>
              </div>
            )}

            {/* Politique de confidentialité */}
            {page === "compte-privacy" && (
              <div className="acc-subpage">
                <div className="acc-sub-header">
                  <button className="acc-back-btn" onClick={() => setPage("compte")}>
                    <FiChevronLeft size={22} />
                  </button>
                  <span className="acc-sub-title">Confidentialité</span>
                  <div style={{width:38}} />
                </div>
                <div className="acc-card acc-legal-card" style={{margin:'16px 16px 0'}}>
                  <h3>Politique de confidentialité</h3>
                  <p><strong>Dernière mise à jour :</strong> Juillet 2025</p>
                  <p>Kivana s'engage à protéger vos données personnelles conformément au RGPD et aux réglementations en vigueur.</p>
                  <h4>Données collectées</h4>
                  <p>Nous collectons uniquement les données nécessaires : identifiant agent, historique de scans, préférences d'application.</p>
                  <h4>Utilisation des données</h4>
                  <p>Vos données sont utilisées uniquement pour la gestion des contrôles de billets et ne sont jamais vendues à des tiers.</p>
                  <h4>Vos droits</h4>
                  <p>Vous disposez d'un droit d'accès, de rectification et de suppression. Contactez privacy@kivana.com pour exercer ces droits.</p>
                </div>
              </div>
            )}

          </>
        )}
      </main>

      {/* Navigation visible uniquement si connecté */}
      {user && (
        <nav className="bottom-nav">
          {/* Pill bleue animée */}
          <div
            className="nav-pill"
            style={{
              left: `calc(${
                page === "accueil" ? 0
                : page === "scanner" ? 1
                : page === "historique" ? 2
                : 3
              } * 25% + 6px)`
            }}
          />
          <button className={page === "accueil" ? "nav-active" : ""} onClick={() => setPage("accueil")}>
            <img src="/nav-icons/home.png" className="nav-icon-img" alt="Accueil" />
            <span>Accueil</span>
          </button>
          <button className={page === "scanner" ? "nav-active" : ""} onClick={startScanner}>
            <img src="/nav-icons/scanner.png" className="nav-icon-img" alt="Scanner" />
            <span>Scanner</span>
          </button>
          <button className={page === "historique" ? "nav-active" : ""} onClick={() => setPage("historique")}>
            <img src="/nav-icons/history.png" className="nav-icon-img" alt="Historique" />
            <span>Historique</span>
          </button>
          <button className={isComptePage ? "nav-active" : ""} onClick={() => setPage("compte")}>
            <img src="/nav-icons/compte.png" className="nav-icon-img" alt="Compte" />
            <span>Compte</span>
          </button>
        </nav>
      )}

    </div>
  )
}

export default App
