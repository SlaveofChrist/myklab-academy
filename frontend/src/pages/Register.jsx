import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [role, setRole] = useState('APPRENANT'); // valeur par défaut
  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);
    try {
      await register({ nom, email, mdp, role });
      navigate('/');
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm p-8">
        <h1 className="text-2xl mb-1">MYKLAB</h1>
        <p className="text-sm text-brand-ink/70 mb-6">Crée ton compte</p>

        <form onSubmit={handleSubmit}>
          <Input label="Nom complet" value={nom} onChange={(e) => setNom(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Mot de passe" type="password" value={mdp} onChange={(e) => setMdp(e.target.value)} required />

          {/* Choix du rôle : détermine si l'utilisateur crée des cours ou en suit */}
          <div className="mb-5">
            <span className="block text-sm font-semibold text-brand-brown mb-2">Je suis...</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('APPRENANT')}
                className={`px-4 py-2.5 rounded-lg border-2 font-display font-semibold text-sm transition-colors
                  ${role === 'APPRENANT'
                    ? 'bg-brand-orange text-white border-brand-orange'
                    : 'bg-white text-brand-brown border-brand-amber/40'}`}
              >
                Apprenant
              </button>
              <button
                type="button"
                onClick={() => setRole('REFERENT')}
                className={`px-4 py-2.5 rounded-lg border-2 font-display font-semibold text-sm transition-colors
                  ${role === 'REFERENT'
                    ? 'bg-brand-orange text-white border-brand-orange'
                    : 'bg-white text-brand-brown border-brand-amber/40'}`}
              >
                Référent
              </button>
            </div>
          </div>

          {localError && (
            <p className="text-red-600 text-sm mb-4">{localError}</p>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </Button>
        </form>

        <p className="text-sm text-center mt-5 text-brand-ink/70">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-brand-orange font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Register;
