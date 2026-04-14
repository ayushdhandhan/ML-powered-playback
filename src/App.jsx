import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import PlayerScreen from './pages/PlayerScreen';
import Recommendations from './pages/Recommendations';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loadingApp } = useAppContext();
  
  if (loadingApp) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Home />} />
        <Route path="player" element={<PlayerScreen />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
