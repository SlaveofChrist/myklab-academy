import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from './Button';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-brand-amber/20 px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-display font-extrabold text-brand-brown">
        MYKLAB
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-sm font-semibold text-brand-ink hover:text-brand-orange">
          Accueil
        </Link>
        <Link to="/catalogue" className="text-sm font-semibold text-brand-ink hover:text-brand-orange">
          Catalogue
        </Link>

        <span className="text-sm text-brand-ink/60">
          {user?.nom} · {user?.role}
        </span>

        <Button variant="secondary" onClick={logout} className="!px-4 !py-1.5 text-sm">
          Déconnexion
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;
