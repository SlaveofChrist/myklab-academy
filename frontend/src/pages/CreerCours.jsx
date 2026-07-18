import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCours } from '../api/cours.api';
import Navbar from '../components/common/Navbar';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const CATEGORIES = [
  { value: 'NUMERIQUE', label: 'Numérique & Innovation' },
  { value: 'ARTISANAT', label: 'Artisanat & Métiers techniques' },
  { value: 'AGRICULTURE', label: 'Agriculture & Agro-transformation' },
];

// Un chapitre vide "type", utilisé comme modèle quand on clique sur "+ Ajouter"
function nouveauChapitreVide(ordre) {
  return { titre: '', ordre_lecture: ordre, contenu_textuel: '' };
}

function CreerCours() {
  const navigate = useNavigate();

  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState('NUMERIQUE');
  const [prix, setPrix] = useState(0);
  const [urlVideo, setUrlVideo] = useState('');
  const [chapitres, setChapitres] = useState([nouveauChapitreVide(1)]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Met à jour un champ précis d'un chapitre précis dans le tableau,
  // sans toucher aux autres (immutabilité : on recrée un nouveau tableau)
  function updateChapitre(index, field, value) {
    setChapitres((prev) =>
      prev.map((chap, i) => (i === index ? { ...chap, [field]: value } : chap))
    );
  }

  function ajouterChapitre() {
    setChapitres((prev) => [...prev, nouveauChapitreVide(prev.length + 1)]);
  }

  function supprimerChapitre(index) {
    setChapitres((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cours = await createCours({
        titre,
        description,
        categorie,
        prix: Number(prix) || 0,
        url_video: urlVideo || null,
        chapitres: chapitres.filter((c) => c.titre.trim() !== ''), // ignore les chapitres laissés vides
      });
      navigate(`/cours/${cours.id_cours}`); // redirige vers le cours fraîchement créé
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création du cours");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl mb-6">Créer un nouveau cours</h1>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 mb-6">
            <Input label="Titre du cours" value={titre} onChange={(e) => setTitre(e.target.value)} required />

            <label className="block mb-4">
              <span className="block text-sm font-semibold text-brand-brown mb-1">Description</span>
              <textarea
                className="w-full px-4 py-2.5 rounded-lg border border-brand-amber/40 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>

            <label className="block mb-4">
              <span className="block text-sm font-semibold text-brand-brown mb-1">Catégorie</span>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-brand-amber/40 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Prix (€, 0 = gratuit)" type="number" min="0" value={prix} onChange={(e) => setPrix(e.target.value)} />
              <Input label="URL vidéo (optionnel)" value={urlVideo} onChange={(e) => setUrlVideo(e.target.value)} />
            </div>
          </Card>

          {/* --- Chapitres dynamiques --- */}
          <Card className="p-6 mb-6">
            <h2 className="text-lg mb-4">Chapitres</h2>

            <div className="space-y-4">
              {chapitres.map((chapitre, index) => (
                <div key={index} className="p-4 rounded-lg border border-brand-amber/20 bg-brand-cream/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-brand-ink/50">Chapitre {index + 1}</span>
                    {chapitres.length > 1 && (
                      <button
                        type="button"
                        onClick={() => supprimerChapitre(index)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>

                  <Input
                    label="Titre du chapitre"
                    value={chapitre.titre}
                    onChange={(e) => updateChapitre(index, 'titre', e.target.value)}
                  />
                  <label className="block">
                    <span className="block text-sm font-semibold text-brand-brown mb-1">Contenu (optionnel)</span>
                    <textarea
                      className="w-full px-4 py-2 rounded-lg border border-brand-amber/40 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white text-sm"
                      rows={2}
                      value={chapitre.contenu_textuel}
                      onChange={(e) => updateChapitre(index, 'contenu_textuel', e.target.value)}
                    />
                  </label>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={ajouterChapitre}
              className="mt-4 text-sm font-semibold text-brand-orange hover:underline"
            >
              + Ajouter un chapitre
            </button>
          </Card>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer le cours'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreerCours;
