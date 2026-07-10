import Button from './components/common/Button';
import Card from './components/common/Card';
import Badge from './components/common/Badge';

// Page temporaire — sera remplacée par le vrai routing à l'étape 3.
// Sert ici uniquement à visualiser le design system d'un coup d'œil.
function App() {
  return (
    <div className="min-h-screen p-10 space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold">MYKLAB</h1>
        <p className="text-brand-orange font-display text-sm tracking-wide uppercase">
          Laboratory of Knowledge
        </p>
        <p className="text-brand-ink font-semibold mt-2">Your Skills, Your Income</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl">Boutons</h2>
        <div className="flex gap-4">
          <Button variant="primary">Se connecter</Button>
          <Button variant="secondary">Annuler</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl">Badges de catégorie</h2>
        <div className="flex gap-3">
          <Badge categorie="NUMERIQUE" />
          <Badge categorie="ARTISANAT" />
          <Badge categorie="AGRICULTURE" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl">Card</h2>
        <Card className="p-6 max-w-sm">
          <Badge categorie="NUMERIQUE" />
          <h3 className="text-lg mt-3">Introduction au développement web</h3>
          <p className="text-sm text-brand-ink/70 mt-1">Les bases HTML/CSS/JS pour démarrer.</p>
        </Card>
      </section>
    </div>
  );
}

export default App;
