import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/lib/auth";
import { AdminLayout } from "@/components/layout/admin-layout";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { LanguageRouter, LanguageLink } from "@/lib/languageRouter";
import "./lib/i18n";
import React, { useEffect } from 'react';
import AdminDashboard from "@/pages/admin/dashboard";
import AdminPosts from "@/pages/admin/posts";
import AdminPostNew from "@/pages/admin/posts/new";
import AdminPostEdit from "@/pages/admin/posts/[id]";
import AdminLogin from "@/pages/admin/login";
import AdminAppointments from "@/pages/admin/appointments";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Gallery from "@/pages/gallery";
import Products from "@/pages/products";
import Contact from "@/pages/iletisim";
import Appointment from "@/pages/randevu";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog/[slug]";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import PatientDashboard from "@/pages/patient/dashboard";
import PatientMessages from "@/pages/patient/messages";
import PatientImages from "@/pages/patient/images";
import PatientAppointments from "@/pages/patient/appointments";
import PatientProfile from "@/pages/patient/profile";
import NotFound from "@/pages/not-found";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import AdminAppointmentNew from "@/pages/admin/appointments/new";

// Component to handle root redirects
function RootRedirect() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    const storedLanguage = localStorage.getItem('i18nextLng') || 'tr';
    navigate(`/${storedLanguage}`);
  }, [navigate]);
  
  return null;
}

// Protected Route Component
function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAdmin) {
      setLocation('/admin/login');
    }
  }, [isAdmin, setLocation]);

  if (!isAdmin) return null;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Admin Login Route */}
      <Route path="/admin/login" component={AdminLogin} />

      {/* Protected Admin Routes - Only Blog and Appointments */}
      <Route path="/admin">
        {() => (
          <ProtectedAdminRoute>
            <AdminLayout title="Dashboard">
              <ScrollToTop />
              <AdminDashboard />
            </AdminLayout>
          </ProtectedAdminRoute>
        )}
      </Route>

      <Route path="/admin/appointments">
        {() => (
          <ProtectedAdminRoute>
            <AdminLayout title="Randevu Yönetimi">
              <AdminAppointments />
            </AdminLayout>
          </ProtectedAdminRoute>
        )}
      </Route>

      <Route path="/admin/appointments/new">
        {() => (
          <ProtectedAdminRoute>
            <AdminLayout title="Yeni Randevu">
              <AdminAppointmentNew />
            </AdminLayout>
          </ProtectedAdminRoute>
        )}
      </Route>

      <Route path="/admin/posts">
        {() => (
          <ProtectedAdminRoute>
            <AdminLayout title="Blog Yazıları">
              <AdminPosts />
            </AdminLayout>
          </ProtectedAdminRoute>
        )}
      </Route>

      <Route path="/admin/posts/new">
        {() => (
          <ProtectedAdminRoute>
            <AdminLayout title="Yeni Blog Yazısı">
              <AdminPostNew />
            </AdminLayout>
          </ProtectedAdminRoute>
        )}
      </Route>

      <Route path="/admin/posts/:id">
        {(params) => (
          <ProtectedAdminRoute>
            <AdminLayout title="Blog Yazısı Düzenle">
              <AdminPostEdit params={params} />
            </AdminLayout>
          </ProtectedAdminRoute>
        )}
      </Route>

      {/* Language-Based Routes */}
      <Route path="/:lang">
        {(params) => (
          <div className="min-h-screen flex flex-col">
            <Header>
              <LanguageSwitcher />
            </Header>
            <main className="flex-grow">
              <ScrollToTop />
              <Home />
            </main>
            <Footer />
          </div>
        )}
      </Route>

      {/* Redirect root to language prefix */}
      <Route path="/" component={RootRedirect} />

      {/* Other Language-Based Routes */}
      <Route path="/:lang/*">
        {(params) => (
          <div className="min-h-screen flex flex-col">
            <Header>
              <LanguageSwitcher />
            </Header>
            <main className="flex-grow">
              <ScrollToTop />
              <Switch>
                <Route path="/:lang/hizmetler" component={Services} />
                <Route path="/:lang/services" component={Services} />
                <Route path="/:lang/gallery" component={Gallery} />
                <Route path="/:lang/galeri" component={Gallery} />
                <Route path="/:lang/urunler" component={Products} />
                <Route path="/:lang/products" component={Products} />
                <Route path="/:lang/iletisim" component={Contact} />
                <Route path="/:lang/contact" component={Contact} />
                <Route path="/:lang/randevu" component={Appointment} />
                <Route path="/:lang/appointment" component={Appointment} />
                <Route path="/:lang/blog" component={Blog} />
                <Route path="/:lang/blog/:slug" component={BlogPost} />

                {/* Auth Routes */}
                <Route path="/:lang/auth/login" component={Login} />
                <Route path="/:lang/auth/register" component={Register} />

                {/* Patient Portal Routes */}
                <Route path="/:lang/hasta-portali" component={PatientDashboard} />
                <Route path="/:lang/patient-portal" component={PatientDashboard} />
                <Route path="/:lang/hasta-portali/mesajlar" component={PatientMessages} />
                <Route path="/:lang/patient-portal/messages" component={PatientMessages} />
                <Route path="/:lang/hasta-portali/gorseller" component={PatientImages} />
                <Route path="/:lang/patient-portal/images" component={PatientImages} />
                <Route path="/:lang/hasta-portali/randevular" component={PatientAppointments} />
                <Route path="/:lang/patient-portal/appointments" component={PatientAppointments} />
                <Route path="/:lang/hasta-portali/profil" component={PatientProfile} />
                <Route path="/:lang/patient-portal/profile" component={PatientProfile} />

                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </div>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageRouter>
          <Router />
          <Toaster />
        </LanguageRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;