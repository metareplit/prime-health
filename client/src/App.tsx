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
import { AdminLayout } from "@/components/layout/admin-layout";
import AdminPosts from "@/pages/admin/posts";
import AdminProducts from "@/pages/admin/products";
import AdminMedia from "@/pages/admin/media";
import AdminUsers from "@/pages/admin/users";
import AdminSettings from "@/pages/admin/settings";
import AdminPostNew from "@/pages/admin/posts/new";
import AdminPostEdit from "@/pages/admin/posts/[id]";
import AdminProductNew from "@/pages/admin/products/new";
import AdminProductEdit from "@/pages/admin/products/[id]";
import AdminLogin from "@/pages/admin/login";

function Router() {
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />

      <Route path="/admin">
        {(params) => (
          <AdminLayout title="Dashboard">
            <AdminDashboard />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/posts">
        {(params) => (
          <AdminLayout title="Blog Yazıları">
            <AdminPosts />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/posts/new">
        {(params) => (
          <AdminLayout title="Yeni Blog Yazısı">
            <AdminPostNew />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/posts/:id">
        {(params) => (
          <AdminLayout title="Blog Yazısı Düzenle">
            <AdminPostEdit params={params} />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/products">
        {(params) => (
          <AdminLayout title="Ürünler">
            <AdminProducts />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/products/new">
        {(params) => (
          <AdminLayout title="Yeni Ürün">
            <AdminProductNew />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/products/:id">
        {(params) => (
          <AdminLayout title="Ürün Düzenle">
            <AdminProductEdit params={params} />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/media">
        {(params) => (
          <AdminLayout title="Medya">
            <AdminMedia />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/users">
        {(params) => (
          <AdminLayout title="Kullanıcılar">
            <AdminUsers />
          </AdminLayout>
        )}
      </Route>
      <Route path="/admin/settings">
        {(params) => (
          <AdminLayout title="Ayarlar">
            <AdminSettings />
          </AdminLayout>
        )}
      </Route>

      {/* Public Routes */}
      <Route path="/">
        {() => (
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Home />
            </main>
            <Footer />
          </div>
        )}
      </Route>

      {/* Other Public Routes */}
      <Route path="*">
        {(params) => (
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Switch>
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
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;