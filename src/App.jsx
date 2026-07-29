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
  FiSettings,
  FiMoon,
  FiInfo,
  FiFileText,
  FiChevronRight,
  FiLogOut,
  FiEdit3
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
  // Auth state: utilisateur courant (préparé pour supabase ultérieurement)
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

  const banners = [
    "https://res.cloudinary.com/fa719lho/image/upload/v1784366939/Bloum-Cash-1-1_e0rlfv.jpg",
    "https://res.cloudinary.com/fa719lho/image/upload/f_auto,q_auto/Plan_de_travail_5-1_zqbvpl",
    "https://res.cloudinary.com/fa719lho/image/upload/v1784367054/Bloum-Cash-2-1_w7der7.jpg"
  ]

  const startScanner = () => {
    setPage("scanner")

    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: 250
        },
        false
      )

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
      notifications: [
        {
          title,
          body,
          id: Date.now(),
          schedule: {
            at: new Date(Date.now() + 500)
          }
        }
      ]
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
  if (
    loginEmail === "agent@kivana.com" &&
    loginPassword === "Kivana2026"
  ) {
    u = {
      name: "Agent Kivana",
      email: "agent@kivana.com",
      id: "KIV-0001",
      org: "Kivana",
      role: "Agent de contrôle des billets"
    }
  }

  // Compte Administrateur
  if (
    loginEmail === "pagetstudio@gmail.com" &&
    loginPassword === "AAbb11##"
  ) {
    u = {
      name: "Paget Studio",
      email: "pagetstudio@gmail.com",
      id: "KIV-ADMIN-0001",
      org: "Kivana",
      role: "Administrateur"
    }
  }

  // Connexion réussie
  if (u) {
    setUser(u)
    localStorage.setItem("kivana_user", JSON.stringify(u))

    envoyerNotification(
      "Bienvenue sur Kivana 👋",
      "Connexion réussie. Bonne utilisation de Kivana !"
    )

    setPage("accueil")
    setLoginEmail("")
    setLoginPassword("")
    setLoginError("")
    return
  }

  // Connexion incorrecte
  setLoginError("Email ou mot de passe incorrect")
}
  const handleLogout = () => {
    localStorage.removeItem("kivana_user")
    setUser(null)
    setPage("accueil")
    alert("Vous êtes déconnecté")
  }

  return (
    <div className="app">

      {/* Header visible uniquement si connecté */}
      {user && (
        <header className="fixed-header">
          <div className="header-left">
            <h1>🎟️ Kivana Scanner</h1>
            <p>Contrôle des billets</p>
          </div>

          <button
            className="notification-btn"
            onClick={() => setPage("notifications")}
          >
            🔔
          </button>
        </header>
      )}


      <main className="content">

        {/* Si pas connecté, afficher uniquement la page d'accès */}
        {!user ? (
          <div className="card login-card" style={{maxWidth:420, margin:'40px auto', padding:20}}>
            <div style={{textAlign:'center', marginBottom:12}}>
              <div style={{fontSize:40}}>🎟️</div>
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

              {loginError && (
                <div style={{color:'#b00020', marginTop:12}}>{loginError}</div>
              )}

              <button
                type="submit"
                className="primary-btn"
                style={{width:'100%', marginTop:16, padding:12, borderRadius:8}}
              >
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

          /* Contenu de l'application lorsque connecté */
          <>
            {page === "accueil" && (
              <>
                <div className="card">
                  <h2>Prêt à scanner ?</h2>
                  <p>Vérifiez rapidement la validité d'un billet.</p>

                  <button
                    className="scanButton"
                    onClick={startScanner}
                  >
                    📷 Scanner un billet
                  </button>
                </div>


                <h2 className="section-title">
                  📊 Statistiques
                </h2>

                <div className="stats">
                  <div>
                    <b>0</b>
                    <span>Scans</span>
                  </div>

                  <div>
                    <b>0</b>
                    <span>Valides</span>
                  </div>

                  <div>
                    <b>0</b>
                    <span>Refusés</span>
                  </div>
                </div>


                <h2 className="section-title">
                  🎟️ Actualités Kivana
                </h2>

                <div className="banner">
                  {banners.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="Actualité Kivana"
                    />
                  ))}
                </div>
              </>
            )}


            {page === "notifications" && (
              <div className="card">
                <h2>🔔 Notifications</h2>

                <div className="notification-item">
                  🚀 Bienvenue sur Kivana Scanner
                </div>

                <div className="notification-item">
                  ✅ Votre système de contrôle est opérationnel
                </div>

                <div className="notification-item">
                  📢 Aucune nouvelle notification
                </div>

                <button
                  className="scanButton"
                  onClick={() => setPage("accueil")}
                >
                  Retour
                </button>
              </div>
            )}


            {page === "scanner" && (
              <div className="card">
                <h2>📷 Scanner QR</h2>
                <div id="reader"></div>

                {result && (
                  <p className="result">
                    Résultat : {result}
                  </p>
                )}
              </div>
            )}


            {page === "historique" && (
              <div className="card">
                <h2>📋 Historique</h2>
                <p>Aucun scan pour le moment.</p>
              </div>
            )}


            {/* === ONGLET COMPTE & SOUS-PAGES === */}
            {page === "compte" && (
  <div className="account-screen">

    <div className="account-header">
      <div>
        <span className="account-eyebrow">ESPACE PERSONNEL</span>
        <h2>Mon compte</h2>
        <p>Gérez votre profil et vos préférences</p>
      </div>

      <button
        className="account-notification-btn"
        aria-label="Notifications"
        onClick={() => setPage("notifications")}
      >
        <FiBell size={21} />
        <span className="notification-dot" />
      </button>
    </div>

    {/* PROFIL */}
    <div className="profile-card">
      <div className="profile-card-glow" />

      <div className="profile-main">

        <div className="profile-avatar">
          <FiUser size={30} />
        </div>

        <div className="profile-info">
          <div className="profile-name">
            {user?.name || "Agent Kivana"}
          </div>

          <div className="profile-email">
            {user?.email || "agent@kivana.com"}
          </div>

          <div className="profile-status">
            <span className="status-indicator" />
            Compte actif
          </div>
        </div>

        <button
          className="profile-edit-btn"
          onClick={() => setPage("compte-edit")}
          aria-label="Modifier le profil"
        >
          <FiEdit3 size={17} />
        </button>

      </div>

      <div className="profile-divider" />

      <div className="profile-meta">

        <div className="profile-meta-item">
          <span>ID AGENT</span>
          <strong>{user?.id || "KIV-0001"}</strong>
        </div>

        <div className="profile-meta-separator" />

        <div className="profile-meta-item">
          <span>ORGANISATION</span>
          <strong>{user?.org || "Kivana"}</strong>
        </div>

      </div>
    </div>

    {/* INFORMATIONS */}
    <div className="account-section">
      <div className="account-section-title">
        <span className="section-title-icon blue">
          <FiUser size={17} />
        </span>
        <span>Informations</span>
      </div>

      <div className="account-list">

        <div
          className="account-row"
          onClick={() => setPage("compte-edit")}
        >
          <div className="row-icon blue">
            <FiUser />
          </div>

          <div className="row-content">
            <strong>Nom de l'agent</strong>
            <span>{user?.name || "Agent Kivana"}</span>
          </div>

          <FiChevronRight className="row-chevron" />
        </div>

        <div className="account-row">
          <div className="row-icon purple">
            <FiCreditCard />
          </div>

          <div className="row-content">
            <strong>ID Agent</strong>
            <span>{user?.id || "KIV-0001"}</span>
          </div>

          <FiChevronRight className="row-chevron" />
        </div>

        <div className="account-row">
          <div className="row-icon green">
            <FiBriefcase />
          </div>

          <div className="row-content">
            <strong>Organisation</strong>
            <span>{user?.org || "Kivana"}</span>
          </div>

          <FiChevronRight className="row-chevron" />
        </div>

        <div className="account-row">
          <div className="row-icon orange">
            <FiShield />
          </div>

          <div className="row-content">
            <strong>Rôle</strong>
            <span>{user?.role || "Agent de contrôle des billets"}</span>
          </div>

          <FiChevronRight className="row-chevron" />
        </div>

      </div>
    </div>

    {/* SÉCURITÉ */}
    <div className="account-section">
      <div className="account-section-title">
        <span className="section-title-icon green">
          <FiShield size={17} />
        </span>
        <span>Sécurité</span>
      </div>

      <div className="account-list">

        <div
          className="account-row"
          onClick={() => setPage("compte-password")}
        >
          <div className="row-icon red">
            <FiLock />
          </div>

          <div className="row-content">
            <strong>Mot de passe</strong>
            <span>Modifier votre mot de passe</span>
          </div>

          <FiChevronRight className="row-chevron" />
        </div>

        <div
          className="account-row"
          onClick={() => setPage("compte-devices")}
        >
          <div className="row-icon blue">
            <FiSmartphone />
          </div>

          <div className="row-content">
            <strong>Appareils connectés</strong>
            <span>Gérer vos appareils</span>
          </div>

          <div className="row-end">
            <span className="count-badge">2</span>
            <FiChevronRight className="row-chevron" />
          </div>
        </div>

        <div
          className="account-row"
          onClick={() => setPage("compte-notif")}
        >
          <div className="row-icon yellow">
            <FiBell />
          </div>

          <div className="row-content">
            <strong>Notifications</strong>
            <span>Gérer vos préférences</span>
          </div>

          <FiChevronRight className="row-chevron" />
        </div>

      </div>
    </div>

    {/* PRÉFÉRENCES */}
    <div className="account-section">
      <div className="account-section-title">
        <span className="section-title-icon purple">
          <FiSettings size={17} />
        </span>
        <span>Préférences</span>
      </div>

      <div className="account-list">

        <div
          className="account-row"
          onClick={() => setPage("compte-appearance")}
        >
          <div className="row-icon purple">
            <FiMoon />
          </div>

          <div className="row-content">
            <strong>Apparence</strong>
            <span>Thème clair</span>
          </div>

          <FiChevronRight className="row-chevron" />
        </div>

      </div>
    </div>

    {/* À PROPOS */}
    <div className="account-section">
      <div className="account-section-title">
        <span className="section-title-icon gray">
          <FiInfo size={17} />
        </span>
        <span>À propos</span>
      </div>

      <div className="account-list">

        <div
          className="account-row"
          onClick={() => setPage("compte-about")}
        >
          <div className="row-icon blue">
            <FiSmartphone />
          </div>

          <div className="row-content">
            <strong>Kivana Scanner</strong>
            <span>Version 1.0.0</span>
          </div>

          <FiChevronRight className="row-chevron" />
        </div>

        <div className="account-row">
          <div className="row-icon gray">
            <FiFileText />
          </div>

          <div className="row-content">
            <strong>Conditions d'utilisation</strong>
            <span>Consulter les conditions</span>
          </div>

          <FiChevronRight className="row-chevron" />
        </div>

        <div className="account-row">
          <div className="row-icon gray">
            <FiLock />
          </div>

          <div className="row-content">
            <strong>Confidentialité</strong>
            <span>Politique de confidentialité</span>
          </div>

          <FiChevronRight className="row-chevron" />
        </div>

      </div>
    </div>

    {/* DÉCONNEXION */}
    <button
      className="account-logout"
      onClick={handleLogout}
    >
      <FiLogOut size={19} />
      <span>Se déconnecter</span>
    </button>

    <div className="account-footer">
      <span>KIVANA SCANNER</span>
      <span>•</span>
      <span>v1.0.0</span>
    </div>

  </div>
)}
                            {/* sous-pages compte (laissées comme avant, styles améliorées via CSS) */}
            {page === 'compte-edit' && (
  <div className="card form-card">
    <button
      className="ghost-btn"
      onClick={() => setPage('compte')}
    >
      ← Retour
    </button>

    <h2 style={{marginTop: 12}}>Modifier le profil</h2>

    <form
      style={{marginTop: 12}}
      onSubmit={(e) => {
        e.preventDefault()
        alert('Profil mis à jour (simulation)')
        setPage('compte')
      }}
    >
      <label style={{display: 'block', marginTop: 8}}>
        Nom
      </label>

      <input
        type="text"
        defaultValue={user?.name || ''}
        style={{
          width: '100%',
          padding: 10,
          borderRadius: 8,
          border: '1px solid #e6e6e6'
        }}
      />

      <label style={{display: 'block', marginTop: 8}}>
        Email
      </label>

      <input
        type="email"
        defaultValue={user?.email || ''}
        style={{
          width: '100%',
          padding: 10,
          borderRadius: 8,
          border: '1px solid #e6e6e6'
        }}
      />

      <button
        className="primary-btn"
        type="submit"
        style={{marginTop: 12}}
      >
        Enregistrer
      </button>
    </form>
  </div>
)}

          </>
        )}
      </main>

      {/* Navigation visible uniquement si connecté */}
      {user && (
        <nav className="bottom-nav">

          <button onClick={() => setPage("accueil") }>
            🏠
            <span>Accueil</span>
          </button>

          <button onClick={startScanner}>
            📷
            <span>Scanner</span>
          </button>

          <button onClick={() => setPage("historique") }>
            📋
            <span>Historique</span>
          </button>

          <button onClick={() => setPage("compte") }>
            👤
            <span>Compte</span>
          </button>

        </nav>
      )}

    </div>
  )
}

export default App
