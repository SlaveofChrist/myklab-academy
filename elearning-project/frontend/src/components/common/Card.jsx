/**
 * Conteneur visuel réutilisable : fond blanc, coins arrondis, ombre légère,
 * bordure fine couleur marque. Sert de base pour CoursCard, formulaires, etc.
 *
 * Exemple d'usage :
 *   <Card className="p-6">contenu ici</Card>
 */
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-brand-amber/20 ${className}`}>
      {children}
    </div>
  );
}

export default Card;
