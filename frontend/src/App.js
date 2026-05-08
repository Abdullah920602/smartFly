import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainNavbar } from './index-exports';
import { Home, Flights, Airlines, AirlineDashboardPage, SettingsPage } from './pages';
import { TravelerLogin, Login, Register, AirlineRegister } from './components/Auth';
import MainLayout from './components/layout/MainLayout';
import RoleBasedRoute from './components/Auth/RoleBasedRoute';
import './App.css';
import './styles/jordanian-theme.css';
import './components/layout/MainNavbar.css';
import FlightDetails from './pages/FlightDetails';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/airline-register" element={<AirlineRegister />} />
          <Route path="/traveler-login" element={<TravelerLogin />} />
          <Route path="/settings" element={
            <RoleBasedRoute allowedRoles={['traveler', 'airline', 'admin']}>
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </RoleBasedRoute>
          } />
          <Route path="/home" element={
            <RoleBasedRoute allowedRoles={['traveler']}>
              <MainLayout>
                <Home />
              </MainLayout>
            </RoleBasedRoute>
          } />
          <Route path="/flights" element={
            <RoleBasedRoute allowedRoles={['traveler']}>
              <MainLayout>
                <Flights />
              </MainLayout>
            </RoleBasedRoute>
          } />
          <Route path="/flight/:flightId" element={
            <RoleBasedRoute allowedRoles={['traveler']}>
              <MainLayout>
                <FlightDetails />
              </MainLayout>
            </RoleBasedRoute>
          } />
          <Route path="/airlines" element={
            <RoleBasedRoute allowedRoles={['traveler']}>
              <MainLayout>
                <Airlines />
              </MainLayout>
            </RoleBasedRoute>
          } />
                    <Route path="/airline-dashboard" element={
            <RoleBasedRoute allowedRoles={['airline']}>
              <MainLayout>
                <AirlineDashboardPage />
              </MainLayout>
            </RoleBasedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
