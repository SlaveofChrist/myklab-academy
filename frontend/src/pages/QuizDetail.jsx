import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuizById } from '../api/quiz.api';
import Navbar from '../components/common/Navbar';
import QuizSection from '../components/cours/QuizSection';

function QuizDetail() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const quizData = await getQuizById(id);
        setQuiz(quizData);
      } catch (err) {
        setError("Impossible de charger ce quiz");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <p className="p-8 text-brand-ink/60">Chargement du quiz...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="p-8 max-w-3xl mx-auto">
          <p className="text-red-600 mb-4">{error || "Quiz introuvable"}</p>
          <Link to="/" className="text-sm font-semibold text-brand-orange hover:underline">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="p-8 max-w-3xl mx-auto">
        <Link
          to={quiz.cours_id ? `/cours/${quiz.cours_id}` : '/catalogue'}
          className="text-sm font-semibold text-brand-orange hover:underline mb-4 inline-block"
        >
          ← Retour au cours
        </Link>

        <h1 className="text-3xl mt-2 mb-2">{quiz.titre}</h1>
        <p className="text-brand-ink/70 mb-6">
          Score minimum requis : <span className="font-semibold text-brand-brown">{quiz.score_min_reussite}%</span>
          {quiz.temps_limite && (
            <span> · Temps limite : <span className="font-semibold text-brand-brown">{quiz.temps_limite} min</span></span>
          )}
        </p>

        {/* Section interactive du Quiz */}
        <QuizSection quiz={quiz} />
      </div>
    </div>
  );
}

export default QuizDetail;
