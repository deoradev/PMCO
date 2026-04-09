/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './store/UserContext';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AIFeatures from './pages/AIFeatures';
import Meetings from './pages/Meetings';
import Routine from './pages/Routine';
import Insights from './pages/Insights';
import Vault from './pages/Vault';
import Settings from './pages/Settings';
import Policies from './pages/Policies';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isOnboarded } = useUser();
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="ai-features" element={<AIFeatures />} />
            
            <Route path="meetings" element={<Meetings />} />
            <Route path="routine" element={<Routine />} />
            <Route path="insights" element={<Insights />} />
            <Route path="vault" element={<Vault />} />
            <Route path="settings" element={<Settings />} />
            <Route path="policies" element={<Policies />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

