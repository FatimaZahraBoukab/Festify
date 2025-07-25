import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

// Composants icônes restent inchangés
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const ServiceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const BookingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const PrestataireDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    averageRating: 0,
    pendingBookings: 0
  });
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Nouvelle palette de couleurs
  const colors = {
    // Jaune nude
    primary: '#E9BD6C',
    primaryLight: '#F2D9A9',
    primaryDark: '#D5A64C',
    
    // Bleu
    secondary: '#2A5B9F',
    secondaryLight: '#5A7EB9',
    secondaryDark: '#1D3A65',
    
    // Couleurs de support
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    mediumGray: '#E0E0E0',
    darkGray: '#757575',
    black: '#212121',
    
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
    
    // Couleur de fond
    background: '#F9F6F2'
  };

  // Styles améliorés
  const styles = {
    dashboardContainer: {
      display: 'flex',
      minHeight: '100vh',
      position: 'relative',
      backgroundColor: colors.background,
      fontFamily: "'Poppins', sans-serif",
    },
    sidebar: {
      width: '250px',
      background: `linear-gradient(135deg, ${colors.secondaryDark} 0%, ${colors.secondary} 100%)`,
      color: colors.white,
      height: '100vh',
      position: 'fixed',
      transition: 'width 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)',
      borderRadius: '0 15px 15px 0',
    },
    sidebarCollapsed: {
      width: '70px',
    },
    sidebarHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '25px 20px',
      borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
    },
    sidebarHeaderH2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: colors.primary,
      margin: 0,
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
    },
    toggleSidebarButton: {
      background: 'none',
      border: 'none',
      color: colors.white,
      cursor: 'pointer',
      fontSize: '1.2rem',
      transition: 'all 0.3s',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    notificationsDropdown: {
      position: 'absolute',
      top: '50px',
      right: '0',
      width: '350px',
      backgroundColor: colors.white,
      borderRadius: '10px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
    },
    notificationsHeader: {
      padding: '15px',
      borderBottom: `1px solid ${colors.mediumGray}`,
      '& h4': {
        margin: 0,
        color: colors.secondaryDark,
      }
    },
    notificationsList: {
      maxHeight: '400px',
      overflowY: 'auto',
    },
    notificationItem: {
      padding: '15px',
      borderBottom: `1px solid ${colors.lightGray}`,
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: colors.primaryLight + '20',
      }
    },
    notificationText: {
      fontSize: '0.9rem',
      color: colors.black,
      marginBottom: '5px',
    },
    notificationDate: {
      fontSize: '0.8rem',
      color: colors.darkGray,
    },
    noNotifications: {
      padding: '20px',
      textAlign: 'center',
      color: colors.darkGray,
    },
    userAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: colors.primaryLight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      marginRight: '10px',
      color: colors.secondaryDark,
      border: `2px solid ${colors.white}`,
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    sidebarNav: {
      flex: 1,
      padding: '20px 0',
      overflowY: 'auto',
    },
    navItem: {
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s',
      marginBottom: '8px',
      borderRadius: '0 30px 30px 0',
      position: 'relative',
    },
    navItemHover: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    navItemActive: {
      backgroundColor: colors.primary,
      color: colors.secondaryDark,
      fontWeight: 600,
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      '&::before': {
        content: "''",
        position: 'absolute',
        left: 0,
        top: 0,
        width: '4px',
        height: '100%',
        backgroundColor: colors.white,
        borderRadius: '0 2px 2px 0',
      }
    },
    navIcon: {
      display: 'flex',
      alignItems: 'center',
      marginRight: '15px',
      width: '22px',
      height: '22px',
      justifyContent: 'center',
    },
    navTitle: {
      whiteSpace: 'nowrap',
      fontWeight: 500,
      fontSize: '0.95rem',
    },
    sidebarFooter: {
      padding: '20px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    },
    logoutButtonSidebar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      border: 'none',
      color: colors.white,
      padding: '10px',
      width: '100%',
      cursor: 'pointer',
      transition: 'all 0.3s',
      borderRadius: '8px',
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    logoutButtonSidebarHover: {
      backgroundColor: 'rgba(244, 67, 54, 0.8)',
    },
    logoutIcon: {
      display: 'flex',
      marginRight: '10px',
    },
    mainContent: {
      flex: 1,
      marginLeft: '250px',
      transition: 'margin-left 0.3s ease-in-out',
      backgroundColor: colors.background,
    },
    mainContentCollapsed: {
      marginLeft: '70px',
    },
    dashboardHeader: {
      height: '70px',
      backgroundColor: colors.white,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 30px',
      position: 'sticky',
      top: 0,
      zIndex: 99,
      borderRadius: '0 0 15px 15px',
    },
    headerLeftH1: {
      fontSize: '1.5rem',
      color: colors.secondary,
      fontWeight: 600,
      margin: 0,
      position: 'relative',
      paddingBottom: '5px',
      '&::after': {
        content: "''",
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '30px',
        height: '3px',
        backgroundColor: colors.primary,
        borderRadius: '2px',
      }
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
    },
    notificationBell: {
      marginRight: '20px',
      position: 'relative',
      cursor: 'pointer',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: colors.lightGray,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s',
      '&:hover': {
        backgroundColor: colors.primaryLight,
      }
    },
    notificationBadge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      backgroundColor: colors.danger,
      color: colors.white,
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      fontSize: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 600,
      border: `2px solid ${colors.white}`,
    },
    dashboardContent: {
      padding: '30px',
    },
    statsCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    statCard: {
      backgroundColor: colors.white,
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.3s',
      border: `1px solid ${colors.mediumGray}`,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: "''",
        position: 'absolute',
        top: 0,
        left: 0,
        width: '5px',
        height: '100%',
        backgroundColor: 'var(--accent-color, ' + colors.primary + ')',
        transition: 'all 0.3s',
      },
      '&:hover::before': {
        width: '10px',
      }
    },
    statCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    },
    statIcon: {
      width: '60px',
      height: '60px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '20px',
      color: colors.white,
      background: 'var(--accent-gradient, linear-gradient(135deg, ' + colors.primary + ' 0%, ' + colors.primaryDark + ' 100%))',
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    },
    serviceIcon: {
      '--accent-color': colors.secondary,
      '--accent-gradient': `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryDark} 100%)`,
    },
    bookingIcon: {
      '--accent-color': colors.primary,
      '--accent-gradient': `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
    },
    pendingIcon: {
      '--accent-color': colors.warning,
      '--accent-gradient': `linear-gradient(135deg, ${colors.warning} 0%, #E68900 100%)`,
    },
    ratingIcon: {
      '--accent-color': colors.success,
      '--accent-gradient': `linear-gradient(135deg, ${colors.success} 0%, #348C38 100%)`,
    },
    statDetailsH3: {
      fontSize: '0.9rem',
      color: colors.darkGray,
      marginBottom: '8px',
      fontWeight: 500,
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 700,
      color: colors.secondary,
      display: 'flex',
      alignItems: 'baseline',
    },
    star: {
      color: '#F59E0B',
      marginLeft: '5px',
      fontSize: '1.5rem',
    },
    gold: {
      color: '#F59E0B',
    },
    dashboardSection: {
      backgroundColor: colors.white,
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
      marginBottom: '30px',
      padding: '25px',
      border: `1px solid ${colors.mediumGray}`,
      position: 'relative',
      overflow: 'hidden',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      padding: '0 0 15px 0',
      borderBottom: `1px solid ${colors.mediumGray}`,
    },
    sectionHeaderH2: {
      fontSize: '1.3rem',
      color: colors.secondary,
      fontWeight: 600,
      margin: 0,
      position: 'relative',
      display: 'inline-block',
      '&::after': {
        content: "''",
        position: 'absolute',
        left: 0,
        bottom: '-15px',
        width: '50px',
        height: '3px',
        backgroundColor: colors.primary,
        borderRadius: '2px',
      }
    },
    viewAllButton: {
      backgroundColor: 'transparent',
      color: colors.secondary,
      border: `2px solid ${colors.secondary}`,
      padding: '8px 20px',
      borderRadius: '30px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontFamily: "'Poppins', sans-serif",
      fontWeight: 500,
      fontSize: '0.9rem',
    },
    viewAllButtonHover: {
      backgroundColor: colors.secondary,
      color: colors.white,
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.1)',
    },
    servicesCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '25px',
    },
    serviceCard: {
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s',
      backgroundColor: colors.white,
      border: `1px solid ${colors.mediumGray}`,
    },
    serviceCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 25px rgba(0, 0, 0, 0.1)',
      borderColor: colors.primary,
    },
    serviceImage: {
      height: '180px',
      position: 'relative',
      overflow: 'hidden',
    },
    serviceImageImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s',
    },
    serviceImageImgHover: {
      transform: 'scale(1.05)',
    },
    servicePrice: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      backgroundColor: colors.secondary,
      color: colors.white,
      padding: '8px 15px',
      borderRadius: '30px',
      fontWeight: 600,
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
      fontSize: '0.9rem',
    },
    serviceInfo: {
      padding: '20px',
    },
    serviceInfoH3: {
      marginBottom: '15px',
      fontSize: '1.1rem',
      fontWeight: 600,
      color: colors.secondaryDark,
    },
    serviceMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
      fontSize: '0.9rem',
      color: colors.darkGray,
    },
    serviceRating: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: 600,
      color: colors.secondary,
    },
    serviceBookings: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    serviceActions: {
      display: 'flex',
      gap: '10px',
    },
    editButton: {
      flex: 1,
      padding: '8px 15px',
      backgroundColor: colors.primaryLight,
      color: colors.primaryDark,
      border: 'none',
      borderRadius: '8px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontFamily: "'Poppins', sans-serif",
      '&:hover': {
        backgroundColor: colors.primary,
        color: colors.white,
      }
    },
    viewButton: {
      flex: 1,
      padding: '8px 15px',
      backgroundColor: colors.secondaryLight,
      color: colors.white,
      border: 'none',
      borderRadius: '8px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontFamily: "'Poppins', sans-serif",
      '&:hover': {
        backgroundColor: colors.secondary,
      }
    },
    // Styles pour le tableau des réservations
    bookingsTableContainer: {
      overflowX: 'auto',
      borderRadius: '10px',
      backgroundColor: colors.white,
    },
    bookingsTable: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0',
      fontSize: '0.95rem',
    },
    bookingStatus: {
      padding: '5px 10px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: 500,
      backgroundColor: colors.success + '20',
      color: colors.success,
      display: 'inline-block',
    },
    bookingStatusPending: {
      backgroundColor: colors.warning + '20',
      color: colors.warning,
    },
    bookingActions: {
      display: 'flex',
      gap: '5px',
      justifyContent: 'center',
    },
    btnSmall: {
      padding: '5px 10px',
      borderRadius: '5px',
      fontSize: '0.8rem',
      border: 'none',
      backgroundColor: colors.secondaryLight,
      color: colors.white,
      cursor: 'pointer',
      transition: 'all 0.3s',
      '&:hover': {
        backgroundColor: colors.secondary,
      }
    },
    btnSmallConfirm: {
      padding: '5px 10px',
      borderRadius: '5px',
      fontSize: '0.8rem',
      border: 'none',
      backgroundColor: colors.success + '20',
      color: colors.success,
      cursor: 'pointer',
      transition: 'all 0.3s',
      '&:hover': {
        backgroundColor: colors.success,
        color: colors.white,
      }
    },
    // Style pour le loader
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: colors.background,
    },
    loader: {
      border: `4px solid ${colors.mediumGray}`,
      borderTop: `4px solid ${colors.primary}`,
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px',
      '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      }
    },
    // Styles pour les th du tableau
    tableHeader: {
      textAlign: 'left',
      padding: '15px',
      borderBottom: `2px solid ${colors.mediumGray}`,
      color: colors.secondary,
      fontWeight: 600,
    },
    // Styles pour les td du tableau
    tableCell: {
      padding: '15px',
      borderBottom: `1px solid ${colors.mediumGray}`,
      color: colors.black,
    },
    // Style pour le hover des lignes du tableau
    tableRowHover: {
      backgroundColor: colors.primaryLight + '30',
    },
  };

  useEffect(() => {

    

    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      navigate('/prestataire/login');
      return;
    }
    
    try {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.username);
      
      // Charger les données du prestataire
      fetchData();
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      navigate('/prestataire/login');
    }
    }, [navigate]);
    const [profilePicture, setProfilePicture] = useState(null);
    const fetchData = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    
    // Récupération du profil prestataire
    const profileResponse = await axios.get('http://localhost:8000/api/provider/profile/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Récupération des services du prestataire
    const servicesResponse = await axios.get('http://localhost:8000/api/services/', {
      params: { provider: profileResponse.data.id },
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    // Récupération des réservations pour le prestataire
    const bookingsResponse = await axios.get('http://localhost:8000/api/bookings/', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    // Calcul des statistiques
    const pendingBookings = bookingsResponse.data.filter(
      b => b.status === "pending"
    ).length;

    setServices(servicesResponse.data);
    setBookings(bookingsResponse.data);
    setStats({
      totalServices: servicesResponse.data.length,
      totalBookings: bookingsResponse.data.length,
      pendingBookings,
      averageRating: profileResponse.data.average_rating || 0
    });

    setIsLoading(false);
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  }
};
const handleCancelBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem('accessToken');
    await axios.post(
      `http://localhost:8000/api/bookings/${bookingId}/cancel/`, 
      {},
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    // Mettre à jour l'état local
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
    ));
    
    // Mettre à jour les stats
    setStats(prev => ({
      ...prev,
      pendingBookings: prev.pendingBookings - 1
    }));
  } catch (error) {
    console.error('Error cancelling booking:', error);
  }
};
  const handleConfirmBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem('accessToken');
    await axios.post(
      `http://localhost:8000/api/bookings/${bookingId}/confirm/`, 
      {},
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    // Mettre à jour l'état local
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
    ));
    
    // Mettre à jour les stats
    setStats(prev => ({
      ...prev,
      pendingBookings: prev.pendingBookings - 1
    }));
  } catch (error) {
    console.error('Error confirming booking:', error);
  }
};
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/prestataire/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={{ color: colors.secondary, fontWeight: 500 }}>Chargement de votre espace prestataire...</p>
      </div>
    );
  }
  
  const navigationItems = [
    {
      title: "Tableau de bord",
      icon: <DashboardIcon />,
      path: "/prestataire/dashboard",
      section: "dashboard"
    },
    {
      title: "Mes Services",
      icon: <ServiceIcon />,
      path: "/prestataire/my-services",
      section: "services"
    },
    {
      title: "Réservations",
      icon: <BookingIcon />,
      path: "/prestataire/bookings",
      section: "bookings"
    },
    {
      title: "Mon Profil",
      icon: <ProfileIcon />,
      path: "/prestataire/profile",
      section: "profile"
    },
    {
      title: "Ajouter un Service",
      icon: <AddIcon />,
      path: "/prestataire/add-service",
      section: "add-service"
    }
  ];
  const notificationStyles = {
  // Conteneur principal des notifications
  notificationsDropdown: {
    position: 'absolute',
    top: '50px',
    right: '0',
    width: '350px',
    backgroundColor: colors.white,
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    overflow: 'hidden',
    transform: 'translateY(10px)',
    opacity: 0,
    animation: 'fadeIn 0.3s ease forwards',
    border: `1px solid ${colors.mediumGray}`,
  },
  
  // En-tête des notifications
  notificationsHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${colors.mediumGray}`,
    backgroundColor: colors.lightGray,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  notificationsHeaderTitle: {
    margin: 0,
    color: colors.secondaryDark,
    fontSize: '1rem',
    fontWeight: 600,
  },
  
  // Bouton de fermeture
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: colors.darkGray,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    transition: 'all 0.2s',
    padding: 0,
  },
  
  // Liste des notifications
  notificationsList: {
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '8px 0',
  },
  
  // Élément de notification individuel
  notificationItem: {
    padding: '15px 20px',
    borderBottom: `1px solid ${colors.lightGray}`,
    transition: 'background-color 0.2s',
    cursor: 'pointer',
    position: 'relative',
    animation: 'slideIn 0.3s ease forwards',
  },
  
  // Indicateur de notification non lue
  unreadIndicator: {
    position: 'absolute',
    left: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: colors.primary,
  },
  
  // Conteneur du contenu de la notification
  notificationContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
  },
  
  // Icône de la notification
  notificationIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: colors.primaryLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  
  // Texte de la notification
  notificationText: {
    fontSize: '0.95rem',
    color: colors.black,
    marginBottom: '5px',
    lineHeight: '1.4',
    flex: 1,
  },
  
  // Emphase sur le texte important
  notificationTextBold: {
    fontWeight: 600,
    color: colors.secondaryDark,
  },
  
  // Date de la notification
  notificationDate: {
    fontSize: '0.8rem',
    color: colors.darkGray,
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  
  // Actions pour les notifications
  notificationActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
  },
  
  // Bouton d'action principal
  primaryAction: {
    backgroundColor: colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  
  // Bouton d'action secondaire
  secondaryAction: {
    backgroundColor: colors.lightGray,
    color: colors.darkGray,
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  
  // Message quand il n'y a pas de notifications
  noNotifications: {
    padding: '25px 20px',
    textAlign: 'center',
    color: colors.darkGray,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  
  // Icône pour l'état "pas de notifications"
  emptyIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: colors.lightGray,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  
  // Pied de page des notifications
  notificationsFooter: {
    padding: '12px 20px',
    borderTop: `1px solid ${colors.mediumGray}`,
    textAlign: 'center',
  },
  
  // Lien pour voir toutes les notifications
  viewAllLink: {
    color: colors.secondary,
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'color 0.2s',
  },
  
  // Animation pour l'apparition des notifications
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  
  // Animation pour l'apparition de chaque notification
  '@keyframes slideIn': {
    '0%': {
      opacity: 0,
      transform: 'translateX(-10px)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateX(0)',
    },
  },
};


  return (
    <div style={styles.dashboardContainer}>
      {/* Sidebar */}
      <div style={{ ...styles.sidebar, ...(isSidebarCollapsed && styles.sidebarCollapsed) }}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarHeaderH2}>{isSidebarCollapsed ? 'F' : 'Festify'}</h2>
          <button style={styles.toggleSidebarButton} onClick={toggleSidebar}>
            {isSidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        
        
        <nav style={styles.sidebarNav}>
          {navigationItems.map((item, index) => (
            <div 
              key={index}
              style={{
                ...styles.navItem,
                ...(activeSection === item.section && styles.navItemActive),
              }}
              onClick={() => {
                setActiveSection(item.section);
                navigate(item.path);
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {!isSidebarCollapsed && <span style={styles.navTitle}>{item.title}</span>}
            </div>
          ))}
        </nav>
        
        <div style={styles.sidebarFooter}>
          <button style={styles.logoutButtonSidebar} onClick={handleLogout}>
            <span style={styles.logoutIcon}><LogoutIcon /></span>
            {!isSidebarCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ ...styles.mainContent, ...(isSidebarCollapsed && styles.mainContentCollapsed) }}>
        {/* Header */}
        <header style={styles.dashboardHeader}>
          <div style={styles.headerLeft}>
            <h1 style={styles.headerLeftH1}>Tableau de Bord</h1>
          </div>
          <div style={styles.headerRight}>
          <div 
  style={styles.notificationBell} 
  onClick={() => setShowNotifications(!showNotifications)}
  role="button"
  aria-label="Notifications"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
  <span style={styles.notificationBadge}>{stats.pendingBookings}</span>
  
  {showNotifications && (
  <div style={notificationStyles.notificationsDropdown}>
    <div style={notificationStyles.notificationsHeader}>
      <h4 style={notificationStyles.notificationsHeaderTitle}>
        Notifications ({stats.pendingBookings})
      </h4>
      <button 
        style={notificationStyles.closeButton} 
        onClick={() => setShowNotifications(false)}
        aria-label="Fermer les notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <div style={notificationStyles.notificationsList}>
      {bookings.filter(b => b.status === "pending").map((booking, index) => (
        <div key={booking.id} style={{
          ...notificationStyles.notificationItem,
          animation: `slideIn ${0.2 + index * 0.1}s ease forwards`
        }}>
          <div style={notificationStyles.notificationContent}>
            <div style={notificationStyles.notificationIcon}>
              <BookingIcon />
            </div>
            <div>
              <div style={notificationStyles.notificationText}>
                <span style={notificationStyles.notificationTextBold}>
                  {booking.client?.username || 'Client'}
                </span> a réservé <span style={notificationStyles.notificationTextBold}>
                  {booking.service?.name || 'votre service'}
                </span> pour le <span style={notificationStyles.notificationTextBold}>
                  {new Date(booking.event?.date).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div style={notificationStyles.notificationDate}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {new Date(booking.created_at || Date.now()).toLocaleDateString('fr-FR')}
              </div>
              <div style={notificationStyles.notificationActions}>
                <button 
                  style={notificationStyles.primaryAction}
                  onClick={() => handleConfirmBooking(booking.id)}
                >
                  Confirmer
                </button>
                <button 
                  style={notificationStyles.secondaryAction}
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  Refuser
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {stats.pendingBookings === 0 && (
        <div style={notificationStyles.noNotifications}>
          <div style={notificationStyles.emptyIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          </div>
          Aucune nouvelle notification
        </div>
      )}
    </div>
    
    <div style={notificationStyles.notificationsFooter}>
      <Link to="/prestataire/bookings" style={notificationStyles.viewAllLink}>
        Voir toutes les réservations
      </Link>
    </div>
  </div>
)}
</div>
            <div style={styles.userAvatar}>
  {profilePicture ? (
    <img 
      src={profilePicture} 
      alt="Avatar" 
      style={{ 
        width: '100%', 
        height: '100%', 
        objectFit: 'cover', 
        borderRadius: '50%' 
      }}
    />
  ) : (
    // Afficher les initiales si pas d'image
    <span>{userName ? userName.charAt(0).toUpperCase() : '?'}</span>
  )}
</div>
          </div>
        </header>

        {/* Dashboard Overview */}
        <div style={styles.dashboardContent}>
          {/* Stats Cards */}
          <div style={styles.statsCards}>
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, ...styles.serviceIcon }}>
                <ServiceIcon />
              </div>
              <div style={styles.statDetails}>
                <h3 style={styles.statDetailsH3}>Total Services</h3>
                <p style={styles.statValue}>{stats.totalServices}</p>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, ...styles.bookingIcon }}>
                <BookingIcon />
              </div>
              <div style={styles.statDetails}>
                <h3 style={styles.statDetailsH3}>Réservations</h3>
                <p style={styles.statValue}>{stats.totalBookings}</p>
              </div>
            </div>
            
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, ...styles.pendingIcon }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div style={styles.statDetails}>
                <h3 style={styles.statDetailsH3}>En attente</h3>
                <p style={styles.statValue}>{stats.pendingBookings}</p>
              </div>
            </div>
            
            
          </div>

          {/* Recent Services */}
          <div style={styles.dashboardSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionHeaderH2}>Vos services récents</h2>
              <button style={styles.viewAllButton} onClick={() => navigate('/prestataire/my-services')}>
                Voir tout
              </button>
            </div>
            
            <div style={styles.servicesCards}>
            {services.map(service => (
  <div key={service.id} style={styles.serviceCard}>
    <div style={styles.serviceImage}>
      {service.images && service.images.length > 0 ? (
        <img 
          src={service.images[0].image_url} 
          alt={service.name} 
          style={styles.serviceImageImg} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-service.jpg';
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: colors.lightGray,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.darkGray
        }}>
          Aucune image
        </div>
      )}
      <div style={styles.servicePrice}>{service.price} €</div>
    </div>
    <div style={styles.serviceInfo}>
      <h3 style={styles.serviceInfoH3}>{service.name}</h3>
      <div style={styles.serviceActions}>
        <button 
          style={styles.editButton}
          onClick={() => navigate(`/prestataire/edit-service/${service.id}`)}
        >
          Modifier
        </button>
      </div>
    </div>
  </div>
))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div style={styles.dashboardSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionHeaderH2}>Réservations récentes</h2>
              <button style={styles.viewAllButton} onClick={() => navigate('/prestataire/bookings')}>
                Voir tout
              </button>
            </div>
            
            <div style={styles.bookingsTableContainer}>
              <table style={styles.bookingsTable}>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Action</th>
                  </tr>
                </thead>
<tbody>
  {bookings.map(booking => (
    <tr key={booking.id}>
      <td>{booking.client?.username || 'Inconnu'}</td>
      <td>{booking.service?.name || 'Service inconnu'}</td>
      <td>{new Date(booking.event?.date).toLocaleDateString('fr-FR')}</td>
      <td>{booking.service?.price || '0'} €</td>
      <td>
        <span style={{ 
          ...styles.bookingStatus, 
          ...(booking.status === "pending" && styles.bookingStatusPending),
          ...(booking.status === "cancelled" && {backgroundColor: colors.danger + '20', color: colors.danger})
        }}>
          {booking.status === "confirmed" ? "Confirmée" : 
           booking.status === "pending" ? "En attente" : 
           booking.status === "cancelled" ? "Annulée" : booking.status}
        </span>
      </td>
      <td>
  <div style={styles.bookingActions}>
    <button 
      style={styles.btnSmall}
      onClick={() => navigate(`/prestataire/bookings/${booking.id}`)}
    >
      Détails
    </button>
    {booking.status === "pending" && (
      <>
        <button 
          style={styles.btnSmallConfirm}
          onClick={() => handleConfirmBooking(booking.id)}
        >
          Confirmer
        </button>
        <button 
          style={{ 
            ...styles.btnSmall,
            backgroundColor: colors.danger + '20',
            color: colors.danger,
            '&:hover': {
              backgroundColor: colors.danger,
              color: colors.white
            }
          }}
          onClick={() => handleCancelBooking(booking.id)}
        >
          Refuser
        </button>
      </>
    )}
  </div>
</td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrestataireDashboard;