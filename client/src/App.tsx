import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Gallery from "@/pages/gallery";
import Products from "@/pages/products";
import Contact from "@/pages/iletisim";
import Appointment from "@/pages/appointment";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog/[slug]";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import PatientDashboard from "@/pages/patient/dashboard";
import PatientMessages from "@/pages/patient/messages";
import PatientImages from "@/pages/patient/images";
import PatientAppointments from "@/pages/patient/appointments";
import PatientProfile from "@/pages/patient/profile";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminPatients from "@/pages/admin/patients";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/hizmetler" component={Services} />
          <Route path="/galeri" component={Gallery} />
          <Route path="/urunler" component={Products} />
          <Route path="/iletisim" component={Contact} />
          <Route path="/randevu" component={Appointment} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />

          {/* Auth Routes */}
          <Route path="/auth/login" component={Login} />
          <Route path="/auth/register" component={Register} />

          {/* Patient Portal Routes */}
          <Route path="/hasta-portali" component={PatientDashboard} />
          <Route path="/hasta-portali/mesajlar" component={PatientMessages} />
          <Route path="/hasta-portali/gorseller" component={PatientImages} />
          <Route path="/hasta-portali/randevular" component={PatientAppointments} />
          <Route path="/hasta-portali/profil" component={PatientProfile} />

          {/* Admin Routes */}
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/hastalar" component={AdminPatients} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;