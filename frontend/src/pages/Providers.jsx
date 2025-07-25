import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import './Providers.css';
import { FaEuroSign, FaStar, FaMapMarkerAlt, FaInfoCircle, FaCalendarCheck } from 'react-icons/fa';

function Providers() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer le paramètre de service depuis l'URL
  const queryParams = new URLSearchParams(location.search);
  const serviceFromURL = queryParams.get('service');

  /*useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const response = await api.get("providers/");
        setProviders(response.data);
        
        // Extraire toutes les catégories uniques pour le filtre
        const uniqueCategories = [...new Set(response.data.map(provider => provider.service))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Erreur lors du chargement des prestataires", error);
        setError("Impossible de charger les prestataires. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);*/

  
  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        let url = "providers/";
        if (serviceFromURL) {
          url += `?service=${encodeURIComponent(serviceFromURL)}`;
          console.log("Fetching with URL:", url); // Debug
        }

        const response = await api.get(url);
        console.log("API Response:", response.data); // Debug
        
        if (response.data && response.data.length > 0) {
          setProviders(response.data);
          // Extraire les noms de services uniques
          const allServices = response.data.flatMap(provider => 
            provider.services.map(service => service.name)
          );
          const uniqueServices = [...new Set(allServices)];
          setCategories(uniqueServices);
        } else {
          setProviders([]);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error:", error.response); // Affiche plus de détails sur l'erreur
        setError("Impossible de charger les prestataires. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
}, [serviceFromURL]);


  // Filtrer les prestataires par recherche et catégorie
  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.entreprise?.toLowerCase().includes(filter.toLowerCase()) || 
                          provider.description?.toLowerCase().includes(filter.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || provider.service === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleBooking = (providerId) => {
    navigate(`/book-provider/${providerId}`);
  };

  const handleViewDetails = (providerId) => {
    navigate(`/provider-details/${providerId}`);
  };

  const toggleDescription = (providerId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  const resetFilters = () => {
    setFilter('');
    setCategoryFilter('all');
    // Si on était arrivé ici via un filtre de service dans l'URL,
    // on redirige vers la page sans paramètre pour tout afficher
    if (serviceFromURL) {
      navigate('/providers');
    }
  };

  const handleProviderClick = (providerId) => {
    navigate(`/provider-details/${providerId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Chargement des prestataires...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oups, quelque chose s'est mal passé</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  return (
    <div className="providers-container">
      <div className="providers-header">
        <h1>Nos prestataires partenaires</h1>
        <p>Découvrez les meilleurs prestataires pour votre événement</p>
        
        <div className="providers-filters">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Rechercher un prestataire..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          
          <div className="category-filter">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredProviders.length === 0 ? (
        <div className="no-results">
          <h3>Aucun prestataire ne correspond à votre recherche</h3>
          <p>Essayez avec d'autres critères ou réinitialisez les filtres</p>
          <button onClick={() => {setFilter(''); setCategoryFilter('all');}}>
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="providers-grid">
          {filteredProviders.map(provider => (
            <div key={provider.id} className="provider-card" onClick={() => handleViewDetails(provider.id)}>
              <div className="provider-image">
                {/* Image de placeholder - vous pourriez utiliser une vraie image */}
                <div className="image-placeholder">{provider.entreprise?.charAt(0)}</div>
              </div>
              
                <div className="provider-info">
                <h3>{provider.entreprise}</h3>
                <div className="provider-category">
                  <span className="category-tag">{provider.service}</span>
                </div>
                
                <div className="provider-location">
                  <FaMapMarkerAlt />
                  <span>{provider.location || "France"}</span>
                </div>
                
                <div className="provider-rating">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="star-inactive" />
                  <span>(4.0)</span>
                </div>
                
                {/*<p className="provider-description">
                  {provider.description?.length > 100 
                    ? provider.description.substring(0, 100) + '...' 
                    : provider.description}
                </p>*/}

<p className="provider-description">
  {expandedDescriptions[provider.id] 
    ? provider.description
    : provider.description?.split('\n').slice(0, 4).join('\n')}
  {provider.description?.split('\n').length > 4 && (
    <button 
      className="read-more-btn" 
      onClick={(e) => {
        e.stopPropagation();
        toggleDescription(provider.id);
      }}
    >
      {expandedDescriptions[provider.id] ? 'Voir moins' : 'Lire la suite...'}
    </button>
  )}
</p>
                
                <div className="provider-price">
                  <FaEuroSign />
                  <span>{provider.price || "Sur devis"}</span>
                </div>
              </div>
              
              <div className="provider-actions">
                <button className="btn-details" onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(provider.id);
                }}>
                  <FaInfoCircle /> Détails
                </button>
                <button className="btn-book" onClick={(e) => {
                  e.stopPropagation();
                  handleBooking(provider.id);
                }}>
                  <FaCalendarCheck /> Réserver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Providers;