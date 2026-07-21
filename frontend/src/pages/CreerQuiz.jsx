import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createQuiz } from '../api/quiz.api';
import { getAllCours } from '../api/cours.api';
import Navbar from '../components/common/Navbar';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

function nouvelleQuestionVide() {
  return {
    enonce: '',
    options: ['', ''],
    reponse_correcte: '',
  };
}

function CreerQuiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCoursId = searchParams.get('coursId') || '';

  const [coursList, setCoursList] = useState([]);
  const [coursId, setCoursId] = useState(initialCoursId);
  const [titre, setTitre] = useState('');
  const [scoreMinReussite, setScoreMinReussite] = useState(50);
  const [tempsLimite, setTempsLimite] = useState('');
  const [questions, setQuestions] = useState([nouvelleQuestionVide()]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCours() {
      try {
        const list = await getAllCours();
        setCoursList(list);
        if (!initialCoursId && list.length > 0) {
          setCoursId(list[0].id_cours);
        }
      } catch (err) {
        // Optionnel : gestion erreur de chargement
      }
    }
    fetchCours();
  }, [initialCoursId]);

  function updateQuestion(qIndex, field, value) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIndex ? { ...q, [field]: value } : q))
    );
  }

  function updateOption(qIndex, optIndex, value) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      })
    );
  }

  function ajouterOption(qIndex) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, options: [...q.options, ''] } : q
      )
    );
  }

  function supprimerOption(qIndex, optIndex) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex || q.options.length <= 2) return q;
        const newOptions = q.options.filter((_, idx) => idx !== optIndex);
        return { ...q, options: newOptions };
      })
    );
  }

  function ajouterQuestion() {
    setQuestions((prev) => [...prev, nouvelleQuestionVide()]);
  }

  function supprimerQuestion(index) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!coursId) {
      setError("Veuillez sélectionner un cours pour ce quiz.");
      return;
    }

    // Préparation des questions
    const formattedQuestions = questions
      .filter((q) => q.enonce.trim() !== '')
      .map((q) => {
        const filteredOptions = q.options.filter((opt) => opt.trim() !== '');
        return {
          enonce: q.enonce,
          options_reponses: filteredOptions,
          reponse_correcte: q.reponse_correcte || filteredOptions[0] || '',
        };
      });

    if (formattedQuestions.length === 0) {
      setError("Le quiz doit contenir au moins une question avec un énoncé.");
      return;
    }

    setLoading(true);
    try {
      const quiz = await createQuiz({
        titre,
        score_min_reussite: Number(scoreMinReussite) || 50,
        temps_limite: tempsLimite ? Number(tempsLimite) : null,
        cours_id: Number(coursId),
        questions: formattedQuestions,
      });
      navigate(`/quiz/${quiz.id_quiz}`);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création du quiz");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl mb-6">Créer un nouveau quiz</h1>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 mb-6">
            <label className="block mb-4">
              <span className="block text-sm font-semibold text-brand-brown mb-1">
                Cours associé
              </span>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-brand-amber/40 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
                value={coursId}
                onChange={(e) => setCoursId(e.target.value)}
                required
              >
                <option value="">-- Sélectionner un cours --</option>
                {coursList.map((c) => (
                  <option key={c.id_cours} value={c.id_cours}>
                    {c.titre}
                  </option>
                ))}
              </select>
            </label>

            <Input
              label="Titre du quiz"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Score min. de réussite (%)"
                type="number"
                min="0"
                max="100"
                value={scoreMinReussite}
                onChange={(e) => setScoreMinReussite(e.target.value)}
                required
              />
              <Input
                label="Temps limite en mn (optionnel)"
                type="number"
                min="1"
                value={tempsLimite}
                onChange={(e) => setTempsLimite(e.target.value)}
              />
            </div>
          </Card>

          {/* --- Questions dynamiques --- */}
          <Card className="p-6 mb-6">
            <h2 className="text-lg mb-4">Questions du quiz</h2>

            <div className="space-y-6">
              {questions.map((question, qIndex) => (
                <div
                  key={qIndex}
                  className="p-4 rounded-lg border border-brand-amber/20 bg-brand-cream/50"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-brand-ink/50">
                      Question {qIndex + 1}
                    </span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => supprimerQuestion(qIndex)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Supprimer la question
                      </button>
                    )}
                  </div>

                  <Input
                    label="Énoncé de la question"
                    value={question.enonce}
                    onChange={(e) => updateQuestion(qIndex, 'enonce', e.target.value)}
                    required
                  />

                  {/* Options de réponses */}
                  <div className="mt-4">
                    <span className="block text-sm font-semibold text-brand-brown mb-2">
                      Options de réponses
                    </span>
                    <div className="space-y-2 mb-3">
                      {question.options.map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`reponse-correcte-${qIndex}`}
                            checked={question.reponse_correcte === opt && opt !== ''}
                            onChange={() => updateQuestion(qIndex, 'reponse_correcte', opt)}
                            title="Cocher pour définir comme bonne réponse"
                            className="accent-brand-orange"
                          />
                          <input
                            type="text"
                            placeholder={`Option ${optIndex + 1}`}
                            className="flex-1 px-3 py-1.5 rounded-md border border-brand-amber/30 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                            value={opt}
                            onChange={(e) => {
                              updateOption(qIndex, optIndex, e.target.value);
                              if (question.reponse_correcte === opt) {
                                updateQuestion(qIndex, 'reponse_correcte', e.target.value);
                              }
                            }}
                            required
                          />
                          {question.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => supprimerOption(qIndex, optIndex)}
                              className="text-xs text-red-500 hover:underline px-1"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => ajouterOption(qIndex)}
                      className="text-xs font-semibold text-brand-orange hover:underline"
                    >
                      + Ajouter une option
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={ajouterQuestion}
              className="mt-4 text-sm font-semibold text-brand-orange hover:underline"
            >
              + Ajouter une question
            </button>
          </Card>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Création en cours...' : 'Créer le quiz'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreerQuiz;