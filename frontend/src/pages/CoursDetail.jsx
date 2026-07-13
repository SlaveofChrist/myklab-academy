import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getCoursById } from '../api/cours.api';
import { inscrireCours, getProgression } from '../api/inscription.api';
import { marquerChapitreVu } from '../api/chapitre.api';
import Navbar from '../components/common/Navbar';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/cours/ProgressBar';
import ChapitreItem from '../components/cours/ChapitreItem';
import QuizSection from '../components/cours/QuizSection';

function CoursDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const estApprenant = user?.role === 'APPRENANT';

  const [cours, setCours] = useState(null);
  const [progression, setProgression] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chapitreEnCours, setChapitreEnCours] = useState(null); // id du chapitre en train d'être marqué

  // Chargement initial : détail du cours, puis inscription + progression si Apprenant
  useEffect(() => {
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const coursData = await getCoursById(id);
        setCours(coursData);

        if (estApprenant) {
          // On tente l'inscription à chaque visite : si déjà inscrit, le backend
          // renvoie une erreur 409 qu'on ignore silencieusement (comportement voulu).
          try {
            await inscrireCours(id);
          } catch (err) {
            if (err.response?.status !== 409) throw err;
          }

          const progressionData = await getProgression(id);
          setProgression(progressionData);
        }
      } catch (err) {
        setError("Impossible de charger ce cours");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id, estApprenant]);

  async function handleMarquerVu(chapitreId) {
    setChapitreEnCours(chapitreId);
    try {
      await marquerChapitreVu(chapitreId);
      const progressionData = await getProgression(id); // on rafraîchit après coup
      setProgression(progressionData);
    } catch (err) {
      // Erreur silencieuse volontaire : un échec ponctuel n'empêche pas de réessayer
    } finally {
      setChapitreEnCours(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <p className="p-8 text-brand-ink/60">Chargement du cours...</p>
      </div>
    );
  }

  if (error || !cours) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <p className="p-8 text-red-600">{error || "Cours introuvable"}</p>
      </div>
    );
  }

  const chapitresVusIds = progression?.chapitres_vus_ids || [];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="p-8 max-w-3xl mx-auto">
        <Badge categorie={cours.categorie} />
        <h1 className="text-3xl mt-3 mb-2">{cours.titre}</h1>
        <p className="text-brand-ink/70 mb-6">{cours.description}</p>

        {estApprenant && progression && (
          <div className="mb-8">
            <ProgressBar pourcentage={progression.pourcentage} />
          </div>
        )}

        <h2 className="text-xl mb-4">Chapitres</h2>
        <div className="space-y-3">
          {cours.chapitres.map((chapitre) => (
            <ChapitreItem
              key={chapitre.id_chap}
              chapitre={chapitre}
              estVu={chapitresVusIds.includes(chapitre.id_chap)}
              onMarquerVu={handleMarquerVu}
              loading={chapitreEnCours === chapitre.id_chap}
            />
          ))}
        </div>

        {estApprenant && cours.quiz && (
          <QuizSection quiz={cours.quiz} />
        )}
      </div>
    </div>
  );
}

export default CoursDetail;
