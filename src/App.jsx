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


            {/* === ONGLET COMPTE & SOUS-PAGES === */}
            {page === "compte" && (
              <div className="account-screen">
                <div className="account-hero">
                  <div className="account-top">
                    <div className="account-title">Compte</div>
                    <button
                      className="hero-notif"
                      aria-label="Notifications"
                      onClick={() => setPage("notifications")}
                    >
                      🔔
                    </button>
                  </div>

                  <div className="account-hero-content">
                    <div className="hero-avatar" aria-hidden>👤</div>

                    <div className="hero-info">
                      <div className="hero-name">{user?.name || "Agent Kivana"}</div>
                      <div className="hero-email">{user?.email || "agent@kivana.com"}</div>
                      <div className="hero-badges">
                        <span className="badge-active">Agent actif</span>
                      </div>
                    </div>
                  </div>

                  <div className="hero-meta">
                    <div className="meta-item">
                      <div className="meta-label">ID Agent</div>
                      <div className="meta-value">{user?.id || "KIV-0001"}</div>
                    </div>

                    <div className="meta-divider" />

                    <div className="meta-item">
                      <div className="meta-label">Organisation</div>
                      <div className="meta-value">{user?.org || "Kivana"}</div>
                    </div>
                  </div>
                </div>

                <div className="account-content">
                  {/* Informations */}
                  <div className="section-card">
                    <div className="section-header"><span className="section-icon">👥</span> Informations</div>

                    <div className="list-row" role="button" onClick={() => setPage("compte-edit")}>
                      <div className="row-left"><span className="row-icon">👤</span> Nom de l'agent</div>
                      <div className="row-right">{user?.name || "Agent Kivana"} <span className="chevron">›</span></div>
                    </div>

                    <div className="list-row">
                      <div className="row-left"><span className="row-icon">🆔</span> ID Agent</div>
                      <div className="row-right">{user?.id || "KIV-0001"} <span className="chevron">›</span></div>
                    </div>

                    <div className="list-row">
                      <div className="row-left"><span className="row-icon">🏢</span> Organisation</div>
                      <div className="row-right">{user?.org || "Kivana"} <span className="chevron">›</span></div>
                    </div>

                    <div className="list-row">
                      <div className="row-left"><span className="row-icon">🧾</span> Rôle</div>
                      <div className="row-right">{user?.role || "Agent de contrôle des billets"} <span className="chevron">›</span></div>
                    </div>

                  </div>

                  {/* Sécurité */}
                  <div className="section-card">
                    <div className="section-header"><span className="section-icon">🔒</span> Sécurité</div>

                    <div className="list-row" onClick={() => setPage("compte-password")}>
                      <div className="row-left"><span className="row-icon">🔐</span> Modifier le mot de passe</div>
                      <div className="row-right"><span className="chevron">›</span></div>
                    </div>

                    <div className="list-row" onClick={() => setPage("compte-devices")}>
                      <div className="row-left"><span className="row-icon">📱</span> Appareils connectés</div>
                      <div className="row-right"><span className="badge-pill">2</span> <span className="chevron">›</span></div>
                    </div>

                    <div className="list-row" onClick={() => setPage("compte-notif")}>
                      <div className="row-left"><span className="row-icon">🔔</span> Préférences de notifications</div>
                      <div className="row-right"><span className="chevron">›</span></div>
                    </div>

                  </div>

                  {/* Préférences */}
                  <div className="section-card">
                    <div className="section-header"><span className="section-icon">⚙️</span> Préférences</div>

                    <div className="list-row" onClick={() => setPage("compte-appearance")}>
                      <div className="row-left"><span className="row-icon">🎨</span> Apparence</div>
                      <div className="row-right">Thème clair <span className="chevron">›</span></div>
                    </div>
                  </div>

                  {/* À propos */}
                  <div className="section-card">
                    <div className="section-header"><span className="section-icon">ℹ️</span> À propos</div>

                    <div className="list-row">
                      <div className="row-left"><span className="row-icon">📱</span> Application Kivana Scanner</div>
                      <div className="row-right">Version 1.0.0 <span className="chevron">›</span></div>
                    </div>

                    <div className="list-row">
                      <div className="row-left"><span className="row-icon">📄</span> Conditions d'utilisation</div>
                      <div className="row-right"><span className="chevron">›</span></div>
                    </div>

                    <div className="list-row">
                      <div className="row-left"><span className="row-icon">🔒</span> Politique de confidentialité</div>
                      <div className="row-right"><span className="chevron">›</span></div>
                    </div>

                  </div>

                  <div style={{height:14}} />

                  <button className="logout-btn" onClick={handleLogout}>⎋ Déconnexion</button>
                </div>
              </div>
            )}

            {/* sous-pages compte (laissées comme avant, styles améliorées via CSS) */}
            {page === 'compte-edit' && (
              <div className="card form-card">
                <button className="ghost-btn" onClick={() => setPage('compte')}>← Retour</button>
                <h2 style={{marginTop:12}}>Modifier le profil</h2>
                <form style={{marginTop:12}} onSubmit={(e) => { e.preventDefault(); alert('Profil mis à jour (simulation)'); setPage('compte') }}>
                  <label style={{display:'block', marginTop:8}}>Nom</label>
                  <input type="text" defaultValue={user?.name || ''} style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #e6e6e6'}} />

                  <label style={{display:'block', marginTop:8}}>Email</label>
                  <input type="email" defaultValue={user?.email || ''} style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #e6e6e6'}} />

                  <button className="primary-btn" type="submit" style={{marginTop:12}}>Enregistrer</button>
                </form>
              </div>
            )}

            {page === 'compte-password' && (
              <div className="card form-card">
                <button className="ghost-btn" onClick={() => setPage('compte')}>← Retour</button>
                <h2 style={{marginTop:12}}>Changer le mot de passe</h2>
                <form style={{marginTop:12}} onSubmit={(e) => { e.preventDefault(); alert('Mot de passe changé (simulation)'); setPage('compte') }}>
                  <label style={{display:'block', marginTop:8}}>Mot de passe actuel</label>
                  <input type="password" style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #e6e6e6'}} />

                  <label style={{display:'block', marginTop:8}}>Nouveau mot de passe</label>
                  <input type="password" style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #e6e6e6'}} />

                  <label style={{display:'block', marginTop:8}}>Confirmer le nouveau mot de passe</label>
                  <input type="password" style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #e6e6e6'}} />

                  <button className="primary-btn" type="submit" style={{marginTop:12}}>Mettre à jour</button>
                </form>
              </div>
            )}

            {page === 'compte-devices' && (
              <div className="card form-card">
                <button className="ghost-btn" onClick={() => setPage('compte')}>← Retour</button>
                <h2 style={{marginTop:12}}>Appareils connectés</h2>
                <div style={{marginTop:12}}>
                  <div className="info-row" style={{marginBottom:8}}>
                    <div>
                      <div style={{fontWeight:600}}>Pixel 5</div>
                      <div style={{fontSize:12, color:'#666'}}>Dernière connexion : 2026-07-20</div>
                    </div>
                    <button className="ghost-btn">Déconnecter</button>
                  </div>

                  <div className="info-row" style={{marginBottom:8}}>
                    <div>
                      <div style={{fontWeight:600}}>iPhone 12</div>
                      <div style={{fontSize:12, color:'#666'}}>Dernière connexion : 2026-07-27</div>
                    </div>
                    <button className="ghost-btn">Déconnecter</button>
                  </div>

                  <p style={{color:'#666', marginTop:8}}>Gérez vos sessions actives et déconnectez des appareils si nécessaire.</p>
                </div>
              </div>
            )}

            {page === 'compte-notif' && (
              <div className="card form-card">
                <button className="ghost-btn" onClick={() => setPage('compte')}>← Retour</button>
                <h2 style={{marginTop:12}}>Préférences de notifications</h2>
                <div style={{marginTop:12}}>
                  <label style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#fafbff', padding:10, borderRadius:8, marginBottom:8}}>
                    <span>Notifications push</span>
                    <input type="checkbox" defaultChecked />
                  </label>

                  <label style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#fafbff', padding:10, borderRadius:8, marginBottom:8}}>
                    <span>Notifications par e-mail</span>
                    <input type="checkbox" />
                  </label>

                  <button className="primary-btn" style={{marginTop:8}} onClick={() => { alert('Préférences sauvegardées (simulation)'); setPage('compte') }}>Sauvegarder</button>
                </div>
              </div>
            )}

            {page === 'compte-appearance' && (
              <div className="card form-card">
                <button className="ghost-btn" onClick={() => setPage('compte')}>← Retour</button>
                <h2 style={{marginTop:12}}>Apparence</h2>
                <div style={{marginTop:12}}>
                  <label style={{display:'flex', alignItems:'center', gap:8}}><input type="radio" name="theme_manage" defaultChecked /> Clair</label>
                  <label style={{display:'flex', alignItems:'center', gap:8, marginTop:8}}><input type="radio" name="theme_manage" /> Sombre</label>

                  <p style={{color:'#666', marginTop:12}}>Changer le thème ici modifiera uniquement l'interface. (Simulation)</p>
                  <button className="primary-btn" style={{marginTop:8}} onClick={() => { alert('Thème appliqué (simulation)'); setPage('compte') }}>Appliquer</button>
                </div>
              </div>
            )}

            {page === 'compte-about' && (
              <div className="card form-card">
                <button className="ghost-btn" onClick={() => setPage('compte')}>← Retour</button>
                <h2 style={{marginTop:12}}>À propos</h2>
                <div style={{marginTop:12}}>
                  <p style={{margin:0}}>Kivana Scanner</p>
                  <p style={{margin:0}}>Version 1.0.0</p>
                  <p style={{color:'#666', marginTop:8}}>Application mobile PWA pour le contrôle des billets.</p>
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
