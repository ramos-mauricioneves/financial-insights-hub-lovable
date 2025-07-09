
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { OrganizzeCredentials } from '@/types/organizze';
import OrganizzeAPI from '@/services/organizze';
import { DemoOrganizzeAPI } from '@/services/demoData';
import { TrendingUp, AlertCircle, Play } from 'lucide-react';

interface LoginFormProps {
  onLogin: (credentials: OrganizzeCredentials, api: OrganizzeAPI | DemoOrganizzeAPI) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const credentials = { email, token };
      const api = new OrganizzeAPI(credentials);
      
      const isConnected = await api.testConnection();
      
      if (isConnected) {
        toast({
          title: "Conexão bem-sucedida!",
          description: "Carregando seus dados financeiros...",
        });
        onLogin(credentials, api);
      } else {
        throw new Error('Falha na conexão com a API');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Erro ao conectar com a API do Organizze. Verifique suas credenciais.');
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar com a API do Organizze. Tente novamente ou use o modo demo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoCredentials = { email: 'demo', token: 'demo' };
    const demoAPI = new DemoOrganizzeAPI();
    
    toast({
      title: "Modo Demo Ativado",
      description: "Usando dados simulados para demonstração",
    });
    
    onLogin(demoCredentials, demoAPI);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-full shadow-elegant">
              <TrendingUp className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Organizze Insight Hub
          </CardTitle>
          <CardDescription>
            Conecte-se à sua conta do Organizze para visualizar insights financeiros
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="token">Token da API</Label>
              <Input
                id="token"
                type="password"
                placeholder="Seu token do Organizze"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Encontre seu token em: Organizze → Configurações → API
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Conectando...' : 'Conectar'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou
              </span>
            </div>
          </div>

          <Button
            onClick={handleDemoLogin}
            variant="outline"
            className="w-full"
            type="button"
          >
            <Play className="w-4 h-4 mr-2" />
            Experimentar Modo Demo
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            <p>
              O modo demo usa dados simulados para demonstrar as funcionalidades
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
