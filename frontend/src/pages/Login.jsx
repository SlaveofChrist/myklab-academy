import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    setLoading(true);
    try {
      await login({ email, mdp });
      navigate('/'); // redirige vers le tableau de bord une fois connecté
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-8">
        <h1 className="text-2xl mb-1">MYKLAB</h1>
        <p className="text-sm text-brand-ink/70 mb-6">Connecte-toi à ton compte</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Mot de passe"
            type="password"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            required
          />

          {localError && (
            <p className="text-red-600 text-sm mb-4">{localError}</p>
          )}

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <p className="text-sm text-center mt-5 text-brand-ink/70">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-brand-orange font-semibold hover:underline">
            Créer un compte
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Login;
