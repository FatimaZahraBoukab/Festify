"use client";

import { useState, useEffect } from "react";
import api from "../../services/api"; // Ton instance axios existante

const MessagesManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const response = await api.get("contacts/");
      setMessages(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;
    try {
      await api.delete(`contacts/${id}/`);
      fetchMessages(); // Recharger après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du message:", error);
    }
  };

  const handleMarkAsRead = async (message) => {
    try {
      await api.put(`contacts/${message.id}/`, {
        ...message,
        is_read: true,
      });
      fetchMessages(); // Recharger après mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) return <div>Chargement des messages...</div>;

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2 className="section-title">Boîte de Réception</h2>
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
            {messages.map((msg) => (
              <tr key={msg.id}>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.subject}</td>
                <td>{msg.message.length > 50 ? `${msg.message.slice(0, 50)}...` : msg.message}</td>
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
  );
};

export default MessagesManagement;
