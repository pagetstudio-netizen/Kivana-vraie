import "./styles/compte.css"
import { useState, useEffect } from "react"
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
  FiTag
} from "react-icons/fi"

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

      {/* Header fixe — masqué sur les pages compte */}
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
                  <div><b>0</b><span>Scans</span></div>
                  <div><b>0</b><span>Valides</span></div>
                  <div><b>0</b><span>Refusés</span></div>
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
              <div className="card">
                <h2><FiClipboard size={20} style={{verticalAlign:'middle', marginRight:7}} />Historique</h2>
                <p>Aucun scan pour le moment.</p>
              </div>
            )}

            {/* ============================================================
                COMPTE PRINCIPAL
                ============================================================ */}
            {page === "compte" && (
              <div className="account-screen">

                {/* ── HEADER BLEU ── */}
                <div className="acc-header">
                  <div className="acc-header-topbar">
                    <span className="acc-header-title">Compte</span>
                    <button className="acc-bell-btn" onClick={() => setPage("notifications")}>
                      <FiBell size={19} />
                      <span className="acc-bell-badge">3</span>
                    </button>
                  </div>

                  <div className="acc-profile-row">
                    <div className="acc-avatar">
                      <FiUser size={40} color="rgba(255,255,255,0.85)" />
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

                  <div className="acc-meta-bar">
                    <div className="acc-meta-item">
                      <span className="acc-meta-label">ID Agent</span>
                      <strong className="acc-meta-value">{user?.id || "KIV-0001"}</strong>
                    </div>
                    <div className="acc-meta-divider" />
                    <div className="acc-meta-item">
                      <span className="acc-meta-label">Organisation</span>
                      <strong className="acc-meta-value">{user?.org || "Kivana"}</strong>
                    </div>
                  </div>
                </div>

                {/* ── CORPS BLANC ── */}
                <div className="acc-body">

                  {/* Informations */}
                  <div className="acc-section">
                    <div className="acc-section-head">
                      <span className="acc-section-icon"><FiUser size={14} /></span>
                      <span className="acc-section-label">Informations</span>
                    </div>
                    <div className="acc-card">
                      <div className="acc-row" onClick={() => setPage("compte-edit")}>
                        <span className="acc-row-ico"><FiUser size={16} /></span>
                        <span className="acc-row-label">Nom de l'agent</span>
                        <span className="acc-row-val">{user?.name || "Agent Kivana"}</span>
                        <FiChevronRight className="acc-row-chevron" />
                      </div>
                      <div className="acc-row-sep" />
                      <div className="acc-row">
                        <span className="acc-row-ico"><FiCreditCard size={16} /></span>
                        <span className="acc-row-label">ID Agent</span>
                        <span className="acc-row-val">{user?.id || "KIV-0001"}</span>
                        <FiChevronRight className="acc-row-chevron" />
                      </div>
                      <div className="acc-row-sep" />
                      <div className="acc-row">
                        <span className="acc-row-ico"><FiBriefcase size={16} /></span>
                        <span className="acc-row-label">Organisation</span>
                        <span className="acc-row-val">{user?.org || "Kivana"}</span>
                        <FiChevronRight className="acc-row-chevron" />
                      </div>
                      <div className="acc-row-sep" />
                      <div className="acc-row">
                        <span className="acc-row-ico"><FiShield size={16} /></span>
                        <span className="acc-row-label">Rôle</span>
                        <span className="acc-row-val acc-val-sm">{user?.role || "Agent de contrôle des billets"}</span>
                        <FiChevronRight className="acc-row-chevron" />
                      </div>
                    </div>
                  </div>

                  {/* Sécurité */}
                  <div className="acc-section">
                    <div className="acc-section-head">
                      <span className="acc-section-icon"><FiLock size={14} /></span>
                      <span className="acc-section-label">Sécurité</span>
                    </div>
                    <div className="acc-card">
                      <div className="acc-row" onClick={() => setPage("compte-password")}>
                        <span className="acc-row-ico"><FiLock size={16} /></span>
                        <span className="acc-row-label">Modifier le mot de passe</span>
                        <FiChevronRight className="acc-row-chevron" />
                      </div>
                      <div className="acc-row-sep" />
                      <div className="acc-row" onClick={() => setPage("compte-devices")}>
                        <span className="acc-row-ico"><FiSmartphone size={16} /></span>
                        <span className="acc-row-label">Appareils connectés</span>
                        <span className="acc-badge-blue">2</span>
                        <FiChevronRight className="acc-row-chevron" />
                      </div>
                      <div className="acc-row-sep" />
                      <div className="acc-row" onClick={() => setPage("compte-notif")}>
                        <span className="acc-row-ico"><FiBell size={16} /></span>
                        <span className="acc-row-label">Préférences de notifications</span>
                        <FiChevronRight className="acc-row-chevron" />
                      </div>
                    </div>
                  </div>

                  {/* Préférences */}
                  <div className="acc-section">
                    <div className="acc-section-head">
                      <span className="acc-section-icon"><FiSettings size={14} /></span>
                      <span className="acc-section-label">Préférences</span>
                    </div>
                    <div className="acc-card">
                      <div className="acc-row" onClick={() => setPage("compte-appearance")}>
                        <span className="acc-row-ico"><FiSun size={16} /></span>
                        <span className="acc-row-label">Apparence</span>
                        <span className="acc-row-val">Thème clair</span>
                        <FiChevronRight className="acc-row-chevron" />
                      </div>
                    </div>
                  </div>

                  {/* À propos */}
                  <div className="acc-section">
                    <div className="acc-section-head">
                      <span className="acc-section-icon"><FiInfo size={14} /></span>
                      <span className="acc-section-label">À propos</span>
                    </div>
                    <div className="acc-card">
                      <div className="acc-row" onClick={() => setPage("compte-about")}>
                        <span className="acc-row-ico"><FiSmartphone size={16} /></span>
                        <span className="acc-row-label">Application Kivana Scanner</span>
                        <span className="acc-row-val">Version 1.0.0</span>
                        <FiChevronRight className="acc-row-chevron" />
                      </div>
                      <div className="acc-row-sep" />
                      <div className="acc-row" onClick={() => setPage("compte-cgu")}>
                        <span className="acc-row-ico"><FiFileText size={16} /></span>
                        <span className="acc-row-label">Conditions d'utilisation</span>
                        <FiChevronRight className="acc-row-chevron" />
                      </div>
                      <div className="acc-row-sep" />
                      <div className="acc-row" onClick={() => setPage("compte-privacy")}>
                        <span className="acc-row-ico"><FiLock size={16} /></span>
                        <span className="acc-row-label">Politique de confidentialité</span>
                        <FiChevronRight className="acc-row-chevron" />
                      </div>
                    </div>
                  </div>

                  {/* Déconnexion */}
                  <button className="acc-logout-btn" onClick={handleLogout}>
                    <FiLogOut size={17} />
                    <span>Déconnexion</span>
                  </button>

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
          <button className={page === "accueil" ? "nav-active" : ""} onClick={() => setPage("accueil")}>
            <FiHome size={22} />
            <span>Accueil</span>
          </button>
          <button className={page === "scanner" ? "nav-active" : ""} onClick={startScanner}>
            <FiCamera size={22} />
            <span>Scanner</span>
          </button>
          <button className={page === "historique" ? "nav-active" : ""} onClick={() => setPage("historique")}>
            <FiClipboard size={22} />
            <span>Historique</span>
          </button>
          <button className={isComptePage ? "nav-active" : ""} onClick={() => setPage("compte")}>
            <FiUser size={22} />
            <span>Compte</span>
          </button>
        </nav>
      )}

    </div>
  )
}

export default App
