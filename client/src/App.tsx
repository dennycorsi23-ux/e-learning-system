import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Lazy load pages for better performance
const Login = lazy(() => import("./pages/Login"));
const VerificaAttestato = lazy(() => import("./pages/VerificaAttestato"));
const Certificazioni = lazy(() => import("./pages/Certificazioni"));
const SessioniEsame = lazy(() => import("./pages/SessioniEsame"));
const Sedi = lazy(() => import("./pages/Sedi"));
const Prezzi = lazy(() => import("./pages/Prezzi"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contatti = lazy(() => import("./pages/Contatti"));
const EsempiProve = lazy(() => import("./pages/EsempiProve"));

// Dashboard pages (protected)
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const DashboardCorsi = lazy(() => import("./pages/dashboard/Corsi"));
const DashboardEsami = lazy(() => import("./pages/dashboard/Esami"));
const DashboardCertificati = lazy(() => import("./pages/dashboard/Certificati"));
const DashboardProfilo = lazy(() => import("./pages/dashboard/Profilo"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUtenti = lazy(() => import("./pages/admin/Utenti"));
const AdminCorsi = lazy(() => import("./pages/admin/Corsi"));
const AdminEsami = lazy(() => import("./pages/admin/Esami"));
const AdminSedi = lazy(() => import("./pages/admin/Sedi"));
const AdminCertificati = lazy(() => import("./pages/admin/Certificati"));
const AdminDomande = lazy(() => import("./pages/admin/Domande"));
const AdminImpostazioni = lazy(() => import("./pages/admin/Impostazioni"));
const AdminReport = lazy(() => import("./pages/admin/Report"));

// Exam pages
const ExamRoom = lazy(() => import("./pages/exam/ExamRoom"));
const ExamProctoring = lazy(() => import("./pages/exam/ExamProctoring"));

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Caricamento...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Public pages */}
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/verifica" component={VerificaAttestato} />
        <Route path="/verifica/:code" component={VerificaAttestato} />
        <Route path="/certificazioni" component={Certificazioni} />
        <Route path="/certificazioni/:lingua" component={Certificazioni} />
        <Route path="/esami" component={SessioniEsame} />
        <Route path="/sedi" component={Sedi} />
        <Route path="/prezzi" component={Prezzi} />
        <Route path="/faq" component={FAQ} />
        <Route path="/contatti" component={Contatti} />
        <Route path="/esempi-prove" component={EsempiProve} />
        
        {/* User dashboard */}
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/dashboard/corsi" component={DashboardCorsi} />
        <Route path="/dashboard/esami" component={DashboardEsami} />
        <Route path="/dashboard/certificati" component={DashboardCertificati} />
        <Route path="/dashboard/profilo" component={DashboardProfilo} />
        
        {/* Admin panel */}
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/utenti" component={AdminUtenti} />
        <Route path="/admin/corsi" component={AdminCorsi} />
        <Route path="/admin/esami" component={AdminEsami} />
        <Route path="/admin/sedi" component={AdminSedi} />
        <Route path="/admin/certificati" component={AdminCertificati} />
        <Route path="/admin/domande" component={AdminDomande} />
        <Route path="/admin/impostazioni" component={AdminImpostazioni} />
        <Route path="/admin/report" component={AdminReport} />
        
        {/* Exam room */}
        <Route path="/exam/:examId" component={ExamRoom} />
        <Route path="/exam/:examId/proctoring" component={ExamProctoring} />
        
        {/* 404 */}
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
