import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import Navbar from '../components/common/Navbar';
// Page provisoire — sera remplacée par le vrai catalogue/tableau de bord
// à l'étape 4. Sert ici à confirmer que login/register fonctionnent bien.
function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen p-10">
      <Navbar />

      <p className="text-lg mt-10">
        Bienvenue, <span className="font-semibold text-brand-brown">{user?.nom}</span>
      </p>
      <p className="text-sm text-brand-ink/70 mt-1">
        Connecté en tant que : <span className="font-semibold">{user?.role}</span>
      </p>
    </div>
  );
}

export default Dashboard;
