"use client"

import { useState, useEffect } from "react"
import api from "../../services/api"

const UsersManagement = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    is_active: true,
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState(null)

  // Initialiser les utilisateurs filtrés
  useEffect(() => {
    if (users && users.length > 0) {
      console.log("Données brutes des utilisateurs:", users)
      // Utiliser directement les utilisateurs avec leurs dates d'inscription réelles
      setFilteredUsers(users)
    }
  }, [users])

  // Modifier la fonction handleSearch pour utiliser directement les utilisateurs
  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)

    if (!term) {
      setFilteredUsers(users)
      return
    }

    const filtered = users.filter(
      (user) =>
        (user.username || user.name || "").toLowerCase().includes(term.toLowerCase()) ||
        (user.email || "").toLowerCase().includes(term.toLowerCase()),
    )

    setFilteredUsers(filtered)
  }

  const handleEdit = (user) => {
    console.log("Utilisateur à modifier:", user)
    setIsEditing(true)
    setEditingUser(user)
    setFormData({
      username: user.username || user.name || "",
      email: user.email || "",
      is_active: user.is_active !== undefined ? user.is_active : true,
    })
  }

  const handleDelete = (userId) => {
    setIsDeleting(true)
    setDeletingUserId(userId)
  }

  // Modifier la fonction confirmDelete pour mettre à jour la liste correctement
  const confirmDelete = async () => {
    try {
      await api.delete(`users/${deletingUserId}/`)

      // Mettre à jour la liste locale après la suppression
      const updatedUsers = users.filter((user) => user.id !== deletingUserId)
      setFilteredUsers(updatedUsers)

      setIsDeleting(false)
      setDeletingUserId(null)
      alert("Utilisateur supprimé avec succès")
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error)
      alert(`Erreur lors de la suppression de l'utilisateur: ${error.message}`)
    }
  }

  const cancelDelete = () => {
    setIsDeleting(false)
    setDeletingUserId(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Modifier la fonction handleSubmit pour mettre à jour la liste correctement
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log("Données à envoyer:", formData)

      // Envoyer les modifications à l'API
      const response = await api.patch(`users/${editingUser.id}/`, formData)
      console.log("Réponse de l'API:", response.data)

      // Mettre à jour la liste locale après la modification
      const updatedUsers = users.map((user) => {
        if (user.id === editingUser.id) {
          return {
            ...user,
            username: formData.username,
            name: formData.username, // Au cas où le champ name est utilisé
            email: formData.email,
            is_active: formData.is_active,
          }
        }
        return user
      })

      // Mettre à jour les deux listes
      setFilteredUsers(
        updatedUsers.filter(
          (user) =>
            (user.username || user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )

      setIsEditing(false)
      setEditingUser(null)
      alert("Utilisateur modifié avec succès")
    } catch (error) {
      console.error("Erreur lors de la modification de l'utilisateur:", error)
      alert(`Erreur lors de la modification de l'utilisateur: ${error.message}`)
    }
  }

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

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2 className="section-title">Gestion des Utilisateurs</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
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
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username || user.name || "N/A"}</td>
                <td>{user.email || "N/A"}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-button" onClick={() => handleEdit(user)}>
                      Modifier
                    </button>
                    <button className="action-button delete-button" onClick={() => handleDelete(user.id)}>
                      Supprimer
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
            <h2>Modifier l'utilisateur</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
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
            <h2>Confirmer la suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.</p>
            <div className="modal-actions">
              <button className="action-button delete-button" onClick={confirmDelete}>
                Supprimer
              </button>
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

export default UsersManagement

