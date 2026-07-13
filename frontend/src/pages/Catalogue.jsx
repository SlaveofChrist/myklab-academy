import { useState, useEffect } from 'react';
import { getAllCours } from '../api/cours.api';
import Navbar from '../components/common/Navbar';
import CoursCard from '../components/cours/CoursCard';

const CATEGORIES = [
  { value: null, label: 'Tous les cours' },
  { value: 'NUMERIQUE', label: 'Numérique & Innovation' },
  { value: 'ARTISANAT', label: 'Artisanat & Métiers techniques' },
  { value: 'AGRICULTURE', label: 'Agriculture & Agro-transformation' },
];

function Catalogue() {
  const [coursList, setCoursList] = useState([]);
  const [categorieActive, setCategorieActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Se relance à chaque changement de filtre de catégorie
  useEffect(() => {
    async function fetchCours() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllCours(categorieActive);
        setCoursList(data);
      } catch (err) {
        setError("Impossible de charger le catalogue pour le moment");
      } finally {
        setLoading(false);
      }
    }
    fetchCours();
  }, [categorieActive]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="p-8">
        <h1 className="text-3xl mb-1">Catalogue des formations</h1>
        <p className="text-brand-ink/70 mb-6">
          Développe des compétences concrètes dans le Numérique, l'Artisanat ou l'Agriculture.
        </p>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-3 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setCategorieActive(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-display font-semibold border-2 transition-colors
                ${categorieActive === cat.value
                  ? 'bg-brand-orange text-white border-brand-orange'
                  : 'bg-white text-brand-brown border-brand-amber/30 hover:border-brand-orange'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* États : chargement / erreur / vide / résultats */}
        {loading && (
          <p className="text-brand-ink/60">Chargement des cours...</p>
        )}

        {!loading && error && (
          <p className="text-red-600">{error}</p>
        )}

        {!loading && !error && coursList.length === 0 && (
          <p className="text-brand-ink/60">Aucun cours disponible dans cette catégorie pour le moment.</p>
        )}

        {!loading && !error && coursList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {coursList.map((cours) => (
              <CoursCard key={cours.id_cours} cours={cours} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Catalogue;
