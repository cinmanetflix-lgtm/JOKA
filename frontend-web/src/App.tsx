import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { ServiceDetails } from './pages/ServiceDetails';
import { Booking } from './pages/Booking';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { Dashboard } from './pages/Dashboard';
import { PartnerDashboard } from './pages/Partner/Dashboard';
import { AdminDashboard } from './pages/Admin/Dashboard';
import { Parcours } from './pages/Parcours';
import { PrivateRoute } from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:id" element={<ServiceDetails />} />
        <Route path="booking/:serviceId" element={<Booking />} />
        <Route path="parcours" element={<Parcours />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route
          path="dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="partner/*"
          element={
            <PrivateRoute role="partner">
              <PartnerDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="admin/*"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
