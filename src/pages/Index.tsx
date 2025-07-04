import { useState } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { Dashboard } from '@/components/Dashboard';
import { OrganizzeCredentials } from '@/types/organizze';
import OrganizzeAPI from '@/services/organizze';
import { DemoOrganizzeAPI } from '@/services/demoData';

const Index = () => {
  const [credentials, setCredentials] = useState<OrganizzeCredentials | null>(null);
  const [api, setApi] = useState<OrganizzeAPI | DemoOrganizzeAPI | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleLogin = (newCredentials: OrganizzeCredentials, newApi: OrganizzeAPI | DemoOrganizzeAPI) => {
    setCredentials(newCredentials);
    setApi(newApi);
    setIsDemoMode(newCredentials.email === 'demo');
  };

  const handleLogout = () => {
    setCredentials(null);
    setApi(null);
    setIsDemoMode(false);
  };

  if (!credentials || !api) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      credentials={credentials} 
      api={api} 
      onLogout={handleLogout}
      isDemoMode={isDemoMode}
    />
  );
};

export default Index;