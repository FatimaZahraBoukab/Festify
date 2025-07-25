import Header from "./Header"
import Footer from "./Footer"
import "./AboutPage.css"

const AboutPage = () => {
  return (
    <>
      <Header />
      <section className="a-propos page-version">
        <div className="container">
          <div className="a-propos-content">
            <img src="/img6.jpg" alt="À propos de Festify" className="a-propos-image" />
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
      <Footer />
    </>
  )
}

export default AboutPage


