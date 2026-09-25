import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlannerProvider } from './context/PlannerContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { DistrictDetailPage } from './pages/DistrictDetailPage';
import { PlanTripPage } from './pages/PlanTripPage';
import { TripDetailPage } from './pages/TripDetailPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlannerProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-stone-50 font-sans text-stone-900 antialiased selection:bg-emerald-200 selection:text-emerald-900">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/destination/:slug" element={<DestinationDetailPage />} />
                <Route path="/district/:slug" element={<DistrictDetailPage />} />
                <Route path="/plan-trip" element={<PlanTripPage />} />
                <Route path="/trip/:id" element={<TripDetailPage />} />
                <Route path="/my-trips" element={<MyTripsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </PlannerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
