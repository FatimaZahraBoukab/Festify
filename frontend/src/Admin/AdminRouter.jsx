import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';

// Composants de pages temporaires
const UsersPage = () => <div>Page Utilisateurs</div>;
const ProvidersPage = () => <div>Page Prestataires</div>;
const MessagesPage = () => <div>Page Boîte de Réception</div>; // ✅ Ajouté
const StatisticsPage = () => <div>Page Statistiques</div>;

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="providers" element={<ProvidersPage />} />
        <Route path="messages" element={<MessagesPage />} /> {/* ✅ corrigé ici */}
        <Route path="statistics" element={<StatisticsPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRouter;
