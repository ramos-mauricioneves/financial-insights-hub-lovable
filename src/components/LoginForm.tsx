import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OrganizzeCredentials } from '@/types/organizze';
import OrganizzeAPI from '@/services/organizze';
import { Loader2, Lock, Mail, TrendingUp } from 'lucide-react';

interface LoginFormProps {
  onLogin: (credentials: OrganizzeCredentials, api: OrganizzeAPI) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [credentials, setCredentials] = useState<OrganizzeCredentials>({
    email: '',
    token: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const api = new OrganizzeAPI(credentials);
      const isConnected = await api.testConnection();
      
      if (isConnected) {
        onLogin(credentials, api);
      } else {
        setError('Falha na autenticação. Verifique suas credenciais.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-card rounded-2xl shadow-elegant mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Organizze Insight Hub</h1>
          <p className="text-white/80">Conecte-se à sua conta do Organizze para acessar seus dados financeiros</p>
        </div>

        <Card className="p-6 shadow-glow border-0 bg-card/95 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email do Organizze
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="token" className="text-sm font-medium">
                Token de Acesso
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="token"
                  type="password"
                  placeholder="Seu token de acesso"
                  value={credentials.token}
                  onChange={(e) => setCredentials(prev => ({ ...prev, token: e.target.value }))}
                  className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Obtenha seu token em{' '}
                <a
                  href="https://app.organizze.com.br/configuracoes/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  app.organizze.com.br/configuracoes/api-keys
                </a>
              </p>
            </div>

            {error && (
              <Alert className="border-destructive/50 bg-destructive-light">
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              variant="default"
              size="lg"
              disabled={isLoading || !credentials.email || !credentials.token}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Conectando...
                </>
              ) : (
                'Conectar ao Organizze'
              )}
            </Button>
          </form>
        </Card>

        <div className="text-center mt-6">
          <p className="text-white/60 text-sm">
            Seus dados são processados localmente e não são armazenados em nossos servidores
          </p>
        </div>
      </div>
    </div>
  );
}