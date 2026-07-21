import { useState, useEffect } from 'react';
import { soumettreTentative, getTentatives } from '../../api/quiz.api';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * Affiche les questions d'un quiz avec choix multiple (radio),
 * gère la soumission, l'affichage des résultats et l'historique des tentatives.
 */
function QuizSection({ quiz }) {
  const [reponses, setReponses] = useState({});
  const [resultat, setResultat] = useState(null);
  const [tentatives, setTentatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Chargement de l'historique des tentatives au montage
  useEffect(() => {
    async function loadTentatives() {
      try {
        const list = await getTentatives(quiz.id_quiz);
        setTentatives(list);
      } catch (err) {
        // Ignorer l'erreur si l'utilisateur n'est pas un apprenant
      }
    }
    if (quiz?.id_quiz) {
      loadTentatives();
    }
  }, [quiz?.id_quiz]);

  function handleSelect(id_quest, valeur) {
    setReponses((prev) => ({ ...prev, [id_quest]: valeur }));
  }

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const reponsesArray = Object.entries(reponses).map(([id_quest, reponse]) => ({
        id_quest: Number(id_quest),
        reponse,
      }));
      const data = await soumettreTentative(quiz.id_quiz, reponsesArray);
      setResultat(data);
      // Rafraîchir l'historique des tentatives
      const list = await getTentatives(quiz.id_quiz);
      setTentatives(list);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la soumission du quiz");
    } finally {
      setLoading(false);
    }
  }

  function handleReessayer() {
    setResultat(null);
    setReponses({});
    setError(null);
  }

  const MAX_TENTATIVES = 3;
  const limiteAtteinte = tentatives.length >= MAX_TENTATIVES;
  const toutesRepondues = quiz.questions?.every((q) => reponses[q.id_quest]);

  return (
    <Card className="p-6 mt-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl mb-1">{quiz.titre}</h2>
          <p className="text-sm text-brand-ink/60">
            Score minimum pour réussir : {quiz.score_min_reussite}%
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            limiteAtteinte
              ? 'bg-red-100 text-red-700'
              : 'bg-brand-amber/20 text-brand-brown'
          }`}
        >
          Tentatives : {tentatives.length} / {MAX_TENTATIVES}
        </span>
      </div>

      {resultat ? (
        // --- Affichage du résultat après soumission ---
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${resultat.est_reussi ? 'bg-brand-orange/10 border border-brand-orange/30' : 'bg-red-50 border border-red-200'}`}>
            <p className="font-display font-bold text-lg mb-1">
              {resultat.est_reussi ? '🎉 Quiz réussi !' : '❌ Quiz non réussi'}
            </p>
            <p className="text-sm text-brand-ink/70">
              Score obtenu : <span className="font-semibold">{resultat.score_obtenu}%</span> ({resultat.nb_bonnes_reponses}/{resultat.total_questions} bonnes réponses)
            </p>
          </div>

          {!limiteAtteinte ? (
            <Button variant="secondary" onClick={handleReessayer}>
              🔄 Réessayer le quiz ({tentatives.length}/{MAX_TENTATIVES})
            </Button>
          ) : (
            <p className="text-xs text-red-600 font-semibold mt-2">
              🚫 Nombre maximal de tentatives atteint (3/3).
            </p>
          )}
        </div>
      ) : limiteAtteinte ? (
        // --- Message lorsque la limite de 3 tentatives est atteinte ---
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-center">
          <p className="font-semibold text-red-700 mb-1">
            🚫 Limite de tentatives atteinte
          </p>
          <p className="text-sm text-red-600/80">
            Vous avez utilisé l&apos;ensemble de vos 3 tentatives pour ce quiz. Vous ne pouvez plus soumettre de nouvelles réponses.
          </p>

        </div>
      ) : (
        // --- Formulaire du quiz ---
        <div className="space-y-5">
          {quiz.questions?.map((question, index) => (
            <div key={question.id_quest} className="border-b border-brand-amber/10 pb-4 last:border-b-0">
              <p className="font-semibold text-brand-brown mb-2">
                {index + 1}. {question.enonce}
              </p>
              <div className="space-y-2">
                {question.options_reponses?.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:text-brand-orange transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${question.id_quest}`}
                      value={option}
                      checked={reponses[question.id_quest] === option}
                      onChange={() => handleSelect(question.id_quest, option)}
                      className="accent-brand-orange"
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!toutesRepondues || loading}
          >
            {loading ? 'Envoi...' : 'Valider mes réponses'}
          </Button>
        </div>
      )}


      {/* --- Historique des tentatives passées --- */}
      {tentatives.length > 0 && (
        <div className="mt-8 pt-6 border-t border-brand-amber/20">
          <h3 className="text-md font-semibold text-brand-brown mb-3">
            Historique de vos tentatives ({tentatives.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tentatives.map((t, idx) => (
              <div
                key={t.id_tentative || idx}
                className="flex justify-between items-center p-3 rounded-lg bg-brand-cream/40 border border-brand-amber/10 text-sm"
              >
                <div>
                  <span className="font-medium text-brand-brown">
                    Tentative #{tentatives.length - idx}
                  </span>
                  <span className="text-xs text-brand-ink/50 ml-2">
                    {new Date(t.date_passage).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{t.score_obtenu}%</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      t.est_reussi
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {t.est_reussi ? 'Réussi' : 'Échec'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export default QuizSection;

