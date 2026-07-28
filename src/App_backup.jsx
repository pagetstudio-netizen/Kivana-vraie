import { useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import "./App.css"

function App() {
  const [page, setPage] = useState("accueil")
  const [result, setResult] = useState("")

  const startScanner = () => {
    setPage("scanner")

    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: 250,
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

      <header>
        <h1>Kivana Scanner</h1>
        <p>Contrôle des billets</p>
      </header>

      {page === "accueil" && (
        <main>
          <div className="card">
            <h2>Prêt à scanner ?</h2>
            <p>Vérifiez rapidement la validité d'un billet.</p>

            <button className="scanButton" onClick={startScanner}>
              📷 Scanner un billet
            </button>
          </div>

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
        </main>
      )}

      {page === "scanner" && (
        <div className="scanner">
          <h2>Scanner QR</h2>
          <div id="reader"></div>

          {result && (
            <div className="result">
              Résultat : {result}
            </div>
          )}
        </div>
      )}

      {page === "historique" && (
        <div className="card">
          <h2>Historique</h2>
          <p>Aucun scan effectué.</p>
        </div>
      )}

      {page === "compte" && (
        <div className="card">
          <h2>Mon compte</h2>
          <p>Agent Kivana</p>
          <p>Connexion Supabase bientôt disponible.</p>
        </div>
      )}

      <nav>
        <button onClick={() => setPage("accueil")}>
          🏠 Accueil
        </button>

        <button onClick={startScanner}>
          📷 Scanner
        </button>

        <button onClick={() => setPage("historique")}>
          📋 Historique
        </button>

        <button onClick={() => setPage("compte")}>
          👤 Compte
        </button>
      </nav>

    </div>
  )
}

export default App