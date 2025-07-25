"use client"

import { useState, useEffect } from "react"
import api from "../../services/api"

const ProvidersManagement = ({ providers }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProviders, setFilteredProviders] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingProvider, setEditingProvider] = useState(null)
  const [formData, setFormData] = useState({
    description: "",
    contact: "",
    entreprise: "",
    service: "",
    is_active: true,
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingProviderId, setDeletingProviderId] = useState(null)
  const [providersWithDetails, setProvidersWithDetails] = useState([])
  const [isForceDeleting, setIsForceDeleting] = useState(false)

  // Enrichir les prestataires avec des données complètes
  useEffect(() => {
    if (providers && providers.length > 0) {
      console.log("Données brutes des prestataires:", providers)

      const enhancedProviders = providers.map((provider) => {
        return {
          ...provider,
          // Utiliser directement les noms de colonnes de la base de données
          id: provider.id,
          description: provider.description || "Aucune description disponible",
          contact: provider.contact || "N/A",
          entreprise: provider.entreprise || "N/A",
          service: provider.service || "N/A",
          user_id: provider.user_id,
          is_active: provider.is_active !== undefined ? provider.is_active : true,
        }
      })

      setProvidersWithDetails(enhancedProviders)
      setFilteredProviders(enhancedProviders)
    }
  }, [providers])

  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)
    filterProviders(term)
  }

  const filterProviders = (term) => {
    if (!term) {
      setFilteredProviders(providersWithDetails)
      return
    }

    const filtered = providersWithDetails.filter(
      (provider) =>
        (provider.entreprise || "").toLowerCase().includes(term.toLowerCase()) ||
        (provider.description || "").toLowerCase().includes(term.toLowerCase()) ||
        (provider.contact || "").toLowerCase().includes(term.toLowerCase()),
    )

    setFilteredProviders(filtered)
  }

  const handleEdit = (provider) => {
    console.log("Prestataire à modifier:", provider)
    setIsEditing(true)
    setEditingProvider(provider)

    // Préparer les données du formulaire avec les noms exacts des colonnes
    setFormData({
      description: provider.description || "",
      contact: provider.contact || "",
      entreprise: provider.entreprise || "",
      service: provider.service || "",
      is_active: provider.is_active !== undefined ? provider.is_active : true,
    })
  }

  const handleDelete = (providerId) => {
    setIsDeleting(true)
    setDeletingProviderId(providerId)
  }

  // Fonction de suppression améliorée (soft delete)
  const confirmDelete = async () => {
    try {
      // Récupérer le prestataire actuel
      const currentProvider = providersWithDetails.find((provider) => provider.id === deletingProviderId)
      // Déterminer la nouvelle valeur de is_active (inverse de la valeur actuelle)
      const newActiveState = !currentProvider.is_active

      // Mettre à jour l'interface d'abord
      const updatedProviders = providersWithDetails.map((provider) => {
        if (provider.id === deletingProviderId) {
          return { ...provider, is_active: newActiveState }
        }
        return provider
      })

      setProvidersWithDetails(updatedProviders)
      setFilteredProviders(updatedProviders)

      try {
        // Envoyer la requête de mise à jour pour changer l'état du prestataire
        await api.patch(`providers/${deletingProviderId}/`, { is_active: newActiveState })
        alert(newActiveState ? "Prestataire réactivé avec succès" : "Prestataire désactivé avec succès")
      } catch (error) {
        console.error("Erreur lors de la modification de l'état:", error)
        alert(
          `Le prestataire a été ${newActiveState ? "réactivé" : "désactivé"} dans l'interface, mais il y a eu un problème avec le serveur.`,
        )
      }

      setIsDeleting(false)
      setDeletingProviderId(null)
    } catch (error) {
      console.error("Erreur inattendue:", error)
      setIsDeleting(false)
      setDeletingProviderId(null)
      alert("Une erreur inattendue s'est produite.")
    }
  }

  // Fonction de suppression forcée - CORRIGÉE
  const confirmForceDelete = async () => {
    try {
      // Mettre à jour l'interface d'abord
      const updatedProviders = providersWithDetails.filter((provider) => provider.id !== deletingProviderId)
      setProvidersWithDetails(updatedProviders)
      setFilteredProviders(updatedProviders)

      try {
        // URL corrigée - sans le préfixe "api/" en double
        console.log(`Tentative de suppression forcée du prestataire ${deletingProviderId}`)
        await api.delete(`providers/${deletingProviderId}/force-delete/`)
        alert("Prestataire et toutes ses données associées supprimés avec succès")
      } catch (error) {
        console.error("Erreur lors de la suppression forcée:", error)
        alert("Le prestataire a été supprimé de l'interface, mais il y a eu un problème avec le serveur.")
      }

      setIsForceDeleting(false)
      setIsDeleting(false)
      setDeletingProviderId(null)
    } catch (error) {
      console.error("Erreur inattendue:", error)
      setIsForceDeleting(false)
      setIsDeleting(false)
      setDeletingProviderId(null)
      alert("Une erreur inattendue s'est produite.")
    }
  }

  const cancelDelete = () => {
    setIsDeleting(false)
    setIsForceDeleting(false)
    setDeletingProviderId(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Fonction de modification améliorée
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Mettre à jour l'interface d'abord
    const updatedProviders = providersWithDetails.map((provider) => {
      if (provider.id === editingProvider.id) {
        return {
          ...provider,
          ...formData,
        }
      }
      return provider
    })

    setProvidersWithDetails(updatedProviders)
    setFilteredProviders(updatedProviders)

    // Fermer le modal
    setIsEditing(false)
    setEditingProvider(null)

    try {
      // Essayer plusieurs méthodes HTTP pour la modification
      try {
        // D'abord essayer PUT
        await api.put(`providers/${editingProvider.id}/`, formData)
        alert("Prestataire modifié avec succès")
      } catch (putError) {
        console.error("Erreur avec PUT, tentative avec PATCH:", putError)

        // Si PUT échoue, essayer PATCH
        await api.patch(`providers/${editingProvider.id}/`, formData)
        alert("Prestataire modifié avec succès")
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error)
      alert("Le prestataire a été modifié dans l'interface, mais il y a eu un problème avec le serveur.")
    }
  }

  // Fonction pour tronquer le texte
  const truncateText = (text, maxLength = 50) => {
    if (!text) return "N/A"
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2 className="section-title">Gestion des Prestataires</h2>
        <div className="filters-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un prestataire..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
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
            {filteredProviders.map((provider) => (
              <tr key={provider.id} className={!provider.is_active ? "inactive-row" : ""}>
                <td>{provider.id}</td>
                <td>{provider.entreprise || "N/A"}</td>
                <td>{provider.service || "N/A"}</td>
                <td>{truncateText(provider.description)}</td>
                <td>{provider.contact || "N/A"}</td>
                <td>
                  <span className={`status-badge ${provider.is_active ? "status-active" : "status-inactive"}`}>
                    {provider.is_active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-button" onClick={() => handleEdit(provider)}>
                      Modifier
                    </button>
                    <button
                      className={`action-button ${provider.is_active ? "delete-button" : "verify-button"}`}
                      onClick={() => handleDelete(provider.id)}
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

      {/* Modal de modification */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Modifier le prestataire</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="entreprise">Entreprise</label>
                <input
                  type="text"
                  id="entreprise"
                  name="entreprise"
                  value={formData.entreprise}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact">Contact</label>
                <input type="text" id="contact" name="contact" value={formData.contact} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="service">Service</label>
                <input type="text" id="service" name="service" value={formData.service} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                ></textarea>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
                  Prestataire actif
                </label>
              </div>
              <div className="modal-actions">
                <button type="submit" className="action-button">
                  Enregistrer
                </button>
                <button type="button" className="action-button cancel-button" onClick={() => setIsEditing(false)}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {isDeleting && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmer l'action</h2>
            <p>
              {isForceDeleting
                ? "Attention ! Cette action va supprimer définitivement ce prestataire et toutes ses données associées (réservations, services, avis). Cette action est irréversible."
                : providersWithDetails.find((p) => p.id === deletingProviderId)?.is_active
                  ? "Voulez-vous vraiment désactiver ce prestataire ? Il ne sera plus visible pour les utilisateurs mais ses données seront conservées."
                  : "Voulez-vous réactiver ce prestataire ? Il sera à nouveau visible pour les utilisateurs."}
            </p>
            <div className="modal-actions">
              {isForceDeleting ? (
                <button className="action-button delete-button" onClick={confirmForceDelete}>
                  Supprimer définitivement
                </button>
              ) : (
                <>
                  <button
                    className={`action-button ${providersWithDetails.find((p) => p.id === deletingProviderId)?.is_active ? "delete-button" : "verify-button"}`}
                    onClick={confirmDelete}
                  >
                    {providersWithDetails.find((p) => p.id === deletingProviderId)?.is_active
                      ? "Désactiver"
                      : "Réactiver"}
                  </button>
                  <button className="action-button warning-button" onClick={() => setIsForceDeleting(true)}>
                    Supprimer définitivement
                  </button>
                </>
              )}
              <button className="action-button cancel-button" onClick={cancelDelete}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProvidersManagement