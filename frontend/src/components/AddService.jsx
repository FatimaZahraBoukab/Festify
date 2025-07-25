import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Palette de couleurs raffinée jaune-bleu-nude (harmonisée avec MyServices)
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
  success: '#38A169', // Vert pour les actions de validation
  cancel: '#E53E3E', // Rouge pour les actions d'annulation
};

// Styles élégants et créatifs
const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '3rem',
    fontFamily: '"Poppins", "Helvetica Neue", Arial, sans-serif',
    backgroundColor: colors.offWhite,
    backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 201, 60, 0.05) 0%, rgba(232, 218, 203, 0.1) 100%)',
    minHeight: '100vh',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
  },
  header: {
    color: colors.darkBlue,
    borderBottom: `3px solid ${colors.yellow}`,
    paddingBottom: '1.2rem',
    marginBottom: '3rem',
    fontSize: '2.4rem',
    fontWeight: '600',
    letterSpacing: '0.8px',
    position: 'relative',
    textShadow: '1px 1px 0px rgba(26, 95, 122, 0.05)',
  },
  subheading: {
    color: colors.textLight,
    fontSize: '1.1rem',
    marginTop: '-1.5rem',
    marginBottom: '2.5rem',
    fontWeight: '400',
    maxWidth: '600px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    backgroundColor: colors.white,
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.04)',
    border: `1px solid ${colors.border}`,
  },
  formSection: {
    marginBottom: '1rem',
  },
  formSectionTitle: {
    fontSize: '1.2rem',
    color: colors.darkBlue,
    fontWeight: '600',
    marginBottom: '1.5rem',
    paddingBottom: '0.5rem',
    borderBottom: `2px solid ${colors.softYellow}`,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  formIcon: {
    fontSize: '1.2rem',
    color: colors.yellow,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
    marginBottom: '1.5rem',
  },
  label: {
    fontWeight: '600',
    color: colors.textDark,
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  labelIcon: {
    fontSize: '1rem',
    color: colors.mediumBlue,
  },
  requiredStar: {
    color: colors.mediumBlue,
    fontWeight: 'bold',
    marginLeft: '3px',
  },
  input: {
    padding: '1rem',
    borderRadius: '12px',
    border: `2px solid ${colors.border}`,
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: colors.white,
    '&:focus': {
      borderColor: colors.mediumBlue,
      boxShadow: `0 0 0 3px ${colors.lightBlue}`,
    },
    '&:hover': {
      borderColor: colors.accentNude,
    }
  },
  textarea: {
    padding: '1rem',
    borderRadius: '12px',
    border: `2px solid ${colors.border}`,
    fontSize: '1rem',
    minHeight: '150px',
    resize: 'vertical',
    fontFamily: '"Poppins", "Helvetica Neue", Arial, sans-serif',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: colors.white,
    '&:focus': {
      borderColor: colors.mediumBlue,
      boxShadow: `0 0 0 3px ${colors.lightBlue}`,
    },
    '&:hover': {
      borderColor: colors.accentNude,
    }
  },
  fileInputWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  fileInputLabel: {
    padding: '1.5rem 2rem',
    borderRadius: '12px',
    backgroundColor: `${colors.softYellow}80`,
    border: `2px dashed ${colors.yellow}`,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    '&:hover': {
      backgroundColor: `${colors.softYellow}`,
      borderColor: colors.mediumBlue,
    }
  },
  fileInputIcon: {
    fontSize: '2rem',
    color: colors.darkBlue,
    marginBottom: '0.5rem',
  },
  fileInput: {
    opacity: '0',
    position: 'absolute',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  },
  fileInputText: {
    fontSize: '1rem',
    fontWeight: '600',
    color: colors.darkBlue,
  },
  fileInputSubtext: {
    fontSize: '0.9rem',
    color: colors.textLight,
    marginTop: '5px',
  },
  selectedFilesPreview: {
    backgroundColor: `${colors.lightBlue}30`,
    padding: '1rem',
    borderRadius: '10px',
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  selectedFile: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.5rem 0.8rem',
    backgroundColor: colors.white,
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  helpText: {
    fontSize: '0.85rem',
    color: colors.textLight,
    marginTop: '0.5rem',
    fontStyle: 'italic',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1.5rem',
    marginTop: '2rem',
    justifyContent: 'flex-end',
  },
  submitButton: {
    backgroundColor: colors.yellow,
    color: colors.darkBlue,
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1rem',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 10px rgba(255, 201, 60, 0.3)',
  },
  cancelButton: {
    backgroundColor: colors.white,
    color: colors.textDark,
    border: `2px solid ${colors.textLight}`,
    padding: '1rem 2rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  priceInputGroup: {
    position: 'relative',
  },
  priceSymbol: {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.textLight,
    fontWeight: '600',
  },
  formFooter: {
    marginTop: '3rem',
    paddingTop: '1.5rem',
    borderTop: `1px solid ${colors.border}`,
    fontSize: '0.9rem',
    color: colors.textLight,
    textAlign: 'center',
  },
};

const AddService = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        is_available: true,
        images: []
    });
    const [selectedFileNames, setSelectedFileNames] = useState([]);
    const [formSubmitting, setFormSubmitting] = useState(false);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };
    
    const handleImageChange = (e) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            const fileNames = fileArray.map(file => file.name);
            setSelectedFileNames(fileNames);
            setFormData({ ...formData, images: e.target.files });
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);
        
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('is_available', formData.is_available);
        
        for (let i = 0; i < formData.images.length; i++) {
            data.append('images', formData.images[i]);
        }
        
        try {
            await axios.post('http://localhost:8000/api/services/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            navigate('/prestataire/my-services');
        } catch (error) {
            console.error('Erreur lors de l\'ajout du service:', error);
            alert('Une erreur est survenue lors de l\'ajout du service. Veuillez réessayer.');
        } finally {
            setFormSubmitting(false);
        }
    };
    
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Ajouter un nouveau service</h1>
            <p style={styles.subheading}>
                Créez un service attrayant en fournissant tous les détails nécessaires et en ajoutant des photos de qualité pour attirer l'attention de vos clients potentiels.
            </p>
            
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formSection}>
                    <h3 style={styles.formSectionTitle}>
                        <span style={styles.formIcon}>📋</span> Informations de base
                    </h3>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelIcon}>✦</span>
                            Nom du service
                            <span style={styles.requiredStar}>*</span>
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            onChange={handleChange} 
                            required 
                            style={styles.input}
                            placeholder="Ex: Massage relaxant aux huiles essentielles"
                            onFocus={(e) => {
                                e.target.style.borderColor = colors.mediumBlue;
                                e.target.style.boxShadow = `0 0 0 3px ${colors.lightBlue}`;
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = colors.border;
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        <p style={styles.helpText}>Choisissez un nom clair et descriptif pour votre service</p>
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelIcon}>✦</span>
                            Description détaillée
                            <span style={styles.requiredStar}>*</span>
                        </label>
                        <textarea 
                            name="description" 
                            onChange={handleChange} 
                            required 
                            style={styles.textarea}
                            placeholder="Décrivez en détail votre service, les prestations incluses, la durée, les avantages pour le client..."
                            onFocus={(e) => {
                                e.target.style.borderColor = colors.mediumBlue;
                                e.target.style.boxShadow = `0 0 0 3px ${colors.lightBlue}`;
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = colors.border;
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        <p style={styles.helpText}>Une description complète augmente vos chances d'être choisi par les clients</p>
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelIcon}>✦</span>
                            Prix (€)
                            <span style={styles.requiredStar}>*</span>
                        </label>
                        <div style={styles.priceInputGroup}>
                            <input 
                                type="number" 
                                name="price" 
                                onChange={handleChange}
                                style={styles.input}
                                step="0.01"
                                min="0"
                                required
                                placeholder="0.00"
                                onFocus={(e) => {
                                    e.target.style.borderColor = colors.mediumBlue;
                                    e.target.style.boxShadow = `0 0 0 3px ${colors.lightBlue}`;
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = colors.border;
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <span style={styles.priceSymbol}>€</span>
                        </div>
                        <p style={styles.helpText}>Indiquez le prix par session ou par heure pour votre service</p>
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={{...styles.label, flexDirection: 'row', alignItems: 'center', gap: '10px'}}>
                            <input 
                                type="checkbox" 
                                name="is_available" 
                                checked={formData.is_available}
                                onChange={handleChange}
                            />
                            Disponible immédiatement
                        </label>
                        <p style={styles.helpText}>Décochez cette case si vous souhaitez ajouter le service mais le rendre disponible plus tard</p>
                    </div>
                </div>
                
                <div style={styles.formSection}>
                    <h3 style={styles.formSectionTitle}>
                        <span style={styles.formIcon}>🖼️</span> Photos du service
                    </h3>
                    
                    <div style={styles.fileInputWrapper}>
                        <label style={styles.fileInputLabel}>
                            <span style={styles.fileInputIcon}>📷</span>
                            <input 
                                type="file" 
                                name="images" 
                                multiple 
                                onChange={handleImageChange}
                                required
                                style={styles.fileInput}
                                accept="image/*"
                            />
                            <span style={styles.fileInputText}>Cliquez ou glissez des photos ici</span>
                            <span style={styles.fileInputSubtext}>Format JPG, PNG ou WEBP - Max 5 Mo par image</span>
                        </label>
                        
                        {selectedFileNames.length > 0 && (
                            <div style={styles.selectedFilesPreview}>
                                <div style={{fontWeight: '600', color: colors.textDark, marginBottom: '5px'}}>
                                    {selectedFileNames.length} {selectedFileNames.length > 1 ? 'images sélectionnées' : 'image sélectionnée'}:
                                </div>
                                {selectedFileNames.map((name, index) => (
                                    <div key={index} style={styles.selectedFile}>
                                        <span>{name}</span>
                                        <span style={{color: colors.mediumBlue}}>✓</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <p style={styles.helpText}>
                            Des photos de qualité augmentent considérablement l'attractivité de votre service. 
                            Pour de meilleurs résultats, utilisez des images lumineuses et bien cadrées.
                        </p>
                    </div>
                </div>
                
                <div style={styles.buttonContainer}>
                    <button 
                        type="button" 
                        style={styles.cancelButton}
                        onClick={() => navigate('/prestataire/my-services')}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = colors.textLight;
                            e.currentTarget.style.color = colors.white;
                            e.currentTarget.style.transform = 'translateY(-3px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = colors.white;
                            e.currentTarget.style.color = colors.textDark;
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        disabled={formSubmitting}
                    >
                        ← Annuler
                    </button>
                    <button 
                        type="submit" 
                        style={styles.submitButton}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = colors.mediumBlue;
                            e.currentTarget.style.color = colors.white;
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 6px 15px rgba(21, 152, 149, 0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = colors.yellow;
                            e.currentTarget.style.color = colors.darkBlue;
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 10px rgba(255, 201, 60, 0.3)';
                        }}
                        disabled={formSubmitting}
                    >
                        {formSubmitting ? 'Création en cours...' : 'Créer le service →'}
                    </button>
                </div>
                
                <div style={styles.formFooter}>
                    Les champs marqués d'un <span style={styles.requiredStar}>*</span> sont obligatoires.
                </div>
            </form>
        </div>
    );
};

export default AddService;