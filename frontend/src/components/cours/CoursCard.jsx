import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * Affiche un cours sous forme de carte : catégorie, titre, description tronquée,
 * référent, prix. Le clic vers le détail sera branché à l'étape 5 (Suivre un module).
 */
function CoursCard({ cours }) {
  return (
    <Card className="p-5 flex flex-col h-full">
      <Badge categorie={cours.categorie} />

      <h3 className="text-lg mt-3 line-clamp-2">{cours.titre}</h3>

      <p className="text-sm text-brand-ink/70 mt-2 line-clamp-3 flex-1">
        {cours.description}
      </p>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-brand-amber/10">
        <span className="text-xs text-brand-ink/60">
          Par {cours.referent?.nom || 'Référent inconnu'}
        </span>
        <span className="font-display font-bold text-brand-orange">
          {cours.prix > 0 ? `${cours.prix} €` : 'Gratuit'}
        </span>
      </div>
    </Card>
  );
}

export default CoursCard;
