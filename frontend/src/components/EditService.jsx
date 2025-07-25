import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    color: '#2c3e50',
    borderBottom: '2px solid #3498db',
    paddingBottom: '0.5rem',
    marginBottom: '2rem',
    fontSize: '1.8rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: '1rem',
  },
  input: {
    padding: '0.8rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    transition: 'border 0.3s ease',
  },
  textarea: {
    padding: '0.8rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    minHeight: '120px',
    resize: 'vertical',
    fontFamily: 'Arial, sans-serif',
  },
  fileInput: {
    padding: '1rem 0',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  checkbox: {
    width: '16px',
    height: '16px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  submitButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  }
};

const EditService = () => {
    const { id } = useParams(); // Récupérer l'ID du service depuis l'URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        is_available: true,
        images: []
    });
    
    // Charger les données du service existant
    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/services/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setFormData(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement du service:', error);
            }
        };
        fetchService();
    }, [id]);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleImageChange = (e) => {
        setFormData({ ...formData, images: e.target.files });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('is_available', formData.is_available);
        for (let i = 0; i < formData.images.length; i++) {
            data.append('images', formData.images[i]);
        }
        
        try {
            await axios.put(`http://localhost:8000/api/services/${id}/`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            alert('Service modifié avec succès !');
            navigate('/prestataire/my-services'); // Rediriger vers la liste des services
        } catch (error) {
            console.error('Erreur lors de la modification du service:', error);
        }
    };
    
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Modifier le service</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nom du service</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        style={styles.input}
                    />
                </div>
                
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Description</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required 
                        style={styles.textarea}
                    />
                </div>
                
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Prix (€)</label>
                    <input 
                        type="number" 
                        name="price" 
                        value={formData.price} 
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Images</label>
                    <input 
                        type="file" 
                        name="images" 
                        multiple 
                        onChange={handleImageChange}
                        style={styles.fileInput}
                    />
                </div>
                
                <div style={styles.checkboxContainer}>
                    <input 
                        type="checkbox" 
                        name="is_available" 
                        checked={formData.is_available} 
                        onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                        style={styles.checkbox}
                    />
                    <label style={styles.label}>Disponible</label>
                </div>
                
                <div style={styles.buttonContainer}>
                    <button type="submit" style={styles.submitButton}>
                        Enregistrer les modifications
                    </button>
                    <button 
                        type="button" 
                        style={styles.cancelButton}
                        onClick={() => navigate('/prestataire/my-services')}
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditService;