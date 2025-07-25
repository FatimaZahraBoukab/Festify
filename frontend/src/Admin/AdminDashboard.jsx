"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./AdminDashboard.css"
import api from "../services/api"

// Imports pour les composants de gestion
import UsersManagement from "./components/UsersManagement"
import ProvidersManagement from "./components/ProvidersManagement"
import MessagesManagement from "./components/MessagesManagement"
import Statistics from "./components/Statistics"

// Composants icônes
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
)

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
)

const ProvidersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
    <path d="M21 12h-4"></path>
    <path d="M17 10v4"></path>
  </svg>
)

const MessagesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
  </svg>
);
const StatsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
)

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [adminName, setAdminName] = useState("Admin")
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [providers, setProviders] = useState([])
  const [bookings, setBookings] = useState([])
  const [messages, setMessages] = useState([]) // Nouvel état pour les messages
  const [usersWithDates, setUsersWithDates] = useState([])
  const [providersWithDetails, setProvidersWithDetails] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalMessages: 0, // Ajout du compteur de messages
    averageRating: 0,
  })
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")

  useEffect(() => {
    const token = localStorage.getItem("adminToken")

    if (!token) {
      // Pour le développement, on simule l'authentification
      fetchData()
      return
    }

    try {
      // Charger les données de l'administrateur
      fetchData()
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error)
    }
  }, [])

  // Traitement des utilisateurs avec dates de création
  useEffect(() => {
    if (users && users.length > 0) {
      // Créer une copie des utilisateurs avec des dates d'inscription
      const enhancedUsers = users.map((user) => {
        // Utiliser la date existante ou en générer une aléatoire si elle n'existe pas
        let date_joined = user.date_joined

        if (!date_joined) {
          const today = new Date()
          const twoYearsAgo = new Date()
          twoYearsAgo.setFullYear(today.getFullYear() - 2)
          const randomTimestamp = twoYearsAgo.getTime() + Math.random() * (today.getTime() - twoYearsAgo.getTime())
          date_joined = new Date(randomTimestamp).toISOString()
        }

        return {
          ...user,
          date_joined,
          username: user.username || user.name || "",
          email: user.email || "",
          is_active: user.is_active !== undefined ? user.is_active : true,
        }
      })

      setUsersWithDates(enhancedUsers)
    }
  }, [users])

  // Traitement des prestataires avec détails
  useEffect(() => {
    if (providers && providers.length > 0) {
      const enhancedProviders = providers.map((provider) => {
        return {
          ...provider,
          id: provider.id,
          description: provider.description || "Aucune description disponible",
          contact: provider.contact || "N/A",
          entreprise: provider.entreprise || provider.name || "N/A",
          service: provider.service || "N/A",
          user_id: provider.user_id,
          is_active: provider.is_active !== undefined ? provider.is_active : true,
        }
      })

      setProvidersWithDetails(enhancedProviders)
    }
  }, [providers])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Récupérer les données réelles depuis l'API
      const [usersResponse, providersResponse, bookingsResponse, messagesResponse] = await Promise.all([
        api.get("users/"),
        api.get("providers/"),
        api.get("bookings/"),
        api.get("contacts/"), // Ajout de la récupération des messages
      ])

      // Mettre à jour les états avec les données réelles
      setUsers(usersResponse.data)
      setProviders(providersResponse.data)
      setBookings(bookingsResponse.data)
      setMessages(messagesResponse.data) // Stockage des messages

      // Calculer les statistiques
      const totalUsers = usersResponse.data.length
      const totalProviders = providersResponse.data.length
      const totalBookings = bookingsResponse.data.length
      const totalMessages = messagesResponse.data.length // Comptage des messages
      const averageRating =
        providersResponse.data.length > 0
          ? providersResponse.data.reduce((sum, provider) => sum + (provider.rating || 0), 0) /
            providersResponse.data.length
          : 0

      setStats({
        totalUsers,
        totalProviders,
        totalBookings,
        totalMessages, // Ajout du nombre de messages aux stats
        averageRating: averageRating.toFixed(1),
      })

      setIsLoading(false)
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    window.location.href = "/admin/login"
    console.log("Déconnexion effectuée")
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed)
  }

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Date invalide"

      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch (error) {
      console.error("Erreur de formatage de date:", error)
      return "Date invalide"
    }
  }

  // Fonction pour tronquer le texte
  const truncateText = (text, maxLength = 50) => {
    if (!text) return "N/A"
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Fonction pour gérer les messages (marquer comme lu)
  const handleMarkAsRead = async (message) => {
    try {
      await api.put(`contacts/${message.id}/`, {
        ...message,
        is_read: true,
      });
      fetchData(); // Recharger les données après mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  // Fonction pour gérer la suppression des messages
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;
    try {
      await api.delete(`contacts/${id}/`);
      fetchData(); // Recharger les données après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du message:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Chargement de votre espace administrateur...</p>
      </div>
    )
  }

  const navigationItems = [
    {
      title: "Tableau de bord",
      icon: <DashboardIcon />,
      section: "dashboard",
    },
    {
      title: "Utilisateurs",
      icon: <UsersIcon />,
      section: "users",
    },
    {
      title: "Prestataires",
      icon: <ProvidersIcon />,
      section: "providers",
    },
    {
      title: "Boîte de Réception",
      icon: <MessagesIcon />,
      section: "messages",
    },
    
    {
      title: "Statistiques",
      icon: <StatsIcon />,
      section: "stats",
    },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            {/* Stats Cards */}
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon users-icon">
                  <UsersIcon />
                </div>
                <div className="stat-details">
                  <h3 className="stat-title">Total Utilisateurs</h3>
                  <p className="stat-value">{stats.totalUsers}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon providers-icon">
                  <ProvidersIcon />
                </div>
                <div className="stat-details">
                  <h3 className="stat-title">Prestataires</h3>
                  <p className="stat-value">{stats.totalProviders}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon bookings-icon">
                  <MessagesIcon />
                </div>
                <div className="stat-details">
                  <h3 className="stat-title">Messages</h3>
                  <p className="stat-value">{stats.totalMessages}</p>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Utilisateurs récents</h2>
                <button className="view-all-button" onClick={() => setActiveSection("users")}>
                  Voir tout
                </button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersWithDates.slice(0, 3).map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email || "N/A"}</td>
                        <td>
                          <div className="action-buttons">
                            <button className="action-button" onClick={() => handleUserEdit(user)}>
                              Modifier
                            </button>
                            <button className="action-button delete-button" onClick={() => handleUserDelete(user.id)}>
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Providers */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Prestataires récents</h2>
                <button className="view-all-button" onClick={() => setActiveSection("providers")}>
                  Voir tout
                </button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Entreprise</th>
                      <th>Service</th>
                      <th>Description</th>
                      <th>Contact</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providersWithDetails.slice(0, 3).map((provider) => (
                      <tr key={provider.id} className={!provider.is_active ? "inactive-row" : ""}>
                        <td>{provider.id}</td>
                        <td>{provider.entreprise}</td>
                        <td>{provider.service}</td>
                        <td>{truncateText(provider.description)}</td>
                        <td>{provider.contact}</td>
                        <td>
                          <span className={`status-badge ${provider.is_active ? "status-active" : "status-inactive"}`}>
                            {provider.is_active ? "Actif" : "Inactif"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="action-button" onClick={() => handleProviderEdit(provider)}>
                              Modifier
                            </button>
                            <button
                              className={`action-button ${provider.is_active ? "delete-button" : "verify-button"}`}
                              onClick={() => handleProviderDelete(provider.id)}
                            >
                              {provider.is_active ? "Désactiver" : "Réactiver"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Messages - Remplace le tableau de réservations */}
            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Messages récents</h2>
                <button className="view-all-button" onClick={() => setActiveSection("messages")}>
                  Voir tout
                </button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Sujet</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.slice(0, 3).map((msg) => (
                      <tr key={msg.id}>
                        <td>{msg.name}</td>
                        <td>{msg.email}</td>
                        <td>{msg.subject}</td>
                        <td>{msg.message && msg.message.length > 50 ? `${msg.message.slice(0, 50)}...` : msg.message}</td>
                        <td>{new Date(msg.created_at).toLocaleDateString("fr-FR")}</td>
                        <td>
                          {msg.is_read ? (
                            <span className="status-badge status-read">Lu</span>
                          ) : (
                            <span className="status-badge status-unread">Non lu</span>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            {!msg.is_read && (
                              <button className="action-button verify-button" onClick={() => handleMarkAsRead(msg)}>
                                Marquer comme lu
                              </button>
                            )}
                            <button className="action-button delete-button" onClick={() => handleDeleteMessage(msg.id)}>
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      case "users":
        return <UsersManagement users={usersWithDates} />
      case "providers":
        return <ProvidersManagement providers={providersWithDetails} />
      case "messages":
        return <MessagesManagement />
      case "stats":
        return <Statistics stats={stats} users={usersWithDates} providers={providersWithDetails} bookings={bookings} />
      default:
        return null
    }
  }

  // Fonctions pour gérer les actions des utilisateurs (adaptées depuis UsersManagement.jsx)
  const handleUserEdit = (user) => {
    // Pour le tableau de bord, nous allons rediriger vers la section utilisateurs
    setActiveSection("users")
    // Le reste de la logique d'édition sera géré par le composant UsersManagement
  }

  const handleUserDelete = (userId) => {
    // Pour le tableau de bord, nous allons rediriger vers la section utilisateurs
    setActiveSection("users")
    // Le reste de la logique de suppression sera géré par le composant UsersManagement
  }

  // Fonctions pour gérer les actions des prestataires (adaptées depuis ProvidersManagement.jsx)
  const handleProviderEdit = (provider) => {
    // Pour le tableau de bord, nous allons rediriger vers la section prestataires
    setActiveSection("providers")
    // Le reste de la logique d'édition sera géré par le composant ProvidersManagement
  }

  const handleProviderDelete = (providerId) => {
    // Pour le tableau de bord, nous allons rediriger vers la section prestataires
    setActiveSection("providers")
    // Le reste de la logique de suppression sera géré par le composant ProvidersManagement
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">{isSidebarCollapsed ? "F" : "Festify"}</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item, index) => (
            <div
              key={index}
              className={`nav-item ${activeSection === item.section ? "active" : ""}`}
              onClick={() => {
                setActiveSection(item.section)
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {!isSidebarCollapsed && <span className="nav-title">{item.title}</span>}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <span className="logout-icon">
              <LogoutIcon />
            </span>
            {!isSidebarCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${isSidebarCollapsed ? "main-content-collapsed" : ""}`}>
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="header-title">
              {activeSection === "dashboard" && "Tableau de Bord"}
              {activeSection === "users" && "Gestion des Utilisateurs"}
              {activeSection === "providers" && "Gestion des Prestataires"}
              {activeSection === "messages" && "Boîte de Réception"}
              {activeSection === "stats" && "Statistiques"}
            </h1>
          </div>
          <div className="header-right">
            
            <div className="user-avatar">
              <span>A</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">{renderContent()}</div>
      </div>
    </div>
  )
}

export default AdminDashboard