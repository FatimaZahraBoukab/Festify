import Header from "./Header"
import Footer from "./Footer"
import "./ServicesPage.css"

const ServicesPage = () => {
  return (
    <>
      <Header />
      <div className="services-container page-version1">
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
              <img src="img4.jpg" alt="Bouquet de mariage" className="service-image1" />
            </div>
            <div className="service-label1">
              <h3>Mariages</h3>
            </div>
          </div>

          <div className="service-card1">
            <div className="service-image-container1">
              <img src="img2.webp" alt="Table dressée pour un événement" className="service-image1" />
            </div>
            <div className="service-label1">
              <h3>Événement Privé</h3>
            </div>
          </div>

          <div className="service-card1">
            <div className="service-image-container1">
              <img src="img5.jpg" alt="anniv" className="service-image1" />
            </div>
            <div className="service-label1">
              <h3>Anniversaire</h3>
            </div>
          </div>

          <div className="service-card1">
            <div className="service-image-container1">
              <img src="img7.jpg" alt="sou" className="service-image1" />
            </div>
            <div className="service-label1">
              <h3>Soutenance</h3>
            </div>
          </div>

          <div className="service-card1">
            <div className="service-image-container1">
              <img src="img1.webp" alt="Échange de bagues" className="service-image1" />
            </div>
            <div className="service-label1">
              <h3>Fiançailles</h3>
            </div>
          </div>

          <div className="service-card1">
            <div className="service-image-container1">
              <img src="img6.jpg" alt="Se" className="service-image1" />
            </div>
            <div className="service-label1">
              <h3>Séminaire</h3>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ServicesPage




