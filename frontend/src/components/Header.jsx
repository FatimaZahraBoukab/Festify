"use client"

import { Link, useLocation } from "react-router-dom"
import { useEffect } from "react"
import "./Header.css"

const Header = () => {
  const location = useLocation()

  // Fonction pour gérer le défilement doux vers les sections
  const scrollToSection = (event, sectionId) => {
    event.preventDefault()
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Vérifier s'il y a un hash dans l'URL lors du chargement ou changement de route
  useEffect(() => {
    if (location.hash) {
      // Petit délai pour s'assurer que le DOM est complètement chargé
      setTimeout(() => {
        const id = location.hash.substring(1) // Enlever le # du hash
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }, [location])

  return (
    <header className="header1">
      <div className="container1">
        <div className="header-content1">
          <div className="header-brand1">
            <Link to="/" className="brand-link1">
              <img src="src\pages\images\logo.png" alt="Festify Logo" className="brand-logo1" />
              <span className="brand-name1">Festify</span>
            </Link>
          </div>

          <div className="header-nav-container1">
            <nav className="header-nav1">
              <ul className="nav-links1">
                <li>
                  <Link to="/#home" onClick={(e) => scrollToSection(e, "home")}>
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link to="/#about" onClick={(e) => scrollToSection(e, "about")}>
                    À propos
                  </Link>
                </li>
                <li>
                  <Link to="/#services1" onClick={(e) => scrollToSection(e, "services1")}>
                    Nos services
                  </Link>
                </li>
                <li>
                  <Link to="/#contact" onClick={(e) => scrollToSection(e, "contact")}>
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="auth-buttons1">
              <Link to="/login" className="btn btn-login1">
                Se connecter
              </Link>
              <Link to="/register" className="btn btn-register1">
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header






