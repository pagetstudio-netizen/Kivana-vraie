import { useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import "./App.css"

function App() {
  const [page, setPage] = useState("accueil")
  const [result, setResult] = useState("")

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

  return (
    <div className="app">

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


      <main className="content">

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
  <div className="card profile">

    <div className="avatar">
      👤
    </div>

    <h2>Agent Kivana</h2>
    <p>agent@kivana.com</p>

    <div className="profile-item">
      🏢 Organisation
      <strong>Kivana Events</strong>
    </div>

    <div className="profile-item">
      🆔 Identifiant agent
      <strong>KIV-0001</strong>
    </div>

    <div className="profile-item">
      🔐 Sécurité
      <strong>Changer le mot de passe</strong>
    </div>

    <button className="logout">
      🚪 Déconnexion
    </button>

  </div>
)}
      </main>

        <button onClick={() => setPage("accueil")}>
          🏠
          <span>Accueil</span>
        </button>

        <button onClick={startScanner}>
          📷
          <span>Scanner</span>
        </button>

        <button onClick={() => setPage("historique")}>
          📋
          <span>Historique</span>
        </button>
        <button onClick={() => setPage("compte")}>
          👤
          <span>Compte</span>
        </button>

      </nav>

    </div>
  )
}

export default App
