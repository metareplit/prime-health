import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">İletişim</h3>
            <p>Tiflis, Gürcistan</p>
            <p>Tel: +995 123 456 789</p>
            <p>Email: info@hairclinic.com</p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Hizmetler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hizmetler#sac-ekimi">Saç Ekimi</Link>
              </li>
              <li>
                <Link href="/hizmetler#sakal-ekimi">Sakal Ekimi</Link>
              </li>
              <li>
                <Link href="/hizmetler#kas-ekimi">Kaş Ekimi</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Hakkımızda</h3>
            <p className="text-gray-600">
              Gürcistan Tiflis'te profesyonel saç ekimi ve estetik hizmetleri sunuyoruz.
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-gray-500">
          <p>&copy; 2024 Hair Clinic. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
