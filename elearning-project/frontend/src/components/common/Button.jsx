/**
 * Bouton réutilisable.
 * variant="primary"   -> fond orange plein (action principale : "Se connecter", "S'inscrire")
 * variant="secondary" -> contour marron, fond transparent (action secondaire : "Annuler")
 *
 * Exemple d'usage :
 *   <Button variant="primary" onClick={handleSubmit}>Se connecter</Button>
 */
function Button({ variant = 'primary', children, className = '', ...props }) {
  const baseStyles = 'font-display font-semibold px-5 py-2.5 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-brand-orange text-white hover:bg-brand-gold',
    secondary: 'bg-transparent text-brand-brown border-2 border-brand-brown hover:bg-brand-brown hover:text-white',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
