import { useState } from 'react';
import { soumettreTentative } from '../../api/quiz.api';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * Affiche les questions d'un quiz avec choix multiple (radio),
 * gère la soumission et l'affichage du résultat.
 */
function QuizSection({ quiz }) {
  // reponses = { [id_quest]: "réponse choisie" }
  const [reponses, setReponses] = useState({});
  const [resultat, setResultat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la soumission du quiz");
    } finally {
      setLoading(false);
    }
  }

  const toutesRepondues = quiz.questions.every((q) => reponses[q.id_quest]);

  return (
    <Card className="p-6 mt-6">
      <h2 className="text-xl mb-1">{quiz.titre}</h2>
      <p className="text-sm text-brand-ink/60 mb-5">
        Score minimum pour réussir : {quiz.score_min_reussite}%
      </p>

      {resultat ? (
        // --- Affichage du résultat après soumission ---
        <div className={`p-4 rounded-lg ${resultat.est_reussi ? 'bg-brand-orange/10' : 'bg-red-50'}`}>
          <p className="font-display font-bold text-lg mb-1">
            {resultat.est_reussi ? '🎉 Quiz réussi !' : '❌ Quiz non réussi'}
          </p>
          <p className="text-sm text-brand-ink/70">
            Score obtenu : {resultat.score_obtenu}% ({resultat.nb_bonnes_reponses}/{resultat.total_questions} bonnes réponses)
          </p>
        </div>
      ) : (
        // --- Formulaire du quiz ---
        <div className="space-y-5">
          {quiz.questions.map((question, index) => (
            <div key={question.id_quest}>
              <p className="font-semibold text-brand-brown mb-2">
                {index + 1}. {question.enonce}
              </p>
              <div className="space-y-2">
                {question.options_reponses.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 text-sm cursor-pointer"
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
    </Card>
  );
}

export default QuizSection;
