/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palette extraite du logo MYKLAB
        'brand-brown': '#3B2110',   // titres, texte de marque fort
        'brand-amber': '#B8752A',   // secondaire, bordures actives
        'brand-orange': '#E8890C',  // accent principal (CTA, liens actifs)
        'brand-gold': '#F5A623',    // hover, highlights, badges
        'brand-cream': '#FDF6EC',   // fond principal (direction "chaleureuse")
        'brand-ink': '#1A1A1A',     // texte courant
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],   // titres, logo, boutons
        body: ['"Inter"', 'sans-serif'],         // texte courant
      },
    },
  },
  plugins: [],
};
