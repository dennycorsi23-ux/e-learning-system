import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, Mail, Lock, ArrowLeft, Shield, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      if (data.success && data.user) {
        toast.success("Accesso effettuato", {
          description: `Benvenuto, ${data.user.name || data.user.email}!`
        });
        
        // Redirect based on role
        if (data.user.role === "admin") {
          setLocation("/admin");
        } else if (data.user.role === "examiner") {
          setLocation("/examiner");
        } else {
          setLocation("/dashboard");
        }
      }
    },
    onError: (err) => {
      setError(err.message || "Errore durante il login");
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!loginEmail || !loginPassword) {
      setError("Inserisci email e password");
      return;
    }
    
    loginMutation.mutate({ email: loginEmail, password: loginPassword });
  };

  const handleSpidLogin = () => {
    setLocation("/login-spid");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Torna alla Home</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-xl">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900">CertificaLingua</span>
            </Link>
            <p className="text-slate-600 mt-2">
              Piattaforma Certificazioni Linguistiche QCER
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center">Accedi</CardTitle>
              <CardDescription className="text-center">
                Inserisci le tue credenziali per accedere
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="nome@esempio.it"
                      className="pl-10"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={loginMutation.isPending}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <Link href="/recupera-password" className="text-xs text-blue-600 hover:underline">
                      Password dimenticata?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={loginMutation.isPending}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Accesso in corso...
                    </>
                  ) : (
                    "Accedi"
                  )}
                </Button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500">
                    oppure
                  </span>
                </div>
              </div>

              {/* SPID Login */}
              <Button 
                variant="outline" 
                className="w-full gap-2 border-2 hover:bg-blue-50" 
                onClick={handleSpidLogin}
              >
                <Shield className="h-4 w-4 text-blue-600" />
                Accedi con SPID
              </Button>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                <p className="font-medium">Nota:</p>
                <p>La registrazione è riservata. Contatta l'amministratore per richiedere l'accesso.</p>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-slate-500 mt-6">
            Conforme al DM 62/2022 - MIM
          </p>
        </div>
      </main>
    </div>
  );
}
