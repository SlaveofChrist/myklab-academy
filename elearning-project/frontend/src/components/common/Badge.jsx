/**
 * Badge coloré pour une catégorie de cours.
 * Chaque catégorie a sa propre teinte, dérivée de la palette de marque
 * (pas de couleurs hors charte comme du bleu/vert générique).
 *
 * Exemple d'usage :
 *   <Badge categorie="NUMERIQUE" />
 */
const CATEGORIE_STYLES = {
  NUMERIQUE: { label: 'Numérique & Innovation', classes: 'bg-brand-orange/10 text-brand-orange border-brand-orange/30' },
  ARTISANAT: { label: 'Artisanat & Métiers techniques', classes: 'bg-brand-amber/10 text-brand-amber border-brand-amber/30' },
  AGRICULTURE: { label: 'Agriculture & Agro-transformation', classes: 'bg-brand-brown/10 text-brand-brown border-brand-brown/30' },
};

function Badge({ categorie }) {
  const style = CATEGORIE_STYLES[categorie];
  if (!style) return null;

  return (
    <span className={`inline-block text-xs font-semibold font-display px-3 py-1 rounded-full border ${style.classes}`}>
      {style.label}
    </span>
  );
}

export default Badge;
