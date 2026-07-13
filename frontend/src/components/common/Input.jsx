/**
 * Champ de formulaire réutilisable avec label.
 * Exemple d'usage :
 *   <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
 */
function Input({ label, className = '', ...props }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-semibold text-brand-brown mb-1">{label}</span>
      <input
        className={`w-full px-4 py-2.5 rounded-lg border border-brand-amber/40 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white ${className}`}
        {...props}
      />
    </label>
  );
}

export default Input;
