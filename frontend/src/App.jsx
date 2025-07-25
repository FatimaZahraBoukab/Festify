import { useEffect, useState, useContext } from 'react'
import { Routes, Route } from "react-router-dom";
import api from './services/api';
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import Providers from "./pages/Providers";
import BookProvider from "./pages/BookProvider";
import MyBookings from "./pages/MyBookings";
import SendInvitation from "./pages/SendInvitation";
import MyInvitations from "./pages/MyInvitations";
import RespondInvitation from "./pages/RespondInvitation";
//import AdminDashboard from "./pages/AdminDashboard";
import AddProvider from "./pages/AddProvider";
import HomePage from "./components/HomePage";
import AboutPage from "./components/AboutPage";
import ServicesPage from "./components/ServicesPage";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import EventDetails from './pages/EventDetails';
import PrestataireRegister from './components/PrestataireRegister';
import PrestataireLogin from './components/PrestataireLogin';
import PrestataireDashboard from './components/PrestataireDashboard';
import AddService from './components/AddService';
import MyServices from './components/MyServices';
import EditService from './components/EditService';
import ProviderProfile from './components/ProviderProfile';
import Header from './components/Header2';

import '@fortawesome/fontawesome-free/css/all.min.css';

import AdminLogin from "./Admin/AdminLogin"; // Import du composant AdminLogin
import AdminDashboard from "./Admin/AdminDashboard"; // Import du composant AdminDashboard

import BookingsPage from './components/BookingsPage';

import ProviderDetails from './pages/ProviderDetails';

import './App.css'

function App() {
  const { user } = useContext(AuthContext); // Vérifie si l'utilisateur est connecté
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (user) { 
    api.get('events/') // Remplace par ton endpoint réel
      .then(response => setEvents(response.data))
      .catch(error => console.error('Erreur lors du fetch des événements', error));
    }
  }, [user]);

  return (
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/edit-event/:id" element={<EditEvent />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/book-provider/:providerId" element={<BookProvider />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            {/*<Route path="/send-invitation/:eventId" element={<SendInvitation />} />*/}
            <Route path="/send-invitation/:eventId?" element={<SendInvitation />} />
            
            <Route path="/my-invitations" element={<MyInvitations />} />
            <Route path="/respond-invitation/:invitationId" element={<RespondInvitation />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/add-provider" element={<AddProvider />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<Home />} /> {/* Nouvelle route pour Home.jsx */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<Footer />} />
            <Route path="/clientSpace" element={<clientSpace />} />
            <Route path="/prestataire/register" element={<PrestataireRegister />} />
            <Route path="/prestataire/login" element={<PrestataireLogin />} />
            <Route path="/prestataire/dashboard" element={<PrestataireDashboard />} />
            <Route path="/prestataire/add-service" element={<AddService />} />
            <Route path="/prestataire/my-services" element={<MyServices />} />
            <Route path="/prestataire/edit-service/:id" element={<EditService />} />
            <Route path="/prestataire/profile" element={<ProviderProfile />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/admin/login" element={<AdminLogin />} /> {/* Nouvelle route pour AdminLogin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* Nouvelle route pour AdminDashboard */}

            <Route path="/provider-details/:id" element={<ProviderDetails />} />
            <Route path="/book-provider/:id" element={<ProviderDetails />} />
            <Route path="/prestataire/bookings" element={<BookingsPage />} />

          </Routes>
           
      </AuthProvider>
  )
}

export default App;
