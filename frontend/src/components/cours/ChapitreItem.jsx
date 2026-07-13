import Button from '../common/Button';

/**
 * Affiche un chapitre. Si déjà vu, affiche un état visuel différent (coché, grisé)
 * plutôt que le bouton, pour donner un retour visuel clair de la progression.
 */
function ChapitreItem({ chapitre, estVu, onMarquerVu, loading }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${estVu ? 'bg-brand-orange/5 border-brand-orange/20' : 'bg-white border-brand-amber/20'}`}>
      <div>
        <p className="text-xs text-brand-ink/50 font-semibold">Chapitre {chapitre.ordre_lecture}</p>
        <p className="font-display font-semibold text-brand-brown">{chapitre.titre}</p>
      </div>

      {estVu ? (
        <span className="text-sm font-semibold text-brand-orange flex items-center gap-1">
          ✓ Vu
        </span>
      ) : (
        <Button
          variant="secondary"
          className="!px-4 !py-1.5 text-sm"
          onClick={() => onMarquerVu(chapitre.id_chap)}
          disabled={loading}
        >
          Marquer comme vu
        </Button>
      )}
    </div>
  );
}

export default ChapitreItem;
