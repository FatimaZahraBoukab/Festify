import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Palette de couleurs raffinée jaune-bleu-nude (harmonisée avec AddService)
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

// Styles élégants pour la page des réservations
const styles = {
  container: {
    maxWidth: '1200px',
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
    marginBottom: '2rem',
    fontSize: '2.4rem',
    fontWeight: '600',
    letterSpacing: '0.8px',
    position: 'relative',
    textShadow: '1px 1px 0px rgba(26, 95, 122, 0.05)',
  },
  subheading: {
    color: colors.textLight,
    fontSize: '1.1rem',
    marginTop: '-1rem',
    marginBottom: '2rem',
    fontWeight: '400',
    maxWidth: '800px',
  },
  tableContainer: {
    backgroundColor: colors.white,
    padding: '1.5rem',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.04)',
    border: `1px solid ${colors.border}`,
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    fontSize: '0.95rem',
  },
  tableHead: {
    backgroundColor: colors.darkBlue,
    color: colors.white,
    fontWeight: '600',
    fontSize: '1rem',
    letterSpacing: '0.5px',
  },
  tableHeadCell: {
  padding: '1.2rem 1rem',
  textAlign: 'left',
  position: 'relative',
  // Supprimez les pseudo-classes
},

// Et ajoutez ces styles spécifiques dans votre composant :
firstTableHeadCell: {
  borderTopLeftRadius: '10px',
},
lastTableHeadCell: {
  borderTopRightRadius: '10px',
},
  tableBody: {
    backgroundColor: colors.white,
  },
  tableRow: {
    borderBottom: `1px solid ${colors.border}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: `${colors.lightBlue}20`,
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  tableCell: {
    padding: '1.2rem 1rem',
    verticalAlign: 'middle',
    color: colors.textDark,
    position: 'relative',
  },
  statusBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '0.85rem',
    display: 'inline-block',
    textAlign: 'center',
    minWidth: '120px',
  },
  pendingBadge: {
    backgroundColor: `${colors.softYellow}90`,
    color: colors.darkBlue,
    border: `1.5px solid ${colors.yellow}`,
  },
  confirmedBadge: {
    backgroundColor: 'rgba(56, 161, 105, 0.1)',
    color: colors.success,
    border: `1.5px solid ${colors.success}`,
  },
  cancelledBadge: {
    backgroundColor: 'rgba(229, 62, 62, 0.1)',
    color: colors.cancel,
    border: `1.5px solid ${colors.cancel}`,
  },
  actionButton: {
    padding: '0.5rem 1rem',
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginRight: '0.5rem',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  confirmButton: {
    backgroundColor: colors.success,
    color: colors.white,
    '&:hover': {
      backgroundColor: '#2F855A',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(56, 161, 105, 0.3)',
    },
  },
  cancelButton: {
    backgroundColor: colors.cancel,
    color: colors.white,
    '&:hover': {
      backgroundColor: '#C53030',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(229, 62, 62, 0.3)',
    },
  },
  noBookings: {
    backgroundColor: `${colors.lightBlue}30`,
    padding: '2rem',
    borderRadius: '10px',
    textAlign: 'center',
    color: colors.textDark,
    fontWeight: '500',
    fontSize: '1.1rem',
    border: `1px dashed ${colors.mediumBlue}50`,
    margin: '2rem 0',
  },
  noBookingsIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    color: colors.mediumBlue,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    flexDirection: 'column',
    gap: '1rem',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: `4px solid ${colors.border}`,
    borderTopColor: colors.mediumBlue,
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: colors.textLight,
    fontWeight: '500',
    fontSize: '1rem',
  },
  errorContainer: {
    padding: '1.5rem',
    backgroundColor: 'rgba(229, 62, 62, 0.1)',
    border: `1.5px solid ${colors.cancel}`,
    borderRadius: '10px',
    color: colors.textDark,
    fontWeight: '500',
    margin: '2rem 0',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  errorIcon: {
    color: colors.cancel,
    fontSize: '1.5rem',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  dateCell: {
    fontWeight: '500',
    color: colors.darkBlue,
  },
  eventCell: {
    fontWeight: '500',
  },
  serviceCell: {
    fontWeight: '500',
    color: colors.textDark,
  },
  clientCell: {
    fontWeight: '500',
    color: colors.mediumBlue,
  },
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const decoded = jwtDecode(token);
        setUserRole(decoded.role);

        const response = await axios.get('http://localhost:8000/api/bookings/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Ajustement pour la structure de données du backend
        const bookingsData = response.data.map(booking => ({
          ...booking,
          event: booking.event || {},
          service: booking.service || {},
          provider: booking.provider || {}
        }));

        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Impossible de charger les réservations. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const handleStatusChange = async (bookingId, newStatus) => {
    const action = newStatus === 'confirmed' ? 'confirmer' : 'refuser';
    if (!window.confirm(`Êtes-vous sûr de vouloir ${action} cette réservation ?`)) {
        return;
    }
    try {
        const token = localStorage.getItem('accessToken');
        let endpoint = '';
        
        if (newStatus === 'confirmed') {
            endpoint = `http://localhost:8000/api/bookings/${bookingId}/confirm/`;
        } else if (newStatus === 'cancelled') {
            endpoint = `http://localhost:8000/api/bookings/${bookingId}/cancel/`;
        }

        await axios.post(endpoint, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        setBookings(bookings.map(booking => 
            booking.id === bookingId ? { ...booking, status: newStatus } : booking
        ));
    } catch (error) {
        console.error(`Error updating booking status to ${newStatus}:`, error);
        setError(`Échec de la mise à jour du statut. ${error.response?.data?.message || ''}`);
    }
};

  const renderStatusBadge = (status) => {
    let badgeStyle = styles.statusBadge;
    let statusText = '';

    switch (status) {
      case 'confirmed':
        badgeStyle = {...badgeStyle, ...styles.confirmedBadge};
        statusText = 'Confirmée';
        break;
      case 'cancelled':
        badgeStyle = {...badgeStyle, ...styles.cancelledBadge};
        statusText = 'Annulée';
        break;
      default:
        badgeStyle = {...badgeStyle, ...styles.pendingBadge};
        statusText = 'En attente';
    }

    return <span style={badgeStyle}>{statusText}</span>;
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Réservations</h1>
        <div style={styles.errorContainer}>
          <span style={styles.errorIcon}>⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>
        {userRole === 'prestataire' ? 'Réservations reçues' : 'Vos Réservations'}
      </h1>

      {bookings.length === 0 ? (
        <div style={styles.noBookings}>
          <div style={styles.noBookingsIcon}>📅</div>
          <p>Aucune réservation trouvée</p>
          {userRole !== 'prestataire' && (
            <p style={{fontSize: '0.9rem', marginTop: '0.5rem', color: colors.textLight}}>
              Explorez notre catalogue de services pour trouver des prestataires pour vos événements.
            </p>
          )}
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
        <thead style={styles.tableHead}>
  <tr>
    <th style={{...styles.tableHeadCell, ...styles.firstTableHeadCell}}>Service</th>
    {userRole === 'prestataire' && <th style={styles.tableHeadCell}>Client</th>}
    <th style={styles.tableHeadCell}>Événement</th>
    <th style={styles.tableHeadCell}>Date</th>
    <th style={styles.tableHeadCell}>Statut</th>
    {userRole === 'prestataire' && <th style={{...styles.tableHeadCell, ...styles.lastTableHeadCell}}>Actions</th>}
  </tr>
</thead>
            <tbody style={styles.tableBody}>
              {bookings.map(booking => (
                <tr key={booking.id} style={styles.tableRow}>
                  <td style={{...styles.tableCell, ...styles.serviceCell}}>
                    {booking.service?.name || 'Non spécifié'}
                  </td>
                  {userRole === 'prestataire' && (
                    <td style={{...styles.tableCell, ...styles.clientCell}}>
                      {booking.event?.organizer?.username || 'Client inconnu'}
                    </td>
                  )}
                  <td style={{...styles.tableCell, ...styles.eventCell}}>
                    {booking.event?.name || 'Événement inconnu'}
                  </td>
                  <td style={{...styles.tableCell, ...styles.dateCell}}>
                    {booking.event?.date 
                      ? new Date(booking.event.date).toLocaleDateString('fr-FR', {
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric'
                        })
                      : 'Date inconnue'}
                  </td>
                  <td style={styles.tableCell}>
                    {renderStatusBadge(booking.status)}
                  </td>
{userRole === 'prestataire' && (
  <td style={styles.tableCell}>
    <div style={{ display: 'flex', gap: '8px' }}>
      {booking.status === 'pending' ? (
        <>
          <button
            onClick={() => handleStatusChange(booking.id, 'confirmed')}
            style={{
              ...styles.actionButton,
              ...styles.confirmButton,
              padding: '6px 12px',
              fontSize: '0.8rem'
            }}
          >
            Confirmer
          </button>
          <button
            onClick={() => handleStatusChange(booking.id, 'cancelled')}
            style={{
              ...styles.actionButton,
              ...styles.cancelButton,
              padding: '6px 12px',
              fontSize: '0.8rem'
            }}
          >
            Refuser
          </button>
        </>
      ) : (
        <span style={{
          color: booking.status === 'confirmed' ? colors.success : colors.cancel,
          fontWeight: '500',
          fontSize: '0.9rem'
        }}>
          {booking.status === 'confirmed' ? 'Confirmée' : 'Refusée'}
        </span>
      )}
    </div>
  </td>
)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;