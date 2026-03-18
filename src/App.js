import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainNavbar } from './index-exports';
import { Home, Flights, Airlines, DataManager, AirlineDashboardPage, SettingsPage } from './pages';
import { TravelerLogin, Login, Register, AirlineRegister } from './components/Auth';
import MainLayout from './components/layout/MainLayout';
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
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          } />
          <Route path="/home" element={
            <MainLayout>
              <Home />
            </MainLayout>
          } />
          <Route path="/flights" element={
            <MainLayout>
              <Flights />
            </MainLayout>
          } />
          <Route path="/flight/:flightId" element={
            <MainLayout>
              <FlightDetails />
            </MainLayout>
          } />
          <Route path="/airlines" element={
            <MainLayout>
              <Airlines />
            </MainLayout>
          } />
          <Route path="/data-manager" element={
            <MainLayout>
              <DataManager />
            </MainLayout>
          } />
          <Route path="/airline-dashboard" element={
            <MainLayout>
              <AirlineDashboardPage />
            </MainLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
