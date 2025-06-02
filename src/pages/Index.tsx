
import React, { useState } from 'react';
import LoginPage from '@/components/LoginPage';
import MapView from '@/components/MapView';

const Index = () => {
  const [user, setUser] = useState<{ type: 'barber' | 'client' | 'guest' } | null>(null);

  const handleLogin = (type: 'barber' | 'client' | 'guest') => {
    setUser({ type });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <MapView userType={user.type} onLogout={handleLogout} />;
};

export default Index;
