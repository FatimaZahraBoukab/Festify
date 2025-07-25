"use client"

import { useState, useEffect } from "react"
import Header from "./Header"
import Footer from "./Footer"
import "./HomePage.css"

const HomePage = () => {
  // Tableau des images (chemins absolus)
  const backgroundImages = ["src/pages/images/page.webp", "src/pages/images/page4.webp", "src/pages/images/img12.jpg", "src/pages/images/img23.webp","src/pages/images/img20.webp"]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Précharger les images
  useEffect(() => {
    const preloadImages = async () => {
      try {
        const loadImage = (src) => {
          return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = src
            img.onload = () => resolve(img)
            img.onerror = reject
          })
        }

        await Promise.all(backgroundImages.map((src) => loadImage(src)))
        setIsLoading(false)
      } catch (error) {
        console.error("Erreur lors du chargement des images:", error)
        setIsLoading(false)
      }
    }

    preloadImages()
  }, [])

  // Effet pour changer l'image toutes les 1.5 secondes
  useEffect(() => {
    if (isLoading) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1))
    }, 1500)

    return () => clearInterval(interval)
  }, [isLoading])

  return (
    <div className="home-page">
      <Header />

      <main className="main-content1">
        <section id="home" className="hero1">
          <div
            className="hero-background1"
            style={{
              backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
            }}
          />
          <div className="hero-overlay1" />
          <div className="hero-content1">
            <div className="welcome-line1">
              <span className="line1"></span>
              <span className="welcome-text1">BIENVENUE À FESTIFY</span>
            </div>

            <h1 className="main-title1">Festify</h1>
            <p className="tagline1">Pour un Festin sensoriel</p>
          </div>
        </section>

        {/* Section À propos avec ID "about" */}
        <section id="about" className="a-propos">
          <div className="container">
            <div className="a-propos-content">
              <img src="src\pages\images\img6.jpg" alt="À propos de Festify" className="a-propos-image" />
              <div className="a-propos-text">
                <h2>Votre partenaire événementiel</h2>
                <h3>Innovation, excellence & personnalisation</h3>
                <p>
                  Festify, votre partenaire événementiel, révolutionne l'expérience professionnelle par son innovation.
                  Nous conjuguons expertise, qualité et réactivité pour sublimer chaque rencontre. Des séminaires aux
                  lancements de produits, nos solutions sur-mesure enchantent vos événements. Avec Festify, transformez
                  vos idées en moments inoubliables, où créativité et excellence se rencontrent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section Services avec ID "services" */}
        <section id="services1" className="services-container1">
          <div className="services-header1">
            <h3 className="services-subtitle1">SERVICES</h3>
            <h1 className="services-title1">
              Offrez-vous le <span className="highlight1">Meilleur</span>
            </h1>
            <p className="services-description1">Des Services Sur Mesure pour Vos Mariages et Événements</p>
          </div>

          <div className="services-cards1">
            <div className="service-card1">
              <div className="service-image-container1">
                <img src="src\pages\images\img4.jpg" alt="Bouquet de mariage" className="service-image1" />
              </div>
              <div className="service-label1">
                <h3>Mariages</h3>
              </div>
            </div>

            <div className="service-card1">
              <div className="service-image-container1">
                <img src="src\pages\images\img2.webp" alt="Table dressée pour un événement" className="service-image1" />
              </div>
              <div className="service-label1">
                <h3>Événement Privé</h3>
              </div>
            </div>

            <div className="service-card1">
              <div className="service-image-container1">
                <img src="src\pages\images\img5.jpg" alt="anniv" className="service-image1" />
              </div>
              <div className="service-label1">
                <h3>Anniversaire</h3>
              </div>
            </div>

            <div className="service-card1">
              <div className="service-image-container1">
                <img src="src\pages\images\img7.jpg" alt="sou" className="service-image1" />
              </div>
              <div className="service-label1">
                <h3>Soutenance</h3>
              </div>
            </div>

            <div className="service-card1">
              <div className="service-image-container1">
                <img src="src\pages\images\img1.webp" alt="Échange de bagues" className="service-image1" />
              </div>
              <div className="service-label1">
                <h3>Fiançailles</h3>
              </div>
            </div>

            <div className="service-card1">
              <div className="service-image-container1">
                <img src="src\pages\images\img6.jpg" alt="Se" className="service-image1" />
              </div>
              <div className="service-label1">
                <h3>Séminaire</h3>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section id="contact">
        <Footer />
      </section>
    </div>
  )
}

export default HomePage

