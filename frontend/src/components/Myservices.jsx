import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Palette de couleurs raffinée jaune-bleu-nude
const colors = {
  darkBlue: '#1A5F7A', // Bleu profond
  mediumBlue: '#159895', // Bleu-vert
  lightBlue: '#D4F1F4', // Bleu très clair
  yellow: '#FFC93C', // Jaune soleil
  softYellow: '#FFEECC', // Jaune pâle
  nude: '#E8DACB', // Nude chaleureux
  accentNude: '#D2B48C', // Nude plus foncé (tan)
  textDark: '#2D3748', // Gris foncé
  textLight: '#718096', // Gris moyen
  white: '#FFFFFF',
  offWhite: '#FAF7F2', // Fond légèrement teinté
  border: '#EAE0D5', // Bordure nude
  danger: '#F56565', // Rouge pour actions destructives
};

// Styles élégants et créatifs
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem',
    fontFamily: '"Poppins", "Helvetica Neue", Arial, sans-serif', // Police plus moderne
    backgroundColor: colors.offWhite,
    backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 201, 60, 0.05) 0%, rgba(232, 218, 203, 0.1) 100%)', // Subtil motif de fond
    minHeight: '100vh',
  },
  header: {
    color: colors.darkBlue,
    borderBottom: `3px solid ${colors.yellow}`,
    paddingBottom: '1.2rem',
    marginBottom: '3rem',
    fontSize: '2.6rem',
    fontWeight: '600',
    letterSpacing: '0.8px',
    position: 'relative',
    textShadow: '1px 1px 0px rgba(26, 95, 122, 0.05)',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: '-3px',
      left: '0',
      width: '60px',
      height: '3px',
      backgroundColor: colors.mediumBlue,
    }
  },
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '2.5rem',
  },
  serviceCard: {
    backgroundColor: colors.white,
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
    padding: '0',
    transition: 'all 0.4s ease',
    border: `1px solid ${colors.border}`,
    position: 'relative',
    overflow: 'hidden',
    transform: 'translateY(0)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
    }
  },
  carouselContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: `${colors.nude}50`,
  },
  carouselWrapper: {
    display: 'flex',
    transition: 'transform 0.5s ease',
    width: '100%',
    height: '100%',
  },
  carouselSlide: {
    minWidth: '100%',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  carouselNavButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: `${colors.darkBlue}80`,
    color: colors.white,
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '1.2rem',
    opacity: '0.7',
    transition: 'opacity 0.3s, background-color 0.3s',
    zIndex: '5',
    '&:hover': {
      opacity: '1',
      backgroundColor: colors.darkBlue,
    }
  },
  prevButton: {
    left: '15px',
  },
  nextButton: {
    right: '15px',
  },
  carouselDots: {
    position: 'absolute',
    bottom: '15px',
    left: '0',
    right: '0',
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    zIndex: '5',
  },
  carouselDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: `${colors.white}80`,
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.3s',
  },
  activeDot: {
    backgroundColor: colors.white,
    transform: 'scale(1.2)',
  },
  noImageHeader: {
    height: '200px',
    backgroundColor: `${colors.nude}50`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceBody: {
    padding: '2rem',
  },
  serviceTitle: {
    color: colors.darkBlue,
    marginTop: '0',
    marginBottom: '1rem',
    fontSize: '1.8rem',
    fontWeight: '700',
    letterSpacing: '0.2px',
    display: 'flex',
    alignItems: 'center',
  },
  serviceDescription: {
    color: colors.textDark,
    lineHeight: '1.8',
    marginBottom: '1.8rem',
    fontSize: '1rem',
    display: '-webkit-box',
    WebkitLineClamp: '3',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  servicePrice: {
    fontWeight: '700',
    color: colors.darkBlue,
    fontSize: '1.4rem',
    padding: '10px 16px',
    backgroundColor: colors.softYellow,
    display: 'inline-block',
    borderRadius: '30px',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 5px rgba(255, 201, 60, 0.2)',
    borderLeft: `4px solid ${colors.yellow}`,
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    marginTop: '1.8rem',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: colors.mediumBlue,
    color: colors.white,
    border: 'none',
    padding: '12px 22px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s',
    fontSize: '0.95rem',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 10px rgba(21, 152, 149, 0.25)',
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  deleteButton: {
    backgroundColor: colors.white,
    color: colors.danger,
    border: `2px solid ${colors.danger}`,
    padding: '12px 22px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s',
    fontSize: '0.95rem',
    letterSpacing: '0.5px',
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  noImageText: {
    fontStyle: 'italic',
    color: colors.textLight,
    textAlign: 'center',
    padding: '15px',
    backgroundColor: `${colors.nude}20`,
    borderRadius: '8px',
    width: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
    padding: '8px 16px',
    borderRadius: '30px',
    fontSize: '0.85rem',
    fontWeight: '600',
    zIndex: '10',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  availableBadge: {
    backgroundColor: colors.yellow,
    color: colors.darkBlue,
  },
  unavailableBadge: {
    backgroundColor: colors.nude,
    color: colors.textDark,
  },
  addServiceButton: {
    backgroundColor: colors.darkBlue,
    color: colors.white,
    border: 'none',
    padding: '16px 30px',
    borderRadius: '40px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1.1rem',
    letterSpacing: '0.6px',
    boxShadow: '0 6px 12px rgba(26, 95, 122, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    margin: '2rem auto 3rem',
    transition: 'all 0.3s',
  },
  emptyStateContainer: {
    padding: '4rem 2rem',
    textAlign: 'center',
    backgroundColor: colors.white,
    borderRadius: '16px',
    color: colors.textLight,
    border: `1px dashed ${colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateIcon: {
    fontSize: '4rem',
    color: colors.nude,
    marginBottom: '1.5rem',
  },
  emptyStateText: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    color: colors.textDark,
    maxWidth: '500px',
  },
  infoIcon: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: colors.yellow,
    color: colors.darkBlue,
    textAlign: 'center',
    lineHeight: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginRight: '8px',
  },
  imagesCounter: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    backgroundColor: `${colors.darkBlue}80`,
    color: colors.white,
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    zIndex: '5',
  }
};

// Composant Carousel pour afficher les images
const ImageCarousel = ({ images }) => {
  const [current, setCurrent] = useState(0);
  
  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };
  
  const prevSlide = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };
  
  const goToSlide = (index) => {
    setCurrent(index);
  };

  // Vérification plus robuste des images
  const hasImages = images && images.length > 0 && images[0]?.image_url;
  
  if (!hasImages) {
    return (
      <div style={styles.noImageHeader}>
        <p style={styles.noImageText}>Ajoutez des photos pour attirer plus de clients</p>
      </div>
    );
  }
  
  return (
    <div style={styles.carouselContainer}>
      {/* Bouton précédent */}
      <button 
        style={{...styles.carouselNavButton, ...styles.prevButton}} 
        onClick={prevSlide}
      >
        &lt;
      </button>
      
      {/* Slides */}
      <div style={{...styles.carouselWrapper, transform: `translateX(-${current * 100}%)`}}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image.image_url}
            alt={`Slide ${index}`}
            style={styles.carouselSlide}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x200?text=Image+Non+Disponible';
            }}
          />
        ))}
      </div>
      
      {/* Bouton suivant */}
      <button 
        style={{...styles.carouselNavButton, ...styles.nextButton}} 
        onClick={nextSlide}
      >
        &gt;
      </button>
      
      {/* Points indicateurs */}
      <div style={styles.carouselDots}>
        {images.map((_, index) => (
          <div 
            key={index}
            style={{
              ...styles.carouselDot,
              ...(index === current && styles.activeDot)
            }}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
      
      {/* Compteur d'images */}
      {hasImages && (
        <div style={styles.imagesCounter}>
          {current + 1}/{images.length}
        </div>
      )}
    </div>
  );
};

const MyServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchServices();
    }, []);
    
    const fetchServices = async () => {
    setLoading(true);
    try {
        const response = await axios.get('http://localhost:8000/api/services/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            params: {
                include_images: true // Ajoutez ce paramètre
            }
        });
        setServices(response.data);
    } catch (error) {
        console.error('Erreur lors de la récupération des services:', error);
    } finally {
        setLoading(false);
    }
};
    
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8000/api/services/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setServices(services.filter(service => service.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression du service:', error);
            }
        }
    };
    
    if (loading) {
        return (
            <div style={styles.container}>
                <h1 style={styles.header}>Mes Services</h1>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '300px',
                    color: colors.textLight
                }}>
                    <p>Chargement de vos services...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div style={styles.container}>
          
            <h1 style={styles.header}>Mes Services</h1>
            
            <button 
                style={{
                    ...styles.addServiceButton,
                    backgroundColor: colors.yellow,
                    color: colors.darkBlue,
                }}
                onClick={() => navigate('/prestataire/add-service')}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = colors.darkBlue;
                    e.currentTarget.style.color = colors.white;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(26, 95, 122, 0.3)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = colors.yellow;
                    e.currentTarget.style.color = colors.darkBlue;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(26, 95, 122, 0.25)';
                }}
            >
                + Ajouter un nouveau service
            </button>
            
            {services.length === 0 ? (
                <div style={styles.emptyStateContainer}>
                    <div style={styles.emptyStateIcon}>🏝️</div>
                    <p style={styles.emptyStateText}>
                        Vous n'avez pas encore de services à afficher. Créez votre premier service pour commencer à recevoir des demandes !
                    </p>
                    <button
                        style={{
                            ...styles.editButton,
                            padding: '14px 32px',
                            fontSize: '1.05rem',
                            width: 'auto',
                        }}
                        onClick={() => navigate('/prestataire/add-service')}
                    >
                        Créer mon premier service
                    </button>
                </div>
            ) : (
                <div style={styles.serviceGrid}>
                    {services.map(service => (
                        <div 
                            key={service.id} 
                            style={styles.serviceCard}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.08)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.06)';
                            }}
                        >
                          
                            {/* Badge de statut */}
                            <div style={{
                                ...styles.statusBadge,
                                ...(service.is_available ? styles.availableBadge : styles.unavailableBadge)
                            }}>
                                {service.is_available ? '✓ Disponible' : '× Non disponible'}
                            </div>
                            
                            {/* Carrousel d'images */}
                            <ImageCarousel images={service.images || []} />
                            
                            <div style={styles.serviceBody}>
                                <h2 style={styles.serviceTitle}>
                                    <span style={styles.infoIcon}>i</span>
                                    {service.name}
                                </h2>
                                <p style={styles.serviceDescription}>{service.description}</p>
                                
                                <div style={styles.servicePrice}>{service.price} €</div>
                                
                                <div style={styles.buttonContainer}>
                                    <button 
                                        style={styles.editButton} 
                                        onClick={() => navigate(`/prestataire/edit-service/${service.id}`)}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = colors.darkBlue;
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.boxShadow = '0 6px 12px rgba(21, 152, 149, 0.3)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = colors.mediumBlue;
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 10px rgba(21, 152, 149, 0.25)';
                                        }}
                                    >
                                        ✏️ Modifier
                                    </button>
                                    <button 
                                        style={styles.deleteButton} 
                                        onClick={() => handleDelete(service.id)}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = colors.danger;
                                            e.currentTarget.style.color = colors.white;
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = colors.white;
                                            e.currentTarget.style.color = colors.danger;
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyServices;