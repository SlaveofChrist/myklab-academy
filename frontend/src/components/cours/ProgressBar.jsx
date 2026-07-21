/**
 * Barre de progression simple.
 * Exemple : <ProgressBar pourcentage={40} />
 */
function ProgressBar({ pourcentage = 0 }) {

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-semibold text-brand-brown">Progression</span>
        <span className="text-brand-ink/70">{pourcentage}%</span>
      </div>
      <div className="w-full h-3 bg-brand-amber/15 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-orange transition-all duration-300"
          style={{ width: `${pourcentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
