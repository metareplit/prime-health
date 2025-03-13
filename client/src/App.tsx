import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import Services from "@/pages/services";
import Gallery from "@/pages/gallery";
import Products from "@/pages/products";
import Appointment from "@/pages/appointment";
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
          <Route path="/randevu" component={Appointment} />
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
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;