import { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { Dashboard } from '@/components/Dashboard';
import { OrganizzeCredentials } from '@/types/organizze';
import OrganizzeAPI from '@/services/organizze';

const Index = () => {
  const [credentials, setCredentials] = useState<OrganizzeCredentials | null>(null);
  const [api, setApi] = useState<OrganizzeAPI | null>(null);

  const handleLogin = (newCredentials: OrganizzeCredentials, newApi: OrganizzeAPI) => {
    setCredentials(newCredentials);
    setApi(newApi);
  };

  const handleLogout = () => {
    setCredentials(null);
    setApi(null);
  };

  if (!credentials || !api) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      credentials={credentials} 
      api={api} 
      onLogout={handleLogout} 
    />
  );
};

export default Index;
