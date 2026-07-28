import { useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import "./App.css"

function App() {
  const [page, setPage] = useState("accueil")
  const [result, setResult] = useState("")

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

  const handleLogin = (e) => {
    e.preventDefault()
    setLoginError("")

    // Comptes de test temporaires (base de données fictive)
    if (loginEmail === "agent@kivana.com" && loginPassword === "Kivana2026") {
      const u = {
        name: "Agent Kivana",
        email: "agent@kivana.com",
        id: "KIV-0001",
        org: "Kivana",
        role: "Agent de contrôle des billets"
      }
      setUser(u)
      localStorage.setItem("kivana_user", JSON.stringify(u))
      setPage("accueil")
      setLoginEmail("")
      setLoginPassword("")
      setLoginError("")
      return
    }

    if (loginEmail === "pagetstudio@gmail.com" && loginPassword === "AAbb11##") {
      const u = {
        name: "Paget Studio",
        email: "pagetstudio@gmail.com",
        id: "KIV-ADMIN-0001",
        org: "Kivana",
        role: "Administrateur"
      }
      setUser(u)
      localStorage.setItem("kivana_user", JSON.stringify(u))
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


            {page === "compte" && (
              <div className="card account-card">
                <div className="account-header" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div className="avatar" style={{width:72, height:72, borderRadius: '50%', background: '#eef2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize:32}}>
                    👤
                  </div>

                  <div style={{flex:1}}>
                    <h2 style={{margin:0}}>{user?.name || 'Agent Kivana'}</h2>
                    <p style={{margin:'4px 0', color:'#666'}}>{user?.email || 'agent@kivana.com'}</p>

                    <div style={{display:'flex', gap:8, alignItems:'center', marginTop:6}}>
                      <span style={{background:'#e6f7ff', color:'#0366d6', padding:'4px 8px', borderRadius:12, fontSize:12}}>Agent actif</span>
                      <span style={{background:'#f0f0f0', padding:'4px 8px', borderRadius:12, fontSize:12}}>ID: {user?.id || 'KIV-0001'}</span>
                    </div>
                  </div>

                  <div style={{textAlign:'right'}}>
                    <button className="primary-btn" onClick={() => alert('Modifier le profil - fonctionnalité non implémentée')}>Modifier le profil</button>
                  </div>
                </div>

                <hr style={{margin:'16px 0', border:'none', borderTop:'1px solid #eee'}} />

                <section className="account-section">
                  <h3>👤 Informations personnelles</h3>
                  <div className="info-list">
                    <div className="info-row">
                      <strong>Nom</strong>
                      <span>{user?.name || 'Agent Kivana'}</span>
                    </div>

                    <div className="info-row">
                      <strong>ID agent</strong>
                      <span>{user?.id || 'KIV-0001'}</span>
                    </div>

                    <div className="info-row">
                      <strong>Organisation</strong>
                      <span>{user?.org || 'Kivana'}</span>
                    </div>
                  </div>
                </section>

                <section className="account-section">
                  <h3>🏢 Organisation</h3>
                  <div className="info-list">
                    <div className="info-row">
                      <strong>Nom</strong>
                      <span>{user?.org || 'Kivana'}</span>
                    </div>

                    <div className="info-row">
                      <strong>Rôle</strong>
                      <span>{user?.role || 'Agent de contrôle des billets'}</span>
                    </div>
                  </div>
                </section>

                <section className="account-section">
                  <h3>🔐 Sécurité</h3>
                  <div className="security-list">
                    <div className="security-row">
                      <span>🔐 Modifier le mot de passe</span>
                      <button className="ghost-btn" onClick={() => alert('Changer le mot de passe - fonctionnalité non implémentée')}>Changer</button>
                    </div>

                    <div className="security-row">
                      <span>📱 Appareils connectés</span>
                      <button className="ghost-btn" onClick={() => alert('Gestion des appareils - fonctionnalité non implémentée')}>Gérer</button>
                    </div>

                    <div className="security-row">
                      <span>🔔 Préférences de notifications</span>
                      <button className="ghost-btn" onClick={() => alert('Préférences de notifications - fonctionnalité non implémentée')}>Modifier</button>
                    </div>
                  </div>
                </section>

                <section className="account-section">
                  <h3>🎨 Application</h3>
                  <div className="info-list">
                    <div className="info-row" style={{alignItems:'center'}}>
                      <strong>Apparence</strong>
                      <div style={{display:'flex', gap:8}}>
                        <label style={{display:'flex', alignItems:'center', gap:6}}><input type="radio" name="theme" defaultChecked /> Clair</label>
                        <label style={{display:'flex', alignItems:'center', gap:6}}><input type="radio" name="theme" /> Sombre</label>
                      </div>
                    </div>

                    <div className="info-row">
                      <strong>À propos</strong>
                      <div style={{textAlign:'right'}}>
                        <div>Version 1.0.0</div>
                        <div>Application Kivana Scanner</div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="account-actions" style={{display:'flex', gap:8, marginTop:16}}>
                  <button className="primary-btn" onClick={() => alert('Modifier le profil - fonctionnalité non implémentée')}>✏️ Modifier le profil</button>
                  <button className="secondary-btn" onClick={() => alert('Changer le mot de passe - fonctionnalité non implémentée')}>🔐 Changer le mot de passe</button>
                  <button className="danger-btn" onClick={handleLogout}>⛔ Déconnexion</button>
                </div>

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
